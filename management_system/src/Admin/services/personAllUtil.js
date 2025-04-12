import {get, post, del, put} from '../utils/request'
import { getToken } from '../utils/tool';

// 获取所有用户信息
export const getAllPerson = (params) => 
    get('/profile/getAll', { params });

// 新增数据 
export const insertAPI = (data) => post('/profile/add', data)

// 修改用户权限
export const putAPI = (data) => post('/profile/update', data, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

// 删除用户数据
export const delUserAPI = (data) => del('/auth/delete', {
    data,
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
