import axios from 'axios'

let base = 'http://test.earthktv.com/admin';

axios.defaults.withCredentials = true;

export const getUserList = params => {return axios.get(`${base}/user/list`, {params: params}).then(result => result.data)};
export const checkUname = params => {return axios.get(`${base}/user/check`, {params: params}).then(result => result.data)};
export const modifyUserPwd = params => {return axios.post(`${base}/user/pwd`, params).then(result => result.data)};
export const editUser = params => {return axios.post(`${base}/user/edit`, params).then(result => result.data)};
export const checkUser = params => {return axios.post(`${base}/user/check`, params).then(result => result.data)};
export const listGroup = () => {return axios.get(`${base}/user/grouplist`).then(result => result.data)};

export const listRole = () => {return axios.get(`${base}/role/list`).then(result => result.data)};
export const editRole = params => {return axios.post(`${base}/role/edit`, params).then(result => result.data)};