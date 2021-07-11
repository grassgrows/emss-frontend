<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/8
 -->
<template>
    <div class="static-container" :class="{reverse}">
        <div class="title">{{ title }}</div>
        <div class="value" :style="contentStyle">
            <slot name="prefix"></slot>
            <span class="content">{{ dispValue }}</span>
            <slot name="suffix"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Statistic',
    props: {
        title: String,
        value: [Number, Date, String, Object],
        contentStyle: [Object, String],
        precision: {
            type: Number,
            default: -1,
        },
        format: Function,
        reverse: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        dispValue() {
            if(typeof this.value === 'number' && this.precision >= 0){
                return this.value.toPrecision(this.precision)
            }
            if(typeof this.format !== 'undefined'){
                return this.format(this.value) || this.value
            }
            return this.value
        },
    },
}
</script>

<style scoped>
.static-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.static-container.reverse {
  flex-direction: column-reverse;
}

.title {
  color: rgba(0, 0, 0, .45);
  font-size: 14px;
  text-align: center;
}

.value {
  color: rgba(0, 0, 0, .85);
  font-size: 24px;
  text-align: center;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont,
  Segoe UI, Roboto, Helvetica Neue, Arial,
  Noto Sans, sans-serif, Apple Color Emoji,
  Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
}
</style>