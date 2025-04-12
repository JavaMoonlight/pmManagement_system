import {get, post, del} from '../utils/request'
import { getToken } from '../utils/tool';

// 获取用户个人信息(通过用户名)
export const loadProfileByTokenAPI = () => 
    get('/profile/get', null, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

// 获取特定用户奖惩信息
export const ByTokenAPI = (params) => 
  get('/profile/pnp/get', {
    username: params.username,
    pageNum: params.pageNum || 1,    // 默认第一页
    pageSize: params.pageSize || 5   // 默认每页5条
  }, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });