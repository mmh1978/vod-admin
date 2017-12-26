<template>
  <div class="packages-container">
    <Tabs value="name1">
      <TabPane label="产品反馈" name="name1">
        <product-back></product-back>
      </TabPane>
      <TabPane label="歌曲反馈" name="name2">
        <song-back></song-back>
      </TabPane>
    </Tabs>
    
  </div>
</template>
<script>
  import {saveAs} from 'file-saver'
  import axios from 'axios'
  
  import ProductBack from './ProductBack.vue'
  import SongBack from './SongBack.vue'

 export default { 
    components: {
      ProductBack,
      SongBack
    }
  }
</script>
<style lang="scss" scoped>
  .packages-container {
    padding: 10px 10px 0 20px;
  }
</style>