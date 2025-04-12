import {post} from '../utils/request'

// 管理后台登录接口
export const loginAPI = (data) => post('/auth/login', data);