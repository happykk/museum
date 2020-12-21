<template>
	<div class="mk-page-tips">
		<i class="tips-img">
			<img :src="$attrs.src || types[$attrs.type || 'network']['src']">
		</i>
    <p class="tips-txt" v-html="$attrs.text || types[$attrs.type || 'network']['text']"></p>
    <p class="tips-desc">{{ $attrs.desc }}</p>
	</div>
</template>
<script>
  export default {
    name: 'mk-page-tips',
    props: ['checked'],
    model: {
      prop: 'checked',
      event: 'update'
    },
    data () {
      return {
        types: {
          'network': {src: require('./img/network-error.png'), text: '数据加载失败...'},
          'loading': {src: require('./img/loading.gif'), text: '数据加载中'},
          '404': {src: require('./img/404.jpg'), text: ''}
        }
      }
    },
    methods: {
    },
    mounted () {
    }
  }
</script>
<style lang="scss" scoped>
  .mk-page-tips {
    text-align: center;
    padding: 140px 0px;
    .tips-img {
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-size: 100%;
      max-width: 150px;
      max-height: 130px;
      display: inline-block;
      font-style: normal;
      img {
        max-width: 150px;
        max-height: 130px;
      }
    }
    .tips-txt {
      font-size: 15px;
      margin-top: 15px;
      color:#969799;
    }
    .tips-desc {
      font-size: 14px;
      color: #9a9a9a;
    }
    .tips-detail {
      @extend .tips-txt;
      margin-top:4px;
      font-size:14px;
      color:#666;
    }
    .tips-btn-box {
      margin-top:20px;
      .ui-btn-line {
        min-width:75px;
      }
      .ui-btn-line:nth-child(2) {
        margin-left:15px;
      }
      .ui-btn-block:nth-child(2) {
        margin-top:10px;
      }
    }
  }
  @mixin ui-page-tips(
  $name:'page-tips',
  $background-image:'//s1.bbgstatic.com/pub/img/loading/loading32x32.gif',
  $iconBg:'',
  $tips-txt-color:'#7c7c88',
  $tips-detail-color:'#aaa9b9'
  ){
    .ui-#{$name} {
      .tips-img {
        @if $background-image!='' {
          background-image: image-url(#{$background-image});
        }
        &:after {
          font-family: "iconfontcom";
          content: "#{$iconBg}";
          font-size:122px;
          color:#cecece;
        }
      }
      .tips-txt {
        color: #{$tips-txt-color};
      }
      .tips-detail {
        color: #{$tips-detail-color};
      }
    }
  }

  /* 网络错误 */
  @include ui-page-tips('network');
  /* loading */
  @include ui-page-tips('page-loading', '//s1.bbgstatic.com/pub/img/loading/loading32x32.gif');
  /* icon */
  @include ui-page-tips('page-icon', '', '\e60f');

  .ui-page-loading {
    .tips-img {
      background-size:34px 34px;
      width:34px;
      height:34px;
    }
  }
</style>
