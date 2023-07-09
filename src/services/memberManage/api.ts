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

/** 获取会员列表 */
export async function getMemberList(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/list', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 查询会员信息 */
export async function getTenantInfo(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/getTenantInfo', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 修改会员状态 */
export async function updateStatus(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/updateStatus', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 重置会员密码 */
export async function resetPassword(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/resetPassword', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}