<template>
  <div id="app">
    <div class="container">
      <header>
        <div class="headContainer">
          <ul>
            <li>
              <span class="left-icon">
                <i class="iconfont icon-left"></i>
              </span>
            </li>
            <li>
              <span class="app-title">
                朋友圈
              </span>
            </li>
            <li>
              <span class="right-icon">
                <i class="iconfont icon-zhaoxiangji1"></i>
              </span>
            </li>
          </ul>
        </div>
      </header>
      <main>
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
                    <div class="momentPic" v-show="item.hasPic" v-if="item.isMulti">
                      <div class="momentPicContainer"/>
                    </div>
                    <div class="momentPic" v-show="item.hasPic" v-else>
                    </div>
                    <div class="momentVideo" v-show="item.hasVideo"></div>
                    <div class="likeCommentsTool">
                      <div class="toolBars">
                        <div class="momentTime"><span>3小时前</span></div>
                        <div>
                          <van-popover
                            v-model="item.showPopover"
                            trigger="click"
                            placement="left"
                          >
                            <div class="popCard">
                              <ul>
                                <li>
                                  <van-icon name="like-o" @click="handleLikeBtn($event,item.likeIt, item.id)" />
                                  <span>赞</span>
                                </li>
                                <li @click="handleCommentBtn(item.id)">
                                  <van-icon name="more-o" />
                                  <span>评论</span>
                                </li>
                              </ul>
                            </div>
                            <template #reference>
                              <van-icon name="ellipsis" />
                            </template>
                          </van-popover>
                        </div>
                      </div>
                      <div class="likeList" v-show="item.likeList.length > 0">
                        <van-icon name="like-o"  />
                        <ul>
                          <li v-for="likeItem in item.likeList" :key="likeItem.id" :title="likeItem">
                            <img :src="likeItem" alt="点赞人头像">
                          </li>
                        </ul>
                      </div>
                      <div class="commentsList" v-show="item.commentList.length > 0">
                        <div class="commentItem" v-for="commentItem in item.commentList" :key="commentItem.id" :title="commentItem">
                          <span>{{ commentItem.name }}</span>
                          : {{ commentItem.commentText }}
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <van-action-sheet v-model="showInputSheet" :round="false" :overlay="false">
        <van-field v-model="commentText" placeholder="评论"  />
        <van-icon name="smile-o" />
        <van-button type="default"  @click="sendComment()">发送</van-button>
      </van-action-sheet>
    </div>
  </div>
</template>

<script>
import {ImagePreview} from 'vant'

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
          hasPic: true,
          isMulti: true,
          fileList: [
            { url: 'https://img01.yzcdn.cn/vant/leaf.jpg' },
            {
              url: 'https://img01.yzcdn.cn/vant/sand.jpg'
            },
            {
              url: 'https://img01.yzcdn.cn/vant/tree.jpg'
            },
            { url: 'https://img01.yzcdn.cn/vant/leaf.jpg' },
            {
              url: 'https://img01.yzcdn.cn/vant/sand.jpg'
            },
            {
              url: 'https://img01.yzcdn.cn/vant/tree.jpg'
            },
            { url: 'https://img01.yzcdn.cn/vant/leaf.jpg' },
            {
              url: 'https://img01.yzcdn.cn/vant/sand.jpg'
            },
            {
              url: 'https://img01.yzcdn.cn/vant/tree.jpg'
            }
          ],
          hasVideo: false,
          showPopover: false,
          likeIt: false,
          likeList: [],
          commentList: []
        },
        {
          id: 1,
          authorName: '周思成',
          authorAvatarUrl: require('../src/assets/image/authorAvatars/author3.png'),
          momentText: '出门看公园.....',
          hasPic: true,
          isMulti: false,
          fileList: [
            {
              url: 'https://img01.yzcdn.cn/vant/tree.jpg',
              imageFit: 'contain'
            }
          ],
          hasVideo: false,
          showPopover: false,
          likeList: [],
          commentList: []
        }
      ],
      loading: false,
      finished: false,
      // 点赞评论
      actions: [{ text: '选项一' }, { text: '选项二' }, { text: '选项三' }],
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
      this.startLocation = e.touches[0].pageY
      this.isTransition = false
    },
    // 获取手指移动的距离
    handlerTouchMove (e) {
      // 通过系数来控制下拉的松紧度（映射倍数）
      let moveSpeed = 0.4

      this.moveDistance = Math.floor(e.touches[0].pageY - this.startLocation)
      this.$refs.scrollContainer.style.transform = `translateY(${this.moveDistance * moveSpeed}px)`
    },
    // 获取手指松开的Y轴位置
    handlerTouchEnd (e) {
      // 清除已移动的距离
      this.moveDistance = 0
      this.isTransition = true
      // 恢复原位
      this.$refs.scrollContainer.style.transform = `translateY(0px)`
    },
    /**
     *  动态列表
     */
    //  列表数据更新
    onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        this.finished = true
      }, 1000)
    },
    //  点击单张图片预览
    previewImg (url) {
      ImagePreview([url])
    },
    //  点赞按钮回调函数
    handleLikeBtn (e, likeIt, id) {
      if (likeIt) {
        console.log(e.target)
        e.target.classList.remove('van-icon-like')
        e.target.classList.add('van-icon-like-o')
        e.target.classList.remove('likeIconColor')
        e.target.classList.add('unlikeIconColor')
        e.target.parentNode.children[1].innerText = '赞'
        this.list[id].likeIt = false
        this.list[id].likeList.shift()
        this.list[id].showPopover = false
      } else {
        console.log(e.target)
        e.target.classList.remove('van-icon-like-o')
        e.target.classList.add('van-icon-like')
        e.target.classList.remove('unlikeIconColor')
        e.target.classList.add('likeIconColor')
        e.target.parentNode.children[1].innerText = '取消'
        this.list[id].likeIt = true
        this.list[id].likeList.push(require('../src/assets/image/avatar.jpg'))
        this.list[id].showPopover = false
      }
    },
    //  评论按钮回调函数
    handleCommentBtn (id) {
      this.list[id].showPopover = false
      this.showInputSheet = true
      this.commentID = id
    },
    //  发送评论
    sendComment () {
      this.list[this.commentID].commentList.push({
        name: this.userProfile.username,
        commentText: this.commentText
      })
      this.showInputSheet = false
      this.commentText = ''
    }
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
  min-height: 100%;
  height: 100%;
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
  width: 100%;
  height: 6vh;
  background-color: #ededed;
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
}

.left-icon i {
  font-size: 1rem;
  color: #252525;
}

.right-icon i {
  font-size: 1.3rem;
  color: #252525;
}
/**
  主体样式
 */

/* 下拉刷新样式 */
main {
  background-color: #2e2e2e;
  min-height: 100vh;
}

.scroll-container {
  height: 100%;
}

.transition {
  transition: all 0.7s;
}

.bgImage {
  position: relative;
  font-size: 1rem;
  background-image: url('assets/image/bgImage.jpg');
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 36vh;
}

.userProfile {
  display: flex;
  width: 7rem;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: -2rem;
  right: 1rem;
}

.userName {
  font-size: 0.9rem;
  align-self: flex-start;
  padding: 1em 0;
  color: #ffffff;
  font-weight: bold;
}

.avatar img{
  height: 4rem;
  width: 4rem;
  border-radius: 0.5rem;
}
/**
  动态列表样式
 */
.momentList {
  width: 100%;
  background-color: #ffffff;
  padding-top: 3rem;
  display: flex;
  justify-content: center;
  overflow: visible;
}

.momentAvatar img{
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 0.2rem;
}

.momentItem {
  display: flex;
  justify-content: space-between;
  width: 90vw;
  padding: 0.4rem 0;
  border-bottom: 1px solid #e8e8e8;
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

.momentPic {
}

.van-uploader__preview-image {
  width: 23.5vw;
  height: 23.5vw;
}

/* 点赞及工具栏样式 */
.toolBars {
  display: flex;
  justify-content: space-between;
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
  font-size: 0.8rem;
  background-color: #f8f8f8;
  padding: 0.3rem 0.4rem;
}

.commentItem span {
  color: #5b6b8f;
  font-weight: bold;
}

.van-action-sheet__content {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: #f7f7f7;
  height: 5vh;
}

.van-cell {
  width: 70%;
  padding: 3px 8px;
}

.van-icon-smile-o {
  font-size: 1.7rem;
}

.van-button--normal {
  height: 70%;
  padding: 0 12px;
  background-color: #f7f7f7;
  border: 1px solid #c8c8c8;
  border-radius: 0.2rem;
  color: #c4c4c4;
}
</style>
