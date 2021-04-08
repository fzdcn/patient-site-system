<template>
  <FormItem class="captcha-wrap">
    <div :id="id"></div>
  </FormItem>
</template>

<script>
export default {
  name: 'index',
  props: {
    id: String,
  },
  data() {
    return {
      captcha: {},
    };
  },
  mounted() {
    this.initCaptcha((err, data) => {
      if (!err) {
        this.$emit('on-validate', data.validate);
      }
    });
  },
  methods: {
    // 初始化网易验证码
    initCaptcha(callback) {
      if (window.initNECaptcha) {
        window.initNECaptcha({
          element: `#${this.id}`,
          captchaId: 'fe2721817ff9496998abf30222bb1518',
          mode: 'popup', // 仅智能无感知验证码时，mode 才能设置为 bind
          width: '320px',
          enableClose: true, // 由业务方控制验证码弹框关闭
          onVerify(err, data) {
            callback(err, data);
          },
        }, (instance) => {
          // 初始化成功后得到验证实例instance，可以调用实例的方法
          this.$emit('on-init-success', instance);
          this.captcha = instance;
        }, () => {
          // 初始化失败后触发该函数，err对象描述当前错误信息
          this.captcha = null;
          this.$emit('on-init-fail');
        });
      } else {
        this.$emit('on-init-fail');
        this.captcha = null;
      }
    },
  },
};
</script>
