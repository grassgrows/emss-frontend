<template>
    <div class="add">
        <el-dialog title="添加服务器" v-model="dialogAdd" @close="closeDialog">
            <div class="dialog-content">
                <el-steps :active="active" finish-status="success">
                    <el-step title="步骤1" icon="el-icon-edit"></el-step>
                    <el-step title="步骤2" icon="el-icon-upload"></el-step>
                </el-steps>

                <div class="step-one step-container" v-show="active === 0">
                    <step1 :clear-data="dialogAdd"></step1>
                    <div class="empty"></div>
                    <div class="button-group" style="text-align: center">
                        <el-button type="primary" @click="back">上一步</el-button>
                        <el-button type="primary" @click="next">下一步</el-button>
                    </div>
                </div>
                <div class="step-two step-container" v-show="active === 1">
                    <step2 :clear-data="dialogAdd"></step2>
                    <div class="empty"></div>
                    <div class="button-group" style="text-align: center">
                        <el-button type="primary" @click="back">上一步</el-button>
                        <el-button name="submit" type="primary" @click="submit">完成</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Step1 from '@/components/server/addserver/Step1'
import Step2 from '@/components/server/addserver/Step2'
export default {
    name: 'AddServer',
    components: {
        Step1,
        Step2
    },
    props: {

    },
    data() {
        return {
            active: 0,
        }
    },
    computed: {
        dialogAdd: {
            get() {
                return this.$store.state.addState
            },
            set(newVal) {
                this.$store.commit('changeAddState', newVal)
            }
        }
    },
    methods: {
        back() {
            if(this.active <= 0){
                alert('已经是第一步')
                return
            }
            this.active--
        },
        next() {
            if(this.active >= 1){
                alert('已经是最后一步')
                return
            }
            this.active++
        },
        submit() {
            this.$store.commit('changeAddState', false)
        },
        closeDialog() {
            this.active = 0, 
            this.clearData = true
        }
    }
}
</script>

<style scoped>
.dialog-content{
    height: 70vh;
    overflow: auto;
    display: flex;
    flex-direction: column;
}

button[name='submit']{
    width: 84px;
}

.step-container {
    display: flex;
    flex-direction: column;
    /*justify-content: space-between;*/
    flex: 1 1 0;

}

.step-container .empty {
    flex: 1 1 0;
}


</style>