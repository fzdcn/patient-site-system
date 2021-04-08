const path = require('path');
// 使用require.context() 来导入多个组件 这样不用一个个引入需要挂载得组件
const files = require.context('@/components/3.4.2', true, /\.vue$/);
const ctmsComponents = {};
files.keys().forEach((key) => {
  const name = path.basename(key, '.vue');
  ctmsComponents[name] = files(key).default || files(key);
});
const install = (Vue) => {
  if (install.installed) return;
  Object.keys(ctmsComponents).forEach((key) => {
    Vue.component(key, ctmsComponents[key]);
  });
};
// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
const CtmsComponents = {
  install,
  ...ctmsComponents,
};
export default CtmsComponents;
