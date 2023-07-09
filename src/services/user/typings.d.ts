// @ts-ignore
/* eslint-disable */

declare namespace USER {
  type CurrentUser = {
    username?: string;
    realName?: string;
    id?: string | number;
    lastLoginTime?: string;
    avatarUrl?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    address?: string;
    phone?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    vCode?: string;
    vCodeKey?: string
  };
}


