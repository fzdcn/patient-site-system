<template>
  <div class="main-wrapper">
    <!--    {{keepAlive}}-->
    <MainHeader></MainHeader>
    <div style="height:calc(100% - 60px );width:100%;overflow-y: scroll;">
      <div style="display: flex; flex-direction: row;min-height: 100%;min-height: 100%;">
        <MainMenu></MainMenu>
        <div class="main-content-wrapper">
          <keep-alive :include="keepAlive">
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MainHeader from './MainHeader.vue'
import MainMenu from './MainMenu.vue'

export default {
  name: 'index',
  components: {
    MainHeader,
    MainMenu,
  },
  computed: {
    ...mapState('permission', ['keepAlive']),
  },
}
</script>

<style lang="less">
.main-wrapper {
  height: 100%;
  position: relative;
}
.main-content-wrapper {
  padding: 20px;
  position: absolute;
  top: 60px;
  bottom: 0;
  right: 0;
  left: 190px;
  overflow: auto;
  background-color: #f4f6f9;
  .slide-fade {
    position: absolute;
    left: 0;
    right: 0;
  }
  .slide-fade-enter-active {
    transition: all 0.8s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.1s cubic-bezier(2, 0.5, 0.8, 1);
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    left: 0;
    right: 0;
    transform: translateX(50px);
    opacity: 0;
  }
}
</style>
