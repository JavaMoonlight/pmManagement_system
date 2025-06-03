// 拦截器，同时用于存储token
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, serverUrl } from './tool'

const instance = axios.create({
    // baseURL: serverUrl,
    timeout: 5000,
    withCredentials: true
})

// 配置全局拦截
instance.interceptors.request.use(function (config) {
    // config.headers.token = getToken();
    const token = getToken();
    // console.log("getToken的值为："+token);
    if (token) {
        // config.headers.Authorization = `Bearer ${token}`;
        config.headers.Authorization = getToken();
    }
    NProgress.start();    //启动loading
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

instance.interceptors.response.use(function (response) {
    NProgress.done();
    return response;
  }, function (error) {
    NProgress.done();       //关闭loading
    return Promise.reject(error);
  });

export const get = (url, params={}) => 
    instance.get(url, params).then((res) => res.data);

export const post = (url, data={}) => 
    instance.post(url, data).then((res) => res.data);

export const put = (url, data={}) => 
    instance.put(url,data).then((res) => res.data);

export const patch = (url, data={}) => 
    instance.patch(url,data).then((res) => res.data);

export const del = (url,  config = {}) => 
    instance.delete(url, config).then((res) => res.data);