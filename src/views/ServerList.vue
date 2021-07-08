<template>
  <el-row :gutter="20">
    <el-col :span="8" :xs="24" :sm="12"
            :md="8" :lg="6" :xl="4"

            v-for="s in displayList" :key="s.id">
      <server-list-card class="card" :server-data="s">
      </server-list-card>

    </el-col>
    <el-col :span="8" :xs="24" :sm="12"
            :md="8" :lg="6" :xl="4">
      <server-list-card
          class="card" add-card @add="showAdd">
      </server-list-card>
    </el-col>

    <add-server></add-server>

  </el-row>
</template>

<script>
import ServerListCard from '@/components/server/ServerListCard'
import { mapState } from 'vuex'
import AddServer from '@/views/AddServer'

export default {
    name: 'ServerList',
    components: {
        ServerListCard,
        AddServer
    },
    data() {
        return {

        }
    },
    mounted() {
        this.$store.commit('refreshServerList')
    },
    computed: {
        ...mapState(['serverList']),
        displayList() {
            const result = [...this.serverList]
            result.sort((a, b)=>{
                if(!a.running && b.running) return 1
                if(a.running && !b.running) return -1
                return 0
            })
            return result
        }
    },
    methods: {
        showAdd() {
            this.$store.commit('changeAddState',true)
        }
    }
}

</script>

<style scoped>
.el-col {
  padding: 10px;
}

.el-col div {
  border-radius: 8px;
}
</style>
