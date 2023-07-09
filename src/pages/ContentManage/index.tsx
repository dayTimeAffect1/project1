import React, {useEffect, useRef} from 'react';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {Modal, Button, message} from 'antd';
import { history } from "umi"
import { getContentList, removeContent, updateContentStatus } from "@/services/contentManage/api";
import moment from "moment";

const statusOptions = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '已发布',
    value: 1,
  },
  {
    label: '未发布',
    value: 0,
  },
];

const remove = async (action: any, record: any) => {
  Modal.confirm({
    title: '删除',
    content: '确定删除该文章吗？',
    async onOk(close) {
      const res = await removeContent(record.id)
      if (res.status === 0){
        if (res.status === 0){
          message.success("重置成功！")
          action?.reloadAndRest?.()
          close()
        }
      }
    },
  });
}
const statusChange = async (action: any, record: any) => {
  Modal.confirm({
    title: record.status === 1 ? '撤回' : '发布',
    content: record.status === 1 ? '确定撤回该文章吗？' : '确定发布该文章吗？',
    async onOk(close) {
      const res = await updateContentStatus({
        id: record.id,
        status: record.status === 1 ? 0 : 1,
      })
      if (res.status === 0){
        message.success("重置成功！")
        action?.reloadAndRest?.()
        close()
      }
    },
  });
}





const ContentManage: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const formRef = useRef<any>()
  useEffect(() => {
    if (window.sessionStorage.getItem('useContentManageSearchHistory') === 'true'){
      actionRef.current?.setPageInfo?.(JSON.parse(window.sessionStorage.getItem('searchHistory') as string))
    }
  }, [])
  const columns: ProColumns<any>[] = [
    {
      title: "标题",
      dataIndex: "title",
      valueType: 'text',
      colSize: 6/4,
    },
    {
      title: "发布状态",
      dataIndex: "status",
      valueType: 'select',
      fieldProps: {
        allowClear: false,
        options: statusOptions,
      },
      initialValue: '',
      valueEnum: {
        0: { text: '未发布', status: 'Default' },
        1: { text: '已发布', status: 'Success' },
      },
      width: 200,
    },
    {
      title: "时间",
      dataIndex: "createTime",
      valueType: 'dateTimeRange',
      render: (dom: React.ReactNode, record: any) => {
        return (
          <div>
            <p>创建时间：<span>{moment(record.createTime).format("YYYY-MM-DD HH:mm:ss")}</span></p>
            {record.publishTime && <p>发布时间：<span>{record.publishTime ? moment(record.publishTime).format("YYYY-MM-DD HH:mm:ss") : ''}</span></p>}
          </div>
        )
      },
      hideInSearch: true,   
      width: 350, 
    },
    {
      title: "操作",
      dataIndex: "action",
      hideInSearch: true,
      valueType: 'option',
      width: 250,
      render: (_, record, i, action) => {
        return (
          <div>
            <a
              onClick={() => {
                history.push('/content/edit/' + record.id)
              }}
            >
              编辑
            </a>
            <a
              onClick={() => statusChange(action, record)}
              style={{marginLeft: 12}}
            >
              {record.status === 1 ? '撤回' : '发布'}
            </a>
            <a
              onClick={() => remove(action, record)}
              style={{marginLeft: 12}}
            >
              删除
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
          <Button key="primary" type="primary" onClick={() => history.push('/content/add/0')}>
            新建文章
          </Button>
        }
        search={{
          span: 4
        }}
        // rowSelection={{}}
        toolbar={{ actions: [], settings: [] }}
        columns={columns}
        request={async (params) => {
          const useContentManageSearchHistory = window.sessionStorage.getItem('useContentManageSearchHistory')
          const { current, pageSize } = useContentManageSearchHistory === 'true' ? JSON.parse(window.sessionStorage.getItem('searchHistory') as string) : params
          const { title, status } = useContentManageSearchHistory === 'true' ? JSON.parse(window.sessionStorage.getItem('searchHistory') as string) : await formRef.current?.validateFields?.()
          if (useContentManageSearchHistory === 'true') {
            formRef.current?.setFieldsValue?.({title, status})
            window.sessionStorage.setItem('useContentManageSearchHistory', 'false')
          }
          const res = await getContentList({
            page: current, pageSize,
            title, status
          })
          window.sessionStorage.setItem('searchHistory', JSON.stringify({ current, pageSize, title, status }))
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
export default ContentManage
