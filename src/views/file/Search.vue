<!--
 * @Author: WarmthDawn
 * @Date: 2021/7/11
 -->
<template>
  <div class="files">
    <el-card
      shadow="always"
      class="card"
    >
      <div v-if="$route.query.keyword === ''">
        <el-empty
          description="输入关键词来搜索"
        />
      </div>
      <div v-else>
        <file-list
          v-loading="loading"
          :files="displayFiles"
          :selected="selectedFiles"
          :empty-message="message"
          empty-desc="没有找到你想搜索的文件耶~"
        />
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
    name: 'Search',
    components: {FileList},

    beforeRouteEnter(to, from, next) {
        next((vm) => vm.refresh())
    },
    beforeRouteUpdate(to) {
        this.refresh(to.params.filePaths, to.query.keyword)
    },
    data() {
        return {
            files: [],
            message: '',
            selectedFiles: new Map(),
            loading: false,
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
            this.$message({
                type: 'error',
                message: '当前位置不支持粘贴',
            })
        })
        this.$bus.on('delete-file', async () => {
            await file.deleteFiles(this.getSelectedFile())
            await this.refresh()
        })

    },

    methods: {
        async refresh(filePaths, keywordIn) {
            const paths = typeof filePaths === 'undefined' ? this.$route.params.filePaths : filePaths
            const keyword = typeof keywordIn === 'undefined' ? this.$route.query.keyword : keywordIn
            if (typeof keyword === 'undefined') {
                return
            }
            this.loading = true
            const result = await file.searchFiles(paths, keyword)
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
