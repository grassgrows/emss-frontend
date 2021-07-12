<template>
  <div class="wrapper">
    <el-card class="card">
      <el-tabs
        v-model="selected"
        class="container"
      >
        <el-tab-pane
          label="模拟终端"
          name="first"
        >
          <xterm
            class="terminal"
            :showing="selected==='first'"
          />
        </el-tab-pane>
        <el-tab-pane
          label="聊天窗口"
          name="second"
        >
          聊天窗口
        </el-tab-pane>
        <el-tab-pane
          label="日志过滤"
          name="third"
        >
          日志过滤
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts">
import Xterm from '@/components/common/Xterm.vue'
import {defineComponent} from 'vue'

export default defineComponent({
    name: 'Terminal',
    components: {Xterm},
    data() {
        return {
            selected: 'first',
        }
    },
    methods: {},
})
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
}

.wrapper {
    padding: 8px 0;
}

.terminal {
    height: 72vh;
}

</style>
