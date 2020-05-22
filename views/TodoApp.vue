<template>
    <div class="todo-app">

        <div class="todo-app__actions">
            <div class="filters">
                <!--:class="{ active: filter === 'all'}" active한 항목 두껍게표시 -->
                <router-link
                   to="all"
                   tag="button"
                >
                    모든 항목 ({{ total }})
                </router-link>
                <router-link
                    to="active"
                    tag="button"
                >
                    해야 할 목록 ({{ activeCount }})
                </router-link>
                <router-link
                      to="completed"
                      tag="button"
                >
                    완료된 항목 ({{ completedCount }})
                </router-link>

            </div>

            <div class="actions clearfix">
<!--                <input-->
<!--                        v-model="allDone"-->
<!--                        type="checkbox"-->
<!--                >-->
                <div class="float--left">
                    <label>
                        <input
                                v-model="allDone"
                                type="checkbox"
                        >
                        <span class="icon">
                            <i class="material-icons">done_all</i>
                        </span>
                    </label>
                </div>
                <div class="float--right clearfix">
                    <button
                            class="btn float--left"
                            @click="scrollToTop"
                    >
                        <i class="material-icons">expand_less</i>
                    </button>
                    <button
                            @click="scrollToBottom"
                            class="btn float--left"
                    >
                        <i class="material-icons">expand_more</i>
                    </button>
                    <button
                            class="btn btn--danger float--left"
                            @click="clearCompleted">
                        <i class="material-icons">delete_sweep</i>
                    </button>
                </div>
<!--                    <button @click="clearCompleted">-->
<!--                        완료된 항목 삭제-->
<!--                    </button>-->
                </div>
            </div>

           <div class="todo-app__list">
               <!--todos를 for문을 돌리고 key는 todo.id로 하며, todo라는 아이템을 변수 todo에 담아 props로 전달하겠다.
                    v-for 부분이 원래 todos 를 넣어야하나 필터를위해 filteredTodos 함수를 바인딩 해놨다.
               -->
           <todo-item
                   v-for="todo in filteredTodos"
                   :key="todo.id"
                   :todo="todo"

           />
       </div>

<!--        <hr/>-->

        <todo-creator
                class="todo-app__creator"

        />
    </div>
</template>

<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage' // lowdb와 localstorage 연결 어댑터
import cryptoRandomString from 'crypto-random-string'
import _cloneDeep from 'lodash/cloneDeep' // DB에서 가져온 데이터를 바로 사용하면 안되기때문에 클론하여사용해야하는데 거기에 lodash 기능을 사용한다.
// 이유는 DB에도 데이터가 변형될수있기때문에
// 참조관계도 같이 복사되기때문에
// import _find from 'lodash/find'
// import _assign from 'lodash/assign'
// import _findIndex from 'lodash/findIndex'
// import _forEachRight from 'lodash/forEachRight'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex' // computed에 쉿게 바인딩하게 도움

import scrollTo from 'scroll-to'
import TodoCreator from '~/components/TodoCreator' // ~ 절대경로 alias 적용
import TodoItem from '~/components/TodoItem'

export default {
  components: {
    TodoCreator,
    TodoItem
  },
  // data () {
  //     return {
  //         // db: null,
  //         // todos:[],
  //       //  filter: 'all'
  //     }
  // },
  computed: {

    // helpers 기능
    ...mapState('todoApp', [ // todoApp.js의 state를 가져옴
      //  'db',
      'todos'
      // 아래 todos() 처럼 사용하겠다 같은 의미미
    ]),
    ...mapGetters('todoApp', [ // todoApp.js 의 getters 를 가져온다.
      'total',
      'activeCount',
      'completedCount',
      'filteredTodos'
    ]),
    // filteredTodos(){
    //      switch (this.$route.params.id) {
    //          case 'all' :
    //              default:
    //              return this.todos //coumputed todos() 를 호출한다.
    //          case 'active' : //해야할 항목
    //              return this.todos.filter(todo => !todo.done) //todo의 done이 true가 아닌 요소
    //          case 'completed' : // 완료된 항목
    //              return this.todos.filter(todo => todo.done)
    //      }
    //  },
    // todos(){ // sotre에 있는 todos 를 호출한다.
    //   return this.$store.state.todoApp.todos
    // },
    // total(){
    //   return this.$store.getters.todoApp.total
    // },
    // activeCount(){
    //     return this.$store.getters.todoApp.activeCount
    // },

    // total(){
    //     return this.todos.length
    // },
    // activeCount(){
    //     return this.todos.filter(todo => !todo.done).length
    // },
    // completedCount(){
    //     return this.total - this.activeCount
    // },
    allDone: {
      get () {
        console.log('asdfasdsdaasasd')
        // 전체 아이템과 선택된 아이탬 개숙가 같으면 모두 선택이라본다.
        return this.total === this.completedCount && this.total > 0
      },
      set (checked) {
        this.completeAll(checked)
      }
    }
  },
  watch: { // 데이터가 변경되면 실행
    $route () {
      // 라우트가 변경될때 실행
      // state.filter = this.$route.params.id
      // this.$store.commit('todoApp/updateFilter', this.this.$route.params.id)
      this.updateFilter(this.$route.params.id)
    }
  },
  created () { // vue lifecycle 해당 vue가 실행될때 아래 코드 실행
    this.initDB()
    // this.$store.dispatch('todoApp/updateTodo', {
    //     todo: todo,
    //     value: value
    // }) // store 에 접근가능 todoApp.js 의 updateTodo에 접근하겠다.
    // 인자를 2개 보내줘야해서 오브젝트로 넘긴다.
  },
  methods: {
    // initDB () {
    //     const adapter = new LocalStorage('todo-app') //DB
    //     this.db = lowdb(adapter)
    //
    //     const hasTodos = this.db.has('todos').value()
    //
    //     if (hasTodos){
    //         //값이 있다면~
    //         this.todos = _cloneDeep(this.db.getState().todos) //참조관계도 같이 복사되기때문에 참조는 빼겠다.
    //     }else{
    //         //Local DB 초기화
    //         this.db
    //             .defaults({
    //                 todos: [] //Collection
    //             })
    //             .write()
    //     }
    // },
    // createTodo (title) {
    //     const newTodo = {
    //         id : cryptoRandomString({length:10}),
    //         title : title,
    //         createdAt : new Date(),
    //         updateAt: new Date(),
    //         done : false
    //     }
    //     //해당부분은 추후 axios를 통해 서버쪽과 통신
    //     this.db
    //     .get('todos') //lodash
    //     .push(newTodo) //lodash
    //     .write() // lowdb
    //
    //     //client 화면 갱신
    //     this.todos.push(newTodo)
    // },
    // updateTodo(todo, value){
    //     console.log("updateTodo")
    //     this.db
    //         .get('todos')
    //         .find({id:todo.id})
    //         .assign(value)
    //         .write()
    //
    //     const foundTodo =  _find(this.todos, {id: todo.id})
    //     _assign(foundTodo, value)
    // },
    // deleteTodo(todo){
    //     console.log("deleteTodo")
    //     this.db
    //         .get('todos')
    //         .remove({id:todo.id})
    //         .write()
    //     //this.todo 에서 id가 같은걸 찾아사ㅓ index값을 알아내고 todos에서 해당 index를 삭제하겠다.
    //     const foundIndex = _findIndex(this.todos, {id: todo.id})
    //     this.$delete(this.todos, foundIndex)
    // },
    // changeFilter (filter) {
    //     this.filter = filter
    // },
    // completeAll (checked) {
    //     //DB 갱신한 새로운데이터 newTodos
    //     const newTodos = this.db
    //         .get('todos')
    //         .forEach(todo => {
    //             todo.done = checked
    //         })
    //         .write()
    //
    //     //local todos
    //     // this.todos.forEach(todo => {
    //     //     this.done = checked
    //     // })
    //
    //     //참조관계가 발생하면 안되기때문에 (localStorage 를 사용하기때문에 일반적인경우는 아래처럼
    //     //this.todos = newTodos
    //     this.todos = _cloneDeep(newTodos)
    // },
    // clearCompleted(){
    //     // this.todos.forEach(todo => {
    //     //     if(todo.done){
    //     //         this.deleteTodo(todo)
    //     //     }
    //     // })
    //     // native javascript 배열 뒤에서부터 지우기
    //     // this.todos
    //     //     .reduce(list, todo, index => {
    //     //         if(todo.done){
    //     //             list.push(index)
    //     //         }
    //     //         return list
    //     //     }, [])
    //     //         .reverse()
    //     //         .forEach(index => {
    //     //             this.deleteTodo(this.todos[index])
    //     //         })
    //     // lodash 에서 지원하는 배열 뒤에서부터 지우기
    //     _forEachRight(this.todos, todo => {
    //         if(todo.done){
    //             this.deleteTodo(todo)
    //         }
    //     })
    // },
    ...mapMutations('todoApp', [
      'updateTodo',
      'updateFilter'
    ]),
    ...mapActions('todoApp', [
      'initDB',
      'completeAll',
      'clearCompleted'
    ]),
    ...mapActions([ // 어디서가져오는지 js파일명 필요없음.  store/index.js 에서 바로 가져오기
      'testFunction'
    ]),
    // store mutations 가져와보기 mapMutations,mapActions로 가져올수있다.
    // updateTodo(){
    //     this.$store.commit('todoApp/updateTodo')
    // },
    // initDB(){
    //     this.$store.dispatch('todoApp/initDB')
    // },
    scrollToTop () {
      console.log('asdf')
      scrollTo(0, 0, {
        ease: 'linear',
        duration: 1000
      })
    },
    scrollToBottom () {
      console.log('asdfddddd')
      scrollTo(0, document.body.scrollHeight, {
        ease: 'linear',
        duration: 1000
      })
    }
  }
}
</script>

<!--<style scoped lang="scss">-->
<!--    /*active 된 메뉴 두껍게표시*/-->
<!--    /*button.active {*/-->
<!--    /*    font-weight: bold;*/-->
<!--    /*}*/-->

<!--</style>-->
<!-- @import "../scss/style";  기존 절대경로를 별칭으로     @import "scss/style";   변경-->
<style lang="scss">
    @import "scss/style";

    .filters button.router-link-active {
        background: royalblue;
        color: white;
    }
</style>
