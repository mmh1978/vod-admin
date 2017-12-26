<template>
    <div class="packages-container">
        <vod-list></vod-list>
    </div>
</template>
<script>
  import VodList from './VodList.vue'
  import VodInfo from './VodInfo.vue'
  import StbArea from './StbArea.vue'

  export default {
    components: {
      VodList,
      VodInfo,
      StbArea
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common.scss";
</style>