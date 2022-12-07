<template>
  <div class="receipt-container">
    <div class="filtter-content d-flex d-f-row-bet">
      <div class="filtter-content-left d-flex">
        <el-date-picker
          style="margin-right: 10px"
          type="month"
          placeholder="请选择年月"
          @change="changeYear"
          v-model="year"
        />
        <div class="filtter-content-right">
          <d-add text="添加发票" v-permission="'add'" @click="openModal" />
        </div>
        <d-tab
          v-for="tab in tabs"
          :key="tab.id"
          :text="tab.text"
          :mr="10"
          :active="tab.id === activeTabIndex"
          @click="changeTab(tab.id)"
        />
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-content">
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
          field="invoiceNumber"
          fixed="left"
          title="发票编号"
          :width="50"
        />
        <template v-for="(head, index) in tableHeaderData" :key="index">
          <vxe-column
            v-permission="'table'"
            v-if="head.prop === 'id'"
            fixed="right"
            field="id"
            title="操作"
            :width="120"
          >
            <template #default="{ row }">
              <div style="display: flex">
                <el-button
                  v-permission="'edit'"
                  type="text"
                  size="small"
                  @click="openModal(row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  v-permission="'delete'"
                  @click="deleteReceipt(row.id)"
                  size="small"
                  >删除</el-button
                >
              </div>
            </template>
          </vxe-column>
          <vxe-column
            v-else
            :field="head.prop"
            :title="head.name"
            :width="head.width"
          >
            <template #default="{ row }">
              <span v-if="head.prop === 'pppaymentStatus'">
                {{
                  row.paymentStatus === '0'
                    ? '未收款'
                    : row.paymentStatus === '1'
                    ? '已收款'
                    : ''
                }}
              </span>
              <div v-else-if="head.prop === 'skpz' || head.prop === 'fpsmj'">
                <!-- <el-button
                  @click="showFile(head.prop === 'skpz' ? row.skpz : row.fpsmj)"
                  type="text"
                  style="width: 100px; overflow: hidden"
                  >
                  {{head.prop === 'skpz'? row.skpzName: row.fpsmjName}}
                  </el-button
                > -->
                <span
                  class="link-btn"
                  @click="showFile(head.prop === 'skpz' ? row.skpz : row.fpsmj)"
                >
                  <span v-if="head.prop === 'skpz'">{{
                    row.skpzName ? row.skpzName : ''
                  }}</span>
                  <span v-if="head.prop === 'fpsmj'">{{
                    row.fpsmjName ? row.fpsmjName : '查看'
                  }}</span>
                </span>
                <!-- {{ row }} -->
              </div>
              <span v-else>{{ row[head.prop] }} </span>
            </template>
          </vxe-column>
        </template>
      </vxe-table>
    </div>
    <!-- 新增编辑 -->
    <el-drawer
      size="50%"
      v-model="addReceiptModal"
      :title="form.id ? '编辑发票' : '新增发票'"
      :with-header="true"
    >
      <template #title>
        <p class="t-c t-main-color f20">
          {{ form.id ? '编辑发票' : '新增发票' }}
        </p>
      </template>
      <div class="drawer-content d-flex d-f-row-bet">
        <div class="drawer-content-left">
          <el-form
            size="large"
            :rules="formRuls"
            :model="form"
            ref="leftModalRef"
            label-width="120px"
          >
            <el-form-item label="发票编号" prop="invoiceNumber">
              <el-input
                placeholder="请输入发票编号"
                v-model="form.invoiceNumber"
              />
            </el-form-item>
            <el-form-item label="包含项目" prop="projectList">
              <el-select
                v-model="form.projectList"
                multiple
                placeholder="请选择项目"
                style="width: 100%"
              >
                <el-option
                  v-for="item in projectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="收款公司" prop="operatingCompanyId">
              <el-select
                v-model="form.operatingCompanyId"
                placeholder="请选择收款公司"
                style="width: 100%"
                @change="changeBank('operating')"
              >
                <el-option
                  v-for="item in operatingCompanyList"
                  :key="item.id"
                  :label="item.fullName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="收款银行账号" prop="collectionBankId">
              <el-select
                v-model="form.collectionBankId"
                placeholder="请选择收款账号"
                style="width: 100%"
              >
                <el-option
                  v-for="item in operatingCompanyBankList"
                  :key="item.id"
                  :label="item.account"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="发票扫描件" prop="contractFileUrl">
              <div class="upload-content" v-if="!form.contractFileUrl">
                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                <input
                  class="file-input"
                  type="file"
                  @change="uploadConFileChange"
                />
              </div>
              <div v-else class="invoice-file">
                <img :src="form.contractFileUrl" alt="" srcset="" />
                <el-icon :size="24" @click="deleteImg('con')" class="delete"
                  ><CircleCloseFilled color="#F56C6C"
                /></el-icon>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="drawer-content-right">
          <el-form
            size="large"
            :model="form"
            :rules="formRuls"
            ref="rightModalRef"
            label-width="120px"
          >
            <el-form-item label="开票日期" prop="billingDate">
              <el-date-picker
                style="width: 100%"
                v-model="form.billingDate"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择开票日期"
              />
            </el-form-item>

            <el-form-item label="付款公司" prop="partyACompanyId">
              <el-select
                style="width: 100%"
                v-model="form.partyACompanyId"
                placeholder="请选择付款公司"
                @change="changeBank('com')"
              >
                <el-option
                  v-for="design in aCompanyList"
                  :key="design.id"
                  :label="design.fullName"
                  :value="design.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="付款银行账号" prop="paymentBankId">
              <el-select
                style="width: 100%"
                v-model="form.paymentBankId"
                placeholder="请选择付款银行账号"
              >
                <el-option
                  v-for="design in companyBankList"
                  :key="design.id"
                  :label="design.fullName"
                  :value="design.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="收款凭证" prop="skpz">
              <div class="upload-content" v-if="!form.skpz">
                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                <input
                  class="file-input"
                  type="file"
                  @change="uploadSkpzFileChange"
                />
              </div>
              <div v-else class="invoice-file">
                <img :src="form.skpz" alt="" srcset="" />
                <el-icon :size="24" @click="deleteImg('skpz')" class="delete"
                  ><CircleCloseFilled color="#F56C6C"
                /></el-icon>
              </div>
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
      </div>
      <template #footer>
        <div class="t-c">
          <el-button
            class="btn"
            type="primary"
            style="width: 200px"
            size="large"
            @click="saveReceiptClick(leftModalRef, rightModalRef)"
            >保存</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, nextTick } from 'vue'
import {
  getInvoiceReceiptList,
  getPartyACompanyList,
  getAllProjectList,
  getOperatingCompanyList,
  saveInvoiceReceipt,
  updateInvoiceReceipt,
  logicDeleteInvoiceReceipt
} from '@/request/index'
import { Plus, CircleCloseFilled } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { VxeTablePropTypes } from 'vxe-table'
import { uploadFile } from '@/utils/index'
const tableHeaderData = [
  // { name: '发票编号', prop: 'invoiceNumber', width: 120 },
  { name: '开票日期', prop: 'billingDate' },
  { name: '甲方(付款)公司简称', prop: 'partyACompanyShortName' },
  { name: '运营(收款)公司简称', prop: 'operatingCompanyShortName' },
  { name: '付款银行名称', prop: 'paymentBankName' },
  { name: '付款银行账号', prop: 'paymentBankAccount' },
  { name: '收款银行名称', prop: 'collectionBankName' },
  { name: '收款银行账号', prop: 'collectionBankAccount' },
  { name: '项目名称', prop: 'ppname' },
  { name: '项目总价', prop: 'pptotalPrice' },
  { name: '已收款金额', prop: 'pppaymentAmount' },
  { name: '收款状态', prop: 'pppaymentStatus' },
  { name: '收款凭证', prop: 'skpz' },
  { name: '发票扫描件', prop: 'fpsmj' },
  { name: '备注', prop: 'remark' },
  { name: '操作', prop: 'id', width: 120 }
]
export default defineComponent({
  components: {
    Plus,
    CircleCloseFilled
  },
  setup () {
    const activeTabIndex: Ref<number> = ref(-1)
    const height: Ref<number> = ref(300)
    const year: any = ref(new Date()) // 日期
    const tableLoading = ref(false)
    const addReceiptModal = ref(false)
    const aCompanyList: any = ref([]) // 甲方公司
    const operatingCompanyList: any = ref([]) // 运营中公司
    const operatingCompanyBankList: any = ref([]) // 收款银行账号列表
    const companyBankList: any = ref([]) // 付款银行列表
    const tabs = ref([{ text: '所有发票', id: -1 }])
    const tableData: any = ref([])
    const projectList: any = ref([])
    const rightModalRef = ref<FormInstance>()
    const leftModalRef = ref<FormInstance>()
    const formRuls: any = ref({
      id: '',
      invoiceNumber: [
        { required: true, message: '请输入发票编号', trigger: 'blur' }
      ], // 发票编号
      billingDate: [
        { required: true, message: '请选择开票日期', trigger: 'blur' }
      ], // 开票日期
      collectionBankId: [
        { required: true, message: '请选择收款银行', trigger: 'blur' }
      ], // 收款银行id
      fileList: [{ required: true, message: '请上传文件', trigger: 'blur' }], // 发票，收款凭证文件列表
      operatingCompanyId: [
        { required: true, message: '请选择收款公司', trigger: 'blur' }
      ], // 收款公司id，运营公司
      partyACompanyId: [
        { required: true, message: '请选择付款公司', trigger: 'blur' }
      ], // 付款公司id，甲方公司
      paymentBankId: [
        { required: true, message: '请选择付款账号', trigger: 'blur' }
      ], // 付款银行id
      projectList: [
        {
          required: true,
          type: 'array',
          message: '请选择项目',
          trigger: 'blur'
        }
      ], // 项目列表 id
      contractFileUrl: [
        { required: true, message: '请上传合同扫描件', trigger: 'blur' }
      ] // 合同扫描件
      // skpz: [{ required: true, message: '请上传收款凭证', trigger: 'blur' }], // 收款凭证
      // remark: [{ required: true, message: '请输入备注信息', trigger: 'blur' }] // 备注信息
    })

    const changeTab = (id: number): void => {
      if (activeTabIndex.value !== id) {
        activeTabIndex.value = id
        getInvoiceReceiptLists()
      }
    }
    // 选择年月，获取列表
    const changeYear = () => {
      getInvoiceReceiptLists()
    }
    // 列表
    const getInvoiceReceiptLists = async () => {
      tableLoading.value = true
      const query = {
        limit: -1,
        month: new Date(year.value).getMonth() + 1,
        page: 1,
        partyACompanyId:
          activeTabIndex.value === -1 ? '' : activeTabIndex.value,
        year: new Date(year.value).getFullYear()
      }
      const { code, data } = await getInvoiceReceiptList({
        ...query
      })
      if (code === 200) {
        // tableData.value = data?.list
        // 处理数据
        const newData: any = []
        ;(data.list || []).map((item: any) => {
          if (item.projectList && item.projectList.length > 0) {
            // 处理文件
            let fpsmj = ''
            let fpsmjName = ''
            let skpz = ''
            let skpzName = ''
            if (item.fileList && item.fileList) {
              item.fileList.map((file: any) => {
                if (file.type === '1') {
                  skpz = file.url
                  skpzName = file.originalFileName
                }
                if (file.type === '2') {
                  fpsmj = file.url
                  fpsmjName = file.originalFileName
                }
              })
            }
            item.projectList.map((citem: any) => {
              const newItem = { ...item, fpsmj, skpz, fpsmjName, skpzName }
              const { id, name, paymentAmount, paymentStatus, totalPrice } =
                citem
              newItem.ppid = id
              newItem.ppname = name
              newItem.pppaymentAmount = paymentAmount
              newItem.paymentStatus = paymentStatus
              newItem.pptotalPrice = totalPrice
              newData.push(newItem)
            })
          } else {
            // 处理文件
            let fpsmj = ''
            let skpz = ''
            let fpsmjName = ''
            let skpzName = ''
            if (item.fileList && item.fileList) {
              item.fileList.map((file: any) => {
                if (file.type === '1') {
                  skpz = file.url
                  skpzName = file.originalFileName
                }
                if (file.type === '2') {
                  fpsmj = file.url
                  fpsmjName = file.originalFileName
                }
              })
            }
            const newItem = {
              ...item,
              fpsmj,
              skpz,
              fpsmjName,
              skpzName
            }
            newData.push(newItem)
          }
        })
        tableData.value = newData
      }
      tableLoading.value = false
    }
    // 公司列表
    const getPartyACompanyLists = async () => {
      const { code, data } = await getPartyACompanyList({
        status: '',
        page: 1,
        limit: -1
      })
      if (code === 200) {
        aCompanyList.value = data.list || []
        ;(data.list || []).map((item: any) => {
          tabs.value.push({
            ...item,
            text: item.fullName
          })
        })
      }
    }
    // 项目列表
    const getAllProjectLists = async () => {
      const { code, data } = await getAllProjectList({
        limit: -1,
        page: 1
      })
      if (code === 200) {
        projectList.value = data.list || []
      }
    }
    // 收款公司列表（运营中的公司）
    const getOperatingCompanyLists = async () => {
      const { code, data } = await getOperatingCompanyList({
        limit: -1,
        page: 1,
        operatingStatus: 0
      })
      if (code === 200) {
        operatingCompanyList.value = data.list || []
      }
    }
    // 选择公司，获取银行列表
    const changeBank = (type: string) => {
      if (type === 'operating') {
        // 收款公司银行
        const index = operatingCompanyList.value.findIndex(
          (item: any) => item.id === form.value.operatingCompanyId
        )
        if (index > -1) {
          const banklit = operatingCompanyList.value[index].bankList
          operatingCompanyBankList.value = banklit
        } else {
          operatingCompanyBankList.value = []
        }
      }
      if (type === 'com') {
        // 付款公司
        const index = aCompanyList.value.findIndex(
          (item: any) => item.id === form.value.partyACompanyId
        )
        if (index > -1) {
          const banklit = aCompanyList.value[index].bankList
          companyBankList.value = banklit
        } else {
          companyBankList.value = []
        }
      }
      if (type === 'all') {
        // 收款公司银行
        const oindex = operatingCompanyList.value.findIndex(
          (item: any) => item.id === form.value.operatingCompanyId
        )
        if (oindex > -1) {
          const banklit = operatingCompanyList.value[oindex].bankList
          operatingCompanyBankList.value = banklit
        } else {
          operatingCompanyBankList.value = []
        }
        // 付款公司
        const cindex = aCompanyList.value.findIndex(
          (item: any) => item.id === form.value.partyACompanyId
        )
        if (cindex > -1) {
          const banklit = aCompanyList.value[cindex].bankList
          companyBankList.value = banklit
        } else {
          companyBankList.value = []
        }
      }
    }

    // 通用行合并函数（将相同多列数据合并为一行）
    const mergeRowMethod: VxeTablePropTypes.SpanMethod = ({
      row,
      _rowIndex,
      column,
      visibleData
    }) => {
      const fields = ['invoiceNumber', 'id']
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
    // 保存，编辑
    const saveReceiptClick = async (
      leftModalRef: FormInstance | undefined,
      rightModalRef: FormInstance | undefined
    ) => {
      if (!leftModalRef) return
      if (!rightModalRef) return
      const sucess = (code: number) => {
        if (code === 200) {
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
          // 获取新的列表
          getInvoiceReceiptLists()
          // 关闭弹窗
          addReceiptModal.value = false
          rightModalRef.resetFields()
          leftModalRef.resetFields()
          // resetFields()
        }
      }
      leftModalRef.validate(async (valid) => {
        if (valid) {
          const {
            id,
            invoiceNumber, // 发票编号
            billingDate, // 开票日期
            collectionBankId, // 收款银行id
            fileList, // 发票，收款凭证文件列表
            operatingCompanyId, // 收款公司id，运营公司
            partyACompanyId, // 付款公司id，甲方公司
            paymentBankId, // 付款银行id
            projectList, // 项目列表 id
            contractFileUrl, // 发票扫描件
            contractFileUrlOriginalFileName,
            skpzOriginalFileName,
            skpz, // 收款凭证
            remark // 备注信息
          } = form.value
          const query: any = {
            // ...form
            id,
            fileList,
            invoiceNumber,
            billingDate,
            collectionBankId,
            partyACompanyId,
            operatingCompanyId,
            paymentBankId,
            projectList: projectList.map((id: number) => ({ projectId: id })),
            remark
          }
          console.log('first', fileList)
          // 处理文件
          if (fileList && fileList.length > 0) {
            // 编辑
            query.fileList.forEach((file: any) => {
              if (file.type === '1') {
                file.url = skpz
                file.originalFileName = skpzOriginalFileName
              } else if (file.type === '2') {
                file.url = contractFileUrl
                file.originalFileName = contractFileUrlOriginalFileName
              }
            })
          } else {
            // 新增
            query.fileList = []
            if (skpz && skpzOriginalFileName) {
              query.fileList.push({
                type: '1',
                originalFileName: skpzOriginalFileName,
                url: skpz
              })
            }
            if (contractFileUrl && contractFileUrlOriginalFileName) {
              query.fileList.push({
                type: '2',
                url: contractFileUrl,
                originalFileName: contractFileUrlOriginalFileName
              })
            }
          }
          rightModalRef.validate(async (rightValid) => {
            if (rightValid) {
              if (!form.value.id) {
                // 新增
                const { code } = await saveInvoiceReceipt(query)
                if (code === 200) {
                  sucess(code)
                }
              } else {
                // 编辑
                const { code } = await updateInvoiceReceipt(query)
                if (code === 200) {
                  sucess(code)
                }
              }
            }
          })
        } else {
          rightModalRef.validate()
        }
      })
    }

    // 发票扫描件上传
    const uploadConFileChange = async (e: any) => {
      if (e.target.files && e.target.files[0]) {
        const { code, data } = await uploadFile(e.target.files[0])
        if (code === 200) {
          form.value.contractFileUrl = data[0].url
          form.value.contractFileUrlOriginalFileName = data[0].originalFileName
          ;(leftModalRef.value as any).validateField(['invoiceFileUrl'])
        }
      }
    }

    // 收款凭证
    const uploadSkpzFileChange = async (e: any) => {
      if (e.target.files && e.target.files[0]) {
        const { code, data } = await uploadFile(e.target.files[0])
        if (code === 200) {
          form.value.skpz = data[0].url
          form.value.skpzOriginalFileName = data[0].originalFileName
          ;(rightModalRef.value as any).validateField(['skpz'])
        }
      }
    }

    // 删除图片
    const deleteImg = (type: string) => {
      if (type === 'con') {
        form.value.contractFileUrl = ''
        form.value.contractFileUrlOriginalFileName = ''
        ;(leftModalRef.value as any).validateField(['contractFileUrl'])
      } else {
        form.value.skpz = ''
        form.value.skpzOriginalFileName = ''
        ;(leftModalRef.value as any).validateField(['skpz'])
      }
    }
    // 弹窗内容
    const form = ref({
      id: '',
      invoiceNumber: '', // 发票编号
      billingDate: '', // 开票日期
      collectionBankId: '', // 收款银行id
      fileList: [], // 发票，收款凭证文件列表
      operatingCompanyId: '', // 收款公司id，运营公司
      partyACompanyId: '', // 付款公司id，甲方公司
      paymentBankId: '', // 付款银行id
      projectList: [], // 项目列表 id
      contractFileUrl: '', // 合同扫描件
      skpz: '', // 收款凭证
      contractFileUrlOriginalFileName: '', // 合同扫描件名称
      skpzOriginalFileName: '', // 收款凭证名称
      remark: '' // 备注信息
    })
    // 打开弹窗
    const openModal = (row: any) => {
      if (row && row.id) {
        // 编辑
        const newRow = JSON.parse(JSON.stringify(row))
        for (const key in form.value) {
          form.value[key] = newRow[key]
        }
        // 处理文件
        // form.value.fileList = []
        form.value.skpz = newRow.skpz
        form.value.skpzOriginalFileName = newRow.skpzName
        form.value.contractFileUrl = newRow.fpsmj
        form.value.contractFileUrlOriginalFileName = newRow.fpsmjName
        // 处理项目
        const newProject: any = []
        if (newRow.projectList && newRow.projectList.length > 0) {
          newRow.projectList.map((item: any) => {
            newProject.push(item.id)
          })
        }
        form.value.projectList = newProject
        // 处理银行列表
        changeBank('all')
      } else {
        // 新增
        for (const key in form.value) {
          if (typeof form.value[key] === 'string') {
            form.value[key] = ''
          } else {
            form.value[key] = []
          }
        }
      }
      addReceiptModal.value = true
    }
    // 文件查看
    const showFile = (url: string) => {
      window.open(url, '_blank')
    }
    // 删除
    const deleteReceipt = async (id: string) => {
      ElMessageBox.confirm('确定删除该项吗?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await logicDeleteInvoiceReceipt(id)
        if (code === 200) {
          getInvoiceReceiptLists()
        }
      })
    }
    onMounted(() => {
      getInvoiceReceiptLists()
      getPartyACompanyLists()
      getAllProjectLists()
      getOperatingCompanyLists()
      nextTick(() => {
        height.value = document.documentElement.clientHeight - 160
      })
    })

    return {
      activeTabIndex,
      changeTab,
      tabs,
      tableHeaderData,
      tableData,
      height,
      year,
      changeYear,
      tableLoading,
      addReceiptModal,
      form,
      openModal,
      aCompanyList,
      projectList,
      operatingCompanyList,
      operatingCompanyBankList,
      changeBank,
      companyBankList,
      formRuls,
      rightModalRef,
      leftModalRef,
      saveReceiptClick,
      uploadConFileChange,
      uploadSkpzFileChange,
      deleteImg,
      mergeRowMethod,
      showFile,
      deleteReceipt
    }
  }
})
</script>

<style lang="less" scoped>
.receipt-container {
  box-sizing: border-box;
  .filtter-content {
    margin-bottom: 20px;
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
  .upload-content {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    .file-input {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
  .invoice-file {
    width: 80px;
    height: 80px;
    position: relative;
    img {
      width: 80px;
      height: 80px;
    }
    .delete {
      position: absolute;
      right: -12px;
      top: -12px;
      z-index: 10;
      cursor: pointer;
    }
  }
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  .el-icon.avatar-uploader-icon {
    font-size: 26px;
    color: #8c939d;
    text-align: center;
  }
  .history-wage-list {
    .list {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
      .list-item {
        width: 50%;
      }
      .left {
        margin-right: 10px;
      }
      .right {
        margin-left: 10px;
      }
    }
  }
  .link-btn {
    cursor: pointer;
    color: #409eff;
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
  .filtter-content-right {
    margin-right: 10px;
  }
}
</style>
