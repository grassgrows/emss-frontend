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
          <div class="terminal-wrapper">
            <xterm
              ref="xterm"
              class="terminal"
            />
          </div>
          <term-input />
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
import {attachServer} from '@/api/command'
import {runCatching} from '@/utils/functionUtils'

export default defineComponent({
    name: 'Terminal',
    components: { Xterm},
    props: {},
    data() {
        return {
            selected: 'first',
            ws: undefined as WebSocket | undefined,
        }
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route.name'(to: string) {
            if (to === 'terminal') {
                this.initTerminal()
            } else {
                runCatching(() => {
                    this.ws?.close()
                })
            }
        }
    },
    created() {
        this.initTerminal()
    },
    methods: {
        async initTerminal() {
            this.ws && this.ws.close()
            this.ws = await attachServer(this.$store.state.currentServer.id)
            const xterm = this.$refs.xterm as any
            xterm.initTerm(this.ws)
        }
    }

})
</script>

<style
  scoped
  lang="less"
>
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
