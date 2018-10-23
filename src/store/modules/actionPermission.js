const ActionPermission = {
  state: {
    permissionList: [],
  },
  mutations: {
    SET_ALL_ACTION_PERMISSION: (state, view) => {
      state.permissionList = view
    },
    DELETE_ACTION_PERMISSION: (state, view) => {
      state.permissionList = []
    }
  },
  actions: {
    addActionPermission({ commit }, view) {
      commit('SET_ALL_ACTION_PERMISSION', view)
    },
    delActionPermission({ commit, state }) {
      commit('DELETE_ACTION_PERMISSION')
    }
  }
}

export default ActionPermission
