<template>
    <div class="add">
        <el-dialog title="添加服务器" v-model="dialogAdd" @close="closeDialog">
            <div class="dialog-content">
                <el-steps :active="active" finish-status="success" class="step-list-container">
                    <el-step title="步骤1" icon="el-icon-edit"></el-step>
                    <el-step title="步骤2" icon="el-icon-upload"></el-step>
                    <el-step title="步骤3" icon="el-icon-success"></el-step>
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
                <div class="step-three step-container" v-show="active === 2">
                    <step3 v-loading="loading"></step3>
                    <div class="empty"></div>
                    <div v-if="!loading" style="text-align: center">
                        <el-button name="submit" type="primary"
                                   @click="close">完成
                        </el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Step1 from '@/components/server/addserver/Step1'
import Step2 from '@/components/server/addserver/Step2'
import Step3 from '@/components/server/addserver/Step3'
import api from '@/api'

export default {
    name: 'AddServer',
    components: {
        Step1,
        Step2,
        Step3
    },
    props: {},
    data() {
        return {
            active: 0,
            loading: false
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
            if (this.active <= 0) {
                alert('已经是第一步')
                return
            }
            this.active--
        },
        next() {
            if (this.active === 1) {  // 进入step3
                this.loading = true
                this.waitCreate()
            }
            setTimeout(() => {
                this.active++
            }, 100)
        },
        async waitCreate() {
            await api.server.create()
            this.loading = false
        },
        submit() {
            this.next()
        },
        close() {
            this.$store.commit('changeAddState', false)
        },
        closeDialog() {
            this.active = 0
            this.clearData = true
        }
    }
}
</script>

<style scoped>
.dialog-content {
    height: 60vh;
    overflow: auto;
    display: flex;
    flex-direction: column;
}

button[name='submit'] {
    width: 84px;
}

.step-container {
    display: flex;
    flex-direction: column;
    /*justify-content: space-between;*/
    flex: 1 1 0;
    margin-top: 1cm;
    margin-left: 0.5cm;
    margin-right: 0.5cm;
}

.step-container .empty {
    flex: 1 1 0;
}

.step-list-container {
    margin-left: 1.5cm;
    margin-right: 1.5cm;
}


</style>