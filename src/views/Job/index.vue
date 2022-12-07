<template>
  <div class="painter-container">
    <div class="fillter-content d-flex d-f-row-bet">
      <div class="fillter-content-left d-flex">
        <el-date-picker
          style="margin-right: 10px; width: 160px"
          type="month"
          v-model="year"
          placeholder="请选择年月"
          @change="getplanProjectLists"
        />
        <d-tab
          v-for="tab in tabs"
          :key="tab.id"
          :text="tab.text"
          :mr="10"
          :width="120"
          :active="tab.id === activeTabIndex"
          @click="changeTab(tab.id)"
        />
      </div>
      <div class="fillter-content-right d-flex">
        <!-- <div class="rule-btn">查看规则</div> -->
        <el-popover placement="left" :width="200" trigger="hover">
          <div>
            <div
              v-for="(item, index) in efficiencyStatus"
              :key="index"
              :style="{ color: item.color }"
            >
              {{ item.content }}
            </div>
          </div>
          <template #reference>
            <el-button size="large">状态颜色说明</el-button>
          </template>
        </el-popover>
      </div>
    </div>
    <div class="table-content">
      <vxe-table
        border
        :loading="tableLoading"
        :height="height"
        style="min-width: 100%"
        :column-config="{ resizable: true }"
        :scroll-y="{ enabled: true }"
        :span-method="mergeRowMethod"
        :data="demo3.tableData"
        class="reverse-table"
      >
        <template v-for="(head, index) in tableHeaderData" :key="index">
          <vxe-column
            :field="head.prop"
            :title="head.name"
            :width="head.width"
            align="center"
          >
            <template #default="{ row }">
              <span v-if="head.prop === 'status'">
                {{
                  row.status === '0'
                    ? '未安排'
                    : row.status === '1'
                    ? '进行中'
                    : row.status === '2'
                    ? '已完成'
                    : row.status === '3'
                    ? '未通过'
                    : '--'
                }}
              </span>
              <div
                v-if="head.prop === 'efficiencyIndex'"
                :style="{
                  color: getEfficiencyStatus(row.efficiencyIndex).color
                }"
              >
                {{ `${getEfficiencyStatus(row.efficiencyIndex).text}（${row.efficiencyIndex}）` }}
              </div>
              <div v-else-if="head.prop === 'projectFileList'">
                <p v-for="file in row.projectFileList" :key="file.id">
                  <el-button @click="showFile(file.url)" type="text">{{
                    file.type === '1' ? '需求文档' : '参考图'
                  }}</el-button>
                </p>
              </div>
              <span v-else>{{ row[head.prop] }} </span>
            </template>
          </vxe-column>
        </template>
      </vxe-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, reactive, onMounted, nextTick } from 'vue'
import { VxeTablePropTypes } from 'vxe-table'
import { getplanProjectList, getDesignPost } from '@/request/index'
import { efficiencyStatus, getEfficiencyStatus } from '../../common/constant'
const tableHeaderData = [
  { name: '序号', prop: 'order', width: 30 },
  { name: '画师', prop: 'staffName' },
  { name: '职位', prop: 'designPostName' },
  { name: '公司-项目', prop: 'projectName' },
  { name: '缩略图', prop: 'projectFileList', width: 120 },
  { name: '分工', prop: 'name' },
  { name: '开始时间', prop: 'startDate' },
  { name: '结束时间', prop: 'endDate' },
  { name: '状态', prop: 'status' },
  { name: '工作量（天）', prop: 'days' },
  { name: '月薪', prop: 'amount' },
  { name: '完成量', prop: 'unitPrice' },
  { name: '工作总量', prop: 'totalDays' },
  { name: '完成总量', prop: 'totalUnitPrice' },
  { name: '效率指数', prop: 'efficiencyIndex' }
]

export default defineComponent({
  setup () {
    const activeTabIndex: Ref<number> = ref(-1)
    const height: Ref<number> = ref(300)
    const tableLoading = ref(false)
    const tabs: any = ref([{ text: '全部画师', id: -1 }])
    const year: any = ref(new Date())
    const demo3: any = reactive({
      tableData: []
    })

    // 通用行合并函数（将相同多列数据合并为一行）
    const mergeRowMethod: VxeTablePropTypes.SpanMethod = ({
      row,
      _rowIndex,
      column,
      visibleData
    }) => {
      const fields = ['order', 'staffName', 'totalUnitPrice', 'totalDays']
      const cellValue = row[column.property]
      if (cellValue && fields.includes(column.property)) {
        const prevRow = visibleData[_rowIndex - 1]
        let nextRow = visibleData[_rowIndex + 1]
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0, row: 5 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    }

    const changeTab = (id: number): void => {
      if (id !== activeTabIndex.value) {
        activeTabIndex.value = id
        getplanProjectLists()
      }
    }
    const getplanProjectLists = async () => {
      tableLoading.value = true
      const query = {
        type: 1, // 列表类型(1在职人员安排 2外发画师安排)
        designPostId: activeTabIndex.value === -1 ? '' : activeTabIndex.value, // 职位id
        limit: -1,
        month: new Date(year.value).getMonth() + 1,
        page: 1,
        year: new Date(year.value).getFullYear()
      }

      const { code, data } = await getplanProjectList({
        ...query
      })
      if (code === 200) {
        const newList: any = []
        data.list.map((item: any, index: number) => {
          if (item.projectList && item.projectList.length > 0) {
            item.projectList.map((citem: any) => {
              newList.push({
                order: index + 1,
                ...item,
                ...citem
              })
            })
          } else {
            newList.push(item)
          }
        })
        demo3.tableData = newList
      }
      tableLoading.value = false
    }
    // 查看文件
    const showFile = (url: string) => {
      window.open(url, '_blank')
    }

    // 职位列表
    const getDesignPosts = async () => {
      const { code, data } = await getDesignPost()
      if (code === 200) {
        data.map((tab: any) => {
          tabs.value.push({
            text: tab.name,
            ...tab
          })
        })
      }
    }
    onMounted(() => {
      getDesignPosts()
      getplanProjectLists()
      nextTick(() => {
        height.value = document.documentElement.clientHeight - 160
      })
    })

    return {
      tabs,
      activeTabIndex,
      changeTab,
      demo3,
      mergeRowMethod,
      height,
      tableHeaderData,
      year,
      getplanProjectLists,
      tableLoading,
      showFile,
      efficiencyStatus,
      getEfficiencyStatus
    }
  }
})
</script>

<style lang="less" scoped>
.painter-container {
  .fillter-content {
    margin-bottom: 20px;
    .rule-btn {
      height: 40px;
      line-height: 40px;
      text-align: center;
      width: 160px;
      border-radius: 6px;
      background-color: rgba(243, 245, 248, 100);
      cursor: pointer;
    }
  }
  /*滚动条整体部分*/
  .reverse-table ::-webkit-scrollbar {
    width: 8px;
    height: 15px;
  }
  /*滚动条的轨道*/
  .reverse-table ::-webkit-scrollbar-track {
    background-color: #ffffff;
  }
  /*滚动条里面的小方块，能向上向下移动*/
  .reverse-table ::-webkit-scrollbar-thumb {
    background-color: #c0c4cc;
    border-radius: 5px;
    border: 1px solid #f1f1f1;
    // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  }
  .reverse-table ::-webkit-scrollbar-thumb:hover {
    background-color: #909399;
  }
  .reverse-table ::-webkit-scrollbar-thumb:active {
    background-color: #909399;
  }
  /*边角，即两个滚动条的交汇处*/
  .reverse-table ::-webkit-scrollbar-corner {
    background-color: #ffffff;
  }
}
// https://university.legym.cn/
</style>
