<template>
  <el-dropdown-menu>
    <el-dropdown-item
      icon="el-icon-document-copy"
      @click="$bus.emit('copy-file')"
    >
      复制
    </el-dropdown-item>
    <el-dropdown-item
      icon="el-icon-scissors"
      @click="$bus.emit('cut-file')"
    >
      剪切
    </el-dropdown-item>
    <el-dropdown-item
      :disabled="!canParse"
      icon="el-icon-document-add"
      @click="$bus.emit('parse-file')"
    >
      粘贴
    </el-dropdown-item>
    <el-dropdown-item
      icon="el-icon-edit"
      @click="$bus.emit('rename-file')"
    >
      重命名
    </el-dropdown-item>
    <el-dropdown-item
      icon="el-icon-delete"
      @click="$bus.emit('delete-file')"
    >
      删除
    </el-dropdown-item>

    <el-dropdown-item
      icon="el-icon-refresh"
      @click="$bus.emit('refresh-file')"
    >
      刷新
    </el-dropdown-item>
  </el-dropdown-menu>
</template>

<script>
export default {
    name: 'FileMenu',
    computed: {
        canParse() {
            return this.$store.state.file.selectedFileList.length > 0
        }
    }
}
</script>

<style scoped>

</style>
