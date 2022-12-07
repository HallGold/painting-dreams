<template>
  <div class="administration-cost-container">
    <!-- 固定成本 -->
    <div class="fixed-cost-box">
      <div class="filter-header d-flex d-f-col-center d-f-row-bet">
        <div class="filter-left d-flex d-f-col-center">
          <d-tab :mr="10" text="固定成本" />
          <el-date-picker
            @change="changeFixedCostsList"
            v-model="fixedCosts.query.date"
            size="large"
            type="month"
            placeholder="请选择年月"
          />
        </div>
        <div class="filter-right">
          <d-add v-permission="'add'" @click="openFixedCostsModal" text="添加成本" />
        </div>
      </div>
      <div class="table-content">
        <el-table
          border
          :stripe="true"
          height="250"
          size="large"
          :data="fixedCosts.tableData"
          v-loading="fixedCosts.tableLoading"
          style="width: 100%"
        >
          <el-table-column
            v-for="(head, index) in fixedCosts.tabHeader"
            :key="index"
            :prop="head.prop"
            :label="head.name"
          >
            <template #default="scope">
              <template v-if="scope.column.property === 'payFileUrl'">
                <img
                  style="max-width: 160px; max-height: 160px"
                  :src="scope.row.payFileUrl"
                  alt=""
                />
              </template>
            </template>
          </el-table-column>
          <el-table-column fixed="right" v-permission="'table'" label="操作" width="150">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                v-permission="'edit'"
                @click="openFixedCostsModal(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                v-permission="'delete'"
                @click="deleteFixedCosts(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <p>总计费用：{{ fixedCosts.totalCount }}</p>
      </div>
    </div>
    <!-- 管理人员成本 -->
    <div class="management-cost-box">
      <div class="filter-header d-flex d-f-col-center d-f-row-bet">
        <div class="filter-left d-flex d-f-col-center">
          <d-tab :mr="10" text="管理人员成本" />
          <el-date-picker
            size="large"
            @change="getManagerCostsLists"
            v-model="management.query.date"
            type="month"
            placeholder="请选择年月"
          />
        </div>
        <!-- <div class="filter-right">
          <d-add @click="openManagementModal" v-permission="'add'" text="添加成本" />
        </div> -->
      </div>
      <div class="table-content">
        <el-table
          border
          v-loading="management.tables.loading"
          :stripe="true"
          height="250"
          size="large"
          :data="management.tables.data"
          style="width: 100%"
        >
          <el-table-column
            v-for="(head, index) in management.tables.columns"
            :key="index"
            :prop="head.key"
            :label="head.name"
          />
          <!-- <el-table-column fixed="right" v-permission="'table'" label="操作" width="220">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                v-permission="'edit'"
                @click="openManagementModal(scope.row)"
                >编辑</el-button
              >
              <el-button
                @click="managementRowDelete(scope.row.id)"
                type="text"
                v-permission="'delete'"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
        <p>总计费用：{{ management.totalCount }}</p>
      </div>
    </div>

    <!-- 报销 -->
    <div class="reimbursement-cost-box">
      <div class="filter-header d-flex d-f-col-center d-f-row-bet">
        <div class="filter-left d-flex d-f-col-center">
          <d-tab :mr="10" text="报销" />
          <el-date-picker
            style="margin-right: 10px"
            size="large"
            type="month"
            v-model="reimbursements.query.date"
            @change="getReimbursementCostsLists"
            placeholder="请选择年月"
          />
          <d-tab
            v-for="tab in reimbursements.tabs"
            :active="tab.state === reimbursements.tabIndex"
            :key="tab.state"
            :mr="10"
            :width="140"
            @click="changEreimbursementsTab(tab)"
            :text="tab.name"
          />
        </div>
        <div class="filter-right">
          <d-add @click="openEreimbursementsModal" v-permission="'add'" text="添加报销" />
        </div>
      </div>
      <div class="table-content">
        <el-table
          border
          :stripe="true"
          height="250"
          :cell-class-name="cellClass"
          size="large"
          :data="reimbursements.tableData"
          style="width: 100%"
        >
          <el-table-column
            v-for="(head, index) in reimbursements.tabHeader"
            :key="index"
            :prop="head.prop"
            :label="head.name"
            :width="head.width"
          >
            <template #default="scope">
              <template v-if="scope.column.property === 'invoiceFileUrl'">
                <!-- <img style="max-width: 160px; max-height: 160px" :src="scope.row.invoiceFileUrl" alt="发票" /> -->
                <span
                  class="text-button"
                  @click="viewInvoiceFile(scope.row.invoiceFileUrl)"
                  >查看</span
                >
              </template>
              <template v-if="scope.column.property === 'auditStatus'">
                {{
                  scope.row[scope.column.property] === '0' ? '未审核' : '已审核'
                }}
              </template>
              <template v-if="scope.column.property === 'isInput'">
                {{ scope.row[scope.column.property] === '0' ? '否' : '是' }}
              </template>
              <template v-if="scope.column.property === 'reimbursementStatus'">
                {{
                  scope.row[scope.column.property] === '0' ? '未报销' : '已报销'
                }}
              </template>
              <!-- 默认展示内容 -->
              <!-- <template v-else>{{ scope.row[scope.column.property] }}</template> -->
            </template>
          </el-table-column>
          <el-table-column fixed="right" v-permission="'table'" label="操作" width="120">
            <template #default="scope">
              <div style="width: 120px">
                <el-button
                  type="text"
                  size="small"
                  v-permission="'edit'"
                  @click="openEreimbursementsModal(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  v-permission="'delete'"
                  @click="deleteReimbursements(scope.row.id)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <p>本月累计报销金额：{{ reimbursementsAmount || 0 }} 元</p>
    </div>
    <!-- 新增固定成本弹窗 -->
    <el-dialog
      v-model="fixedCosts.showModal"
      top="55px"
      v-loading="fixedCosts.modalLoading"
      :title="fixedCosts.modal.id ? '编辑成本' : '新增成本'"
      width="35%"
      center
    >
      <div class="rule-modal modal scrollbar">
        <el-form
          size="large"
          ref="fixedCostsModalRef"
          :model="fixedCosts.modal"
          :rules="fixedCosts.rules"
          label-width="120px"
        >
          <el-form-item label="名称" prop="name">
            <!-- <el-select
              style="width: 100%"
              v-model="fixedCosts.modal.name"
              @change="changeFixedCostsSelectList"
              placeholder="请选择费用名称"
            >
              <el-option v-for="item in fixedCosts.fixedCostsSelectList" :key="item.id" :label="item.name" :value="item.name" />
            </el-select> -->
            <el-input
              placeholder="请输入费用名称"
              v-model="fixedCosts.modal.name"
            />
          </el-form-item>
          <el-form-item label="费用" prop="amount">
            <el-input
              placeholder="请输入费用"
              v-model="fixedCosts.modal.amount"
            />
          </el-form-item>
          <el-form-item label="日期" prop="costsDate">
            <el-date-picker
              style="width: 100%"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              v-model="fixedCosts.modal.costsDate"
              placeholder="请选择时间"
            />
          </el-form-item>
          <!-- 图片上传 -->
          <el-form-item label="截图" prop="payFileUrl">
            <div class="upload-content" v-if="!fixedCosts.modal.payFileUrl">
              <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
              <input
                class="file-input"
                type="file"
                @change="uploadFileChange2"
              />
            </div>
            <div v-else class="invoice-file">
              <img :src="fixedCosts.modal.payFileUrl" alt="" srcset="" />
              <el-icon :size="24" @click="deleteImg2" class="delete"
                ><CircleCloseFilled color="#F56C6C"
              /></el-icon>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="btn"
            type="primary"
            style="width: 200px"
            size="large"
            @click="saveFixedCostsModal(fixedCostsModalRef)"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 新增管理人员弹窗 -->
    <el-dialog
      v-model="management.addManagementModal"
      top="55px"
      :title="management.modal.id ? '编辑成本' : '新增成本'"
      width="35%"
      center
    >
      <div class="rule-modal modal scrollbar">
        <el-form
          size="large"
          ref="managementModalRef"
          :model="management.modal"
          :rules="management.rules"
          label-width="120px"
        >
          <el-form-item label="姓名" prop="managerId">
            <el-select
              style="width: 100%"
              v-model="management.modal.managerId"
              @change="changeManagement"
              placeholder="请选择姓名"
            >
              <el-option
                v-for="user in userLists"
                :key="user.id"
                :label="user.name"
                :value="user.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="职位" prop="managePostName">
            <el-input
              placeholder="请选择姓名"
              disabled
              v-model="management.modal.managePostName"
            />
          </el-form-item>
          <el-form-item label="费用" prop="amount">
            <el-input
              placeholder="请输入成本费用"
              v-model="management.modal.amount"
            />
          </el-form-item>
          <el-form-item label="日期" prop="costsDate">
            <el-date-picker
              style="width: 100%"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              v-model="management.modal.costsDate"
              placeholder="请选择时间"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="btn"
            type="primary"
            style="width: 200px"
            size="large"
            @click="saveManagementModal(managementModalRef)"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- 新增报销弹窗 -->
    <el-drawer
      size="50%"
      v-model="reimbursements.addReimbursementModal"
      :title="reimbursements.modal.id ? '编辑报销' : '新增报销'"
      :with-header="true"
    >
      <template #title>
        <p class="t-c t-main-color f20">
          {{ reimbursements.modal.id ? '编辑报销' : '新增报销' }}
        </p>
      </template>
      <div class="drawer-content d-flex d-f-row-bet">
        <div class="drawer-content-left">
          <el-form
            size="large"
            ref="reimbursementsLeftRef"
            :rules="reimbursements.formRules"
            :model="reimbursements.modal"
            label-width="110px"
          >
            <el-form-item label="报销人" prop="reimburser">
              <el-input
                placeholder="请输入报销人姓名"
                v-model="reimbursements.modal.reimburser"
              />
            </el-form-item>
            <el-form-item label="订单" prop="orderNumber">
              <el-input
                placeholder="请输入订单号"
                v-model="reimbursements.modal.orderNumber"
              />
            </el-form-item>
            <el-form-item label="购买渠道" prop="buyWay">
              <el-input
                placeholder="请输入购买渠道"
                v-model="reimbursements.modal.buyWay"
              />
            </el-form-item>
            <el-form-item label="发票" prop="invoiceFileUrl">
              <div
                class="upload-content"
                v-if="!reimbursements.modal.invoiceFileUrl"
              >
                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                <input
                  class="file-input"
                  type="file"
                  @change="uploadFileChange"
                />
              </div>
              <div v-else class="invoice-file">
                <img
                  :src="reimbursements.modal.invoiceFileUrl"
                  alt=""
                  srcset=""
                />
                <el-icon :size="24" @click="deleteImg" class="delete"
                  ><CircleCloseFilled color="#F56C6C"
                /></el-icon>
              </div>
            </el-form-item>
            <el-form-item label="审核" prop="auditStatus">
              <el-select
                style="width: 100%"
                v-model="reimbursements.modal.auditStatus"
                placeholder="请选择审核状态"
              >
                <el-option label="未审核" :value="'0'" />
                <el-option label="已审核" :value="'1'" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                placeholder="请输入备注"
                v-model="reimbursements.modal.remark"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="drawer-content-right">
          <el-form
            ref="reimbursementsRightRef"
            size="large"
            :rules="reimbursements.formRules"
            :model="reimbursements.modal"
            label-width="100px"
          >
            <el-form-item label="时间" prop="reimbursementDate">
              <el-date-picker
                style="width: 100%"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                v-model="reimbursements.modal.reimbursementDate"
                placeholder="请选择时间"
              />
            </el-form-item>
            <el-form-item label="商品明细" prop="commodity">
              <el-input
                placeholder="请输入商品明细"
                v-model="reimbursements.modal.commodity"
              />
            </el-form-item>
            <el-form-item label="价格" prop="amount">
              <el-input
                placeholder="请输入商品价格"
                v-model="reimbursements.modal.amount"
              />
            </el-form-item>
            <el-form-item label="录入" prop="isInput">
              <el-select
                style="width: 100%"
                v-model="reimbursements.modal.isInput"
                placeholder="请选择状态"
              >
                <el-option label="已录入" :value="'1'" />
                <el-option label="未录入" :value="'0'" />
              </el-select>
            </el-form-item>
            <el-form-item label="报销状态" prop="reimbursementStatus">
              <el-select
                style="width: 100%"
                v-model="reimbursements.modal.reimbursementStatus"
                placeholder="请选择状态"
              >
                <el-option label="未报销" :value="'0'" />
                <el-option label="已报销" :value="'1'" />
              </el-select>
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
            @click="
              submitReimbursements(
                reimbursementsLeftRef,
                reimbursementsRightRef
              )
            "
            >保存</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, Ref } from 'vue'
import { uploadFile } from '@/utils/index'
import { Plus, CircleCloseFilled } from '@element-plus/icons-vue'
import {
  getFixedCostsList,
  getManagerCostsList,
  getReimbursementCostsList,
  reimbursementCostsSave,
  reimbursementCostsUpdate,
  logicDeleteReimbursementCosts,
  getSysUserList,
  saveManagerCosts,
  logicDeleteManagerCosts,
  updateManagerCosts,
  getThisMonthReimbursementCosts,
  getFixedCostsSelectList,
  saveFixedCosts,
  logicDeleteFixedCosts,
  updateFixedCosts,
  getTotalFixedCosts,
  getTotalManagerCosts
} from '@/request/index'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  components: { Plus, CircleCloseFilled },

  setup () {
    const active = ref(false)

    const userLists: Ref<
      Array<{
        id: string
        name: string
        managePostName: string
        [key: string]: any
      }>
    > = ref([])

    // 固定成本数据
    const fixedCostsModalRef = ref<FormInstance>()
    interface fixedCostsProps {
      fixedCostsSelectList: Array<{
        name: string
        id: string
        amount: string
        costsDate: string
        payFileUrl: string
      }>
      tabHeader: Array<{
        name: string
        prop: string
      }>
      [key: string]: any
    }
    const fixedCosts: fixedCostsProps = reactive({
      query: {
        date: new Date()
      },
      tableData: [],
      totalCount: 0,
      fixedCostsSelectList: [],
      showModal: false,
      tableLoading: false,
      modalLoading: false,
      tabHeader: [
        { name: '费用名称', prop: 'name' },
        { name: '费用金额', prop: 'amount' },
        { name: '付费截图', prop: 'payFileUrl' }
      ],
      modal: {
        id: '', // id
        amount: '', // 费用
        costsDate: '', // 成本日期
        name: '', // 名称
        payFileUrl: '' // 付费截图
      },
      rules: {
        amount: [
          { required: true, message: '请输入成本费用', trigger: 'blur' }
        ],
        costsDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        // name: [{ required: true, message: '请选择名称', trigger: 'change' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        payFileUrl: [
          { required: true, message: '请上传截图', trigger: 'change' }
        ]
      }
    })
    const openFixedCostsModal = async (row: any) => {
      try {
        fixedCosts.showModal = true
        fixedCosts.modalLoading = true
        if (row && row.id) {
          for (const key in fixedCosts.modal) {
            fixedCosts.modal[key] = row[key]
          }
        } else {
          for (const key in fixedCosts.modal) {
            fixedCosts.modal[key] = ''
          }
        }
        await getFixedCostsSelectLists()
        await changeFixedCostsSelectList()
      } finally {
        fixedCosts.modalLoading = false
      }
    }
    const saveFixedCostsModal = async (FormRef: FormInstance | undefined) => {
      const sucess = (code: number) => {
        if (code === 200) {
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
          // 获取新的列表
          getFixedCostsLists()
          // 关闭弹窗
          fixedCosts.showModal = false
        }
      }
      if (!FormRef) return
      FormRef.validate(async (valid) => {
        if (valid) {
          // 验证成功
          if (fixedCosts.modal.id) {
            // 编辑
            const { code } = await updateFixedCosts(fixedCosts.modal)
            sucess(code)
          } else {
            // 新增
            const { code } = await saveFixedCosts(fixedCosts.modal)
            sucess(code)
          }
        }
      })
    }
    const deleteFixedCosts = async (id: string) => {
      ElMessageBox.confirm('确定删除该项吗?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await logicDeleteFixedCosts(id)
        if (code === 200) {
          getFixedCostsLists()
        }
      })
    }
    const getFixedCostsLists = async () => {
      const query = {
        month: new Date().getMonth() + 1,
        limit: -1,
        page: 1,
        year: new Date().getFullYear()
      }
      if (fixedCosts.query.date) {
        const dates = new Date(fixedCosts.query.date as any)
        query.month = dates.getMonth() + 1
        query.year = dates.getFullYear()
      }
      try {
        fixedCosts.tableLoading = true
        const { code, data } = await getFixedCostsList({
          ...query
        })
        if (code === 200) {
          // 处理头部
          fixedCosts.tableData = data.list
        }
      } finally {
        fixedCosts.tableLoading = false
        getTotalFixedCostss(query)
      }
    }
    const changeFixedCostsList = () => {
      // 改变时间
      getFixedCostsLists()
    }
    const getFixedCostsSelectLists = async () => {
      const { code, data } = await getFixedCostsSelectList()
      if (code === 200) {
        fixedCosts.fixedCostsSelectList = data
      }
    }
    const uploadFileChange2 = async (e: any) => {
      if (e.target.files && e.target.files[0]) {
        const { code, data } = await uploadFile(e.target.files[0])
        if (code === 200) {
          fixedCosts.modal.payFileUrl = data[0].url
          ;(fixedCostsModalRef.value as any).validateField(['payFileUrl'])
        }
      }
    }
    const deleteImg2 = () => {
      fixedCosts.modal.payFileUrl = ''
      ;(fixedCostsModalRef.value as any).validateField(['payFileUrl'])
    }
    const changeFixedCostsSelectList = () => {
      if (!fixedCosts.modal.name) return
      const idx = fixedCosts.fixedCostsSelectList.findIndex(
        (item: any) => item.name === fixedCosts.modal.name
      )
      if (idx > -1) {
        const { amount, payFileUrl } = fixedCosts.fixedCostsSelectList[idx]
        if (amount) {
          fixedCosts.modal.amount = amount
        }
        if (payFileUrl) {
          fixedCosts.modal.payFileUrl = payFileUrl
        }
      }
    }
    const getTotalFixedCostss = async (query: any) => {
      const { code, data } = await getTotalFixedCosts(query)
      if (code === 200) {
        fixedCosts.totalCount = data?.totalAmount
      }
    }
    // ==============================================
    // 管理人员成本
    const managementModalRef = ref<FormInstance>()
    const management = reactive({
      totalCount: 0,
      tables: {
        loading: false,
        columns: [
          {
            name: '姓名',
            key: 'employeeName'
          },
          {
            name: '职位',
            key: 'managePostName'
          },
          {
            name: '实际工资',
            key: 'actuallyPayable'
          }
        ],
        data: []
      },
      query: {
        date: new Date()
      },
      addManagementModal: false,
      rules: {
        amount: [
          { required: true, message: '请输入成本费用', trigger: 'blur' }
        ],
        costsDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        managerId: [
          { required: true, message: '请选择姓名', trigger: 'change' }
        ],
        managePostName: [
          { required: true, message: '请选择姓名', trigger: 'change' }
        ]
      },
      modal: {
        id: '', // id
        amount: '', // 费用
        costsDate: '', // 成本日期
        managerId: '',
        managePostName: '' // 职位
      }
    })
    // 统计费用
    const getTotalManagerCostss = async (query: any) => {
      const { code, data } = await getTotalManagerCosts(query)
      if (code === 200) {
        management.totalCount = data.totalAmount
      }
    }
    const openManagementModal = async (row: any) => {
      // 新增
      management.addManagementModal = true
      if (row && row.id) {
        // 编辑
        for (const key in management.modal) {
          management.modal[key] = row[key]
          changeManagement()
        }
      } else {
        // 新增
        for (const key in management.modal) {
          management.modal[key] = ''
        }
      }
    }
    const saveManagementModal = async (FormRef: FormInstance | undefined) => {
      const sucess = (code: number) => {
        if (code === 200) {
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
          // 获取新的列表
          getManagerCostsLists()
          // 关闭弹窗
          management.addManagementModal = false
        }
      }
      if (!FormRef) return
      FormRef.validate(async (valid) => {
        if (valid) {
          // 验证成功
          if (management.modal.id) {
            // 编辑
            const { code } = await updateManagerCosts(management.modal)
            sucess(code)
          } else {
            // 新增
            const { code } = await saveManagerCosts(management.modal)
            sucess(code)
          }
        }
      })
    }
    // 删除
    const managementRowDelete = async (id: string) => {
      ElMessageBox.confirm('确定删除该项吗?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await logicDeleteManagerCosts(id)
        if (code === 200) {
          getManagerCostsLists()
        }
      })
    }
    const changeManagement = () => {
      const item = userLists.value.find(
        (item: any) => item.id === management.modal.managerId
      )
      if (item && item.managePostName) {
        management.modal.managePostName = item.managePostName
      }
    }
    const getManagerCostsLists = async () => {
      management.tables.loading = true
      const query = {
        month: new Date().getMonth() + 1,
        limit: -1,
        page: 1,
        year: new Date().getFullYear()
      }
      if (management.query.date) {
        const dates = new Date(management.query.date as any)
        query.month = dates.getMonth() + 1
        query.year = dates.getFullYear()
      }
      try {
        const { code, data } = await getManagerCostsList({ ...query })
        if (code === 200) {
          management.tables.data = data.list.filter((item:any) => item.managePostId)
        }
      } finally {
        management.tables.loading = false
        getTotalManagerCostss(query)
      }
    }
    // 获取人员列表
    const getSysUserLists = async () => {
      const { code, data } = await getSysUserList({
        limit: -1,
        page: 1
      })
      if (code === 200) {
        if (data.list) {
          userLists.value = data.list
        }
      }
    }

    // ===============================
    // 报销数据
    const reimbursementsLeftRef = ref<FormInstance>()
    const reimbursementsRightRef = ref<FormInstance>()
    const reimbursementsAmount = ref(0) // 报销累计
    const reimbursements = reactive({
      tabHeader: [
        { name: '报销人', prop: 'reimburser' },
        { name: '时间', prop: 'reimbursementDate' },
        { name: '订单', prop: 'orderNumber' },
        { name: '商品', prop: 'commodity' },
        { name: '购买渠道', prop: 'buyWay' },
        { name: '价格', prop: 'amount' },
        { name: '发票', width: 180, prop: 'invoiceFileUrl' },
        { name: '录入', prop: 'isInput' },
        { name: '审核', prop: 'auditStatus' },
        { name: '报销状态', prop: 'reimbursementStatus' },
        { name: '备注', prop: 'remark' }
      ],
      tabIndex: 2, // 默认全部
      addReimbursementModal: false,
      query: {
        date: new Date()
      },
      tableData: [],
      tabs: [
        {
          state: 2,
          name: '全部'
        },
        {
          state: 0,
          name: '未报销'
        },
        {
          state: 1,
          name: '已报销'
        }
      ],
      modal: {
        id: '', // id
        amount: '', // 价格
        auditStatus: '0', // 审核状态 0 未审核，1 已审核
        buyWay: '', // 购买渠道
        commodity: '', // 商品
        invoiceFileUrl: '', // 发票url
        isInput: '0', // 是否录入(0否 1是)
        orderNumber: '', // 订单号
        reimbursementDate: '', // 报销日期(YYYY-MM-dd)
        reimbursementStatus: '0', // 报销状态(0未报销 1已报销)
        reimburser: '', // 报销人
        remark: '' // 备注
      },
      formRules: {
        amount: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        auditStatus: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ],
        buyWay: [
          { required: true, message: '请输入购买渠道', trigger: 'blur' }
        ],
        commodity: [
          { required: true, message: '请输入商品明细', trigger: 'blur' }
        ],
        invoiceFileUrl: [
          { required: true, message: '请上传发票文件', trigger: 'blur' }
        ],
        isInput: [
          { required: true, message: '请选择录入状态', trigger: 'change' }
        ],
        orderNumber: [
          { required: true, message: '请输入订单号', trigger: 'blur' }
        ],
        reimbursementDate: [
          { required: true, message: '请选择报销日期', trigger: 'change' }
        ],
        reimbursementStatus: [
          { required: true, message: '请选择报销状态', trigger: 'change' }
        ],
        reimburser: [
          { required: true, message: '请输入报销人', trigger: 'blur' }
        ],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    })
    const openEreimbursementsModal = (row: any) => {
      if (row && row.id) {
        // 编辑
        for (const key in reimbursements.modal) {
          reimbursements.modal[key] = row[key]
        }
      } else {
        // 新增
        for (const key in reimbursements.modal) {
          reimbursements.modal[key] = ''
          reimbursements.modal.auditStatus = '0'
          reimbursements.modal.isInput = '0'
          reimbursements.modal.reimbursementStatus = '0'
        }
      }
      reimbursements.addReimbursementModal = true
    }
    const uploadFileChange = async (e: any) => {
      if (e.target.files && e.target.files[0]) {
        const { code, data } = await uploadFile(e.target.files[0])
        if (code === 200) {
          reimbursements.modal.invoiceFileUrl = data[0].url
          ;(reimbursementsLeftRef.value as any).validateField([
            'invoiceFileUrl'
          ])
        }
      }
    }
    const deleteImg = () => {
      reimbursements.modal.invoiceFileUrl = ''
      ;(reimbursementsLeftRef.value as any).validateField(['invoiceFileUrl'])
    }
    const changeTab = () => {
      active.value = !active.value
    }
    const getReimbursementCostsLists = async () => {
      const query = {
        month: new Date().getMonth() + 1,
        limit: -1,
        page: 1,
        reimbursementStatus:
          reimbursements.tabIndex === 2 ? '' : reimbursements.tabIndex, // 报销状态(默认空为全部 0未报销 1已报销)
        year: new Date().getFullYear()
      }
      if (reimbursements.query.date) {
        const dates = new Date(reimbursements.query.date as any)
        query.month = dates.getMonth() + 1
        query.year = dates.getFullYear()
      }
      const { code, data } = await getReimbursementCostsList({
        ...query
      })
      if (code === 200) {
        reimbursements.tableData = data.list
        getThisMonthReimbursementCostss(query)
      }
    }
    const changEreimbursementsTab = ({ state }: { state: number }) => {
      if (reimbursements.tabIndex !== state) {
        reimbursements.tabIndex = state
        getReimbursementCostsLists()
      }
    }
    const submitReimbursements = async (
      FormLeftRef: FormInstance | undefined,
      FormRightRef: FormInstance | undefined
    ) => {
      // 新增编辑提交
      if (!FormLeftRef) return
      if (!FormRightRef) return
      const sucess = (code: number) => {
        if (code === 200) {
          ElMessage({
            type: 'success',
            message: '操作成功'
          })
          // 获取新的列表
          getReimbursementCostsLists()
          // 关闭弹窗
          reimbursements.addReimbursementModal = false
        }
      }
      FormLeftRef.validate(async (valid) => {
        if (valid) {
          FormRightRef.validate(async (rightValid) => {
            if (rightValid) {
              if (reimbursements.modal.id) {
                // 编辑
                const { code } = await reimbursementCostsUpdate(
                  reimbursements.modal
                )
                if (code === 200) {
                  sucess(code)
                }
              } else {
                // 新增
                // console.log('first', reimbursements.modal)
                const { code } = await reimbursementCostsSave(
                  reimbursements.modal
                )
                if (code === 200) {
                  sucess(code)
                }
              }
            }
          })
        } else {
          FormRightRef.validate()
        }
      })
    }

    const deleteReimbursements = async (id: string) => {
      ElMessageBox.confirm('确定删除该项吗?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await logicDeleteReimbursementCosts(id)
        if (code === 200) {
          getReimbursementCostsLists()
        }
      })
    }

    // 报销累计
    const getThisMonthReimbursementCostss = async (query: any) => {
      const { code, data } = await getThisMonthReimbursementCosts({
        ...query
      })
      if (code === 200) {
        reimbursementsAmount.value = data?.amount || 0
      }
    }

    const cellClass = (row: any): any => {
      if (row.column.property === 'invoiceFileUrl') {
        return 'invoice-img'
      }
    }

    const viewInvoiceFile = (url: string) => {
      window.open(url)
    }
    onMounted(() => {
      getFixedCostsLists()
      getManagerCostsLists()
      getReimbursementCostsLists()
      getSysUserLists()
    })
    return {
      changeTab,
      reimbursements,
      fixedCosts,
      changEreimbursementsTab,
      management,
      changeFixedCostsList,
      getManagerCostsLists,
      getReimbursementCostsLists,
      uploadFileChange,
      deleteImg,
      reimbursementsRightRef,
      reimbursementsLeftRef,
      submitReimbursements,
      openEreimbursementsModal,
      deleteReimbursements,
      cellClass,
      userLists,
      changeManagement,
      managementModalRef,
      openManagementModal,
      saveManagementModal,
      managementRowDelete,
      reimbursementsAmount,
      openFixedCostsModal,
      saveFixedCostsModal,
      fixedCostsModalRef,
      uploadFileChange2,
      deleteImg2,
      changeFixedCostsSelectList,
      deleteFixedCosts,
      viewInvoiceFile
    }
  }
})
</script>

<style lang="less" scoped>
.administration-cost-container {
  box-sizing: border-box;
  padding-bottom: 20px;
  .management-cost-box,
  .reimbursement-cost-box {
    margin-top: 28px;
  }
  .filter-header {
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
}
/*滚动条整体部分*/
.reverse-table ::-webkit-scrollbar {
  width: 8px;
  height: 15px;
} /*滚动条的轨道*/
.reverse-table ::-webkit-scrollbar-track {
  background-color: #ffffff;
} /*滚动条里面的小方块，能向上向下移动*/
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
} /*边角，即两个滚动条的交汇处*/
.reverse-table ::-webkit-scrollbar-corner {
  background-color: #ffffff;
}

::v-deep(.invoice-img > div) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-button {
  cursor: pointer;
  color: #409eff;
  &:hover {
    text-decoration: underline;
  }
}
</style>
