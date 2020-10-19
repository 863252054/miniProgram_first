// 引入 用来发送请求的方法
import { request } from "../../request/index.js"

//Page Object
Page({
  data: {
    //轮播图数组
    swiperList: [],
    //分类导航数组
    catesList:[],
    //楼层数据
    floorList:[]
  },
  //页面开始加载 就会触发
  onLoad: function (options) {
    // // 1 发送异步请求获取轮播图数据 优化的手段可以通过es6的promise来解决这个问题
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     this.setData({
    //       swiperList:result.data.message
    //     })


    //   }
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },
  // 获取分类导航数据
  getCatesList() {
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  },



});