<template>
  <div class="login-container">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      class="login-form"
      auto-complete="on"
      size="large"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>

      <el-form-item style="width: 448px" prop="username">
        <span class="svg-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 130 130"
            id="icon-user"
            style="fill: #889aa4"
          >
            <path
              d="M63.444 64.996c20.633 0 37.359-14.308 37.359-31.953 0-17.649-16.726-31.952-37.359-31.952-20.631 0-37.36 14.303-37.358 31.952 0 17.645 16.727 31.953 37.359 31.953zM80.57 75.65H49.434c-26.652 0-48.26 18.477-48.26 41.27v2.664c0 9.316 21.608 9.325 48.26 9.325H80.57c26.649 0 48.256-.344 48.256-9.325v-2.663c0-22.794-21.605-41.271-48.256-41.271z"
              stroke="#889aa4"
            ></path>
          </svg>
        </span>
        <el-input
          ref="username"
          placeholder="账号"
          name="username"
          v-model="ruleForm.username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password" style="width: 448px">
        <span class="svg-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            style="fill: #889aa4"
            id="icon-password"
          >
            <path
              d="M108.8 44.322H89.6v-5.36c0-9.04-3.308-24.163-25.6-24.163-23.145 0-25.6 16.881-25.6 24.162v5.361H19.2v-5.36C19.2 15.281 36.798 0 64 0c27.202 0 44.8 15.281 44.8 38.961v5.361zm-32 39.356c0-5.44-5.763-9.832-12.8-9.832-7.037 0-12.8 4.392-12.8 9.832 0 3.682 2.567 6.808 6.407 8.477v11.205c0 2.718 2.875 4.962 6.4 4.962 3.524 0 6.4-2.244 6.4-4.962V92.155c3.833-1.669 6.393-4.795 6.393-8.477zM128 64v49.201c0 8.158-8.645 14.799-19.2 14.799H19.2C8.651 128 0 121.359 0 113.201V64c0-8.153 8.645-14.799 19.2-14.799h89.6c10.555 0 19.2 6.646 19.2 14.799z"
            ></path>
          </svg>
        </span>
        <el-input
          ref="password"
          type="password"
          v-model="ruleForm.password"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter="handleLogin(ruleFormRef)"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        size="large"
        style="width: 448px"
        @click.prevent="handleLogin(ruleFormRef)"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'
import { login, getUserInfo } from '@/request/index'
import { base64Encode, md5Encode } from '@/utils/index'

export default defineComponent({
  setup () {
    const store = useStore()
    const router = useRouter()
    const ruleFormRef = ref<FormInstance>()
    const loading: Ref<boolean> = ref(false)
    const ruleForm = reactive({
      username: 'admin',
      password: ''
    })

    const rules = reactive({
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }]
    })

    const handleLogin = async (formEl: FormInstance) => {
      if (formEl) {
        await (formEl as any).validate(async (valid: boolean) => {
          if (valid) {
            loading.value = true
            const res = await login({
              account: base64Encode(ruleForm.username),
              password: md5Encode(ruleForm.password)
            })
            if (res.code === 200) {
              // set Token
              await store.commit('SET_TOKEN', { token: res.data.token })
              // 获取用户信息
              const { code, data } = await getUserInfo()
              if (code === 200) {
                await store.commit('SET_USER', { ...data })
                await router.push({ name: 'Layout' })
                loading.value = false
              }
            }
          }
        })
      }
    }

    return {
      ruleForm,
      rules,
      ruleFormRef,
      handleLogin
    }
  }
})
</script>

<style lang="less">
@bg: #283443;
@light_gray: #fff;
@cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: @cursor)) {
  .login-container .el-input input {
    color: @cursor;
  }
}
/* reset element-ui css */
.login-container {
  height: 100vh;
  .el-input {
    display: inline-block;
    height: 47px;
    flex: 1;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: @light_gray;
      height: 47px;
      caret-color: @cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px @bg inset !important;
        -webkit-text-fill-color: @cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-input__wrapper {
    width: 93%;
    background: transparent;
    box-shadow: 0 0 0 0;
  }
}
</style>

<style lang="less" scoped>
@bg: #2d3a4b;
@dark_gray: #889aa4;
@light_gray: #eee;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #283443;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .svg-container {
    width: 30px;
    display: flex;
    align-content: center;
    justify-content: center;
    padding: 6px 5px 6px 15px;
    color: @dark_gray;
    svg {
      width: 16px;
      height: 16px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: @light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: @dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
