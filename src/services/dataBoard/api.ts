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

/** 获取租户列表 */
export async function getTenantList(options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantData/tenant/list', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取租户数据 */
export async function getTenantData(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantData/info', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
