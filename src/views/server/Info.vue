<template>
  <el-row :gutter="20">
    <el-col :span="8" :xs="24" :sm="12" :lg="8" :xl="6">
      <settings-inspect :id="id"></settings-inspect>
    </el-col>
    <el-col :span="8" :xs="24" :sm="12" :lg="8" :xl="6">
      <cpu-usage :id="id"></cpu-usage>
    </el-col>
    <el-col :span="8" :xs="24" :sm="12" :lg="8" :xl="6">
      <file-io :id="id"></file-io>
    </el-col>
    <el-col :span="8" :xs="24" :sm="12" :lg="8" :xl="6">
      <network-io :id="id"></network-io>
    </el-col>
    <el-col :span="8" :xs="24" :sm="12" :lg="8" :xl="6">
      <online-number :id="id"></online-number>
    </el-col>
    <el-col :span="8" :xs="24" :sm="12" :lg="8" :xl="6">
      <tps :id="id"></tps>
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

export default {
    name: 'Info',
    components: {
        NetworkIo,
        SettingsInspect,
        CpuUsage,
        FileIo,
        OnlineNumber,
        Tps
    },
    props: ['id'],
}
</script>

<style scoped>

.el-col {
  padding: 10px;
}

</style>