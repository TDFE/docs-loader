/**
 * @Author: Zhengfeng.Yao <yzf>
 * @Date:   2017-06-08 14:35:00
 * @Last modified by:   yzf
 * @Last modified time: 2017-06-08 14:35:17
 */

import React from 'react';
import SublimeVideo from 'react-sublime-video';

export default function VideoPlayer({ video }) {
 const { alt, description, src } = video;
 const videoClassName = video.class;

 return (
   <div className={`preview-image-box ${videoClassName}`}>
     <div className={'preview-image-wrapper'}>
       <SublimeVideo src={src} type="video/mp4" loop/>
     </div>
     <div className="preview-image-title">{alt}</div>
     <div className="preview-image-description"
       dangerouslySetInnerHTML={{ __html: description }}
     />
   </div>
 );
}
