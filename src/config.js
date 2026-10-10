const config = {
	//网页元数据
	metaData: {
		title: 'FN的个人主页🎉',
		description: '欢迎来到FN的奇妙世界！',
		keywords: 'FN,fn,个人主页,个人网站',
		icon: '/favicon.ico'   //网页图标，支持外链
	},

	avatar: "/img/avatar.jpg", // 头像
	welcometitle: "Hi, I'm FN", // 标题

	// 颜色配置
	color: {
		themecolor: "#FFFFFF", // 主题颜色，推荐趋于亮白可带有轻微色调，例： #D1FFEC
		welcometitlecolor: "#FFFFFF", // 标题颜色 例： #7BFFC9
		turntablecolor1: "#FFFF00",  // 转盘渐变色一
		turntablecolor2: "#00FFFF"   // 转盘渐变色二
	},

	brightness: 85, // 背景亮度 --%
	blur: 5, // 毛玻璃模糊效果

	// 我的标签
	tags: ['薄肌理论践行者', '御风骑士', '影厅钉子户', '社牛晚期', '行走的段子库', '多巴胺充电宝', '爆米花品鉴师', '城市漫游者'],

	// 默认背景壁纸
	background: {
		"pc": {   //pc端
			"type": "pic",   //"pic":静态壁纸;"video":动态壁纸
			"datainfo": {
				"title": "海洋女孩",
				"preview": "/img/wallpaper/static/海洋女孩/image-pre.webp",
				"url": "/img/wallpaper/static/海洋女孩/image.png",     //当然，也可填写网络地址或壁纸api，如随机PC壁纸api："url":"https://t.mwm.moe/pc"
			},
		},
		"mobile": {   //移动端
			"type": "pic",
			"datainfo": {
				"title": "0001",
				"preview": "/img/wallpaper/static-mobile/0001/image-pre.webp",
				"url": "/img/wallpaper/static-mobile/0001/image.png"  //同理，随机移动端壁纸："url":"https://t.mwm.moe/mp"
			}
		}

	},

	//极坐标图数据
	polarChart: {
		skills: ['Python', 'linux', 'Docker', 'MySQL'],
		skillPoints: [78, 85, 65, 82],
	},

	//时间河（时间线事件流）
	timeline: [
		{
			id: 'init-1',
			time: '2026-10-08',
			title: '开通了个人主页',
			summary: '终于把 leleo-home-page 搭起来了',
			content: '折腾了一下午 Vite + Vuetify，从 GitHub fork 到本地跑通，改了名字、换了标签、加了时间河。\n\n以后这里就是我记录生活的小角落啦~',
			comments: [
				{ time: '2026-10-09T08:30:00', text: '第二天就加了时间河，效率可以啊' }
			]
		},
		{
			id: 'init-2',
			time: '2026-10-01',
			title: '国庆骑行 50km',
			summary: '从家骑到东湖再回来，腿都快断了',
			content: '天气不错，沿着东湖绿道骑了一圈。\n\n中途还跟一个骑友聊了半小时，他说他每天骑 30km，我悟了。'
		}
	],

	//社交按钮
	socialPlatformIcons: [
		{ icon: "mdi-github", link: "https://github.com/sunshinehugeboy" },
		{ icon: "mdi-email", link: "mailto:leleo886@foxmail.com" },
		{ icon: "mdi-qqchat", link: "https://im.qq.com/" },
		{ icon: "mdi-wechat", link: "https://wx.qq.com/" },
		{ icon: "mdi-youtube", link: "https://www.youtube.com" },
		{ icon: "mdi-facebook", link: "https://www.facebook.com" }
	],

	//打字机
	typeWriterStrings: [
		"如果你看到了这行字，说明我已经成功吸引到了你的注意力。",
		"顶峰的少年，给了你所有细节，你却说我不是迪迦，给不了你想要的光。",
		"心简单，世界就简单，幸福才会生长；心自由，生活就自由，到哪都有快乐。",
		"生命太短，没有时间留给遗憾，若不是终点，请微笑一直向前。"
	],

	//音乐播放配置，采用MetingJS Api(https://github.com/metowolf/MetingJS)
	musicPlayer: {
		server: 'netease',  //服务提供商 --网易云音乐
		type: 'playlist',   //歌单类型
		id: '2028178887',  //歌单id ---> music.163.com/#/playlist?id=2028178887
		randomFirstPlay: true,  //进入页面是否随机播放歌单中的某一首（true开启，若开启则 startIndex 忽略）
		startIndex: 0,          //不随机时，进入页面可以自定义播放第几首（索引从0开始，若超出歌单长度则自动回落为0）
	},

	//壁纸数据 -----可以将壁纸文件上传到图床获取网络直链。若想调用api，请前往脚本自行修改逻辑
	wallpaper: {
		pic: [
			{ "title": "海洋女孩", "preview": "/img/wallpaper/static/海洋女孩/image-pre.webp", "url": "/img/wallpaper/static/海洋女孩/image.png" },
			{ "title": "书房夜晚", "preview": "/img/wallpaper/static/书房夜晚/image-pre.webp", "url": "/img/wallpaper/static/书房夜晚/image.png" },
			{ "title": "安逸舒适", "preview": "/img/wallpaper/static/安逸舒适/image-pre.webp", "url": "/img/wallpaper/static/安逸舒适/image.png" },
			{ "title": "jswcMaMj", "preview": "https://s21.ax1x.com/2025/07/23/pVGli59.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGli59.jpg" },
			{ "title": "pgtTqoqq", "preview": "https://s21.ax1x.com/2025/07/23/pVGlmDO.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGlmDO.jpg" },
			{ "title": "cvKMKhue", "preview": "https://s21.ax1x.com/2025/07/23/pVGlNqS.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGlNqS.jpg" },
			{ "title": "XpxvQVoP", "preview": "https://s21.ax1x.com/2025/07/23/pVGlfIJ.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGlfIJ.jpg" },
			{ "title": "fVEEjEOA", "preview": "https://s21.ax1x.com/2025/07/23/pVGlEgx.md.webp", "url": "https://s21.ax1x.com/2025/07/23/pVGlEgx.webp" },
			{ "title": "jgnIKMpd", "preview": "https://s21.ax1x.com/2025/07/23/pVGldaQ.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGldaQ.jpg" },
			{ "title": "mgqyySeh", "preview": "https://s21.ax1x.com/2025/07/23/pVGl82t.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGl82t.jpg" },
			{ "title": "dSXZfZp", "preview": "https://s21.ax1x.com/2025/07/23/pVGlaVg.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGlaVg.jpg" },
		],
		picMobile: [
			{ "title": "0001", "preview": "/img/wallpaper/static-mobile/0001/image-pre.webp", "url": "/img/wallpaper/static-mobile/0001/image.png" },
			{ "title": "0002", "preview": "/img/wallpaper/static-mobile/0002/image-pre.webp", "url": "/img/wallpaper/static-mobile/0002/image.png" },
			{ "title": "0003", "preview": "/img/wallpaper/static-mobile/0003/image-pre.webp", "url": "/img/wallpaper/static-mobile/0003/image.png" },
			{ "title": "0004", "preview": "/img/wallpaper/static-mobile/0004/image-pre.webp", "url": "/img/wallpaper/static-mobile/0004/image.png" },
			{ "title": "DfNHPPcc", "preview": "https://s21.ax1x.com/2025/07/23/pVG1uQ0.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVG1uQ0.jpg" },
			{ "title": "cZZwzhis", "preview": "https://s21.ax1x.com/2025/07/23/pVG1Vij.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVG1Vij.jpg" },
			{ "title": "aANKZHPX", "preview": "https://s21.ax1x.com/2025/07/23/pVGlIR1.md.jpg", "url": "https://s21.ax1x.com/2025/07/23/pVGlIR1.jpg" },
		],
		video: [
			{
				"title": "尼尔：机械纪元 团队",
				"preview": "/img/wallpaper/dynamic/尼尔：机械纪元 团队/Nier-Automata-Team-pre.webm",
				"url": "/img/wallpaper/dynamic/尼尔：机械纪元 团队/Nier-Automata-Team.webm"
			},
			{
				"title": "向往航天的女孩",
				"preview": "/img/wallpaper/dynamic/向往航天的女孩/Toy-Aeroplane-pre.webm",
				"url": "/img/wallpaper/dynamic/向往航天的女孩/Toy-Aeroplane.webm"
			},
			{
				"title": "世界很温柔《龙族》上杉绘梨衣",
				"preview": "https://www.leleo.top/img/wallpaper/dynamic/%E4%B8%96%E7%95%8C%E5%BE%88%E6%B8%A9%E6%9F%94%E3%80%8A%E9%BE%99%E6%97%8F%E3%80%8B%E4%B8%8A%E6%9D%89%E7%BB%98%E6%A2%A8%E8%A1%A3/A2EF5E85-pre.webm",
				"url": "https://www.leleo.top/img/wallpaper/dynamic/%E4%B8%96%E7%95%8C%E5%BE%88%E6%B8%A9%E6%9F%94%E3%80%8A%E9%BE%99%E6%97%8F%E3%80%8B%E4%B8%8A%E6%9D%89%E7%BB%98%E6%A2%A8%E8%A1%A3/A2EF5E85.webm"
			},
		],
		videoMobile: [
			{
				"title": "幻觉镇-gaako_illust",
				"preview": "/img/wallpaper/dynamic-mobile/幻觉镇-gaako_illust/Hallucination_town-pre.mp4",
				"url": "/img/wallpaper/dynamic-mobile/幻觉镇-gaako_illust/Hallucination_town.mp4"
			},
			{
				"title": "chuva",
				"preview": "/img/wallpaper/dynamic-mobile/chuva/chuva-pre.mp4",
				"url": "/img/wallpaper/dynamic-mobile/chuva/chuva.mp4"
			},
			{
				"title": "Doodle-小猫女仆降临",
				"preview": "/img/wallpaper/dynamic-mobile/Doodle-小猫女仆降临/d12-pre.mp4",
				"url": "/img/wallpaper/dynamic-mobile/Doodle-小猫女仆降临/d12.mp4"
			},
		],
	},

	//项目卡片 其中 字段"show"控制初始卡片的text是否展开
	projectcards: [
		{go:"🚀 前往",img:"/img/pEEZToj.jpg",title:"博客",subtitle:"写不了一点",text:"所以你打不开🤣🤣🤣。哈哈，这博客怕是得了“写作拖延症”，连打开都成了“薛定谔的猫”——你不点进去，永远不知道它到底是空的还是满的。或许它正在偷偷酝酿一篇惊天动地的文章，只是还没找到灵感，或者干脆在摸鱼。总之，博客的门关得紧紧的，仿佛在说：“今天不营业，改天再来吧！” 😂",url:"",show: false},
		{go:"🔍 前往",img:"/img/pEEZJo9.jpg",title:"Lopic",subtitle:"一个图床画廊管理系统，支持图片上传、管理和画廊展示",text:"仓库地址：https://github.com/leleo886/lopic",url:"https://lopic6.leleo.top",show: false},
		{go:"🗃 前往",img:"/img/pEEZIeg.jpg",title:"二级域名",subtitle:"免费获取本站二级域名",text:"感觉会成为“互联网街边的快闪店”，开得快，关得也快。",url:"https://sds.leleo.top",show: false},
		{go:"🗂️ 前往",img:"/img/pEEZ0sO.jpg",title:"网盘",subtitle:"云端的百宝箱，数据的避风港",text:"它不只是一个存储空间，更像是数字世界的“哆啦A梦口袋”，想要什么，一掏就有，只是别忘了，口袋再大，也得记得整理，不然找起文件来，比在现实世界找一只袜子还难!",url:"https://pan.leleo.top",show: false},
		{go:"🍨 前往",img:"/img/pEEZyod.jpg",title:"赛博要饭",subtitle:"赛博要饭-科技化缘 一码在手-天下我有",text:"这哪里是乞讨，分明是互联网时代的“云化缘”，扫码即功德，打赏即缘分。施主，随喜赞叹啊！",url:"/sbyf/index.html",show: false},
		{go:"👍 前往",img:"/img/pEEZfQf.jpg",title:"意见反馈",subtitle:"反馈是进步的阶梯，吐槽是创新的源泉",text:"就像是给产品经理的“情书”，字里行间充满了期待与吐槽。",url:"/fk.html",show: false},
		{go:"💍 前往",img:"/img/LoMongo.png",title:"LoMongo",subtitle:"MongoDB 安卓版连接客户端",text:"一个支持 MongoDB 服务数据浏览与检索的 Android 客户端，使用 Tauri2 与 Rust。",url:"/docs/LoMongo/",show: false},
		{go:"🎨 前往",img:"/img/pEEmOqU.png",title:"本站数据报",subtitle:"让你的数据会说话，让你的网站更出彩",text:"来自51.LA网站统计支持，网站流量、用户行为、转化效果，一屏尽览，让你运筹帷幄之中，决胜千里之外！",url:"https://v6.51.la/s/RL74ARz4fnShAy9",show: false}
	],

	//赞助更新时间与感言
	sponsorUpdateTime:"2026-8-13 20:40:00 感谢在座各位的慷慨解囊。说实话，你们的信任让我压力很大，毕竟我长这么大，除了年龄和体重，还没什么东西‘涨’得这么快过。",

	//赞助名单
	sponsors: [
		{name:"煎饼果子",times:1,dates:["2026-08-13 14:17:51"]},
		{name:"不相心-w-",times:1,dates:["2026-07-26 20:14:01"]},
		{name:"💰未留姓名的富豪",times:2,dates:["2026-03-13 13:47:20","2026-06-09 19:53:54"]},
		{name:"柠檬初夏",times:4,dates:["2025-12-08 10:54:04","2025-12-08 10:55:08","2025-12-08 10:55:46","2025-12-08 10:56:22"]},
		{name:"拌饭总比困难多",times:1,dates:["2025-10-10 10:51:28"]},
		{name:"🌟星眸杏杳",times:3,dates:["2025-08-26 15:00:23","2025-08-26 15:01:47","2025-08-26 15:02:23"]},
		{name:"勇者再上",times:1,dates:["2025-08-17 15:57:59"]},
		{name:"ericQ",times:1,dates:["2025-08-16 12:42:14"]},
		{name:"、",times:1,dates:["2025-06-11 16:20:53"]},
		{name:"澪和",times:2,dates:["2025-06-11 10:48:37","2025-06-11 10:50:53"]},
		{name:"未来信息2⁷⁶⁸",times:1,dates:["2025-03-24 10:36:41"]},
		{name:"Spark",times:1,dates:["2025-01-17 09:04:41"]}
	],

	statement: ["备案号：XXICP备123456789号", "Copyright © 2025 FN"],
}

export default config