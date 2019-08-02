import Vuex from 'vuex';

const state = () => ({
  user: {userName:'',email:''}
})
const mutations = {
  USERLOGIN(state, user) {
		state.user = user;
		// 存储登陆信息
		window.sessionStorage.setItem('user', JSON.stringify((user)));
  },
  USEREXIT(state) {
    state.user = {};
		window.sessionStorage.removeItem('user');
  }
}

const actions = {
  // 用户登录
	userlogin({commit}, data) {
		commit('USERLOGIN', data);
	},
	// 用户退出
	userexit({commit}) {
		commit('USEREXIT');
	},
}

let store = () => new Vuex.Store({
  state,
  mutations,
  actions
})

export default store