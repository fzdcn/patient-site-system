<template>
  <div class="login">
    <canvas v-canvas-background></canvas>
    <h1 class="logo">
      <img src="../../assets/img/login/logo.png" />
    </h1>
    <main class="main-con">
      <h2>用户端后台管理系统</h2>
      <div class="login-register-form">
        <div class="main-con-form-wrap">
          <slot></slot>
        </div>
      </div>
    </main>
    <footer class="footer">
      <p>Copyright © 2013-2020 Oceanus-plus.com All Rights Reserved</p>
      <p>铨融医药科技开发有限公司 版权所有 苏ICP备17013354号</p>
    </footer>
    <div class="version-text">V3.5.5</div>
  </div>
</template>

<script>
import './style.less'

export default {}
</script>
