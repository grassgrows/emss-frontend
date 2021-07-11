<!--
 * @Author: smq
 * @Date: 2021/7/7
 -->
<template>
  <div class="list-container">
    <el-row :gutter="20">
      <el-col
        v-for="s in displayList"
        :key="s.id"
        :span="8"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <server-list-card
          class="card"
          :server-data="s"
        />
      </el-col>
      <el-col
        :span="8"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <server-list-card
          class="card"
          add-card
          @add="showAdd"
        />
      </el-col>

      <add-server />
    </el-row>
  </div>
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
    mounted() {
        this.$store.commit('refreshServerList')
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
