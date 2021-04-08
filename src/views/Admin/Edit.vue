<template>
  <div class="admin-add-wrapper">
    <Spin v-if="loading" fix></Spin>
    <EditAction>
      <h2>{{title}}</h2>
      <Button @click="back">返回列表</Button>
      <Button @click="submit" type="primary" v-if="!isView">保存</Button>
    </EditAction>
    <Form :model="formData" ref="form" label-position="left" :rules="rules">
      <Row :gutter="16">
        <Col span="8">
        <FormItem label="用户姓名:" prop="name">
          <Input type="text" v-model="formData.name" :disabled="!pwdLoading" placeholder="请输入手机号码" v-if="!isView"></Input>
          <span v-else>{{formData.name || '--'}}</span>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="认证:" prop="auth">
          <Input type="text" readonly @on-focus="e=>e.target.removeAttribute('readonly')" v-model="formData.auth" v-if="!isView"></Input>
          <span v-else>{{formData.auth || '--'}}</span>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="编号:" prop="code">
          <Input v-if="!isView" type="password" readonly @on-focus="e=>e.target.removeAttribute('readonly')" v-model="formData.password"></Input>
          <span v-else>{{formData.code || '--'}}</span>
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="8">
        <FormItem label="用户类型:" prop="type">
          <Input type="text" v-model="formData.type" :disabled="!pwdLoading" placeholder="请输入手机号码" v-if="!isView"></Input>
          <span v-else>{{formData.type === 1 ? '受试者' : '其他'}}</span>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="手机号:" prop="mobile">
          <Input type="text" readonly @on-focus="e=>e.target.removeAttribute('readonly')" v-model="formData.mobile" v-if="!isView"></Input>
          <span v-else>{{formData.mobile || '--'}}</span>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="身份证号:" prop="idCard">
          <Input v-if="!isView" type="password" readonly @on-focus="e=>e.target.removeAttribute('readonly')" v-model="formData.idCard"></Input>
          <span v-else>{{formData.idCard || '--'}}</span>
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="8">
        <FormItem label="银行卡:" prop="bankNumber">
          <Input type="text" v-model="formData.bankNumber" :disabled="!pwdLoading" placeholder="请输入手机号码" v-if="!isView"></Input>
          <span v-else>{{formData.bankNumber || '--'}}</span>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="预留手机号:" prop="bankPhone">
          <Input type="text" readonly @on-focus="e=>e.target.removeAttribute('readonly')" v-model="formData.bankPhone" v-if="!isView"></Input>
          <span v-else>{{formData.bankPhone || '--'}}</span>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="开户行:" prop="bankName">
          <Input v-if="!isView" type="password" readonly @on-focus="e=>e.target.removeAttribute('readonly')" v-model="formData.bankName"></Input>
          <span v-else>{{formData.bankName || '--'}}</span>
        </FormItem>
        </Col>
      </Row>
      <Row :gutter="16">
        <Col span="8">
        <FormItem label="开户行支行名称:" prop="bankBranch">
          <Input type="text" v-model="formData.bankBranch" :disabled="!pwdLoading" placeholder="请输入手机号码" v-if="!isView"></Input>
          <span v-else>{{formData.bankBranch || '--'}}</span>
        </FormItem>
        </Col>
        <Col span="8">
        <FormItem label="卡类型:" prop="bankCardType">
          <Input type="text" readonly @on-focus="e=>e.target.removeAttribute('readonly')" v-model="formData.bankCardType" v-if="!isView"></Input>
          <span v-else>{{formData.bankCardType === 0 ? '借记卡' : formData.bankCardType === 1 ? '信用卡' : '--'}}</span>
        </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
import EditAction from '@/components/BusinessComponents/EditAction/Index.vue'
import api from '@/api/admin'
import { pwdsha } from '@/utils/util'
const { getDetail, add, update } = api
export default {
  name: 'Add',
  components: {
    EditAction,
  },
  data() {
    const pwdCheckValidate = (rule, value, callback) => {
      if (this.formData.password !== value) {
        callback(new Error('密码和确认密码不一致'))
      } else {
        callback()
      }
    }
    return {
      formData: {},
      rules: {
        name: { required: true, message: '人员名称不能为空', trigger: 'blur' },
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          // { min: 6, message: '密码最少6个字符', trigger: 'blur' },
          // { max: 32, message: '密码最多32个字符', trigger: 'blur' },
          {
            pattern: /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,32}$/,
            message: '必须包含6-32位大写字母，小写字母，数字',
            trigger: 'blur',
          },
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          // { min: 6, message: '密码最少6个字符', trigger: 'blur' },
          // { max: 32, message: '密码最多32个字符', trigger: 'blur' },
          { validator: pwdCheckValidate, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '手机号码为十一位数字',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
        ],
        realName: {
          required: true,
          message: '用户姓名不能为空',
          trigger: 'blur',
        },
        orgId: {
          required: true,
          type: 'number',
          message: '组织不能为空',
          trigger: 'blur change',
        },
      },
      loading: false,
      pwdLoading: true,
      orgList: [],
    }
  },
  computed: {
    updateId() {
      return this.$route.query.id
    },
    isView() {
      return this.$route.query.op === 'view'
    },
    title() {
      let str = ''
      if (!this.updateId) {
        str = '新增人员'
      }
      if (this.updateId && this.isView) {
        str = '查看人员'
      }
      if (this.updateId && !this.isView) {
        str = '修改人员'
      }
      return str
    },
  },
  mounted() {
    if (this.updateId) {
      this.getDetail()
      this.pwdLoading = false
    }
  },
  methods: {
    async getDetail() {
      this.loading = true
      const res = await getDetail(this.updateId)
      if (res) {
        this.formData = {
          ...res.data,
        }
      }
      this.loading = false
    },
    back() {
      this.$router.push({ name: 'admin' })
    },
    async submit() {
      const valid = await this.$refs.form.validate()
      if (valid) {
        this.loading = true
        const formData = JSON.parse(JSON.stringify(this.formData))
        let res = false
        if (this.updateId) {
          res = await update(formData)
        } else {
          formData.password = pwdsha(
            formData.password,
            'uy.L_-6q4LY@a25M9R.comGgNAu.8jS@Wo'
          )
          res = await add(formData)
        }
        if (res) {
          this.$Message.success('操作成功')
          this.back()
        }
        this.loading = false
      }
    },
  },
}
</script>

<style lang="less">
.admin-add-wrapper {
  position: relative;
}
</style>
