<template>
  <div class="cooperative-company-container">
    <div class="filter-header d-flex d-f-row-bet">
      <div class="filter-left d-flex d-f-row-center">
        <d-tab
          v-for="tab in tabs"
          :key="tab.id"
          :text="tab.text"
          :mr="10"
          @click="changeTab(tab.id)"
          :active="activeTab === tab.id"
        />
      </div>
      <div class="filter-right">
        <d-add text="添加公司" v-permission="'add'" @click="openAddModal" />
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-content">
      <el-table
        border
        :stripe="true"
        :height="height"
        v-loading="tableLoading"
        size="large"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          v-for="(head, index) in tableHeaderData"
          :key="index"
          :prop="head.prop"
          :label="head.name"
          :width="head.width"
        >
          <template #default="scope">
            <template v-if="scope.column.property === 'status'">
              {{
                scope.row[scope.column.property] === '0' ? '待合作' : '合作中'
              }}
            </template>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          v-permission="'table'"
          label="操作"
          width="120"
        >
          <template #default="scope">
            <div style="width: 120px">
              <el-button
                type="text"
                size="small"
                v-permission="'edit'"
                @click="openAddModal(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                v-permission="'delete'"
                @click="deleteComp(scope.row.id)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加公司弹窗 -->
    <el-drawer
      size="50%"
      v-model="addCompanyModal"
      :title="form.id ? '编辑公司' : '新增公司'"
      v-loading="modalLoading"
      :with-header="true"
    >
      <template #title>
        <p class="t-c t-main-color f20">
          {{ form.id ? '编辑公司' : '新增公司' }}
        </p>
      </template>
      <div class="drawer-content d-flex d-f-row-bet">
        <div class="drawer-content-left">
          <el-form
            size="large"
            ref="companyLeftRef"
            :rules="formRules"
            :model="form"
            label-width="110px"
          >
            <el-form-item label="简称" prop="shortName">
              <el-input placeholder="请输入简称" v-model="form.shortName" />
            </el-form-item>
            <el-form-item label="合作状态" prop="status">
              <el-select
                style="width: 100%"
                v-model="form.status"
                placeholder="请选择合作状态"
              >
                <el-option label="待合作" value="0" />
                <el-option label="合作中" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input placeholder="请输入联系电话" v-model="form.phone" />
            </el-form-item>
            <el-form-item label="银行名称" prop="bankListName">
              <el-input
                placeholder="请输入银行名称"
                v-model="form.bankListName"
              />
            </el-form-item>
            <el-form-item label="银行账号" prop="bankListAccount">
              <el-input
                placeholder="请输入银行账号"
                v-model="form.bankListAccount"
              />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                placeholder="请输入备注"
                v-model="form.remark"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="drawer-content-right">
          <el-form
            size="large"
            ref="companyRightRef"
            :rules="formRules"
            :model="form"
            label-width="130px"
          >
            <el-form-item label="公司全名" prop="fullName">
              <el-input placeholder="请输入公司全名" v-model="form.fullName" />
            </el-form-item>
            <el-form-item label="合同地址" prop="contractAddress">
              <el-input
                placeholder="请输入合同地址"
                v-model="form.contractAddress"
              />
            </el-form-item>
            <el-form-item label="税号" prop="taxId">
              <el-input placeholder="请输入税号" v-model="form.taxId" />
            </el-form-item>
            <el-form-item label="客户联系方式" prop="customerContactInfo">
              <el-input
                placeholder="请输入客户联系方式"
                v-model="form.customerContactInfo"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <div class="t-c">
          <el-button
            class="btn"
            type="primary"
            style="width: 200px"
            size="large"
            @click="saveCompanyModal(companyLeftRef, companyRightRef)"
            >保存</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, reactive, onMounted, nextTick } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getPartyACompanyList,
  savePartyACompany,
  updatePartyACompany,
  logicDeletePartyACompany
} from '@/request/index'
const tableHeaderData = [
  { name: '简称', prop: 'shortName', width: 120 },
  { name: '公司全名', prop: 'fullName', width: 160 },
  { name: '合作状态', prop: 'status', width: 120 },
  { name: '邮寄合同地址', prop: 'contractAddress', width: 160 },
  { name: '联系电话', prop: 'phone', width: 160 },
  { name: '税号', prop: 'taxId', width: 140 },
  { name: '银行账号/名称', prop: 'bankInfo', width: 160 },
  { name: '客户联系方式', prop: 'customerContactInfo', width: 160 },
  { name: '备注', prop: 'remark', width: 200 }
]
export default defineComponent({
  setup () {
    const tabs = reactive([
      { text: '全部公司', id: 2 },
      { text: '合作中公司', id: 1 },
      { text: '待合作公司', id: 0 }
    ])
    const activeTab: Ref<number> = ref(2)
    const tableLoading: Ref<boolean> = ref(false)
    const addCompanyModal: Ref<boolean> = ref(false)
    const companyLeftRef = ref<FormInstance>()
    const companyRightRef = ref<FormInstance>()
    const tableData = ref([])
    const modalLoading = ref(false)
    const formRules = {
      bankListName: [
        { required: true, message: '请输入银行卡名称', trigger: 'blur' }
      ], // 银行卡名称
      bankListAccount: [
        { required: true, message: '请输入银行卡名称', trigger: 'blur' }
      ], // 银行卡账号
      fullName: [{ required: true, message: '请选择公司', trigger: 'change' }], // 公司全称
      phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }], // 联系电话
      remark: [{ required: true, message: '请输入备注信息', trigger: 'blur' }], // 备注
      shortName: [
        { required: true, message: '请输入公司简称', trigger: 'blur' }
      ], // 简称
      status: [
        { required: true, message: '请选择合作状态', trigger: 'change' }
      ], // 合作状态 0待合作 1合作中
      taxId: [{ required: true, message: '请输入税号', trigger: 'blur' }], // 税号
      customerContactInfo: [
        { required: true, message: '请输入客户联系电话', trigger: 'blur' }
      ], // 客户联系电话
      contractAddress: [
        { required: true, message: '请输入合同地址', trigger: 'blur' }
      ] // 合同地址
    }
    const form = reactive({
      id: '',
      bankListName: '', // 银行卡名称
      bankListAccount: '', // 银行卡账号
      fullName: '', // 公司全称
      phone: '', // 联系电话
      remark: '', // 备注
      shortName: '', // 简称
      status: '', // 合作状态 0待合作 1合作中
      taxId: '', // 税号
      customerContactInfo: '', // 客户联系电话
      contractAddress: '' // 合同地址
    })
    const changeTab = (id: number): void => {
      if (activeTab.value !== id) {
        activeTab.value = id
        getPartyACompanyLists()
      }
    }
    const height: Ref<number> = ref(500)
    const getPartyACompanyLists = async () => {
      tableLoading.value = true
      try {
        const query = {
          limit: -1,
          page: 1,
          status: activeTab.value === 2 ? '' : activeTab.value
        }
        const { code, data } = await getPartyACompanyList(query)
        if (code === 200) {
          tableData.value = data.list.map((item: any) => {
            // 获取银行信息
            const bankInfo: any = item.bankList.map((bank: any) => {
              return bank.name + '/' + bank.account
            })
            return { ...item, bankInfo: bankInfo.join(',') }
          })
        }
      } finally {
        tableLoading.value = false
      }
    }
    // 打开弹窗
    const openAddModal = async (row: any) => {
      addCompanyModal.value = true
      modalLoading.value = true
      if (row && row.id) {
        for (const key in form) {
          form[key] = row[key] || ''
        }
        const { bankList } = row
        if (bankList && bankList[0]) {
          const { name, account } = bankList[0]
          form.bankListAccount = account
          form.bankListName = name
        }
      } else {
        for (const key in form) {
          form[key] = ''
        }
      }
      modalLoading.value = false
    }

    // 删除
    const deleteComp = async (id: string) => {
      ElMessageBox.confirm('确定删除该项吗?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await logicDeletePartyACompany(id)
        if (code === 200) {
          getPartyACompanyLists()
        }
      })
    }
    // 新增编辑保存
    const saveCompanyModal = async (
      companyLeftRef: FormInstance | undefined,
      companyRightRef: FormInstance | undefined
    ) => {
      // 新增编辑提交
      if (!companyLeftRef) return
      if (!companyRightRef) return
      const sucess = (code: number) => {
        if (code === 200) {
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
          // 获取新的列表
          getPartyACompanyLists()
          // 关闭弹窗
          addCompanyModal.value = false
        }
      }
      companyLeftRef.validate(async (valid) => {
        if (valid) {
          const query = {
            ...form,
            bankList: [
              {
                account: form.bankListAccount,
                name: form.bankListName
              }
            ]
          }
          companyRightRef.validate(async (rightValid) => {
            if (rightValid) {
              if (!form.id) {
                // 新增
                const { code } = await savePartyACompany(query)
                if (code === 200) {
                  sucess(code)
                }
              } else {
                // 编辑
                const { code } = await updatePartyACompany(query)
                if (code === 200) {
                  sucess(code)
                }
              }
            }
          })
        } else {
          companyRightRef.validate()
        }
      })
    }
    onMounted(() => {
      getPartyACompanyLists()
      nextTick(() => {
        height.value = document.documentElement.clientHeight - 160
      })
    })

    return {
      tabs,
      activeTab,
      changeTab,
      tableData,
      tableHeaderData,
      height,
      addCompanyModal,
      form,
      tableLoading,
      openAddModal,
      saveCompanyModal,
      companyLeftRef,
      companyRightRef,
      formRules,
      modalLoading,
      deleteComp
    }
  }
})
</script>

<style lang="less" scoped>
.cooperative-company-container {
  .table-content {
    margin-top: 20px;
  }
  .drawer-content {
    width: 100%;
    &-left {
      width: 50%;
      margin-right: 20px;
    }
    &-right {
      width: 50%;
    }
  }
}
</style>
