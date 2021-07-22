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
              @click="editPermittedLocation()"
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
              width="100"
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
                  @click="editUser(scope.row.id)"
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
              @click="editUserList"
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
    custom-class="my-dialog"
    title="管理用户"
  >
    <el-table
      ref="userListEditor"
      :data="dialogData.userListEditor.users"
      row-key="id"
      @selection-change="userListSelection"
    >
      <el-table-column
        type="selection"
      />
      <el-table-column
        label="用户名"
        prop="username"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="权限"
        align="center"
        prop="groupPermissionLevel"
        width="100"
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
            @click="editUser(scope.row.id)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogs.userListEditor = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updateUserList()"
        >确 定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="dialogs.permittedLocationEditor"
    custom-class="my-dialog"
    title="管理文件权限"
  >
    <div class="file-list">
      <div
        v-for="(loc,index) in dialogData.permittedLocation"
        :key="loc"
        class="file-edit"
      >
        <el-input
          v-model="dialogData.permittedLocation[index]"
          size="small "
        />
        <el-popconfirm
          title="确认要删除吗？"
          @confirm="dialogData.permittedLocation.splice(index, 1)"
        >
          <template #reference>
            <el-button type="text">删除</el-button>
          </template>
        </el-popconfirm>
      </div>
      <div style="text-align: center">
        <el-button
          type="text"
          @click="dialogData.permittedLocation.push('')"
        >
          添加一个新的路径
        </el-button>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogs.permittedLocationEditor = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updatePermittedLocation()"
        >确 定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="dialogs.userEditor"
    title="编辑用户信息"
    custom-class="my-dialog"
  >
    <el-form :model="dialogData.editingUser">
      <el-form-item
        label="用户名"
      >
        <el-input
          v-model="dialogData.editingUser.username"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="用户权限"
      >
        <el-input
          v-model="dialogData.editingUser.groupPermissionLevel"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
      >
        <el-input
          v-model="dialogData.editingUser.password"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>

    <div style="text-align: center">
      <el-button
        type="text"
      >
        删除这个用户
      </el-button>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogs.userEditor = false">取 消</el-button>
        <el-button
          type="primary"
          @click="updateUser()"
        >确 定</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script>
import api from '@/api'
import {nextTick} from 'vue'

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
    emits: ['refresh'],
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
            //对话框的显示状态
            dialogs: {
                userListEditor: false,
                userEditor: false,
                permittedLocationEditor: false,
                groupEditor: false,
                serverSelector: false,
            },
            //对话框的数据
            dialogData: {
                userListEditor: {
                    users: [],
                    selection: new Map(),
                },
                permittedLocation: [],
                editingUser:
                    {
                        id: 0,
                        username: 'warmthdawn',
                        password: undefined,
                        groupPermissionLevel: 0,
                    },

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
        },
    },
    methods: {
        //用户编辑列表显示
        userListSelection(selection) {
            const selectionMap = new Set(selection.map((it) => it.id))
            this.dialogData.userListEditor.selection = selectionMap
            this.dialogData.userListEditor.users.sort((a, b) => {
                const selA = selectionMap.has(a.id)
                const selB = selectionMap.has(b.id)
                if (selA === selB) {
                    return a.username.localeCompare(b.username)
                } else {
                    return selA ? -1 : 1
                }

            })
        },

        //用户
        async updateUser() {
            this.$emit('refresh', this.data.id)
            await this.refreshUserList()
        },
        editUser(id) {
            console.log(id)
            this.dialogs.userEditor = true
        },
        async removeUser(id) {
            console.log(id)
            this.$emit('refresh', this.data.id)
        },

        //服务器
        async addServer() {
            this.addLoading = true
            //todo: 添加服务器

            this.dialogs.serverSelector = false
            //TODO: 添加服务器
            this.serverToAdd = undefined
            this.addLoading = false
        },
        async removeServer(server) {
            console.log(server)
            this.$emit('refresh', this.data.id)
        },


        //权限地址
        editPermittedLocation() {
            this.dialogData.permittedLocation = [...this.data.permittedLocation]
            this.dialogs.permittedLocationEditor = true
        },
        updatePermittedLocation() {
            //TODO: 更新
            this.dialogs.permittedLocationEditor = false
            this.$emit('refresh', this.data.id)
        },
        removePermittedLocation(location) {
            console.log(location)
            //TODO: 删除
            this.$emit('refresh', this.data.id)
        },

        //用户列表
        async editUserList() {
            this.dialogData.userListEditor.users = await api.userGroup.getUserList()
            const current = new Set(this.data.members.map((it) => it.id))
            this.dialogs.userListEditor = true
            await nextTick()
            this.dialogData.userListEditor.users.forEach((it) => {
                if (current.has(it.id)) {
                    this.$refs.userListEditor.toggleRowSelection(it)
                }
            })
        },

        async refreshUserList() {
            if (this.dialogs.userListEditor) {
                this.dialogData.userListEditor.users = await api.userGroup.getUserList()
                const current = new Set(this.data.members.map((it) => it.id))
                this.dialogData.userListEditor.users.forEach((it) => {
                    if (current.has(it.id)) {
                        this.$refs.userListEditor.toggleRowSelection(it)
                    }
                })
            }
        },
        updateUserList() {
            //TODO: 更新
            this.$emit('refresh', this.data.id)
            this.dialogs.userListEditor = false
        }
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

.my-dialog {
  .button-group {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 12px 16px 0;
  }

  .file-list {
    .file-edit {
      margin: 8px 0;
      display: flex;

      & > div {
        margin: 0 12px;
      }
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

<style lang="less">
div.my-dialog.el-dialog {
  .el-dialog__body {
    padding: 16px;
  }

  @media screen and (max-width: 728px) {
    width: 90% !important;
  }
}
</style>
