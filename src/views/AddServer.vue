<!--
 * @Author: smq
 * @Date: 2021/7/9
 -->
<template>
  <div class="add">
    <el-dialog
      v-model="dialogAdd"
      custom-class="add-dialog"
      top="2vh"
      title="添加服务器"
      @open="openDialog"
      @close="closeDialog"
    >
      <div class="dialog-content">
        <el-steps
          :active="active"
          finish-status="success"
          class="step-list-container"
        >
          <el-step
            title="步骤1"
            icon="el-icon-edit"
          />
          <el-step
            title="步骤2"
            icon="el-icon-download"
          />
          <el-step
            title="步骤3"
            icon="el-icon-upload"
          />
        </el-steps>

        <div
          v-show="active === 0"
          class="step-one step-container"
        >
          <step1
            :clear-data="dialogAdd"
            @next="next"
            @back="back"
            @sendData="receiveData1"
          />
        </div>
        <div
          v-show="active === 1"
          class="step-two step-container"
        >
          <step2
            :clear-data="dialogAdd"
            :docker-image-list="dockerImageList"
            :abbr="abbr"
            @back="back"
            @submit="submit"
            @sendData="receiveData2"
          />
        </div>
        <div
          v-show="active === 2"
          class="step-three step-container"
        >
          <step3 v-loading="loading" />
          <div class="empty" />
          <div
            v-if="!loading"
            style="text-align: center"
          >
            <el-button
              name="submit"
              type="primary"
              @click="close"
            >
              完成
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
            abbr: ''
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
            await this.$store.dispatch('refreshServerList')
        },
        submit() {
            this.next()
        },
        close() {
            this.$store.commit('changeAddState', false)
        },

        receiveData1(data) {
            this.serverData = data
            this.abbr = data.shortName
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
            for (const image of images) {
                const s = await api.setting.imageStatus(image.id)
                if (s.status === 'Downloaded') {
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

<style scoped lang="less">
.dialog-content {
    height: 75vh;
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
    padding: 20px 6vh 0;
    @media screen and (max-width: 768px) {
        padding: 20px 0 0;
    }
    .empty {
        flex: 1 1 0;
    }
}


.step-list-container {
    padding: 0 6vh;
    @media screen and (max-width: 768px) {
        padding: 0 5px;
    }
}


</style>
<style lang="less">
.el-dialog.add-dialog {
    @media screen and (max-width: 768px) {
        width: auto !important;
        margin: 0 20px;
    }
}
</style>
