<template>
  <div class="packages-container">
    <Tabs value="name1">
      <TabPane label="后台用户" name="name1">
        <admin-user></admin-user>
      </TabPane>
      <TabPane label="角色管理" name="name2">
        <admin-role></admin-role>
      </TabPane>
    </Tabs>
    
  </div>
</template>
<script>
  import {saveAs} from 'file-saver'
  import axios from 'axios'
  
  import AdminUser from './AdminUser.vue'
  import AdminRole from './AdminRole.vue'

 export default { 
    components: {
      AdminUser,
      AdminRole
    }
  }
</script>
<style lang="scss" scoped>
  .packages-container {
    padding: 10px 10px 0 20px;
  }
</style>