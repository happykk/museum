<template>
  <section class="container">
    <div class="top">
      <van-image v-if="dataInfo"
        lazy-load
        :src="'http://admin.xiangtanmuseum.com/static/image/'+dataInfo.img"
      ></van-image>
      
      <div class="audio-box">
        <audio ref="audioObj" v-if="dataInfo"
          :src="'http://admin.xiangtanmuseum.com/static/source/'+dataInfo.voice"
          @ended="audioEnd"
          @loadedmetadata="onLoadedmetadata"
          @timeupdate="onTimeupdate">
        该浏览器不支持video
        </audio>
        <!--  controls :src="'http://admin.xiangtanmuseum.com/static/source/'+dataInfo.voice" -->
        <div class="audio-progress">
          <div class="progress-bar-bg" ref="progressBarBg"><span ref="progressDot"></span>
            <div class="progress-bar" ref="progressBar"></div>
          </div>
          <div class="audio-time">
            <span class="audio-length-current" id="audioCurTime">{{initAudio.currentTime | formatSecond}}</span>
            <span class="audio-length-total">{{initAudio.maxTime | formatSecond}}</span>
          </div>
        </div>
        <div class="audio-btn">
          <van-icon name="replay" @click="handleReplay"/>
          <div @click="play" class="play-btn">
            <van-icon name="play-circle" v-if="!initAudio.play"/>
            <van-icon name="pause-circle" v-else />
          </div>
          <div class="sound" @click="handleVolume">
            <img :src="require('@/assets/images/sound-off.png')" class="sound-off" v-if="initAudio.sound">
            <van-icon name="volume" v-else/>
          </div>
        </div>
      </div>
    </div>
    <div class="desc">
      <h4 class="title">{{dataInfo.name}}</h4>
      <div class="desc-content" v-html="dataInfo.context"></div>
    </div>
  </section>
</template>

<script>
function realFormatSecond (second) {
  let secondType = typeof second
  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)
    let hours = Math.floor(second / 3600)
    second = second - hours * 3600
    let mimute = Math.floor(second / 60)
    second = second - mimute * 60
    return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
  } else {
    return '0:00:00'
  }
}
import {getQueryString} from '@/components/common/util'
export default {
  data () {
    return {
      dataInfo: '',
      id: getQueryString('id'),
      initAudio: {
        play: false, // 播放还是暂停 true播放中
        audioLength: 0, // audio时长
        currentTime: 0, // 当前播放时间
        // 音频最大播放时长
        maxTime: 0,
        minTime: 0,
        step: 0.1,
        sound: false  // 是否静音
      },
      sliderTime: 0
    }
  },
  filters: {
    // 将整数转化成时分秒
    formatSecond (second = 0) {
      return realFormatSecond(second)
    }
  },
  methods: {
    getData () {
      this.$ajax.get('//api.xiangtanmuseum.com/api/voice/coll', {id: this.id}).then(res => {
        if (res.code === 0) {
          this.dataInfo = res.data
        }
      })
    },
    play () {
      if (!this.initAudio.play) {
        // 开始播放当前点击的音频
        this.$refs.audioObj.play()
        this.initAudio.play = true
        // $('#audioPlayer').attr('src', 'image/pause.png');
      } else {
        this.$refs.audioObj.pause()
        this.initAudio.play = false
        // $('#audioPlayer').attr('src', 'image/play.png');
      }
    },
    handleVolume () {
      this.$refs.audioObj.volume = !this.$refs.audioObj.volume
      this.initAudio.sound = !this.initAudio.sound
    },
    handleReplay () {
      this.$refs.audioObj.load()
      this.initAudio.play = false
      this.$refs.progressBar.style.width = 0
      this.$refs.progressDot.style.left = 0
      this.initAudio.currentTime = 0
    },
    onTimeupdate (res) {
      let value = this.$refs.audioObj.currentTime / this.$refs.audioObj.duration
      this.$refs.progressBar.style.width = value * 100 + '%'
      this.$refs.progressDot.style.left = value * 100 + '%'
      this.initAudio.currentTime = res.target.currentTime
    },
    onLoadedmetadata (res) {
      this.initAudio.maxTime = parseInt(res.target.duration)
    },
    audioEnd () {
      this.initAudio.play = !this.initAudio.play
    },
    handleTouchStart (e) {
      console.log(e)
      this.setValue(e.touches[0])
      document.addEventListener('touchmove', this.handleTouchMove)
      document.addEventListener('touchup', this.handleTouchEnd)
      document.addEventListener('touchend', this.handleTouchEnd)
      document.addEventListener('touchcancel', this.handleTouchEnd)
    },
    handleTouchMove (e) {
      this.setValue(e.changedTouches[0])
    },
    handleTouchEnd (e) {
      this.setValue(e.changedTouches[0])
      document.removeEventListener('touchmove', this.handleTouchMove)
      document.removeEventListener('touchup', this.handleTouchEnd)
      document.removeEventListener('touchend', this.handleTouchEnd)
      document.removeEventListener('touchcancel', this.handleTouchEnd)
    },
    setValue (e) {
      const $el = this.$el
      const {
          maxTime,
          minTime,
          step
      } = this.initAudio
      let value = (e.clientX - $el.getBoundingClientRect().left) / $el.offsetWidth * (maxTime - minTime)
      value = Math.round(value / step) * step + minTime
      value = parseFloat(value.toFixed(5))
      if (value > maxTime) {
        value = maxTime
      } else if (value < minTime) {
        value = minTime
      }
      this.$refs.initAudio.currentTime = value
    }
  },
  mounted () {
    document.title = '语音导览'
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.container{
  min-height: 100vh;
  background: #fff;
}
.top{
  background: #fff;
  padding: 16px;
  margin-bottom: 8px;
  .van-image{
    /deep/img{
      width: 100%;
      height: 145px;
      object-fit: cover;
      border-radius: 5px;
      margin-bottom: 15px;
    }
  }
}
.desc{
  border-top: 8px solid #F2F2F2;
  padding-top: 10px;
  .title{
    position: relative;
    padding-left: 15px;
    font-size: 14px;
    color: #161616;
    margin: 5px 0 0;
    &::before{
      content: '';
      position: absolute;
      left: 0;
      width: 6px;
      height: 18px;
      background: #B41700;
    }
  }
  .desc-content{
    margin: 10px 20px 0;
    font-size: 13px;
    color: rgba(22,22,22,0.60);
    line-height: 21px;
    /deep/img{
      max-width: 100%;
    }
  }
}

.audio-box{
  height: 102px;
}
.audio-btn {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
  /deep/.van-icon{
    font-size: 24px;
    color: #B41700;
    margin: 0 20px;
  }
  .play-btn{
    /deep/.van-icon{
      font-size: 36px;
    }
  }
  .sound{
    width: 60px;
    text-align: center;
    .sound-off{
      width: 24px;
    }
  }
}
.audio-progress {
  p {
    font-size: 15px;
    height: 35%;
    margin: 8px 0;
    /* 歌曲名称只显示在一行，超出部分显示为省略号 */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 243px;   /* 要适配小屏幕手机，所以最大宽度先设小一点，后面js根据屏幕大小重新设置 */    
  }
}
.progress-bar-bg {
  background: rgba(180,23,0,0.20);
  position: relative;
  height: 2px;
  cursor: pointer;
}

.progress-bar {
  background-color: #B41700;
  width: 0;
  height: 3px;
}

.progress-bar-bg span {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  background: #B41700;
  // border-radius: 2px;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -5px;
  margin-left: -5px;
  cursor: pointer;
}
.audio-time {
  overflow: hidden;
  margin-top: 10px;
  font-size: 12px;
  color: rgba(22,22,22,0.40);
}

.audio-length-total {
  float: right;
}

.audio-length-current {
  float: left;
}
</style>