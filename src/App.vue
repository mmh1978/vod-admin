<template>
  <div id="app">
    <transition mode="out-in"
                enter-active-class="fadeIn"
                leave-active-class="fadeOut"
                appear>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>
<style lang="scss" scoped>
  
</style>
