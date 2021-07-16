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
        <div class="select">
          <el-dropdown
            trigger="click"
            @command="handleSelect"
          >
            <span class="el-dropdown-link">
              {{ `按${selectedType}排序` }}<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <template
                  v-for="item in selectTypesValue"
                  :key="item"
                >
                  <el-dropdown-item
                    v-if="item.name === selectedType"
                    icon="el-icon-check"
                    :command="item"
                  >
                    {{ item.name }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-else
                    :command="item"
                    icon="el-icon-check"
                    class="hidden-icon"
                  >
                    {{ item.name }}
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        &nbsp; &nbsp;
        <div class="ascend">
          <el-switch
            v-model="isAscend"
            active-text="升序"
            inactive-text="降序"
          />
        </div>
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
            trigger="focus"
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
                icon="el-icon-document-copy"
                @click="copyFile"
              >
                复制
              </el-link>
              <el-link
                :underline="false"
                href="javascript:void(0);"
                icon="el-icon-scissors"
                @click="cutFile"
              >
                剪切
              </el-link>
              <el-link
                :underline="false"
                href="javascript:void(0);"
                icon="el-icon-document-add"
                @click="parseFile"
              >
                粘贴
              </el-link>
              <el-link
                :underline="false"
                href="javascript:void(0);"
                icon="el-icon-delete"
                @click="deleteFile"
              >
                删除
              </el-link>
            </el-space>
          </el-popover>
        </div>
      </div>
      <div
        class="card-body"
        @drop.prevent="onDrop"
      >
        <file-list
          v-loading="loading"
          :files="displayFiles"
          :selected="selectedFiles"
        />
      </div>
      <div class="card-rooter">
        <div class="button-group">
          <el-button
            id="browseButton"
            type="text"
            icon="el-icon-upload"
            @click="uploadFile"
          >
            上传文件
          </el-button>
          <el-button
            type="text"
            icon="el-icon-folder-add"
            @click="newDirectory"
          >
            新建文件夹
          </el-button>
        </div>
        <div class="blank" />
      </div>
    </el-card>
  </div>
</template>

<script>
import FileList from '@/views/file/FileList.vue'
import * as file from '@/api/file.ts'

export default {
    name: 'Files',
    components: {FileList},

    beforeRouteEnter(to, from, next) {
        next((vm) => vm.refresh())
    },
    beforeRouteUpdate(to) {
        this.refresh(to.params.filePaths)
    },
    data() {
        return {
            files: [],
            searchInfo: '',
            showSearch: false,
            selectedType: '文件名',
            selectTypesValue: [
                {
                    name: '文件名',
                    key: 'filename',
                },
                {
                    name: '修改时间',
                    key: 'time',
                },
                {
                    name: '文件大小',
                    key: 'size',
                },
            ],
            selectedFiles: new Map(),
            loading: false,
            isAscend: true,
        }
    },
    mounted() {
        this.$bus.on('refresh-file', ()=>{
            this.refresh()
        })
    },
    computed: {
        displayFiles() {
            let array1 = this.files.filter((it) => it.isDirectory)
            let array2 = this.files.filter((it) => !it.isDirectory)
            let result
            if (this.selectedType === '文件名') {
                array1 = array1.sort((a, b) => a.fileName.localeCompare(b.fileName))
                array2 = array2.sort((a, b) => a.fileName.localeCompare(b.fileName))
                result = array1.concat(array2)
            } else if (this.selectedType === '修改时间') {
                array1 = array1.sort((a, b) => {
                    return a.lastModified - b.lastModified
                })
                array2 = array2.sort((a, b) => {
                    return a.lastModified - b.lastModified
                })
                result = array1.concat(array2)
            } else {
                array1 = array1.sort((a, b) => a.fileName.localeCompare(b.fileName))
                array2 = array2.sort((a, b) => {
                    return a.size - b.size
                })
                result = array1.concat(array2)
            }

            if (!this.isAscend) {
                result.reverse()
            }
            return result
        },
    },
    methods: {
        async refresh(filePaths) {
            const paths = typeof filePaths === 'undefined' ? this.$route.params.filePaths : filePaths
            this.loading = true
            this.files = await file.getFiles(paths)
            this.loading = false
            this.selectedFiles.clear()

        },
        searchFile() {
            // console.log('searching...')
            this.$router.push({name: 'file_search'})
        },
        handleSelect(item) {
            // console.log(item.name)
            this.selectedType = item.name
        },
        copyFile() {
            const select = this.files.filter((it) => this.selectedFiles.get(it.fileName) === true)
            this.$store.commit('copyFile',select)
        },
        cutFile() {
            const select = this.files.filter((it) => this.selectedFiles.get(it.fileName) === true)
            this.$store.commit('cutFile',select)
        },
        async parseFile() {
            const select = this.$store.state.selectedFiles
            const path = this.$route.params.filePaths
            const isCopy = this.$route.state.isCopy
            if(isCopy){
                await file.copyAndParseFiles(select, path)
            } else {
                await file.cutAndParseFiles(select, path)
            }
            await this.refresh()
        },
        async deleteFile() {
            const select = this.files.filter((it) => this.selectedFiles.get(it.fileName) === true)
            await file.deleteFiles(select)
            await this.refresh()
        },
        uploadFile() {
            this.$bus.emit('show-browse')
        },
        onDrop(event) {
            this.$bus.emit('add-upload-drop', event)
        },
        newDirectory() {

        }
    },
}
</script>

<style
    scoped
    lang="less"
>
.card {
  margin: 10px 0 20px;
}

.card-header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-bottom: 5vh;

  .select, .ascend {
    display: flex;
    align-items: center;
  }
}

.card-rooter {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.operations {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.operation-button {
  display: flex;
  flex-direction: row;
}
</style>

<style>
.hidden-icon > i {
    color: #00000000
}
</style>
