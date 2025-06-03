import {get, post, del} from '../utils/request'
import { getToken } from '../utils/tool';

// 根据token获取数据
export const getByTokenAPI = () => 
    get('/profile/get', null, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

// 根据用户名列出用户上传的文件
export const loadDataByUserNameAPI = (params) => 
    get('/profile/files/username', {
      params: {
        username: params.username,
        pageNum: params.pageNum,
        pageSize: params.pageSize
      },
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

// 文件下载
export const loadDataByIdAPI = (filename) => 
    get(`/profile/download/${filename}`);

// 文件上传
export const insertAPI = (formData) => 
    post('/profile/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getToken()}`
      }
    });

// 文件删除 
export const delByIdAPI = (fileId) => 
    del('/profile/files/delete', {
      params: {
        fileId
      }
    });
