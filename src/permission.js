import NProgress from 'nprogress'; // progress bar
import router from './router';
import store from './store';
import {
  getStorage
} from './utils/storage';
import {
  whiteRouters,
  allRouters,
  projectRouterObj,
  mainRouterObj,
} from '@/config/router.config';
import 'nprogress/nprogress.css';


// NProgress 配置
NProgress.configure({
  showSpinner: true
});

const whiteList = whiteRouters.map(item => item.name);
// let authRouters = [];
// 获取普通重定向地址
// const getRedirectPath = (to) => {
//   const { permRouter } = store.state.permission;
//   const { name } = to;
//   if (to.name === 'Index') {
//     return permRouter[0].path;
//   }
//   // 根据当前route的name找到对应的route
//   const route = permRouter.find(item => item.name === name);
//   // 如果有子路由
//   if (route && route.children && route.children.length) {
//     // 返回子路由
//     return route.children[0].path;
//   }
//   // 如果根据当前名称没找到，则认为是底层路由，不需要重定向
//   return false;
// };

// 过滤路由权限
function filterRouter(routerMap, permissionList = []) {
  const routerArr = [];
  routerMap.forEach((route) => {
    if (route.meta.permission === 'no' || permissionList.indexOf(route.meta.permission) > -1) {
      routerArr.push({
        ...route,
      });
    }
  });
  return routerArr;
}

// 拼装menuList
function formatMenuList(routerObj, parentKey) {
  const routers = routerObj[parentKey].filter(item => item.meta.type === 'menu');
  return routers.map((item) => {
    if (item.meta.isSubMenu) {
      Object.assign(item, {
        children: routerObj[`${item.name}Children`],
      });
    }
    return item;
  });
}

function handleMenuList(to, permissionList) {
  const projId = to.params && to.params.projId;
  const {
    permission
  } = store.state;
  const menuRouteName = projId ? 'projectRouters' : 'mainRouters';
  // 判断菜单名称是否改变
  if (permission.menuRouteName && menuRouteName === permission.menuRouteName) {
    return false;
  }
  const routerObj = JSON.parse(JSON.stringify(
    projId ? projectRouterObj : mainRouterObj,
  ));
  // 过滤有权限得menu
  Object.keys(routerObj).forEach((key) => {
    routerObj[key] = filterRouter(routerObj[key], permissionList);
  });
  const menuList = formatMenuList(routerObj, projId ? 'projectRouters' : 'mainRouters');
  store.commit('permission/updateState', {
    menuRouteName,
    menuList,
  });
  return true;
}

// 动态添加路由
function addRoutes($router, permissionList) {
  const filteredRouters = filterRouter(allRouters, permissionList);
  store.commit('permission/updateState', {
    permRouter: filteredRouters,
  });
  const len = $router.options.routes.length;
  const baseRouters = $router.options.routes[len - 1];
  baseRouters.children = filteredRouters;
  $router.options.routes.splice(len - 1, 1, baseRouters);
  $router.addRoutes([baseRouters]);
  console.log($router);
  // authRouters = filteredRouters;
}

// 判断是否有token
const checkIsHaveToken = () => {
  // 首先，判断store中有没有token
  if (store.state.user.token) {
    return true;
    // 其次，如果storage里面有token，就获取storage中的token，然后赋值给store
  }
  if (getStorage('token')) {
    store.commit('user/updateState', {
      token: getStorage('token'),
      name: getStorage('name'),
      info: getStorage('info'),
    });
    return true;
  }
  return false;
};

// router进入前的判断
router.beforeEach((to, from, next) => {
  // 使用nprogress进度条
  NProgress.start();

  // 判断是否有token
  const isHaveToken = checkIsHaveToken();
  // console.log(isHaveToken);
  // 首先判断是否是白名单,如果是白名单,则不判断权限
  if (whiteList.includes(to.name)) {
    // 如果目标是登录页，则跳转到首页
    if (to.name === 'login' && isHaveToken) {
      next('/');
      NProgress.done();
      return false;
    }
    next();
    return false;
  }

  // console.log(1)
  if (!isHaveToken) {
    // 如果没有token则跳转到登录
    if (to.path === '/login') {
      next();
    } else {
      next('/login');
      NProgress.done();
    }
    return false;
  }
  // console.log(2)
  // 判断是否有权限列表
  const {
    permissionList
  } = store.state.permission;
  if (permissionList.length) {
    handleMenuList(to, permissionList);
    // 判断路由是否正确（是否有name)如果路由错误，则跳转到404
    // if (!to.name) {
    //   next({ name: 'Exception-404', replace: true });
    //   NProgress.done();
    //   return false;
    // }
  } else {
    store.dispatch('permission/getPermissions').then((res) => {
      if (res) {
        addRoutes(router, res, () => {
          // 判断路由是否正确（是否有name)如果路由错误，则跳转到404
          // if (authRouters.findIndex(item => item.path === to.path) === -1) {
          //   next({ name: 'Exception-404', replace: true });
          //   NProgress.done();
          //   return false;
          // }
        });
        handleMenuList(to, res);
        next({
          ...to,
          replace: true
        });
      } else {
        next({
          name: 'login',
          replace: true
        });
      }
    });
  }
  // 再处理普通目录重定向跳转的路径
  // const redirectPath = getRedirectPath(to);
  // if (redirectPath) {
  //   next(redirectPath);
  //   NProgress.done();
  //   return false;
  // }


  // console.log('end')
  // 正常情况
  next();
  return false;
});

// router进入后的动作
router.afterEach(() => {
  // console.log('nprogress end')
  NProgress.done();
});
