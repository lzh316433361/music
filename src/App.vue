<template>
  <div id="app">
  		<van-row>
			 	<div class="tab" ref="vtabs">
					<div class="fl" v-for="(item, index) in tabs" :key="index"><span :class="{active: item.ischeck}" @click="toggleTab(item)">{{item.title}}<i class="line" :class="{'active-bg': item.ischeck}"></i></span></div>
				</div>
			<!--<van-col span="24">
 				<van-search placeholder="请输入搜索关键词" background="#60BE81" v-model="value"  />
			</van-col>-->
		</van-row>
		
  		<router-view></router-view>
  		
  		<!--<div class="playTab"   v-show="this.bar">
	  			<div class="playImg">
	  				<img :src="this.singerImg" class="auto-image"/>
	  			</div>
	  			<div class="songMessage">
	  				<div class="songName one-text">你把我灌醉</div>
	  				<div class="singerName one-text">邓紫棋</div>
	  			</div>
	  			<div class="fr">
	  				<!--<img class="auto-image" src="./assets/icon/landscape_player_btn_play_normal.png"/>-->
	  			<!--</div>
	  			
  			</div>
  			-->
  		</div>
  </div>
</template>

<script>
	import { Tab, Tabs,Search,Row,Col  } from 'vant';
	export default {
	  name: 'app',
	  data(){
	  	return{
	  		home:false,
	  		value:'',
	  		bar:true,
//	  		singerImg:require('./assets/icon/mymusic_icon_paid_songs_highlight.png'),
	  		tabs:[
		  		{title:'热歌榜',path:{name:'home'},ischeck: true},
		  		{title:'推荐音乐',path:{name:'musichall'},ischeck: false},
		  		{title:'搜索',path:{name:'search'},ischeck: false},
	  		],
	  		isDiv:false,
	  	}
	  },
	  
	  methods:{
	  
	  	godetail(){
	  		this.$router.push({name:"detail"})
	  	},
	  	toggleTab(item) {

				if (item.ischeck) {
					return;
				}

				for (var i = 0; i < this.tabs.length; i++) {
					if (this.tabs[i].ischeck) {
						this.tabs[i].ischeck = false;
						break;
					}
				}

				item.ischeck = true;

				this.$router.push(item.path);
			},
	  	getdata(){
	  		const songlist = "https://v1.itooi.cn/tencent/url?id=224667131"
	  		//tencent/url?id=6418529028&quality=128
	  		this.$axios.get(songlist).then((data) =>{
	  			console.log(data)
	  		})
	  	}
	  },
	  components:{
	  	[Tab.name]:Tab,
	  	[Tabs.name]:Tabs,
	  	[Search.name]:Search,
	  	[Row.name]:Row,
	  	[Col.name]:Col,
	  }
	}
	</script>
	
	<style lang="less">
		body{
				margin: 0 auto;
			}
			ul{
				margin: 0;
				padding: 0;
				list-style: none;
			}
			.auto-image{
				width: 100%;
				display: block;
			}
			input{
				padding: 0;
				margin: 0;
				border: none;
				outline: none;
				background-color:transparent ;
			}
			.fl{
				float: left;
			}
			.fr{
				float: right;
			}
			.cleanfix{
				overflow: hidden;
			}
			.one-text{
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.playTab{
				width: 100%;
				height: 1.5rem;
				background-color: red;
				position: fixed;
				left: 0;
				bottom: 0;
				.playImg{
					width: 1.25rem;
					height: 1.25rem;
					background-color: white;
					position: absolute;
					margin-left:0.5rem;
					margin-top:0.125rem;
					border-radius:50%;
					overflow:hidden;
				}
				.fr{
					width: 1.25rem;
					height: 1.25rem;
					margin-right: 2rem;
					padding-top: 0.2rem;
					
				}
				.songMessage{
					position: absolute;
					margin-left:2.25rem;
					max-width: 120px;
					margin-top: 0.25rem;
					.songName{
						font-size: 15px;
					}
					.singerName{
						margin-top: 0.15rem;
						color: #CCCCCC;
					}
				}
			}
			.active{
			color: #FFFFFF;
		}
	.tab{
			
			height: 1rem;
			background-color: #60BE81;
			font-size: 16px;
			color: #ccc;
			
			>div{
				width: 33%;
				text-align: center;
				line-height: .8rem;
				span{
					position: relative;
					height: .8rem;
					display: inline-block;
					i{
						position: absolute;
						width: 100%;
						left: 0;
						bottom: -2px;
						height: 2px;
						
					}
				}
			}
		}
		.div1{
			position: absolute;
			width: 100%;
			height: 100%;
			background-color: green;
			left: 0;
			top: 0;
		}
	</style>
