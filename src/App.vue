<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
// import '@/globalStyle/index.less';
import { mapMutations } from 'vuex'

export default {
  created() {
    // 删除loading动画
    document.body.removeChild(document.getElementById('appLoading'))
    document.body.style.backgroundColor = '#fff'
    setTimeout(() => {
      document.getElementById('app').style.display = 'block'
    }, 500)
    // 监听窗口大小变化
    window.onresize = () => {
      this.updateState({
        contentHeight: document.documentElement.clientHeight - 136,
        windowHeight: document.documentElement.clientHeight, // 整体屏幕的高度
      })
    }
  },
  methods: {
    ...mapMutations(['updateState']),
  },
}
</script>
<style lang="less">
@import 'globalStyle/index';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  .main-content {
    margin: 0 auto;
    width: 1366px;
  }
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
