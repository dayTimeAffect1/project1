import React, {useRef, useState} from 'react';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {Modal, message, Button} from 'antd';
import {getMemberList, resetPassword, updateStatus} from "@/services/memberManage/api";
import moment from "moment";

const statusOptions = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '待审核',
    value: 0,
  },
  {
    label: '已通过',
    value: 1,
  },
  {
    label: '未通过',
    value: 2,
  },
];

const Audit = (props: any) => {
  const {record, action} = props
  const [visible, setVisible] = useState(false)
  const audit = async (status: number) => {
    const res = await updateStatus({
      id: record.id,
      status
    })
    if (res.status === 0){
      setVisible(false)
      message.success("审核成功！")
      action?.reloadAndRest?.()
    }
  }
  return (
    <>
      <a onClick={() => setVisible(true)}>审核</a>
      <Modal
        title="审核"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={(
          <>
            <Button type='primary' onClick={() => audit(1)}>通过</Button>
            <Button onClick={() => audit(2)}>不通过</Button>
          </>
        )}
      >
        <div>
          <p>会员名称：{record.username}</p>
          <p>手机号：{record.phone}</p>
          <p>申请时间：{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>
      </Modal>
    </>
  )
}
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

const MemberManage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const formRef = useRef<any>()
  const columns: ProColumns<any>[] = [
    {
      title: "会员名称",
      dataIndex: "username",
      valueType: 'text',
      colSize: 5/4,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: 'select',
      fieldProps: {
        allowClear: false,
        options: statusOptions,
      },
      initialValue: '',
      valueEnum: {
        0: { text: '待审核', status: 'Default' },
        1: { text: '已通过', status: 'Success' },
        2: { text: '未通过', status: 'Warning' },
      },
      colSize: 5/4,

    },
    {
      title: "申请时间",
      dataIndex: "createTime",
      valueType: 'dateTimeRange',
      render: (dom: React.ReactNode, record: any) => <span>{moment(record.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>,
      colSize: 2.5,
      hideInSearch: true,
    },
    {
      title: "最后登录时间",
      dataIndex: "lastLoginTime",
      valueType: 'dateTimeRange',
      render: (dom: React.ReactNode, record: any) => <span>{moment(record.lastLoginTime).format("YYYY-MM-DD HH:mm:ss")}</span>,
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
            <Audit record={record} action={action} />
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
        search={{
          span: 4
        }}
        toolbar={{ actions: [], settings: [] }}
        columns={columns}
        request={async (params) => {
          return {
            data: [{
              id: 1,
              username: 'test',
              phone: '12345678901',
              status: 0,
              createTime: 1627777777777,
              lastLoginTime: 1627777777777,

            }],
          }
          const { current, pageSize, username, status } = params
          const res = await getMemberList({
            page: current, pageSize,
            username, status
          })
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
export default MemberManage
