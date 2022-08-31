import defaultSettings from '@/settings'
import variables from '@/styles/variables.scss'

const { showSettings, fixedHeader, sidebarLogo, tagsView } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings,
  fixedHeader,
  sidebarLogo,
  tagsView
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
