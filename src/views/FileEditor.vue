<!--
 * @Author: Neko-pararo, WarmthDawn
 * @Date: 2021/7/17
 -->

<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :close-on-click-modal="!editing"
    :before-close="handleClose"
    custom-class="file-editor-dialog"
  >

    <div
      v-loading="loading"
      class="outer"
    >
      <div class="input-container">

        <div
          v-if="!supported"
          class="empty"
        >
          <el-empty description="暂不支持当前文件的预览"></el-empty>
        </div>
        <ace-input
          v-else
          ref="editor"
          :read-only="!editing"
          class="textarea"
          @keydown="keyDown"
        />

        <div class="toolbox">
          <div
            v-if="editing"
            class="button-save"
          >
            <el-button
              icon="el-icon-check"
              circle
              @click="save"
            />
          </div>
          <div
            v-else
            class="button-edit"
          >
            <el-popover
              v-model:visible="showTooltip"
              trigger="manual"
              title="编辑提示"
              placement="left"
            >
              <p>点这里开始编辑哦~</p>
              <template #reference>
                <el-button
                  icon="el-icon-edit"
                  circle
                  @click="edit"
                />
              </template>
            </el-popover>
          </div>
          <div class="button-download">
            <el-button
              icon="el-icon-download"
              circle
              @click="download"
            />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import * as file from '@/api/file'
import AceInput from '@/components/common/AceInput'
import {nextTick} from 'vue'

export default {
    components: {AceInput},
    data() {
        return {
            value: '',
            visible: false,
            editing: false,
            loading: false,
            fileInfo: {
                fileName: '',
                size: 0,
            },
            supported: true,
            path: '',
            currentPage: -1,

            showTooltip: false,
        }
    },
    computed: {
        title() {
            if (this.editing) {
                return `${this.fileInfo.fileName} [编辑模式]`
            }
            return this.fileInfo.fileName
        }
    },
    mounted() {
    },
    methods: {
        handleClose(done) {
            this.showTooltip = false
            if (!this.editing) {
                done()
                return
            }
            this.$confirm('您正在编辑状态，可能有未保存的内容，是否退出？')
                .then(() => {
                    done()
                })
                .catch(() => {
                })
        },
        async edit() {
            if (this.fileInfo.size > 1024 * 1024) {
                this.$notify({
                    title: '无法编辑',
                    message: '仅可编辑1M以内的文件',
                    type: 'warning'
                })
                return
            }
            if (!this.supported) {
                this.$notify({
                    title: '无法编辑',
                    message: '不支持当前的文件类型',
                    type: 'warning'
                })
                return
            }
            this.editing = true
        },
        async save() {
            await file.saveFile(this.path, this.value)
            this.editing = false
            this.$message({
                message: '文件保存成功',
                type: 'success'
            })
            await this.open({path: this.path, file: this.fileInfo})
        },
        download() {
            window.open(`/api/file/download?path=${encodeURIComponent(this.path)}&token=${this.$store.state.authToken}`)
        },
        keyDown() {
            if (!this.editing && !this.showTooltip) {
                this.showTooltip = true
                this.$message({
                    message: '请先进入编辑模式再编辑文件（右下角好像有什么东西耶）',
                    type: 'warning'
                })
                setTimeout(() => {
                    this.showTooltip = false
                }, 3000)
            }
        },
        async open({path, file: fileInfo}) {
            this.path = path
            this.fileInfo = fileInfo
            this.visible = true
            this.editing = false
            this.loading = true
            this.supported = true
            this.currentPage = -1


            if (this.fileInfo.size >= 1024 * 1024) {
                //TODO: 大文件分页预览
                this.currentPage = 0
            }
            try {
                this.value = await file.previewFile(path, this.currentPage)
                if (this.value.includes('\0')) {
                    this.supported = false
                } else {
                    await nextTick()
                    this.$refs.editor.setValue(this.value)
                }
            } catch (e) {
                this.supported = false
            }
            this.loading = false
        }
    }
}
</script>
<style lang="less">


.file-editor-dialog {
  .el-dialog__body {
    padding: 0;
  }

  width: 85% !important;
  margin: 2vh auto !important;

  @media screen and (max-width: 728px) {
    margin: 8vh auto !important;
    width: 95% !important;
  }
}


</style>
<style
  scoped
  lang="less"
>
.input-container {
  position: relative;
  height: 100%;
}

.textarea {
  width: 100%;
  height: 100%;
}

.outer {
  height: 85vh;
}


.toolbox {
  position: absolute;
  right: 25px;
  bottom: 25px;
  display: flex;
  flex-direction: column;

  div[class^=button-] {
    margin: 5px 0;
  }

}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.button-edit {
  right: 0;

}
</style>
