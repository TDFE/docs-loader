/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-12 16:15:46
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-12 16:15:47
 */

import React from 'react';
import { Link } from 'react-router';
import toReactElement from 'jsonml-to-react-element';
import JsonML from 'jsonml.js/lib/utils';

function isHeading(node) {
  return /h[1-6]/i.test(JsonML.getTagName(node));
}

function isZhCN(pathname) {
  return /-cn\/?$/.test(pathname);
}

function makeSureComonentsLink(pathname) {
  const pathSnippets = pathname.split('#');
  if (pathSnippets[0].indexOf('/components') > -1 && !pathSnippets[0].endsWith('/')) {
    pathSnippets[0] = `${pathSnippets[0]}/`;
  }
  return pathSnippets.join('#');
}

function toZhCNPathname(pathname) {
  const pathSnippets = pathname.split('#');
  pathSnippets[0] = `${pathSnippets[0].replace(/\/$/, '')}-cn`;
  return makeSureComonentsLink(pathSnippets.join('#'));
}

function generateSluggedId(children) {
  const headingText = children.map((node) => {
    if (JsonML.isElement(node)) {
      if (JsonML.hasAttributes(node)) {
        return node[2] || '';
      }
      return node[1] || '';
    }
    return node;
  }).join('');
  const sluggedId = headingText.trim().replace(/\s+/g, '-');
  return sluggedId;
}

module.exports = (_, props) => ({
  converters: [
    [node => JsonML.isElement(node) && isHeading(node), (node, index) => {
      const children = JsonML.getChildren(node);
      const sluggedId = generateSluggedId(children);
      return React.createElement(JsonML.getTagName(node), {
        key: index,
        id: sluggedId,
        ...JsonML.getAttributes(node)
      }, [
        <span key="title">{children.map(child => toReactElement(child))}</span>,
        <a href={`#{sluggedId}`} className="anchor" key="anchor">#</a>
      ]);
    }],
    [node => JsonML.isElement(node) && JsonML.getTagName(node) === 'a' && !(
      JsonML.getAttributes(node).class ||
        (JsonML.getAttributes(node).href &&
         JsonML.getAttributes(node).href.indexOf('http') === 0) ||
        /^#/.test(JsonML.getAttributes(node).href)
     ), (node, index) => {
       const href = JsonML.getAttributes(node).href;
       return (
         <Link
           to={isZhCN(props.location.pathname) ? toZhCNPathname(href) : makeSureComonentsLink(href)}
           key={index}
         >
           {toReactElement(JsonML.getChildren(node)[0])}
         </Link>
       );
     }]
  ],
});
