<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/6
 -->
<template>
  <el-menu
    id="my-menu"
    router
    unique-opened
    style="margin: 0"
    :default-active="menuIndex"
    class="my-menu full-height"
    :collapse="collapsed && !isDrawer"
    :background-color="backgroundColor"
    :text-color="textColor"
    :active-text-color="activeTextColor"
    @select="menuSelect"
  >
    <template v-if="isDrawer">
      <div
        class="el-menu-item title is-disabled"
        :style="{backgroundColor, opacity:1, textAlign: 'center'}"
      >
        <span>GrassGrows</span>
      </div>
      <el-menu-item-group>
        <template #title>
          <span style="white-space: nowrap">服务器管理控制台</span>
        </template>
      </el-menu-item-group>
    </template>
    <template v-else>
      <div
        class="el-menu-item title"
        :style="{backgroundColor}"
        @click="$emit('update:collapsed', !collapsed)"
      >
        <i :class="icon" />
        <span v-if="!collapsed">GrassGrows</span>
      </div>
      <el-menu-item-group>
        <template
          v-if="!collapsed"
          #title
        >
          <span style="white-space: nowrap">服务器管理控制台</span>
        </template>
        <template
          v-else
          #title
        >
&nbsp;
        </template>
      </el-menu-item-group>
    </template>
    <el-menu-item index="/workbench">
      <i class="el-icon-s-data" />
      <template #title>
        工作台
      </template>
    </el-menu-item>
    <el-submenu index="/server">
      <template #title>
        <i class="el-icon- iconfont emss-icon-server" />
        <span>服务器管理</span>
      </template>

      <el-menu-item index="/server/list">
        <i class="el-icon- iconfont emss-icon-server" />
        <template #title>
          服务器列表
        </template>
      </el-menu-item>
      <el-submenu index="/servers">
        <template #title>
          <i class="el-icon-open" />
          <span>服务器</span>
        </template>
        <el-menu-item-group>
          <template #title>
            <span style="white-space: nowrap">开启的服务器</span>
          </template>
          <el-menu-item
            v-for="s in runningServer"
            :key="s.id"
            class="server-name"
            :index="`/servers/${s.abbr}`"
          >
            <template #title>
              {{ s.name }}
            </template>
          </el-menu-item>
        </el-menu-item-group>
        <el-submenu index="/servers#stopped">
          <template #title>
            <span style="white-space: nowrap; color: #909399; font-size: 12px">关闭的服务器</span>
          </template>
          <el-menu-item
            v-for="s in stoppedServer"
            :key="s.id"
            class="server-name"
            :index="`/servers/${s.abbr}`"
          >
            <template #title>
              {{ s.name }}
            </template>
          </el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-submenu>

    <el-submenu index="/file">
      <template #title>
        <i class="el-icon- iconfont emss-icon-books " />
        <span>文件管理</span>
      </template>
      <el-menu-item index="/file/setting">
        <i class="el-icon-set-up" />
        <template #title>
          文件系统设置
        </template>
      </el-menu-item>
      <el-menu-item index="/files">
        <i class="el-icon-folder" />
        <template #title>
          文件列表
        </template>
      </el-menu-item>
    </el-submenu>

    <el-submenu index="/system">
      <template #title>
        <i class="el-icon-s-tools" />
        <span>系统管理</span>
      </template>
      <el-menu-item index="/system/users">
        <i class="el-icon-user-solid" />
        <template #title>
          用户管理
        </template>
      </el-menu-item>
      <el-menu-item index="/system/setting">
        <i class="el-icon-s-tools" />
        <template #title>
          系统设置
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>

export default {
    name: 'MyNavigator',
    props: {
        isDrawer: {
            type: Boolean,
            default: false,
        },
        collapsed: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            backgroundColor: '#545c64',
            textColor: '#fff',
            activeTextColor: '#ffd04b',
        }
    },
    computed: {
        icon() {
            return this.collapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'
        },
        menuIndex() {
            const { menuIndex } = this.$route.meta
            if (typeof menuIndex === 'function') {
                return menuIndex(this.$route)
            }
            return menuIndex
        },
        runningServer() {
            return this.$store.state.serverList?.filter((s) => s.running) || []
        },
        stoppedServer() {
            return this.$store.state.serverList?.filter((s) => !s.running) || []
        },
    },
    methods: {
        menuSelect(e) {
            if (this.isDrawer) {
                this.$emit('select', e)
            }
        },
    },
}
</script>

<style>
.my-menu:not(.el-menu--collapse) {
  width: 250px;
  min-height: 400px;
}
</style>
<style scoped>
.title span {
  font-size: 1.5em;
  font-weight: bold;
  color: #ffffff;
}

.title i {
  font-size: 1.5em;
  margin-right: 10px;
}

.server-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
