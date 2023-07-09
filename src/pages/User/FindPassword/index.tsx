import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { Spin, message } from 'antd';
import { LoginForm, ProFormText, ProFormCaptcha } from "@ant-design/pro-components"
import {encryptByDES, validationPsw} from "@/utils"
import { history } from 'umi';
import {getPhoneCode, retrievePassword} from "@/services/user/api";
const encryption = false
const FindPassword: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [isFirst, setIsFirst] = useState(true)
  const [isNone, setIsNone] = useState(true)
  const formRef = useRef()
  useEffect(() =>{
    window['findPassValue'] = {}
  }, [])
  const handleSubmit = (values: any) => {
    setLoading(true)
    retrievePassword({
      ...values,
      type: 1,
      password: encryption ? encryptByDES(values.password) : values.password,
      confirm_password: encryption ? encryptByDES(values.confirm_password) : values.confirm_password,
    }).then(res => {
      setLoading(false)
      if (res.status === 0){
        message.success("找回成功，请重新登录")
        window.localStorage.removeItem('rememberUserInfo')
        history.back()
      }
    })
  }
  const changeCurValue = (key: string, value: string): void => {
    window['findPassValue'][key] = !!value
    // @ts-ignore
    setIsNone(!Object.values(window['findPassValue']).find(v => v === true))
  }
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.login}>
          <Spin spinning={loading}>
            <LoginForm
              submitter={{
                searchConfig: {
                  submitText: "确认修改并登录"
                },
                submitButtonProps: {
                  disabled: isNone
                }
              }}
              formRef={formRef}
              style={{width: 400}}
              {...{
                labelCol: { span: 5 },
                wrapperCol: { span: 19 },
              }}
              layout="horizontal"
              title="找回密码"
              subTitle={<div />}
              initialValues={{
                autoLogin: true,
              }}
              actions={[]}
              onFinish={async (values) => {
                await handleSubmit(values);
              }}
            >
              <>
                <ProFormText
                  fieldProps={{
                    onChange: (e) => changeCurValue('username', e.target.value)
                  }}
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
                <ProFormText
                  fieldProps={{
                    maxLength: 11,
                    onChange: (e) => changeCurValue('mobile', e.target.value)
                  }}
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
                <ProFormCaptcha
                  fieldProps={{
                    onChange: (e) => changeCurValue('code', e.target.value)
                  }}
                  label="验证码"
                  placeholder={'请输入短信验证码'}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${'获取验证码'}`;
                    }
                    return isFirst ? '获取验证码' : '重新获取';
                  }}
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ]}
                  onGetCaptcha={async () => {
                    // @ts-ignore
                    const { validateFields } = formRef.current
                    await validateFields(['username', 'phone']).then(async (values: any, err: any) => {
                      if (err) {
                        throw new Error("获取验证码错误")
                      }
                      setIsFirst(false)
                      const res = await getPhoneCode({...values, checkType: 2, type: 1}, {noShowMessage: true})
                      console.log(res);
                      if (res.status === 0){
                        message.success('短信发送成功！');
                      }else {
                        message.error(res.message);
                        throw new Error("获取验证码错误")
                      }
                    })
                  }}
                />
                <ProFormText.Password
                  fieldProps={{
                    onChange: (e) => changeCurValue('password', e.target.value),
                    autoComplete: "new-password"
                  }}
                  label="新密码"
                  name="password"
                  placeholder={"8-20位,必须包含字母、数字和特殊字符"}
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
                  fieldProps={{
                    onChange: (e) => changeCurValue('confirm_password', e.target.value)
                  }}
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
              </>
            </LoginForm>
            <div
              style={{display: "flex", justifyContent: 'center'}}
            >
              <a onClick={() => history.back()}>
                返回登录
              </a>
            </div>
          </Spin>
        </div>
      </div>
    </div>
  )
}
export default FindPassword
