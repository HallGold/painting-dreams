<!--
 * @Description:
 * @Author: Author
 * @Date: 2022-03-31 09:41:23
 * @LastEditTime: 2022-07-11 16:25:37
 * @LastEditors: chenzhuomin 1575253121@qq.com
-->
<template>
  <div class="layout-cointainer">
    <div class="main-header">
      <main-header />
    </div>
    <div class="main-content">
      <div class="main-side-bar">
        <side-bar />
      </div>
      <div class="main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Header from './components/Header.vue'
import SideBar from './components/SideBar.vue'
export default defineComponent({
  components: {
    'main-header': Header,
    'side-bar': SideBar
  },
  setup () {
    const route = computed(() => useRoute())
    const store = useStore()
    watchEffect(() => {
      if (route.value.meta.permission) {
        store.commit('SET_META_VALUE', route.value.meta.permission)
      }
    })
  }
})
</script>

<style lang="less" scoped>
.layout-cointainer {
  background-color: #fff;
  .main-content {
    display: flex;
    flex-wrap: nowrap;
    flex-shrink: 0;
    .main {
      height: calc(100vh - 80px);
      width: calc(100vw - 151px);
      overflow: auto;
      box-sizing: border-box;
      padding: 13px 20px 0 20px;
      flex-shrink: 0;
    }
  }
}
</style>
