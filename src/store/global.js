import * as types from './mutations-types.js'

const state = {
  isVis:false,
  isLoading: false,
  isTabShow: true,
  curTabIndex:0
}
const getters = {
  isVis: state => state.isVis,
  isLoading: state => state.isLoading,
  isTabShow: state => state.isTabShow,
  curTabIndex: state =>state.curTabIndex
}

const mutations = {
  [types.IS_LOADING](state, flag){
    state.isLoading = flag;
  },
  [types.IS_TABSHOW](state, flag){
    state.isTabShow = flag;
  },
  [types.IS_VIS](state, flag){
    state.isVis = flag;
  },
  [types.CUR_TABINDEX](state, index){
    state.curTabIndex = index;
  }
}

const actions = {
  globalLoading({commit}, flag){
    commit(types.IS_LOADING, flag)
  },
  setTabShow({commit}, flag){
    commit(types.IS_TABSHOW, flag)
  },
  setVisible({commit}, flag){
    commit(types.IS_VIS, flag)
  },
  setCurTabIndex({commit}, index){
    commit(types.CUR_TABINDEX, index)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
