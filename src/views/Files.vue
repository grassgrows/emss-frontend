<!--
 * @Author: smq
 * @Date: 2021/7/11
 -->
<template>
  <div class="files">
    <el-card
      shadow="always"
      class="card"
    >
      <div class="card-header">
        <div class="search">
          <el-input v-model="searchName" clearable>
            <el-button icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="blank" />
        <div class="button-group">
          <el-button
            type="danger"
            size="medium"
          >
            删除
          </el-button>
        </div>
      </div>
      <div class="card-body">
        <file-list :files="fileList" />
      </div>
    </el-card>
  </div>
</template>

<script>
import file from '@/api/file'
import FileList from '@/views/file/FileList.vue'

export default {
    name: 'Files',
    components: {
        FileList
    },
    beforeRouteEnter(to, from, next){
        next((vm)=> vm.refresh())
    },
    beforeRouteUpdate() {
        this.refresh()
    },
    data() {
        return {
            fileList: [],
            searchName: ''
        }
    },
    methods: {
        refresh() {
            this.fileList = file.getFiles(this.$route.params.filePath).files
        }
    }
}
</script>

<style scoped>
.card {
  margin: 10px 0 20px;
}

.card-header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
}
</style>