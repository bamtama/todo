import axios from 'axios'
// import qs from 'Qs'			//根据后台情况进行序列化

import store from '../store'
import { cookie } from 'vux'

import _this from '../main.js'

let CREATE = '',
  GETREMINDERLIST = '',
  GETREMINDERDETAIL = '',
  GETEMAILS = '',
  GETATTACH = '',
  POSTREPLY = '',
  GETSTAFFLIST ='',
  SENDEMAIL = '',
  SENDREMIDER ='',
  REGISTER ='',
  PRECHECK ='',
  WXCONFIG = '';

CREATE = 'static/mock/create.json'
GETREMINDERLIST = 'static/mock/reminderList.json'
GETREMINDERDETAIL = 'static/mock/reminderDetail.json'
GETEMAILS = 'static/mock/emails.json'
GETATTACH = 'static/mock/attach.json'
POSTREPLY = 'static/mock/create.json'
GETSTAFFLIST = 'static/mock/staffList.json'
SENDEMAIL = 'static/mock/create.json'
SENDREMIDER = 'static/mock/create.json'
REGISTER = 'static/mock/create.json'
PRECHECK = 'static/mock/precheck.json'
WXCONFIG = 'static/mock/jssdk.json'

/* 统一配置 */
if(process.env.NODE_ENV === 'development'){
  axios.defaults.baseURL = '';
}
else{
  axios.defaults.baseURL = ''; //process.env.API_HOST;
}

axios.defaults.timeout = 1000*30;
axios.withCredentials = true;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.interceptors.request.use(config=>{
  config.params.token = cookie.get('token');
  // if(!config.params.token && config.url !== WXCONFIG && _this.$route.name !== 'Error' && _this.$router.name !== 'Register'){
  //   let reUri = _this.$route.fullPath;
  //   window.location.href = '/mashangban/nos!14?turnto=' + reUri;
  // }
  // else{
  //   return config;
  // }
  return config;
},err=>{
  console.log(`request error:${err}`)
})

axios.interceptors.response.use(res=>{
  // console.log(res)
  return res;
}, err=>{
  console.log(`request error:${err}`)
  return Promise.reject({status:-1,msg:'response error'});
})

const axiosExtend = (config, showLoading) =>{
  config.method = 'get'
  if(showLoading){
    //显示全局loading
    setTimeout(()=>{store.dispatch('globalLoading', true)},0)
  }

  return new Promise((resolve,reject)=>{
    axios(config)
      .then(res => {
        //请求成功
        if(res.data.status === 122){
          //未登录
          let reUri = encodeURIComponent(_this.$route.fullPath);
          _this.$router.replace('/LoginTo?reuri='+reUri);
          //window.location.href = window.location.origin + '/mashangban/nos!14?turnto=' + reUri;
          //window.location.href = '/mashangban/nos!14';  //前端直接跳转到微信登录接口
        }
        else{
          // console.log('验证登录通过')
          if(showLoading){
            //隐藏全局loading
            setTimeout(()=>{
              store.dispatch('setVisible',true);
              store.dispatch('globalLoading', false)
            },0)
          }
          resolve(res)
        }
      })
      .catch(err => {
          console.log('请求失败')
          if(showLoading){
            //隐藏全局loading
            store.dispatch('setVisible',true);
            store.dispatch('globalLoading', false);
          }
          resolve(err)	//then，默认http200-http300是resolve,其他是reject，此处全部传回reject
      })
  })
}

//检查权限
export function	precheck(config, flag=true){
  return axiosExtend({
    url: PRECHECK,
    params: config
  },flag)
}


//创建
export function	create(config, flag=true){
  return axiosExtend({
    url: CREATE,
    params: config
  },flag)
}

//获取列表
export function getReminderList(config, flag=true){
  return axiosExtend({
    url: GETREMINDERLIST,
    params:config
  },flag)
}

//获取详情
export function getReminderDetail(config, flag=true){
  return axiosExtend({
    url: GETREMINDERDETAIL,
    params: config
  },flag)
}

//获取邮箱列表
export function getEmails(config, flag=true){
  return axiosExtend({
    url: GETEMAILS,
    params: config
  },flag)
}

//获取附件
export function getAttach(config, flag=true){
  return axiosExtend({
    url:GETATTACH,
    params:config
  },flag)
}

//提交
export function reToReminder(config, flag=true){
  return axiosExtend({
    url:POSTREPLY,
    params:config
  },flag)
}

//获取人员部门列表
export function getStaffsOrDepartments(config, flag =true){
  return axiosExtend({
    url:GETSTAFFLIST,
    params:config
  }, flag)
}

//催单或导出
export function sendMail(config, flag=false){
  let uri = '';
  if(config.type){
    uri = SENDEMAIL;    //导出
  }
  else{
    uri = SENDREMIDER;  //催单
  }
  return axiosExtend({
    url:uri,
    params:config
  },flag)
}

//注册新用户
export function register(config, flag=true){
  return axiosExtend({
    url:REGISTER,
    params:config
  },flag)
}

//获取微信js-sdk配置信息
export function getWxConfig(config, flag=false){
  return axiosExtend({
    url:WXCONFIG,
    params: config
  },flag)
}
