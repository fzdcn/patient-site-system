<template>
    <div>
        <Col :span="colSpan * 6" class="item-wrap">
            <p class="search-box-item-label">{{label ? label + ':': ''}}</p>
            <slot></slot>
        </Col>
    </div>
</template>

<script>

export default {
  name: 'SearchBoxItem',
  props: {
    label: {
      default: '',
      type: String,
      required: true,
    },
    span: {
      default: 1,
      type: Number,
    },
  },
  computed: {
    colSpan() {
      if (this.span > 4 || this.span < 1) {
        return 1;
      }
      return this.span;
    },
  },
};
</script>
