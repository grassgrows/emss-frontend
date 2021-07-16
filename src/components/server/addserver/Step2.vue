<!--
 * @Author: smq
 * @Date: 2021/7/9
 -->
<template>
  <div class="step2">
    <div>
      <el-form
        ref="form"
        class="form"
        :model="dockerData"
        label-width="100px"
        label-position="left"
        :rules="rules"
        status-icon
      >
        <el-form-item
          label="Docker镜像"
          class="input-style"
          prop="selectedDocker"
        >
          <el-select
            v-model="dockerData.selectedDocker"
            placeholder="请选择..."
            style="width: 100%;"
            no-data-text="无可用docker镜像，请去设置中下载"
          >
            <el-option
              v-for="docker in dockerImageList"
              :key="docker.id"
              :label="docker.name"
              :value="docker.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="服务器位置"
          class="input-style"
          prop="serverPosition"
        >
          <el-input v-model="dockerData.serverPosition">
            <template #prepend>
              /root/
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="启动命令"
          class="input-style"
          prop="startCommand"
        >
          <el-input v-model="dockerData.startCommand" />
        </el-form-item>
        <el-form-item 
          label="工作目录" 
          class="input-style" 
          prop="workingDir"
        >
          <el-input v-model="dockerData.workingDir" />
        </el-form-item>
        <el-form-item
          label="端口映射"
          class="input-style"
          prop="portBindings"
        >
          <div
            v-for="(item, index) in dockerData.portBindings"
            :key="item"
            class="port-container"
          >
            <el-space
              v-if="index === 0"
              spacer=":"
              style="width: 100%"
            >
              <el-input
                v-model="item.hostPort"
                placeholder="主机端口"
              />
              <el-input
                v-model="item.containerPort"
                placeholder="容器端口"
              />
            </el-space>
            <el-button
              v-if="index === 0"
              @click="addPortBinding"
            >
              添加
            </el-button>
            <el-space
              v-else
              spacer=":"
              style="width: 100%"
            >
              <el-input
                v-model="item.hostPort"
                placeholder="主机端口"
              />
              <el-input
                v-model="item.containerPort"
                placeholder="容器端口"
              />
            </el-space>
            <el-button
              v-if="index !== 0"
              @click="removePortBinding(index)"
            >
              删除
            </el-button>
          </div>
        </el-form-item>
        <el-form-item 
          label="目录映射" 
          class="input-style" 
          prop="volumeBind"
        >
          <div 
            v-for="(item, index) in dockerData.volumeBind"
            :key="item"
            class="port-container"
          >
            <el-space
              v-if="index === 0"
              spacer=":"
              style="width: 100%"
            >
              <el-input
                v-model="item.hostVolume"
                placeholder="主机目录"
              />
              <el-input
                v-model="item.containerVolume"
                placeholder="容器目录"
              />
            </el-space>
            <el-button
              v-if="index === 0"
              @click="addVolumeBinding"
            >
              添加
            </el-button>
            <el-button
              v-else
              @click="removeVolumeBinding(index)"
            >
              删除
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="empty" />
    <div
      class="button-group"
      style="text-align: center"
    >
      <el-button
        type="primary"
        @click="$emit('back')"
      >
        上一步
      </el-button>
      <el-button
        name="submit"
        type="primary"
        @click="validAndSendData"
      >
        完成
      </el-button>
    </div>
  </div>
</template>

<script>

export default {
    name: 'Step2',
    props: {
        clearData: {
            type: Boolean,
            default: false,
        },
        abbr: String,
        dockerImageList: Array
    },
    data() {
        return {
            dockerData: {
                selectedDocker: '',
                serverPosition: '',
                startCommand: '',
                workingDir: 'emss',
                portBindings: [{
                    hostPort: '25565',
                    containerPort: '25565'
                }],
                volumeBind: [{
                    hostVolume: '',
                    containerVolume: '/backup'
                }]
            },
            rules: {
                selectedDocker: [{ required: true, message: '请选择docker容器', trigger: 'change' }],
                serverPosition: [{required: true, message: '请输入服务器位置', trigger: 'blur'}],
                startCommand: [{required: true, message: '请输入启动命令', trigger: 'blur'}],
                workingDir: [{required: true, message: '请输入工作目录', trigger: 'blur'}],
                portBindings: [{required: true, message: '请输入端口映射', trigger: 'blur'}],
                volumeBind: [{required: true, message: '请输入目录映射', trigger: 'blur'}]
            }
        }
    },

    watch: {
        abbr(newVal){
            if(this.dockerData.serverPosition === '') {
                this.dockerData.serverPosition = newVal
            }
            if(this.dockerData.volumeBind.length > 0 &&
                this.dockerData.volumeBind[0].hostVolume === '') {
                this.dockerData.volumeBind[0].hostVolume = `/backup/${this.abbr}`
            }
        },
        clearData: function () {
            this.dockerData.selectedDocker = '',
            this.dockerData.serverPosition = '',
            this.dockerData.startCommand = '',
            this.dockerData.workingDir = 'emss',
            this.dockerData.portBindings = new Map(),
            this.dockerData.volumeBind = new Map(),
            this.$refs['form'].resetFields()
        }
    },
    methods: {
        validAndSendData() {
            this.$refs['form'].validate((valid) => {
                if(valid){
                    this.$emit('sendData',this.dockerData)
                    this.$emit('submit')
                }
            })
        },
        isListNull(callback) {
            if (callback) {
                if (this.dockerImageList.length === 0) {
                    this.$notify({
                        title: '警告',
                        message: '当前无可选docker容器',
                        type: 'warning',
                    })
                }
            }
        },
        addPortBinding() {
            this.dockerData.portBindings.push({
                hostPort: '',
                containerPort: ''
            })
        },
        removePortBinding(index) {
            this.dockerData.portBindings.splice(index, 1)
        },
        addVolumeBinding() {
            this.dockerData.volumeBind.push({
                hostVolume: '',
                containerVolume: ''
            })
        },
        removeVolumeBinding(index) {
            this.dockerData.volumeBind.splice(index, 1)
        }
    }
}
</script>

<style scoped>
.input-style {
    width: 90%;
}

.step2 {
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
}

.step2 .empty {
    flex: 1 1 0;
}

button[name='submit'] {
    width: 84px;
}

/deep/ .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
  width: 0px;
  margin-left: -11px;
}

.port-container {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
}
</style>
