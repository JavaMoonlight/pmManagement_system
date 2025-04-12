import {get, post, del} from '../utils/request'

// 获取数据
export const loadDataAPI = (query) => get('/announcement/get', query);

// 根据页面和数据获取数据
// export const loadDataByIdAPI = (pageNum, size) => get('/announcement/get/' + pageNum + '/' + size);
export const loadDataByIdAPI = (pageNum, size) => 
    get(`/announcement/get/${pageNum}/${size}`);

// 新增数据
export const insertAPI = (data) => post('/announcement/add', data)

// 修改数据
export const updateByIdAPI = (id, data) => post('/announcement/update/' + id, data)

// 删除数据 
export const delByIdAPI = (id) => del('/announcement/delete/'+ id)