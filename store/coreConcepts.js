export default {
  namespaced: true,
  // data
  state: () => ({
    a: 123,
    b: []
  }),
  // computed
  getters: {
    someGetter1 (state, getters) {
      return state.a + 1
    },
    someGetter2 (state, getters) {
      return state.a + getters.someGetter1
    }
  },
  //
  mutations: {
    someMutation (state, payload) {
      state.a = 789
      state.b.push(payload)
    }
  },
  actions: {
    someAction ({ state, getters, commit, dispatch }, payload) {
      state.a = 789 // error 난다.
      state.b.push(payload) // error난다. 왜냐면 실질적으로 데이터를 변경하는거기때문에 mutations의 도움을 안받앗기에
      commit('someMutation', payload) // mutation함수, 전달할 값
    },
    someAction2 (context, payload) { // 3번째 인수는 없다. 2번째 인수만 전달된다.
      context.commit('someMutation')
      // actions 의 함수를 이용할때는 dispatch 라는 함수를 이용한다.
      context.dispatch('someAction1', payload)
    }
  }
}
