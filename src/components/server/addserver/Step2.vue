<template>
    <div class="step2">
       <el-form class="form" :model="dockerData" label-width="100px" label-position="left">
           <el-form-item label="Docker镜像" class="input-style">
               <el-select v-model="dockerData.selectedDocker" placeholder="请选择..." style="width: 100%;">
                   <el-option
                       v-for="docker in dockerList"
                       :key="docker"
                       :label="docker"
                       :value="docker"
                   ></el-option>
               </el-select>
           </el-form-item>
           <el-form-item label="服务器位置" class="input-style">
               <el-input v-model="dockerData.serverPosition"></el-input>
           </el-form-item>
           <el-form-item label="启动命令" class="input-style">
               <el-input v-model="dockerData.startCommand"></el-input>
           </el-form-item>
           <el-form-item label="端口映射" class="input-style">
               <el-space spacer=":" style="width: 100%">
                   <el-input placeholder="主机端口" v-model="dockerData.hostPort"></el-input>
                   <el-input placeholder="容器端口" v-model="dockerData.containerPort"></el-input>
               </el-space>
           </el-form-item>
       </el-form>
        <div class="empty"></div>
        <div class="button-group" style="text-align: center">
            <el-button type="primary" @click="$emit('back')">上一步</el-button>
            <el-button name="submit" type="primary" @click="$emit('submit')">完成</el-button>
        </div>
    </div>
</template>

<script>
import store from '@/store'

export default {
    name: 'Step2',
    props: {
        clearData: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        clearData: function () {
            this.selectedDocker = ''
        }
    },
    data() {
        return {
            dockerData: {
                selectedDocker: '',
                serverPosition: '',
                startCommand: '',
                hostPort: '',
                containerPort: ''
            },
            dockerList: ['docker1','docker2','docker3']
        }
    }
}
</script>

<style scoped>
.input-style{
    width: 90%;
}

.step2{
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
    margin-top: 1cm;
    margin-left: 1.5cm;
    margin-right: 1.5cm;
}

.step2 .empty {
    flex: 1 1 0;
}

button[name='submit'] {
    width: 84px;
}
</style>
