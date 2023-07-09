import React, { useCallback, useEffect, useRef } from 'react';
import cx from 'classnames';
import styles from './index.less';

const { useMemo } = React;
const primaryName = 'login';

const FcInput = props => {

  const {
    style,
    className,
    label,
    value,
    autoFocus = false,
    enterCallBack,
    ...rest
  } = props;

  const iptRef = useRef(null);

  useEffect(() => {
    if (autoFocus && iptRef.current) {
      iptRef.current.focus();
    }
  }, [])

  const handleFocus = useCallback(() => {
    if (iptRef.current) {
      iptRef.current.focus();
    }
  }, [])

  const classes = useMemo(() => (
    cx(styles[`${primaryName}-input-item`], className)
  ), [className])

  const enter = (e) => {
    if (e.keyCode === 13){
      enterCallBack && enterCallBack()
    }
  }

  return (
    <div className={classes} style={style}>
      <input ref={iptRef} value={value} autoComplete="new-password" {...rest} onKeyDown={enter} />
      <p onClick={handleFocus} className={!!value ? styles[`${primaryName}-input-hasValue`] : ''} style={{color: '#52616b'}}>{label}</p>
      <span />
    </div>
  )
}

export default FcInput;
