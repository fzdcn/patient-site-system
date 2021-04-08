<template>
  <div class="admin-wrapper">
    <ctms-page-title title="用户管理"></ctms-page-title>
    <ctms-search-box @onSearch="searchHandle" @onReset="reset">
      <ctms-search-box-item label="用户姓名">
        <Input type="text" v-model="searchParams.name" placeholder="请输入用户姓名"></Input>
      </ctms-search-box-item>
      <ctms-search-box-item label="手机号">
        <Input type="text" v-model="searchParams.mobile" placeholder="请输入手机号"></Input>
      </ctms-search-box-item>
      <ctms-search-box-item label="用户类型">
        <Select v-model="searchParams.type" :transfer="true">
          <Option v-for="(item, index) in userTypeList" :key="index" :value="item.userType">
            {{item.userTypeName}}
          </Option>
        </Select>
      </ctms-search-box-item>
    </ctms-search-box>
    <ctms-data-grid :data="dataList" :columns="columns" :loading="loading" :height="tableHeight" :page="page">
    </ctms-data-grid>
  </div>
</template>


<script>
import api from '@/api/admin'
import { mapState } from 'vuex'

const { pageList, resetMessage, emptyAuthCount, deleteUser } = api

export default {
  name: 'admin',
  data() {
    return {
      loading: false,
      isInitList: false,
      dataList: [],
      userTypeList: [
        { userType: '1', userTypeName: '受试者' },
        { userType: '2', userTypeName: '其他' },
      ],
      searchParams: {
        name: '',
        mobile: '',
        type: '',
      },
      oldSearchParams: {
        name: '',
        mobile: '',
        type: '',
      },
      columns: [
        {
          key: 'name',
          title: '用户姓名',
          minWidth: 120,
        },
        {
          key: 'idCard',
          title: '身份证号',
          minWidth: 120,
        },
        {
          key: 'mobile',
          title: '手机号',
          minWidth: 120,
        },
        {
          key: 'bankCardNo',
          title: '银行卡',
          minWidth: 120,
        },
        {
          key: 'type',
          title: '用户类型',
          minWidth: 120,
          render: (h, params) =>
            h(
              'span',
              null,
              params.row.type === '1'
                ? '受试者'
                : params.row.type === '2'
                ? '其他'
                : '--'
            ),
        },
        {
          key: 'action',
          title: '操作',
          width: 150,
          fixed: 'right',
          renderButton: (params) => {
            const btnList = [
              {
                label: '查看',
                on: {
                  click: () => this.handleUpdate('view', params),
                },
              },
              {
                label: '重置短信次数',
                on: {
                  click: this.resetMessage,
                },
              },
              {
                label: '清空认证次数',
                on: {
                  click: this.emptyAuthCount,
                },
              },
              {
                label: '删除用户',
                on: {
                  click: this.handDelete,
                },
              },
            ]
            return btnList.filter((item) => !!item)
          },
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
      const res = await pageList({
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
    handleAdd() {
      this.$router.push({ name: 'admin.edit' })
    },
    handleUpdate(flag, { row }) {
      this.$router.push({
        name: 'admin.edit',
        query: {
          id: row.userId,
          op: flag,
        },
      })
    },
    async resetMessage({ row: { mobile } }) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否重置用户短信接收次数</p>',
        onOk: async () => {
          this.loading = true
          const res = await resetMessage({ mobile: mobile })
          if (res) {
            this.$Message.success('重置成功')
            this.pageList()
          } else {
            this.loading = false
          }
        },
      })
    },
    async emptyAuthCount({ row: { userId } }) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否清空认证次数</p>',
        onOk: async () => {
          this.loading = true
          const res = await emptyAuthCount({ userId: userId })
          if (res) {
            this.$Message.success('清空认证次数成功')
            this.pageList()
          } else {
            this.loading = false
          }
        },
      })
    },
    async handDelete({ row: { userId } }) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否删除用户信息</p>',
        onOk: async () => {
          this.loading = true
          const res = await deleteUser({ userId: userId })
          if (res) {
            this.$Message.success('删除成功')
            this.pageList()
          } else {
            this.loading = false
          }
        },
      })
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
      this.searchParams = {
        name: '',
      }
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
