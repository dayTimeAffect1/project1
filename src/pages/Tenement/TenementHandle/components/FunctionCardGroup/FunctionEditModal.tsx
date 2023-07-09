import React, {useEffect, useRef, useState} from 'react';
import { ModalForm } from '@ant-design/pro-components';
import type { RadioChangeEvent } from 'antd';
import {Form, Radio, DatePicker, Alert} from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import TreeCheck from '@/components/TreeCheck';

type changeModalProps = {
  visible: boolean,
  closeModal?: (d: any, status?: string) => any;
  type?: string,
  title?: string,
  data?: any
}
const TextShow: React.FC<{value?: string}> = ({value}) => {
  return <span>{value}</span>
}
const ExpirationDate: React.FC<{value?: any, onChange?: (value: any) => void;}> = ({value, onChange}) => {
  const changeCheck = (e: RadioChangeEvent, check: number) => {
    onChange?.({...value, check})
  }
  const changeTime = (time: string) => {
    onChange?.({...value, time})
  }

  return (
    <div style={{display: "flex", alignItems: "center"}}>
      <div style={{marginRight: 16}}>
        <Radio onChange={e => changeCheck(e, 0)} checked={value?.check === 0} /> <DatePicker disabledDate={(t: Moment) => t < moment().startOf('day') } onChange={t => changeTime(t ? t.format("YYYY-MM-DD") : '')} disabled={value?.check !== 0} value={value?.time ? moment(value?.time) : null} />
      </div>
      <div>
        <Radio onChange={e => changeCheck(e, 1)} checked={value?.check === 1} /> 永久有效
      </div>
    </div>
  )
}
type TreeData = {
  id?: string | number,
  name?: string,
  code?: string,
  type?: string,
  parentId?: string,
  childFuncs?: TreeData[]
}
const createFunTree = (data: TreeData[]): any[] => {
  return data.map(v => {
    return {
      title: v.name,
      key: `${v.id}~${v.code}~${v.name}~${v.type}~${v.parentId}`,
      children: v.childFuncs ? createFunTree(v.childFuncs) : []
    }
  })
}

const FunctionEditModal: React.FC<changeModalProps> = ({title, visible, closeModal, data, type}) => {
  const formRef: React.MutableRefObject<any> = useRef()
  const [msg, setMsg] = useState('')
  const [functionTree, setFunctionTree] = useState<any[]>([])

  useEffect(() => {
    if (visible){
      setMsg("")
      setFunctionTree([])
    }
  }, [visible, data?.id])

  const onOk = async (values: any) => {
    if (closeModal) closeModal({...data, ...values}, 'success')
    return true
  }
  return (
    <div>
      <ModalForm
        title={title}
        width={600}
        visible={visible}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          onCancel: closeModal
        }}
        onFinish={onOk}
        layout="horizontal"
        {...{ labelCol: { span: 4 }, wrapperCol: { span: 18 } }}
        formRef={formRef}
        initialValues={{
          expDate: {
            check: 0
          },
          ...data
        }}
      >
        <div style={{marginBottom: 12}}>
          {msg && <Alert message={msg} type='error' showIcon />}
        </div>
        <Form.Item
          label="应用名称"
          name="title"
        >
          <TextShow />
        </Form.Item>
        {
          type && ['add', 'changeTime'].includes(type) && (
            <Form.Item
              label="有效期"
              name="expDate"
              rules={[
                {
                  validator: (_, value) =>{
                    if (value?.check === 0 && !value.time){
                      return Promise.reject(new Error('请选择有效期时间'))
                    }
                    return Promise.resolve()
                  }
                }
              ]}
            >
              <ExpirationDate />
            </Form.Item>
          )
        }
        {
          type && ['add', 'changeFun'].includes(type) && (
            <Form.Item
              label="开通功能"
              name="functionList"
            >
              <TreeCheck treeData={functionTree} treeProps={{defaultExpandedKeys: ['0']}} />
            </Form.Item>
          )
        }
      </ModalForm>
    </div>
  )
}
export default FunctionEditModal
