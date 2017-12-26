<template>
  <div class="login-container">
    <h3 class="title">系统登录</h3>
    <Form ref="login" :model="login" :rules="ruleCustom" :label-width="80">
      <FormItem label="用户名" prop="username">
        <Input type="text" v-model="login.username"></Input>
      </FormItem>
      <FormItem label="确认密码" prop="passwd">
        <Input type="password" v-model="login.passwd"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('login')" :loading="loading">提交</Button>
        <Button type="ghost" @click="handleReset('login')" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  import {login} from '../api/commonApi'

  export default {
    data() {
      return {
        loading: false,
        login: {
          username: '',
          passwd: ''
        },
        ruleCustom: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          passwd: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.loading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$store.dispatch('LoginByUsername', this.login).then(() => {
              this.loading = false;
              this.$router.push({ path: '/' });
            }).catch((msg) => {
              this.loading = false;
              this.$Message.error(msg);
            });
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  }
</style>