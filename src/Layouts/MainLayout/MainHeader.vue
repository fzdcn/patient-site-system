<template>
  <header class="main-header-wrap clearfix">
    <div class="logo">
      <router-link to="/org">
        <img src="../../assets/img/login/logo.png"/>
      </router-link>
    </div>
    <div class="info">
      <span class="username">{{name}}</span>
      <span class="logout" @click="logout">退出登录</span>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MainHeader',
  computed: {
    ...mapState('user', ['name']),
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout');
    },
  },
};
</script>

<style lang="less">
  .main-header-wrap{
    height: 60px;
    background-color: @primary-color;
    .logo{
      float: left;
      padding: 5px 10px;
      img{
        height: 50px;
      }
    }
    .info{
      float: right;
      line-height: 60px;
      padding-right: 20px;
      .username{
        color: #fff;
        margin-right: 15px;
      }
      .logout{
        color: #fff;
        cursor: pointer;
      }
    }
  }
</style>
