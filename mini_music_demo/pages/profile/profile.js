// pages/profile/profile.js
import request from '../../utils/request';
let startY = 0;//手指的起始坐标
let endY = 0;//手指移动的坐标
let moveY = 0;//手指移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coveTransition: '',
    userInfo: {},//用户信息
    recentPlayList: [],//最近播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 在‘我的’页面读取已登录的用户信息
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      // 更新用户信息
      this.setData({
        userInfo: JSON.parse(userInfo)
      })

      // 获取用户最近播放记录
      this.getRecentPlayList(this.data.userInfo.userId);
    }

  },
  // 获取用户最近播放记录数据
  async getRecentPlayList(userId) {
    let recentPlayListData = await request('/user/record', { uid: userId });
    console.log('类型'+typeof(recentPlayListData.weekData));
    let index = 0;
    let recentPlayListArr = recentPlayListData.weekData;
    let recentPlayList = recentPlayListArr.slice(0, 10).map( item => {
      item.id = index++;
      return item;
    });
    this.setData({
      recentPlayList
    })
  },
  // 用户下拉事件监听
  handleTouchStart(e) {
    // console.log('start move');
    // 获取手指起始坐标
    startY = e.touches[0].clientY;
    this.setData({
      coveTransition: ''
    })
  },
  handleTouchMove(e) {
    // console.log('move');
    moveY = e.touches[0].clientY;
    endY = moveY - startY;
    // console.log(endY);
    if (endY <= 0) {
      return;
    }
    if (endY >= 90) {
      endY = 90;
    }
    // 动态更新coverTransform的状态值
    this.setData({
      coverTransform: `translateY(${endY}rpx)`
    })
  },
  handleTouchEnd(e) {
    // console.log('start end');
    this.setData({
      coverTransform: `tranlateY(0rpx)`,
      coveTransition: 'transform 1s linear'
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})