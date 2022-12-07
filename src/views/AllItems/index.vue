<template>
  <div class="all-items-container">
    <div class="fillter-content d-flex d-f-row-bet">
      <div class="fillter-content-left d-flex">
        <el-date-picker style="margin-right: 10px; width: 180px" type="date" @change="getAllProjectLists"
          format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-model="query.startDate" placeholder="请选择开始年月" />
        <el-date-picker style="margin-right: 10px; width: 180px" type="date" @change="getAllProjectLists"
          format="YYYY-MM-DD" value-format="YYYY-MM-DD" v-model="query.endDate" placeholder="请选择结束年月" />
        <el-select clearable @change="getAllProjectLists" style="margin-right: 10px; width: 160px" placeholder="请选择公司"
          v-model="query.partyACompanyId">
          <el-option v-for="cop in companyList" :key="cop.id" :label="cop.fullName" :value="cop.id" />
        </el-select>
        <el-select clearable @change="getAllProjectLists" style="margin-right: 10px; width: 160px" placeholder="请选择负责人"
          v-model="query.managerId">
          <el-option v-for="per in staffList" :key="per.staffId" :label="per.staffName" :value="per.staffId" />
        </el-select>
        <el-input @blur="getAllProjectLists" v-model="query.minTotalPrice" type="number"
          style="margin-right: 10px; width: 160px" placeholder="请选择最小金额"></el-input>
        <el-input @blur="getAllProjectLists" v-model="query.maxTotalPrice" type="number"
          style="margin-right: 10px; width: 160px" placeholder="请选择最大金额"></el-input>
        <el-select @change="getAllProjectLists" style="margin-right: 10px; width: 160px" placeholder="请选择状态" clearable
          v-model="query.status">
          <el-option v-for="item in projectStatus" :key="item.key" :label="item.text" :value="item.key" />
        </el-select>
      </div>
      <div class="fillter-content-right d-flex">
        <d-add v-permission="'add'" text="添加项目" @click="openModal" />
        <el-popover placement="left" trigger="hover" width="300">
          <div style="display: flex">
            <div style="margin-right:10px">
              <div class="tips-title">项目状态</div>
              <div v-for="item in projectStatus" :key="item.key" :style="{ color: item.color }">
                {{ item.text }}
              </div>
            </div>
            <div style="margin-right:10px">
              <div class="tips-title">人员状态</div>
              <div v-for="item in userStatus" :key="item.key" :style="{ color: item.color }">
                {{ item.text }}
              </div>
            </div>
          </div>
          <template #reference>
            <el-button size="large">颜色状态说明</el-button>
          </template>
        </el-popover>
      </div>
    </div>
    <div class="table-content">
      <vxe-table style="min-width: 100%" border :height="height" :loading="tableLoading"
        :column-config="{ resizable: true }" :scroll-y="{ enabled: false }" :span-method="mergeRowMethod"
        :cell-style="handleCellStyle" :data="demo3.tableData">
        <template v-for="(head, index) in tableHeaderData" :key="index">
          <vxe-column v-if="head.prop === 'id'" fixed="right" v-permission="'table'" :field="head.prop"
            :width="head.width" :title="head.name" align="center">
            <template #default="{ row }">
              <div>
                <el-button type="text" v-permission="'edit'" size="small" @click="openModal(row)">编辑</el-button>
                <el-button type="text" v-permission="'delete'" style="margin-left: 0"
                  @click="deleteOperatingCompany(row.id)" size="small">删除</el-button>
                <el-button type="text" size="small" style="margin-left: 0" @click="archiveOperation(row)">{{
                row.isArchive === '0' ? '归档' : '撤销' }}</el-button>
              </div>
            </template>
          </vxe-column>
          <vxe-column v-else :field="head.prop" :width="head.width" :title="head.name">
            <template #default="{ row }">
              <div v-if="head.prop === 'paymentStatus'" class="table-item">
                <span>
                  {{
                  row.paymentStatus === '0'
                  ? '未收款'
                  : row.paymentStatus === '1'
                  ? '已收款'
                  : ''
                  }}
                </span>
                <span v-if="row.paymentStatus === '1'" style="margin-left:10px">
                  {{ row.paymentAmount || 0 }}
                </span>
              </div>
              <div v-else-if="head.prop === 'status'">
                {{ projectStatus[row.status].text }}
              </div>
              <div v-else-if="head.prop === 'ppstatus'" class="table-item">
                {{ getPPstatus(row.ppstatus) }}
              </div>
              <div v-else-if="head.prop === 'ckt'">
                <img :src="row.ckt" style="width: 80px;height: 80rpx" @click="showFile(row.ckt)" />
              </div>
              <div v-else-if="head.prop === 'xqwd'" @click="showFile(row.xqwd)" class="upload-text">
                {{ row.xqwd.split('/').pop() }}
              </div>
              <div v-else-if="head.prop === 'stageImage'">
                <img :src="row.stageImage" style="width: 80px;height: 80rpx" @click="showFile(row.stageImage)" />
              </div>
              <div v-else-if="head.prop === 'id'" style="display: flex">
                <el-button type="text" v-permission="'edit'" size="small" @click="openModal(row)">编辑</el-button>
                <el-button type="text" v-permission="'delete'" @click="deleteOperatingCompany(row.id)" size="small">删除
                </el-button>
              </div>
              <span v-else>{{ row[head.prop] }} </span>
            </template>
          </vxe-column>
        </template>
      </vxe-table>
    </div>
    <!-- 新增编辑 -->
    <el-drawer size="60%" v-model="addModal" :title="form.id ? '编辑项目' : '新增项目'" :with-header="true">
      <template #title>
        <p class="t-c t-main-color f20">
          {{ form.id ? '编辑项目' : '新增项目' }}
        </p>
      </template>
      <div class="drawer-content d-flex d-f-row-bet">
        <div class="drawer-content-left">
          <el-form size="large" :rules="formRuls" :model="form" ref="leftModalRef" label-width="110px">
            <el-form-item label="甲方公司" prop="partyACompanyId">
              <el-select style="width: 100%" v-model="form.partyACompanyId" placeholder="请选择甲方公司">
                <el-option v-for="cop in companyList" :key="cop.id" :label="cop.fullName" :value="cop.id" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="编号" prop="serialNumber">
              <el-input placeholder="请输入编号" v-model="form.serialNumber" />
            </el-form-item> -->
            <el-form-item label="项目类型" prop="type">
              <el-input placeholder="请输入项目类型" v-model="form.type" />
            </el-form-item>
            <el-form-item label="项目开始时间" prop="startDate">
              <el-date-picker style="width: 100%" v-model="form.startDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                type="date" placeholder="请选择项目工期开始时间" />
            </el-form-item>
            <el-form-item label="项目结束时间" prop="endDate">
              <el-date-picker style="width: 100%" v-model="form.endDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                type="date" placeholder="请选择项目工期结束时间" />
            </el-form-item>
            <el-form-item label="项目经理" prop="xmjl">
              <el-select style="width: 100%" v-model="form.xmjl" placeholder="请选择项目经理">
                <el-option v-for="cop in managerList" :key="`${cop.staffId}-${cop.staffType}`" :label="cop.staffName"
                  :value="`${cop.staffId}-${cop.staffType}`" />
              </el-select>
            </el-form-item>
            <el-form-item label="商务负责人" prop="swfzr">
              <el-select style="width: 100%" v-model="form.swfzr" placeholder="请选择商务负责人">
                <el-option v-for="cop in businessAffairsList" :key="cop.staffId" :label="cop.staffName"
                  :value="cop.staffId" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目状态" prop="status">
              <el-select style="width: 100%" v-model="form.status" placeholder="请选择项目状态">
                <el-option v-for="cop in projectStatus" :key="cop.key" :label="cop.text" :value="cop.key" />
              </el-select>
            </el-form-item>

            <el-form-item label="需求文档" prop="xqwd">
              <div class="upload-content" v-if="!form.xqwd">
                <el-icon class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
                <input class="file-input" type="file" @change="uploadXFileChange" />
              </div>
              <div v-else class="invoice-file">
                <div class="file-link" @click="showFile(form.xqwd)">
                  点击查看
                </div>
                <el-icon :size="24" @click="deleteXImg" class="delete">
                  <CircleCloseFilled color="#F56C6C" />
                </el-icon>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="drawer-content-right">
          <el-form size="large" :model="form" :rules="formRuls" ref="rightModalRef" label-width="100px">
            <el-form-item label="项目名称" prop="name">
              <el-input placeholder="请输入项目名称" v-model="form.name" />
            </el-form-item>
            <el-form-item label="项目总价" prop="totalPrice">
              <el-input placeholder="请输入项目总价" v-model="form.totalPrice" />
            </el-form-item>
            <el-form-item label="项目小组名" prop="groupName">
              <el-input placeholder="请输入项目小组名" v-model="form.groupName" />
            </el-form-item>
            <el-form-item label="收款金额" prop="paymentAmount">
              <el-input placeholder="请输入收款金额" v-model="form.paymentAmount" />
            </el-form-item>

            <el-form-item label="负责主美" prop="fzzm">
              <el-select style="width: 100%" v-model="form.fzzm" placeholder="请选择负责主美">
                <el-option v-for="cop in artDesigner" :key="cop.staffId" :label="cop.staffName" :value="cop.staffId" />
              </el-select>
            </el-form-item>

            <el-form-item label="收款状态" prop="paymentStatus">
              <el-select style="width: 100%" v-model="form.paymentStatus" placeholder="请选择收款状态">
                <el-option label="未收款" value="0" />
                <el-option label="已收款" value="1" />
              </el-select>
            </el-form-item>

            <el-form-item label="需求地址" prop="demandAddress">
              <el-input placeholder="请输入需求地址" v-model="form.demandAddress" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" placeholder="请输入备注" v-model="form.remark" />
            </el-form-item>
            <el-form-item label="参考图" prop="ckt">
              <div class="upload-content" v-if="!form.ckt">
                <el-icon class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
                <input class="file-input" type="file" @change="uploadCFileChange" />
              </div>
              <div v-else class="invoice-file">
                <img :src="form.ckt" alt="" srcset="" />
                <el-icon :size="24" @click="deleteCImg" class="delete">
                  <CircleCloseFilled color="#F56C6C" />
                </el-icon>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="drawer-content-bottom">
        <d-add text="添加人员分工" @click="addPersion" />
        <el-table class="table" :border="true" :stripe="true" :data="form.projectStageList" style="width: 100%">
          <el-table-column prop="staffName" label="姓名" />
          <el-table-column prop="designPostName" label="职位" />
          <el-table-column prop="name" label="阶段名称" />
          <el-table-column prop="startDate" label="排期开始时间" />
          <el-table-column prop="endDate" label="排期结束时间" />
          <el-table-column prop="unitPrice" label="单价" />
          <el-table-column label="参考图" width="150" align="center">
            <template #default="scope">
              <div v-if="!scope.row.referenceFileUrl" class="upload-content">
                <el-icon class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
                <input class="file-input" type="file" @change="uploadRyCkt($event, scope.$index)" />
              </div>
              <div v-else class="invoice-file">
                <img :src="scope.row.referenceFileUrl" />
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <div style="width: 120px">
                <el-button type="text" size="small" @click="deleteStaffInfo(scope.row, scope.$index)">删除</el-button>
                <el-button type="text" @click="addPersion(scope.row, scope.$index)" size="small">编辑</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <div class="t-c">
          <el-button class="btn" type="primary" style="width: 200px" size="large"
            @click="saveProjectClick(leftModalRef, rightModalRef)">保存</el-button>
        </div>
      </template>
    </el-drawer>
    <el-dialog v-model="persionModal" top="55px" title="选择人员分工" width="35%" center>
      <div class="rule-modal modal scrollbar">
        <el-form size="large" :rules="subFormRules" ref="subFormRef" :model="subForm" label-width="120px">
          <el-form-item label="姓名" prop="staffId">
            <el-select style="width: 100%" v-model="subForm.staffId" @change="selectStaffName" placeholder="请选择姓名">
              <el-option v-for="p in staffList" :key="`${p.staffId}-${p.staffType}`" :label="p.staffName"
                :value="`${p.staffId}-${p.staffType}`" />
            </el-select>
          </el-form-item>
          <el-form-item label="职位" prop="designPostName">
            <el-input placeholder="请选择职位" disabled v-model="subForm.designPostName" />
          </el-form-item>
          <el-form-item label="阶段名称" prop="name">
            <el-input v-model="subForm.name" placeholder="请输入阶段名称" />
          </el-form-item>
          <el-form-item label="排期开始时间" prop="startDate">
            <el-date-picker style="width: 100%" v-model="subForm.startDate" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" type="date" placeholder="请选择排期开始时间" />
          </el-form-item>
          <el-form-item label="排期结束时间" prop="endDate">
            <el-date-picker style="width: 100%" v-model="subForm.endDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
              type="date" placeholder="请选择排期结束时间" />
          </el-form-item>
          <el-form-item label="工期" prop="days">
            <el-input type="number" v-model="subForm.days" placeholder="请选择时间" />
          </el-form-item>
          <el-form-item label="单价" prop="unitPrice">
            <el-input type="number" v-model="subForm.unitPrice" placeholder="请输入单价" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button class="btn" type="primary" style="width: 200px" size="large"
            @click="submitAddPersonnelModal(subFormRef)">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { defineComponent, ref, Ref, reactive, onMounted, nextTick } from 'vue'
import { VxeTablePropTypes } from 'vxe-table'
import { Plus, CircleCloseFilled } from '@element-plus/icons-vue'
import { projectStatus, userStatus } from '../../common/constant'

import {
  getAllProjectList,
  getPartyACompanyList,
  getStaffList,
  logicDeleteProject,
  saveProject,
  getSysUser,
  archiveProject,
  updateProject,
  unArchiveProject
} from '@/request/index'
import { uploadFile } from '@/utils/index'
const tableHeaderData = [
  // { name: '序号', prop: 'order', width: 30 },
  { name: '编号', prop: 'serialNumber' },
  { name: '合作公司', prop: 'partyACompanyShortName' },
  { name: '项目名', prop: 'name' },
  { name: '项目类型', prop: 'type' },
  { name: '参考图', prop: 'ckt', width: 120 },
  { name: '需求文档', prop: 'xqwd', width: 80 },
  { name: '需求地址', prop: 'demandAddress', width: 160 },
  { name: '项目群组', prop: 'groupName' },
  { name: '分工/天', prop: 'ppdays' },
  { name: '阶段名称', prop: 'ppname' },
  { name: '阶段参考图', prop: 'stageImage', width: 120 },
  // { name: '项目归档', prop: 'isArchive', width: 120 },
  { name: '总价', prop: 'totalPrice' },
  { name: '单价', prop: 'ppunitPrice' },
  { name: '排期', prop: 'pq' },
  { name: '设计师', prop: 'ppstaffName' },
  { name: '项目经理', prop: 'xmjl' },
  { name: '负责主美', prop: 'zmfzr' },
  { name: '商务负责人', prop: 'swfzr' },
  { name: '状态', prop: 'status' },
  { name: '收款状态', prop: 'paymentStatus' },
  { name: '备注', prop: 'remark' },
  { name: '操作', prop: 'id', width: 80 }
]

export default defineComponent({
  components: {
    Plus,
    CircleCloseFilled
  },
  setup () {
    const height: Ref<number> = ref(300)
    const tableLoading = ref(false)
    const companyList: any = ref([])
    const staffList: any = ref([])
    const addModal: Ref<boolean> = ref(false)
    const persionModal: Ref<boolean> = ref(false)
    const sysUserss: any = ref([])
    const rightModalRef = ref<FormInstance>()
    const leftModalRef = ref<FormInstance>()
    const subFormRef = ref<FormInstance>()
    const form: any = ref({
      id: '', // id
      demandAddress: '', // 需求地址
      endDate: '', // 项目工期结束时间
      groupName: '', // 项目群组名称
      name: '', // 项目名称
      partyACompanyId: '', // 合作甲方公司id
      paymentAmount: '', // 已收款金额
      paymentStatus: '', // 收款状态，0未收款 1已收款
      projectFileList: [], // 项目文件 {type:文件类型(1需求文档 2参考图), url}
      projectManagerList: [], // 项目负责人 {managerId： 负责人id，managerType：1项目经理 2主美负责人 3商务负责人}
      projectStageList: [], // 项目分工阶段 { days：工期天数， endDate：排期结束时间，id: 阶段id，name：阶段名称，staffId：人员id，staffType：人员类型，startDate：排期开始日期，unitPrice：单价}
      remark: '', // 备注
      serialNumber: '', // 编号
      startDate: '', // 项目工期开始日期
      totalPrice: '', // 项目总价
      type: '', // 项目类型
      xmjl: '', // 项目经理
      xqwd: '', // 需求文档
      ckt: '', // 参考图
      fzzm: '', // 负责主美
      swfzr: '', // 商务负责人
      status: '' // 项目状态
    })
    const formRuls: any = {
      demandAddress: [
        { required: true, message: '请输入需求地址', trigger: 'blur' }
      ],
      endDate: [
        { required: true, message: '请选择项目工期结束时间', trigger: 'blur' }
      ],
      groupName: [
        { required: true, message: '请输入项目群组名称', trigger: 'blur' }
      ],
      name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
      partyACompanyId: [
        { required: true, message: '请选择合作甲方公司', trigger: 'change' }
      ],
      // paymentAmount: [
      //   { required: true, message: '请输入收款金额', trigger: 'blur' }
      // ],
      paymentStatus: [
        { required: false, message: '请选择收款状态', trigger: 'change' }
      ],
      remark: [{ required: true, message: '请输入备注信息', trigger: 'blur' }],
      serialNumber: [
        { required: true, message: '请输入项目编号', trigger: 'blur' }
      ],
      startDate: [
        { required: true, message: '请选择项目开始时间', trigger: 'change' }
      ],
      totalPrice: [
        { required: true, message: '请输入项目总价', trigger: 'blur' }
      ],
      type: [{ required: true, message: '请输入项目类型', trigger: 'blur' }],
      xmjl: [{ required: true, message: '请选择项目经理', trigger: 'change' }],
      xqwd: [{ required: true, message: '请上传需求文档', trigger: 'blur' }],
      ckt: [{ required: true, message: '请上传参考图', trigger: 'blur' }],
      fzzm: [{ required: true, message: '请选择负责主美', trigger: 'change' }],
      swfzr: [
        { required: true, message: '请选择商务负责人', trigger: 'change' }
      ],
      status: [{ required: true, message: '请选择项目状态', trigger: 'change' }]
    }
    const subForm: any = ref({
      id: '', // 编辑
      name: '', // 阶段名称
      staffId: '', // 人员id
      staffType: '', // 人员类型
      staffName: '', // 人员姓名
      designPostName: '', // 职位名称
      startDate: '', // 排期开始时间
      endDate: '', // 排期结束时间
      days: '', // 工期天数
      unitPrice: '' // 单价
    })
    const subFormRules: any = {
      name: [{ required: true, message: '请输入阶段名称', trigger: 'blur' }],
      staffId: [
        { required: true, message: '请选择人员姓名', trigger: 'change' }
      ],
      staffType: [
        { required: true, message: '请选择人员姓名', trigger: 'change' }
      ],
      designPostName: [
        { required: true, message: '请选择职位名称', trigger: 'change' }
      ],
      startDate: [{ required: true, message: '请选择时间', trigger: 'blur' }],
      endDate: [{ required: true, message: '请选择时间', trigger: 'blur' }],
      days: [{ required: true, message: '请输入工期天数', trigger: 'blur' }],
      unitPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }]
    }
    const demo3: any = reactive({
      tableData: []
    })
    //     项目状态(1未分配 2测试中 3测试中(未通过) 4进行中 5移交 6已完成 7已完成(已开发票)
    // 8已完成(已收款))

    const query: any = ref({
      endDate: '',
      startDate: '',
      managerId: '',
      minTotalPrice: '',
      maxTotalPrice: '',
      partyACompanyId: '',
      status: ''
    })
    // 通用行合并函数（将相同多列数据合并为一行）
    const mergeRowMethod: VxeTablePropTypes.SpanMethod = ({
      row,
      _rowIndex,
      column,
      visibleData
    }) => {
      // console.log(row,visibleData,column)
      // const fields = ['order', 'id']
      const fields = tableHeaderData.map(item => { return item.prop })
      const cellValue = row[column.field]
      if (cellValue && fields.includes(column.field)) {
        const prevRow = visibleData[_rowIndex - 1]
        let nextRow = visibleData[_rowIndex + 1]
        if (prevRow && prevRow[column.field] === cellValue && prevRow.partyACompanyShortName === row.partyACompanyShortName && column.field !== 'ppunitPrice') {
          return { rowspan: 0, colspan: 0, row: 5 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.field] === cellValue && nextRow.partyACompanyShortName === row.partyACompanyShortName && column.field !== 'ppunitPrice') {
            nextRow = visibleData[++countRowspan + _rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    }

    const handleCellStyle = ({ row, column }: any) => {
      const style = { color: '#333', borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }
      const { property } = column
      if (property === 'ppstaffName') {
        return { ...style, background: userStatus[row.employeeStatus] ? userStatus[row.employeeStatus].color : '' }
      } else if (property === 'status') {
        return { ...style, background: projectStatus[row.status].color }
      } else if (property === 'zmfzr') {
        return { ...style, background: projectStatus[row.status].color }
      } else if (property === 'swfzr') {
        return { ...style, background: projectStatus[row.status].color }
      }
    }

    // 项目列表
    const getAllProjectLists = async () => {
      tableLoading.value = true
      const querys = {
        limit: -1,
        page: 1,
        ...query.value
      }
      const { code, data } = await getAllProjectList(querys)
      if (code === 200) {
        const getPQ = (start: any, end: any) => {
          if (!start) return end
          if (!end) return start
          return `${start}-${end}`
        }

        const newData: any = []
        data.list.map((item: any, index: number) => {
          if (item && item.projectStageList.length > 0) {
            item.projectStageList.map((citem: any) => {
              const newItem = { ...item, order: index + 1 }
              // 文件：参考图 需求文档
              if (item.projectFileList && item.projectFileList.length > 0) {
                item.projectFileList.map((file: any) => {
                  if (file.type === '1') {
                    //  需求文档
                    newItem.xqwd = file.url
                  } else if (file.type === '2') {
                    //  参考图
                    newItem.ckt = file.url
                  }
                })
              }
              // 负责人 负责人类型(1项目经理 2主美负责人 3商务负责人)
              if (
                item.projectManagerList &&
                item.projectManagerList.length > 0
              ) {
                item.projectManagerList.map((mamager: any) => {
                  if (mamager.managerType === '1') {
                    newItem.xmjl = mamager.name
                  }
                  if (mamager.managerType === '2') {
                    newItem.zmfzr = mamager.name
                  }
                  if (mamager.managerType === '3') {
                    newItem.swfzr = mamager.name
                  }
                })
              }
              const {
                days,
                designPostId,
                designPostName,
                managePostId,
                managePostName,
                endDate,
                id,
                name,
                referenceFileUrl,
                staffId,
                staffName,
                staffType,
                startDate,
                status,
                unitPrice,
                employeeStatus
              } = citem
              newItem.employeeStatus = staffType === '2' ? 6 : employeeStatus
              newItem.ppdays = days
              newItem.ppdesignPostId = !designPostId ? managePostId : designPostId
              newItem.ppdesignPostName = designPostId ? designPostName : managePostName
              newItem.ppendDate = endDate
              newItem.ppid = id
              newItem.ppname = name
              newItem.stageImage = referenceFileUrl
              newItem.ppstaffId = staffId
              newItem.ppstaffName = staffName
              newItem.ppstaffType = staffType
              newItem.ppstartDate = startDate
              newItem.ppstatus = status
              newItem.ppunitPrice = unitPrice
              // 排期
              newItem.pq = getPQ(startDate, endDate)
              newData.push(newItem)
            })
          } else {
            const newItem = { ...item, order: index + 1 }
            // 文件：参考图 需求文档
            if (item.projectFileList && item.projectFileList.length > 0) {
              item.projectFileList.map((file: any) => {
                if (file.type === '1') {
                  //  需求文档
                  newItem.xqwd = file.url
                } else if (file.type === '2') {
                  //  参考图
                  newItem.ckt = file.url
                }
              })
            }
            // 负责人 负责人类型(1项目经理 2主美负责人 3商务负责人)
            if (item.projectManagerList && item.projectManagerList.length > 0) {
              item.projectManagerList.map((mamager: any) => {
                if (mamager.managerType === '1') {
                  newItem.xmjl = mamager.name
                }
                if (mamager.managerType === '2') {
                  newItem.zmfzr = mamager.name
                }
                if (mamager.managerType === '3') {
                  newItem.swfzr = mamager.name
                }
              })
            }
            newData.push(newItem)
          }

          // newData.push(newItem)
        })
        // console.log('newData',newData)
        newData.sort((a:any, b:any) => {
          if (a.serialNumber.substr(0, 1) < b.serialNumber.substr(0, 1)) {
            return -1
          }

          if (a.serialNumber.substr(0, 1) > b.serialNumber.substr(0, 1)) {
            return 1
          }

          return 0
        })
        demo3.tableData = newData
      }
      tableLoading.value = false
    }

    // 公司列表
    const getPartyACompanyLists = async () => {
      const { code, data } = await getPartyACompanyList({
        page: 1,
        limit: -1
      })
      if (code === 200) {
        companyList.value = data?.list
        // console.log('getPartyACompanyLists',data?.list)
      }
    }

    const managerList = ref()
    const artDesigner = ref()
    const businessAffairsList = ref()
    // 人员列表
    const getStaffLists = async () => {
      const { code, data } = await getStaffList()
      if (code === 200) {
        staffList.value = data.filter((item: any) => item.staffType !== '3')
        // 项目经理列表
        managerList.value = data.filter((item: any) => item.staffType === '1' || item.staffType === '3')
        // 主美列表
        artDesigner.value = data.filter((item: any) => item.staffType === '1')
        // 商务负责人列表
        businessAffairsList.value = data.filter((item: any) => item.staffType === '3')
      }
    }

    // 后台设置，人员列表
    const getSysUsers = async () => {
      const { code, data } = await getSysUser({ limit: -1, page: 1 })
      if (code === 200) {
        sysUserss.value = data?.list
      }
    }

    const getPPstatus = (state: any) => {
      if (state === '0') return '未安排'
      if (state === '1') return '进行中'
      if (state === '2') return '已完成'
      if (state === '3') return '未通过'
    }

    // 删除
    const deleteOperatingCompany = async (id: string) => {
      ElMessageBox.confirm('确定删除该项吗?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await logicDeleteProject(id)
        if (code === 200) {
          getAllProjectLists()
        }
      })
    }

    // 上传参考图
    const uploadCFileChange = async (e: any) => {
      if (e.target.files && e.target.files[0]) {
        const { code, data } = await uploadFile(e.target.files[0])
        if (code === 200) {
        form.value.ckt = data[0].url
          ;(leftModalRef.value as any).validateField(['ckt'])
        }
      }
    }

    // 上传分工人员参考图
    const uploadRyCkt = async (e: any, index: any) => {
      console.log(e)
      console.log(index)
      if (e.target.files && e.target.files[0]) {
        const { code, data } = await uploadFile(e.target.files[0])
        if (code === 200) {
          form.value.projectStageList[index].referenceFileUrl = data[0].url
        }
      }
    }

    // 删除参考图
    const deleteCImg = () => {
      form.value.ckt = ''
        ; (leftModalRef.value as any).validateField(['ckt'])
    }

    // 上传需求文档
    const uploadXFileChange = async (e: any) => {
      if (e.target.files && e.target.files[0]) {
        const { code, data } = await uploadFile(e.target.files[0])
        if (code === 200) {
          form.value.xqwd = data[0].url
            ; (leftModalRef.value as any).validateField(['xqwd'])
        }
      }
    }

    // 删除需求文档
    const deleteXImg = () => {
      form.value.xqwd = ''
        ; (leftModalRef.value as any).validateField(['xqwd'])
    }

    // 打开弹窗
    const openModal = (row: any) => {
      if (row && row.id) {
        const newRow = JSON.parse(JSON.stringify(row))
        // 编辑
        for (const key in form.value) {
          form.value[key] = newRow[key]
        }
        for (const key in form.value.projectStageList) {
          form.value.projectStageList[key].designPostName = newRow.projectStageList[key].designPostName ? newRow.projectStageList[key].designPostName : newRow.projectStageList[key].managePostName
        }
        // 负责人
        if (newRow.projectManagerList && newRow.projectManagerList.length > 0) {
          const xmjlItem = newRow.projectManagerList.find(
            (item: any) => item.managerType === '1'
          )
          form.value.xmjl = (xmjlItem || {}).managerId + '-' + (xmjlItem || {}).managerSource
          const fzzmItem = newRow.projectManagerList.find(
            (item: any) => item.managerType === '2'
          )
          form.value.fzzm = (fzzmItem || {}).managerId
          const swfzrItem = newRow.projectManagerList.find(
            (item: any) => item.managerType === '3'
          )
          form.value.swfzr = (swfzrItem || {}).managerId
        } else {
          form.value.xmjl = ''
          form.value.fzzm = ''
          form.value.swfzr = ''
        }
      } else {
        for (const key in form.value) {
          const type = typeof form.value[key]
          if (type === 'string' || type === 'number') {
            form.value[key] = ''
          } else {
            form.value[key] = []
          }
        }
      }
      addModal.value = true
    }

    // 选择人员
    const selectStaffName = () => {
      const type = staffList.value.find(
        (item: any) => item.staffId === Number(subForm.value.staffId.split('-')[0]) && item.staffType === subForm.value.staffId.split('-')[1]
      )
      if (type) {
        subForm.value.staffId = `${type.staffId}-${type.staffType}`
        subForm.value.designPostName = type.designPostId ? type.designPostName : type.managePostName
        subForm.value.staffName = type.staffName
        subForm.value.staffType = type.staffType
      }
    }

    // 选择人员分工弹窗
    const addPersion = (row: any) => {
      if (row && row.id) {
        // 编辑
        for (const key in subForm.value) {
          subForm.value[key] = row[key]
        }
        subForm.value.staffId = `${row.staffId}-${row.staffType}`
        selectStaffName()
      } else {
        for (const key in subForm.value) {
          subForm.value[key] = ''
        }
      }
      persionModal.value = true
    }

    // 新增选人
    const submitAddPersonnelModal = async (
      subFormRef: FormInstance | undefined
    ) => {
      if (!subFormRef) return
      subFormRef.validate(async (valid) => {
        if (valid) {
          // 判断是编辑还是新增
          if (subForm.value.id) {
            // 编辑
            const index = form.value.projectStageList.findIndex(
              (item: any) => item.id === subForm.value.id
            )
            if (index > -1) {
              form.value.projectStageList.splice(index, 1, { ...subForm.value, staffId: Number(subForm.value.staffId.split('-')[0]) })
            }
          } else {
            form.value.projectStageList.push({ ...subForm.value, staffId: Number(subForm.value.staffId.split('-')[0]) })
          }

          persionModal.value = false
        }
      })
    }

    // 删除
    const deleteStaffInfo = async (row: any, index: number) => {
      if (row && row.id) {
        const idx = form.value.projectStageList.findIndex(
          (item: any) => item.id === row.id
        )
        if (idx > -1) {
          form.value.projectStageList.splice(idx, 1)
        }
      } else {
        form.value.projectStageList.splice(index, 1)
      }
    }

    // 新增提交
    const saveProjectClick = async (
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
          getAllProjectLists()
          // 关闭弹窗
          addModal.value = false
        }
      }
      companyLeftRef.validate(async (valid) => {
        if (valid) {
          companyRightRef.validate(async (rightValid) => {
            if (rightValid) {
              const {
                demandAddress,
                endDate,
                groupName,
                id,
                name,
                partyACompanyId,
                paymentAmount,
                paymentStatus,
                xqwd,
                ckt,
                xmjl,
                fzzm,
                swfzr,
                projectStageList,
                remark,
                serialNumber,
                startDate,
                totalPrice,
                type,
                status
              } = form.value
              //  projectFileList
              // if (projectStageList.length === 0) {
              //   ElMessage.error('请添加人员分工.')
              //   return
              // }
              const xmjlStaffId = xmjl?.split('-')[0]
              const xmjlStaffType = xmjl?.split('-')[1]
              const artDesignerItem = artDesigner.value.find((item: any) => item.staffId === fzzm)
              const businessAffairsItem = businessAffairsList.value.find((item: any) => item.staffId === swfzr)
              const submitQuery = {
                demandAddress,
                endDate,
                groupName,
                id,
                name,
                partyACompanyId,
                paymentAmount,
                paymentStatus,
                status,
                projectFileList: [
                  {
                    type: '1', // 需求文档
                    url: xqwd
                  },
                  {
                    type: '2',
                    url: ckt // 参考图
                  }
                ],
                projectManagerList: [
                  // 项目负责人
                  {
                    managerId: xmjlStaffId,
                    managerSource: xmjlStaffType,
                    managerType: '1' // 项目经理
                  },
                  {
                    managerId: fzzm,
                    managerSource: artDesignerItem ? artDesignerItem.staffType : '',
                    managerType: '2' // 主美负责人
                  },
                  {
                    managerId: swfzr,
                    managerSource: businessAffairsItem ? businessAffairsItem.staffType : '',
                    managerType: '3' // 商务负责人
                  }
                ],
                projectStageList,
                remark,
                serialNumber,
                startDate,
                totalPrice,
                type
              }
              if (!form.value.id) {
                // 新增
                const { code } = await saveProject(submitQuery)
                if (code === 200) {
                  sucess(code)
                }
              } else {
                // 编辑
                const { code } = await updateProject(submitQuery)
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

    // 归档
    const archiveOperation = async (row: any) => {
      const { id, isArchive } = row
      if (isArchive === '0') {
        // 归档
        ElMessageBox.confirm('确定归档该项目吗?', '归档', {
          confirmButtonText: '归档',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await archiveProject(id)
          if (code === 200) {
            getAllProjectLists()
          }
        })
      } else {
        // 取消归档
        ElMessageBox.confirm('确定撤销归档吗?', '撤销归档', {
          confirmButtonText: '撤销归档',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const { code } = await unArchiveProject(id)
          if (code === 200) {
            getAllProjectLists()
          }
        })
      }
    }

    // 查看文档
    const showFile = (url: string) => {
      window.open(url, '_blank')
    }

    onMounted(() => {
      getAllProjectLists()
      getPartyACompanyLists()
      getStaffLists()
      getSysUsers()

      nextTick(() => {
        height.value = document.documentElement.clientHeight - 160
      })
    })

    return {
      demo3,
      mergeRowMethod,
      height,
      tableHeaderData,
      query,
      tableLoading,
      companyList,
      staffList,
      getAllProjectLists,
      getPPstatus,
      deleteOperatingCompany,
      addModal,
      form,
      formRuls,
      openModal,
      addPersion,
      persionModal,
      sysUserss,
      uploadCFileChange,
      uploadXFileChange,
      deleteCImg,
      rightModalRef,
      leftModalRef,
      deleteXImg,
      subForm,
      selectStaffName,
      subFormRules,
      subFormRef,
      submitAddPersonnelModal,
      deleteStaffInfo,
      saveProjectClick,
      showFile,
      projectStatus,
      archiveOperation,
      userStatus,
      handleCellStyle,
      uploadRyCkt,
      managerList,
      artDesigner,
      businessAffairsList
    }
  }
})
</script>

<style lang="less" scoped>
.upload-text {
  text-align: center;
  color: #409eff;
  cursor: pointer;
}

.tips-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}

.all-items-container {

  // .table-item {
  //   height: 80px;
  //   line-height: 80px;
  //   text-align: center;
  //   color: #333;
  // }
  // /deep/ .vxe-table--render-default .vxe-cell {
  //   padding: 0;
  // }
  // /deep/ .vxe-body--column {
  //   padding: 0;
  // }
  .fillter-content {
    margin-bottom: 20px;
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

  .drawer-content-bottom {
    margin-left: 20px;

    .table {
      margin-top: 10px;
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
}

.file-link {
  cursor: pointer;
  color: #409eff;
  text-decoration: underline;
}

// https://university.legym.cn/
</style>
