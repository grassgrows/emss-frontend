<!--
 * @Author: smq
 * @Date: 2021/7/8
 -->
<template>
  <el-row :gutter="20">
    <el-col
      :span="8"
      :xs="24"
      :sm="12"
      :lg="8"
      :xl="6"
    >
      <settings-inspect
        :id="id"
        @showSetting="showSetting"
      />
      <server-setting />
    </el-col>
    <el-col
      :span="8"
      :xs="24"
      :sm="12"
      :lg="8"
      :xl="6"
    >
      <cpu-usage :id="id" />
    </el-col>
    <el-col
      :span="8"
      :xs="24"
      :sm="12"
      :lg="8"
      :xl="6"
    >
      <memory-usage :id="id" />
    </el-col>
    <el-col
      :span="8"
      :xs="24"
      :sm="12"
      :lg="8"
      :xl="6"
    >
      <file-io :id="id" />
    </el-col>
    <el-col
      :span="8"
      :xs="24"
      :sm="12"
      :lg="8"
      :xl="6"
    >
      <network-io :id="id" />
    </el-col>
    <el-col
      :span="8"
      :xs="24"
      :sm="12"
      :lg="8"
      :xl="6"
    >
      <online-number :id="id" />
    </el-col>
    <el-col
      :span="8"
      :xs="24"
      :sm="12"
      :lg="8"
      :xl="6"
    >
      <tps :id="id" />
    </el-col>
  </el-row>
</template>

<script>
import SettingsInspect from '@/components/server/info/SettingsInspect.vue'
import CpuUsage from '@/components/server/info/chart/CpuUsage.vue'
import FileIo from '@/components/server/info/chart/FileIo.vue'
import NetworkIo from '@/components/server/info/chart/NetworkIo'
import OnlineNumber from '@/components/server/info/chart/OnlineNumber'
import Tps from '@/components/server/info/chart/Tps.vue'
import MemoryUsage from '@/components/server/info/chart/MemoryUsage'
import ServerSetting from '@/views/ServerSetting'

export default {
    name: 'Info',
    components: {
        MemoryUsage,
        NetworkIo,
        SettingsInspect,
        CpuUsage,
        FileIo,
        OnlineNumber,
        Tps,
        ServerSetting
    },
    computed: {
        id() {
            return this.$store.state.currentServer.id
        }
    },
    methods: {
        showSetting() {
            this.$store.commit('changeServerSetting', true)
        },
    }
}
</script>

<style scoped>

.el-col {
  padding: 10px;
}

</style>
