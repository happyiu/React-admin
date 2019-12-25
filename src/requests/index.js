import axios from 'axios'

import { message } from 'antd'

const isDev = process.env.NODE_ENV === 'development'

const service = axios.create({
  baseURL: isDev ? 'http://rap2api.taobao.org/app/mock/240723': ''
})

service.interceptors.request.use((config) => {
  config.data = Object.assign({},config.data,{
    // authToken: window.localStorage.getItem('autoToken')
    authToken: 'asdjhfsdjkh'
  })
  return config
})

service.interceptors.response.use((resp) => {
  if(resp.data.code === 200){
    return resp.data.data
  } else{
    // 处理全局错误
    message.error(resp.data.errMsg)
  }
})

// 获取文章列表
export const getArticles = (offset=0,limited=10) => {
  return service.post('/api/v1/articlelist',{
    offset,
    limited
  })
}

// 通过id删除文章
export const deleteArticle = (id) => {
  return service.post(`/api/v1/articlDdelete/${id}`)
}

// 通过id获取文章
export const getArticle = (id) => {
  return service.post(`/api/v1/article/${id}`)
}

// 保存文章
export const updateArticle = (id,data) => {
  return service.post(`/api/v1/updateArticle/${id}`,data)
}

// 获取 文章阅读量
export const getArticleAmount = () => {
  return service.post('/api/v1/articleAmount')
}

// 获取通知列表 
export const getNotifications = () => {
  return service.post('/api/v1/notifications')
}