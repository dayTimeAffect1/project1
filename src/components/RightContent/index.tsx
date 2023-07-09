import { useModel } from '@umijs/max';
import { Space } from 'antd';
import React from 'react';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  return (
    <Space className={`${styles.right}  ${styles.dark}`}>
      <Avatar />
    </Space>
  );
};
export default GlobalHeaderRight;
