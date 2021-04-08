<template>
  <div class="admin-add-wrapper">
    <Spin v-if="loading" fix></Spin>
    <EditAction>
      <h2>重置密码</h2>
      <Button @click="back">返回列表</Button>
      <Button type="primary" @click="restPasswordFn">保存</Button>
    </EditAction>
    <Form :model="formData"
          ref="form"
          label-position="left"
          :rules="rules">
      <Row :gutter="16">
        <Col span="8">
          <FormItem label="新密码:" prop="newPassword">
            <Input
              type="password"
              v-model="formData.newPassword"
              placeholder="请输入新密码"
            ></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="确认密码:" prop="confirmPassword">
            <Input
              type="password"
              v-model="formData.confirmPassword"
              placeholder="请输入确认密码"
            ></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
import EditAction from '@/components/BusinessComponents/EditAction/Index.vue';
import api from '@/api/admin';
import { pwdsha } from '@/utils/util';

const { restPassword } = api;
export default {
  name: 'admin.restPassword',
  components: {
    EditAction,
  },
  data() {
    const pwdCheckValidate = (rule, value, callback) => {
      if (this.formData.newPassword !== value) {
        callback(new Error('密码和确认密码不一致'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      formData: {
        newPassword: '',
        confirmPassword: '',
      },
      rules: {
        newPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          // { min: 6, message: '密码最少6个字符', trigger: 'blur' },
          // { max: 32, message: '密码最多32个字符', trigger: 'blur' },
          { pattern: /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{6,32}$/, message: '必须包含6-32位大写字母，小写字母，数字', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          // { min: 6, message: '密码最少6个字符', trigger: 'blur' },
          // { max: 32, message: '密码最多32个字符', trigger: 'blur' },
          { validator: pwdCheckValidate, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async restPasswordFn() {
      this.loading = true;
      const valid = await this.$refs.form.validate();
      if (!valid) {
        this.loading = false;
        return;
      }
      const formData = {
        adminId: this.$route.query.adminId,
        superAdmin: this.$route.query.superAdmin,
        newPassword: this.passwordToSha(this.formData.newPassword),
        confirmPassword: this.passwordToSha(this.formData.confirmPassword),
      };
      const res = await restPassword(formData);
      if (res) {
        this.$Message.success('重置密码成功！');
        this.back();
      } else {
        this.$Message.error(res.message);
      }
      this.loading = false;
    },
    passwordToSha: str => pwdsha(str, 'uy.L_-6q4LY@a25M9R.comGgNAu.8jS@Wo'),
    back() {
      this.$router.push({ name: 'admin' });
    },
  },
};
</script>

<style scoped>
  .admin-add-wrapper {
    position: relative;
  }
</style>
