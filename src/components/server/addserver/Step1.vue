<!--
 * @Author: smq
 * @Date: 2021/7/9
 -->
<template>
  <div class="step1">
    <div>
      <el-form
        ref="form"
        :model="serverData"
        label-width="100px"
        label-position="right"
        :rules="rules"
        status-icon
      >
        <el-form-item
          label="服务器名称"
          class="input-style"
          prop="name"
        >
          <el-input v-model="serverData.name" />
        </el-form-item>
        <el-form-item
          label="服务器别名"
          class="input-style"
        >
          <el-input v-model="serverData.anotherName" />
        </el-form-item>
        <el-form-item
          label="服务器缩写"
          class="input-style"
          prop="shortName"
        >
          <el-input v-model="serverData.shortName" />
        </el-form-item>
        <el-form-item label="服务器管理员">
          <el-space wrap>
            <el-check-tag
              v-for="(manager,index) in managerList"
              :key="index"
              :checked="serverData.selectedManager[index] === true"
              @change="onChange(index, $event)"
            >
              管理员{{ index + 1 }}
            </el-check-tag>
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
        type="primary"
        @click="validAndSendData"
      >
        下一步
      </el-button>
    </div>
  </div>
</template>

<script>

export default {
    name: 'Step1',
    props: {
        clearData: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            serverData: {
                name: '',
                shortName: '',
                anotherName: '',
                selectedManager: []
            },
            managerList: ['1','2','3'],
            rules: {
                name: [{required: true, message: '请输入服务器名称', trigger: 'blur'}],
                shortName: [{required: true, message: '请输入服务器名称', trigger: 'blur'},
                    {pattern: /^[a-z_0-9]+$/, message: '只允许由小写字母、下划线、数字组成', trigger: 'blur'}
                ],
            }
        }
    },
    watch: {
        clearData: function () {
            this.serverData.name = '',
            this.serverData.shortName = '',
            this.serverData.anotherName = '',
            this.serverData.selectedManager = []
            this.$refs['form'].resetFields()
        }
    },
    methods: {
        onChange(index,checked) {
            this.serverData.selectedManager[index] = checked
            // console.log(this.selectedManager)
        },
        validAndSendData() {
            this.$refs['form'].validate((valid) => {
                if(valid) {
                    this.$emit('sendData',this.serverData)
                    this.$emit('next')
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style scoped>
.input-style{
    width: 90%;
}

.step1{
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
}

.step1 .empty {
    flex: 1 1 0;
}

</style>