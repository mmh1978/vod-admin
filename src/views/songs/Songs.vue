<template>
    <div class="wrapper-page">
        <Tabs value="name1">
            <TabPane label="基本信息" name="name1">
                <basic-info></basic-info>
            </TabPane>
            <TabPane label="歌曲/歌星查询" name="name5">
                <song-or-star></song-or-star>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
  import BasicInfo from './BasicInfo.vue'
  import SongOrStar from './SongOrStar.vue'

  export default {
    data() {
      return {}
    },
    components: {
      BasicInfo,
      SongOrStar
    }
  }
</script>
<style lang="scss" scoped>
    @import "../../style/common";
</style>