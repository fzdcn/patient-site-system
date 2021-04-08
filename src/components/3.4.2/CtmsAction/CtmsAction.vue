<template>
    <div class="ctms-action" :style="{textAlign: direction}">
        <slot></slot>
    </div>
</template>

<script>
import './style.less';

export default {
  name: 'CtmsAction',
  props: {
    direction: {
      default: 'left',
      type: String,
    },
  },
};
</script>
