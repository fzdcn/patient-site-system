<template>
  <Modal :value="visible"
         :styles="{width:'80%'}"
         :title="title"
         @on-close="onCancel">
    <div class="preview-img-body" :style="{maxHeight: windowHeight - 320 + 'px'}">
      <img v-if="title==='图片预览'" :src="src" alt="">
        <iframe v-else :src="src"
                frameborder="0"
                :style="`width: 100%; height: ${windowHeight-350}px`">
        </iframe>

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
    src: String,
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState(['windowHeight']),
  },
  components: {
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
