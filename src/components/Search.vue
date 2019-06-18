<template>
	<div class="Search">
		<van-search
		  v-model="value" placeholder="请输入搜索关键词" show-action  @click="focusFn" >
		  <div slot="action" @click="onSearch">搜索</div>
		</van-search>
		<div class="tags" v-if="isHidden">
			<p>搜索历史</p>
			<ul class="tag-row cleanfix">
				<li class="tag-col one-text" v-for="(item , index) in searchHistory" @click="isValue(item)">{{item}}</li>
			</ul>
		</div>
		<div class="song" v-for="(item, index) in songsList[0]" :key="index" @click="goPlaydetail({name:'playdetail',params:{id:hotId,pid:item.id}},item)">
			<div class="songpic fl">
				<img class="auto-image" :src="item.pic"/>
			</div>
			<div class="singerMessage">
				<div class="songName one-text">{{item.name}}</div>
				<div class="singerName one-text">{{item.singer}}</div>
			</div>
			<div class="playMusic fr">
				<img class="auto-image" :src="play"/>
			</div>
		</div>
		
	</div>
</template>

<script>
	import { Search, Toast } from 'vant';
	export default{
		name:'Search',
		data(){
			return{
				value:'',
				isHidden:false,
				songsList:[],
				searchHistory:[],
				playHistory:[],
				hotId:3778678,
				play:require('../assets/icon/ic_action_bar_play_pressed.png')
			}
		},
		created(){
				//获取本地存储中的数据
				var searchHistorydata = localStorage.getItem('searchHistory')
				this.searchHistory = searchHistorydata == undefined ? [] : JSON.parse(searchHistorydata)
		},
		methods:{
			onSearch(){
				if(this.value == '' || this.value == undefined){
					Toast('搜索内容不能为空');
					return;
				}
	  			this.isHidden = false;
		  		const search = "https://api.itooi.cn/music/netease/search?key=579621905&s="+ this.value+"&type=song&limit=100&offset=0"
				this.$axios.post(search).then((res)=>{
					console.log(res)
		  		this.songsList.push(res.data.data)
  				})
			
				if (!this.searchHistory) {
					
					this.searchHistory = [];
				}
				else if (this.searchHistory.length >= 10) {
					this.searchHistory.shift();
				}
				if ( this.searchHistory.indexOf(this.value) === -1) {
					
					this.searchHistory.push(this.value);
					localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
				}
				
			},
			
			isValue(item){
				this.value = item
			},
			focusFn(){
				this.isHidden=true;
				this.songsList = [];
				this.value = ''
				
			},
			goPlaydetail(path,item){
				this.$router.push(path)
				var playHistory = localStorage.getItem('playHistory')
				console.log(playHistory)
				this.playHistory = playHistory == [] ? null : JSON.parse(playHistory)
				if(!this.playHistory){
					this.playHistory = []
				}
				else if(this.playHistory.length>=10){
					this.playHistory.shift()
				}
				if(this.playHistory.indexOf(item.name) === -1){
					this.playHistory.unshift(item.name)
					localStorage.setItem('playHistory',JSON.stringify(this.playHistory))
					
				}
			}
				
				
		},
		components:{
			[Search.name]:Search,
			[Toast.name]:Toast
		}
	}
</script>

<style lang="less" scoped>
	.tags{
		margin-top: 0.8rem;
		padding: 0.4rem;
		p{
			font-size: 17Px;
		}
		.tag-col{
			margin-right: 0.4rem;
			background-color: #f2f2f2;
			max-width: 160px;
			margin-top: 0.2rem;
			padding: 0.1rem;
			display: inline-block;
		}
	}
	.song{
		width: 100%;
		height: 2rem;
		/*background-color: #000000;*/
		margin-top: 0.2rem;
		>div{
			display: inline-block;
		}
		.songpic{
			width: 2rem;
			height: 2rem;
			margin-left: 0.2rem;
		}
		.singerMessage{
			height: 2rem;
			margin-top: 0.5rem;
			margin-left: 0.25rem;
			/*display: inline-block;*/
			
			.songName{
				font-size: 16px;
				max-width: 120px;
			}
			.singerName{
				padding-top: 0.2rem;
				color: #CCCCCC;
				max-width: 120px;
			}
		}
		.playMusic{
			width: 1.5rem;
			height: 1.5rem;
		}
	}
</style>