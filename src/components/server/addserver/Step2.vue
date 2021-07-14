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
        label-position="right"
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
          <el-input v-model="dockerData.serverPosition" />
        </el-form-item>
        <el-form-item
          label="启动命令"
          class="input-style"
          prop="startCommand"
        >
          <el-input v-model="dockerData.startCommand" />
        </el-form-item>
        <el-form-item
          label="端口映射"
          class="input-style"
        >
          <el-space
            spacer=":"
            style="width: 100%"
          >
            <el-input
              v-model="dockerData.hostPort"
              placeholder="主机端口"
            />
            <el-input
              v-model="dockerData.containerPort"
              placeholder="容器端口"
            />
          </el-space>
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
        dockerImageList: Array
    },
    data() {
        return {
            dockerData: {
                selectedDocker: '',
                serverPosition: '',
                startCommand: '',
                hostPort: '25565',
                containerPort: '25565'
            },
            rules: {
                selectedDocker: [{ required: true, message: '请选择docker容器', trigger: 'change' }],
                serverPosition: [{required: true, message: '请输入服务器位置', trigger: 'blur'}],
                startCommand: [{required: true, message: '请输入启动命令', trigger: 'blur'}]
            }
        }
    },
    watch: {
        clearData: function () {
            this.dockerData.selectedDocker = '',
            this.dockerData.serverPosition = '',
            this.dockerData.startCommand = '',
            this.dockerData.hostPort = '25565',
            this.dockerData.containerPort = '25565'
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
</style>
