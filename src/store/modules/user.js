import {login, logout} from '../../api/commonApi'
import Cookies from 'js-cookie'

const user = {
  state: {
    username: null,
    avatar: null,
    roleid: null,
    uid: null,
    super_type: null
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.username = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLE: (state, roleid) => {
      state.roleid = roleid
    },
    SET_UID: (state, uid) => {
      state.uid = uid
    },
    SET_SUPER_TYPE: (state, superType) => {
      state.super_type = superType
    }
  },
  
  getters: {
    UNAME: (state) => {
      return state.username;
    },
    UID: (state) => {
      return state.uid;
    },
    ROLEID: (state) => {
      return state.roleid;
    },
    SUPER_TYPE: (state) => {
      return state.super_type;
    }
  },
  
  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const params = {uname: userInfo.username, upwd: userInfo.passwd};
      return new Promise((resolve, reject) => {
        login(params).then(response => {
          if(response.ret==1){
            const data = response.data;
            Cookies.set('username', data.uname, { expires: 1 });
            Cookies.set('roleid', data.roleid, { expires: 1 });
            Cookies.set('uid', data.id, { expires: 1 });
            Cookies.set('super_type', data.super_type, {expires: 1});
            commit('SET_NAME', data.uname);
            commit('SET_ROLE', data.roleid);
            commit('SET_UID', data.id);
            commit('SET_SUPER_TYPE', data.super_type);
            resolve()
          }else{
            reject(response.msg)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    logout({commit}) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          Cookies.remove('username');
          Cookies.remove('roleid');
          Cookies.remove('uid');
          Cookies.remove('super_type');
          commit('SET_NAME', null);
          commit('SET_ROLE', null);
          commit('SET_UID', null);
          commit('SET_SUPER_TYPE', null);
          resolve();
        }).catch(error => {
          reject(error);
        })
      });
    }
  }
};

export default user;