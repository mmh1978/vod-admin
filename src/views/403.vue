<template>
    <div class="forbid">
        <Icon type="locked" size="50"></Icon>
        抱歉当前您没有权限！请联系管理员！
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
    .forbid {
        padding-top: 100px;
        text-align: center;
        font-size: 20px;
        div {
            padding-top: 20px;
        }
    }
</style>