import request from "../../utils/request";
// let isSend = false; //函数节流使用
let timer = "";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    placeHolderText: "", //搜索框默认文字
    hotList: [], //热搜榜数据
    searchContent: "", //用户输入的表单项数据
    searchList: [], //网络请求 关键字模糊搜索的数据收集
    historyList: [], //搜索记录数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("searchHistory")) {
      this.setData({
        historyList: wx.getStorageSync("searchHistory"),
      });
    }
    // 获取搜索框的默认显示文字
    this.getInitData();

    // 获取历史记录
    this.getSearchHistory();
  },

  //读取本地历史记录数据
  getSearchHistory() {
    let historyList = wx.getStorageSync("searchHistory");
    if (historyList) {
      this.setData({
        historyList,
      });
    }
  },
  // 获取页面初始数据(获取默认搜索内容和热搜榜数据)
  async getInitData() {
    // 获取placeholder数据
    let placeHolderData = await request("/search/default");
    // 获取热搜榜数据
    let hotListData = await request("/search/hot/detail");
    this.setData({
      placeHolderText: placeHolderData.data.showKeyword,
      hotList: hotListData.data,
    });
  },

  // 表单项内容发生改变的回调
  handleInputChange(e) {
    if (e.detail.value.trim() == "") {
      // 当表单项内容为空时，将搜索结果直接清空，并return出这个函数，避免后续节流出现一系列问题
      this.setData({
        searchList: [],
      });
      clearTimeout(timer);
      return; // 退出当前函数
    } else {
      searchContent: e.detail.value;
    }

    // 使用定时器节流
    clearTimeout(timer);
    timer = setTimeout(() => {
      this.getSearchList(e.detail.value);
    }, 300);
  },
  // 搜索框回车确定事件
  handleConfirm(e) {
    // console.log("按回车确认搜索触发：" + e.detail.value);

    let keywords = e.detail.value;
    this.setData({
      searchContent: keywords,
    });

    let { searchContent, historyList } = this.data;
    // 将搜索关键字添加到搜索历史记录中
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1);
    }
    // console.log("类型：" + typeof historyList);
    historyList.unshift(searchContent);
    this.setData({
      historyList,
    });

    // 将历史记录存储到本地缓存
    wx.setStorageSync("searchHistory", historyList);
  },

  // 网络请求 获取搜索数据
  async getSearchList(keywords) {
    // 获取关键字搜索的数据
    let searchListData = await request("/search", {
      keywords: keywords,
      limit: 10,
    });
    // 更新模糊搜索关键字的收集内容的数据
    this.setData({
      searchList: searchListData.result.songs,
    });
  },

  // 清空搜索框内容
  clearSearchContent() {
    this.setData({
      searchContent: "",
      searchList: [],
    });
  },
  // 删除历史搜索记录
  deleteHistory() {
    wx.showModal({
      title: "提示",
      content: "确定清空历史搜索记录吗?",
      success: (res) => {
        if (res.confirm) {
          // 将data中的historyList清空
          this.setData({
            historyList: [],
          });
          // 将本地缓存的数据清空
          wx.removeStorageSync("searchHistory");
        } else {
          console.log("取消清空");
        }
      },
    });
  },
  // 取消按钮触发的事件
  toBackPage() {
    wx.navigateBack({
      delta: 1,
    });
  },
});
