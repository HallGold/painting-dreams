<template>
  <div class="months">
    <div
      :class="{ active: currentMouth === index }"
      v-for="(num, index) in months"
      :key="index"
      @click="change(index)"
    >
      {{ index + 1 + '月' }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
const months = 12

export default defineComponent({
  name: 'month',
  props: {
    mouth: {
      type: Number,
      default: () => new Date().getMonth()
    }
  },
  setup (props, ctx) {
    const currentMouth = ref(props.mouth)
    const change = (mouth: number): void => {
      if (currentMouth.value === mouth) return
      currentMouth.value = mouth
      ctx.emit('change', {
        value: mouth,
        label: `${mouth + 1}月`
      })
    }
    return {
      months,
      currentMouth,
      change
    }
  }
})
</script>

<style lang="less" scoped>
.months {
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 15px 0 10px;
  div {
    width: 80px;
    height: 54px;
    flex-shrink: 0;
    margin-right: 20px;
    line-height: 54px;
    border-radius: 6px;
    background-color: rgba(243, 245, 248, 100);
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    margin-bottom: 10px;
    text-align: center;
    cursor: pointer;
  }
  .active {
    background-color: #e0e7ec;
  }
}
</style>
