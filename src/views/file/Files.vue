<!--
 * @Author: smq
 * @Date: 2021/7/11
 -->
<template>
  <div class="files">
    <el-card
      shadow="never"
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

          @file-open="$refs.editor.open($event)"
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
    <file-editor ref="editor" />
  </div>
</template>

<script>
import FileList from '@/views/file/FileList.vue'
import * as file from '@/api/file.ts'
import {DateTime} from 'luxon'
import {mapState} from 'vuex'
import FileEditor from '@/views/FileEditor'

export default {
    name: 'Files',
    components: {FileEditor, FileList},

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
            this.$store.commit('file/copyFile', this.getSelectedFile())
        })
        this.$bus.on('cut-file', () => {
            this.$store.commit('file/cutFile', this.getSelectedFile())
        })
        this.$bus.on('parse-file', async () => {
            const select = this.$store.state.file.selectedFileList
            const path = this.$route.params.filePaths
            const isCopy = this.$store.state.file.isCopy
            if (isCopy) {
                const duplicate = await file.copyCheck(select, path)
                if (duplicate > 0) {
                    try {
                        await this.$confirm(`粘贴的目标有${duplicate}个重复文件，确认覆盖？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        })

                        await file.copyAndParseFiles(select, path)
                        // eslint-disable-next-line no-empty
                    } catch (e) {
                    }
                } else {
                    await file.copyAndParseFiles(select, path)
                }
            } else {
                await file.cutAndParseFiles(select, path)
            }
            await this.refresh()
        })
        this.$bus.on('delete-file', async () => {
            try {
                await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                await file.deleteFiles(this.getSelectedFile())
                await this.refresh()
                // eslint-disable-next-line no-empty
            } catch (e) {
            }
        })

        this.$bus.on('rename-file', async () => {
            const selected = this.getSelectedFile()
            if (selected.length > 1) {
                this.$message({
                    message: '一次只能重命名一个文件',
                    type: 'error'
                })
                return
            }
            if (selected.length <= 0) {
                this.$message({
                    message: '无法重命名：未选择任何文件',
                    type: 'error'
                })
                return
            }
            const currentFile = selected[0]
            const newName = await this.$prompt('请输入新的文件名', '重命名', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: currentFile.fileName,
                inputPattern: /^[^\\\\/:*?"<>|]+$/,
                inputErrorMessage: '文件名含有非法字符'
            })
            await file.renameFile(currentFile.filePath, newName.value)
            await this.refresh()
        })
        this.$bus.on('refresh-file', async () => {
            await this.refresh()
        })

        this.$bus.on('compress-file', async () => {
            await file.compressFiles(this.getSelectedFile())
            await this.refresh()
            //TODO: 进度条
        })

        this.$bus.on('rename-file', async () => {
            const selected = this.getSelectedFile()
            if (selected.length > 1) {
                this.$message({
                    message: '一次只能解压缩一个文件',
                    type: 'error'
                })
                return
            }
            if (selected.length <= 0) {
                this.$message({
                    message: '无法解压缩：未选择任何文件',
                    type: 'error'
                })
                return
            }
            const currentFile = selected[0]
            await file.uncompressFile(currentFile.filePath)
            //TODO: 进度条
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
        async newDirectory() {
            const folder = await this.$prompt('请输入文件夹名字', '新建文件夹', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[^\\\\/:*?"<>|]+$/,
                inputErrorMessage: '文件夹名含有非法字符'
            })

            await file.createFolder(folder.value, this.$route.params.filePaths)
            await this.refresh()
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
