<template>
  <el-button size="large" @click="click" :icon="CirclePlus">
    <slot>
      <span>{{ text }}</span>
    </slot>
  </el-button>
</template>

<script lang="ts">
import { CirclePlus } from '@element-plus/icons-vue'

import { defineComponent } from 'vue'
export default defineComponent({
  name: 'd-add',
  emits: {
    click: null
  },
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  setup (props, ctx) {
    const click = () => ctx.emit('click')
    return {
      CirclePlus,
      click
    }
  }
})
</script>

<style></style>
