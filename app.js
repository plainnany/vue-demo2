import bar from './bar'
import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'DXqCwjoTK6asDkLaGHgKO2kB-gzGzoHsz';
var APP_KEY = 'MG9LHVrktMkOAoeJUA4C8fPx';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

var app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        todoList: [],
        actionType: 'signUp',
        formData: {
            username: '',
            password: '',
            email: ''
        },
        currentUser: null

    },
    created: function () {  //  生命周期钩子函数，可以用来表示在实例创建之后执行
        // onbeforeunload文档：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onbeforeunload
        window.onbeforeunload = () => {
            let dataString = JSON.stringify(this.todoList) // JSON 文档: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON
            window.localStorage.setItem('myTodos', dataString) // 看文档https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage
            let newTodo = JSON.stringify(this.newTodo)
            window.localStorage.setItem('newTodo', newTodo)
        }
        let oldDataString = window.localStorage.getItem('myTodos')
        let oldData = JSON.parse(oldDataString)
        let oldTodo = JSON.parse(window.localStorage.getItem('newTodo'))
        this.todoList = oldData || []
        this.newTodo = oldTodo || ''
    },
    methods: {
        addTodo: function () {
            this.todoList.push({
                title: this.newTodo,
                createdAt: (new Date()).toLocaleDateString(),
                done: false // 添加一个 done 属性
            })
            this.newTodo = ''
        },
        removeTodo: function (todo) {
            let index = this.todoList.indexOf(todo) // Array.prototype.indexOf 是 ES 5 新加的 API
            this.todoList.splice(index, 1) // splice 查看mdn
        },
        login: function () {
            AV.User.logIn(this.formData.username, this.formData.password).then( (loginedUser) => {
                console.log('登录成功');
                this.currentUser = this.getCurrentUser()
              }, function (error) {
              });
        },
        signUp: function () {
            let user = new AV.User()
            // 设置用户名

            user.setUsername(this.formData.username)
            // 设置密码
            user.setPassword(this.formData.password)
            // 设置邮箱 邮箱接口貌似有问题
            // user.setEmail(this.formData.email)
            user.signUp().then( (loginedUser) => {
                this.currentUser = this.getCurrentUser()
                console.log('注册成功')
            }, function (error) {
                console.log('error')
            })
        },
        getCurrentUser: function(){
            let {id, createdAt, attributes: {username}} = AV.User.current()
            
            return {id, username, createdAt}
        },
        logout: function(){
            AV.User.logOut();
            // 现在的 currentUser 是 null 了 
            this.currentUser = AV.User.current()
            window.location.reload()
        }
    }
}) 