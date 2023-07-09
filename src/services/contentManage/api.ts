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

/** 获取文章列表 */
export async function getContentList(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/list', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 新建文章信息 */
export async function create(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/create', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 查询管理员信息 */
export async function getContentInfo(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/getTenantInfo', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 修改文章信息 */
export async function update(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/update', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 修改文章状态 */
export async function updateContentStatus(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/updateStatus', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}
/** 删除文章 */
export async function removeContent(body: any, options?: { [key: string]: any }) {
  return request<any>('/cms/tenant/tenantManage/delete', {
    method: 'POST',
    data: createFromData(body),
    ...(options || {}),
  });
}