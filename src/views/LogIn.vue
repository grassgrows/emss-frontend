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
          class="btn btn-secondary btn-block"
          @click="login()"
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
            if(localStorage.getItem('isRemembered')) {
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
            const result = await api.login.login(this.user)
            if(result.code === 'E101') {
                this.$notify.error({
                    title: '错误',
                    message: '账号或密码不正确！'
                })
                localStorage.setItem('username', this.user.username)
                return
            }
            // 用户密码正确
            localStorage.setItem('username', this.user.username)
            this.$store.commit('setToken', result.data.token)
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
button {
    overflow: visible;
    text-indent: 0;
    font: 400 13.3333px Arial;
}
.btn {
    cursor: pointer;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 0;
    z-index: 1;
    user-select: none;
    text-transform: uppercase;
    letter-spacing: 1px;
    white-space: unset;
    padding: .8rem 1.5rem;
    text-decoration: none;
    font-weight: 600;
    line-height: 1rem;
    border-radius: 0;
}
.btn-secondary {
    color: #fff;
    background-color: #008542;
    border-color: #008542;
    text-shadow: 0 2px 0 rgb(0 0 0 / 25%);
    transition: color .15s ease-in-out,
    background-color .15s ease-in-out,
    border-color .15s ease-in-out,
    box-shadow .15s ease-in-out;
}
.btn-secondary::before {
    background-color: #008542;
    box-shadow: inset 0 -4px rgb(0 0 0 / 25%),
    inset 0 4px hsl(0deg 0% 100% / 35%),
    inset -4px 0 hsl(0deg 0% 100% / 35%),
    inset 4px 0 rgb(0 0 0 / 25%);
    z-index: -1;
}
.btn-secondary::before, .btn-secondary::after {
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    content: "";
    transition: .10s cubic-bezier(0,.8,.26,.99);
}
.btn-secondary::after {
    box-shadow: 0 4px 0 0 rgb(0 0 0 / 15%);
}
.btn-secondary:hover::before {
    background-color: #313131;
}
.btn-block {
    display: block;
    width: 50%;
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
