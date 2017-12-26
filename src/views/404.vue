<template>
    <div class="not-find">
        <Icon type="sad-outline" size="50"></Icon>
        <p class="page-container">未找到页面</p>
        <div>
            <Button type="ghost" @click="backToLast">返回上一页</Button>
            <Button type="success" @click="backToHome">返回主页</Button>
        </div>
    </div>
</template>
<script>
  export default {
    methods: {
      backToLast() {
        this.$router.go(-1);
      },
      backToHome() {
        this.$router.push('/');
      }
    }
  }
</script>
<style lang="scss" scoped>
    .not-find {
        padding-top: 100px;
        text-align: center;
        font-size: 20px;
        .page-container {
            color: rgb(192, 204, 218);
        }
        div {
            padding-top: 20px;
        }
    }
</style>