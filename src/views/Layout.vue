<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/6
 -->
<template>
  <el-container class="full-height">
    <file-context-menu />
    <el-aside
      v-if="!isMobile"
      width="auto"
      class="container"
    >
      <my-navigator v-model:collapsed="collapseSide" />
    </el-aside>
    <el-container>
      <el-header class="my-shadow">
        <header-nav
          :collapse-side="collapseSide"
          :show-breadcrumb="!isMobile"
          @collapse-click="collapseSide = !collapseSide"
        />
      </el-header>
      <el-main class="main-content">
        <div class="content-header">
          <header-breadcrumb
            v-if="isMobile"
            :max-breadcrumb="5"
            style="margin-bottom: 10px"
          />

          <router-view name="extra" />
        </div>
        <div class="view">
          <router-view />
        </div>

        <el-backtop target=".main-content" />
      </el-main>
    </el-container>
    <el-drawer
      v-if="isMobile"
      v-model="showSide"
      :with-header="false"
      append-to-body
      direction="ltr"
      size="249px"
      custom-class="drawer"
    >
      <my-navigator
        v-model:collapsed="collapseSide"
        is-drawer
        @select="showSide = false"
      />
    </el-drawer>
    <uploader />
  </el-container>
</template>

<script>

import MyNavigator from '@/components/header/Navigator.vue'
import HeaderNav from '@/components/header/HeaderNav.vue'
import HeaderBreadcrumb from '@/components/header/HeaderBreadcrumb.vue'
import Uploader from '@/views/file/Uploader'
import FileContextMenu from '@/components/file/FileContextMenu'

const smMatch = window.matchMedia('(max-width: 768px)')

export default {
    name: 'Layout',
    components: {FileContextMenu, Uploader, HeaderNav, MyNavigator, HeaderBreadcrumb},
    data() {
        return {
            collapseSide: smMatch.matches === true,
            isMobile: smMatch.matches === true,
        }
    },
    computed: {
        showSide: {
            get() {
                return !this.collapseSide
            },
            set(value) {
                this.collapseSide = !value
            },
        },
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
    },
    unmounted() {
        window.removeEventListener('resize', this.onResize)
    },
    methods: {
        onResize() {
            const val = smMatch.matches === true
            if (val !== this.isMobile) {
                this.$store.commit('setIsMobile', val)
                this.isMobile = val
            }
        },
    },
}
</script>

<style lang="less">
html, body, #app, .full-height {
  height: 100%;
}

.full-height {
  box-sizing: border-box;
}

body {
  margin: 0;
  color: rgba(0, 0, 0, 0.9);
}

.my-shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}


.blank, .auto-size {
  flex: 1 1 0;
}

.color-primary {
  color: @color-primary !important;
}

.color-danger {
  color: @color-danger !important;
}

.color-success {
  color: @color-success !important;
}

.color-info {
  color: @color-info !important;
}

.color-warn {
  color: @color-warn !important;
}


</style>

<style scoped>

.content-header {
    display: flex;
    flex-direction: column;
    padding: 16px;
    background-color: #ffffff;

}

.main-content {
    display: flex;
    flex-direction: column;
    background-image: url("../../public/bodybg.png");
    background-size: cover;
    padding: 0;
}

.main-content .view {
    padding: 8px 16px;
    display: flex;
    flex: 1 0 auto;
    flex-direction: column;
}

.main-content .view div {
    flex: 1 1 auto;
}
</style>
