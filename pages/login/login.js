// pages/login/login.js
import request  from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // 获取用户输入数据phone || password
  handleInput(e){
    let type = e.currentTarget.id;//获取type的第一种方法：用id传值
    //let type = e.currentTarget.dataset.type;//获取type的第二种方法 data-key=value 当要传多个值时用此方法较好
    // console.log(e);
    // console.log(type,e.detail.value);
    this.setData({
      // 因为type是个变量，所以要用[]
      [type]:e.detail.value
    })
  },
  // 登录验证
  async loginCheck(){
    let {phone , password} = this.data;
    if(!phone){
      wx.showToast({
        title: '手机号码不能为空',
        icon:'none'
      })
      return;
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号码格式不正确',
        icon:'none'
      })
      return;
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon:'none'
      })
      return;
    }
    //后端验证
    let result = await request('/login/cellphone',{phone , password , isLogin:true});
    if(result.code === 200){
      wx.showToast({
        title: '登录成功',
      })
      // 如果登录成功，则跳转到‘我的’页面
      wx.reLaunch({
        url: '/pages/profile/profile',
      })
      // 将用户信息存储到本地内存
      wx.setStorageSync('userInfo', JSON.stringify(result.profile));
    }else if(result.code === 400){
      wx.showToast({
        title: '手机号码错误',
        icon:'none'
      })
    }else if(result.code === 502){
      wx.showToast({
        title: '密码错误',
        icon:'none'
      })
    }else{
      wx.showToast({
        title: '登录失败，请重新登录',
        icon:'none'
      })
    }
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