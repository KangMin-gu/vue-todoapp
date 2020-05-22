<template>
    <div
           :class="{ done: done }"
            class="todo-item">

        <!--EDIT 모드일때 출력 -->
        <div
                v-if="isEditMode"
                class="item__inner item__edit"
        >

            <input
                    ref="titleInput"
                    :value="editedTitle"
                    @input="editedTitle = $event.target.value"
                    type="text"
                    @keypress.enter="editedTodo"
                    @keypress.esc="offEditMode"
            >
            <!--버튼에 key 유일키를 주는이유는 ui가 변결될때 브라우저의 포커싱을 없애기위해-->
            <div class="item__actions">
                <button
                        class="btn btn--primary"
                        key="complete"
                        @click="editedTodo"
                >
                    <i class="material-icons">done</i>
                </button>
                <button
                        class="btn"
                        key="cancel"
                        @click="offEditMode"
                >
                    <i class="material-icons">clear</i>
                </button>
            </div>

        </div>

        <!--EDIT 모드가 아닐때 출력-->
         <div
                v-else
                class="item__inner item__nomal"
         >

<!--                        <input-->
<!--                                v-model="done"-->
<!--                                type="checkbox"-->
<!--                        />-->
                        <label>
                            <input
                                    v-model="done"
                                    type="checkbox"
                            />
                            <span class="icon"><i class="material-icons">check</i></span>
                        </label>

                        <div class="time__title-wrap">
                            <div class="item__title">{{todo.title}}</div>
                            <div class="item __date">{{dete}}</div>
                        </div>

                        <div class="item__actions">
                            <button
                                    class="btn"
                                    key="update"
                                    @click="onEditMode"
                            >
                                <i class="material-icons">edit</i>
                            </button>
                            <button
                                    class="btn btn--danger"
                                    key="delete"
                                    @click="deleteTodo"
                            >
                                <i class="material-icons">delete</i>
                            </button>
                        </div>

        </div>

    </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    todo: Object // 부모창에서 todo라는 아이템에 Object라는 자료형이 들어올거다 선언.

  },
  data () {
    return {
      isEditMode: false, // editMode 니? 처음엔 아니기때문에 false
      editedTitle: '' // 처음에 todo에 할당해놓고 수정하다가 취소할때 원상복구시킬려고 선언
    }
  },
  computed: {
    done: { // done이란 변수선언이 데이터가 없데이트가 되면 실행 해당 변수는 default false로 할당되며, checkbox와 맞춰줘야 정상작동
      get () { // done 을 가져올때
        return this.todo.done // 데이터를 가져올때 todo의 done 값을 바인딩 checkbox에 바인딩!
      },
      set (done) { // done이 변경될때 실행할
        this.updateTodo({
          done: done
        })
      }
    },
    dete () {
      const date = dayjs(this.todo.createdAt)
      const isSame = date.isSame(this.todo.updateAt)
      if (isSame) {
        return date.format('YYYY년 MM월 DD일')
      } else {
        return `${date.format('YYYY년 MM월 DD일')} (edited)`
      }
    }
  },
  methods: {
    editedTodo () {
      // 수정을 정말해야지 DB 실행
      if (this.todo.title !== this.editedTitle) {
        console.log('in')
        // 수정이끝날때 DB 업데이트
        // this updateTodo 실행
        this.updateTodo({
          // title에는 할당
          title: this.editedTitle,
          // 새로운 날짜 업데이트
          updateAt: new Date()
        })
      }

      // 수정모드를 끝낼거기 때문에 다음 함수 실행
      this.offEditMode()
    },
    onEditMode () {
      this.isEditMode = true
      this.editedTitle = this.todo.title

      this.$nextTick(() => { // 화면이 새로 랜더링 되고나서 (갱신되고나서) 지연함수
        // 포커스를할 수 있는 뷰의 전용 $refs 전용함수이용
        this.$refs.titleInput.focus()
      })
    },
    offEditMode () {
      this.isEditMode = false
    },
    updateTodo (value) {
      // 부모함수명, 현재todo ,변경값
      // this.$emit('update-todo',this.todo, value)
      this.$store.dispatch('todoApp/updateTodo', {
        todo: this.todo,
        value: value
      })
    },
    deleteTodo () {
      // this.$emit('delete-todo',this.todo)
      this.$store.dispatch('todoApp/deleteTodo', this.todo)
    }
  }
}
</script>

<!--<style scoped lang="scss">-->
<!--    .todo-item{-->
<!--        margin-bottom: 10px;-->
<!--        .item__inner{-->
<!--            display: flex;-->
<!--        }-->
<!--        .item__date{-->
<!--            font-size: 12px;-->
<!--        }-->
<!--        /*만약에 todo-item 에 done이란 클래스가 붙어있으면 item__title 에 해당 css를 적용하라-->
<!--            즉, 체크박스를 체크하면 한줄 그어라-->
<!--              <div-->
<!--           :class="{ done: done }"-->
<!--            class="todo-item">-->
<!--         */-->
<!--        &.done {-->
<!--            .item__title{-->
<!--                text-decoration:line-through;-->
<!--            }-->
<!--        }-->
<!--    }-->
<!--</style>-->
