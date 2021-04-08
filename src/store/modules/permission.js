import api from '@/api/user';
import store from '../index';


const {
  getUserPerms
} = api;


const permission = {
  namespaced: true,
  state: {
    permissionList: [],
    permRouter: [],
    // projectRouter: [],
    keepAlive: [],
    // 控制菜单显示主菜单还是项目菜单
    menuRouteName: '', // projectRouters, mainRouters,
    menuList: [],
  },
  mutations: {
    updateState: (state, payload) => {
      Object.assign(state, payload);
    },
    clearPermissions: (state) => {
      Object.assign(state, {
        permissionList: [],
        menuList: [],
        menuRouteName: '',
        permRouter: []
      });
    },
    setKeepAlive: (state, keepAlive) => {
      if (Array.isArray(keepAlive)) {
        Object.assign(state, {
          keepAlive,
        });
      } else {
        Object.assign(state, {
          keepAlive: [
            ...state.keepAlive,
            keepAlive,
          ],
        });
      }
    },
  },
  actions: {
    // 获取用户项目级别权限
    getPermissions({
      commit
    }) {
      // const res = await getUserPerms({
      //   adminId: store.state.user.info.id,
      // });
      const res = {
        data: {
          permissions: [{
            code: 'P0001',
          }, {
            code: 'P0002',
          }, {
            code: 'P0003',
          }]
        }
      }
      if (res && res.data && res.data.permissions && res.data.permissions.length) {
        const permList = res.data.permissions.map(item => item.code);
        // 如果是超级管理员，新增超级管理员 code 为 super
        if (res.data.super) {
          permList.push('super')
        }
        commit('updateState', {
          permissionList: permList,
        });
        return permList;
      }
      commit('clearPermissions');
      return false;
    },
  },
};
export default permission;
