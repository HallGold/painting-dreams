<template>
  <div class="table-container">
    <table>
      <tbody>
        <tr class="table-header">
          <td
            v-for="(headerItem, headerIndex) in headerData"
            :key="headerIndex"
          >
            <div v-if="!headerItem.render">{{ headerItem.name }}</div>
            <div v-if="headerItem.render" v-html="headerItem.render()" />
          </td>
        </tr>
        <!-- table Body -->
        <!-- <template> -->
        <tr class="body-tr" v-for="(item, trIndex) in data" :key="trIndex">
          <td
            v-for="(header, tdIndex) in headerData"
            :style="
              data[trIndex][styles] ? data[trIndex][styles[trIndex]] : null
            "
            :key="tdIndex"
          >
            <div>
              {{ data[trIndex][headerData[tdIndex].key] }}
            </div>
          </td>
        </tr>
        <!-- </template> -->
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'm-table',
  props: {
    headerData: {
      type: Array,
      default: () => {
        return [
          { name: '3月1日', key: '1' },
          { name: '3月2日', key: '2' },
          { name: '3月3日', key: '3' },
          { name: '3月4日', key: '4' },
          { name: '3月5日', key: '5' },
          { name: '3月6日', key: '6' },
          { name: '3月7日', key: '7' },
          { name: '3月8日', key: '8' },
          { name: '3月9日', key: '9' },
          { name: '3月10日', key: '10' },
          { name: '3月11日', key: '11' },
          { name: '3月12日', key: '12' },
          { name: '3月13日', key: '13' },
          { name: '3月14日', key: '14' },
          { name: '3月15日', key: '15' }
        ]
      }
    },
    data: {
      type: Array,
      default: () => [
        { 1: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 2: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 3: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 4: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 5: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 6: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 7: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 8: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 9: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 10: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 11: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 12: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 13: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 14: '巴妮拉', style: { backgroundColor: '#E0E7EC' } },
        { 15: '巴妮拉', style: { backgroundColor: '#E0E7EC' } }
      ]
    }
  }
})
</script>

<style lang="less" scoped>
.table-container {
  box-sizing: border-box;
  max-width: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
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
  border-radius: 2px;

  table {
    border-collapse: separate;
    border-spacing: 0;
    border-bottom: 1px solid #dcdcdc;
    border-right: 1px solid #dcdcdc;
    .body-tr:hover td {
      background-color: #e0e7ec !important;
    }
    td {
      border-left: 1px solid #dcdcdc;
      border-top: 1px solid #dcdcdc;
      background-color: #f3f5f8;
      cursor: pointer;
      & > div {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        min-width: 102px;
        font-size: 14px;
        color: #333;
      }
    }
  }
}
</style>
