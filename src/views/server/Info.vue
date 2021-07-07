<template>
  <el-row :gutter="20">
    <el-col :span="8" :xs="24" :sm="12" :lg="8" :xl="6">
      <settings-inspect :id="id"></settings-inspect>
    </el-col>
  </el-row>
</template>

<script>
import SettingsInspect from '@/components/server/info/SettingsInspect.vue'

export default {
    name: 'Info',
    components: {
        SettingsInspect
    },
    props: ['id'],
}
</script>

<style scoped>

.el-col {
  padding: 10px;
}

</style>