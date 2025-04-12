import {get, post, del} from '../utils/request'

// 根据用户名列出用户上传的文件
export const loadDataByUserNameAPI = (data) => 
    get('/profile/files/username', data);

// 文件下载
export const loadDataByIdAPI = (filename) => 
    get(`/profile/download/${filename}`);

// 文件上传
export const insertAPI = (data) => post('/profile/upload', data)

// 文件删除 
export const delByIdAPI = (data) => del('/profile/files/delete', data)
