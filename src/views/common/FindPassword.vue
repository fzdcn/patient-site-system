<template>
  <div class="login findPassword">
    <canvas v-canvas-background></canvas>
    <h1 class="logo">
      <img src="../../assets/img/login/logo.png"/>
    </h1>
    <main class="main-con">
      <div class="title-img">
        <span></span>
        <img src="../../assets/img/login/title.png"/>
      </div>
      <h2>临床中心快速启动</h2>
      <login-form :form-data="findPasswordForm"
                  type="findPassword"></login-form>
    </main>
    <footer class="footer">
      <p>Copyright © 2013-2019 Oceanus-plus.com All Rights Reserved</p>
      <p>铨融医药科技开发有限公司 版权所有 苏ICP备17013354号</p>
    </footer>
  </div>
</template>
<script>
import LoginForm from '@/components/login/LoginForm.vue';

export default {
  components: {
    LoginForm,
  },
  data() {
    return {
      findPasswordForm: {
        mobile: '',
        smsCode: '',
        password: '',
        imageCode: '',
        repeatPassword: '',
      },
    };
  },
  created() {
  },
  methods: {
  },
};
</script>
<style lang="less">
  @import '../../assets/less/login.less';
</style>
