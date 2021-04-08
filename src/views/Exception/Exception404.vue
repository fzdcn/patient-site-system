<template>
  <div class="error-wrap">
    <div class="img-con">
      <img src="../../assets/img/404.png" alt="">
    </div>
    <Button class="back-home" type="primary" size="large" @click="backToHome">返回首页</Button>
  </div>
</template>
<script>
export default {
  data() {
    return {

    };
  },
  methods: {
    backToHome() {
      this.$router.push({
        name: 'Index',
      });
    },
  },
};
</script>
<style lang="less">
  .error-wrap{
    text-align: center;
    height: 100%;
    overflow: auto;
    padding: 35px 0;
    background-color: #f4f4f4;
    text-align: center;
    .img-con{
      margin-bottom: 10px;
    }
    .back-home{
      font-size: 20px;
      border-radius: 25px;
      padding: 8px 35px;
    }
  }
</style>
