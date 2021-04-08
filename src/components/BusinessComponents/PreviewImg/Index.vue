<template>
  <Modal :value="visible"
         width="700"
         title="图片预览"
         @on-close="onCancel">
    <div class="preview-img-body" :style="{maxHeight: windowHeight - 320 + 'px'}">
      <img :src="getUrlById(fileId, 3)" v-if="fileId"/>
    </div>
    <div class="preview-img-footer">
      <Button
        style="margin-right: 8px"
        @click="onCancel"
      >关闭
      </Button>
    </div>
  </Modal>
</template>

<script>
import { getUrlById } from '@/utils/util';
import { mapState } from 'vuex';

export default {
  name: 'index',
  props: {
    visible: Boolean,
    fileId: String,
  },
  computed: {
    ...mapState(['windowHeight']),
  },
  methods: {
    getUrlById,
    onCancel() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style>
  .preview-img-body{
    text-align: center;
    overflow: auto;
  }
  .preview-img-footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
  }
</style>
