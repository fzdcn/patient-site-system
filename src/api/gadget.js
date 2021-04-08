import request from '@/utils/request';

export default {
  // 短信列表
  getMessageList: data => request('/sub-trial/message-page', {
    method: 'get',
    params: data
  }),

};
