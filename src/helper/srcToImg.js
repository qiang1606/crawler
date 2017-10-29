/*
* @Author: GUOQIANG
* @Date:   2017-10-29 16:09:34
* @Last Modified by:   GUOQIANG
* @Last Modified time: 2017-10-29 16:37:40
*/
const fs=require('fs');
const http=require('http');
const https=require('https');
const path=require('path');

const {promisify}=require('util');
const writeFile=promisify(fs.writeFile);

module.exports=async (src,dir)=>{
    // 判断是base64还是url
    if(/\.(jpg|png|gif)$/.test(src)){
        await urlToImg(src,dir);
    }else{
        await base64ToImg(src,dir);
    }
}
// url=>image
const urlToImg=promisify((url,dir,callback)=>{
    const mod=/^https:/.test(url)?https:http;
    // 拓展名
    const ext=path.extname(url);
    // 文件名
    const file=path.join(dir,`${Date.now()}${parseInt(Math.random()*100)}${ext}`);

    mod.get(url,res=>{
        res.pipe(fs.createWriteStream(file))
        .on('finish',()=>{
            callback();
            console.log(file);
        })
    })
});

// base64=>image

const base64ToImg=async function (base64Str,dir) {
    // data:image/jpeg;base64,/9jhsjfds
    const matches=base64Str.match(/^data:(.+?);base64,(.+)$/);
    try {
        const ext=matches[1].split('/')[1].replace('jpeg','jpg');
        const file=path.join(dir,`${Date.now()}${parseInt(Math.random()*100)}.${ext}`);

        await writeFile(file,matches[2],'base64');
        console.log(file);
    } catch(e) {
        // statements
        console.log(e);
    }
};