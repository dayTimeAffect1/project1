import React, {useState} from 'react';
import { PageContainer, ProForm, ProFormText, ProFormTextArea, FooterToolbar } from '@ant-design/pro-components';
import {Form, message} from "antd"
import {history, useParams} from "umi"
import {create, getContentInfo, update} from "@/services/contentManage/api";

const ContentDetails: React.FC = () => {
  const params = useParams<{type: string, id: string}>();
  return (
    <PageContainer header={{title: ""}}>
      <ProForm
        onFinish={async (values) => {
          const { title, brief } = values
          const api = params.type === 'add' ? create : update
          const info = {title, brief }
          if (params.type === 'edit') { // @ts-ignore
            info.id = params.id
          }
          const res = await api(info)
          if (res.status === 0){
            message.success(params.type === 'add' ? "新建成功！" : "修改成功！")
            if (params.type === 'edit'){
              window.sessionStorage.setItem('useContentManageSearchHistory', 'true')
              return history.replace('/contentManage')
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
              window.sessionStorage.setItem('useContentManageSearchHistory', 'true')
              return history.replace('/contentManage')
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
          const details = await getContentInfo({id})
          const {title, brief} = details.data

          return ({
            title, brief,
          })
        }}
      >
        <ProForm.Group title="文章信息">
            <ProFormText
                fieldProps={{maxLength: 50}}
                label="标题"
                name="title"
                placeholder={"请输入，最多50个字"}
                rules={[
                {
                    required: true,
                    message: "请输入标题!",
                },
                ]}
            />
            <ProFormTextArea
                fieldProps={{maxLength: 200}}
                label="摘要"
                name="brief"
                placeholder={"请输入，最多200个字"}
                rules={[
                    {
                        required: true,
                        message: "请输入摘要!",
                    },
                ]}
            />
        </ProForm.Group>
      </ProForm>
    </PageContainer>
  )
}
export default ContentDetails
