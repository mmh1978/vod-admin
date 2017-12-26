import axios from 'axios'

let base = 'http://test.earthktv.com/admin';

export const login = params => {return axios.post(`${base}/user/login`, params).then(result => result.data)};

export const logout = params => {return axios.post(`${base}/user/logout`, params).then(result => result.data)};

export const menuList = params => {return axios.get(`${base}/sidebar/list`, {params: params}).then(result => result.data)};

export const getProductList = () => {return axios.get(`${base}/product/list`).then(result => result.data)};

export const getRegionList = params => {return axios.get(`${base}/area/list`, {params: params}).then(result => result.data)};

export const getQnToken = () => {return axios.get(`${base}/qn/get_qn_token`).then(result => result.data)};