<template>
    <div  class="wrapper-page">
        <Tabs value="name1">
            <TabPane label="产品活跃度" name="name1">
                <product-activity></product-activity>
            </TabPane>
            <TabPane label="开机/开台" name="name2">
                <start-up></start-up>
            </TabPane>
            <TabPane label="歌曲排行榜" name="name3">
                <song-rank></song-rank>
            </TabPane>
            <TabPane label="歌星排行榜" name="name4">
                <star-rank></star-rank>
            </TabPane>
            <TabPane label="下载记录" name="name5">
                <down-record></down-record>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
    import ProductActivity from './ProductActivity.vue'
    import StartUp from './StartUp.vue'
    import SongRank from './SongRank.vue'
    import StarRank from './StarRank.vue'
    import DownRecord from './DownRecord.vue'
    export default {
      components: {
        ProductActivity,
        StartUp,
        SongRank,
        StarRank,
        DownRecord
      }
    }
</script>
<style lang="scss" scoped>
  @import "../../style/common.scss";
</style>