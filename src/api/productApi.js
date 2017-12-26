import axios from 'axios'

let base = 'http://test.earthktv.com/admin';

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export const getStbTrend = params => {return axios.get(`${base}/product/stb/trend`, {params: params}).then(result => result.data)};
export const getStbLastTrend = () => {return axios.get(`${base}/product/stb/lasttrend`).then(result => result.data)};

export const getOpenTrend = params => {return axios.get(`${base}/product/open/trend`, {params: params}).then(result => result.data)};
export const getOpenStbList = params => {return axios.get(`${base}/product/open/stb/list`, {params: params}).then(result => result.data)};
export const getOpenStbDetail = params => {return axios.get(`${base}/product/open/stb/detail`, {params: params}).then(result => result.data)};
export const getOpenStbDayDetail = params => {return axios.get(`${base}/product/open/stb/day/detail`, {params: params}).then(result => result.data)};