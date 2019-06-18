import routesComponent from './routesComponent.js'

//路由配置
export default [

	{
		path: '/',
		name: 'home',
		component: routesComponent.Home,
	},
	{
		path: '/musichall',
		name: 'musichall',
		component: routesComponent.Musichall
	},
	{
		path: '/songdetail/:id',
		name: 'songdetail',
		component: routesComponent.Songdetail
	},
	{
		path: '/playdetail/:pid/:id',
		name: 'playdetail',
		component: routesComponent.Playdetail
	},
	{
		path: '/search',
		name: 'search',
		component: routesComponent.Search
	},
	
]