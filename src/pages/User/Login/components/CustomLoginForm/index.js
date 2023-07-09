/**
 * @Author: dayTimeAffect
 * @Date: 2022/9/29
 * 基于产教融合登录页迁移
 */
import React, {useState, useCallback, useRef} from 'react';
import { message, Checkbox } from "antd"
import LoginInput from "./LoginInput"
import LoginCode from "./LoginCode"
import styles from "./index.less";
import { history } from '@@/core/history';
import {encryptByDES} from "@/utils";

const initValue = {
  username: '', password: '',
  vCode: '', vCodeKey: '',
}
const CustomLoginForm = ({callBack, hideCode = false, encryption = false}) => {
  const rememberUserInfo = window.localStorage.rememberUserInfo ? JSON.parse(window.localStorage.rememberUserInfo) : false
  const cRef = useRef(null);
  const [value, setValue] = useState({...initValue, username: rememberUserInfo ? rememberUserInfo.userName : ''});
  const [rememberUser, setRememberUser] = useState(rememberUserInfo ? rememberUserInfo : {remember: true, userName: ''})
  const handleChange = useCallback(type => e => {
    const v = e.target.value;
    if (type === 'password' && v.length > 30) {
      return message.error('密码长度不能超过30字符');
    }
    setValue(value => ({ ...value, [type]: v }));
  }, [])
  const handleSubmit = async () => {
    const { username, password, vCode, vCodeKey } = value
    if (!value.username && !value.password && !value.vCode) return ;
    if (!value.username) return message.error('请输入用户名');
    if (!value.password) return message.error('请输入密码');
    if (!hideCode && !value.vCode) return message.error('请输入验证码');
    let params = {
      username: encryption ? encryptByDES(username) : username,
      password: encryption ? encryptByDES(password) : password,
    }
    if (!hideCode) {
      params = { ...params, vCode, vCodeKey }
    }
    return callBack(params, rememberUser?.remember ? {remember: true, userName: value.username} : {remember: false, userName: ''}, {updateCode})
  }


  const updateCode = () => {
    cRef.current.getImgCode()
  }
  const handleCodeChange = v => {
    setValue({ ...value, vCode: v.code, vCodeKey: v.key })
  }
  const rememberUserChange = (e) => {
    setRememberUser({remember: e.target.checked, userName: e.target.checked ? value.username : ''})
  }
  return (
    <div className={styles['login-form']}>
      <div className={styles['login-form-item']}>
        <LoginInput
          enterCallBack={handleSubmit}
          label='用户名'
          value={value.username}
          onChange={handleChange('username')}
        />
      </div>
      <div className={styles['login-form-item']}>
        <LoginInput
          enterCallBack={handleSubmit}
          label='密码'
          value={value.password}
          type='password'
          onChange={handleChange('password')}
        />
      </div>
        {!hideCode && <div className={styles['login-form-item']}>
          <LoginCode
            enterCallBack={handleSubmit}
            ref={cRef}
            value={{
              key: value.vCodeKey,
              code: value.vCode,
            }}
            onChange={handleCodeChange}
            loginIptProps={{
              label: '验证码',
            }}
          />
        </div>}
      <div className={styles['login-form-rememberUser']}>
        <Checkbox checked={rememberUser.remember} onChange={rememberUserChange}>记住用户名</Checkbox>
      </div>
      <div onClick={handleSubmit} className={`${styles['login-form-submit']} ${!value.username && !value.password && !value.vCode && styles['login-form-submit-disabled']}`}>登录</div>
      {/* <div onClick={() => history.push('/user/findPassword')} className={styles['login-form-rest']}>找回密码</div> */}
    </div>
  )
}

export default CustomLoginForm
