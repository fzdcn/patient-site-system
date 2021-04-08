<template>
  <Icon :custom="customType" :size="size" />
</template>

<script>
import './style.css';
import '@/assets/iconFont/iconfont.css';

export default {
  name: 'CtmsIcon',
  props: {
    type: {
      required: true,
      default: '',
      type: String,
    },
    size: {
      default: 16,
      type: Number,
    },
  },
  computed: {
    customType() {
      return `i-icon ${this.type}`;
    },
  },
};
</script>

<style scoped>

</style>
