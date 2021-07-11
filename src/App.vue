<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/6
 -->
<template>
    <el-container class="full-height">
        <el-aside width="auto" class="container" v-if="!isMobile">
            <my-navigator v-model:collapsed="collapseSide"></my-navigator>
        </el-aside>
        <el-container>
            <el-header class="my-shadow">
                <header-nav @collapse-click="collapseSide = !collapseSide"
                            :collapseSide="collapseSide"
                            :show-breadcrumb="!isMobile"
                ></header-nav>
            </el-header>
            <el-main class="main-content">
                <div class="content-header">
                    <header-breadcrumb v-if="isMobile"
                                       :max-breadcrumb="5"
                                       style="margin-bottom: 10px"
                    >
                    </header-breadcrumb>

                    <router-view name="extra"></router-view>
                </div>
                <div class="view">
                    <router-view></router-view>
                </div>

                <el-backtop target=".main-content"></el-backtop>
            </el-main>
        </el-container>
        <el-drawer :with-header="false" v-model="showSide" append-to-body
                   direction="ltr" v-if="isMobile" size="249px" custom-class="drawer">
            <my-navigator v-model:collapsed="collapseSide"
                          is-drawer @select="showSide = false"></my-navigator>
        </el-drawer>
    </el-container>
</template>

<script>

import MyNavigator from '@/components/header/Navigator.vue'
import HeaderNav from '@/components/header/HeaderNav.vue'
import HeaderBreadcrumb from '@/components/header/HeaderBreadcrumb.vue'

const smMatch = window.matchMedia('(max-width: 768px)')

export default {
    name: 'App',
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
    components: {HeaderNav, MyNavigator, HeaderBreadcrumb},
}
</script>

<style lang="less">
@import "styles/global";

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
    background-color: #f2f2f2;
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
