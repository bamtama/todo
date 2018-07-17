<template>
	<x-header class="g-header" slot="header">
    	<span class="title">{{mTitle}}</span>
    	<span v-if="defaultBack" slot="overwrite-left" v-on:click="actionBack" class="m-back">
    		<i class="iconfont icon-arrow-left"></i>
    	</span>
   		<span v-else slot="overwrite-left" v-on:click="actionLeft" class="m-back" v-html="leftBtn"></span>
   		<div slot="right" v-html="rightBtn" v-on:click="actionRight"></div>
	</x-header>
</template>

<script>
	import {XHeader} from 'vux'
	export default{
		name:'customHeader',
		components:{
			XHeader
		},
		props:{
			mTitle:{},
			rightBtn:{},
			leftBtn:{},
			defaultBack:{
				type: Boolean,
				default: true
			}
		},
		methods:{
			actionBack(){
				this.$router.go(-1)
			},
			actionLeft(){
				this.$emit('actionLeft')
			},
			actionRight(){
				this.$emit('actionRight')
			}
		},
		mounted(){
		}
	}
</script>
<style lang="less" scoped>
.g-header{
	.title{
		font-size: 20px;
		color: #fff;
    font-weight: 500;
	}
	.m-back{
		.iconfont{
			color: #fff;
			font-size: 20px;
		}
	}
}
</style>
