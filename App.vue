<template>
<!--    <todo-app/>-->
    <div>
        <router-link
                to="/"
                class="to-home">
            <i class="material-icons">home</i>
        </router-link>

        <router-view/>
    </div>

</template>

<script>
export default {
  created () {
    console.log(this.$router)
    console.log(this.$route)
  }
}
</script>

<style lang="scss">
    .to-home.router-link-exact-active {
    display: none;
    }
</style>
<!--<script>-->
<!--    import TodoApp from './views/TodoApp'-->

<!--    export default {-->
<!--        components: {-->
<!--            TodoApp-->
<!--        }-->
<!--    }-->
<!--</script>-->
