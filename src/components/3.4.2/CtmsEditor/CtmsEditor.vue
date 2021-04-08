<template>
  <div class="ctms-editor">

    <div ref="ctmsEditor">
    </div>
    <span
      @click="clearContent"
      class="trash"
      v-if="clear"
    >
      <Icon
        type="md-trash"
        title="清空内容"
      ></Icon>
    </span>

  </div>
</template>

<script>
import E from 'wangeditor';

const defaultConfig = {
  pasteFilterStyle: false, // 关闭粘贴样式的过滤
  pasteIgnoreImg: false, // 忽略粘贴内容中的图片
  zIndex: 1,
  // 图片上传
  showLinkImg: false, // 是否显示网络上传TAb
  uploadImgTimeout: 60000, // 设置上传图片timeout 时间
  uploadImgMaxSize: 5 * 1024 * 1024, // 默认限制图片大小是 5M
  uploadImgParamsWithUrl: true, // true 时会将自定义参数拼接到 url 中
  uploadImgParams: {}, // 上传图片时可自定义传递一些参数，参数会被添加到formdata中。
  // 图片上传
  // 菜单设置
  menus: [
    'head', // 标题
    'bold', // 粗体
    'fontSize', // 字号
    'fontName', // 字体
    'italic', // 斜体
    'underline', // 下划线
    'strikeThrough', // 删除线
    'foreColor', // 文字颜色
    'backColor', // 背景颜色
    'link', // 插入链接
    'list', // 列表
    'justify', // 对齐方式
    'quote', // 引用
    'table', // 表格
    'undo', // 撤销
    'redo', // 重复
  ],

};
export default {
  name: 'CtmsEditor',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    clear: {
      type: Boolean,
      default: false,
    },
    ctms_config: {
      type: Object,
      default() {
        return defaultConfig;
      },
    },
    height: { // 内容height设置
      type: String,
      default: '300px',
    },
  },
  data() {
    return {
      editorContent: '',
      ctmsEditor: null,
      defaultConfig: {
        ...defaultConfig,
        uploadImgHeaders: { t: this.$store.state.user.token },
        // 自定义提示内容
        customAlert: (info) => {
          this.$Message.error(`${info}`);
        },
        // 监听change事件
        onchange: (html) => {
          this.editorContent = html;
        },
      },
    };
  },
  methods: {
    // 初始化富文本编辑
    initEditor() {
      this.ctmsEditor = new E(this.$refs.ctmsEditor);
      this.$nextTick(() => {
        this.ctmsEditor.customConfig = { ...this.defaultConfig, ...this.ctms_config };
        this.ctmsEditor.create();
        // 是否禁用该富文本
        this.ctmsEditor.$textElem.attr('contenteditable', !this.disabled);
        this.ctmsEditor.$textContainerElem.css('height', `${this.height}`);
      });
    },
    // 清除内容
    clearContent() {
      this.ctmsEditor.txt.clear();
    },
    // 在末尾追加内容
    appendContent(appendHtml) {
      this.ctmsEditor.txt.append(appendHtml);
    },
    // 在光标处添加内容
    insertContent(appendHtml) {
      this.ctmsEditor.cmd.do('insertHTML', appendHtml);
    },
    // 获取内容
    getContent() {
      return this.ctmsEditor.txt.html();
    },
    // 设置内容
    setContent(conTxt) {
      this.ctmsEditor.txt.html(conTxt);
    },

  },
  watch: {
    disabled(val) {
      this.initEditor();
      this.ctmsEditor.$textElem.attr('contenteditable', !val);
    },
    ctms_config(val) {
      this.ctmsEditor.customConfig = { ...this.ctmsEditor.customConfig, ...val };
    },
    height(val) {
      this.ctmsEditor.$textContainerElem.css('height', `${val}`);
    },
  },
  mounted() {
    this.initEditor();
  },
  created() {
  },
};
</script>
<style lang="less" scoped>
.ctms-editor {
  position: relative;
  .trash {
    position: absolute;
    top: -5px;
    right: 5px;
    padding: 10px;
    cursor: pointer;
    .ivu-icon.ivu-icon-md-trash {
      font-size: 20px;
      color: #515a6e;
    }
  }
}
</style>
