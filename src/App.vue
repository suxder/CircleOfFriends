<template>
  <div id="app" @click="handleClickOutside">
    <div class="container">
      <header>
        <div class="headContainer" ref="headerRef">
          <ul>
            <li>
              <span class="left-icon">
                <i ref="leftIcon" class="iconfont icon-left"></i>
              </span>
            </li>
            <li>
              <span ref="appTitle" class="app-title">
                朋友圈
              </span>
            </li>
            <li>
              <span class="right-icon">
                <i ref="rightIcon" class="iconfont icon-zhaoxiangji"></i>
              </span>
            </li>
          </ul>
        </div>
      </header>
      <main>
        <div class="refreshTip" v-show="isOnRefresh" ref="refreshTip">
        </div>
        <div class="scroll-container"
             @touchstart.stop="handlerTouchStart"
             @touchmove.stop="handlerTouchMove"
             @touchend.stop="handlerTouchEnd"
             ref="scrollContainer"
             :class="{'transition': isTransition}"
        >
          <div class="bgImage" :style="userProfile.bgImageUrl">
            <div class="userProfile">
              <div class="userName">
                {{ userProfile.username }}
              </div>
              <div class="avatar">
                <img :src="userProfile.avatarUrl" alt="用户头像">
              </div>
            </div>
          </div>
          <div class="momentList">
            <div class="momentListContainer">
              <div class="momentItem" v-for="item in list" :key="item.id" :title="item">
                <div class="momentAvatar">
                  <img :src="item.authorAvatarUrl" alt="动态作者头像">
                </div>
                <div class="momentInfo">
                  <div class="authorName">
                    <span>{{ item.authorName }}</span>
                  </div>
                  <div class="momentText">
                    <p>{{ item.momentText }}</p>
                  </div>
                  <div class="momentPicOfOne" v-show="item.fileList.length === 1">
                    <div class="momentPicContainer">
                      <!--后续数据结构改变后，重新设置key值-->
                      <img v-for="pic in item.fileList" :key="pic.id" :src="pic.url" alt="朋友圈配图">
                    </div>
                  </div>
                  <div class="momentPicOfFour" v-show="item.fileList.length === 4">
                    <div class="momentPicContainer">
                      <img v-for="pic in item.fileList" :key="pic.id" :src="pic.url" alt="朋友圈配图">
                    </div>
                  </div>
                  <div class="momentPicOfMulti" v-show="item.fileList.length !== 4 && item.fileList.length !== 1">
                    <div class="momentPicContainer">
                      <img v-for="pic in item.fileList" :key="pic.id" :src="pic.url" alt="朋友圈配图">
                    </div>
                  </div>
                  <div class="likeCommentsTool">
                    <div class="toolBars">
                      <div class="momentTime"><span>3小时前</span></div>
                      <div>
                        <!-- 必须阻止事件冒泡，否则全局点击事件会失效-->
                        <div class="ellipsisDiv" @click.stop="handlerEllipseClick(item.id)">
                          <i class="iconfont icon-ellipsis"></i>
                          <div class="popDiv"
                               v-show="item.showPopover"
                          >
                            <div class="popCard">
                              <ul>
                                <li>
                                  <i :class="{'iconfont': isIconFont, 'icon-aixin': isAixin, 'icon-xiai': isXiAi, 'likeIconColor': isLikeColor, 'unlikeIconColor': !isLikeColor}" @click="handleLikeBtn($event,item.likeIt, item.id)"/>
                                  <span>{{ likeIconInnerText }}</span>
                                </li>
                                <li @click="handleCommentBtn(item.id)">
                                  <i class="iconfont icon-pinglun "/>
                                  <span>评论</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="userCallBackInfo" v-show="item.likeList.length > 0 || item.commentList.length > 0">
                      <div class="likeList" v-show="item.likeList.length > 0">
                        <van-icon name="like-o"/>
                        <ul>
                          <li v-for="likeItem in item.likeList" :key="likeItem.id" :title="likeItem">
                            <img :src="likeItem" alt="点赞人头像">
                          </li>
                        </ul>
                      </div>
                      <div class="commentsList" v-show="item.commentList.length > 0">
                        <div class="commentItem" v-for="commentItem in item.commentList" :key="commentItem.id"
                             :title="commentItem">
                          <p>
                            <span>{{ commentItem.name }}</span>
                            : {{ commentItem.commentText }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="actionSheet" v-show="showInputSheet">
          <input class="commentInput" v-model="commentText" placeholder="评论"/>
          <i class="iconfont icon-icon_xiaolian-xian"/>
          <button class="commentInputBtn" @click="sendComment()">发送</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      /**
       *  下拉刷新（实现拖曳效果）
       */
      // 记录鼠标点击的位置
      startLocation: '',
      // 记录移动的位置
      moveDistance: 0,
      // 记录移动的距离
      distance: '',
      // 是否启动transition
      isTransition: false,
      // 动态变动的transform
      transformValue: '',
      // 记录是否开始刷新
      isOnRefresh: false,
      /**
       *  用户数据
       */
      userProfile: {
        username: '张怡然',
        avatarUrl: require('../src/assets/image/avatar.jpg'),
        bgImageUrl: require('../src/assets/image/bgImage.jpg')
      },
      /**
       *  动态列表
       */
      list: [
        {
          id: 0,
          authorName: '令狐小传',
          authorAvatarUrl: require('../src/assets/image/authorAvatars/author2.jpg'),
          momentText: '且将且将新火试新茶，诗酒趁年华。',
          fileList: [
            {
              id: 0,
              url: 'https://img01.yzcdn.cn/vant/leaf.jpg'
            },
            {
              id: 1,
              url: 'https://img01.yzcdn.cn/vant/sand.jpg'
            },
            {
              id: 2,
              url: 'https://img01.yzcdn.cn/vant/tree.jpg'
            },
            {
              id: 3,
              url: 'https://img01.yzcdn.cn/vant/leaf.jpg'
            },
            {
              id: 4,
              url: 'https://img01.yzcdn.cn/vant/sand.jpg'
            },
            {
              id: 5,
              url: 'https://img01.yzcdn.cn/vant/tree.jpg'
            },
            {
              id: 6,
              url: 'https://img01.yzcdn.cn/vant/leaf.jpg'
            },
            {
              id: 7,
              url: 'https://img01.yzcdn.cn/vant/sand.jpg'
            },
            {
              id: 8,
              url: 'https://img01.yzcdn.cn/vant/tree.jpg'
            }
          ],
          showPopover: false,
          hasVideo: false,
          likeIt: false,
          likeList: [],
          commentList: []
        },
        {
          id: 1,
          authorName: '周思成',
          authorAvatarUrl: require('../src/assets/image/authorAvatars/author3.png'),
          momentText: '出门看公园.....',
          fileList: [
            {
              id: 0,
              url: 'https://img01.yzcdn.cn/vant/sand.jpg'
            },
            {
              id: 1,
              url: 'https://img01.yzcdn.cn/vant/sand.jpg'
            },
            {
              id: 2,
              url: 'https://img01.yzcdn.cn/vant/sand.jpg'
            }
          ],
          showPopover: false,
          hasVideo: false,
          likeIt: false,
          likeList: [],
          commentList: []
        },
        {
          id: 2,
          authorName: '刘家豪',
          authorAvatarUrl: require('../src/assets/image/authorAvatars/author4.jpg'),
          momentText: '这树真好看.....',
          fileList: [
            {
              id: 0,
              url: 'https://img01.yzcdn.cn/vant/tree.jpg'
            },
            {
              id: 1,
              url: 'https://img01.yzcdn.cn/vant/tree.jpg'
            },
            {
              id: 2,
              url: 'https://img01.yzcdn.cn/vant/tree.jpg'
            },
            {
              id: 3,
              url: 'https://img01.yzcdn.cn/vant/tree.jpg'
            }
          ],
          showPopover: false,
          hasVideo: false,
          likeIt: false,
          likeList: [],
          commentList: []
        },
        {
          id: 3,
          authorName: '黄旭祥',
          authorAvatarUrl: require('../src/assets/image/authorAvatars/author1.jpg'),
          momentText: '好久没出门了',
          fileList: [
            {
              url: 'https://img01.yzcdn.cn/vant/tree.jpg'
            }
          ],
          showPopover: false,
          hasVideo: false,
          likeIt: false,
          likeList: [],
          commentList: []
        }
      ],
      loading: false,
      finished: false,
      isIconFont: true,
      isAixin: true,
      isXiAi: false,
      isLikeColor: false,
      likeIconInnerText: '赞',
      showPopOverID: 0,
      // 点赞评论
      actions: [{text: '选项一'}, {text: '选项二'}, {text: '选项三'}],
      // 输入评论的文本框
      showInputSheet: false,
      // 输入评论的内容
      commentText: '',
      // 记录评论所属的动态ID
      commentID: 0
    }
  },
  computed: {},
  methods: {
    /**
     *  下拉刷新
     */
    // 获取手指触屏时的屏幕Y轴位置
    handlerTouchStart (e) {
      this.isOnRefresh = true
      this.startLocation = e.touches[0].pageY
      this.isTransition = false
    },
    // 获取手指移动的距离
    handlerTouchMove (e) {
      // 通过系数来控制下拉的松紧度（映射倍数）
      let moveSpeed = 0.4
      // 通过系数来控制旋转的快慢
      let rotateSpeed = 2

      this.moveDistance = Math.floor(e.touches[0].pageY - this.startLocation)

      // 如果是下拉，则改变transformValue
      if (this.moveDistance > 0) {
        this.$refs.scrollContainer.style.transform = `translateY(${this.moveDistance * moveSpeed}px)`
        this.$refs.refreshTip.style.transform = `rotate(-${this.moveDistance * rotateSpeed}deg)`
        this.$refs.refreshTip.style.top = `3rem`
      }
    },
    // 获取手指松开的Y轴位置
    handlerTouchEnd (e) {
      // 清除已移动的距离
      this.moveDistance = 0
      this.isTransition = true
      // 恢复原位
      this.$refs.scrollContainer.style.transform = `translateY(0px)`
      this.$refs.refreshTip.style.transform = `rotate(10000deg)`
      this.$refs.refreshTip.style.top = `-3.5rem`
    },
    /**
     *  监听滚动事件，超出设定值后，header透明度减弱
     */
    handleScroll () {
      // 滚动条在y轴上的滚动距离
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // 文档的总高度
      let documentScrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      // 浏览器窗口的高度
      let getWindowHeight = document.documentElement.clientHeight || document.body.clientHeight
      if (scrollTop > 300) {
        this.$refs.headerRef.style.backgroundColor = `rgba(237, 237, 237, 1)`
        // 改变字体颜色
        this.$refs.leftIcon.style.color = `#010101`
        this.$refs.rightIcon.style.color = `#010101`
        this.$refs.appTitle.style.visibility = `visible`
      } else {
        // 数据归一
        let transparency = scrollTop / 300

        // 改变header透明度
        this.$refs.headerRef.style.backgroundColor = `rgba(237, 237, 237,${transparency})`
        // 改变字体颜色
        this.$refs.leftIcon.style.color = `#fff`
        this.$refs.rightIcon.style.color = `#fff`
        this.$refs.appTitle.style.visibility = `hidden`
      }
      if (scrollTop + getWindowHeight === documentScrollHeight) {
        console.log('监听成功')
      }
    },
    /**
     *  动态列表
     */
    // 侦听ellipseDiv点击事件
    handlerEllipseClick (id) {
      this.list[id].showPopover = true
      this.showPopOverID = id
    },
    //  点赞按钮回调函数
    handleLikeBtn (e, likeIt, id) {
      if (likeIt) {
        this.isXiAi = false
        this.isAixin = true
        this.isLikeColor = false
        this.likeIconInnerText = '赞'
        this.list[id].likeIt = false
        this.list[id].likeList.shift()
        // 定时关闭popCard
        let listData = this.list
        setTimeout(function () {
          listData[id].showPopover = false
        }, 300)
      } else {
        let data = require('../src/assets/image/avatar.jpg')
        this.isXiAi = true
        this.isAixin = false
        this.isLikeColor = true
        this.likeIconInnerText = '取消'
        this.list[id].likeIt = true
        this.list[id].likeList.push(data)
        // 定时关闭popCard
        let listData = this.list
        setTimeout(function () {
          listData[id].showPopover = false
        }, 300)
      }
    },
    //  评论按钮回调函数
    handleCommentBtn (id) {
      this.list[id].showPopover = false
      this.showInputSheet = true
      this.commentID = id
      // 定时关闭popCard
      let listData = this.list
      setTimeout(function () {
        listData[id].showPopover = false
      }, 300)
    },
    //  发送评论
    sendComment () {
      // 组织数据
      let itemComment = {
        name: this.userProfile.username,
        commentText: this.commentText
      }
      this.list[this.commentID].commentList.push(itemComment)
      this.showInputSheet = false
      this.commentText = ''
    },
    //  全局点击事件监听器
    handleClickOutside () {
      console.log('事件maopao')
      this.list[this.showPopOverID].showPopover = false
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  }
}
</script>

<style>
/**
  初始化基准字号与基础样式
*/
:root {
  font-size: 1em;
}

* {
  box-sizing: border-box;
}

body {
  font-size: 1rem;
  margin: 0;
}

#app {
  font-family: "Microsoft Yahei";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

/**
  header基础样式
 */
header {
  position: fixed;
  z-index: 999;
  width: 100%;
}

.headContainer {
  height: 6vh;
  background-color: rgba(0, 0, 0, 0);
  padding: 0 0.8rem;
}

.headContainer ul {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.headContainer ul li {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

.app-title {
  font-weight: bold;
  color: #010101;
  visibility: hidden;
}

.left-icon i {
  font-size: 1rem;
  color: #fff;
}

.right-icon i {
  font-size: 1.3rem;
  color: #fff;
}

/**
  主体样式
 */

/* 下拉刷新样式 */
main {
  background-color: #2e2e2e;
}

.transition {
  transition: all 0.7s;
}

.refreshTip {
  position: fixed;
  z-index: 999;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  left: 2rem;
  top: -3.5rem;
  background-image: url('./assets/image/refreshTip.png');
  background-position: center;
  background-size: cover;
  transition: 0.1s top linear, 0.1s transform linear;
}

.refreshTip span {
  text-align: center;
}

.bgImage {
  position: relative;
  font-size: 1rem;
  background-image: url('assets/image/bgImage.jpg');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 33vh;
}

.userProfile {
  display: flex;
  width: 6.8rem;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: -2rem;
  right: 1rem;
}

.userName {
  font-size: 0.9rem;
  align-self: flex-start;
  padding: 0.5em 0;
  color: #ffffff;
  font-weight: bold;
}

.avatar img {
  height: 3.6rem;
  width: 3.6rem;
  border-radius: 0.5rem;
}

/**
  动态列表样式
 */
.momentList {
  width: 100%;
  background-color: #ffffff;
  padding-top: 6.1rem;
  display: flex;
  justify-content: center;
  overflow: visible;
}

.momentAvatar img {
  height: 2.4rem;
  width: 2.4rem;
  border-radius: 0.2rem;
}

.momentItem {
  display: flex;
  justify-content: space-between;
  width: 100vw;
  padding-top: 0.6rem;
  border-bottom: 1px solid #e8e8e8;
  padding-left: 1.3rem;
  padding-right: 1.3rem;
}

.momentInfo {
  width: 78vw;
}

.authorName span {
  font-weight: bold;
  color: #5b6b8f;
}

.momentText p {
  margin-top: 0.2rem;
  margin-bottom: 0.6rem;
}

/* 配图样式 */
.momentPicContainer {
  display: flex;
  flex-wrap: wrap;
  width: 96%;
}

.momentPicOfMulti .momentPicContainer img {
  width: 24.8vw;
  height: 24.8vw;
  padding-bottom: 0.17rem;
  padding-right: 0.17rem;
}

.momentPicOfMulti .momentPicContainer img:nth-child(3n+3) {
  padding-right: 0;
}

.momentPicOfFour .momentPicContainer {
}

.momentPicOfFour .momentPicContainer img {
  width: 27vw;
  height: 27vw;
  padding-bottom: 0.17rem;
  padding-right: 0.17rem;
}

.momentPicOfOne .momentPicContainer img {
  max-height: 44vw;
  padding-bottom: 0.35rem;
}

/* 点赞及工具栏样式 */
.likeCommentsTool {
}

.userCallBackInfo {
  padding-bottom: 0.6rem;
}

.toolBars {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.toolBars .van-icon {
  display: block;
  background-color: #f8f8f8;
  height: 2.5vh;
  width: 8vw;
  font-size: 1.5rem;
  color: #626ca7;
  border-radius: 0.2rem;
  text-align: center;
}

.momentTime {
  color: #717171;
  font-size: 0.5rem;
}

.ellipsisDiv {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6vw;
  height: 4vw;
  background-color: #e8e8e8;
  border-radius: 0.1rem;
}

.popDiv {
  position: absolute;
  left: -42vw;
}

.popCard ul {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 40vw;
  height: 4vh;
  background-color: #4c4c4c;
}

.popCard ul li {
  color: #fbfbfb;
  font-size: 0.9rem;
}

.likeList {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #f8f8f8;
  padding: 0.3rem 0.1rem;
  border-bottom: 1px solid #e8e8e8;
}

.likeList ul {
  min-width: 70vw;
}

.likeList ul li {
  display: flex;
  align-items: center;
}

.likeList ul li img {
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 0.2rem;
}

.likeIconColor {
  color: red;
}

.unlikeIconColor {
  color: #f8f8f8;
}

.commentItem {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  font-size: 0.8rem;
  background-color: #f8f8f8;
  padding: 0rem 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 4;
}

.commentItem p {
  padding: 0.2rem;
  margin: 0;
}

.commentItem p span {
  color: #5b6b8f;
  font-weight: bold;
}

.actionSheet {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #f7f7f7;
  height: 5vh;
}

.commentInput {
  width: 60%;
  padding: 3px 8px;
}

.icon-icon_xiaolian-xian {
  font-size: 1.7rem;
}

.commentInputBtn {
  height: 70%;
  padding: 0 12px;
  background-color: #f7f7f7;
  border: 1px solid #c8c8c8;
  border-radius: 0.2rem;
  color: #c4c4c4;
}
</style>
