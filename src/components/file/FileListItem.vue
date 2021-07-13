<!--
 * @Author: smq
 * @Date: 2021/7/11
 -->
<template>
  <div>
    <div
      class="wrapper"
      :class="{selected}"
    >
      <div
        v-if="!isMobile"
        class="checkbox-container selector"
      >
        <div
          class="outline"
          @click="select"
        >
          <i
            v-if="selected"
            class="el-icon-success"
          />
        </div>
      </div>
      <div
        v-if="!selected && !isMobile"
        class="checkbox-container more"
      >
        <i class="el-icon-more" />
      </div>
      <div>
        <div class="image">
          <svg
            :class="iconName.class"
            aria-hidden="true"
          >
            <use :xlink:href="iconName.link" />
          </svg>
        </div>
        <div class="desc">
          <div class="filename">
            {{ file.name }}
          </div>
          <div class="time">
            {{ editTimeFormat }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/utils'
import {DateTime} from 'luxon'

export default {
    name: 'FileListItem',
    props: {
        file: Object,
        selected: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:selected'],
    computed: {
        isMobile() {
            return this.$store.isMobile
        },
        editTimeFormat() {
            const time = DateTime.fromJSDate(this.file.editTime)
            if (time.startOf('day') >= DateTime.now().startOf('day')) {
                return time.toFormat('tt')
            }
            return time.toFormat('DD')
        },
        iconName() {
            return utils.getIconStyle(this.file)
        },
    },
    methods: {
        select() {
            this.$emit('update:selected', !this.selected)
        },
    },
}
</script>

<style
  scoped
  lang="less"
>

.checkbox-container {
  position: absolute;
  top: 8px;
  font-size: 18px;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  opacity: 0;
  visibility: hidden;
}

.selector {
  left: 8px;
  color: #228efe;

  .outline {
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }
}

.more {
  right: 8px;

  &:hover {
    color: #228efe;
  }
}

.wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, .08);

    .selector .outline {
      border: 2px solid rgba(0, 0, 0, 0.2);
    }
  }

  &.selected {
    background-color: rgba(67, 137, 211, 0.2);
  }

  &.selected, &:hover {

    .checkbox-container {
      opacity: 1;
      visibility: visible;
      transition: opacity 0.3s ease-in;
    }
  }

  &:not(.selected) .selector .outline:hover {
    border-color: #409EFF;
  }

}

.image svg {
  height: 120px;
  width: 160px;
}

@media screen and (max-width: 768px) {
  .image svg {
    width: 110px;
    height: 90px;
  }
}

.desc > div {
  text-align: center;
  margin: 8px 4px;
  overflow: hidden;
  box-sizing: border-box;
  text-overflow: ellipsis;
  max-height: 40px;
  white-space: nowrap;
  width: 152px;
  @media screen and (max-width: 768px) {
    width: 102px;
  }

  &.filename {
    font-size: 14px;
  }

  &.time {
    font-size: 12px;
    color: rgba(0, 0, 0, .5);

  }

}

</style>
