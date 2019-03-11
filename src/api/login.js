import request from '@/api/axios'
import { userInfo, tableData } from '@/mock/user'
import { menu, menuAll } from '@/mock/menu'
import urlCol from '@/common/urlCol'
/*用户名登录*/

export const loginByUsername = (username, password) => { // , code, randomStr) => {
//var grant_type = 'password'
//password="MTIzNDU2"
//var scope = 'server'
  return request({
    url: urlCol.login.login.url,
//  headers: {
//    'Authorization': 'Basic cGlnOnBpZw=='
//  },
    method: 'post',
    params: { username, password} //, randomStr, code, grant_type, scope }
  })
}
/*手机号登录*/
export function mobileLogin(mobile, code) {
  var grant_type = 'mobile'
  var scope = 'server'
  return request({
    url: '/auth/mobile/token',
    headers: {
      'Authorization': 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    params: { mobile, code, grant_type, scope }
  })
}

export const getUserInfo = (id) => {
  return request({
    url: urlCol.user.getUserById.url, //'/admin/user/info',
    method: 'get',
    params: {id}
  })
}

export const logout = () => {//(accesstoken, refreshToken) => {
  return request({
    url: urlCol.login.logout.url,//'/auth/authentication/removeToken',
    method: 'get'
//  ,
//  params: { accesstoken, refreshToken }
  })
}
