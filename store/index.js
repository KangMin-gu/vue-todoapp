import Vue from 'vue'
import Vuex from 'vuex'

import todoApp from './todoApp'

Vue.use(Vuex)

export default new Vuex.Store({
  // strict: true,    // 엄격한 문법에 의거해서 작성해야한다  배포시는 false 개발시는 true 해야하지만 자동으로 하게만들거다.
  // 이유는 성능 이슈
  strict: process.env.NODE_ENV !== 'production',
  // state : {//Data
  //     // 외부의 있는 저장소관리되는 데이터들
  //
  // },
  // getters:{//computed
  //     // 데이터를 계산해서 사용할때 컴퓨티드와 비슷하다.
  //
  // },
  // mutations:{//Method
  //     // 실제 값을 변경할때만 사용한다. 비동기안된다.
  //     // state를 변경하는 권한이 여기 있다. actions에서 mutaitons의 로직을 사용하여 값을 변경해줘야한다.
  //
  //
  // },
  // actions:{//Method
  //     // 비동기를 포함한 일반로직을 작성한다. 일반적으로 메소드만들듯이 실제 값인 stat 분의 값을 변경 못한다.
  //
  // }
  actions: {
    testFunction () {
      // ~
    }
  },
  modules: {
    todoApp
  }

})
