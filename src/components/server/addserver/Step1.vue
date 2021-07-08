<template>
    <div class="step1">
        <el-form v-model="serverData">
            <el-form-item label="服务器名称">
                <el-input v-model="serverData.name"></el-input>
            </el-form-item>
            <el-form-item label="服务器缩写">
                <el-input v-model="serverData.shortName"></el-input>
            </el-form-item>
            <el-form-item label="服务器管理员">
                <el-space wrap>
                    <el-check-tag v-for="(manager,index) in serverData.managerList" :key="index"
                                  :checked="selectedManager[index] === true"
                                  @change="onChange(index, $event)">
                        管理员{{ index + 1 }}
                    </el-check-tag>
                </el-space>
            </el-form-item>
        </el-form>
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
            this.selectedManager = []
        }
    },
    data() {
        return {
            serverData: {
                name: '',
                shortName: '',
                managerList: ['1','2','3']
            },
            selectedManager: []
        }
    },
    methods: {
        onChange(index,checked) {
            this.selectedManager[index] = checked
            // console.log(this.selectedManager)
        }
    }
}
</script>

<style scoped>


</style>