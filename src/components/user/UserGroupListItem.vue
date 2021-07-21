<!--
 * @Author: smq
 * @Date: 2021/7/19
 -->
<template>
  <div class="list-item">
    <el-card
      shadow="always"
      class="user-card"
    >
      <div class="card-header">
        <span>{{ data.groupName }}</span>
        <div class="blank" />
        <el-button
          type="text"
          size="small"
        >
          编辑分组
        </el-button>
      </div>
      <el-collapse
        v-model="active"
        accordion
      >
        <el-collapse-item name="server">
          <template #title>
            <span>分组服务器</span>
          </template>
          <div class="server-group">
            <div class="tags">
              <el-tag
                v-for="server in data.servers"
                :key="server.id"
                closable
                @close="removeServer(server.id)"
                @click="$router.push({name:'server', params:{abbr: server.abbr}})"
              >
                {{ server.name.resizeTo(16, '...') }}
              </el-tag>
              <el-popover
                :visible="dialogs.serverSelector"
              >
                <div>
                  <p>
                    <el-select
                      v-model="serverToAdd"
                      size="small"
                      placeholder="请选择服务器"
                    >
                      <el-option
                        v-for="it in availableServers"
                        :key="it.id"
                        :label="it.name"
                        :value="it.id"
                      />
                    </el-select>
                  </p>
                  <div style="text-align: right">
                    <el-button
                      size="small"
                      type="text"
                      @click="dialogs.serverSelector = false"
                    >
                      取消
                    </el-button>
                    <el-button
                      size="small"
                      type="primary"
                      :loading="addLoading"
                      @click="addServer"
                    >
                      添加
                    </el-button>
                  </div>
                </div>
                <template #reference>
                  <el-tag
                    class="add-btn"
                    @click="dialogs.serverSelector = true"
                  >
                    <i class="el-icon-circle-plus" />&nbsp;添加
                  </el-tag>
                </template>
              </el-popover>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item
          name="file"
          title="分组文件权限"
        >
          <el-table
            :data="data.permittedLocation"
            max-height="250"
          >
            <el-table-column
              label="文件路径"
              :show-overflow-tooltip="true"
            >
              <template #default="scope">
                <span style="margin-left: 10px">{{ scope.row }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="50"
            >
              <template #default="scope">
                <el-popconfirm
                  title="确定要删除吗"
                  @confirm="removePermittedLocation(scope.row)"
                >
                  <template #reference>
                    <el-button
                      size="small"
                      type="text"
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <div class="edit">
            <el-button
              type="text"
              size="small"
            >
              编辑文件权限
            </el-button>
          </div>
        </el-collapse-item>
        <el-collapse-item
          name="user"
          title="分组用户"
        >
          <el-table
            :data="data.members"
            max-height="250"
          >
            <el-table-column
              label="用户名"
              prop="username"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="权限"
              align="center"
              prop="groupPermissionLevel"
              width="50"
            />
            <el-table-column
              label="操作"
              align="center"
              width="50"
            >
              <template #default="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="scope.row.showPop = true"
                >
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="edit">
            <el-button
              type="text"
              size="small"
            >
              编辑用户列表
            </el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
  <el-dialog
    v-model="dialogs.userListEditor"
    title="管理用户"
  >
    <el-transfer
      v-model="userIds"
      :data="userList"
      :titles="['可选用户','当前用户']"
      :props="{
        key: 'id',
        label: 'username'
      }"
    />
    <template #footer>
      <el-button @click="manageUser">
        确认
      </el-button>
    </template>
  </el-dialog>
</template>

<script>

export default {
    name: 'UserGroupListItem',
    props: {
        userGroup: {
            type: Object,
            default: () => ({}),
        },
        serverAbbrList: {
            type: Array,
            default: () => [],
        },
        userList: {
            type: Array,
            default: () => [],
        }
    },
    data() {
        return {
            active: 'user',
            servers: [
                {id: 0, name: 'EngiTech2', abbr: 'et2'},
                {id: 1, name: 'FTB Interations', abbr: 'ftbi'},
                {id: 2, name: 'Trail of God', abbr: 'tog'},
                {id: 3, name: 'Dove\'s Home', abbr: 'dove'},
                {id: 4, name: 'Mana Metal', abbr: 'mt'},
            ],
            addLoading: false,
            serverToAdd: undefined,
            dialogs: {
                userListEditor: false,
                userEditor: false,
                permittedLocationEditor: false,
                groupEditor: false,
                serverSelector: false,
            },
            data: {
                id: 1,
                groupName: '默认分组',
                maxPermissionLevel: -1,
                members: [
                    {id: 0, username: 'warmthdawn', groupPermissionLevel: 0},
                    {id: 1, username: 'szy', groupPermissionLevel: 1},
                ],
                servers: [
                    {id: 0, name: 'EngiTech2', abbr: 'et2'},
                    {id: 1, name: 'FTB Interations', abbr: 'ftbi'},
                    {id: 2, name: 'Trail of God', abbr: 'tog'},
                ],
                permittedLocation: [
                    '/backup/et2',
                    '/backup/ftbi',
                    '/backup/tog',
                    '/root/common',
                ]

            }
        }
    },
    computed: {
        availableServers() {
            return this.servers.filter((it) => {
                return !this.data.servers.some((has) => has.id === it.id)
            })
        }
    },
    methods: {
        addServer() {
            this.addLoading = true
            setTimeout(() => {
                this.dialogs.serverSelector = false
                //TODO: 添加服务器
                this.serverToAdd = undefined
                this.addLoading = false
            }, 4000)

        },
        removePermittedLocation(location) {
            console.log(location)
        },
        removeServer(server) {
            console.log(server)
        },
        manageUser() {
            console.log('manage user')
        },
    },
}
</script>

<style
  scoped
  lang="less"
>
.user-card {
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.list-item {
  margin: 8px;

  @media screen and (max-width: 768px) {
    margin: 4px;
  }
}

.server-group, .user-table {
  margin-bottom: 10px;
}

.user-list {
  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      padding: 8px 0;
      border-bottom: 1px solid rgba(0, 0, 0, .1);

      div {
        padding: 0 10px;
      }
    }
  }
}

.edit {
  display: flex;
  justify-content: flex-end;
  margin: 8px 24px 0;
}

.card-header {
  display: flex;
  flex-direction: row;
  align-items: center;

  .el-button {
    padding: 0 10px 0 0;
    height: auto;
  }
}

.tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0 12px;

  span {
    margin: 2px 4px;
    cursor: pointer;
    display: block;
  }

  .blank {
    flex: 1 1 0;
  }

  .add-btn {
    display: block;

    &:hover {
      opacity: .8;
    }
  }
}

</style>

<style>
.el-card__body {
    padding-top: 8px;
}
div.el-collapse-item__content {
    padding-bottom: 0;
}
</style>
