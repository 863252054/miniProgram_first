/* 
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底事件
  2 判断还有没有下一页数据
    a 获取到总页数  总条数：total
      总页数 = Math.ceil(总条数 / 页容量 pagesize)
    b 获取到当前的页码  pagenum
    c 判断 当前的页码是否大于等于 总页数
      表示没有下一页数据
  3 假如没有下一页数据 弹出提示
  4 有的话继续加载
2 下拉刷新页面
  1 触发下来刷新事件 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组
  3 重置页码 设置为1
  4 重新发送请求
*/

import { request } from "../../request/index.js"
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },

  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  //总页数
  totalPages: 1,


  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // 获取总条数
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    // console.log(this.totalPages);
    this.setData({
    // 拼接数据而不是重置
      goodsList: [...this.data.goodsList, ...res.goods]
    })

    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },

  // 标题的点击事件 从子组件传递过来
  // 改变title的active状态
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 3 复制到data中
    this.setData({
      tabs
    })
  },

  // 页面上滑 滚动条触底事件
  onReachBottom() {
    // 判断是否有下一页
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({ title: '页面全部加载'});
    } else {
      // 还有下一页
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh(){
    // 1 重置数组
    this.setData({
      goodsList:[]
    })
    
    // 2 重置页码
    this.QueryParams.pagenum = 1;

    // 3 发送请求
    this.getGoodsList();

  }




})