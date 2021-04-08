<template>
  <div class="admin-wrapper">
    <ctms-page-title title="短信管理"></ctms-page-title>
    <ctms-search-box @onSearch="searchHandle" @onReset="reset">
      <ctms-search-box-item label="接收手机号">
        <Input type="text" v-model="searchParams.receiver" placeholder="请输入接收手机号"></Input>
      </ctms-search-box-item>
      <ctms-search-box-item label="验证码">
        <Input type="text" v-model="searchParams.confirmCode" placeholder="请输入验证码"></Input>
      </ctms-search-box-item>
      <ctms-search-box-item label="状态">
        <Select v-model="searchParams.isSuccess" :transfer="true">
          <Option v-for="(item, index) in statusList" :key="index" :value="item.key">
            {{item.value}}
          </Option>
        </Select>
      </ctms-search-box-item>
    </ctms-search-box>
    <ctms-data-grid :data="dataList" :columns="columns" :loading="loading" :height="tableHeight" :page="page">
    </ctms-data-grid>
  </div>
</template>


<script>
import api from '@/api/gadget'
import { mapState } from 'vuex'
import moment from 'moment'
const { getMessageList } = api

export default {
  name: 'gadgetList',
  data() {
    return {
      loading: false,
      isInitList: false,
      dataList: [],
      statusList: [
        { key: 0, value: '失败' },
        { key: 1, value: '成功' },
      ],
      searchParams: {
        receiver: '',
        confirmCode: '',
        isSuccess: '',
      },
      oldSearchParams: {
        receiver: '',
        confirmCode: '',
        isSuccess: '',
      },
      columns: [
        {
          key: 'sendTime',
          title: '发送时间',
          minWidth: 120,
          render: (h, params) =>
            h(
              'span',
              null,
              params.row.sendTime
                ? moment(params.row.sendTime).format('YYYY-MM-DD HH:mm:ss')
                : ''
            ),
        },
        {
          key: 'receiver',
          title: '接受手机号',
          minWidth: 120,
        },
        {
          key: 'confirmCode',
          title: '验证码',
          minWidth: 120,
        },
        {
          key: 'isSuccess',
          title: '状态',
          minWidth: 120,
          render: (h, params) =>
            h(
              'span',
              null,
              params.row.isSuccess === 0
                ? '发送失败'
                : params.row.isSuccess === 1
                ? '发送成功'
                : '--'
            ),
        },
        {
          key: 'content',
          title: '异常描述',
          minWidth: 120,
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
        on: {
          onChange: this.onChange,
          onPageSizeChange: this.onPageSizeChange,
        },
      },
    }
  },
  computed: {
    ...mapState({
      tableHeight: (state) => state.windowHeight - 310,
    }),
  },
  methods: {
    async pageList() {
      this.loading = true
      const res = await getMessageList({
        pageNum: this.page.current,
        pageSize: this.page.pageSize,
        ...this.oldSearchParams,
      })
      if (res) {
        this.dataList = res.data.list
        this.page.total = res.data.total
      }
      this.loading = false
    },
    // 页码改变
    onChange(current) {
      this.page.current = current
      this.$nextTick(() => {
        this.pageList()
      })
    },
    // 页面显示数改变
    onPageSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.$nextTick(() => {
        this.pageList()
      })
    },
    reset() {
      this.searchParams = {}
      this.searchHandle()
    },
    searchHandle() {
      this.oldSearchParams = Object.assign({}, this.searchParams)
      this.page.current = 1
      this.$nextTick(() => {
        this.pageList()
      })
    },
  },
  activated() {
    if (!this.isInitList) {
      this.pageList()
    }
  },
  mounted() {
    this.pageList()
    this.isInitList = true
  },
  deactivated() {
    this.isInitList = false
  },
}
</script>

<style lang="less">
.admin-wrapper {
  position: relative;
}
</style>
