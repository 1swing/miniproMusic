// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],//导航标签数据
    navId: '',//导航ID标识
    videoList: [],//视频数据
    videoId: '',//视频标识
    // videoCurrentTime: [],//记录视频的播放时长
    isTriggerd:false //记录是否下拉刷新被触发的状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用获取导航数据函数
    this.getVideoGroupListData();
  },

  // 跳转至搜索页面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  // 获取导航数据
  async getVideoGroupListData() {
    let VideoGroupListData = await request('/video/group/list');
    this.setData({
      // 更新导航数据信息
      videoGroupList: VideoGroupListData.data.slice(0, 14),
      navId: VideoGroupListData.data[0].id
    })
    // 获取视频列表数据
    this.getVideoList(this.data.navId);
  },
  // 点击切换导航id的回调
  changeId(e) {
    let navId = e.currentTarget.id;
    this.setData({
      navId,
      videoList: []
    })
    // 点击切换显示正在加载
    wx.showLoading({
      title: '正在加载',
    })
    this.getVideoList(this.data.navId);
  },


  // 点击播放/继续播放的问题
  /*
    解决多个视频同时播放的问题
    单例模式：
      1.需要创建多个对象的场景下，通过一个变量接收，始终保持一个对象
      2.节省内存空间
  */
  // 点击播放/暂停的回调
  handlePlay(event) {
    let vid = event.currentTarget.id;
    // 关闭上一个播放的视频
    // this.vid !== vid && this.videoContext && this.videoContext.stop();
    // this.vid = vid;

    // 更新data中videoId的状态
    this.setData({
      videoId: vid
    })
    // 创建控制video标签的实例对象
    // this.videoContext = wx.createVideoContext(vid);

    
    // 判断当前的视频之前是否有播放记录  如果有，跳转至指定的播放位置
    // let { videoCurrentTime } = this.data;
    // let videoItem = videoCurrentTime.find(item => {
    //   item.vid === vid;
    // });
    // if (videoItem) {
    //   this.videoContext.seek(videoItem.currentTime);
    // }
    // 点击图片之后自动播放视频
    // this.videoContext.play();
  },

  // 监听视频播放进度的回调
  // handleCurrentTime(event) {
  //   // console.log(event);
  //   let videoTimeObj = { vid: event.currentTarget.id, currentTime: event.detail.currentTime };
  //   let { videoCurrentTime } = this.data;
  //   // 判断记录播放时长的videoCurrentTime数组中是否有当前视频的播放记录
  //   let videoItem = videoCurrentTime.find(item => {
  //     item.vid === videoTimeObj.vid;
  //   });
  //   if (videoItem) { // 如果之前有播放记录
  //     videoItem.currentTime = event.detail.currentTime;
  //   } else {  // 之前没有播放记录
  //     videoCurrentTime.push(videoTimeObj);
  //   }
  //   // 更新videoCurrentTime的状态
  //   this.setData({
  //     videoCurrentTime
  //   })
  // },

  // 获取视频列表数据
  async getVideoList(navId) {
    if (!navId) {
      return;
    }
    let videoListData = await request('/video/group', { id: navId });
    // 关闭加载提示框
    wx.hideLoading();
    let index = 0;
    let videoList = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    });
    this.setData({
      videoList,
      isTriggerd:false //关闭下拉刷新
    })
  },
  // 自定义下拉刷新的回调：scroll-view
  handleRefresh(event){
    // console.log('下拉刷新');
    // 再次发送请求视频列表数据，获取最新视频
    this.getVideoList(this.data.navId);
  },

  // 跳转搜索页
  
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    
    if(from === 'button'){
      return {
        title:'来自button的转发',
        page:'/pages/video/video',
        imageUrl:'/static/images/nvsheng.jpg'
      }
    }else{
      return {
        title:'来自menu的转发',
        page:'/pages/video/video',
        imageUrl:'/static/images/logo.png'
      }
    }
   
  }
})