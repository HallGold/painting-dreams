<!--
 * @Description:
 * @Author: Author
 * @Date: 2022-05-20 09:32:48
 * @LastEditTime: 2022-06-14 10:45:20
 * @LastEditors: Author
-->
<template>
  <div style="max-height: 560px; overflow: auto">
    <el-table
      border
      :stripe="true"
      v-loading="operatingCompany.tableLoading"
      size="large"
      :data="operatingCompany.tableData"
    >
      <el-table-column
        align="center"
        v-for="(head, index) in headerData"
        :key="index"
        :prop="head.key"
        :label="head.name"
      />
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue'
import { getOperatingCompanyList } from '@/request/index'
const headerData = [
  { name: '简称', key: 'shortName' },
  { name: '公司全名', key: 'fullName' },
  { name: '邮寄合同地址', key: 'contractAddress' },
  { name: '税号', key: 'taxId' },
  { name: '联系电话', key: 'phone' },
  { name: '银行名称', key: 'bankName' },
  { name: '银行账号', key: 'bankAccount' },
  { name: '备注', key: 'remark' }
]
export default defineComponent({
  setup () {
    interface OperatingCompanyProps {
      tableData: Array<any>
      tableLoading: boolean
    }
    const getOperatingCompanyLists = async () => {
      operatingCompany.tableLoading = true
      const { code, data } = await getOperatingCompanyList({
        limit: -1,
        page: 1,
        operatingStatus: 1
      })

      if (code === 200 && data) {
        operatingCompany.tableData = (data.list || []).map((item: any) => {
          const {
            name = '',
            account = '',
            id = ''
          } = item.bankList ? (item.bankList[0] ? item.bankList[0] : {}) : {}
          item.bankName = name
          item.bankAccount = account
          item.bankId = id
          return item
        })
      }
      operatingCompany.tableLoading = false
    }
    onMounted(() => {
      getOperatingCompanyLists()
    })
    const operatingCompany: OperatingCompanyProps = reactive({
      tableData: [],
      tableLoading: false
    })
    return {
      operatingCompany,
      headerData
    }
  }
})
</script>

<style lang="less" scoped></style>
