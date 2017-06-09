/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-07 11:19:22
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-07 11:19:24
 */

import fs from 'fs';
import path from 'path';
import R from 'ramda';
import { escapeWinPath, toUriPath } from './escape-win-path';

const sourceLoaderPath = path.join(__dirname, 'source-loader');

function ensureToBeArray(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}

function isDirectory(filename) {
  return fs.statSync(filename).isDirectory();
}

const isValidFile = transformers => filename => transformers.some(({ test }) => eval(test).test(filename));

function findValidFiles(source, transformers) {
  return R.pipe(
    R.filter(R.either(isDirectory, isValidFile(transformers))),
    R.chain(filename => {
      if (isDirectory(filename)) {
        const subFiles = fs.readdirSync(filename)
          .map(subFile => path.join(filename, subFile));
          return findValidFiles(subFiles, transformers);
      }
      return [filename];
    })
  )(source);
}

const rxSep = new RegExp(`[${escapeWinPath(path.sep)}.]`);
function getPropPath(filename, sources) {
  return sources.reduce(
    (f, source) => f.replace(source, ''),
    filename.replace(new RegExp(`${path.extname(filename)}$`), ''),
  ).replace(/^\.?(?:\\|\/)+/, '').split(rxSep);
}

function filesToTreeStructure(files, sources) {
  const cleanedSources = sources.map(source => source.replace(/^\.?(?:\\|\/)/, ''));
  const filesTree = files.reduce((filesTree, filename) => {
    const propLens = R.lensPath(getPropPath(filename, cleanedSources));
    return R.set(propLens, filename, filesTree);
  }, {});
  return filesTree;
}

function stringifyObject({ nodePath, nodeValue, depth, ...rest }) {
  const indent = '  '.repeat(depth);
  const kvStrings = R.pipe(
    R.toPairs,
    R.map((kv) => {
      const valueString = stringify({
        ...rest,
        nodePath: `${nodePath}/${kv[0]}`,
        nodeValue: kv[1],
        depth: depth + 1,
      });
      return `${indent}  '${kv[0]}': ${valueString},`;
    }),
  )(nodeValue);
  return kvStrings.join('\n');
}

function lazyLoadWrapper({
  filePath,
  filename,
  isLazyLoadWrapper,
}) {
  const loaderString = isLazyLoadWrapper ? '' : `${sourceLoaderPath}!`;
  const content = `function () {
    return new Promise(function (resolve) {
      require.ensure([], function (require) {
          resolve(require('${escapeWinPath(loaderString)}${escapeWinPath(filePath)}'));
        }, '${toUriPath(filename)}');
    });
  }`;
  return content;
}

/**
 * 判断文件是否需要异步加载，通常带有jsx代码的md文件需要异步加载
 */
function shouldLazyLoad(nodePath, nodeValue, lazyLoad) {
  if (typeof lazyLoad === 'function') {
    console.log(`lazy: ${nodePath}, ${nodeValue}`);
    return lazyLoad(nodePath, nodeValue);
  }

  return typeof nodeValue === 'object' ? false : lazyLoad;
}

function stringify(params) {
  const {
    nodePath = '/',
    nodeValue,
    lazyLoad,
    depth = 0,
  } = params;
  const indent = '  '.repeat(depth);
  const shouldBeLazy = shouldLazyLoad(nodePath, nodeValue, lazyLoad);
  return R.cond([
    [n => typeof n === 'object', (obj) => {
      if (shouldBeLazy) {
        const fileDir = path.join(__dirname, '..', '..', 'tmp');
        if (!fs.existsSync(fileDir)) {
          fs.mkdirSync(fileDir);
        }
        const filePath = `${path.join(
          fileDir,
          nodePath.replace(/^\/+/, '').replace(/\//g, '-'),
        )}.index.js`;
        const fileInnerContent = stringifyObject({
          ...params,
          nodeValue: obj,
          lazyLoad: false,
          depth: 1,
        });
        const fileContent = `module.exports = {\n${fileInnerContent}\n}`;
        fs.writeFileSync(filePath, fileContent);
        return lazyLoadWrapper({
          filePath,
          filename: nodePath.replace(/^\/+/, ''),
          isLazyLoadWrapper: true,
        });
      }
      const objectKVString = stringifyObject({
        ...params,
        nodePath,
        depth,
        nodeValue: obj,
      });
      return `{\n${objectKVString}\n${indent}}`;
    }],
    [R.T, (filename) => {
      const filePath = path.isAbsolute(filename) ?
              filename : path.join(process.cwd(), filename);
      if (shouldBeLazy) {
        return lazyLoadWrapper({ filePath, filename });
      }
      return `require('${escapeWinPath(sourceLoaderPath)}!${escapeWinPath(filePath)}')`;
    }],
  ])(nodeValue);
}

/**
 * 生成md文件树
 * @param  {object} source            根目录
 * @param  {Array}  [transformers=[]] md->react转换器，此处用于校验格式
 * @return {[type]}                   文件树
 */
exports.generate = function generate(source, transformers = []) {
  if (source === null || source === undefined) {
    return {};
  }
  if (R.is(Object, source) && !Array.isArray(source)) {
    return R.mapObjIndexed(value => generate(value, transformers), source);
  }
  const sources = ensureToBeArray(source);
  const validFiles = findValidFiles(sources, transformers);
  const filesTree = filesToTreeStructure(validFiles, sources);
  return filesTree;
}

/**
 * 将编译结果转为loader需要的字符串类型
 */
exports.stringify = (
  filesTree,
  options = {}, /* { lazyLoad } */
) => stringify({ nodeValue: filesTree, ...options });

/**
 * 递归文件树，编译md文件
 */
exports.traverse = function traverse(filesTree, fn) {
  Object.keys(filesTree).forEach((key) => {
    const value = filesTree[key];
    if (typeof value === 'string') {
      fn(value);
      return;
    }

    traverse(value, fn);
  });
};

/**
 * 编译md文件
 * @param  {String} filename          文件名
 * @param  {String} fileContent       文件内容
 * @param  {Array} plugins            编译所需插件列表
 * @param  {Array}  [transformers=[]] loaders
 * @return {String}                   编译结果
 */
exports.process = (
  filename,
  fileContent,
  plugins,
  transformers = []
) => {
  let transformerIndex = -1;
  transformers.some(({ test }, index) => {
    transformerIndex = index;
    return eval(test).test(filename);
  });
  const transformer = transformers[transformerIndex];

  const markdown = require(transformer.use)(filename, fileContent);
  const parsedMarkdown = plugins.reduce(
    (markdownData, plugin) =>
      require(plugin[0])(markdownData, plugin[1]),
    markdown,
  );
  return parsedMarkdown;
};
