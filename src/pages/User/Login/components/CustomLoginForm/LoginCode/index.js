import React, { useState, useEffect, useImperativeHandle } from 'react';
import LoginInput from '../LoginInput';
import { getImgVerifyCode } from '@/services/user/api'
import styles from './index.less';

const getRandomStr = () => Math.random().toString(36).slice(-8)

const PhoneCode = (props, ref) => {
  const {
    value,
    onChange,
    loginIptProps,
    enterCallBack,
  } = props;

  const [img, setImg] = useState('');
  const [keyStr, setKeyStr] = useState('');

  useImperativeHandle(ref, () => ({
    getImgCode,
  }))

  useEffect(() => {
    getImgCode()
  }, [])

  const getImgCode = async () => {
    const key = getRandomStr();
    const res = await getImgVerifyCode({
      key,
    });
    if (res) {
      setImg(window.URL.createObjectURL(res));
      setKeyStr(key);
      onChange({
        code: '', key
      })
    }
  }

  const handleIptChange = e => {
    const v = e.target.value;
    onChange({
      code: v, key: keyStr
    })
  }

  const handleReset = () => {
    getImgCode();
  }

  return (
    <div className={styles['phone-code']}>
      {
        loginIptProps && <LoginInput enterCallBack={enterCallBack} {...loginIptProps} value={value.code} onChange={handleIptChange} />
      }
      <span onClick={handleReset} className={styles['phone-code-img']}>
        {img ? <img src={img} alt=""/> : '获取验证码'}
      </span>
    </div>
  )
}

export default React.forwardRef(PhoneCode);
