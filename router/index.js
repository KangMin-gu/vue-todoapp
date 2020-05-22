import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home'
import About from '~/views/About'
import TodoApp from '~/views/TodoApp'

Vue.use(VueRouter)

// 옵션 아래 exprot default routes 에 바인딩됨
const routes = [
  // config
  {
    name: 'index',
    path: '/', // http://my-site.com/ 즉 도메인을 제외한
    component: Home
  },
  {
    name: 'about',
    path: '/about',
    component: About
  },
  {
    name: 'todos',
    path: '/todos',
    redirect: '/todos/all', //  /tods 로 접근하면  /todos/all 로보내라
    component: TodoApp,
    children: [
      {
        name: 'todos-filter',
        path: ':id'
      }
    ]
  }
]

export default new VueRouter({
  // mode: 'history',
  routes
})
