import React, {useState} from 'react';
import { PageContainer, ProForm, ProFormText, ProFormDigit, FooterToolbar } from '@ant-design/pro-components';
import { validationPsw } from '@/utils';
import {Form, message} from "antd"
import FunctionCardGroup from "./components/FunctionCardGroup"
import {history, useParams} from "umi"
import {create, getTenantInfo, update} from "@/services/userManage/api";
import moment from "moment";
const createApplicationData = (data: any) => {
  const { applicationId, expDate, functionList, status, name } = data
  return ({
    title: name, name,
    status,
    id: applicationId,
    expDate: {
      check: expDate ? 0 : 1,
      time: expDate ? moment(expDate).format("YYYY-MM-DD") : ''
    },
    functionList: functionList.map(({funcId, funcCode, funcName, funcType, funcParentId}: any) => `${funcId}~${funcCode}~${funcName}~${funcType}~${funcParentId}`),
    open: true,
  })
}
const TenementHandle: React.FC = () => {
  const [appList, setAppList] = useState<any[]>([])
  const params = useParams<{type: string, id: string}>();
  return (
    <PageContainer header={{title: ""}}>
      <ProForm
        onFinish={async (values) => {
          const { applicationList, name, code, accountLimit, realName, username, password, companyPhone, email, logo } = values
          if (applicationList.length === 0){
            return message.error("请开通应用")
          }
          const applicationListStr = JSON.stringify(applicationList.map((v: any) => {
            return ({
              applicationId: v.id,
              expDate: v.expDate?.check === 1 ? "" : moment(`${v.expDate?.time} 23:59:59`).format('x'),
              functionList: (v.functionList || []).map((f: string) => {
                const [funcId, funcCode, funcName, funcType , funcParentId] = f.split('~')
                return ({ funcId, funcName, funcCode, funcType, funcParentId: funcParentId === 'null' ? null : funcParentId})
              }).filter((item: any) => item.funcCode)
            })
          }))
          const api = params.type === 'add' ? create : update
          const info = {name, code, accountLimit, realName, username, password, companyPhone, email, applicationListStr, logo }
          if (params.type === 'edit') { // @ts-ignore
            info.id = params.id
          }
          const res = await api(info)
          if (res.status === 0){
            message.success(params.type === 'add' ? "创建成功！" : "修改成功！")
            if (params.type === 'edit'){
              window.sessionStorage.setItem('useTenementSearchHistory', 'true')
              return history.replace('/tenement')
            }
            return history.back()
          }
        }}
        submitter={{
          searchConfig: {
            resetText: "返回"
          },
          onReset: () => {
            if (params.type === 'edit'){
              window.sessionStorage.setItem('useTenementSearchHistory', 'true')
              return history.replace('/tenement')
            }
            return history.back()
          },
          render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
        }}
        request={async (): Promise<any> => {
          const {type, id} = params

          if (type === 'add') {

            return ({
              applicationList: []
            })
          }
          const details = await getTenantInfo({id})
          const {name, code, accountLimit, realName, username, companyPhone, email, applicationList = [], logo} = details.data

          return ({
            name, code, accountLimit, realName, username, companyPhone, email, logo, applicationList: applicationList.map((v: any) => createApplicationData(v))
          })
        }}
      >
        <ProForm.Group title="租户基础信息">
          <ProFormText
            width="xl"
            fieldProps={{maxLength: 50}}
            label="租户名称"
            name="name"
            placeholder={"请输入，最多50个字"}
            rules={[
              {
                required: true,
                message: "请输入租户名称!",
              },
            ]}
          />
          <ProFormText
            width="xl"
            fieldProps={{maxLength: 10, disabled: params.type === 'edit'}}
            label="租户标识"
            name="code"
            placeholder={"用于区分租户，仅支持英文、数字，最多10个字，保存后不可修改"}
            rules={[
              {
                required: true,
                message: "请输入租户标识!",
              },
              {
                pattern: /^[0-9a-zA-Z]+$/,
                message: '租户标识格式错误！',
              },
            ]}
          />
          <ProFormDigit
            width="xl"
            fieldProps={{maxLength: 10, disabled: params.type === 'edit'}}
            label="租户账号数量"
            name="accountLimit"
            placeholder={"请输入限制的账号数量，保存后不允许修改"}
            rules={[
              {
                required: true,
                message: "请输入租户账号数量!",
              },
            ]}
          />
          <ProFormText
            width="xl"
            fieldProps={{maxLength: 10}}
            label="租户管理员真实姓名"
            name="realName"
            placeholder={"请输入，最多10个字"}
            rules={[
              {
                required: true,
                message: "请输入真实姓名!",
              },
            ]}
          />
          <ProFormText
            width="xl"
            fieldProps={{maxLength: 50}}
            label="租户管理员账号名"
            name="username"
            placeholder={"请输入，最多50个字"}
            rules={[
              {
                required: true,
                message: "请输入账号名!",
              },
            ]}
          />
          { params.type === 'add' &&
            <ProFormText.Password
              fieldProps={{
                autoComplete: "new-password"
              }}
              width="xl"
              label="租户管理员密码"
              name="password"
              placeholder={"8-20位,必须包含字母、数字和特殊字符(不包括空格)"}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
                {
                  validator: (_, value) =>{
                    const res = validationPsw(value)
                    return res ? Promise.reject(new Error(res)) : Promise.resolve()
                  }
                },
              ]}
            />
          }
          <ProFormText
            width="xl"
            fieldProps={{ maxLength: 11 }}
            label="租户管理员手机号"
            name="companyPhone"
            placeholder={'请输入11位手机号'}
            rules={[
              {
                required: true,
                message: '请输入11位手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <ProFormText
            width="xl"
            fieldProps={{ maxLength: 50 }}
            label="邮箱"
            name="email"
            placeholder={"请输入正确的邮箱"}
            rules={[
              {
                required: true,
                message: '请输入邮箱！',
              },
              {
                pattern: /@/,
                message: '邮箱格式不正确！',
              },
            ]}
          />
        </ProForm.Group>
        <ProForm.Group title="租户开通应用">
          <div>
            <Form.Item
              name="applicationList"
            >
              <FunctionCardGroup appList={appList} />
            </Form.Item>
          </div>
        </ProForm.Group>
      </ProForm>
    </PageContainer>
  )
}
export default TenementHandle
