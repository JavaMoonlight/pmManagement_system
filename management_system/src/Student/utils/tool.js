// 配置请求的服务器地址
export const serverUrl = 'http://47.102.45.169:8080';

// 设置token
export const setToken = (token) => sessionStorage.setItem('token', token);

//获取token
export const getToken = () => sessionStorage.getItem('token');