<template>
  <label class="mk-checkbox" ref="chkBox">
    <input type="checkbox" @click="onChange" :checked="checked" ref="chk" :class="[indeterminateClass]"/>
    <span><slot></slot></span>
  </label>
</template>
<script>
  export default {
    name: 'mk-checkbox',
    props: ['checked', 'indeterminate', 'disabled'],
    model: {
      prop: 'checked',
      event: 'update'
    },
    computed: {
      indeterminateClass () {
        return (this.indeterminate !== undefined && this.checked ? 'indeterminate' : '')
      }
    },
    methods: {
      onChange (e) {
        this.$emit('change', e)
        this.$emit('update', !this.checked)
      },
      setDisabled () {
        let disabled = this.disabled
        if (disabled !== undefined && disabled !== false) {
          this.$refs.chk.setAttribute('disabled', 'disabled')
        } else {
          this.$refs.chk.removeAttribute('disabled')
        }
      }
    },
    data () {
      return {
      }
    },
    mounted () {
      this.setDisabled()
    }
  }
</script>
<style lang="scss" scoped>
.mk-checkbox {
  span {
    display: inline-block;
    font-size: 20px;
    line-height: 40px;
    padding-left: 4px;
  }
	input[type="checkbox"],
	input[type="radio"] {
			color: #a4a4a4;
			border: 0px;
			border-radius: 0;
			display: inline-block;
      vertical-align:middle;
			-webkit-appearance: none;
			width: 40px;
			height: 40px;
			line-height: 32px;
			background-size: 40px;
			background-repeat: no-repeat;
			border: none;
      background: transparent;
			&:after {
					font-size: 40px;
					font-family: "iconfontcom";
					content: "\e601";
			}
			&:checked {
					color: #4a9bf2;
					&:after {
							content: "\e617";
					}
			}
      &.indeterminate {
        &:after {
          font-size: 36px;
          content: "\e639";
          margin-top: 2px;
        }
      }
			&:disabled {
          color: #c4ccd9;
					&:after {
							content: "\e600";
					}
			}
	}
}
</style>
