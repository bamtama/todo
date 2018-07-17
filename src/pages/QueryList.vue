<template>
	<div class="g-content ju-query-wrap" v-bind:class="{'z-export':isExport}">
    <div class="ju-query-top">
      <div class="g-search-bar">
        <i class="iconfont icon-search"></i>
        <form action="" v-on:submit="fakeSearch">
          <input type="search" v-model="keyword" placeholder="请输入标题"
                 v-on:search="actionSearch"
                 v-on:focus="showSearchBtn = true" />
          <span v-show="showSearchBtn" @click="actionSearch">搜索</span>
        </form>
      </div>
      <div class="g-tab">
        <span class="tab-item"
              v-for="(item,index) in dataTab"
              v-bind:class="{'active': index === curTabIndex}"
              @click="tabChange(index)">{{item.title}}</span>
      </div>
    </div>
    <div class="ju-query-cont" v-bind:class="{'z-export':isExport}">
      <div class="mescroll" id="mescroll">
        <group class="ju-querylist g-checkbox-list"
             v-bind:class="{'z-export':isExport}"
             :gutter="0">
        <cell value-align="left"
              v-for="(item,index) in dataList"
              :key="item.index">
          <div class="cell-item-with-check">
            <div class="left-checkbox checkbox-item"
                 @click="actionChangeCheckItem(item)"
                 v-bind:class="{active:item.checked}">
              <label class="icon">
                <i class="iconfont icon-checkbox default"></i>
                <i class="iconfont icon-checkbox-checked active"></i>
              </label>
            </div>
            <div class="right-cont" @click="gotoDetail(item.reminderId)">
              <h5>{{item.title}}</h5>
              <div class="person">
                <span>发起人：{{item.createName}}</span>
                <span>响应 {{item.responseNum}}/{{item.attendNum}} 人</span>
              </div>
              <div class="time">
                <span><template v-if="item.sendTime">发送时间：{{item.sendTime}}</template></span>
                <span v-if="item.finish===1" class="warning">未完成</span>
                <span v-if="item.finish===2 && curTabIndex !== 0" class="warning">已完成</span>
                <span v-if="item.finish===3 && curTabIndex === 0" class="warning">超时未完成</span>
              </div>
            </div>
          </div>
        </cell>
      </group>
      </div>
    </div>
    <div v-bind:class="{'z-export':isExport}" class="ju-query-check-opt vux-1px-t g-checkbox-list">
      <div class="checkbox-item" v-bind:class="{active:isAllChecked}" @click="actionCheckAll">
        <label class="icon">
          <i class="iconfont icon-checkbox default"></i>
          <i class="iconfont icon-checkbox-checked active"></i>
        </label>
        <span class="cont">全选</span>
      </div>
      <div class="opts">
        <span class="ok" @click="exportList">确定</span>
        <span class="cancel" @click="actionToExport(0)">取消</span>
      </div>
    </div>
    <div v-show="!isExport" class="g-btn-fix-bottom" @click="actionToExport(1)">导出</div>
	</div>
</template>

<script>
  import {Group,Cell,Search, XInput} from 'vux'
  import MeScroll from '../assets/libs/mescroll.m'
  export default{
		name:'QueryList',
		components:{
      XInput,
      Search,
      Group,Cell
    },
		data(){
			return{
				dataTab:[{
				  state:'undo',
          title:'待办'
        },{
          state:'done',
          title:'已办'
        },{
          state:'launched',
          title:'我的发起'
        },{
          state:'filed',
          title:'已归档'
        }],
        curTabIndex: 0,

        keyword: '',

        isExport: false,

        dataList: [],         //当前显示结果列表
        isAllChecked: false,  //是否全选

        mescroll: null,
        pageSize: 10,
        pageIndex: 0,
        total: 35,
        isListInit: true,

        showSearchBtn: true,

        mescroll: null
			}
		},
    computed:{
    },
		mounted(){
		  this.initData()
		},
		methods:{
			initData(){
			  //注意底部HomeBar显示重置
        this.$store.dispatch('setTabShow',true);
        // this.getList();
        this.curTabIndex = this.$store.getters.curTabIndex;
        this.actionToExport(false);
        this.initScroll()
      },
      initScroll(){
        let self = this;
        this.mescroll = new MeScroll("mescroll", {
          down:{
            callback: self.getList,
            auto: true,
            offset: 60
          }
        });
      },
      getList(){
			  console.log(this.curTabIndex)
			  var reqdata = {
          title: this.keyword,
          type: this.curTabIndex+1
        }
        //马上隐藏加载中。。
        this.mescroll.endSuccess(10, true)
			  this.publicApi.getReminderList(reqdata).then((res)=>{
			    if(res.data.status === 200){
            this.dataList = res.data.data;
          }
          else{
            this.$vux.toast.show({text:res.data.message, type:'warn'})
          }
        })
      },
      tabChange(index){
			  this.curTabIndex = index;
			  this.$store.dispatch('setCurTabIndex', index);
        this.actionToExport(false);
        this.getList()
      },
      actionChangeCheckItem(item){
			  item.checked = !item.checked;
			  this.checkedItemChanges()
      },
      actionCheckAll(){
			  this.isAllChecked = !this.isAllChecked;
			  this.dataList.forEach((it, i)=>{
			    it.checked = this.isAllChecked;
        })
      },
      checkedItemChanges(){
			  let allchecked = true;
			  for(let i = 0; i < this.dataList.length; i++){
			    console.log(1)
			    if(!this.dataList[i].checked){
			      allchecked = false;
			      break;
          }
        }
        if(allchecked){
			    this.isAllChecked = true;
        }
        else{
			    this.isAllChecked = false;
        }
			  this.dataList = JSON.parse(JSON.stringify(this.dataList))
      },
      actionToExport(state){
			  if(state){
          this.$store.dispatch('setTabShow',false).then(()=>{
            this.isExport = true;
          })
        }
        else{
			    //取消，记得清空当前选项
          this.isExport = false;
          this.dataList.forEach((it, i)=>{
            it.checked = false;
          })
          this.isAllChecked = false;
          setTimeout(()=>{
            this.$store.dispatch('setTabShow', true)
          },300)
        }
      },
      actionSearch(){
			//   if(this.keyword === ''){
			//     this.$vux.toast.text('请输入查询标题')
        //   return false;
        // }
			  this.getList();
        document.activeElement.blur()
      },
      gotoDetail(id){
			  this.$router.push({path:`/Detail?type=${this.dataTab[this.curTabIndex].state}&id=${id}`})
      },
      exportList(){
			  //导出当前列表（这里是导出给自己）
        let stafflist =[], reminderlist = [];
        this.dataList.forEach((it,i)=>{
          if(it.checked){
            reminderlist.push(it.reminderId)
          }
        })
        if(reminderlist.length <= 0){
          this.$vux.toast.text('请选择事项后导出')
          return false;
        }
        //进行数据请求
        let reqdata1 = stafflist;
        let reqdata2 = {reminderIds:JSON.stringify(reminderlist)}
        Promise.all([this.publicApi.getEmails({ids:reqdata1}), this.publicApi.getAttach(reqdata2)]).then((res)=>{
          let emails = []
          let attach = {};
          console.log(emails)
          if(res[0].data.status === 200){
            emails = res[0].data.data;
          }
          else{
            this.$vux.toast.text('获取邮箱列表失败，请重试')
            return false;
          }
          if(res[1].data.status === 200){
            attach = res[1].data.data;
          }
          else{
            this.$vux.toast.text('获取附件失败，请重试');
            return false;
          }
          //准备跳转
          var data = {emails:emails, attach:attach, type:1};
          this.$router.push({name:'MailTo', params:data})
        })
      },
      fakeSearch(ev){
			  ev.preventDefault()
      }
		}
	}
</script>

<style lang="less">
  @import url("../assets/libs/mescroll.min.css");
</style>
