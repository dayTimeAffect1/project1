import React, {useMemo} from 'react';
import styles from "./index.less"
import moment from "moment";

const functionStatusEnum = {
  0: {
    text: '已禁用', status: 'error'
  },
  1: {
    text: '正常', status: 'info'
  },
  2: {
    text: '待续期', status: 'notice'
  },
  3: {
    text: '已过期', status: 'disable'
  },
}
export type FunctionCardProps = {
  id: number,
  status?: number,
  title: string,
  expDate?: any,
  open?: boolean;
  functionList?: any[]
}

export type FunctionHandleProps = {
  openHandle?: (data: FunctionCardProps) => any
  closeHandle?: (data: FunctionCardProps) => any
  changeHandle?: (data: FunctionCardProps, other: any) => any
}
type curProps = FunctionCardProps & FunctionHandleProps

const FunctionCard: React.FC<curProps> =
  ({ status, expDate, open, title, openHandle, id, closeHandle, changeHandle , functionList}) => {
    const showStatus = useMemo(() => {
      if (!open) return status
      if (status === 0) return status
      if (status === 1) {
        if (expDate.check === 1) return 1
        else {
          const curTime = moment().subtract(1, 'days');
          const nextTime = moment().add(3, 'M')
          const time = moment(expDate.time)
          if (time < curTime){
            return 3
          }else if (time > nextTime){
            return 1
          }else {
            return 2
          }
        }
      }
      return status
    }, [status, expDate, open])
    return (
    <div className={styles.functionCard}>
      {open && showStatus !== undefined &&
      <div className={`${styles.functionStatus} ${styles['text-' + functionStatusEnum[showStatus]?.status]}`}>
        {functionStatusEnum[showStatus]?.text}
      </div>
      }
      <div className={`${styles.functionName} ${styles[(open && showStatus !== undefined) ? 'hasStatus' : 'noStatus' ]}`}>{title}</div>
      {open && expDate && <div className={styles.functionValidity}>有效期：{expDate?.check === 0 ? expDate.time : "永久有效"}</div>}
      <div className={styles.functionHandle}>
        {
          open ? (
            <div style={{display: showStatus === 0 ? 'none' : 'block'}}>
              <a onClick={() => changeHandle?.({ title, id, expDate, functionList}, {title: '应用功能管理', type: 'changeFun'})}>功能</a>
              <a onClick={() => changeHandle?.({ title, id, expDate, functionList}, {title: '修改有效期', type: 'changeTime'})}>有效期</a>
              <a onClick={() => closeHandle?.({title, id})}>关闭</a>
            </div>
          ) : <a onClick={() => openHandle?.({title, id, status})}>开通</a>
        }
      </div>
    </div>
  )
}
export default FunctionCard
