import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { history } from "umi"

// 与后端约定的响应数据格式
interface ResponseStructure {
  status?: string | number;
  message?: string;
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: () => {},
    // 错误接收及处理
    errorHandler: (error) => {
      // @ts-ignore
      if (error.code === 'ERR_NETWORK'){
        message.error("网络好像有点问题，请检查后重试")
      }else {
        message.error("服务器开小差，请稍后重试")
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const url = config?.url?.concat('');
      const headers = Object.assign({}, config.headers, {
      })
      return { ...config, url, headers };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      if (response.headers['content-type'].indexOf('application/octet-stream') > -1) {
        return response
      }
      if (response.headers['content-type'].indexOf('image/') > -1 || response.headers['content-type'].indexOf('ms-excel') > -1) {
        return response
      }
      const { data } = response as unknown as ResponseStructure;
      if (data?.status === 403 && !['#/user/login', '#/user/findPassword'].includes(window.location.hash.split('?')[0])){
        history.replace(`/user/login?redirect=${encodeURIComponent(location.href)}`)
      }
      // @ts-ignore
      if (response.config.noShowMessage){
        return response;
      }
      if (data?.status !== 0) {
        message.error(data.message || '请求失败！');
      }
      return response;
    },
  ],
};
