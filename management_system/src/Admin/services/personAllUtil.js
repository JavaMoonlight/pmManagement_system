import {get, post, del, put} from '../utils/request'
import { getToken } from '../utils/tool';

// 获取所有用户信息
export const getAllPerson = (params) => 
    get('/profile/list', { params });

// 新增数据 
export const insertAPI = (data) => post('/profile/add', data, {
  headers: {
    Authorization: `Bearer ${getToken()}` // 添加鉴权头
  }
});

// 修改用户权限
export const putAPI = (data) => post('/profile/update', data, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

// 删除用户数据
export const delUserAPI = (usernames) => del('/auth/delete', {
  data: usernames, // 传递用户名数组
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`
  }
});