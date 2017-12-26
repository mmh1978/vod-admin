import axios from 'axios'

let base = 'http://test.earthktv.com/admin';

export const getSoftList = params => {return axios.get(`${base}/soft/list`, {params: params}).then(result => result.data)};
export const editSoft = params => {return axios.post(`${base}/soft/add`, params).then(result => result.data)};
export const publishSoft = params => {return axios.post(`${base}/status/program_info`, params).then(result => result.data)};


export const getThemeList = params => {return axios.get(`${base}/theme/list`, {params: params}).then(result => result.data)};
export const editTheme = params => {return axios.post(`${base}/theme/add`, params).then(result => result.data)};
export const publishTheme = params => {return axios.post(`${base}/status/theme`, params).then(result => result.data)};

export const getThemeInfoList = params => {return axios.get(`${base}/themeinfo/list`, {params: params}).then(result => result.data)};
export const editThemeInfo = params => {return axios.post(`${base}/themeinfo/add`, params).then(result => result.data)};
export const publishThemeInfo = params => {return axios.post(`${base}/status/theme_info`, params).then(result => result.data)};


export const getResList = params => {return axios.get(`${base}/res/list`, {params: params}).then(result => result.data)};
export const editRes = params => {return axios.post(`${base}/res/add`, params).then(result => result.data)};
export const getResTypeList = params => {return axios.get(`${base}/res/type`, {params: params}).then(result => result.data)};
export const publishRes = params => {return axios.post(`${base}/status/resource_info`, params).then(result => result.data)};