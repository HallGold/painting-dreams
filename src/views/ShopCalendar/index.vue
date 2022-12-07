<template>
  <div class="shop-calendar-container">
    <div class="filtter-box">
      <div class="left-filter">
        <div class="year">
          <el-date-picker
            size="large"
            @change="getPlanProjectScheduleLists"
            v-model="query.year"
            format="YYYY"
            value-format="YYYY"
            type="year"
            placeholder="请选择年份"
          />
        </div>
        <div class="painter">
          <el-select
            v-model="query.sort"
            placeholder="按照画师名排序"
            @change="getPlanProjectScheduleLists"
            size="large"
          >
            <el-option label="升序" :value="1" />
            <el-option label="降序" :value="2" />
          </el-select>
        </div>
        <div class="2d-painter">
          <el-select
            v-model="query.designPostId"
            @change="getPlanProjectScheduleLists"
            clearable
            placeholder="按岗位分工筛选"
            size="large"
          >
            <el-option
              v-for="item in designPosts"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <div class="right-filter">
        <el-popover placement="left" :width="200" trigger="hover">
          <div>
            <div v-for="item in projectStatus" :key="item.key" :style="{ 'color': item.color }">{{ item.text }}</div>
          </div>
          <template #reference>
            <el-button size="large">颜色状态说明</el-button>
          </template>
        </el-popover>
      </div>
    </div>
    <div class="mouth-select">
      <month @change="changeMonth" />
    </div>
    <!-- <my-table style="margin-bottom: 20px" /> -->
    <!-- <my-table style="margin-bottom: 20px" /> -->
    <my-table v-if="false" />
    <vxe-table
      style="width: 100%"
      border
      :height="height"
      :loading="tableLoading"
      :column-config="{ resizable: true }"
      :scroll-y="{ enabled: true }"
      :span-method="mergeRowMethod"
      :data="tableData"
      class="reverse-table"
    >
      <vxe-column
        field="staffId"
        fixed="left"
        title="姓名"
        :width="60"
        align="center"
      >
        <template #default="{ row }">
          <span>{{ row.staffName }}</span>
        </template>
      </vxe-column>
      <vxe-column
        :field="head.prop"
        :title="head.name"
        v-for="(head, index) in tableHeader"
        :key="index"
        align="center"
      >
        <template #default="{ row }">
          <div
            class="table-item"
            :style="{
              'background-color': row[head.prop]
                ? projectStatus[row.status].color
                : ''
            }"
            style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;"
            :title="`${row[head.prop] ? row[head.prop] : ''}`"
          >
            {{ row[head.prop] }}
          </div>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script lang="ts">
/**
 * @description 后台设置页面
 * 1-100% 提成点数
 * pdf 预览
 *
 */
import { defineComponent, ref, onMounted, reactive, nextTick, Ref } from 'vue'
import { VxeTablePropTypes } from 'vxe-table'
import moment from 'moment'
import Table from './components/Table.vue'
import { getPlanProjectScheduleList, getDesignPost } from '@/request/index'
import { projectStatus } from '../../common/constant'
const getMonthDay = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}
interface monthEventProps {
  label: string
  value: number
}
export default defineComponent({
  components: {
    'my-table': Table
  },
  setup () {
    const year = ref('2022')
    const painterName = ref('')
    const spanArr: any = ref([])
    const designPosts: any = ref([])
    const tableHeader: any = ref([])
    const tableData: any = ref([])
    const height: Ref<number> = ref(300)
    const demo3: any = reactive({ tableData: [] })

    const query: any = ref({
      year: new Date().getFullYear(), // 年份
      month: new Date().getMonth() + 1, // 月份
      limit: -1,
      page: 1,
      sort: 1, // 画师名排序 1升序 2降序
      designPostId: '' // 职位id
    })
    const changeMonth = (mouth: monthEventProps): void => {
      query.value.month = mouth.value + 1
      getPlanProjectScheduleLists()
    }
    // 列表
    const getPlanProjectScheduleLists = async () => {
      const { code, data } = await getPlanProjectScheduleList({
        ...query.value
      })
      const dates: number = getMonthDay(query.value.year, query.value.month - 1)
      tableHeader.value = []
      for (let i = 0; i < dates; i++) {
        tableHeader.value.push({
          prop: `day-${i + 1}`,
          name: `${query.value.month}月${i + 1}日`
        })
      }

      if (code === 200) {
        const newData: any = []
        if (data && data.list) {
          data.list.map((item: any) => {
            if (item.projectList && item.projectList.length > 0) {
              item.projectList.map((citem: any) => {
                const items = { ...item }
                if (citem.startDate) {
                  // 获取开始时间
                  const start = new Date(citem.startDate).getDate()
                  // 获取结束日期
                  // const end = new Date('2022-06-18').getDate()
                  const end = citem.endDate
                    ? new Date(citem.endDate).getDate()
                    : dates
                  // console.log('first', start, end)
                  for (let i = start; i <= end; i++) {
                    items[`day-${i}`] = citem.projectName
                    items.status = citem.status
                  }
                  items.projectList = [citem]
                }
                newData.push(items)
              })
            } else {
              newData.push(item)
            }
          })
        }
        console.log('first', newData)
        tableData.value = newData
      }
    }

    // 职位列表
    const getDesignPosts = async () => {
      const { code, data } = await getDesignPost()
      if (code === 200) {
        designPosts.value = data || []
      }
    }

    // 合并单元格
    const objectSpanMethod = ({ rowIndex, columnIndex }: any) => {
      if (columnIndex === 0) {
        const _row = spanArr.value[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 1) {
        const _row = spanArr.value[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }

    // 通用行合并函数（将相同多列数据合并为一行）
    const mergeRowMethod: VxeTablePropTypes.SpanMethod = ({
      row,
      columnIndex,
      column
    }) => {
      // console.log(row)
      const dates: number = getMonthDay(query.value.year, query.value.month - 1)
      var fields = []
      for (let index = 0; index < dates; index++) {
        fields.push(`day-${index + 1}`)
      }
      const cellValue = column.field
      const index = 0
      if (fields.includes(cellValue)) {
        if (row.projectList.length > 0 && columnIndex !== 0) {
          const startMonth: any = moment(row.projectList[index].startDate).month() + 1
          const endMonth: any = moment(row.projectList[index].endDate).month() + 1
          const startDate:any = String(new Date(row.projectList[index].startDate).getDate())
          const endDate:any = String(new Date(row.projectList[index].endDate).getDate())
          const days:any = cellValue.split('-')[1]
          if (query.value.month === startMonth && query.value.month === endMonth) {
            if (startDate === days) {
              const diffDays = moment(row.projectList[index].endDate).diff(moment(row.projectList[index].startDate), 'days') + 1
              return { rowspan: 1, colspan: diffDays }
            } else if (Number(days) <= Number(endDate) && Number(days) > Number(startDate)) {
              return { rowspan: 0, colspan: 0 }
            }
          } else if (query.value.month > startMonth && query.value.month === endMonth) {
            if (days === 1) {
              const diffDays = moment(row.projectList[index].endDate).diff(moment(`${query.value.year}-${query.value.month}-1`), 'days') + 1
              return { rowspan: 1, colspan: diffDays }
            } else if (Number(days) <= Number(endDate) && Number(days) > 1) {
              return { rowspan: 0, colspan: 0 }
            }
          } else if (query.value.month === startMonth && query.value.month < endMonth) {
            const endDays = moment(moment(`${query.value.year}-${query.value.month}-1`).endOf('month').format('YYYY-MM-DD')).date()
            if (startDate === days) {
              const diffDays = moment(moment(`${query.value.year}-${query.value.month}-1`).endOf('month').format('YYYY-MM-DD')).diff(moment(row.projectList[index].startDate), 'days') + 1
              return { rowspan: 1, colspan: diffDays }
            } else if (Number(days) <= endDays && Number(days) > Number(startDate)) {
              return { rowspan: 0, colspan: 0 }
            }
          }
        }
      }
    }
    onMounted(() => {
      nextTick(() => {
        height.value = document.documentElement.clientHeight - 230
      })
      getPlanProjectScheduleLists()
      getDesignPosts()
    })
    return {
      changeMonth,
      year,
      painterName,
      query,
      designPosts,
      tableHeader,
      getPlanProjectScheduleLists,
      tableData,
      objectSpanMethod,
      mergeRowMethod,
      demo3,
      height,
      projectStatus
    }
  }
})
</script>

<style lang="less" scoped>
.shop-calendar-container {
  .table-item {
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #333;
  }
  /deep/ .vxe-table--render-default .vxe-cell {
    padding: 0;
  }
  /deep/ .vxe-body--column {
    padding: 0;
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
  width: 100%;
  .filtter-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .left-filter {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      & > div {
        margin-right: 10px;
      }
    }
  }
}
</style>
