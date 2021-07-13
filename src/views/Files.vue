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
              >
                复制
              </el-link>
              <el-link
                :underline="false"
                href="javascript:void(0);"
                icon="el-icon-delete"
              >
                删除
              </el-link>
              <el-link
                :underline="false"
                href="javascript:void(0);"
                icon="el-icon-document-add"
              >
                粘贴
              </el-link>
            </el-space>
          </el-popover>
        </div>
      </div>
      <div class="card-body">
        <file-list :files="displayFiles" />
      </div>
    </el-card>
  </div>
</template>

<script>
import FileList from '@/views/file/FileList.vue'
import file from '@/api/file'
import { DateTime } from 'luxon'

export default {
    name: 'Files',
    components: { FileList },

    beforeRouteEnter(to, from, next) {
        next((vm) => vm.refresh())
    },
    beforeRouteUpdate() {
        this.refresh()
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
            isAscend: true,
        }
    },
    computed: {
        displayFiles() {
            let array1 = this.files.filter((it) => it.type === 'folder')
            let array2 = this.files.filter((it) => it.type === 'file')
            let result
            if (this.selectedType === '文件名') {
                array1 = array1.sort((a, b) => a.name.localeCompare(b.name))
                array2 = array2.filter((it) => it.type === 'file').sort((a, b) => a.name.localeCompare(b.name))
                result = array1.concat(array2)
            } else if (this.selectedType === '修改时间') {
                array1 = array1.sort((a, b) => {
                    const atime = DateTime.fromJSDate(a.editTime)
                    const btime = DateTime.fromJSDate(b.editTime)
                    if (atime > btime) return 1
                    if (atime < btime) return -1
                    return 0
                })
                array2 = array2.sort((a, b) => {
                    const atime = DateTime.fromJSDate(a.editTime)
                    const btime = DateTime.fromJSDate(b.editTime)
                    if (atime > btime) return 1
                    if (atime < btime) return -1
                    return 0
                })
                result = array1.concat(array2)
            } else {
                array1 = array1.sort((a, b) => a.name.localeCompare(b.name))
                array2 = array2.sort((a, b) => {
                    if (a.size > b.size) return -1
                    if (a.size < b.size) return 1
                    return 0
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
        refresh() {
            this.files = file.getFiles(this.$route.params.filePath).files
        },
        searchFile() {
            // console.log('searching...')
            this.$router.push({name:'file_search'})
        },
        handleSelect(item) {
            console.log(item.name)
            this.selectedType = item.name
        },
    },
}
</script>

<style scoped lang="less">
.card {
  margin: 10px 0 20px;
}

.card-header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-bottom: 5vh;
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

<style>
.hidden-icon> i{
  color: #00000000
}

</style>