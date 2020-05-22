import Vue from 'vue'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import lowdb from 'lowdb'
import _cloneDeep from 'lodash/cloneDeep'
import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
//
export default {
  namespaced: true, // 독립적으로 활용할거면 모듈별로..
  state: () => ({ // state는 데이터는 함수여야하기 때문에 에로우 function 을 활용한다. (데이터는 소중하니깐)
    db: null,
    todos: [],
    filter: 'all'
  }),
  getters: {
    filteredTodos (state) {
      switch (state.filter) {
        case 'all' :
        default:
          return state.todos // coumputed todos() 를 호출한다.
        case 'active' : // 해야할 항목
          return state.todos.filter(todo => !todo.done) // todo의 done이 true가 아닌 요소
        case 'completed' : // 완료된 항목
          return state.todos.filter(todo => todo.done)
      }
    },
    total (state) {
      return state.todos.length
    },
    activeCount (state) {
      return state.todos.filter(todo => !todo.done).length
    },
    completedCount (state, getters) { // getters로 다른 함수접근이가능하다.
      return getters.total - getters.activeCount
    }
  },
  mutations: {
    assignDB (state, db) { // mutations에서는 {} 없이 state 접근가능하다.
      state.db = db
    },
    createDB (state, newTodo) {
      state.db
        .get('todos') // lodash
        .push(newTodo) // lodash
        .write() // lowdb
    },
    updateDB (state, { todo, value }) {
      state.db
        .get('todos')
        .find({ id: todo.id })
        .assign(value)
        .write()
    },
    deleteDB (state, todo) {
      state.db
        .get('todos')
        .remove({ id: todo.id })
        .write()
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    pushTodo (state, newTodo) {
      state.todos.push(newTodo)
    },
    assignTodo (state, { foundTodo, value }) {
      _assign(foundTodo, value)
    },
    deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex)
    },
    updateTodo (state, { todo, key, value }) {
      todo[key] = value
    },
    updateFilter (state, filter) {
      state.filter = filter
    }
  },
  actions: { // store 에서 actions 에서 데이터를 변경하는거 안된다 mutations 도움을 받아야한다.
    initDB ({ state, commit }) { // commit 을 활용해서  mutations 접근
      const adapter = new LocalStorage('todo-app') // DB
      // state.db = lowdb(adapter)
      commit('assignDB', lowdb(adapter)) // mutations 접근

      const hasTodos = state.db.has('todos').value()

      if (hasTodos) {
        // 값이 있다면~
        // state.todos = _cloneDeep(state.db.getState().todos) //참조관계도 같이 복사되기때문에 참조는 빼겠다.
        commit('assignTodos', _cloneDeep(state.db.getState().todos))
      } else {
        // Local DB 초기화
        state.db
          .defaults({
            todos: [] // Collection
          })
          .write()
      }
    },
    createTodo ({ state, commit }, title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10 }),
        title: title,
        createdAt: new Date(),
        updateAt: new Date(),
        done: false
      }
      // 해당부분은 추후 axios를 통해 서버쪽과 통신
      // state.db
      //     .get('todos') //lodash
      //     .push(newTodo) //lodash
      //     .write() // lowdb
      commit('createDB', newTodo)

      // client 화면 갱신
      // state.todos.push(newTodo)
      commit('pushTodo', newTodo)
    },
    updateTodo ({ state, commit }, { todo, value }) {
      // const {todo,value} = payload

      console.log('updateTodo')
      // state.db
      //     .get('todos')
      //     .find({id:todo.id})
      //     .assign(value)
      //     .write()
      commit('updateDB', { todo, value })

      const foundTodo = _find(state.todos, { id: todo.id })
      // _assign(foundTodo, value)
      commit('assignTodo', { foundTodo, value })
    },
    deleteTodo ({ state, commit }, todo) {
      console.log('deleteTodo')
      // state.db
      //     .get('todos')
      //     .remove({id:todo.id})
      //     .write()
      commit('deleteDB', todo)
      // this.todo 에서 id가 같은걸 찾아사ㅓ index값을 알아내고 todos에서 해당 index를 삭제하겠다.
      const foundIndex = _findIndex(state.todos, { id: todo.id })
      // this.$delete(state.todos, foundIndex) // Vue.delete(state.todos, foundIndex) 아래와 같은 코드
      // Vue.delete(state.todos, foundIndex)
      // client delete
      commit('deleteTodo', foundIndex)
    },
    completeAll ({ state, commit }, checked) {
      // DB 갱신한 새로운데이터 newTodos
      const newTodos = state.db
        .get('todos')
        .forEach(todo => {
          // todo.done = checked
          commit('updateTodo', {
            todo,
            key: 'done',
            value: checked
          })
        })
        .write()

      //state.todos = _cloneDeep(newTodos)
        commit('assignTodos',_cloneDeep(newTodos))
    },
    clearCompleted ({ state, dispatch }) {
      // lodash 에서 지원하는 배열 뒤에서부터 지우기
      _forEachRight(state.todos, todo => {
        if (todo.done) {
          // this.deleteTodo(todo)
          dispatch.deleteTodo(todo)
        }
      })
    }
  }
}
