import axios from 'axios'

let base = 'http://test.earthktv.com/admin';

export const getMediaRankList = params => {return axios.post(`${base}/media/rank`, params).then(result => result.data)};
export const getActorRankList = params => {return axios.post(`${base}/actor/rank`, params).then(result => result.data)};
export const getDownRankList = params => {return axios.post(`${base}/down/rank`, params).then(result => result.data)};