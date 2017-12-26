<template>
  <section class="app-sidebar">
    <Menu ref="menu" :theme="theme" :active-name="active" :width="width" @on-select="openPage">
      <div class="layout-logo-left"></div>
      <MenuItem v-for="(item, index) in items" :key="index" :name="item.bar_router">{{item.bar_name}}</MenuItem>
    </Menu>
  </section>
</template>
<script>
  import Cookies from 'js-cookie'
  import {menuList} from '../../api/commonApi'
  export default {
    data() {
      return {
        roleid: 1,
        items: [],
        theme: 'light',
        width: 'auto',
        active: '/'
      }
    },
    mounted() {
      this.getMenuList();
    },
    methods: {
      getMenuList() {
        this.roleid = this.$store.getters.ROLEID ? this.$store.getters.ROLEID : Cookies.get('roleid');
        menuList({roleid: this.roleid}).then(result => {
          if (result.code && result.code === 200) {
            this.items = result.data;
          }
          let route = this.$route.path;
          this.active = '#' + route;
          this.$nextTick(() => {
            this.$refs.menu.updateActiveName();
          });
        })
      },
      openPage(name) {
        let route = name.split('#')[1];
        this.$router.push(route);
        this.active = name;
      }
    }
  }
</script>
<style lang="scss" scoped>
  .app-sidebar {
    height: 100%;
    background-color: #f3f8fb;

  .layout-logo-left {
    height: 50px;
    line-height: 50px;
    /*background: #5b6270;*/
    background-image: url("../../assets/admin-logo.png");
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 3px;
    color: #fff;
    text-align: center;
  }

  .ivu-menu-light {
    background-color: #f3f8fb;
  }

  a {
    color: inherit;
  }

  }
</style>