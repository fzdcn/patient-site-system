<template>
  <LoginWrapper>
    <div class="main-con-form">
      <Tabs value="passwordForm"
            :animated="false">
        <TabPane label="用户登录" name="passwordForm" >
          <PasswordLogin></PasswordLogin>
        </TabPane>
      </Tabs>
    </div>
  </LoginWrapper>
</template>
<script>
import LoginWrapper from '@/components/LoginWrapper/Index.vue';
import PasswordLogin from './PasswordLogin.vue';

export default {
  components: {
    LoginWrapper,
    PasswordLogin,
  },
  data() {
    return {
      loginForm: {
        username: '',
        smsCode: '',
        mobile: '',
        password: '',
        imageCode: '',
      },

    };
  },
  created() {

  },
  methods: {
  },
};
</script>
