<template>
	<div class="Songdetail">
		<audio :src="play"></audio>
		<div class="Songdetail"  v-for="(item,index) in songTitle">
			<div class="songpic"><img :src="item.songListPic" class="auto-image"/></div>
			<div class="songexplain">{{item.songListDescription}}</div>
		</div>
		<div class="nums" v-for="(item,index) in songTitle" >
			<div class="fl">歌单&nbsp;共{{item.songListCount}} 首</div>
			<div class="fr">收藏 </div>
		</div>
		<!--歌曲列表-->
		<div class="musicList" ref="van" v-for="(item , index) in songList[0]" :key="index" @click="goplaydetail({name:'playdetail',params:{pid:item.id}},item)">
				<div class="fl"  >
					<div class="musicName one-text">{{item.name}}</div>
					<div class="musicSinger one-text">{{item.singer}}</div>
				</div>
				<div class=" fr">
					<img   :src="playicon" class="auto-image"/>
				</div>
		</div>
	</div>
</template>

<script>
	export default{
		name:'Songdetail',

		data(){
			return{
			songsId:null,
			songList:[],
			songTitle:[],
			play:null,
			isPlay:0,
			currentTime:null,
			playHistory:[],
			playicon:require('../assets/icon/landscape_player_btn_play_normal.png'),
			pusedicon:require("../assets/icon/player_btn_pause_highlight.png")
			}
		},
		methods:{
			goplaydetail(path,item){
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

				console.log(playHistory)
				
			}
		},
		created(){
			//获取歌单里面的所有歌曲
			this.songsId = this.$route.params.id;
			const rS = "https://api.itooi.cn/music/netease/songList?key=579621905&id="+this.songsId+"&limit=10&offset=0" ;
	  		this.$axios.get(rS).then((data)=>{
		  	this.songList.push(data.data.data.songs)
		  	this.songTitle.push(data.data.data)
		  	
  		})
	  	
	 },
  	
	
	}
</script>

<style lang="less" scoped="">
	.Songdetail{
		width: 100%;
		height: 5rem;
		background-color:#60BE81 ;
		>div{
			float: left;
		}
		.songpic{
			width: 3rem;
			height: 3rem;
			margin-top: .8rem;
			margin-left: 1rem;
			display: inline-block;
		}
		.songexplain{
			/*color: #FFFFFF;*/
			position: absolute;
			display: inline-block;
			font-size: 14px;
			margin-top: .8rem;
			margin-left: .8rem;
			margin-right: .8rem;
			max-height: 4rem;
			max-width: 5rem;
			overflow: hidden;
		}
	}
	.nums{
		width: 100%;
		height: 1rem;
		.fl{
			font-size: 16px;
			color: #CCCCCC;
			margin-left: 10px;
			line-height: 1rem;
		}
		.fr{
			line-height: 1rem;
			margin-right: 10px;
			color: #60BE81;
			font-size: 16px;
			.collect{
			display: inline-block;
			width: .8rem;
			height: .8rem;
			}
		}
		
	}
	.musicList{
		width: 100%;
		height: 1rem;
		padding-top: .5rem;
		>div{display: inline-block;} 
		.fl{
			margin-left: 10px;
			width: 50%;
			
			.musicName{
				font-size:16px ;
				/*line-height: 1rem;*/
				max-width: 160px;
			}
			.musicSinger{
				color: #CCCCCC;
				padding-top: .15rem;
				max-width: 120px;
			}
		}
		.fr{
			width: 1rem;
			height: 1rem;
			margin-right: 10px;
		}
	}
</style>