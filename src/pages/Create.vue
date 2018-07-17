<template>
	<div class="ju-create-wrap" v-if="!lazyload">
		<div class="g-content">
      <Group class="g-group"
             gutter="0">
        <XInput placeholder="请填写标题" v-model="createObj.title">
          <label slot="label" class="title-label z-req">标题</label>
        </XInput>
      </Group>
      <Group class="g-group"
             gutter="4px">
        <cell value-align="left"
              align-items="flex-start"
              class="ju-create-mode-cell">
          <label slot="title" class="title-label z-req">发送模式</label>
          <checker v-model="createObj.sendMode"
                   class="g-checker ju-create-radio"
                   default-item-class="item"
                   selected-item-class="item-selected">
            <template v-for="(item, index) in dataMode">
              <checker-item
                :key="item.key"
                :value="item.key">
                <span class="checker-cont">{{item.value}}</span>
                <label class="checker-label">
                  <svg class="svg-icon default">
                    <use xlink:href="#icon-radio"></use>
                  </svg>
                  <svg class="svg-icon active">
                    <use xlink:href="#icon-radio-checked"></use>
                  </svg>
                </label>
              </checker-item>
              <!--发送模式选择内容 / 分情况渲染-->
              <div class="mode-content-item vux-1px-t" v-show="createObj.sendMode==='2'" v-if="index===1">
                <!-- 定时发送 -->
                <custom-datetime class="vux-1px-b"
                  :date="createObj.fixed.date" :time="createObj.fixed.time"
                  v-on:value-change="changeFixedDatetime"> </custom-datetime>
              </div>
              <div class="mode-content-item" v-show="createObj.sendMode==='3'" v-if="index===2">
                <!--随机发送-->
                <ul class="random-wrap">
                  <li class="vux-1px-t">
                    <span>起</span>
                    <span>
                      <custom-datetime
                        :date="createObj.startDate" :time="createObj.startTime"
                        v-on:value-change="changeStartDatetime"> </custom-datetime>
                    </span>
                  </li>
                  <li class="vux-1px-t">
                    <span>止</span>
                    <span>
                      <custom-datetime
                        :date="createObj.endDate" :time="createObj.endTime"
                        v-on:value-change="changeEndDatetime"> </custom-datetime>
                    </span>
                  </li>
                </ul>
              </div>
            </template>
          </checker>
        </cell>
      </Group>
      <Group class="g-group"
             gutter="4px">
        <cell value-align="left">
          <label slot="title" class="title-label z-req">截止时间</label>
          <div class="deadline-wrap">
            <custom-datetime
              :date="createObj.deadline.date" :time="createObj.deadline.time"
              v-on:value-change="changeDeadlineDatetime"> </custom-datetime>
          </div>
        </cell>
        <cell value-align="left" is-link @click.native="showStaffSelection=true">
          <label slot="title" class="title-label z-req">人员</label>
          <div class="selected-staff">
            <p><template v-for="(item,i) in dataSelectedStaffList">{{item.name}}<template v-if="i < dataSelectedStaffList.length-1">、</template></template></p>
          </div>
        </cell>
        <x-textarea :autosize="false"
                    placeholder="输入内容"
                    v-model="createObj.content"
                    @on-focus="textareaFocus = true"
                    @on-blur="textareaFocus = false"
                    :rows="2">
          <label slot="label" class="title-label z-req">内容</label>
        </x-textarea>
      </Group>
      <flexbox class="ju-create-btns" :gutter="10">
        <flexbox-item>
          <x-button type="primary" @click.native="actionCreate">创建</x-button>
        </flexbox-item>
      </flexbox>
    </div>

    <!--人员选择 组件内容可抽离/很复杂 暂时不做-->
    <div v-transfer-dom>
      <popup height="100%"
             v-model="showStaffSelection"
             @on-show="initStaffSelection">
        <div class="ju-staff-selection-wrap g-selection-wrap g-p">
          <div class="title">
            <i @click="quitStaffSelection" class="iconfont icon-close g-fl"></i>
            <span class="btn-ok g-fr" @click="submitSelectedStaffList">确定</span>
          </div>
          <div class="content">
            <!--已选的人员列表-->
            <div class="staff-selected"
                 v-bind:class="{'z-showmore':showAllSelectedStaffs}">
              <div class="cont" ref="domStaffSelected">
                <span v-for="(item ,index) in dataDisplaySelectedStaffList"
                      @click="removeStaff(item)">{{item.name}}</span>
                <!--收起按钮-->
                <span @click="showAllSelectedStaffs=!showAllSelectedStaffs">
                  <i v-show="showAllSelectedStaffs" class="iconfont icon-arrow-up"></i>
                </span>
              </div>
              <!--展开按钮-->
              <span class="more" ref="domMoreBtn"
                    v-show="showStaffSelectedMore"
                    v-bind:class="{'z-showmore':showAllSelectedStaffs}"
                    @click="showAllSelectedStaffs=!showAllSelectedStaffs">
                <span v-show="!showAllSelectedStaffs">......</span>
              </span>
            </div>
            <!--已选部门面包屑-->
            <div class="departments">
              <!--<a v-if="dataSelectedDepartment.length > 0" @click="showTargetDepartmentList({departId:1})">市政府</a>-->
              <!--<a v-else class="z-active">市政府</a>-->
              <template v-for="(item, index) in dataSelectedDepartment">
                <span v-if="index!==0">&nbsp;&gt;</span>
                <a v-if="index+1 !== dataSelectedDepartment.length" @click="showTargetDepartmentList(item)">{{item.departName}}</a>
                <a v-else class="z-active">{{item.departName}}</a>
              </template>
            </div>
            <!--候选部门列表-->
            <div class="sel-list">
              <div class="department-list" v-show="showDepartList">
                <group :gutter="0">
                  <cell v-for="(item, index) in dataDepartmentList"
                        @click.native="actionSelDepartment(item)"
                        value-align="left"
                        :key="item.departId">{{item.departName}}</cell>
                </group>
              </div>
              <!--候选人员列表-->
              <div class="staff-list" v-show="showStaffList">
                <ul class="g-checkbox-list">
                  <li class="checkbox-item"
                      @click="actionCheckAll"
                      v-bind:class="{active:isStaffAllChecked}">
                    <label class="icon">
                      <i class="iconfont icon-checkbox default"></i>
                      <i class="iconfont icon-checkbox-checked active"></i>
                    </label>
                    <span class="cont">
                      全选
                    </span>
                  </li>
                  <li class="checkbox-item"
                      @click="actionChangeCheckItem(item)"
                      v-for="(item,index) in dataStaffList"
                      v-bind:dataitem="JSON.stringify(item)"
                      v-bind:class="{active:item.checked}">
                    <label class="icon">
                      <i class="iconfont icon-checkbox default"></i>
                      <i class="iconfont icon-checkbox-checked active"></i>
                    </label>
                    <span class="cont">
                      {{item.name}}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </popup>
    </div>
	</div>
</template>

<script>
	import header from '@/components/header'
  import customdatetime from '@/components/customDatetime'
  import {Group, XInput, XTextarea,XButton,Cell,Flexbox,
    FlexboxItem,Checker, CheckerItem,Popup,Calendar,Datetime,
    TransferDom, dateFormat } from 'vux'

  import { cookie } from 'vux'

  import CustomDatetime from "../components/customDatetime";
	export default{
		name:'create',
		components:{
      CustomDatetime,
      Datetime,
      Calendar,
      Popup,
      CheckerItem,
      Checker,
      FlexboxItem,
      Flexbox,
      XButton,
      Cell,
      Group,
      XInput,
      XTextarea,
      mHeader:header,
      cDatetime: customdatetime
		},
    directives:{TransferDom},
		data(){
			return {
			  lazyload:true, //组件过多，延迟加载,v-if阻止渲染
        createObj:{
			    title:'',
          sendMode:'',
          fixed:{date:'', time:''},
          deadline:{date:'',time:''},
          startDate:'',
          startTime:'',
          endDate:'',
          endTime:'',
          staffList:[],
          content:''
        },  //表单内容

        textareaFocus:false,

        dataMode:[],      //发送模式列表
        selectedMode:{},  //已选发送模式

        dataAllStaffList:[],              //所有的部门及人员列表
        dataDepartmentMap:{},             //部门临时索引
        dataDisplaySelectedStaffList:[],  //显示的已选人员列表
        dataSelectedStaffList:[],         //已选人员列表
        isStaffAllChecked: false,         //是否全选当前staff列表

        dataStaffList:[],             //候选人员列表
        dataSelectedDepartment:[],    //已选部门列表,注意按级别排序（或改成对象

        dataDepartmentList:[],        //候选部门列表
        currentSelectedStaffList:[],  //当前已选择人员列表

        showStaffSelection: false,    //是否显示人员列表
        showAllSelectedStaffs: false, //是否展开全部已选人员列表

        showStaffSelectedMore:false,  //是否显示更多按钮
        showStaffList:false,          //显示人员候选列表
        showDepartList:false,         //显示部门候选列表
			}
		},
    beforeCreate(){
      // this.publicApi.precheck({})
    },
		mounted(){
		  if(1){
        this.$store.dispatch('setVisible',true);
		    this.initData();
      }else{
        //window.location.href = window.location.origin + '/mashangban/nos!14?turnto=' + this.$route.fullPath;
        this.$router.replace('/LoginTo?reuri='+ encodeURIComponent(this.$route.fullPath))
      }

      window.onresize = ()=>{
        if(this.textareaFocus){
          this.changeViewHeight();
        }
      }
		},
    computed:{

    },
    watch:{

    },
		methods:{
		  initData(){
		    //发送模式数据初始化
		    this.dataMode = [
          {key:'1', value:'立即发送'},
          {key:'2', value:'定时发送'},
          {key:'3', value:'随机发送'}
        ];
		    //设置默认时间
        let nowtime = new Date().getTime();

		    //设置截止时间为当日结束
        let tdate = dateFormat(new Date(nowtime),'YYYY-MM-DD');
		    this.createObj.deadline.date = tdate;
		    this.createObj.deadline.time = '23:59:59 '

        //定时发送默认为当前时间+1h
        this.createObj.fixed.date = tdate;
        let t3 = nowtime + 60 * 60 * 1000;
        let ft3time = dateFormat(new Date(t3),'HH:mm:ss');
        this.createObj.fixed.time = ft3time + ' ';

        //随机发送起止时间为now+5min now+8h
        let t1 = nowtime + 5 * 60 * 1000;
		    let t2 = nowtime + 8 * 60 * 60 * 1000;
        let tend = new Date((tdate+' 23:59:59').replace(/-/g, "/")).getTime();
        if(tend < t2){
          t2 = tend;
        }
        if(tend < t1){
          t1 = nowtime;
        }
		    let ft1date = dateFormat(new Date(t1), 'YYYY-MM-DD');
		    let ft1time = dateFormat(new Date(t1), 'HH:mm:ss');
		    let ft2date = dateFormat(new Date(t2), 'YYYY-MM-DD');
		    let ft2time = dateFormat(new Date(t2), 'HH:mm:ss');
        this.createObj.startDate = ft1date;
		    this.createObj.startTime = ft1time + ' ';
		    this.createObj.endDate = ft2date;
		    this.createObj.endTime = ft2time + ' ';

		    this.lazyLoading()
      },
      lazyLoading(){
        this.$store.dispatch('globalLoading', true)
        setTimeout(()=>{
          this.lazyload = !this.lazyload;
          this.$store.dispatch('globalLoading', false)
        },50)
      },
      changeDatetime(data,tar){
		    tar.date = data.d;
		    tar.time = data.t;
      },
      changeFixedDatetime(data){
		    this.changeDatetime(data, this.createObj.fixed);
      },
      changeStartDatetime(data){
        this.createObj.startDate = data.d;
        this.createObj.startTime = data.t;
      },
      changeEndDatetime(data){
        this.createObj.endDate = data.d;
        this.createObj.endTime = data.t;
      },
      changeDeadlineDatetime(data){
		    this.changeDatetime(data, this.createObj.deadline);
      },
      getStaffSelectedHeight(){
        if(this.$refs.domStaffSelected){
          if(this.$refs.domStaffSelected.offsetHeight > 80)
            this.showStaffSelectedMore = true;
          else
            this.showStaffSelectedMore = false;
        }
        else{
          this.showStaffSelectedMore = false;
        }
      },
      getStaffOrDepartmentList(id){
		    //伪数据获取（废弃
		    //根据id获取对应人员或部门列表
        let tmp;
        if(id){
          //非第一次获取，这里默认第二次获取为人员列表
          tmp ={
            departId: `d0`,
            departName: `部门0`,
            parentId: '',
            departList: [],
            userList:[]
          }
          for(let i = 0; i< 10; i++){
            tmp.userList.push({
              userId:`u${i}`,
              departId:'d0',
              name:`姓名${i}`
            })
          }
        }
        else{
          //第一次获取
          tmp ={
            departId: `1`,
            departName: `市政府`,
            parentId: '',
            departList: [],
            userList:[]
          }
          for(let i = 0; i< 10; i++){
            tmp.departList.push({
              departId: `d${i}`,
              departName: `部门名${i}`,
              parentId: ''
            })
          }
        }
        return tmp;
      },
      quitStaffSelection(){
		    //数据全部还原
        this.dataDisplaySelectedStaffList = [];
        this.showStaffList = false;
        this.showDepartList = false;
        this.isStaffAllChecked = false;
        this.dataSelectedDepartment = [];

		    //收起弹窗
		    this.showStaffSelection=false;
      },
      initStaffSelection(){
		    //人员列表初始化
        //请求加载对应数据
        //全部已选人员列表
        this.dataDisplaySelectedStaffList = JSON.parse(JSON.stringify(this.dataSelectedStaffList))

        //部门及人员列表（初始化,市政府是根元素）
        this.publicApi.getStaffsOrDepartments({departId:1}).then((res)=>{
          if(res.data.status === 200){
            this.dataAllStaffList = res.data.data.orgDepart;
            this.dataDepartmentMap["1"] = res.data.data;
            // this.dataDepartmentMap["1"].orgDepart = res.data.data.orgDepart;
            // this.dataDepartmentMap["1"].orgUser = res.data.data.orgUser;

            //初始化时 加载第一层部门列表 添加面包屑 添加对应缓存
            if(this.dataSelectedDepartment.length <= 0){
              this.dataDepartmentList = this.dataAllStaffList;
              this.dataSelectedDepartment.push(res.data.data.depart);

              if(res.data.data.orgDepart.length > 0){
                this.dataDepartmentMap["1"].orgDepart = res.data.data.orgDepart;
                this.showDepartList = true;
              }
              else{
                this.showDepartList = true;
              }
              if(res.data.data.orgUser.length > 0){
                this.dataDepartmentMap["1"].orgUser = res.data.data.orgUser
                this.dataStaffList = this.initStaffCheckList(res.data.data.orgUser, this.dataDisplaySelectedStaffList);
                this.showStaffList = true;
              }
              else{
                this.showStaffList = false;
              }
            }

            //初始化某些特殊样式
            this.resetMoreStyle()
          }
          else{
            this.$vux.toast.show({text:res.data.message, type:'warn'})
          }
        })
        // let tmplist = this.getStaffOrDepartmentList().departList;
        // this.dataDepartmentMap["1"] = {
        //   departId :1,
        //   departName:'市政府',
        //   parentId:'',
        //   departList: tmplist,
        //   userList: []
        // }
		  },
      initStaffCheckList(data, checkeddata){
		    //注意初始化已选择的人员
		    let pid = '';
		    let keys = [];
        if(data.length > 0){
          pid = data[0].departId;
        }
		    for(let i in checkeddata){
          if(checkeddata[i].departId === pid){
            keys.push(checkeddata[i].userId)
          }
        }
        for(let i in data){
		      for(let j in keys){
		        if(keys[j] === data[i].userId){
              data[i].checked = true;
            }
          }
        }
        if(keys.length === data.length){
		      this.isStaffAllChecked = true;
        }
        else{
		      this.isStaffAllChecked = false;
        }
        return data;
      },
      actionSelDepartment(item){
        //选择对应的部门
        //根据选择，获取部门或者人员列表信息
        this.publicApi.getStaffsOrDepartments({departId:item.departId}).then((response)=>{
          if(response.data.status === 200){
            let res = response.data.data; //this.getStaffOrDepartmentList(item.departId);
            this.dataDepartmentMap[item.departId] = res; //记录到临时索引中以供跳转
            console.log(this.dataDepartmentMap)
            if(res.orgDepart.length > 0){
              //是部门级联列表
              this.dataDepartmentList = res.orgDepart;
              this.showDepartList = true;
            }
            else{
              this.showDepartList = false;
            }

            if(res.orgUser.length > 0){
              //是人员列表
              this.dataStaffList = this.initStaffCheckList(res.orgUser, this.dataDisplaySelectedStaffList);
              this.showStaffList = true;
            }
            else{
              this.showStaffList = false;
            }
            //添加对应面包屑
            this.dataSelectedDepartment.push(item)
          }
        })
      },
      actionChangeCheckItem(item){
		    //人员选择
		    if(item.checked){
		      item.checked = false;
		      this.removeStaff(item);
        }
        else{
		      item.checked = true;
        }
        this.checkedItemChanges()
      },
      actionCheckAll(){
		    //全选当前人员
        if(this.isStaffAllChecked){
          this.isStaffAllChecked = false;
          //同步更新列表
          this.dataStaffList.forEach((item,i)=>{
            item.checked = false;
          })
          this.removeStaffs()
        }
        else{
          this.isStaffAllChecked = true;
          //同步更新列表
          this.dataStaffList.forEach((item,i)=>{
            item.checked = true;
          })
          this.updateDisplaySelectedStaffList();
        }
      },
      checkedItemChanges(){
		    //选中列表已经发生了变化
        let all = true;
        this.dataStaffList.forEach((item,i)=>{
          if(!item.checked){
            all = false;
          }
        })
        //同步更新全选按钮
        if(all){
          this.isStaffAllChecked = true;
        }
        else{
          this.isStaffAllChecked = false;
        }
        //更新数据
        this.dataStaffList = JSON.parse(JSON.stringify(this.dataStaffList));
        this.updateDisplaySelectedStaffList();
      },
      updateDisplaySelectedStaffList(){
        //更新显示的已选人员列表
        //选出当前已选项目
        let list1 = [];
        let curdepartid = '';
        this.dataStaffList.forEach((item,i)=>{
          if(item.checked){
            list1[item.userId] = item;
            curdepartid = item.departId;
          }
        })
        //选出显示当前部门的人员
        let list2 = [];
        this.dataDisplaySelectedStaffList.forEach((item,i)=>{
          if(item.departId === curdepartid){
            list2.push(item.userId);
          }
        });
        if(list2.length > 0){
          for(let i in list1){
            list2.forEach((key,j)=>{
              if(list1[key]){
                list1[key] = null;
              }
            })
          }
        }
        let list3 = [];
        for(let i in list1){
          if(list1[i]){
            list3.push(list1[i])
          }
        }
        this.dataDisplaySelectedStaffList.unshift(...list3);
        this.resetMoreStyle()
      },
      removeStaff(item){
        this.dataDisplaySelectedStaffList.forEach((it,i)=>{
          if(item.userId === it.userId){
            this.dataDisplaySelectedStaffList.splice(i,1)
          }
        })

        for(let i in this.dataStaffList){
          if(this.dataStaffList[i].userId === item.userId){
            this.dataStaffList[i].checked = false;
          }
        }
        for(let i in this.dataSelectedStaffList){
          if(this.dataSelectedStaffList[i].userId === item.userId){
            this.dataSelectedStaffList.splice(i,1)
          }
        }
        this.checkedItemChanges();
        this.resetMoreStyle();
      },
      removeStaffs(){
		    //从展示列表中全部删除当前部门人员
		    var curdepartid = '';
		    //checklist状态更新
		    this.dataStaffList.forEach((it,i)=>{
		      it.checked = false;
		      curdepartid = it.departId;
        })
        //候选列表状态更新
        var list = [];
        this.dataDisplaySelectedStaffList.forEach((it,i)=>{
          if(it.departId !== curdepartid){
            list.push(it);
          }
        })
        this.dataDisplaySelectedStaffList = list;
        this.resetMoreStyle();
      },
      showTargetDepartmentList(item){
		    //点击面包屑,更改当前选择列表
        if(this.dataDepartmentMap[item.departId].orgDepart.length > 0){
          this.dataDepartmentList = this.dataDepartmentMap[item.departId].orgDepart;
          this.showDepartList = true;
        }
        else{
          this.showDepartList = false;
        }
        if(this.dataDepartmentMap[item.departId].orgUser.length > 0){
          this.dataStaffList = this.initStaffCheckList(this.dataDepartmentMap[item.departId].orgUser, this.dataDisplaySelectedStaffList);
          this.showStaffList = true;
        }
        else {
          this.showStaffList = false;
        }

        let len = this.dataSelectedStaffList.length;
        let targeti = -1;
        this.dataSelectedDepartment.forEach((it,i)=>{
          if(it.departId === item.departId){
            targeti = i;
          }
        })
        console.log(targeti)
        this.dataSelectedDepartment = this.dataSelectedDepartment.splice(0,targeti+1);
      },
      submitSelectedStaffList(){
		    this.dataSelectedStaffList = this.dataDisplaySelectedStaffList;
		    this.showStaffSelection = false;
      },
      resetMoreStyle(){
		    this.$nextTick(()=>{
          //修改已选人员的样式排列
          this.getStaffSelectedHeight();
          //找出最后一个换行元素
          let spans = this.$refs.domStaffSelected.querySelectorAll('span');
          var ti = -1;
          for(let i =0;i < spans.length; i++){
            if(spans[i].offsetTop >= 80){
              ti = i;
              break;
            }
          }
          if(ti!=-1){
            let twidth = spans[ti-1].clientWidth;
            let offsetleft = spans[ti-1].offsetLeft;
            this.$refs.domMoreBtn.style.width = twidth+'px';
            this.$refs.domMoreBtn.style.left = offsetleft+'px';
          }
        })
      },
      actionCreate(){
		    //人员列表赋值
        this.createObj.staffList = this.dataSelectedStaffList;

        //空值检查和预处理
        var errmsg = '';
        if(!this.createObj.title
          || !this.createObj.content
          || this.createObj.staffList.length <= 0
          || !this.createObj.deadline.date
          || !this.createObj.deadline.time
          || !this.createObj.sendMode
          || (this.createObj.sendMode === '2' &&(!this.createObj.fixed.date||!this.createObj.fixed.time))
          || (this.createObj.sendMode === '3' &&(!this.createObj.startDate||!this.createObj.startTime||!this.createObj.endDate||!this.createObj.endTime))){
          this.toastMsg('请填写完整','warn')
          console.log(this.createObj.sendMode)
          return false;
        }
        let deadline = `${this.createObj.deadline.date} ${this.createObj.deadline.time}`;
        if(this.createObj.sendMode === '1'){
          if(new Date().getTime() - new Date(deadline.replace(/-/g, "/")).getTime() > 0){
            this.toastMsg('截止时间不能早于当前时间','warn')
            return false;
          }
        }
        if(this.createObj.sendMode === '2'){
          let start = `${this.createObj.fixed.date} ${this.createObj.fixed.time}`;
          if(new Date(start.replace(/-/g, "/")).getTime() - new Date(deadline.replace(/-/g, "/")).getTime() > 0){
            this.toastMsg('截止时间不能早于发送时间','warn')
            return false;
          }
          if(new Date().getTime() - new Date(start.replace(/-/g, "/")).getTime() > 0){
            this.toastMsg('发送时间不能早于当前时间','warn')
            return false;
          }
        }
        if(this.createObj.sendMode === '3'){
          let startdate = this.createObj.startDate;
          let enddate = this.createObj.endDate;
          let starttime = this.createObj.startTime;
          let endtime = this.createObj.endTime;
          let start = `${startdate} ${starttime}`;
          let end = `${enddate} ${endtime}`;

          if(new Date().getTime() - new Date(start.replace(/-/g, "/")).getTime() > 0){
            this.toastMsg('开始时间不能早于当前时间','warn')
            return false;
          }
          // if(new Date(start.replace(/-/g, "/")).getTime() - new Date(end.replace(/-/g, "/")).getTime() > 0){
          //   this.toastMsg('开始日期不能晚于结束日期','warn')
          //   return false;
          // }
          let s1 = `${startdate} ${starttime}`;
          let e1 = `${startdate} ${endtime}`;
          // if(new Date(s1.replace(/-/g, "/")).getTime() - new Date(e1.replace(/-/g, "/")).getTime() > 0){
          //   this.toastMsg('开始时间不能晚于结束时间','warn')
          //   return false;
          // }
          if(new Date(start.replace(/-/g, "/")).getTime() - new Date(end.replace(/-/g, "/")).getTime() > 0){
            this.toastMsg('开始时间不能晚于结束时间','warn')
            return false;
          }
          if(new Date(start.replace(/-/g, "/")).getTime() - new Date(deadline.replace(/-/g, "/")).getTime() > 0){
            this.toastMsg('截止时间不能早于开始时间','warn')
            return false;
          }
          if(new Date(end.replace(/-/g, "/")).getTime() - new Date(deadline.replace(/-/g, "/")).getTime() > 0){
            this.toastMsg('截止时间不能早于结束时间','warn')
            return false;
          }
        }

        //格式化数据
        let reqdata = JSON.parse(JSON.stringify(this.createObj));
        reqdata.fixedDate = this.createObj.fixed.date;
        reqdata.fixedTime = this.createObj.fixed.time;
        reqdata.deadlineDate = this.createObj.deadline.date;
        reqdata.deadlineTime = this.createObj.deadline.time;
        let list = []
        this.dataSelectedStaffList.forEach((it,i)=>{
          list.push(it.userId);
        });
        reqdata.staffList = JSON.stringify(list);

		    this.publicApi.create(reqdata).then((res)=>{
		      if(res.data.status === 200){
            this.$vux.toast.show({
              text: '创建成功',
              time: 1000,
              onHide:()=>{
                this.$router.push({path:'/TodoList'})
              }
            })
          }else{
		        console.log(res.data.message)
            this.toastMsg(res.data.message, 'warn')
          }
        })
      },
      toastMsg(msg,type='success'){
		    this.$vux.toast.show({
          text: msg,
          type: type
        })
      },
      changeViewHeight(){
		    document.querySelector('textarea').scrollIntoView(true)
		    // setTimeout(()=>{document.querySelector('.g-p').scrollTop = 10000;},300)
      }
		}
	}
</script>

<style>
</style>
