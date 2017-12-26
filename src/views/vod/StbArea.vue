<template>
    <Form ref="form" :label-width="80">
        <FormItem label="MAC" prop="vod_umac">
            <Input v-model="stb.vod_umac" placeholder="MAC" disabled>
            </Input>
        </FormItem>
        <FormItem label="使用区域" prop="user_info">
            <Input v-model="stb.user_info" placeholder="使用区域">
            </Input>
        </FormItem>
        <FormItem label="授权区域" prop="auth_info">
            <Input v-model="stb.auth_info" placeholder="授权区域">
            </Input>
        </FormItem>
        <FormItem label="授权时间" prop="auth_expire">
            <!--<DatePicker type="daterange" placeholder="选择日期" v-model="stb.auth_expire"></DatePicker>-->
        </FormItem>
        <FormItem label="离线时间" prop="offline_deadline">
            <Input v-model="stb.offline_deadline" placeholder="离线时间">
            </Input>
        </FormItem>
        <div style="text-align: center">
            <Button type="success" @click="handleSubmit('form')">保存</Button>
        </div>
    </Form>
</template>
<script>
  export default {
    props: {
        stb: {
            use_info: "",
            umac: "",
            auth_area: "",
            auth_info: "",
            use_area: "",
            offline_deadline: 0,
            auth_expire: "2017-01-01"
        }
    },
    methods: {
      handleSubmit(name) {
          console.log(this.stb.auth_expire);
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!');
          } else {
            this.$Message.error('Fail!');
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>