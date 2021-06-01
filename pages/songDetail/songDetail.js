// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js';
import request from '../../utils/request';
import moment from 'moment'
// 获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //记录播放状态 动态控制摇杆旋转角度
    song: {},//歌曲详情对象
    musicId: '',//音乐ID
    musicLink: '',//音乐链接
    currentTime: '00:00',  //当前时间
    durationTime: '00:00', //总时长
    currentWidth: 0,//实时进度条长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options用来接收路由跳转的参数
    // 原生小程序路由传参的数据长度有限制 会自动截取数据
    let musicId = options.musicId;
    this.setData({
      musicId
    });
    // 获取音乐详情
    this.getMusicInfo(musicId);
    // 判断当前页面的音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      // 修改当前音乐播放的状态
      this.setData({
        isPlay: true
      })
    }
    // 创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 监听音乐暂停/播放/停止
    this.backgroundAudioManager.onPlay(() => {
      this.changeMusicState(true)
      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(() => {
      this.changeMusicState(false);
    });
    this.backgroundAudioManager.onStop(() => {
      this.changeMusicState(false);
    })
    // 监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      PubSub.subscribe("musicId", (msg, musicId) => {
        // console.log(musicId);
        // 自动切换至下一首音乐，并且自动播放
        // 取消订阅,避免多次重复
        PubSub.unsubscribe("musicId")
        //获取最新歌曲信息 
        this.getMusicInfo(musicId);
        // 关闭当前音乐
        this.backgroundAudioManager.stop();
        // 自动播放最新音乐
        this.musicControl(true, musicId);
      })

      PubSub.publish('switchType', 'next');
      // 将实时进度条的长度还原成0，时间还原成00:00
      this.setData({
        currentTime: '00:00',
        currentWidth: 0
      })

    })
    // 监听音频播放时长
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log("当前时长："+ this.backgroundAudioManager.currentTime);
      // 格式化总时长和当前时间
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      })
    })

  },
  // 修改音乐播放状态的功能函数
  changeMusicState(isPlay) {
    // 修改音乐是否播放的状态
    this.setData({
      isPlay
    })
    //  修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  // 获取音乐详情的功能函数
  async getMusicInfo(musicId) {
    let songData = await request('/song/detail', { ids: musicId });
    let durationTime = moment(songData.songs[0].dt).format('mm:ss');
    this.setData({
      song: songData.songs[0],
      durationTime
    })

    // 动态修改窗口的标题
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  //点击播放/暂停的回调
  musicPlay() {
    let isPlay = !this.data.isPlay;

    let { musicId, musicLink } = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },
  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) {// 获取音乐播放链接
        let musicLinkData = await request('/song/url', { id: musicId });
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink
        });
      }
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.song.name;

    } else {//暂停音乐
      this.backgroundAudioManager.pause();
    }
  },
  // 点击切换歌曲的回调
  handleSwitch(event) {
    // 获取切换歌曲的类型
    let type = event.currentTarget.id;
    // 关闭当前播放的音乐
    this.backgroundAudioManager.stop();
    // console.log(type);

    // 订阅来自recommendSong页面发布的musicId
    PubSub.subscribe('musicId', (msg, musicId) => {
      console.log(musicId);
      // 获取音乐的详情
      this.getMusicInfo(musicId);
      // 设置音乐自动播放
      this.musicControl(true, musicId);
      // 取消订阅
      PubSub.unsubscribe('musicId');
    });
    // 发布消息数据给recommendSong页面
    PubSub.publish('switchType', type);
    PubSub.publish('switchType', 'next');
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