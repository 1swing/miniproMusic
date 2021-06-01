// pages/toplist/toplist.js
import request from '../../utils/request2'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toplistRecommend:[], //存储 榜单推荐数据
    toplist:[], // 存储 官方排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getTopListData();
  },

  // 获取排行榜数据的函数
  async getTopListData(){
    let toplistData = await request('/toplist/detail');
    this.setData({
      toplist : toplistData.list.slice(0,4),
      toplistRecommend : toplistData.list.slice(6,9)
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