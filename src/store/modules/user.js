import api from '@/api/user';
import {
  Message
} from 'view-design';
import {
  setStorage,
  clearStorage
} from '@/utils/storage';
import router from '@/router';

const user = {
  namespaced: true,
  state: {
    token: '',
    name: '',
    info: {},
    isSystem: '',
  },
  mutations: {
    updateState(state, payload) {
      Object.assign(state, payload);
    },
    clearSession: (state) => {
      Object.assign(state, {
        token: '',
        name: '',
        info: {},
        isSystem: '',
      });
      clearStorage();
      router.push({
        name: 'login'
      });
    },
  },
  actions: {
    // 获取用户信息
    async getInfo({
      commit
    }) {
      const res = await api.getUserInfo();
      if (res) {
        const {
          name,
        } = res.data;
        commit('updateState', {
          name,
          info: res.data,
          isSystem: res.data.isSystemAdmin,
        });
        setStorage({
          name,
          info: res.data,
          isSystem: res.data.isSystemAdmin,
        });
        return true;
      }
      return false;
    },
    // 退出登录
    async logout({
      commit
    }) {
      const res = await api.loginOut();
      if (res) {
        Message.success('退出登录成功!');
        commit('clearSession');
        commit('permission/clearPermissions', {}, {
          root: true
        });
      }
    },
  },
};
export default user;
