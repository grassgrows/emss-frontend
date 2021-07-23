<template>
  <div class="card-header">
    <div class="select">
      <el-dropdown
        trigger="click"
        @command="$store.commit('file/setSortMethod', $event)"
      >
        <span class="el-dropdown-link">
          {{ `按${sortMethodName}排序` }}<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <template
              v-for="item in sortMethods"
              :key="item.key"
            >
              <el-dropdown-item
                v-if="item.key === sortMethod"
                icon="el-icon-check"
                :command="item.key"
              >
                {{ item.name }}
              </el-dropdown-item>
              <el-dropdown-item
                v-else
                :command="item.key"
                icon="el-icon-check"
                class="hidden-icon"
              >
                {{ item.name }}
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    &nbsp; &nbsp;
    <div class="ascend">
      <el-switch
        :model-value="sortAscend"
        active-text="升序"
        inactive-text="降序"
        @change="$store.commit('file/setSortAscend', $event)"
      />
    </div>
    <div class="blank" />
    <div class="operation-button">
      <transition name="el-zoom-in-center">
        <div v-show="showSearch">
          <el-input
            v-model="searchKeyword"
            clearable
            @keyup.enter="searchFile"
          />
        </div>
      </transition>
      &nbsp; &nbsp;
      <el-button
        icon="el-icon-search"
        circle
        @click="showSearch = !showSearch"
      />

      <el-dropdown trigger="click">
        <el-button
          type="primary"
          icon="el-icon-plus"
          circle
        />
        <template #dropdown>
          <file-menu />
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import FileMenu from '@/components/file/FileMenu'

export default {
    name: 'FileListHeader',
    components: {FileMenu},
    data() {
        return {
            showSearch: false,
            searchKeyword: '',
            sortMethods: [
                {
                    name: '文件名',
                    key: 'filename',
                },
                {
                    name: '修改时间',
                    key: 'time',
                },
                {
                    name: '文件大小',
                    key: 'size',
                },
            ],
        }
    },
    computed: {
        ...mapState({
            sortMethod: (state) => state.file.sortMethod,
            sortAscend: (state) => state.file.sortAscend,
        }),
        sortMethodName() {
            return this.sortMethods.find((it) => it.key === this.sortMethod).name
        },
    },
    methods: {
        searchFile() {
            this.$router.push({
                name: 'file-search',
                params: {
                    filePaths: this.$route.params.filePaths,
                },
                query: {
                    keyword: this.searchKeyword,
                }
            })
        },
    }
}
</script>

<style
  scoped
  lang="less"
>

.card-header {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;

  .select, .ascend {
    display: flex;
    align-items: center;
  }
}

.operations {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.operation-button {
  display: flex;
  flex-direction: row;

  div button {
    margin: 0 10px;
  }
}

</style>
