<template>
  <div class="layout app-container">
    <Row type="flex">
      <Col span="3">
      <sidebar class="sidebar-container"></sidebar>
      </Col>
      <Col span="21">
      <div class="main-container">
        <topbar></topbar>
        <transition mode="out-in"
                    enter-active-class="fadeIn"
                    leave-active-class="fadeOut"
                    appear>
          <router-view></router-view>
        </transition>
      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  import {Topbar, Sidebar} from './layout'

  export default {
    name: 'home',
    components: {
      Topbar,
      Sidebar
    }
  }
</script>
<style lang="scss" scoped>
  .app-container {
    position: relative;
    height: 100%;
    width: 100%;
    background-color: #eef2f6;
    .main-container {
      min-height: 768px;
    }
  }
</style>