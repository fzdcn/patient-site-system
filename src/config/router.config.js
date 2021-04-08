export const mainRouters = [
  // 管理员
  {
    path: '/admin',
    name: 'admin',
    title: '用户管理',
    component: () => import('@/views/Admin/Index.vue'),
    meta: {
      type: 'menu',
      permission: 'P0001',
      icon: 'iconfont iconrenyuan',
    },
  },
  {
    path: '/admin/edit',
    name: 'admin.edit',
    component: () => import('@/views/Admin/Edit.vue'),
    meta: {
      permission: 'P0001',
    },
  },
  // 小工具
  {
    path: '/gadget',
    name: 'gadget',
    title: '小工具',
    component: () => import('@/views/Gadget/Index.vue'),
    meta: {
      type: 'menu',
      permission: 'P0002',
      isSubMenu: true,
      icon: 'iconfont iconbaoshuiguanli',
    },
  },
  {
    path: 'list',
    name: 'gadgetList',
    title: '短信',
    component: () => import('@/views/Gadget/List.vue'),
    meta: {
      permission: 'P0003',
      icon: 'iconfont iconbaoshuiliebiao',
    },
  }
];
const gadgetChildren = [{
  path: 'list',
  name: 'gadgetList',
  title: '短信',
  component: () => import('@/views/Gadget/List.vue'),
  meta: {
    permission: 'P0003',
    icon: 'iconfont iconbaoshuiliebiao',
  },
}];

export const whiteRouters = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/LoginIndex.vue'),
  },
  {
    path: '/404',
    name: 'Exception-404',
    component: () => import('@/views/Exception/Exception404.vue'),
  },
  {
    path: '/403',
    name: 'Exception-403',
    component: () => import('@/views/Exception/Exception403.vue'),
  },
];
export const baseRouters = [{
  path: '/',
  name: 'Index',
  component: () => import('@/Layouts/MainLayout/Index.vue'),
  meta: {
    permission: 'no',
  },
  /* children: [
    ...mainRouters,
    ...projectRouters,
  ], */
}, ];
// export const paymentOrderChildren = [
//   {
//     path: '/paymentOrder/list',
//     name: 'paymentOrderList',
//     title: '订单列表',
//     component: () => import('@/views/PaymentOrder/List.vue'),
//     meta: {
//       permission: 'P0031',
//       keepAlive: true,
//       icon: 'iconfont icondingdanguanli',
//     },
//   },
// ];

export const mainRouterObj = {
  mainRouters,
  gadgetChildren
};
export const allRouters = [
  ...mainRouters
];
