<template>
  <div slot="ctn" class="mk-letter-search-wrap" ref="search">
    <slot name="top"/>
    <div class="mk-letter-search">
      <div v-for="(it, index) in getList.list" class="jListItem" :key="index">
        <h3>{{ it.letter }}</h3>
        <div class="search-item-wrap">
          <div class="wrap-inner">
            <slot :row="it.data"/>
          </div>
        </div>
      </div>
    </div>
    <!-- bar -->
    <div class="mk-letter-search-bar" ref="bar" v-touch:move="move" v-touch:end="end" v-show="letters.length > 0" :style="{marginTop: -(barH / 2) + 'px'}">
      <div class="mod-bubble" v-if="bubbleShow" :style="{top: top + 'px'}">{{ bubbleText }}</div>
      <ul ref="barUl">
        <li v-for="(item, index) in letters" class="bar-item" :key="index" @click="goto(index)">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  import './touch.js'
  export default {
    name: 'mk-letter-search',
    props: ['text', 'data'],
    data () {
      return {
        top: 0,
        barH: 0,
        bubbleShow: false,
        bubbleText: ''
      }
    },
    computed: {
      letters () {
        return this.getList.letters
      },
      getList () {
        let data = this.data || []
        let list = []
        let letters = []
        for (let key in data) {
          letters.push(key)
          list.push({letter: key, data: data[key]})
        }
        return {
          list: list,
          letters: letters
        }
      }
    },
    watch: {
      getList () {
        this.$nextTick(() => {
          this.barH = this.$refs.bar.clientHeight
        })
      }
    },
    methods: {
      goto (index) {
        let $box = this.$refs.search
        let h3 = $box.getElementsByClassName('jListItem')
        h3[index] && window.scrollTo(0, h3[index].offsetTop)
      },
      move (obj) {
        obj.event.preventDefault()
        let $box = this.$refs.search
        let index = this.getLetterIndex(obj.event.touches[0].clientY)
        let h3 = $box.getElementsByClassName('jListItem')
        // this.bubbleText = this.letters[index]
        this.bubbleText = this.letters[index]
        this.bubbleShow = true
        h3[index] && window.scrollTo(0, h3[index].offsetTop)
      },
      end (obj) {
        this.bubbleShow = false
      },
      // 获取选中字母的索引
      getLetterIndex (y) {
        let $bar = this.$refs.bar
        let padding = ($bar.clientHeight - this.$refs.barUl.clientHeight) / 2
        let barH = $bar.clientHeight
        let offsetTop = $bar.offsetTop
        let h = $bar.getElementsByClassName('bar-item')[0].clientHeight
        let index = 0
        if (offsetTop + padding > y) {
          index = 0
        } else if (offsetTop + barH - padding < y) {
          index = this.letters.length - 1
        } else {
          index = Math.floor((y - offsetTop - padding) / h)
        }
        this.top = padding + (index * h) + (h / 2)
        return index
      },
      selected (e, item) {
        this.$emit('selected', {e: e, item: item})
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mk-letter-search-wrap {
  }
  .mk-letter-search {
    h3 {
      top:0;
      position: -webkit-sticky;
      position: sticky;
      background: #f5f7fb;
      height: 60px;
      line-height: 60px;
      /* border-top: 1px solid #edf0f6; */
      color: #999;
      padding: 0 30px;
      font-size: 26px;
      display: block;
      font-weight:bold;
      z-index:1;
    }
    .search-item-wrap {
      background: #fff;
      border-radius: 24px;
      .wrap-inner {
        position:relative;
        &:after {
          content: '';
          position:absolute;
          left:0px;
          right:0px;
          bottom:0px;
          border-bottom: 1px solid #ccc;
        }
        &:last-child:after {
          display: none;
        }
      }
    }
    .search-item {
      height: 50px;
      line-height: 50px;
      font-size: 22px;
      margin: 0 24px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .mk-letter-search-bar {
    position: fixed;
    top: 50%;
    right: 0px;
    font-size: 24px;
    font-weight: 400;
    color: #fff;
    z-index: 1000;
    border: 1px solid #d5d6d6; /*no*/
    background-color: #cfcfcf;
    border-radius: 15px;
    .mod-bubble {
      position:absolute;
      background: url(./img/bubble.png) no-repeat;
      background-size: 100%;
      width: 106px;
      height: 88px;
      line-height: 88px;
      color: #fff;
      top: 0px;
      left: rem(-110);
      margin-top: rem(-44);
      font-size:30px;
      box-sizing: border-box;
      padding-left: 34px;
    }
    ul {
      width: 30px;
      margin: 20px auto;
      li {
        text-align: center;
        display: block;
        height: 36px;
        line-height: 36px;
        -webkit-touch-callout: none;
        -moz-user-select: -moz-none;
        -ms-user-select: none;
        -webkit-user-select: none;
        user-select: none;
      }
    }
  }
</style>
