<template>
  <common-info-card header="服务器设置" icon="el-icon-setting"
                    @click="$emit('click')">
    <el-descriptions border direction="vertical">
      <el-descriptions-item label="服务器Id">{{ id }}</el-descriptions-item>
      <el-descriptions-item label="服务器名称">{{ name }}</el-descriptions-item>
      <el-descriptions-item label="开放端口">{{ port }}</el-descriptions-item>
    </el-descriptions>
  </common-info-card>
</template>

<script>
import CommonInfoCard from '@/components/server/info/common/CommonInfoCard.vue'
import { mapState } from 'vuex'
import utils from '@/utils'

export default {
    name: 'SettingsInspect',
    components: { CommonInfoCard },
    computed: {
        ...mapState(['currentServer']),
        ...utils.mapData('currentServer', ['id', 'name', 'port', 'tps']),
    },
}
</script>

<style scoped>

</style>