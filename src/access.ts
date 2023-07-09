/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  // 系统权限设置
  return {
    // canAdmin: currentUser && currentUser.access === 'admin',
  };
}
