import React, {useEffect, useRef, useState} from 'react';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {Modal, Button, message} from 'antd';
import {getUserList, resetPassword, removeUser} from "@/services/userManage/api";
import UserDetailsModal from "./UserDetailsModal"


const reset = (action: ActionType | undefined, r: any) => {
  return Modal.confirm({
    title: "重置密码",
    content: "是否将密码重置为 123456？",
    onOk: async (close) => {
      const res = await resetPassword({
        id: r.id,
        password: '123456'
      })
      if (res.status === 0){
        message.success("重置成功！")
        action?.reloadAndRest?.()
        close()
      }
    }
  })
}
const remove = (action: ActionType | undefined, r: any) => {
  return Modal.confirm({
    title: "删除用户",
    content: "确认删除该管理员？",
    onOk: async (close) => {
      const res = await removeUser({
        id: r.id,
        status: 3,
      })
      if (res.status === 0){
        message.success("删除成功！")
        action?.reloadAndRest?.()
        close()
      }
    }
  })
}

const userManage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const formRef = useRef<any>()
  const [currentRow, setCurrentRow] = useState<any>([{}, 'add'])
  const [handleShow, setHandleshow] = useState(false)
  useEffect(() => {
    if (window.sessionStorage.getItem('useUserManageSearchHistory') === 'true'){
      actionRef.current?.setPageInfo?.(JSON.parse(window.sessionStorage.getItem('searchHistory') as string))
    }
  }, [])
  const columns: ProColumns<any>[] = [
    {
      title: "管理员名称",
      dataIndex: "username",
      valueType: 'text',
      colSize: 5/4,
    },
    {
      title: "真实姓名",
      dataIndex: "realName",
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: "最后登录时间",
      dataIndex: "lastLoginTime",
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: "操作",
      dataIndex: "action",
      hideInSearch: true,
      valueType: 'option',
      width: 200,
      render: (_, record, i, action) => {
        return (
          <div>
            <a
              onClick={() => {
                setCurrentRow([record, 'edit']);
                setHandleshow(true)              }}
            >
              编辑
            </a>
            <a
              onClick={() => remove(action, record)}
              style={{marginLeft: 12}}
            >
              删除
            </a>
            <a
              onClick={() => reset(action, record)}
              style={{marginLeft: 12}}
            >
              重置密码
            </a>
          </div>
        )
      }
    }
  ]
  const closeHandleModal = (isSuccess: boolean) => {
    setHandleshow(false)
    if (isSuccess) return ;
    const type = currentRow[1]
    if (type === 'add'){
      actionRef.current?.reset?.()
    }else if (type === 'edit'){
      actionRef.current?.reloadAndRest?.()
    }
  }
  return (
    <PageContainer>
      <ProTable
        pagination={{
          defaultPageSize: 10
        }}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        headerTitle={
          <Button key="primary" type="primary"
            onClick={() => {
              setCurrentRow([{}, 'add'])
              setHandleshow(true)
            }}
          >
            新建管理员
          </Button>
        }
        search={{
          span: 4
        }}
        toolbar={{ actions: [], settings: [] }}
        columns={columns}
        request={async (params) => {
          return {
            data: [{
              id: 1,
              username: 'admin',
              realName: '管理员',
              phone: '12345678901',
              email: 'xxxx@qq.com',
              lastLoginTime: '2021-01-01 00:00:00'
            }],
          }
          const useUserManageSearchHistory = window.sessionStorage.getItem('useUserManageSearchHistory')
          const { current, pageSize } = useUserManageSearchHistory === 'true' ? JSON.parse(window.sessionStorage.getItem('searchHistory') as string) : params
          const { username } = useUserManageSearchHistory === 'true' ? JSON.parse(window.sessionStorage.getItem('searchHistory') as string) : await formRef.current?.validateFields?.()
          if (useUserManageSearchHistory === 'true') {
            formRef.current?.setFieldsValue?.({username})
            window.sessionStorage.setItem('useUserManageSearchHistory', 'false')
          }
          const res = await getUserList({
            page: current, pageSize,
            username
          })
          window.sessionStorage.setItem('searchHistory', JSON.stringify({ current, pageSize, username }))
          return {
            data: res?.data?.list || [],
            success: res?.status === 0,
            total: res?.data?.total || 0
          }
        }}

      />
    <UserDetailsModal title={currentRow[1] === 'add' ? '添加管理员' : '编辑管理员'} visible={handleShow} data={currentRow[0]} type={currentRow[1]} closeModal={closeHandleModal} />
    </PageContainer>
  )
}
export default userManage
