import type { ChangeEvent, } from 'react';
import React, { useEffect, useState } from 'react';
import { Tree, Input, Button } from 'antd';
const { TreeNode } = Tree
type TreeCheckProps = {
  value?: any,
  onChange?: (value: any) => void;
  treeData?: any
  treeProps?: any
}
type nodeData = {
  key: string | number,
  title: string,
  filterTitle?: string,
  children?: nodeData[]
  className?: string
}

const TreeCheck: React.FC<TreeCheckProps> = ({value, onChange, treeData, treeProps = {}}) => {
  const [filterText, setFilterText] = useState('')
  const [currentText, setCurrentText] = useState('')
  const [showTreeData, setShowTreeData] = useState<nodeData[]>([{ key: 0, title: '全选', }])
  useEffect(() => {
    setShowTreeData([{
        key: 0,
        title: '全选',
        children: treeData || []
      }])
  }, [treeData])
  const createNode = (data: nodeData[], parentFilterTitle?: string) => {
    if (!data) return ;
    return (data.map(v => {
      v.filterTitle = parentFilterTitle + '&' + v.title
      return (<TreeNode className={v?.className} style={{display: v.filterTitle.includes(filterText) ? '' : 'none'}} key={v.key} title={v.title}>{v.children && createNode(v.children, v.filterTitle)}</TreeNode>)
    }))
  }

  return (
    <div>
      <div style={{display: 'flex', marginBottom: 16, maxWidth: 500}}>
        <Input placeholder="输入关键词搜索" value={currentText} onKeyDown={e => e.keyCode === 13 && setFilterText(currentText)} onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentText(e?.target?.value)} />
        <Button type="primary" onClick={() => setFilterText(currentText)}>搜索</Button>
      </div>
      <Tree
        checkedKeys={value}
        checkable
        onCheck={(checkedKeys) => {
          onChange?.(checkedKeys)
        }}
        {...treeProps}
      >
        {
          createNode(showTreeData, '')
        }
      </Tree>
    </div>
  )
}
export default TreeCheck
