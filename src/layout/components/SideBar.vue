<!--
 * @Description:
 * @Author: Author
 * @Date: 2022-03-31 09:41:23
 * @LastEditTime: 2022-06-14 10:43:11
 * @LastEditors: Author
-->
<template>
  <div class="side-bar-container">
    <el-menu
      active-text-color="#101010"
      background-color="#F3F5F8"
      class="el-menu-vertical-demo"
      default-active="1"
      :router="true"
      text-color="#101010"
    >
      <el-menu-item
        :class="{ 'is-active': route.name === currentPageName }"
        v-for="route in routes"
        :key="route.path"
        :index="route.path"
      >
        <el-icon><setting /></el-icon>
        <span> {{ route.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { Setting } from '@element-plus/icons-vue'

export default defineComponent({
  components: {
    setting: Setting
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const userInfo = store.state.userInfo

    const routes = computed(() => {
      const routers =
        (router.options.routes.find((route) => route.name === 'Layout') || {})
          .children || []
      if (userInfo.type === '1') {
        return routers
      } else {
        let menus: any = []
        const menuRouters: any = []
        if (
          userInfo.permission &&
          typeof userInfo.permission === 'string' &&
          userInfo.permission.length > 0
        ) {
          try {
            menus = JSON.parse(userInfo.permission)
          } catch (err) {
            menus = []
          }
        }
        routers.map((route: any) => {
          if (route.meta && route.meta.permission) {
            const index = menus.findIndex(
              (value: any) => value === route.meta.permission
            )
            if (index > -1) {
              menuRouters.push(route)
            }
          }
        })
        return menuRouters
      }
    })
    const currentPageName = computed(() => route.name)

    return {
      routes,
      currentPageName
    }
  }
})
</script>

<style lang="less" scoped>
.side-bar-container {
  width: 150px;
  height: 100vh;
  max-height: calc(100vh - 80px);
  background-color: rgba(243, 245, 248, 100);
  overflow: auto;
  .el-menu-item {
    font-size: 14px;
  }

  .is-active {
    background-color: #e0e7ec;
  }
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 15px;
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: #c0c7cc;
  }
  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background-color: #ededed;
  }
}
</style>
