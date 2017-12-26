import axios from 'axios'

let base = 'http://test.earthktv.com/admin';

export const getFeedBackList = params => {return axios.get(`${base}/opinion/list`, {params: params}).then(result => result.data)};