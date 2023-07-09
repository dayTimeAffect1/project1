import React, {useEffect, useRef} from 'react';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {Modal, Button, message} from 'antd';
import { history } from "umi"
import {getTenantList, resetPassword, updateStatus} from "@/services/userManage/api";
import moment from "moment";
import Clipboard from "clipboard"

const statusOptions = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '待开通',
    value: 0,
  },
  {
    label: '运行中',
    value: 1,
  },
  {
    label: '暂停运行',
    value: 2,
  },
];
const msgEnum = {
  0: {
    title: "开通服务",
    content: "确认开通该租户的服务？"
  },
  1: {
    title: "暂停服务",
    content: (<div><p>确认暂停该租户的服务？</p><p>暂停后，租户下的所有账号将无法登录系统</p></div>),
  },
  2: {
    title: "重启服务",
    content: "确认启用该租户的服务？",
  },
}

const changeServe = (action: ActionType | undefined, r: any) => {
  if (r.applicationNum / 1 === 0){
    return Modal.warning({
      title: "开通服务",
      content: "租户还未开通应用，请先开通!"
    })
  }
  return Modal.confirm({
    ...msgEnum[r.status],
    onOk: async (close) => {
      const res = await updateStatus({
        id: r.id,
      })
      if (res.status === 0){
        message.success("修改成功！")
        action?.reloadAndRest?.()
        close()
      }
    }
  })
}
const reset = (action: ActionType | undefined, r: any) => {
  return Modal.confirm({
    title: "重置密码",
    content: "是否将密码重置为 fmkj@123456？",
    onOk: async (close) => {
      const res = await resetPassword({
        id: r.id,
        password: 'fmkj@123456'
      })
      if (res.status === 0){
        message.success("重置成功！")
        action?.reloadAndRest?.()
        close()
      }
    }
  })
}
const viewLoginUrl = (url: string) => {
  const id = 'copy' + new Date().getTime()
  let clipboard: any = null
  const onCopy = () => {
    if (!clipboard){
      clipboard = new Clipboard('#' + id, {
        // 通过target指定要复印的节点
        text: function() {
          return url;
        }
      });
      clipboard.on('success', function() {
        message.success("复制成功")
      });

      clipboard.on('error', function() {
        message.error("复制失败")
      });
    }
  }

  return Modal.info({
    title: "登录地址",
    content: (
      <div style={{display: "flex", alignItems: "center"}}>
        <div>{url}</div>
        <div style={{marginLeft: 8}}><Button id={id} onClick={onCopy}>复制</Button></div>
      </div>
    ),
    okText: "关闭",
    width: 500
  })
}



const Tenement: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const formRef = useRef<any>()
  useEffect(() => {
    if (window.sessionStorage.getItem('useTenementSearchHistory') === 'true'){
      actionRef.current?.setPageInfo?.(JSON.parse(window.sessionStorage.getItem('searchHistory') as string))
    }
  }, [])
  const columns: ProColumns<any>[] = [
    {
      title: "租户ID",
      dataIndex: "id",
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: "租户名称",
      dataIndex: "name",
      valueType: 'text',
      colSize: 5/4,
    },
    {
      title: "租户管理员账号",
      dataIndex: "username",
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: "租户管理员手机号",
      dataIndex: "companyPhone",
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: "账号数量",
      dataIndex: "accountLimit",
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return (<span><span style={{color: '#1890ff'}}>{record.openedAccount}</span> / {record.accountLimit}</span>)
      }
    },
    {
      title: "租户状态",
      dataIndex: "status",
      valueType: 'select',
      fieldProps: {
        allowClear: false,
        options: statusOptions,
      },
      initialValue: '',
      valueEnum: {
        0: { text: '待开通', status: 'Default' },
        1: { text: '运行中', status: 'Success' },
        2: { text: '暂停运行', status: 'Warning' },
      },
      colSize: 5/4,

    },
    {
      title: "应用数",
      dataIndex: "applicationNum",
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      valueType: 'dateTimeRange',
      render: (dom: React.ReactNode, record: any) => <span>{moment(record.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>,
      colSize: 2.5,
    },
    {
      title: "登录地址",
      dataIndex: "loginUrl",
      valueType: 'text',
      hideInSearch: true,
      render: (dom: React.ReactNode, record: any) => (
        record.loginUrl ? <a onClick={() => viewLoginUrl(record.loginUrl)}>查看</a> : <span>--</span>
      ),
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
                history.push('/tenement/edit/' + record.id)
              }}
            >
              编辑
            </a>
            <a
              onClick={() => changeServe(action, record)}
              style={{marginLeft: 12}}
            >
              {msgEnum[record.status]?.title}
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
          <Button key="primary" type="primary" onClick={() => history.push('/tenement/add/0')}>
            新建租户
          </Button>
        }
        search={{
          span: 4
        }}
        toolbar={{ actions: [], settings: [] }}
        columns={columns}
        request={async (params) => {
          const useTenementSearchHistory = window.sessionStorage.getItem('useTenementSearchHistory')
          const { current, pageSize } = useTenementSearchHistory === 'true' ? JSON.parse(window.sessionStorage.getItem('searchHistory') as string) : params
          const { createTime, name, status } = useTenementSearchHistory === 'true' ? JSON.parse(window.sessionStorage.getItem('searchHistory') as string) : await formRef.current?.validateFields?.()
          if (useTenementSearchHistory === 'true') {
            formRef.current?.setFieldsValue?.({createTime, name, status})
            window.sessionStorage.setItem('useTenementSearchHistory', 'false')
          }
          const res = await getTenantList({
            page: current, pageSize,
            startTime: createTime?.[0] ? createTime?.[0].format("YYYY-MM-DD HH:mm:ss") :  '', endTime: createTime?.[1] ? createTime?.[1].format("YYYY-MM-DD HH:mm:ss") : '',
            tenantName: name, tenantStatus: status === '' ? undefined : status
          })
          window.sessionStorage.setItem('searchHistory', JSON.stringify({ current, pageSize, createTime, name, status }))
          return {
            data: res?.data?.list || [],
            success: res?.status === 0,
            total: res?.data?.total || 0
          }
        }}

      />
    </PageContainer>
  )
}
export default Tenement
