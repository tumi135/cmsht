import Vue from "vue";
import Vuex from "vuex";
import storages from '../my_config/storages'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    uuid: null,
    username: null,
    avatar: null,
    userInfo: null,
    login: false
  },
  mutations: {
    login: (state, data) => {
      storages.localSet('token', data.token)
      storages.localSet('uuid', data.uuid)
      state.token = data.token
      state.uuid = data.uuid
      state.login = true
    },
    saveUserInfo: (state, data) => {
      state.userInfo = data
      state.login = true
    },
    saveUserextInfo: (state, data) => {
      let oldState = JSON.parse(JSON.stringify(state.userInfo));
      oldState.ext_info = data;
      state.userInfo = oldState;
    },
    logout: (state) => {
      storages.localRemove('token')
      storages.localRemove('uuid')
      state.token = null
      state.uuid = null
      state.login = false

    }
  },
  actions: {},
  modules: {}
});