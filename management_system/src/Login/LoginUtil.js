import {get, post, del, put} from '../Student/utils/request'

// 新增数据 
export const insertAPI = (data) => post('/profile/add', data)

// 修改用户权限
export const putAPI = (data) => put('/auth/update/role', data)