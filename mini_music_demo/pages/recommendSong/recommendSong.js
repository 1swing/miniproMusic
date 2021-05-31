// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js';
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[],//推荐歌曲数组  
    index:0,//初始化点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是否已经登录
    let userInfo = wx.getStorageInfoSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:() => {
          // 跳转至登录页面
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth() + 1
    })

    // 获取推荐歌曲
    this.getRecommendList();

    // 订阅 来自songDetail页面发布的消息
    // msg:消息的名称
    // type：传递的数据
    PubSub.subscribe('switchType', (msg , type) => {
      // console.log(msg , type);
      let {recommendList , index} = this.data;
      if(type === 'pre'){//上一首
        (index === 0) && (recommendList.length);
        index -= 1;
      }else{
        //下一首
        (index === recommendList.length -1) && (index = -1);
        index += 1;
      }
      // 更新下标的值
      this.setData({
        index
      })
      let musicId = recommendList[index].id;
      // 将musicId回传给songDetail页面
      PubSub.publish('musicId',musicId);
    });
  },
  // 获取推荐歌曲的回调
  async getRecommendList(){
    let recommendListData = await request('/recommend/songs');
    this.setData({
      recommendList:recommendListData.recommend
    })
  },
  // 跳转至播放页面的回调
  toSongDetail(e){
    let {song , index} = e.currentTarget.dataset;
    // 将下标更新到data中
    this.setData({
      index
    })
    // 路由跳转传参：query
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id,
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