/*
* @Author: GUOQIANG
* @Date:   2017-10-29 16:09:01
* @Last Modified by:   GUOQIANG
* @Last Modified time: 2017-10-29 16:21:03
*/
const puppeteer = require('puppeteer');
const { img } = require('./config/default');
const srcToImg = require('./helper/srcToImg');

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // 定向网址
    await page.goto('https://image.baidu.com/');
    console.log('go to https://image.baidu.com/');

    await page.setViewport({
        width: 1920,
        height: 1080
    })
    console.log('reset viewport');

    // 把焦点放到输入框
    await page.focus('#kw');
    // 模拟输入
    await page.keyboard.sendCharacter('狗');
    // 模拟提交
    await page.click('.s_search');
    console.log('go to search list');
    page.on('load', async() => {
        console.log('page loading done');

        const srcs = await page.evaluate(() => {
            const images = document.querySelectorAll('img.main_img');
            return Array.prototype.map.call(images, img => img.src);
        });
        console.log(`get ${srcs.length} images,start download`);
        srcs.forEach(async (src) => {
            // sleep
            await page.waitFor(200);
            await srcToImg(src, img);
        });
        await browser.close();
    })

})();