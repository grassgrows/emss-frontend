<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/8
 -->
<template>
  <div class="terminal">
    <el-card class="card">
      <el-tabs
        v-model="selected"
        class="tabs-container"
      />
      <el-tab-pane
        name="first" 
        label="模拟终端"
      >
        <xterm />
      </el-tab-pane>
      <el-tab-pane 
        name="second" 
        label="聊天窗口"
      />
      <el-tab-pane
        name="second"
        label="过滤信息"
      />
    </el-card>
  </div>
</template>

<script>
import Xterm from '@/components/common/Xterm.vue'

export default {
    name: 'Terminal',
    components: {
        Xterm
    },
    data() {
        return {
            selected: 'first'
        }
    }
}
</script>

<style scoped>

</style>