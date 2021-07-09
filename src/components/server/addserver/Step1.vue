<template>
    <div class="step1">
        <el-form v-model="serverData" label-width="100px" label-position="left">
            <el-form-item label="服务器名称" class="input-style">
                <el-input v-model="serverData.name"></el-input>
            </el-form-item>
            <el-form-item label="服务器别名" class="input-style">
                <el-input v-model="serverData.anotherName"></el-input>
            </el-form-item>
            <el-form-item label="服务器缩写" class="input-style">
                <el-input v-model="serverData.shortName"></el-input>
            </el-form-item>
            <el-form-item label="服务器管理员">
                <el-space wrap>
                    <el-check-tag v-for="(manager,index) in managerList" :key="index"
                                  :checked="serverData.selectedManager[index] === true"
                                  @change="onChange(index, $event)">
                        管理员{{ index + 1 }}
                    </el-check-tag>
                </el-space>
            </el-form-item>
        </el-form>
        <div class="empty"></div>
        <div class="button-group" style="text-align: center">
            <el-button type="primary" @click="$emit('back')">上一步</el-button>
            <el-button type="primary" @click="$emit('next')">下一步</el-button>
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
    watch: {
        clearData: function () {
            this.serverData.name = '',
            this.serverData.shortName = '',
            this.serverData.anotherName = '',
            this.serverData.selectedManager = []
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
            managerList: ['1','2','3']
        }
    },
    methods: {
        onChange(index,checked) {
            this.selectedManager[index] = checked
            // console.log(this.selectedManager)
        },
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
    margin-top: 1cm;
    margin-left: 1.5cm;
    margin-right: 1.5cm;
}

.step1 .empty {
    flex: 1 1 0;
}

</style>