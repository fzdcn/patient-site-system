<template>
  <ctms-action direction="right" class="edit-action-wrapper">
    <slot></slot>
  </ctms-action>
</template>

<script>
export default {
  name: 'index',
};
</script>

<style lang="less">
  .edit-action-wrapper.ctms-action{
    border-bottom: 1px solid #eee;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);
    position: absolute;
    top: -16px;
    left: -16px;
    width: ~'calc(100% + 32px)';
    z-index: 9;
    background-color: #fff;
    + .ivu-form{
      padding-top: 60px;
    }
  }
</style>
