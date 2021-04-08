<template>
    <div class="ctms-search-box-wrap"
         :style="{height: (isOpen ? `${Math.ceil(allSpanNum / 4) * 80}px` : '80px')}">
        <div class="ctms-search-box"
             :style="boxStyle">
            <Row ref="node">
                <slot></slot>
            </Row>
            <div class="search-btns" v-if="isShowBtn">
                <Button @click="handleReset">{{resetTxt}}</Button>
                <Button @click="handleSearch"
                        :loading="loading"
                        type="primary">{{searchTxt}}</Button>
                <Button v-if="allSpanNum > 4" :type="isOpen ? 'primary' : 'default'"
                        @click="switchOpen"
                        class="switch-btn"
                        shape="circle">
                    <Icon type="ios-more"/>
                </Button>
            </div>
        </div>
    </div>

</template>

<script>
import './style.less';

export default {
  name: 'SearchBox',
  data() {
    return {
      isOpen: false,
      allSpanNum: 0,
    };
  },
  props: {
    searchTxt: {
      type: String,
      default: '查询',
    },
    resetTxt: {
      type: String,
      default: '重置',
    },
    isShowBtn: {
      type: Boolean,
      default: true,
    },
    paddingRight: {
      type: Number,
      default: 150,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    switchOpen() {
      this.isOpen = !this.isOpen;
    },
    handleReset() {
      this.$emit('onReset');
    },
    handleSearch() {
      this.$emit('onSearch');
    },
  },
  computed: {
    boxStyle() {
      let paddingRight = this.allSpanNum > 4 ? `${this.paddingRight + 50}px` : `${this.paddingRight}px`;
      paddingRight = this.isShowBtn ? paddingRight : '0';
      return {
        // height: this.isOpen ? `${Math.ceil(this.allSpanNum / 4) * 80}px` : '80px',
        paddingRight,
      };
    },
  },
  mounted() {
    if (this.$refs.node.$children.length) {
      this.$refs.node.$children.forEach((item) => {
        this.allSpanNum += item.colSpan;
      });
    }
  },
};
</script>
