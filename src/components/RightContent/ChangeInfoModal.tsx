import React, { useRef } from 'react';
import { Modal, message } from 'antd';
import { ProForm, ProFormText, ProFormDateTimePicker } from '@ant-design/pro-components';
import { useModel } from '@umijs/max'
import {update} from "@/services/user/api";

type changeModalProps = {
  visible: boolean,
  closeModal: () => any;
}

const ChangeInfoModal: React.FC<changeModalProps> = ({visible, closeModal}) => {
  const formRef: React.MutableRefObject<any> = useRef()
  const { initialState, setInitialState } = useModel('@@initialState');

  const onOk = () => {
    formRef.current.validateFields().then(async (values: any, err: any) => {
      if (err) return;
      const { realName, email, phone } = values

      const res = await update({id: initialState?.currentUser?.id, realName, email, phone})
      if (res.status === 0){
        closeModal()
        message.success("操作成功！")
        const data = await initialState?.fetchUserInfo?.()
        setInitialState((s) => ({ ...s, currentUser: data }));
      }
    })
  }
  return (
    <div>
      <Modal
        title="修改信息"
        width={600}
        visible={visible}
        maskClosable={false}
        onCancel={closeModal}
        onOk={onOk}
        destroyOnClose
      >
        <div>
          <ProForm
            submitter={false}
            {...{ labelCol: { span: 4 }, wrapperCol: { span: 18 } }}
            layout="horizontal"
            formRef={formRef}
          >
            <ProFormText
              initialValue={initialState?.currentUser?.username}
              fieldProps={{ disabled: true }}
              label="用户名"
              name="username"
              placeholder={"请输入用户名"}
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
              ]}
            />
            <ProFormDateTimePicker
              initialValue={initialState?.currentUser?.lastLoginTime}
              fieldProps={{ disabled: true, style: {width: '100%'} }}
              label="最近登录"
              name="lastLoginTime"
              rules={[
                { required: true },
              ]}
            />
            <ProFormText
              initialValue={initialState?.currentUser?.realName}
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
              initialValue={initialState?.currentUser?.email}
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
              initialValue={initialState?.currentUser?.phone}
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
        </div>
      </Modal>
    </div>
  )
}
export default ChangeInfoModal
