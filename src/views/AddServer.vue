<template>
    <div class="add">
        <el-dialog title="添加服务器" v-model="dialogAdd" @open="openDialog" @close="closeDialog">
            <div class="dialog-content">
                <el-steps :active="active" finish-status="success" class="step-list-container">
                    <el-step title="步骤1" icon="el-icon-edit"></el-step>
                    <el-step title="步骤2" icon="el-icon-download"></el-step>
                    <el-step title="步骤3" icon="el-icon-upload"></el-step>
                </el-steps>

                <div class="step-one step-container" v-show="active === 0">
                    <step1 :clear-data="dialogAdd"
                           @next="next" @back="back" @sendData="receiveData1"></step1>
                </div>
                <div class="step-two step-container" v-show="active === 1">
                    <step2 :clear-data="dialogAdd"
                           :docker-image-list="dockerImageList"
                           @back="back" @submit="submit" @sendData="receiveData2"></step2>
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
            loading: false,
            serverData: Object,
            dockerData: Object,
            completeData: {},
            dockerImageList: [],
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
            }
            setTimeout(() => {
                this.active++
            }, 100)
        },
        async waitCreate() {
            await api.server.create(this.completeData)
            this.loading = false
        },
        submit() {
            this.next()
        },
        close() {
            this.$store.commit('changeAddState', false)
        },

        receiveData1(data) {
            this.serverData = data
            console.log(data)
        },
        receiveData2(data) {
            this.dockerData = data
            console.log(data)
            this.completeData = Object.assign(this.completeData, this.serverData)
            this.completeData = Object.assign(this.completeData, this.dockerData)
            console.log(this.completeData)
            this.waitCreate()
        },


        async openDialog() {
            const images = await api.setting.images()
            const result = []
            for(const image of images) {
                const s = await api.setting.imageStatus(image.id)
                if(s.status === 'Downloaded') {
                    result.push({
                        id: image.id,
                        name: image.name,
                    })
                }
            }
            this.dockerImageList = result
        },

        closeDialog() {
            setTimeout(() => {
                this.active = 0
                this.clearData = true
            }, 200)
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
    flex: 1 1 0;
    margin-top: 1cm;
    margin-left: 1.5cm;
    margin-right: 1.5cm;
}

.step-container .empty {
    flex: 1 1 0;
}

.step-list-container {
    margin-left: 1.5cm;
    margin-right: 1.5cm;
}


</style>
