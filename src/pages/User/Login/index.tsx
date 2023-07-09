import { login } from '@/services/user/api';
import { history, useModel } from '@umijs/max';
import { message, Spin, Modal } from 'antd';
import React, {useEffect, useState} from 'react';
import styles from './index.less';
import CustomLoginForm from "./components/CustomLoginForm"

type rememberUser = {
  remember: boolean,
  userName: string
}
type CustomLoginFormProps = {
  updateCode?: () => undefined
}
const hideCode = true

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(false)

  const fetchUserInfo = async () => {
    setLoading(true)
    const userInfo = await initialState?.fetchUserInfo?.();
    setLoading(false)
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
      const urlParams = new URL(window.location.href).searchParams;
      history.push(decodeURIComponent(urlParams.get('redirect') || '/'));
    }
  }
  useEffect(() => {
    fetchUserInfo()
  }, [])
  const multipleError = () => {
    Modal.confirm({
      content: "用户名或密码多次错误，请30分钟后重试或找回密码",
      cancelText: "稍后重试",
      cancelButtonProps: {
        type: 'text'
      },
      okText: "忘记密码",
      okButtonProps: {
        type: 'link'
      },
      onOk: (close) => {
        history.push('/user/findPassword')
        close()
      }
    })
  }

  const handleSubmit = async (values: USER.LoginParams, rememberUserInfo: rememberUser, { updateCode }: CustomLoginFormProps) => {
    try {
      // 登录
      setLoading(true)
      const msg = await login({ ...values });
      setLoading(false)
      if (msg.status === 0) {
        message.success("登录成功！");
        if (rememberUserInfo) window.localStorage.setItem('rememberUserInfo', JSON.stringify(rememberUserInfo))
        await fetchUserInfo();
        return;
      }else if (msg.status === 435){
        multipleError()
      }
      !hideCode && updateCode?.()
    } catch (error) {
    }
  };  


  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.login}>
          <Spin spinning={loading}>
            <CustomLoginForm callBack={handleSubmit} hideCode={hideCode} />
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default Login;
