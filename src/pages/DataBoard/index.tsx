import React, {useState} from "react";
import {PageContainer, ProCard, ProForm, ProFormSelect} from '@ant-design/pro-components';
import { Spin } from "antd";
import {getTenantData, getTenantList} from "@/services/dataBoard/api";

type DataBoardFilterTitleProps = {
  callBack: (v: any) => void;
}
type formValue = {
  tenement: number | string;
}

const DataBoardFilterTitle: React.FC<DataBoardFilterTitleProps> = ({ callBack }) => {
  const [tenementList, setTenementList] = useState<any[]>([])
  return (
    <ProForm
      submitter={false}
      layout="horizontal"
      request={async () => {
        const list = await getTenantList()
        const { data } = list
        setTenementList(data?.map((v: any) => ({ label: v.name, value: v.id })))
        callBack?.({
          tenement: data[0]?.id
        })
        return ({
          tenement: data[0]?.id
        })
      }}
    >
      <ProFormSelect
        fieldProps={{
          onChange: (v) => {
            callBack?.({
              tenement: v
            })
          }
        }}
        width="xl"
        label="租户"
        name="tenement"
        options={tenementList}
        allowClear={false}
      />
    </ProForm>
  )
}

const DataBoard: React.FC = () => {
  const [showMediaAmount, setMediaAmount] = useState(0)
  const [showMediaStoreContent, setMediaStoreContent] = useState(0)
  const [showAuditCallLimited, setAuditCallLimited] = useState(0)
  const [spinning, setSpinning] = useState(false)

  const update = async (value: formValue) => {
    setSpinning(true)
    const { tenement } = value
    const res = await getTenantData({ tenantId: tenement })
    setSpinning(false)
    if (res.status === 0){
      const { resourceSize, resourceNum, callCount } = res.data
      setMediaAmount(resourceNum || 0)
      setMediaStoreContent(resourceSize || 0)
      setAuditCallLimited(callCount || 0)
    }
  }

  return (
    <PageContainer>
      <div style={{color: '#999'}}>注：租户开通了应用且使用后，才有数据</div>
      <Spin spinning={spinning}>
        <ProCard style={{ marginBlockStart: 16 }} gutter={32} title={<DataBoardFilterTitle callBack={update} />}>
          <ProCard title="媒资总数量" colSpan={8} layout="center" bordered headStyle={{background: 'rgb(0,183,191)'}} bodyStyle={{background: 'rgb(0,183,191)'}}>
            <div style={{fontSize: 28}}>{showMediaAmount}</div>
          </ProCard>
          <ProCard title="媒资总存储量" colSpan={8} layout="center" bordered headStyle={{background: 'rgb(170,231,152)'}} bodyStyle={{background: 'rgb(170,231,152)'}}>
            <div style={{fontSize: 28}}>{Number((showMediaStoreContent / (1024 * 1024)).toFixed(2))} GB</div>
          </ProCard>
          <ProCard title="审核云总调用次数" colSpan={8} layout="center" bordered headStyle={{background: 'rgb(255,156,135)'}} bodyStyle={{background: 'rgb(255,156,135)'}}>
            <div style={{fontSize: 28}}>{showAuditCallLimited}</div>
          </ProCard>
        </ProCard>
      </Spin>
    </PageContainer>
  )
}
export default DataBoard
