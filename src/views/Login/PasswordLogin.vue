<template>
  <div>
    <Form class="login-form" ref="form" :model="formData" :rules="rules">
      <FormItem prop="username">
        <Input v-model.trim="formData.username" clearable @on-keyup.enter="handleSubmit" placeholder="请输入手机号码"></Input>
      </FormItem>
      <FormItem prop="password">
        <Input v-model.trim="formData.password" @on-keyup.enter="handleSubmit" type="password" clearable placeholder="请输入登录密码"></Input>
      </FormItem>
      <NetEaseValidate id="passwordCaptcha" @on-init-success="handleInitSuccess" @on-init-fail="handleInitFail" @on-validate="handleValidate"></NetEaseValidate>
      <FormItem prop="imageCode" v-if="!captcha">
        <Input v-model.trim="formData.imageCode" @on-keyup.enter="handleSubmit" placeholder="请输入图片验证码"></Input>
        <img class="btn-code veriCodeImg" @click="getImgValidation" :src="imgSrc" />
      </FormItem>
      <FormItem>
        <Button class="login-btn" type="primary" style="margin-top: 10px" long="" :loading="submitLoading" @click="handleSubmit('passwordForm')">
          登录
        </Button>
      </FormItem>
      <!-- <FormItem>
        <span class="forget-password" @click="forgetPassVisible = true;">忘记密码？</span>
      </FormItem> -->
    </Form>
    <ForgetPassword :forgetPassVisible="forgetPassVisible" @onClose="forgetPassVisible = false"></ForgetPassword>
  </div>
</template>

<script>
import api from '@/api/user'
import { setStorage } from '@/utils/storage'
import { pwdsha } from '@/utils/util'
import NetEaseValidate from '@/components/NetEaseValidate/Index.vue'
import ForgetPassword from './ForgetPassword.vue'

const { getImgValidation, passwordLogin } = api
export default {
  name: 'PasswordLogin',
  components: {
    NetEaseValidate,
    ForgetPassword,
  },
  data() {
    return {
      formData: {},
      rules: {
        username: {
          required: true,
          message: '请输入手机号码',
          trigger: 'blur',
        },
        password: {
          required: true,
          message: '请输入登录密码',
          trigger: 'blur',
        },
        imageCode: {
          required: true,
          message: '请输入图片验证码',
          trigger: 'blur',
        },
      },
      captcha: {},
      validateData: '',
      imgSrc: '',
      submitLoading: false,
      forgetPassVisible: false,
    }
  },
  methods: {
    // 获取图片验证码
    async getImgValidation() {
      const res = await getImgValidation()
      if (res) {
        this.imgSrc = res.data
      }
    },
    // 提交
    async handleSubmit() {
      const valid = await this.$refs.form.validate()
      if (valid) {
        if (this.captcha) {
          if (!this.validateData) {
            this.$Message.error('请先点击验证码完成验证')
          } else {
            this.loginSubmit()
          }
        } else {
          this.loginSubmit()
        }
      }
    },
    async loginSubmit() {
      this.submitLoading = true
      const { username, password, imageCode } = this.formData
      const res = await passwordLogin({
        username,
        password: this.passwordToSha(password),
        netEaseCode: this.validateData,
        imageCode,
        // isAdmin: 1,
        checkValidateCode: !this.validateData,
      })
      if (res) {
        this.$Message.success('登录成功!')
        this.$store.commit('user/updateState', {
          token: res.data,
        })
        setStorage({ token: res.data })
        // 获取个人信息
        await this.$store.dispatch('user/getInfo').then(() => {
          this.$router.replace('/')
        })
      } else {
        this.loginFail()
      }
      this.submitLoading = false
    },
    // 登录失败
    loginFail() {
      if (this.captcha) {
        this.validateData = ''
        this.captcha.refresh()
      } else {
        this.getImgValidation()
      }
    },
    // 密码加密
    passwordToSha: (str) => pwdsha(str, 'uy.L_-6q4LY@a25M9R.comGgNAu.8jS@Wo'),
    // 网易验证成功
    handleValidate(validate) {
      this.validateData = validate
    },
    // 网易验证码初始化成功
    handleInitSuccess(instance) {
      this.captcha = instance
    },
    // 网易验证码初始化失败
    handleInitFail() {
      this.captcha = null
      this.getImgValidation()
    },
  },
}
</script>
<style lang="less" scoped>
.forget-password {
  cursor: pointer;
  color: #0000ff;
  float: left;
}
</style>
