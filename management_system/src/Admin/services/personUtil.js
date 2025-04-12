import {get, post, del} from '../utils/request'
import { getToken } from '../utils/tool';

// 根据用户名获取数据
export const loadDataByUserNameAPI = (data) => 
    get('/announcement/get/', data);

// 根据token获取数据
export const loadProfileByTokenAPI = () => 
    get('/profile/get', null, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

//更新用户数据
export const updatePersonAPI = (data) => post('/profile/update', data);