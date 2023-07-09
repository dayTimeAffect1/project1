import React, { useEffect, useRef, useState } from 'react';
import { Modal, Spin, Alert, message } from 'antd';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import {create, update} from "@/services/userManage/api";
import {validationPsw} from '@/utils';


type changeModalProps = {
  visible: boolean,
  closeModal: (t?: any) => any;
  title?: string,
  type?: string,
  data: any
}
const UserDetailsModal: React.FC<changeModalProps> = ({visible, closeModal, title, data, type}) => {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const formRef: React.MutableRefObject<any> = useRef()
  useEffect(() => {
    if(visible) {
      setMsg('')
      setLoading(false)
    }
  }, [visible])

  const onOk = () => {
    formRef.current.validateFields().then(async (values: any, err: any) => {
      if (err) return;
      setLoading(true)
      let res;
      if (data.id){
        res = await update({id: data.id, ...values}, {noShowMessage: true})
      }else {
        res = await create(values, {noShowMessage: true})
      }
      setLoading(false)
      if (res.status === 0){
        message.success("操作成功！")
        closeModal()
      }else {
        setMsg(res.message)
      }
    }).catch(() => {
      setLoading(false)
    })
  }
  return (
    <div>
      <Modal
        title={title}
        width={600}
        visible={visible}
        maskClosable={false}
        onCancel={closeModal}
        onOk={onOk}
        destroyOnClose
      >
        <Spin spinning={loading}>
          <div style={{marginBottom: 12}}>
            {msg && <Alert message={msg} type='error' showIcon />}
          </div>
          <ProForm
            submitter={false}
            {...{ labelCol: { span: 4 }, wrapperCol: { span: 18 } }}
            layout="horizontal"
            formRef={formRef}
          >
            <ProFormText
              initialValue={data?.username}
              fieldProps={{ maxLength: 50, disabled: type === 'edit' }}
              label="管理员名称"
              name="username"
              placeholder={"请输入管理员名称"}
              rules={[
                {
                  required: true,
                  message: "请输入管理员名称!",
                },
              ]}
            />
            {type === 'add' && <ProFormText.Password
              fieldProps={{
                autoComplete: "new-password"
              }}
              label="密码"
              name="password"
              placeholder={"6-20位,必须包含字母、数字和特殊字符(不包括空格)"}
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
            />}
            {type === 'add' && <ProFormText.Password
              label="确认密码"
              name="confirm_password"
              placeholder={"两次输入密码保持一致"}
              rules={[
                {
                  required: true,
                  message: "请再次输入密码！",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('两次输入密码不一致'));
                  },
                }),
              ]}
            />}
            <ProFormText
              initialValue={data?.realName}
              fieldProps={{ maxLength: 10 }}
              label="真实姓名"
              name="realName"
              placeholder={"请输入真实姓名"}
              rules={[
                {
                  required: true,
                  message: "请输入真实姓名!",
                },
              ]}
            />
            <ProFormText
              initialValue={data?.email}
              fieldProps={{ maxLength: 50 }}
              label="邮箱"
              name="email"
              placeholder={"请输入邮箱"}
              rules={[
                {
                  pattern: /@/,
                  message: '邮箱格式不正确！',
                },
              ]}
            />
            <ProFormText
              initialValue={data?.phone}
              fieldProps={{ maxLength: 11 }}
              label="手机号"
              name="phone"
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
          </ProForm>
        </Spin>
      </Modal>
    </div>
  )
}
export default UserDetailsModal
