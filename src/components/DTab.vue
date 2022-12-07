<template>
  <div
    @click="changeTab"
    :style="{ width: width + 'px', marginRight: mr + 'px' }"
    class="tab-content d-flex d-f-row-center d-f-col-center"
    :class="[active && 'active']"
  >
    <slot>
      <span>{{ text }} </span>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'd-tab',
  emits: {
    click: null
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 160
    },
    active: {
      type: Boolean,
      default: false
    },
    mr: {
      type: Number,
      default: 0
    }
  },
  setup (props, ctx) {
    const changeTab = () => ctx.emit('click')
    return {
      changeTab
    }
  }
})
</script>

<style lang="less" scope>
.tab-content {
  height: 40px;
  border-radius: 6px;
  background-color: rgba(243, 245, 248, 100);
  font-size: 16px;
  font-family: HarmonyOS_Sans_SC-regular;
  color: rgba(16, 16, 16, 100);
  cursor: pointer;
  &:hover {
    background-color: rgba(224, 231, 236, 100);
  }
}
.active {
  background-color: rgba(224, 231, 236, 100);
}
</style>
