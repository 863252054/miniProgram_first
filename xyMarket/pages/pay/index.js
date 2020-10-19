/* 
1 页面加载时
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据 checked = true
2 微信支付
  1 那些人 那些账号 可以实现微信支付
    1 企业账号
    2 企业账号的小程序后台中 必须给开发者 添加上白名单
      1 一个appid可以同时绑定多个开发者
      2 这些开发者就可以共用这个appid 和 它的开发权限
3 支付按钮
  1 先判断缓存中有无token
  2 没有 跳转授权页面 进行获取token
  3 有token...
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面


*/

import { chooseAddress,showModal,showToast } from "../../utils/asyncWx.js"
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    cart=cart.filter(v=>v.checked);

    // 过滤后的购物车数组
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;  
    })
    this.setData({
      totalPrice,
      totalNum,
      cart,
      address
    });
  },

  handleOrderPay(){
    // 1.判断缓存中有没有token
    const token=wx.getStorageSync("token");
    // 2 判断
    if(!token){
      wx.navigateTo({
        url:'/pages/auth/index'
      })
      return;
    }
    let newCart = wx.getStorageSync("cart");
    newCart = newCart.filter(v=>!v.checked);
    wx.setStorageSync("cart", newCart);

    wx.navigateTo({
      url:"/pages/order/index"
    });
    
  }
})