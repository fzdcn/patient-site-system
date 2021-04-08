import request from '@/utils/request';

export default {
  // 用户信息分页查询列表
  pageList: data => request('/sub-trial/user/paged-query', {
    method: 'get',
    params: data,
  }),
  // 锁定管理员
  lockOne: id => request(`/ftrial/admin/${id}/lock`, {
    method: 'put',
  }),
  // 解锁管理员
  unlockOne: id => request(`/ftrial/admin/${id}/unlock`, {
    method: 'put',
  }),
  // 用户信息详情
  getDetail: id => request(`/sub-trial/user-detail/${id}`),
  // 新增管理员
  add: data => request('/ftrial/admin', {
    method: 'post',
    body: data,
  }),
  // 更新管理员
  update: data => request(`/ftrial/admin/${data.id}`, {
    method: 'put',
    body: data,
  }),
  // 重置密码
  restPassword: data => request('/ftrial/reset-password', {
    method: 'post',
    body: data,
  }),
  // 查询管理员列表
  getAdminList: data => request('/ftrial/admins/full-query', {
    method: 'get',
    params: data,
  }),
  // 清空认证次数
  resetMessage: data => request('/sub-trial/reset-message', {
    method: 'post',
    body: data,
  }),
  // 清空认证次数
  emptyAuthCount: data => request('/sub-trial/empty-auth-count', {
    method: 'post',
    body: data,
  }),
  // 删除用户信息
  deleteUser: id => request(`/sub-trial/delete-user/${id}`, {
    method: 'delete'
  }),
};
