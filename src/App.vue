<template>
  <div id="app">
    <div class="container">
      <header>
        <van-nav-bar title="朋友圈"  :border="false" :fixed="true" left-arrow>
          <template #right>
            <van-icon name="photograph" size="18" />
          </template>
        </van-nav-bar>
      </header>
      <main>
        <van-pull-refresh v-model="isLoading" :head-height="80" @refresh="onRefresh">
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
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <div class="momentItem" v-for="item in list" :key="item.id" :title="item">
                  <div class="momentAvatar">
                    <img src="" alt="动态作者头像">
                  </div>
                  <div class="momentInfo">
                    <div class="authorName">
                      <span>令狐冲</span>
                    </div>
                    <div class="momentText">
                      <p>一些文案……</p>
                    </div>
                    <div class="momentPic" v-show="item.hasPic">
                      <van-uploader v-model="item.fileList" :deletable="false" :show-upload="false" />
                    </div>
                    <div class="momentVideo" v-show="item.hasVideo"></div>
                  </div>
              </div>
            </van-list>
          </div>
        </van-pull-refresh>
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
       *  下拉刷新
       */
      isLoading: false,
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
          authorAvatarUrl: require('../src/assets/image/authorAvatars/author1.jpg'),
          momentText: '且将且将新火试新茶，诗酒趁年华。',
          hasPic: true,
          fileList: [
            { url: 'https://img01.yzcdn.cn/vant/leaf.jpg' },
            {
              url: 'https://img01.yzcdn.cn/vant/sand.jpg'
            },
            {
              url: 'https://img01.yzcdn.cn/vant/tree.jpg'
            }
          ],
          hasVideo: false
        }
      ],
      loading: false,
      finished: false
    }
  },
  methods: {
    /**
     *  下拉刷新
     */
    onRefresh () {
      setTimeout(() => {
        this.isLoading = false
      }, 100)
    },
    /**
     *  动态列表
     */
    onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }

        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 20) {
          this.finished = true
        }
      }, 1000)
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
  width: 100vw;
  height: 100vh;
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
.van-nav-bar {
  /*下拉后header的背景样式*/
  background-color: #ededed;
}

.van-nav-bar .van-icon {
  color: #252525;
}

.van-nav-bar__title {
  color: #010101;
}
/**
  主体样式
 */

/* 下拉刷新样式 */
main {
  background-color: #2e2e2e;
}

.van-pull-refresh {
  height: 100rem;
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
  background-color: #ffffff;
  padding-top: 3rem;
  display: flex;
  justify-content: center;
}
</style>
