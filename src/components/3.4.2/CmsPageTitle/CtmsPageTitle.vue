<template>
  <div class="page-title-wrapper clearfix">
    <h2 class="page-title">{{title}}</h2>
    <div class="page-title-btn" v-if="btnTitle">
      <Button @click="goBack" icon="md-arrow-back">{{btnTitle}}</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CtmsPageTitle',
  props: {
    title: String,
    btnTitle: String,
    backName: String,
  },
  methods: {
    goBack() {
      this.$router.push({
        name: this.backName,
      });
    },
  },
};
</script>

<style lang="less">
  .page-title-wrapper{
    position: relative;
    height: 50px;
    .page-title{
      height: 50px;
      line-height: 40px;
      font-size: 20px;
      color: #333;
      padding-left: 10px;
    }
    .page-title-btn{
      position: absolute;
      right: 10px;
      top: 5px;
    }
  }
</style>
