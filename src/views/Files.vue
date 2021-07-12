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
        <div class="blank" />
        <div class="operation-button">
          <transition name="el-zoom-in-center">
            <div v-show="showSearch">
              <el-input
                v-model="searchInfo"
                clearable
                @keyup.enter="searchFile"
              />
            </div>
          </transition>
            &nbsp; &nbsp;
          <el-button 
            icon="el-icon-search" 
            circle
            @click="showSearch = !showSearch"
          />
          <el-popover 
            placement="bottom"
            :width="100"
            trigger="click"
          >
            <template #reference>
              <el-button 
                type="primary" 
                icon="el-icon-plus"
                circle
              />
            </template>
            <el-space
              direction="vertical"
              class="operations"
            >
              <el-link 
                :underline="false"
                href="javascript:void(0);"
              >
                复制
              </el-link>
              <el-link
                :underline="false"
                href="javascript:void(0);"
              >
                粘贴
              </el-link>
            </el-space>
          </el-popover>
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
            showSearch: false,
            searchInfo: ''
        }
    },
    methods: {
        refresh() {
            this.fileList = file.getFiles(this.$route.params.filePath).files
        },
        searchFile() {
            console.log('search...')
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

.operations{
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.operation-button{
    display: flex;
    flex-direction: row;
}
</style>