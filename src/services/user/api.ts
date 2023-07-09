// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

// 前期开发本地mock数据
const mock = true
const mockData = (data: any) => new Promise((resolve) => {
  resolve({
    "status": 0,
    "message": "成功",
    "data": data
  })
})

const createFromData = (data: any) => {
  const formData = []
  for (const key in data){
    formData.push(`${key}=${encodeURIComponent(data[key])}`)
  }
  return formData.join("&")
}

/** 获取当前的用户 */
export async function currentUser(options?: { [key: string]: any }) {
  if (mock){
    return mockData({
      "id": 1,
      "username": "admin",
    })
  }
  return request<any>('/cms/user/getUserInfo', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 退出登录接口 */
export async function outLogin(options?: { [key: string]: any }) {
  if (mock){
    return mockData({})
  }
  return request<Record<string, any>>('/cms/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 */
export async function login(body: USER.LoginParams, options?: { [key: string]: any }) {
  if (mock){
    return mockData({})
  }
  return request<any>('/cms/user/superAdmin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 修改用户信息接口 */
export async function update(body: any, options?: { [key: string]: any }) {
  if (mock){
    return mockData({})
  }
  return request<any>('/cms/tenant/superman/update', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 修改用户密码接口 */
export async function updatePassword(body: any, options?: { [key: string]: any }) {
  if (mock){
    return mockData({})
  }
  return request<any>('/cms/user/updateSuperPassword', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 找回用户密码接口 */
export async function retrievePassword(body: any, options?: { [key: string]: any }) {
  if (mock){
    return mockData({})
  }
  return request<any>('/cms/user/retrievePassword', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 获取图片验证码 */
export async function getImgVerifyCode(body: any, options?: { [key: string]: any }) {
  if (mock){
    return mockData({})
  }
  return request<any>('/cms/user/getImgVerifyCode', {
    method: 'POST',
    data: createFromData(body),
    responseType: 'blob',
    ...(options || {}),
  });
}

/** 获取手机验证码 */
export async function getPhoneCode(body: any, options?: { [key: string]: any }) {
  if (mock){
    return mockData({})
  }
  return request<any>('cms/user/getPhoneCode', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
