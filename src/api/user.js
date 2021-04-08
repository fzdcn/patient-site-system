import request from '@/utils/request';

export default {
  // 密码登录
  passwordLogin: data => request('/sub-trial/web-login-by-password', {
    method: 'post',
    body: data
  }),
  // 短信登录
  smsLogin: data => request('/biz-gcplm/login-web-by-sms', {
    method: 'post',
    body: data
  }),
  // 退出登录
  loginOut: () => request('/sub-trial/logout', {
    method: 'post'
  }),
  //  登录短信验证码
  getSmsCode: data => request('/biz-gcplm/send-login-sms', {
    method: 'post',
    body: data
  }),
  //   获取个人信息
  getUserInfo: () => request('/sub-trial/user-info', {
    method: 'get'
  }),
  // 获取图片验证码
  getImgValidation: () => request('/ftrial/image-validation', {
    method: 'get'
  }),
  // 网易验证
  netEaseValidation: data => request('/biz-gcplm/netEase-validation', {
    method: 'post',
    body: data
  }),
  // 找回密码-发送短信验证码
  getForgetPassSmsCode: data => request('/ftrial/send-forget-password-sms', {
    method: 'post',
    body: data
  }),
  // 忘记密码
  forgetPassword: data => request('/ftrial/forget-password', {
    method: 'post',
    body: data
  }),
  // 获取用户权限
  getUserPerms: data => request('/ftrial/getLoginInfo', {
    method: 'get',
    params: data
  }),

};
