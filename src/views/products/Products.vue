<template>
    <div class="wrapper-page">
        <basic-info></basic-info>
    </div>
</template>
<script>
  import BasicInfo from './BasicInfo.vue'

  export default {
    data() {
      return {}
    },
    components: {
      BasicInfo
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common";
</style>