<template>
	<div class="musicHall">
		<!--轮播图-->
		<van-swipe :autoplay="2500">
		  <van-swipe-item v-for="(item, index) in images" :key="index">
		  	<img class="auto-image" :src="item.url" />
		  </van-swipe-item>
		</van-swipe>
		<!--获取电台信息-->
		<div class="hotSong">&nbsp;热门歌单</div>
		<div class="songMessage" v-for="(item, index) in hotSonglist[0]" @click="goDetail({name:'songdetail' , params:{id:item.id}})">
			<div class="songImg"><img  class="auto-image" :src="item.coverImgUrl"/></div>
			<div class="songName one-text">{{item.creator}}</div>
		</div>
	</div>
</template>

<script>
	import { Swipe, SwipeItem } from 'vant';
	export default {
		name:'Musichhall',
		data(){
			return{
				hotSonglist:[],
				images:[
				{url:require("../assets/images/1258461.jpg")},
				{url:require("../assets/images/1257979.jpg")},
				{url:require("../assets/images/1259258.jpg")},
				{url:require("../assets/images/1259260.jpg")},
				]
			}
		},
		created(){
	  	//获取热门歌单
			const hot = " https://api.itooi.cn/music/netease/hotSongList?key=579621905&cat=全部&limit=10&offset=0"
	  		this.$axios.get(hot).then((res)=>{
	  		this.hotSonglist.push(res.data.data)
	  		console.log(this.hotSonglist)
	  	
	  		})
	  	},
	  	methods:{
	  		goDetail(path){
	  			this.$router.push(path)
	  		},
	  	},
	  	
		components:{
		[Swipe.name]:Swipe,
		[SwipeItem.name]:SwipeItem,
		}
	}
</script>

<style lang="less" scoped>
	.hotSong{
		width: 100%;
		height: 1rem;
		line-height: 1rem;
		background-color:#CCCCCC ;
		font-size: 16px;
	}
	.songMessage{
		width: 50%;
		height: 5rem;
		/*background-color: #000000;*/
		display: inline-block;
		
		.songImg{
			width: 4rem;
			height: 4rem;
			background-color: #FFFFFF;
			margin: .2rem auto;
		}
		.songName{
			margin: 0 auto;
			max-width: 120px;
		}
	}
</style>