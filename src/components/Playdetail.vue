<template>
	<div class="playMusic">
		<!-- oncanplay="oncanplay()" -->
		<audio :src="songUrl"  autoplay id="audio" @timeupdate="changePx()" @error="errorEm()" @canplay="canPlay()"></audio>
		<div class="navTop">
			<div class="goBack"><img class="auto-image" src="../assets/icon/goBack.png" @click="goBack"></div>
			<div class="songInfo" v-for="(item, index) in song">
				<div class="songName">{{item.name}}</div>
				<div class="singer">{{item.singer}}</div>
				<div class="ball" v-show="roundShow" @click="lrc">
					<img class="auto-image pic" :src="item.pic">
				</div>
				<div class="wrapper" v-show="lrcShow" @click="round">
					<div class="scrollH" :style="{top:mt}">
						<div class="content"  v-for="(item,index) in cTlrc" :key="index">
							<p class="lrcTop">{{item}}</p>
						</div>
					</div>
					
				</div>
			</div>
			
		</div>
		<div class="progress">
			<div class="startTime fl">{{this.currentTimes}}</div>
			<div class="proseeBar">
				<!--//进度条背景色-->
				<div class="bg" :style="{width:mL}"></div>
				<!--滑块-->
				<div class="floor" :style="{left:mL}"></div>
				<!--绑定触摸事件层-->
				<div class="layer"  @touchmove="move"></div>
			</div>
			<div class="endTime fr">{{this.endTime}}</div>
		</div>
		<div class="playHistory" v-show="isplayHistory">
			<div class="songMessage" v-for="(item,index) in playHistorys" :key="index">
				<div class="musicName" >{{item}}</div>
				<div class="delete" @click="deteleHistory(item,index)"><img class="auto-image" src="../assets/icon/image_picker_delete_icon.png"/></div>
			</div>
			<div class="close" @click="closeHistory">关闭</div>
		</div>
		<div class="bottom">
			<div class="conList">
				<div @click="playWay()"><img class="auto-image orderIcon" :src="this.order"></div>
				<div @click="prev()"><img class="auto-imgage conIcon" src="../assets/icon/landscape_player_btn_pre_normal.png"></div>
				<div @click="Play()" ><img class="auto-imgage conIcon playIcon" id="playImg" :src="pusedicon"></div>
				<div @click="next()"><img class="auto-imgage conIcon" src="../assets/icon/landscape_player_btn_next_normal.png"></div>
				<div @click="playHistory()"><img class="auto-imgage conIcon" src="../assets/icon/minibar_btn_playlist_highlight.png"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import BSscroll from 'better-scroll'
	import { Notify , Toast } from 'vant';
	export default{
		name:'Playdetail',
	
		data(){
			return{
				//外部传入的当前歌曲的id
				musicId:null,
				mt:"-0px",
				gCId:null,
//				将当前歌曲id的详细信息
				song:[],
				//还未解析的歌词
				str:null,
				roundShow:false,
				lrcShow:true,
				//歌词
				cTlrc:[],
				musicIdlrc:null,
				//设置中心旋转的图片
				currentSongPic:null,
//				页面进入之后媒体播放的路径
				songUrl:null,
//				结束时间
				endTime:null,
//				起始时间
				currentTimes:"00:00",
//				点击中间播放时判断时播放还是暂停状态
				isPlay:1,
				timer:null,
				pressWidth:100,
				mL:"0px",
//				当前歌单的所有歌曲
				songsList:[],
				musicLong:null,
				lrcTime:[],
				lrcText:[],
				lrcHeight:null,
				//设置点击次数设置播放方式
				isPlayway:1,
				clienWidth:null,
				playHistorys:[],
				isplayHistory:false,
				playicon:require('../assets/icon/landscape_player_btn_play_normal.png'),
				pusedicon:require("../assets/icon/landscape_player_btn_pause_normal.png"),
				//顺序播放图片
				orders:require("../assets/icon/playmode_cycle.png"),
				//起始顺序播放图片
				order:require("../assets/icon/playmode_cycle.png"),
				//循环
				circulation:require("../assets/icon/playmode_repeate_single.png"),
				//随机
				random:require("../assets/icon/playmode_rand.png")
			}
		},
		
		methods:{
			canPlay(){
				var audio = document.getElementById("audio")
				this.musicLong = audio.duration
				this.clienWidth = document.getElementsByClassName("proseeBar")[0].clientWidth
				this.lrcHeight = document.getElementsByClassName("scrollH")[0].clientHeight
				
				

			},
			test(){
				var aa = document.getElementsByClassName("scrollH")[0].offsetHeight
				
			},
			errorEm(){
				//设置获取资源失败时弹出层
				Notify({
					  message: '获取资源失败',
					  duration: 1000,
					  background: '#cccccc'
				});
//				for (var i=0; i <this.songsList[0].length; i++) {
//						if (this.songsList[0][i].id == this.musicId) {
//						this.musicId = this.songsList[0][i+1].id
//						this.song = []
//						this.song.push(this.songsList[0][i+1])
//						this.songUrl = this.songsList[0][i+1].url
//						this.musicId = this.songsList[0][i+1].id
////							console.log(this.isPlayway)
//						return
//							}
//						}
			},
			
			lrc(){
					this.roundShow=false,
					this.lrcShow=true

			},
			round(){
					this.roundShow=true,
					this.lrcShow=false
			},
			
			//设置进度条跟随时间变化
			changePx(){
				//改变起始时间
				var audio = document.getElementById("audio")
				var currentTime1 = (Math.floor((audio.currentTime)%60))
					if (currentTime1 < 10) {
						currentTime1 = "0" + currentTime1
						
					}else{
						currentTime1 = (Math.floor(audio.currentTime%60))
					}
				var currentTime = ((Math.floor(audio.currentTime/60)))
					if (currentTime < 10) {
						currentTime= "0" +currentTime
					} else{
						currentTime = ((Math.floor(audio.currentTime/60)))
					}
				this.currentTimes = currentTime +":"+currentTime1;
				
				//获取当前播放的进度
				var cT = audio.currentTime
				//动态改变歌词位置
				this.mt = -(this.lrcHeight/this.musicLong)*cT + "px"	
//				console.log((this.lrcHeight/this.musicLong)*cT)
//				console.log(this.mt)
				//动态改变距离
				this.mL=(this.clienWidth/this.musicLong)*cT + "px"
//				
				//
				if(audio.ended){
					if(this.isPlayway == 1){
						//顺序播放
					for (var i=0; i <this.songsList[0].length; i++) {
						if (this.songsList[0][i].id == this.musicId) {
						this.musicId = this.songsList[0][i+1].id
						this.song = []
						this.cTlrc=[]
						this.song.push(this.songsList[0][i+1])
						this.songUrl = this.songsList[0][i+1].url
						this.musicId = this.songsList[0][i+1].id
							console.log(this.isPlayway)
						return
							}
						}
					}
					else if(this.isPlayway == 2){
						//循环播放
						audio.loop = true;
						audio.autoplay = true;
						return	
							
					}
					else if(this.isPlayway == 3){
						var rademo = parseInt(Math.random()*10+3)
						for (var i=0; i <this.songsList[0].length; i++) {
						if (this.songsList[0][i].id == this.musicId) {
						this.musicId = this.songsList[0][i+rademo].id
						this.song = []
						this.cTlrc=[]
						this.song.push(this.songsList[0][i+rademo])
						this.songUrl = this.songsList[0][i+rademo].url
						this.musicId = this.songsList[0][i+rademo].id
						return
							}
						}
						}
					}

			},
			//暂停和播放
			Play(){
				var playImg = document.getElementById("playImg")
				var audio = document.getElementById("audio")
				var rotate = document.querySelector(".ball")
				if(this.isPlay == 1){
					audio.pause()
					playImg.src = this.playicon
					this.isPlay = 0
					rotate.style.animationPlayState = "paused";
					
				}else if(this.isPlay == 0 || this.isPlay ==null){
					audio.play()
					playImg.src = this.pusedicon
					this.isPlay = 1
					rotate.style.animationPlayState = "running";
				}
				
			},
			//下一曲
			next(){
				//用户点击进入的歌曲
					if(this.isPlayway == 1){
						//顺序播放
					for (var i=0; i <this.songsList[0].length; i++) {
						if (this.songsList[0][i].id == this.musicId) {
						this.musicId = this.songsList[0][i+1].id
						this.song = []
						this.gCId= this.songsList[0][i+1].id
						this.song.push(this.songsList[0][i+1])
						this.songUrl = this.songsList[0][i+1].url
						this.musicId = this.songsList[0][i+1].id
						
						return
							}
						}
					}
					else if(this.isPlayway == 2){
						//循环播放
						audio.loop = true;
						audio.autoplay = true;
						return	
							
					}
					else if(this.isPlayway == 3){
						var rademo = parseInt(Math.random()*10+3)
						for (var i=0; i <this.songsList[0].length; i++) {
						if (this.songsList[0][i].id == this.musicId) {
						this.musicId = this.songsList[0][i+rademo].id
						this.song = []
						this.cTlrc=[]
						this.song.push(this.songsList[0][i+rademo])
						this.songUrl = this.songsList[0][i+rademo].url
						this.musicId = this.songsList[0][i+rademo].id
						return
							}
						}
							
					}
				
			},
			//上一曲
			prev(){
					if(this.isPlayway == 1){
						//顺序播放
					for (var i=0; i <this.songsList[0].length; i++) {
						if (this.songsList[0][i].id == this.musicId) {
						this.musicId = this.songsList[0][i-1].id
						this.song = []
						this.cTlrc=[]
						this.song.push(this.songsList[0][i-1])
						this.songUrl = this.songsList[0][i-1].url
						this.musicId = this.songsList[0][i-1].id
						return
							}
						}
					}
					else if(this.isPlayway == 2){
						//循环播放
						audio.loop = true;
						audio.autoplay = true;
						return	
							
					}
					else if(this.isPlayway == 3){
						var rademo = parseInt(Math.random()*10+3)
						for (var i=0; i <this.songsList[0].length; i++) {
						if (this.songsList[0][i].id == this.musicId) {
						this.musicId = this.songsList[0][i-rademo].id
						this.song = []
						this.cTlrc=[]
						this.song.push(this.songsList[0][i-rademo])
						this.songUrl = this.songsList[0][i-rademo].url
						this.musicId = this.songsList[0][i-rademo].id
						return
							}
						}
							
					}
			},
			move(e){
				console.log(this.e)
			},
			//播放方式 顺序 循环 随机
			playWay(){
//				console.log(this.isPlayway)
				if(this.isPlayway === 1){
						this.isPlayway = 2
						this.order = this.circulation
						Toast('循环播放');
//						console.log(this.isPlayway)
				}else if(this.isPlayway === 2){
						this.isPlayway = 3
						this.order = this.random
						Toast('随机播放');
//						console.log(this.isPlayway)
						
				}else if(this.isPlayway === 3){
						this.isPlayway = 1
						this.order = this.orders
						Toast('顺序播放');
//						console.log(this.isPlayway)
						
				}
			}
			,
			//查看播放历史
			playHistory(){
				this.isplayHistory = true;
				this.playHistorys = JSON.parse(localStorage.getItem('playHistory')) 
				console.log(this.playHistorys)
			},
			deteleHistory(item,index){
				for(var i=0; i<this.playHistorys.length; i++){
					if(this.playHistorys[i] == item && index == i){
						console.log("相同")
						this.playHistorys.splice(i,1)
						localStorage.setItem('playHistory',JSON.stringify(this.playHistorys))
						return 
					}
					
				}
			},
			closeHistory(){
				this.isplayHistory = false
			},
			goBack(){
				this.$router.go(-1);
			},
			
			
		},
		
		
		created(){
			//拿到歌单id遍历数据
			this.songId = this.$route.params.id;
			const gd = "https://api.itooi.cn/music/netease/songList?key=579621905&id="+this.songId+"&limit=10&offset=0" ;
	  		this.$axios.get(gd).then((data)=>{
		  	this.songsList.push(data.data.data.songs)
//		  	console.log(this.songsList)
			
  			})
			
	  		
		},
		mounted(){
		
			this.musicId = this.$route.params.pid
			const rS = "https://api.itooi.cn/music/netease/song?key=579621905&id=" + this.musicId;
	  		this.$axios.post(rS).then((data)=>{
//	  			console.log(data)
	  			this.song.push(data.data.data) 
	  			this.currentSongPic = this.song[0].pic
	  			this.songUrl = this.song[0].url
	  			const songTime = this.song[0].time

	  			var min = parseInt(songTime/60)
	  			var son = songTime%60
	  			if(min < 9){
	  			   min= "0" + min;
	  			}
	  			if(son <9){
	  				 son = "0" + son;
	  			}
	  			this.endTime = min+":"+son;
	  		})
	  		this.gCId = this.musicId
			  	const gC = "https://api.itooi.cn/music/netease/lrc?key=579621905&id="+ this.gCId;
			  	this.$axios.post(gC).then((data)=>{
			  	this.str = data.data
			  	var lrc = this.str;//获取文本域里的值
	            /*console.log(lrc);*/
		        var lrcArr = lrc.split("[");//去除[
		        /*console.log(lrcArr);*/
		        var html = "";//定义一个空变量保存文本
		        for(var i=0 ; i<lrcArr.length ; i++)
		          {
	            var arr = lrcArr[i].split("]");
	             /*console.log(arr[1]);*/
	            var allTime = arr[0].split(".");
	            var time = allTime[0].split(":");
	             //获取分钟 秒钟 把时间换算成秒钟
	            var timer = time[0]*60 + time[1]*1;
	            var text = arr[1];
	            if(text)
	              {
	                html += "<p id="+timer+">"+text+"</p>"
	                this.cTlrc.push(text)
	              }        
            	}
		       })

	  		
		},
		components:{
			[Notify.name]:Notify,
			[Toast.name]:Toast,
		},
	}
	
</script>

<style lang="less" scoped>
	.playMusic{
		background: linear-gradient(#786D6B, #397E5D);
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		.navTop{
			// background-color: aquamarine;
			height: 1.5rem;
			.goBack{
				display: inline-block;
				height: .7rem;
				width: .7rem;
				margin-left: .3rem;
				margin-top: .35rem;
			}
			.songInfo{
				height: 1.5rem;
				width: 100%;
				/*display: inline-block;*/
				text-align: center;
				.songName{
					color: #D5D4D6;
					font-size: 0.5rem;
				}
			.singer{
					color: #938E93;
					font-size: 0.4rem;
				}
			}
		}
		.ball{
			height: 5.4rem;
			width: 5.4rem;
			margin: 3rem auto;
			border-radius: 50%;
			box-shadow: 2px 2px 2px #5D585A;
			animation: rotate 15s linear 0s infinite;
			overflow: hidden;
			
		}
		.bottom{
			position: absolute;
			left: 0;
			bottom: 0;
			height: 3.5rem;
			width: 100%;
			/*// background-color: #F0582F;*/
			.conList{
				height: 2rem;
				margin: 1rem 0 0 0.8rem;
				>div{
					display: inline-block;
				}
				.orderIcon{
					width: 0.6rem;
					height: 0.6rem;
					/*background-color: white;*/
					margin:  .6rem .32rem;
				}
				.conIcon{
					margin:  .45rem .32rem;
					width: 1rem;
					display: inline-block;
				}
				.playIcon{
					width: 1.5rem;
				}
			}
		}
	}
	
	.progress{
		width: 100%;
		height: 0.5rem;
		position: absolute;
		bottom: 3rem;
		/*background-color: red;*/
		>div{
			display: inline-block;
		}
		.startTime{
			width: 20px;
			padding-left: 20px;
			line-height: 0.5rem;
			
		}
		.endTime{
			width: 20px;
			padding-right: 15px;
			line-height: 0.5rem;
			
		}
		.proseeBar{
			margin-left: 12px;
			margin-top: 5px;
			height: 0.1rem;
			width: 7.4rem;
			background-color:rgba(222,222,222,.5);
			position: relative;
			.floor{
				width: 10px;
				height: 10px;
				background-color: white;
				border-radius:50% ;
				z-index: 1;
				position: absolute;
				top: 0;
				left: 0;
				margin-top: -0.1rem;
				animation: linght 2s linear 0s infinite alternate;
			}
			.layer{
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 10px;
				z-index: 6;
				top: -.07rem;
			}
			.bg{
				height: 100%;
				background-color:#05A208;
			}
		}
	}
	.playHistory{
		width:100%;
		height: 10rem;
		overflow: auto;
		background-color:rgba(100,100,100,.98);
		position: absolute;
		bottom: 0;
		z-index: 1;
		.close{
			width: 100%;
			height: 1.5rem;
			text-align: center;
			font-size: 20px;
			/*position: absolute;
			bottom: 0;*/
			/*border: solid;*/
			line-height: 1.5rem;
		}
		.songMessage{
			width: 100%;
			height: 1rem;
			border-bottom: solid ;
			padding-top: 0.1rem;
			/*background-color: #C6D1BC;*/
			font-size: 14px;
			>div{
				line-height: 1rem;
				display: inline-block;
				float: left;
				
			}
			.musicName{
				margin-left: 10px;
				>span{
					font-size: 12px;
				}
			}
			.delete{
				float: right;
				margin-right:10px;
				margin-top: 0.15rem;
				height: 0.7rem;
				width: 0.7rem;
				
			}
		}
	}
	.wrapper{
		position: absolute;
		display:block;
		left: 20%;
		width: 60%;
		height:10rem;
		/*background-color: wheat;*/
		margin: 1rem 0;
		overflow: hidden;
		.scrollH{
			position: absolute;
			margin-top: 100px;
			left: auto;
			
		}
		.lrcTop{
			margin-top: 0.5rem;
			font-size: 16px;
			color: #CCCCCC;
		}
	}
	@keyframes rotate{
		from{
			transform: rotate(0deg);
		}
		to{
			transform: rotate(360deg);
		}
	}
	@keyframes linght{
		from{
			box-shadow: 0 0 8px 1px rgba(255,255,255,.3);
		}
		to{
			box-shadow: 0 0 8px 4px rgba(255,255,255,1);
		}
	}
</style>