import request  from '../../utils/request.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],//轮播图数据
    recommendList:[],//推荐歌单数据
    rankList:[],//排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    // async 用于申明一个 function 是异步的，而 await 用于等待一个异步方法执行完成。
    let bannaerListData = await request('/banner',{type:2});
    // console.log('结果数据：',bannaerListData);
    this.setData({
      //轮播图数据
      bannerList: bannaerListData.banners
    })

    // 获取推荐歌单数据
    let recommendListData = await request('/personalized',{limit : 10});
    this.setData({
      //轮播图数据
      recommendList: recommendListData.result
    })

    // 获取排行榜数据
    /* 
      需求分析：
        1.需要根据idx的值获取对应的数据
        2.idx的取值范围是0-20 ，而我们需要请求0-4即可
        3.则需要发送5次请求


      前++和后++的区别：
        1.如果先看到的是运算符就先运算再赋值
        2.如果先看到的是值那就先赋值再运算
    */
    let index = 0;
    let rankArr = [];
    while(index < 5){
      let rankListData = await request('/top/list',{ idx : index++ });
      //splice()会修改原数组  slice不会
      let rankListItem = {name:rankListData.playlist.name, tracks:rankListData.playlist.tracks.slice(0,3)};
      rankArr.push(rankListItem);
      // 更新rankList值
      this.setData({
        rankList:rankArr
      })
    }
    
  },

  // 跳转至每日推荐RecommendSong页面的回调
  toRecommendSong(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    })
  },
  // 跳转至歌单页面
  toMusicList(){
    wx.navigateTo({
      url: '/pages/musicList/musicList',
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