import axios from 'axios'

let base = 'http://test.earthktv.com/admin';

export const getProductList = () => {return axios.get(`${base}/product/list`).then(result => result.data)};

export const getRegionList = params => {return axios.get(`${base}/area/list`, {params: params}).then(result => result.data)};

export const getMealList = params => {return axios.get(`${base}/meal/list`, {params: params}).then(result => result.data)};

export const editMeal = params => {return axios.post(`${base}/meal/edit`, params).then(result => result.data)};

export const getUserMealList = params => {return axios.get(`${base}/voduser/meallist`, {params: params}).then(result => result.data)};

export const getUserMealListDetail = params => {return axios.get(`${base}/voduser/getmeallist`, {params: params}).then(result => result.data)};

export const addUserMeal = params => {return axios.post(`${base}/voduser/addmeal`, params).then(result => result.data)};

export const editUserMealTotal = params => {return axios.post(`${base}/voduser/edit/total`, params).then(result => result.data)};

export const delUserMeal = params => {return axios.post(`${base}/voduser/delmeal`, params).then(result => result.data)};

export const changeUserMeal = params => {return axios.post(`${base}/voduser/changemeal`, params).then(result => result.data)};

export const getCDKeyList = params => {return axios.get(`${base}/activate/list`, {params: params}).then(result => result.data)};

export const generateCode = params => {return axios.post(`${base}/generate/code`, params).then(result => result.data)};

export const getTradeList = params => {return axios.get(`${base}/trade/list`, {params: params}).then(result => result.data)};