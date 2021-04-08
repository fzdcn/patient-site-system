<template>
  <div class="upload-file-wrapper">
    <Spin fix v-if="loading"></Spin>
    <div class="upload-img-wrapper" v-if="fileId">
      <img :src="getUrlById(fileId, 3)"/>
      <div class="upload-img-cover">
        <div class="upload-img-btn-wrap">
          <Icon type="ios-eye-outline" @click.native="handlePreview"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
        </div>
      </div>
    </div>
    <Upload
      v-if="!isView"
      ref="upload"
      :show-upload-list="false"
      :format="format"
      :before-upload="handleBeforeUpload"
      action="/"
      class="upload-wrapper">
      <div class="upload-btn">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <PreviewImg :visible.sync="previewVisible"
                :fileId="fileId"></PreviewImg>
  </div>
</template>

<script>
import commonApi from '@/api/common';
import { getUrlById } from '@/utils/util';
import PreviewImg from '@/components/BusinessComponents/PreviewImg/Index.vue';

const {
  uploadFile,
} = commonApi;
export default {
  name: 'index',
  props: {
    tenantType: String,
    fileId: String,
    maxLength: Number,
    isView: Boolean,
    format: {
      type: Array,
      default() {
        return ['jpg', 'jpeg', 'png'];
      },
    },
  },
  components: {
    PreviewImg,
  },
  data() {
    return {
      loading: false,
      previewVisible: false,
    };
  },
  methods: {
    getUrlById,
    handleBeforeUpload(file) {
      const nameArr = file.name.split('.');
      const type = nameArr[nameArr.length - 1];
      if (this.format.indexOf(type) === -1) {
        this.$Message.error('上传文件格式不正确!');
        return false;
      }
      this.uploadFile(file);
      return false;
    },
    async uploadFile(file) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('tenantType', this.tenantType);
      this.loading = true;
      const res = await uploadFile(fd);
      if (res) {
        this.$emit('on-upload-success', res.data);
      }
      this.loading = false;
    },
    handlePreview() {
      this.previewVisible = true;
    },
    handleRemove() {
      this.$emit('on-remove');
    },
  },
};
</script>

<style lang="less">
  .upload-file-wrapper{
    position: relative;
    .upload-img-wrapper{
      height: 100px;
      width: 100px;
      border: 1px solid #eee;
      position: relative;
      .upload-img-cover{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0, .7);
        transition: opacity .3s;
        opacity: 0;
        &:hover{
          opacity: 1;
        }
        .upload-img-btn-wrap{
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          text-align: center;
          .ivu-icon{
            color: #fff;
            margin: 0 5px;
            font-size: 26px;
            cursor: pointer;
          }
        }
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
    .upload-wrapper{
      .upload-btn{
        height: 100px;
        width: 100px;
        border: 1px solid #eee;
        text-align: center;
        cursor: pointer;
        position: relative;
        .upload-img-btn-wrap{
          position: absolute;
          .ivu-icon{
            font-size: 24px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
  }
</style>
