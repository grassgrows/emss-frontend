<template>
  <div class="menu-wrapper">
    <transition>
      <div
        v-if="visible"
        class="menu"
        :style="{left:left+'px',top:top+'px'}"
      >
        <ul class="el-dropdown-menu">
          <li
            class="el-dropdown-menu__item"
            @click="$bus.emit('copy-file')"
          >
            <i class="el-icon-document-copy" />
            复制
          </li>
          <li
            class="el-dropdown-menu__item"
            @click="$bus.emit('cut-file')"
          >
            <i class="el-icon-scissors" />
            剪切
          </li>
          <li
            class="el-dropdown-menu__item"
            :class="{'is-disabled': !canParse}"
            @click="canParse && $bus.emit('parse-file')"
          >
            <i class="el-icon-document-add" />
            粘贴
          </li>
          <li
            class="el-dropdown-menu__item"
            @click="$bus.emit('rename-file')"
          >
            <i class="el-icon-edit" />
            重命名
          </li>
          <li
            class="el-dropdown-menu__item"
            @click="$bus.emit('delete-file')"
          >
            <i class="el-icon-delete" />
            删除
          </li>

          <li
            class="el-dropdown-menu__item"
            @click="$bus.emit('refresh-file')"
          >
            <i class="el-icon-refresh" />
            刷新
          </li>

          <li
            class="el-dropdown-menu__item"
            @click="$bus.emit('compress-file')"
          >
            <i class="el-icon- iconfont emss-icon-archive-in" />
            压缩
          </li>

          <li
            class="el-dropdown-menu__item"
            @click="$bus.emit('uncompress-file')"
          >
            <i class="el-icon- iconfont emss-icon-archive-out" />
            解压缩
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
    name: 'FileContextMenu',
    data() {
        return {
            top: 0,
            left: 0,
            visible: false
        }
    },
    computed: {
        canParse() {
            return this.$store.state.file.selectedFileList.length > 0
        },
    },
    watch: {
        visible(value) {
            if (value) {
                document.body.addEventListener('click', this.closeMenu)
            } else {
                document.body.removeEventListener('click', this.closeMenu)
            }
        }
    },
    created() {
        this.$bus.on('file-context-menu', this.openMenu)
    },
    methods: {
        openMenu(e) {
            this.top = e.pageY
            this.left = e.pageX
            this.visible = true
        },
        closeMenu() {
            this.visible = false
        },
    }
}
</script>

<style
  scoped
  lang="less"
>

.menu-wrapper {
  position: relative;
  width: 0;
  height: 0;

  .menu {
    position: absolute;
    z-index: 1000;
    width: 150px;
  }
}
</style>
