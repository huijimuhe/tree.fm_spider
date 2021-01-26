const cheerio = require('cheerio');
const fs = require('fs');

const util = require('./util');
const setting = require('./setting');

const dataDir = __dirname + '/data/movieData-';
const dataErrDir = __dirname + '/data/movieDataErr-';
const imgPrefix = 'banner-';

// 根据网站api得到相应的url和参数
const reqUrl = 'https://tree.fm/forest/';
const reqParams = {};

let i = 1;
// 启动时直接执行代码 
(function spider() {
	getData(i);
})();

// 获取sound和banner的方法
function getData(pageIndex) {
	console.log('fetch:' + reqUrl + i)
	return util.fetch_data_get(reqUrl + pageIndex, reqParams)
		.then((result) => {
			// 根据页面结构获取总的页数，然后再分页获取数据
			let $ = cheerio.load(result.text);
			let target=$('meta[name="description"]').attr('content'); 
			let banner = $('.bgimage').attr('style');
			let reg = /https\:\/\/[\'\"]?([^\'\"]*)/i;
			banner = reg.exec(banner);
			let sound = $('audio source').attr('src');
			console.log('开始提取:',target, banner[0], sound);
			util.downloadImg([sound, banner[0]],target);
			console.log('解析成功:');
		}).then((res) => {
			i++;
			if (i < 40) {
				getData(i);
			} else {
				console.log('采集完毕');
			}
		})
		.catch((err) => {
			console.log('获取链接失败：', err);
		});
}