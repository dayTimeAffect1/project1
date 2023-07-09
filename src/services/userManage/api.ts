// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

const createFromData = (data: any) => {
  const formData = []
  for (const key in data){
    if (data[key] === undefined) continue;
    formData.push(`${key}=${encodeURIComponent(data[key])}`)
  }
  return formData.join("&")
}

/** 获取管理员列表 */
export async function getUserList(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/list', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 新建管理员信息 */
export async function create(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/create', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 查询管理员信息 */
export async function getTenantInfo(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/getTenantInfo', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 修改管理员信息 */
export async function update(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/update', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 修改管理员状态 */
export async function updateStatus(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/updateStatus', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 重置管理员密码 */
export async function resetPassword(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/resetPassword', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 删除管理员 */
export async function removeUser(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/delete', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}