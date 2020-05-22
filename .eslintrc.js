module.exports={
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2015,
        sourceType: 'module'
    },
    env:{
        browser:true,
        node:true
    },
    extends: [
        'standard',
        'plugin:vue/essential'
    ],
    plugins:[
        'vue'
    ],
    rules:{
        'no-new': 0 //0은 사용안함 1은 error는 1로되어있음 2는 권고
    }
}