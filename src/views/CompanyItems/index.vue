<template>
  <div class="company-items-container">
    <div class="fillter-content d-flex d-f-row-bet">
      <div class="fillter-content-left d-flex">
        <el-date-picker
          style="margin-right: 10px; width: 160px"
          type="month"
          @change="getProjectCompanyProjectLists"
          v-model="query.year"
          placeholder="请选择年月"
        />
        <el-select
          style="width: 160px"
          @change="getProjectCompanyProjectLists"
          v-model="query.partyACompanyId"
          placeholder="请选择公司"
        >
          <el-option
            v-for="cop in companyList"
            :key="cop.id"
            :label="cop.fullName"
            :value="cop.id"
          />
        </el-select>
      </div>
      <div class="fillter-content-right d-flex">
        <el-popover
          placement="left"
          title="Title"
          :width="200"
          trigger="hover"
          content="this is content, this is content, this is content"
        >
          <template #reference>
            <el-button size="large">颜色状态说明</el-button>
          </template>
        </el-popover>
      </div>
    </div>
    <div class="table-content">
      <vxe-table
        style="min-width: 100%"
        border
        :loading="tableLoading"
        :height="height"
        :column-config="{ resizable: true }"
        :scroll-y="{ enabled: true }"
        :span-method="mergeRowMethod"
        :data="demo3.tableData"
        class="reverse-table"
      >
        <template v-for="(head, index) in tableHeaderData" :key="index">
          <vxe-column :field="head.prop" :title="head.name" :width="head.width">
            <template #default="{ row }">
              <span v-if="head.prop === 'paymentStatus'">
                {{
                  row.paymentStatus === '0'
                    ? '未收款'
                    : row.paymentStatus === '1'
                    ? '已收款'
                    : ''
                }}
              </span>
              <span v-else-if="head.prop === 'id'">{{ row.order }}</span>
              <span v-else-if="head.prop === 'status'">
                {{ getStatus(row.status) }}</span
              >
              <span v-else-if="head.prop === 'ppstatus'">{{
                getPPstatus(row.ppstatus)
              }}</span>

              <div v-else-if="head.prop === 'ckt' || head.prop === 'xqwd'">
                <el-button
                  @click="showFile(head.prop === 'ckt' ? row.ckt : row.xqwd)"
                  type="text"
                  >{{ head.prop === 'xqwd' ? '需求文档' : '参考图' }}</el-button
                >
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
import {
  getPartyACompanyList,
  getProjectCompanyProjectList
} from '@/request/index'
const tableHeaderData = [
  { name: '序号', prop: 'id', width: 30 },
  { name: '编号', prop: 'serialNumber', width: 50 },
  { name: '合作公司', prop: 'partyACompanyShortName' },
  { name: '项目名', prop: 'name' },
  { name: '项目类型', prop: 'type' },
  { name: '需求地址', prop: 'demandAddress', width: 120 },
  { name: '参考图', prop: 'ckt', width: 110 },
  { name: '需求文档', prop: 'xqwd', width: 110 },
  { name: '项目群组（甲方/设计师）', prop: 'groupName' },
  { name: '分工/天', prop: 'ppdays' },
  { name: '单价', prop: 'ppunitPrice' },
  { name: '排期', prop: 'pppq', width: 110 },
  { name: '设计师', prop: 'ppstaffName' },
  { name: '状态', prop: 'status' },
  { name: '总价', prop: 'totalPrice' },
  { name: '收款状态', prop: 'paymentStatus' },
  { name: '发票状态', prop: 'ppstatus' },
  { name: '备注', prop: 'remark' }
]

export default defineComponent({
  setup () {
    const height: Ref<number> = ref(300)
    const companyList: any = ref([])
    const tableLoading = ref(false)
    const query: any = reactive({
      year: new Date(),
      partyACompanyId: ''
    })
    const demo3 = reactive({
      tableData: []
    })

    // 通用行合并函数（将相同多列数据合并为一行）
    const mergeRowMethod: VxeTablePropTypes.SpanMethod = ({
      row,
      _rowIndex,
      column,
      visibleData
    }) => {
      // const fields = ['serialNumber', 'partyACompanyShortName', 'name', 'totalPrice']
      const fields = ['id']
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
    // 公司列表
    const getPartyACompanyLists = async () => {
      const { code, data } = await getPartyACompanyList({
        page: 1,
        limit: -1
      })
      if (code === 200) {
        companyList.value = data?.list
      }
    }
    const getStatus = (state: any) => {
      if (state === '1') return '未分配'
      if (state === '2') return '测试中'
      if (state === '3') return '测试中(未通过)'
      if (state === '4') return '进行中'
      if (state === '5') return '移交'
      if (state === '6') return '已完成'
      if (state === '7') return '已完成(已开发票)'
      if (state === '8') return '已完成(已收款)'
    }
    const getPPstatus = (state: any) => {
      if (state === '0') return '未安排'
      if (state === '1') return '进行中'
      if (state === '2') return '已完成'
      if (state === '3') return '未通过'
    }
    // 项目列表
    const getProjectCompanyProjectLists = async () => {
      tableLoading.value = true
      const querys = {
        limit: -1,
        month: new Date(query.year).getMonth() + 1,
        year: new Date(query.year).getFullYear(),
        partyACompanyId: query.partyACompanyId
      }
      const { code, data } = await getProjectCompanyProjectList(querys)
      if (code === 200) {
        const newData: any = []
        const getPq = (start: any, end: any) => {
          if (!start) return end
          if (!end) return start
          if (!end && !start) return '--'
          return `${start}-${end}`
        }
        data.list.map((item: any, index: number) => {
          let newDataItem: any = {}
          if (item.projectStageList && item.projectStageList.length > 0) {
            item.projectStageList.map((citem: any) => {
              const {
                days,
                designPostName,
                endDate,
                name,
                staffName,
                startDate,
                status,
                unitPrice
              } = citem
              newDataItem = {
                ...item,
                ppdays: days,
                ppdesignPostName: designPostName,
                ppendDate: endDate,
                ppname: name,
                ppstaffName: staffName,
                ppstartDate: startDate,
                ppstatus: getStatus(status),
                ppunitPrice: unitPrice,
                xqwd: '',
                ckt: '',
                pppq: getPq(startDate, endDate),
                order: index + 1
              }
              // 处理文件类型
              if (item.projectFileList && item.projectFileList.length > 0) {
                // 需求文档
                const xqwd: any = item.projectFileList.find(
                  (xq: any) => xq.type === '1'
                )
                // 参考图
                const ckt: any = item.projectFileList.find(
                  (xq: any) => xq.type === '2'
                )
                newDataItem.xqwd = (xqwd || {}).url
                newDataItem.ckt = (ckt || {}).url
              }
              newData.push(newDataItem)
            })
          } else {
            newDataItem = item
            // 处理文件类型
            if (item.projectFileList && item.projectFileList.length > 0) {
              // 需求文档
              const xqwd: any = item.projectFileList.find(
                (xq: any) => xq.type === '1'
              )
              // 参考图
              const ckt: any = item.projectFileList.find(
                (xq: any) => xq.type === '2'
              )
              newDataItem.xqwd = (xqwd || {}).url
              newDataItem.ckt = (ckt || {}).url
              newDataItem.order = index + 1
            }
            newData.push(newDataItem)
          }
        })
        demo3.tableData = newData
      }
      tableLoading.value = false
    }
    const showFile = (url: string) => {
      window.open(url, '_blank')
    }
    onMounted(() => {
      getProjectCompanyProjectLists()
      getPartyACompanyLists()
      nextTick(() => {
        height.value = document.documentElement.clientHeight - 160
      })
    })

    return {
      demo3,
      mergeRowMethod,
      height,
      tableHeaderData,
      companyList,
      query,
      getProjectCompanyProjectLists,
      tableLoading,
      showFile,
      getStatus,
      getPPstatus
    }
  }
})
</script>

<style lang="less" scoped>
.company-items-container {
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
