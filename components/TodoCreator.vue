<template>
    <div>
        <button @click="createTodo">
            <i class="material-icons">add</i>
        </button>
        <input :value="title"
               @input="title = $event.target.value"
               :placeholder="placeholder"
               @keypress.enter ="createTodo"
               type="text"/>
    </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      placeholder: '할 일을 저장하세요.'
    }
  },
  methods: {
    createTodo () {
      console.log(this.title)
      // 유효성검사
      const validatedTitle = this.title && this.title.trim()
      if (!validatedTitle) {
        alert('유효하지 않은 제목 입니다.')
        this.title = this.title.trim()
        return false
      }

      // 생성  --> 부모컴포넌트에게 특정한 이벤트를 올려주는 역할
      // this.$emit('create-todo', this.title)//create-todo는 이벤트의 이름 , this.title을 인자로 올려준다.
      // this.$store.commit() //mutations 에 접근할때
      this.$store.dispatch('todoApp/createTodo', this.title) // 직접적으로 자식컴포넌트에서 store에 접근
      // 데이터 입력후, title input 비우기
      this.title = ''

      // 입력후, 하단으로 이동
      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
    }
  }
}
</script>
