import axios from 'axios'

import { message } from 'antd';




axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'http://123.57.22.30:5000//api'

axios.interceptors.request.use(function(config) {
    const token = window.localStorage.getItem('myblog-token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, function (error) {
    return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
   
    return response
}, function(error) {
    switch (error.response && error.response.status) {
        case 401: 
            //清除token 以及认证状态
            //？？
            //跳转到登陆页面
            //message.info("401: 认证已经失效，请先登陆")
            window.localStorage.removeItem('myblog-token')
            //navigate('/login')
            break;
        case 404:
            message.info("404: NOT FOUND")
            //回退
            break;
    }
    return Promise.reject(error)
})

export default axios