/* 
1 发送请求数据
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api previewImage
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式
  3 先判断当前商品是否已经存在于 购物车
  4 已经存在 执行购物车数量++ 重新把购物车数组 填充回缓冲中
  5 不存在于购物车的数组中 直接给购物车数组添加新元素
  6 弹出提示
*/


import { request } from "../../request/index.js"
Page({
  data: {
    goodsObj: {}
  },
  // 商品对象
  GoodsInfo: {},
  onLoad: function (options) {
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    this.GoodsInfo = goodsObj;
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不识别 webp图片格式
        // 自己改得保证后台存在 1.webp=>1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics,
      }
    })
  },

  handlePreviewImage(e) {
    // 1 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 2 接受传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });


  },

  handleCartAdd() {
    // 1 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || [];
    // 2 判断 商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 3 不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;

      cart.push(this.GoodsInfo);
    } else {
      // 4 已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    // 5 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 6 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
    // mask防止用户手抖，1.5s后才能继续响应
      mask: true
    });
  },
})