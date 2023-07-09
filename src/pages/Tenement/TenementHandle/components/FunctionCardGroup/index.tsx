import React, { useEffect, useState } from 'react';
import type { FunctionCardProps } from "./FunctionCard"
import styles from "./index.less"
import cx from "classnames"
import FunctionEditModal from "./FunctionEditModal"

import FunctionCard from '@/pages/Tenement/TenementHandle/components/FunctionCardGroup/FunctionCard';

type FunctionCardGroupProps = {
  value?: FunctionCardProps[],
  onChange?: (value: any) => void;
  appList?: any[]
}
type handleDataPrams = {
  title?: string,
  data?: object,
  type?: string
}

const FunctionCardGroup: React.FC<FunctionCardGroupProps> = ({value, appList, onChange}) => {
  const [closedFun, setCloseFun] = useState<FunctionCardProps[]>([])
  const [handleVisible, setHandleVisible] = useState(false)
  const [handleData, setHandleData] = useState<handleDataPrams>({})
  useEffect(() => {
    if(appList) setCloseFun([...appList])
  }, [appList])
  const open = (data: FunctionCardProps) => {
    setHandleVisible(true)
    setHandleData({
      title: "开通应用",
      data,
      type: 'add'
    })
  }
  const close = (data: FunctionCardProps) => {
    setHandleVisible(true)
    setHandleData({
      title: "确认关闭该应用？",
      data,
      type: 'close'
    })
  }
  const change = (data: FunctionCardProps, other: any) => {
    setHandleVisible(true)
    setHandleData({
      ...other,
      data,
    })
  }
  const closeModal = (callBackData: any, handleStatus?: string) => {
    setHandleVisible(false)
    if (handleStatus !== 'success') return;
    const { type } = handleData
    if (type === 'add'){
      setCloseFun(closedFun.filter(v => v.id !== callBackData.id));
      if (value){
        onChange?.([...value, {...callBackData, open: true}])
      }else {
        onChange?.([{...callBackData, open: true}])
      }
    }
    if (type === 'close') {
      setCloseFun([...closedFun, callBackData])
      onChange?.(value?.filter(v => v.id !== callBackData.id))
    }
    if (type === 'changeFun' || type === 'changeTime'){
      onChange?.(value?.map(v => v.id === callBackData.id ? ({...v, ...callBackData}) : v))

    }
  }
  return (
    <div className={styles.functionCardGroup}>
      <div style={{marginBottom: 20}}>
        <div className={cx(styles.functionGroupTitle, styles['text-info'])}>已开通</div>
        <div className={cx(styles.functionGroup)}>
          {
            value?.map(v => (<div key={v.id} className={styles.group}><FunctionCard {...v} closeHandle={close} changeHandle={change} /></div>))
          }
        </div>
      </div>
      <div>
        <div className={styles.functionGroupTitle}>未开通</div>
        <div className={cx(styles.functionGroup)}>
          {
            closedFun.map(v => (<div key={v.id} className={styles.group}><FunctionCard {...v} openHandle={open} /></div>))
          }
        </div>
      </div>
      <FunctionEditModal visible={handleVisible} {...handleData} closeModal={closeModal} />
    </div>
  )
}
export default FunctionCardGroup
