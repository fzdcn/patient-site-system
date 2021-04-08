<template>
  <Form class="login-form"
        ref="form"
        :model="formData"
        :rules="rules" >
    <FormItem  prop="mobile">
      <Input v-model.trim="formData.mobile"
             :maxlength="11"
             clearable
             @on-keyup.enter="handleSubmit"
             placeholder="请输入11位手机号码"></Input>
    </FormItem>
    <FormItem  prop="smsCode">
      <Input v-model.trim="formData.smsCode"
             @on-keyup.enter="handleSubmit"
             placeholder="请输入6位短信验证码"></Input>
      <Button :class="['btn-code',{'hide': isCountDown} ]"
              @click="sendCode('messageForm')"
              :loading="sendLoading">获取验证码</Button>
      <Button :class="['btn-code', 'btn-count',{'hide': !isCountDown} ]">{{count}}S</Button>
    </FormItem>
    <FormItem  prop="imageCode" v-if="!captcha">
      <Input v-model.trim="formData.imageCode"
             @on-keyup.enter="handleSubmit"
             placeholder="请输入图片验证码"></Input>
      <img class="btn-code veriCodeImg" @click="getImgValidation"
           :src="imgSrc"/>
    </FormItem>
    <NetEaseValidate id="messageCaptcha"
                     @on-init-success="handleInitSuccess"
                     @on-init-fail="handleInitFail"
                     @on-validate="handleValidate"></NetEaseValidate>
    <FormItem>
      <Button class="login-btn" type="primary"
              style="margin-top: 10px"
              long
              :loading="submitLoading"
              @click="handleSubmit">
        登录
      </Button>
    </FormItem>
  </Form>
</template>

<script>
import api from '@/api/user';
import { setStorage } from '@/utils/storage';
import NetEaseValidate from '@/components/NetEaseValidate/Index.vue';

const {
  getImgValidation, smsLogin, getSmsCode,
} = api;
export default {
  name: 'MessageLogin',
  components: {
    NetEaseValidate,
  },
  data() {
    return {
      formData: {},
      rules: {
        mobile: { required: true, message: '请输入手机号码', trigger: 'blur' },
        smsCode: { required: true, message: '请输入6位短信验证码', trigger: 'blur' },
        imageCode: { required: true, message: '请输入图片验证码', trigger: 'blur' },
      },
      captcha: {},
      validateData: '',
      imgSrc: '',
      isCountDown: false,
      count: 1,
      sendLoading: false,
      submitLoading: false,
    };
  },
  methods: {
    // 获取图片验证码
    async getImgValidation() {
      const res = await getImgValidation();
      if (res) {
        this.imgSrc = res.data;
      }
    },
    // 提交
    async handleSubmit() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        if (this.captcha) {
          if (!this.validateData) {
            this.$Message.error('请先点击验证码完成验证');
          } else {
            this.loginSubmit();
          }
        } else {
          this.loginSubmit();
        }
      }
    },
    async loginSubmit() {
      this.submitLoading = true;
      const {
        mobile, smsCode, imageCode,
      } = this.formData;
      const res = await smsLogin({
        mobile,
        smsCode,
        imageCode,
        netEaseCode: this.validateData,
        // isAdmin: 1,
        checkValidateCode: !this.validateData,
      });
      if (res) {
        this.$Message.success('登录成功!');
        this.$store.commit('user/updateState', {
          token: res.data,
        });
        setStorage({ token: res.data });
        // 获取个人信息
        await this.$store.dispatch('user/getInfo').then(() => {
          this.$router.push('/');
        });
      } else {
        this.loginFail();
      }
      this.submitLoading = false;
    },
    // 登录失败
    loginFail() {
      if (this.captcha) {
        this.captcha.refresh();
        this.validateData = '';
      } else {
        this.getImgValidation();
      }
    },
    // 倒计时
    countDown() {
      this.$Message.success('发送成功');
      this.isCountDown = true;// 发送成功,显示倒计时；
      this.$nextTick(() => {
        this.count = 60;
        const timer = setInterval(() => {
          if (this.count === 1) {
            this.isCountDown = false;
            clearInterval(timer);
            return;
          }
          this.count -= 1;
        }, 1000);
      });
    },
    // 发送验证码
    async sendCode() {
      const err = await this.$refs.form.validateField('mobile');
      if (!err) {
        await this.getLoginSmscode();
      }
    },
    // 登录验证码
    async getLoginSmscode() {
      this.sendLoading = true;
      const res = await getSmsCode({ mobile: this.formData.mobile });
      if (res) {
        this.countDown();
      }
      this.sendLoading = false;
    },
    // 网易验证成功
    handleValidate(validate) {
      this.validateData = validate;
    },
    // 网易验证码初始化成功
    handleInitSuccess(instance) {
      this.captcha = instance;
    },
    // 网易验证码初始化失败
    handleInitFail() {
      this.captcha = null;
      this.getImgValidation();
    },
  },
};
</script>

<style>

</style>
