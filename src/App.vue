<template>
  <div id="app" class="g-p">
    <div v-transfer-dom>
      <!--全局显示的Loading-->
      <loading v-show="isLoading"></loading>
    </div>
    <div class="g-viewbox" v-show="isVis">
      <router-view class="rview"></router-view>
      <tabbar class="g-tabbar" v-show="isTabShow && isShow">
        <tabbar-item :selected="isCreate" @click.native="gotoPage({path:'/Create'})">
          <svg class="svg-icon" slot="icon">
            <use xlink:href="#icon-tab-create"></use>
          </svg>
          <svg class="svg-icon" slot="icon-active">
            <use xlink:href="#icon-tab-create-active"></use>
          </svg>
          <span slot="label">创建</span>
        </tabbar-item>
        <tabbar-item :selected="isHandle" @click.native="gotoPage({path:'/'})">
          <svg class="svg-icon" slot="icon">
            <use xlink:href="#icon-tab-handle"></use>
          </svg>
          <svg class="svg-icon" slot="icon-active">
            <use xlink:href="#icon-tab-handle-active"></use>
          </svg>
          <span slot="label">置办</span>
        </tabbar-item>
        <tabbar-item :selected="isQuery" @click.native="gotoPage({path:'/QueryList'})">
          <svg class="svg-icon" slot="icon">
            <use xlink:href="#icon-tab-query"></use>
          </svg>
          <svg class="svg-icon" slot="icon-active">
            <use xlink:href="#icon-tab-query-active"></use>
          </svg>
          <span slot="label">查询</span>
        </tabbar-item>
      </tabbar>
    </div>
  </div>
</template>

<script>
  import {Tabbar, TabbarItem,Loading, TransferDom} from "vux"
  import {mapGetters} from 'vuex'
  import { cookie } from 'vux'

  export default {
    components: {
      Loading,
      Tabbar,TabbarItem
    },
    directives:{TransferDom},
    name: 'app',
    computed:{
      ...mapGetters([
        'isLoading',
        'isTabShow',
        'isVis'
      ]),
      isShow(){
        if(this.$route.name === 'Register' || this.$route.name === 'Error' || this.$route.name === 'RedirectPage'){
          return false;
        }
        else{
          return true;
        }
      },
      isCreate(){
        if(this.$route.name === 'Create'){
          return true;
        }else {
          return false;
        }
      },
      isHandle(){
        if(this.$route.name === 'TodoList' || (this.$route.name === 'Detail' && this.$route.query.type === 'todo')){
          return true;
        }
        else{
          return false;
        }
      },
      isQuery(){
        if(this.$route.name === 'QueryList'|| (this.$route.name === 'Detail' && this.$route.query.type !== 'todo')){
          return true;
        }
        else{
          return false;
        }
      }
    },
    data(){
      return {
        rooturl: window.location.origin + window.location.pathname,
        appId: '',
        timestamp: '',
        noncestr: '',
        signature: ''
      }
    },
    watch: {
      // 监听 $route 变化调用分享链接
      "$route"(to, from) {
        console.log('router change');
        this.$store.dispatch('setVisible',false);
        this.shareInit();
      }
    },
    created(){
      this.$store.dispatch('setVisible',false)
    },
    mounted(){
      cookie.set('token','testtoken')

      this.publicApi.getWxConfig({url:encodeURIComponent(window.location.href.split('#')[0])}).then(res=>{
        if(res.data.status === 200){
          console.log('正确')
          this.appId = res.data.data.appid;
          this.timestamp = res.data.data.timestamp;
          this.noncestr = res.data.data.noncestr;
          this.signature = res.data.data.signature;
          this.shareInit();
          console.log(window.location.href)
        }
        else{
          console.log('错误')
          setTimeout(()=>{
            this.$wechat.hideOptionMenu()
          },100)
        }
      })
    },
    methods:{
      gotoPage(path){
        this.$router.replace(path)
      },
      shareInit(){
        console.log('init')
        let routername = this.$router.currentRoute.name;
        let querytype = this.$router.currentRoute.query.type;
        console.log(querytype)
        //配置config
        let routerpath = this.$router.currentRoute.fullPath;
        this.$wechat.config({
          debug: false,
          appId: this.appId,      //必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: this.timestamp,  // 必填，生成签名的时间戳
          nonceStr: this.noncestr,   // 必填，生成签名的随机串
          signature: this.signature,  // 必填，签名，见附录1
          jsApiList: ['showMenuItems','onMenuShareAppMessage','hideMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        this.$wechat.ready(()=>{
          if(routername === 'Detail'){
            //可分享的详情页
            // 发送给朋友: "menuItem:share:appMessage"
            // 分享到朋友圈: "menuItem:share:timeline"
            // 分享到QQ: "menuItem:share:qq"
            // 分享到QQ空间: "menuItem:share:QZone"
            // 分享到Weibo: "menuItem:share:weiboApp"
            // 收藏: "menuItem:favorite"
            // 分享到FB: "menuItem:share:facebook"
            this.$wechat.showOptionMenu();
            this.$wechat.showMenuItems({
              menuList:['menuItem:share:appMessage'] // 要显示的菜单项，所有menu项见附录3
            });
            this.$wechat.hideMenuItems({
              menuList:['menuItem:share:timeline','menuItem:share:qq','menuItem:share:weiboApp','menuItem:share:facebook','menuItem:share:QZone']
            })
            console.log(this.title)
            let shareurl = this.rooturl.split(';jsessionid')[0] + '?#' + routerpath;
            this.$wechat.onMenuShareAppMessage({
              title: '标题', // 分享标题
              desc: '平台', // 分享描述
              link: window.location.origin + '/mashangban/nos!14?turnto=' + encodeURIComponent(routerpath), // 分享链接，该链接域名必须与当前企业的可信域名一致
              success: function () {
                console.log('suc')
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            });
          }
          else{
            //不可分享的其他页
            this.$wechat.hideOptionMenu();
          }
        });
        this.$wechat.error(res=>{
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          console.log('err')
          console.log(res)
          this.$wechat.hideOptionMenu();
        });
      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import url('assets/styles/custom.reset.less');
  @import url('assets/styles/custom.july.less');
</style>
