<!--
 * @Author: smq
 * @Date: 2021/7/9
 -->
<template>
  <common-info-card
    header="服务器设置"
    icon="el-icon-setting"
    @show="$emit('showSetting')"
  >
    <el-descriptions
      border
      direction="vertical"
      column="4"
    >
      <el-descriptions-item label="Id">
        {{ id }}
      </el-descriptions-item>
      <el-descriptions-item label="服务器名称">
        {{ name }}
      </el-descriptions-item>
      <el-descriptions-item label="服务器别名">
        {{ aliasName }}
      </el-descriptions-item>
      <el-descriptions-item label="端口">
        {{ port }}
      </el-descriptions-item>
    </el-descriptions>
    <div class="footer">
      <div>崩溃自动重启</div>
      <el-switch
        :model-value="autoRestart"
        :loading="loading"
        @change="changeAutoRestart"
      />
    </div>

  </common-info-card>
</template>

<script>
import CommonInfoCard from '@/components/server/info/common/CommonInfoCard.vue'
import {mapState} from 'vuex'
import utils from '@/utils'
import api from '@/api'

export default {
    name: 'SettingsInspect',
    components: {CommonInfoCard},
    computed: {
        ...mapState(['currentServer']),
        ...utils.mapData('currentServer', ['id', 'name', 'port', 'tps', 'autoRestart', 'aliasName']),
    },
    data() {
        return {
            loading: false,
        }
    },
    methods: {
        async changeAutoRestart(val) {
            this.loading = true
            await api.server.autoRestart(this.id, val)
            await this.$store.dispatch('refreshServerList')
            this.loading = false
        }
    }
}
</script>

<style
  scoped
  lang="less"
>
.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  color: rgba(0,0,0,.5);
  & > div {
    margin: 10px 4px;
  }
}
</style>
