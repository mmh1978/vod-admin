import axios from 'axios'

let base = 'http://test.earthktv.com/admin';

export const getVodList = params => {return axios.get(`${base}/voduser/list`, {params:params}).then(result => result.data)};

export const importVodInfo = params => {return axios.post(`${base}/vod/import/info`, params).then(result => result.data)};

export const editVodUser = params => {return axios.post(`${base}/voduser/edit`, params).then(result => result.data)};