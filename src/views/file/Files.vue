<!--
 * @Author: smq
 * @Date: 2021/7/11
 -->
<template>
  <div class="files">
    <el-card
      shadow="always"
      class="card"
      :class="dropping > 0 ? 'modal' : ''"
      @dragover.prevent
      @dragenter.prevent="dropping++"
      @dragleave.prevent="dropping--"
      @drop.prevent="onDrop"
    >
      <div class="card-body">
        <file-list
          v-loading="loading"
          :files="displayFiles"
          :selected="selectedFiles"
          :empty-message="message"
        />
      </div>
      <div class="card-rooter">
        <div class="button-group">
          <el-button
            type="text"
            icon="el-icon-upload"
            @click="uploadFile"
          >
            上传文件
          </el-button>
          <el-button
            type="text"
            icon="el-icon-upload"
            @click="uploadFolder"
          >
            上传文件夹
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
import {DateTime} from 'luxon'
import {mapState} from 'vuex'

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
            message: '',
            selectedFiles: new Map(),
            loading: false,
            dropping: 0,
        }
    },
    computed: {
        ...mapState({
            sortMethod: (state) => state.file.sortMethod,
            sortAscend: (state) => state.file.sortAscend,
        }),
        displayFiles() {
            let array1 = this.files.filter((it) => it.isDirectory)
            let array2 = this.files.filter((it) => !it.isDirectory)
            let result
            if (this.sortMethod === 'filename') {
                array1 = array1.sort((a, b) => a.fileName.localeCompare(b.fileName))
                array2 = array2.sort((a, b) => a.fileName.localeCompare(b.fileName))
                result = array1.concat(array2)
            } else if (this.sortMethod === 'time') {
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

            if (!this.sortAscend) {
                result.reverse()
            }
            return result
        },
    },
    mounted() {
        this.$bus.on('refresh-file', () => {
            this.refresh()
        })


        this.$bus.on('copy-file', () => {
            this.$store.commit('copyFile', this.getSelectedFile())
        })
        this.$bus.on('cut-file', () => {
            this.$store.commit('cutFile', this.getSelectedFile())
        })
        this.$bus.on('parse-file', async () => {
            const select = this.$store.state.selectedFileList
            const path = this.$route.params.filePaths
            const isCopy = this.$store.state.isCopy
            if (isCopy) {
                await file.copyAndParseFiles(select, path)
            } else {
                await file.cutAndParseFiles(select, path)
            }
            await this.refresh()
        })
        this.$bus.on('delete-file', async () => {
            await file.deleteFiles(this.getSelectedFile())
            await this.refresh()
        })

    },
    methods: {
        async refresh(filePaths) {
            const paths = typeof filePaths === 'undefined' ? this.$route.params.filePaths : filePaths
            this.loading = true
            const result = await file.getFiles(paths)
            this.message = ''
            if (result.code === '0000') {
                this.files = result.data.map((it) => {
                    it.lastModified = DateTime.fromISO(it.lastModified)
                    return it
                })
            } else {
                this.files = []
                this.message = result.msg
            }
            this.loading = false
            this.selectedFiles.clear()

        },
        getSelectedFile() {
            return this.files.filter((it) => this.selectedFiles.get(it.fileName) === true)
        },
        uploadFile() {
            this.$bus.emit('show-browse')
        },
        uploadFolder() {
            this.$bus.emit('show-browse-folder')
        },
        onDrop(event) {
            this.dropping = 0
            this.$bus.emit('add-upload-drop', event)
        },
        newDirectory() {
            this.$prompt('请输入文件夹名字', '新建文件夹', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[^\\\\/:*?"<>|]+$/,
                inputErrorMessage: '文件夹名含有非法字符'
            }).then(({value}) => {
                file.createFolder(value, this.$route.params.filePaths)
            })
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


.card-rooter {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.modal {
  position: relative;

  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    //opacity: 0.1;
    background-color: rgba(195, 236, 98, 0.2);
  }

  * {
    pointer-events: none;
  }
}

</style>

<style>
.hidden-icon > i {
    color: #00000000
}
</style>
