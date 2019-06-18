<template>
	<div class="music">
		<div>
			<img class="hotPic" :src="songListPic"/>
		</div>
		
		<div class="song" v-for="(item, index) in hotSonglist[0]" :key="index" @click="goplaydetail({name:'playdetail',params:{id:hotId,pid:item.id}},item)" >
			<div class="songpic">{{index+1}}</div>
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
	export default {
	  name: 'Home',
	  data(){
	  	return{
	  		songListPic:null,
	  		hotSonglist:[],
	  		hotId:null,
	  		play:require('../assets/icon/ic_action_bar_play_pressed.png')
	  		
	  	}
	  },
	  methods:{
	  	goplaydetail(path,item){
				this.$router.push(path)
				var playHistory = localStorage.getItem('playHistory')
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

//				console.log(playHistory)
				
		}
	  },
	  
	  created(){
//	  	//热歌榜
			const rS = " https://api.itooi.cn/music/netease/songList?key=579621905&id=3778678&limit=20&offset=0"
	  		this.$axios.post(rS).then((res)=>{
	  		this.hotId=res.data.data.songListId
	  		this.songListPic =res.data.data.songListPic
	  		this.hotSonglist.push(res.data.data.songs.slice(0,20))
	  		
	  		console.log(this.hotSonglist)
	  		
  		})

	 },
	}
</script>

<style lang="less" scoped>
		.hotPic{
			width: 100%;
			height: 4rem;
		}
		.song{
		width: 100%;
		height: 1rem;
		/*background-color: #000000;*/
		margin-top: 0.2rem;
		>div{
			display: inline-block;
		}
		.songpic{
			width: 1rem;
			height: 1rem;
			margin-left: 0.2rem;
			font-size: 20px;
			line-height: 1rem;
			position: absolute;
			text-align: center;
			color: #e4393c;
			font-weight: bold;
		}
		.singerMessage{
			height: 1rem;
			position: absolute;
			margin-left: 1.45rem;
			.songName{
				font-size: 15px;
				max-width: 120px;
			}
			.singerName{
				padding-top: 0.1rem;
				color: #CCCCCC;
				max-width: 120px;
			}
		}
		.playMusic{
			width: 1rem;
			height: 1rem;
		}
	}
</style>
