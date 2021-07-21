<!--
 * @Author: smq
 * @Date: 2021/7/20
 -->
<template>
  <div class="log-in">
    <div class="blank" />
    <div class="login-form">
      <el-card shadow="always">
        <template #header>
          <h2>登录</h2>
        </template>
        <el-form 
          ref="form" 
          :model="user" 
          label-position="left"
          label-width="60px"
          :rules="rules"
          hide-required-asterisk
        >
          <el-form-item 
            label="账号" 
            prop="username"
          >
            <el-input v-model="user.username" />
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
          >
            <el-input v-model="user.password" />
          </el-form-item>
        </el-form>
        <button
          type="submit"
          class="btn btn-secondary"
          onclick="login()"
        >
          登录
        </button>
        <p>
          <label>
            <input
              v-model="isRemembered"
              type="checkbox"
            >记住密码
          </label>
        </p>
      </el-card>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
    name: 'LogIn',
    beforeRouteEnter(to, from, next) {
        next((vm) => vm.autoLogin())
    },
    data() {
        return {
            user: {
                username: '',
                password: ''
            },
            isRemembered: false,
            rules: {
                username: [{required: true, message: '账户不可为空', trigger: 'blur'}],
                password: [{required: true, message: '密码不可为空', trigger: 'blur'}]
            }
        }
    },
    methods: {
        autoLogin() {
            this.user.username = localStorage.getItem('username')
            if(!localStorage.getItem('isRemembered')) {
                this.user.password = localStorage.getItem('password')
                this.login()
            }
        },
        async login() {
            if(typeof this.user.username === 'undefined' || this.user.username === null) {
                return
            }
            if(typeof this.user.password === 'undefined' || this.user.password === null) {
                return
            }
            const tokenMap = await api.login.login(this.user)
            if(tokenMap.code === 'E101') {
                this.$notify.error({
                    title: '错误',
                    message: '账号或密码不正确！'
                })
                localStorage.setItem('username', this.user.username)
                return
            }
            // 用户密码正确
            localStorage.setItem('username', this.user.username)
            this.$store.commit('setToken', tokenMap.data.get('token'))
            if(this.isRemembered) {
                localStorage.setItem('isRemembered', 'true')
                localStorage.setItem('password', this.user.password)
            }
            await this.$router.push({name: 'workbench'})
            // this.$refs['form'].resetFields()
        }
    }
}
</script>

<style scoped lang="less">
.log-in {
    background-image: url("../../public/bg.png");
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.login-form {
    width: 400px;
    height: 450px;
    margin: 0 100px;
    .el-card {
      height: 100%;
      width: 100%;
    }
}
</style>

<style scoped lang="scss">

.btn:not(:disabled):not(.disabled) {
  cursor: pointer;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 0;
  z-index: 1;
  user-select: none;
  text-transform: uppercase;
  letter-spacing: -1px;
  white-space: unset;
  padding: .8rem 1.5rem;
  text-decoration: none;
  transition: color .15s
  ease-in-out,background-color .15s
  ease-in-out,border-color .15s
  ease-in-out,box-shadow .15s
  ease-in-out;
  font-weight: 500;
  border-radius: 0;
  color: #313131;
}
.btn-secondary {
  color: #fff!important;
  background-color: #757575;
  border-color: #757575;
  text-shadow: 0 2px 0 rgb(0 0 0 / 25%);
}
</style>

<style lang="less">
.login-form .el-form-item__label {
  font-size: 17px;
}
.login-form .el-input__inner {
  border-radius: 0;
}
</style>