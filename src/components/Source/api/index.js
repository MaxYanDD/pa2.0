/*
 * @Author: lijing
 * @Date: 2019-07-08 16:05:44
 * @LastEditTime: 2019-07-10 15:17:29
 * @LastEditors: lijing
 * @Description:资源组件接口
 */
import request from '@/utils/request'

/**
 * @description: 菜单信息
 * @param {type} {type}
 * @return:
 */
export function sourceMenu() {
  return request({
    url: '/source/menu',
    method: 'post'
  })
}

/**
 * @description: 资源列表
 * @param {dir} {String or Number} 所请求目录的id
 * @param {page} {Number} 请求的页码
 * @param {category} {String} 请求的类型
 * @return:
 */
export function sourceList({
  category = 'images',
  dir = 'all',
  page = 1,
  pagesize = 30,
  limit = 30
}={}) {

  return request({
    url: '/source/list',
    method: 'post',
    params: {
      category: category,
      dir: dir,
      page:page,
      pagesize: pagesize,
      limit: limit
    }
  })
}

export function sourceMkdir(dirID, name) {
  return request({
    url: '/source/mkdir',
    method: 'post',
    params:{
      dir:dirID,
      name:name
    }
  })
}

export function imgDelete(id){
  console.log('id----',id)
  return request({
    url:'/source/delete',
    method:'post',
    params:{
      id:id
    }
  })
}
