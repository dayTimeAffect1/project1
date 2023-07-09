import { outLogin } from '@/services/user/api';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Avatar, Menu, Spin } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState } from 'react';
import HeaderDropdown from '../HeaderDropdown';
import ChangePasswordModal from "./ChangePasswordModal"
import ChangeInfoModal from "./ChangeInfoModal"
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};



const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const [key, setKey] = useState('')
  const { initialState, setInitialState } = useModel('@@initialState');

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    const res = await outLogin();
    if (res.status !== 0) return;
    setInitialState((s: any) => ({ ...s, currentUser: undefined }));
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      if (event.key === 'logout') {
        loginOut();
        return;
      }
      setKey(event.key)
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.username) {
    return loading;
  }

  const menuItems: ItemType[] = [
    {
      key: 'changePassword',
      icon: <UserOutlined />,
      label: '修改密码',
    },
    {
      key: 'changeInfo',
      icon: <SettingOutlined />,
      label: '修改信息',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '安全退出',
    },
  ];

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick} items={menuItems} />
  );

  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          { currentUser.avatarUrl ? <Avatar size="small" className={styles.avatar} src={currentUser.avatarUrl} alt="avatar"/> : <Avatar icon={<UserOutlined />} />}
          <span className={`${styles.name} anticon`}>{currentUser.username}</span>
        </span>
      </HeaderDropdown>
      <ChangePasswordModal visible={key === 'changePassword'} closeModal={() => setKey('')} loginOut={loginOut} />
      <ChangeInfoModal visible={key === 'changeInfo'} closeModal={() => setKey('')} />
    </>
  );
};

export default AvatarDropdown;
