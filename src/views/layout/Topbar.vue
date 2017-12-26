<template>
  <section class="app-topbar">
    <div class="nav-left"></div>
    <div class="nav-center">
      
    </div>
    <div class="nav-right">
      <Dropdown>
        <Avatar icon="person" style="vertical-align: middle;"/>
        <a href="javascript:void(0)">
          {{username}}
          <Icon type="arrow-down-b"></Icon>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem>
            <router-link class='inlineBlock' to="/">
              首页
            </router-link>
          </DropdownItem>
          <DropdownItem>
            <span @click="logout" style="display:block;">退出登录</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </section>
</template>
<script>
  import Cookies from 'js-cookie'
  import { mapGetters } from 'vuex'
  export default {
    computed: {
      username() {
        const username = this.$store.getters.UNAME ? this.$store.getters.UNAME : Cookies.get('username');
        return username;
      }
//      ...mapGetters({username: 'UNAME'})
    },
    methods: {
      logout() {
        this.$store.dispatch('logout').then(() => {
          this.$router.push({path: '/login'});
        }).catch(() => {
          this.$router.push({path: '/login'});
        });
      }
    }
  }
</script>
<style lang="scss">
  .app-topbar {
    display: flex;
    min-height: 60px;
    min-width: 100%;
    line-height: 40px;
    background-color: #fff;
    z-index: 1024;
    box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);
  
    .nav-left {
      flex: 1;
    }

    .nav-right {
      flex: 1;
      text-align: right;
      padding-right: 2em;
      overflow: hidden;
      overflow-x: auto;
      white-space: nowrap;
      line-height:60px; 
      height:60px;
    }
    .nav-center {
      flex: 1;
      text-align: center;
      .hero-brand {
        .vue {
          margin-left: 10px;
          color: #36AC70;
        }
        .admin {
          color: #28374B;
        }
      }
    }
  }
</style>