import Vue from 'vue'
import Router from 'vue-router'
//
// import Create from '@/pages/Create'
// import Detail from '@/pages/Detail'
// import MailTo from '@/pages/MailTo'
// import TodoList from '@/pages/TodoList'
// import QueryList from '@/pages/QueryList'
// import Handle from '@/pages/Handle'
// import Register from '@/pages/Register'
// import Error from '@/pages/Error'
// import LoginTo from '@/pages/LoginTo'

const Create = () => import('@/pages/Create');
const Detail = () => import('@/pages/Detail');
const MailTo = () => import('@/pages/MailTo');
const TodoList = () => import('@/pages/TodoList');
const QueryList = () => import('@/pages/QueryList');
const Handle = () => import('@/pages/Handle');
const Register = () => import('@/pages/Register');
const Error = () => import('@/pages/Error');
const LoginTo = () => import('@/pages/LoginTo');
const RedirectPage = () => import('@/pages/RedirectPage')

Vue.use(Router)

let router =  new Router({
  //mode:'history',
  routes: [
    {
      path: '/',
      name: 'TodoList',
      component: TodoList
    },
    {
      path:'/Register',
      name:'Register',
      component:Register
    },
    {
    	path: '/Create',
    	name: 'Create',
    	component: Create
    },
    {
    	path: '/Detail',
    	name: 'Detail',
    	component: Detail
    },
    {
    	path: '/MailTo',
    	name: 'MailTo',
    	component: MailTo
    },
    {
    	path: '/TodoList',
    	name: 'TodoList',
    	component: TodoList
    },
    {
    	path: '/QueryList',
    	name: 'QueryList',
    	component: QueryList
    },
    {
    	path: '/Handle/:id',
    	name: 'Handle',
    	component: Handle
    },
    {
      path:'/Error',
      name:'Error',
      component:Error
    },
    {
      path:'/LoginTo',
      name:'LoginTo',
      component:LoginTo
    },
    {
      path:'/RedirectPage',
      name:'RedirectPage',
      component:RedirectPage
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   // console.log(to.fullPath)
//   //alert(window.location.href)
//   next()
// })
// router.afterEach((to, from) => {
//   // alert(window.location.href)
//   // alert(JSON.stringify(to))
// })

export default router;
