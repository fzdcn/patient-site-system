<template>
  <Modal
    v-model="visibleDialog"
   @on-cancel="handleCancel"
    v-bind="$props"
    v-on="$listeners">
<!--    -->
      <slot></slot>
      <template #footer>
        <slot name="footer">
          <span>
            <Button @click="handleCancel">取消</Button>
            <Button @click="$emit('onConfirm')" type="primary">确定</Button>
          </span>
        </slot>
      </template>
    </Modal>
</template>

<script>
import { Modal } from 'view-design';

export default {
  name: 'CtmsModal',
  props: {
    ...Modal.props,
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '提示',
    },
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible;
      },
      set() {
        this.$emit('update:visible', false);
      },
    },
  },
  methods: {
    handleCancel() {
      this.visibleDialog = false;
    },
  },
  mounted() {
    console.log(Modal.props);
    console.log(this.$listeners);
  },
};
</script>

<style scoped>

</style>
