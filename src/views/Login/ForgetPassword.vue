<template>
  <Modal :value="forgetPassVisible"
         :mask-closable="false"
         width="400"
         title="找回密码"
         @on-close="onCancel">
    <Form ref="forgetPassForm"
          :label-width="100"
          :model="formData"
          autocomplete="off"
          :rules="rules" >
      <FormItem prop="mobile" label="手机号">
        <Input v-model="formData.mobile"
               clearable
               placeholder="请输入手机号码"
               style="width: 53%;margin-right: 20px;"
        ></Input>
        <Button :class="['btn-code',{'hide': isCountDown} ]"
                type="primary"
                @click="sendCode('messageForm')"
                :loading="sendLoading">获取验证码</Button>
        <Button :class="['btn-code', 'btn-count',{'hide': !isCountDown} ]">{{count}}S</Button>
      </FormItem>
      <FormItem label="验证码" prop="smsCode" >
        <Input v-model="formData.smsCode"
               autocomplete="off"
               placeholder="请输入验证码"></Input>
      </FormItem>
      <FormItem label="新密码" prop="password">
        <Input v-model="formData.password"
               type="password"
               autocomplete="new-password"
               placeholder="请输入新密码"></Input>
      </FormItem>
      <FormItem label="确认新密码" prop="repeatPassword">
        <Input v-model="formData.repeatPassword"
               type="password"
               placeholder="请输入确认密码"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button
        style="margin-right: 8px"
        @click="onCancel"
      >取消
      </Button>
      <Button
        type="primary"
        style="margin-right: 8px"
        @click="handleSubmit"
      >提交
      </Button>
    </div>
  </Modal>

</template>

<script>
import api from '@/api/user';
import { pwdsha } from '@/utils/util';

const {
  getForgetPassSmsCode, forgetPassword,
} = api;
export default {
  name: 'MessageLogin',
  props: ['forgetPassVisible'],
  data() {
    const pwdCheckValidate = (rule, value, callback) => {
      if (this.formData.password !== value) {
        callback(new Error('密码和确认密码不一致'));
      } else {
        callback();
      }
    };
    return {
      formData: {},
      rules: {
        mobile: { required: true, message: '请输入手机号码', trigger: 'blur' },
        smsCode: { required: true, message: '请输入6位短信验证码', trigger: 'blur' },
        imageCode: { required: true, message: '请输入图片验证码', trigger: 'blur' },
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          // { min: 6, message: '密码最少6个字符', trigger: 'blur' },
          // { max: 32, message: '密码最多32个字符', trigger: 'blur' },
          { pattern: /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,32}$/, message: '必须包含6-32位大写字母，小写字母，数字', trigger: 'blur' },
          // { pattern: /[^a-zA-Z0-9]+/, message: '必须包含大写字母，小写字母，数字', trigger: 'blur' },
        ],
        repeatPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          // { min: 6, message: '密码最少6个字符', trigger: 'blur' },
          // { max: 32, message: '密码最多32个字符', trigger: 'blur' },
          { validator: pwdCheckValidate, trigger: 'blur' },
        ],
      },
      isCountDown: false,
      count: 1,
      sendLoading: false,
      submitLoading: false,
    };
  },
  methods: {
    // 提交
    async handleSubmit() {
      const valid = await this.$refs.forgetPassForm.validate();
      if (!valid) {
        // if (!this.validateData) {
        //   this.$Message.error('请先点击验证码完成验证');
        // } else {
        //   this.loginSubmit();
        // }
        return;
      }
      this.loginSubmit();
    },
    async loginSubmit() {
      this.submitLoading = true;
      const {
        smsCode, mobile,
      } = this.formData;
      const res = await forgetPassword({
        mobile,
        password: this.passwordToSha(this.formData.password),
        smsCode,
        checkValidateCode: false,
      });
      if (res) {
        this.$emit('onClose');
        this.$Message.success('修改成功');
      } else {
        this.$Message.error(res.message);
      }
      this.submitLoading = false;
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
      // const err = await this.$refs.forgetPassForm.validateField('mobile');
      // console.log(err)
      // if (err === false) {
      await this.getLoginSmscode();
      // }
    },
    // 登录验证码
    async getLoginSmscode() {
      this.sendLoading = true;
      const res = await getForgetPassSmsCode({ mobile: this.formData.mobile });
      if (res) {
        this.countDown();
      }
      this.sendLoading = false;
    },
    // 密码加密
    passwordToSha: str => pwdsha(str, 'uy.L_-6q4LY@a25M9R.comGgNAu.8jS@Wo'),
    onCancel() {
      this.$emit('onClose');
    },
  },
};
</script>

<style scoped lang="less">
  .hide{
    display: none;
  }
</style>
