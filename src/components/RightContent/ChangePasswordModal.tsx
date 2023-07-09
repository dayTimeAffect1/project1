import React, { useRef } from 'react';
import {message, Modal} from 'antd';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import {encryptByDES, validationPsw} from '@/utils';
import {updatePassword} from "@/services/user/api";

type changeModalProps = {
  visible: boolean,
  closeModal: () => any;
  loginOut?: () => any;
  encryption?: boolean;
}

const ChangePasswordModal: React.FC<changeModalProps> = ({ visible , closeModal, loginOut, encryption = false }) => {
  const formRef: React.MutableRefObject<any> = useRef()
  const onOk = () => {
    formRef.current.validateFields().then(async (values: any, err: any) => {
      if (err) return;
      const res = await updatePassword({
        password: encryption ? encryptByDES(values.password) : values.password
      })
      if (res.status === 0){
        closeModal()
        message.success("操作成功！")
        loginOut?.()
      }
    })
  }
  return (
    <div>
      <Modal
        title="修改密码"
        width={600}
        visible={visible}
        maskClosable={false}
        onCancel={closeModal}
        onOk={onOk}
        destroyOnClose
      >
        <div>
          <div style={{color: '#999999', marginBottom: 20}}>提示：修改密码成功后，将跳出页面重新登录</div>
          <ProForm
            submitter={false}
            {...{ labelCol: { span: 4 }, wrapperCol: { span: 18 } }}
            layout="horizontal"
            formRef={formRef}
          >
            <ProFormText.Password
              fieldProps={{
                autoComplete: "new-password"
              }}
              label="新密码"
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
            />
            <ProFormText.Password
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
            />
          </ProForm>
        </div>
      </Modal>
    </div>
  )
}
export default ChangePasswordModal
