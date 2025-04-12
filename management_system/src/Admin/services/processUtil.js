import {get, post, del} from '../utils/request'
import { getToken } from '../utils/tool';

// 根据token获取数据
export const loadByTokenAPI = () => 
    get('/profile/get', null, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

// 获取特定用户奖惩信息
export const ByTokenAPI = () => 
    get('/profile/pnp/get', null, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

// 获取所有用户信息
export const getAllUsersAPI = (params) => 
  get('/profile/getAll', {params});

// 获取用户奖惩信息
export const getUserRewardsAPI = (username, params) => 
  get(`/profile/pnp/get?username=${username}`, {params}, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

// 新增奖惩
export const addRewardAPI = (data) => 
  post('/profile/pnp/add', data, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

// 更新奖惩
export const updateRewardAPI = (data) => 
  post('/profile/pnp/update', data, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

// 删除奖惩
export const deleteRewardAPI = (id) => 
  post(`/profile/pnp/delete/${id}`, null, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });