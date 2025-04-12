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
// export const updateByIdAPI = (data) => post('/announcement/update', data)
export const updateByIdAPI = (data) => post('/announcement/update', data, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // 从本地存储获取token
      'Content-Type': 'application/json'
    }
  });

// 删除数据 
// export const delByIdAPI = (id) => post(`/announcement/delete/${id}`, id)
export const delByIdAPI = (id) => post(
  `/announcement/delete/${id}`,
  null, // 必须的空请求体占位
  {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  }
);