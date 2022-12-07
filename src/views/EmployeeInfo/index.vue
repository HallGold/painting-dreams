<template>
  <div class="employee-info-container">
    <div class="fillter-header-content d-flex d-f-row-bet d-f-col-center">
      <div class="fillter-header-content-left d-flex">
        <template v-for="tab in tabs" :key="tab.id">
          <d-tab
            :active="tabActiveIndex === tab.id"
            :mr="10"
            @click="changeTab(tab.id)"
            v-if="tab.id === 0"
          >
            <div class="content">
              <p class="t-c f16">{{ tab.name }}</p>
              <p class="t-c f12 t-tips-color">{{ tab.subTitle }}</p>
            </div>
          </d-tab>
          <d-tab
            :active="tabActiveIndex === tab.id"
            :text="tab.name"
            :mr="10"
            @click="changeTab(tab.id)"
            v-else
          />
        </template>
      </div>
      <div class="fillter-header-content-right">
        <d-add text="添加职员" v-permission="'add'" @click="openModal" />
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
        <template v-for="(head, index) in tableHeaderData" :key="index">
          <!-- 非附件展示 -->

          <el-table-column
            :label="head.name"
            :width="head.width"
            v-if="head.prop === 'contractFileUrl'"
          >
            <template #default="scope">
              <el-button
                v-if="scope.row.contractFileUrl"
                type="text"
                size="small"
                @click.prevent="showContractFile(scope.row.contractFileUrl)"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            :label="head.name"
            :width="head.width"
            v-else-if="head.prop === 'status'"
          >
            <template #default="scope">
              <span v-if="scope.row.status === '1'">实习</span>
              <span v-else-if="scope.row.status === '2'">试用</span>
              <span v-else-if="scope.row.status === '3'">正式</span>
              <span v-else-if="scope.row.status === '4'">离职</span>
              <span v-else-if="scope.row.status === '5'">停薪留职</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="head.name"
            :width="head.width"
            v-else-if="head.prop === 'designPostName'"
          >
            <template #default="scope">
             <span>{{ scope.row.designPostName || scope.row.managePostName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="head.name"
            :width="head.width"
            v-else-if="head.prop === 'historyWageList'"
          >
            <template #default="scope">
              <div
                v-if="
                  scope.row.historyWageList &&
                  scope.row.historyWageList.length > 0
                "
              >
                <p v-for="h in scope.row.historyWageList" :key="h.id">
                  <span>{{ h.changeTime }}</span>
                  <span style="margin-left: 20px">{{ h.wage }}</span>
                </p>
              </div>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :prop="head.prop"
            :label="head.name"
            :width="head.width"
          />
        </template>

        <el-table-column fixed="right" label="操作" width="120" v-permission="'table'">
          <template #default="scope">
            <div style="width: 120px">
              <el-button type="text" v-permission="'edit'" size="small" @click="openModal(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                v-permission="'delete'"
                @click="deleteEmployee(scope.row.id)"
                size="small"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增编辑 -->
    <el-drawer
      size="50%"
      v-model="addEmployeeModal"
      :title="form.id ? '编辑员工' : '新增员工'"
      :with-header="true"
    >
      <template #title>
        <p class="t-c t-main-color f20">
          {{ form.id ? '编辑员工' : '新增员工' }}
        </p>
      </template>
      <div class="drawer-content d-flex d-f-row-bet">
        <div class="drawer-content-left">
          <el-form
            size="large"
            :rules="formRuls"
            :model="form"
            ref="leftModalRef"
            label-width="110px"
          >
            <el-form-item label="姓名" prop="name">
              <el-input placeholder="请输入姓名" v-model="form.name" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input placeholder="请输入电话号码" v-model="form.phone" />
            </el-form-item>
            <el-form-item label="身份证" prop="idCard">
              <el-input placeholder="请输入身份证" v-model="form.idCard" />
            </el-form-item>
            <el-form-item label="合同地址" prop="contractAddress">
              <el-input
                placeholder="请输入合同地址"
                v-model="form.contractAddress"
              />
            </el-form-item>
            <el-form-item label="转正日期" prop="positiveTime">
              <el-date-picker
                style="width: 100%"
                v-model="form.positiveTime"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择转正日期"
              />
            </el-form-item>
            <el-form-item label="历史调薪" prop="historyWageList">
              <div class="history-wage-list">
                <div
                  class="list"
                  v-for="(item, index) in form.historyWageList"
                  :key="index"
                >
                  <el-date-picker
                    class="list-item left"
                    v-model="item.changeTime"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    type="date"
                    placeholder="选择时间"
                  />
                  <el-input
                    class="list-item right"
                    placeholder="金额"
                    v-model="item.wage"
                  />
                </div>
                <d-add
                  style="width: 120px"
                  text="添加"
                  @click="addHistoryWage"
                />
              </div>
            </el-form-item>
            <el-form-item label="合同扫描件" prop="contractFileUrl">
              <div class="upload-content" v-if="!form.contractFileUrl">
                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                <input
                  class="file-input"
                  type="file"
                  @change="uploadFileChange"
                />
              </div>
              <div v-else class="invoice-file">
                <img :src="form.contractFileUrl" alt="" srcset="" />
                <el-icon :size="24" @click="deleteImg" class="delete"
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
            label-width="100px"
          >
            <el-form-item label="职位" prop="positionId">
              <el-select
                style="width: 100%"
                v-model="form.positionId"
                placeholder="请选择职位"
                @change="setPosition"
              >
                <el-option
                  v-for="design in positionList"
                  :key="`${design.id}-${design.name}`"
                  :label="design.name"
                  :value="`${design.id}-${design.name}`"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="银行名称" prop="bankName">
              <el-input placeholder="请输入银行名称" v-model="form.bankName" />
            </el-form-item>
            <el-form-item label="银行账号" prop="bankAccount">
              <el-input
                placeholder="请输入银行账号"
                v-model="form.bankAccount"
              />
            </el-form-item>
            <el-form-item label="入职时间" prop="entryTime">
              <el-date-picker
                style="width: 100%"
                v-model="form.entryTime"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择入职时间"
              />
            </el-form-item>
            <el-form-item label="基本工资" prop="basicWage">
              <el-input placeholder="请输入基本工资" v-model="form.basicWage" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                style="width: 100%"
                v-model="form.status"
                placeholder="请选择状态"
              >
                <el-option label="实习" value="1" />
                <el-option label="试用" value="2" />
                <el-option label="正式" value="3" />
                <el-option label="离职" value="4" />
                <el-option label="停薪留职" value="5" />
              </el-select>
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
            @click="saveEmployeeClick(leftModalRef, rightModalRef)"
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
  getEmployeeList,
  getDesignPost,
  saveEmployee,
  updateEmployee,
  logicDeleteEmployee,
  queryAllPosition
} from '@/request/index'
import { uploadFile } from '@/utils/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, CircleCloseFilled } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
// const validatorHistoryWageList = (rule: any, value: any, callback: any) => {
//   if (!value) {
//     callback('请填写调薪记录')
//   } else if (value.length === 0) {
//     callback('请填写调薪记录')
//   } else {
//     callback()
//   }
// }
const tableHeaderData = [
  { name: '姓名', prop: 'name', width: 120 },
  { name: '职位', prop: 'designPostName', width: 120 },
  { name: '提成比例', prop: 'percentagePoints', width: 100 },
  { name: '身份证', prop: 'idCard', width: 200 },
  { name: '联系方式', prop: 'phone', width: 160 },
  { name: '银行名称', prop: 'bankName', width: 160 },
  { name: '银行账号', prop: 'bankAccount', width: 160 },
  { name: '合同地址', prop: 'contractAddress', width: 200 },
  { name: '人员状态', prop: 'status', width: 120 },
  { name: '入职时间', prop: 'entryTime', width: 140 },
  { name: '转正时间', prop: 'positiveTime', width: 120 },
  { name: '基本工资', prop: 'basicWage', width: 120 },
  { name: '历史调薪', prop: 'historyWageList', width: 200 },
  { name: '年终奖', prop: 'annualBonus', width: 200 },
  { name: '合同扫描件', prop: 'contractFileUrl', width: 120 },
  { name: '备注', prop: 'remark' }
]

export default defineComponent({
  components: {
    Plus,
    CircleCloseFilled
  },
  setup () {
    const tabActiveIndex: Ref<any> = ref(-1)
    const height: Ref<number> = ref(300)
    const tableLoading = ref(false)
    const addEmployeeModal = ref(false)
    const rightModalRef = ref<FormInstance>()
    const leftModalRef = ref<FormInstance>()
    const tabs = ref([
      {
        name: '全部人员',
        id: -1,
        subTitle: '(不显示离职人员)'
      }
    ])
    const tableData = ref([])
    const designPosts = ref([])
    const form: any = ref({
      // 表单字段
      id: '',
      name: '', // 姓名
      phone: '', // 联系方式
      idCard: '', // 身份证
      contractAddress: '', // 合同地址
      positiveTime: '', // 转正日期
      contractFileUrl: '', // 合同扫描件url
      designPostId: '', // 职位id
      bankAccount: '', // 银行账号
      bankName: '', // 银行名称
      entryTime: '', // 入职时间
      basicWage: '', // 基本工资
      status: '', // 状态
      remark: '', // 备注
      historyWageList: [], // 历史调薪记录 changeTime：时间，wage：薪资
      // 回显职位ID字段(仅为回显)
      positionId: null
    })
    // 表单验证规则
    const formRuls = {
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }], // 姓名
      phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }], // 联系方式
      idCard: [{ required: true, message: '请输入身份证', trigger: 'blur' }], // 联系方式
      contractAddress: [
        { required: true, message: '请输入合同地址', trigger: 'blur' }
      ], // 合同地址
      positiveTime: [
        { required: true, message: '请选择日期', trigger: 'change' }
      ], // 转正日期
      contractFileUrl: [
        { required: true, message: '请上传图片', trigger: 'blur' }
      ], // 合同扫描件url
      positionId: [
        { required: true, message: '请选择职位', trigger: 'change' }
      ], // 职位id
      bankAccount: [
        { required: true, message: '请输入银行账号', trigger: 'blur' }
      ], // 银行账号
      bankName: [
        { required: true, message: '请输入银行名称', trigger: 'blur' }
      ], // 银行名称
      entryTime: [{ required: true, message: '请选择日期', trigger: 'blur' }], // 入职时间
      basicWage: [
        { required: true, message: '请输入基本工资', trigger: 'blur' }
      ], // 基本工资
      status: [{ required: true, message: '请选择状态', trigger: 'blur' }] // 状态
      // remark: [{ required: true, message: '请输入备注', trigger: 'blur' }] // 备注
      // historyWageList: [
      //   { required: false, message: '请填写调薪记录', trigger: 'blur' },
      //   { validator: validatorHistoryWageList, trigger: 'blur' }
      // ] // 历史调薪记录 changeTime：时间，wage：薪资
    }

    // 职位列表
    const positionList:any = ref([])
    const getPositionList = async () => {
      const { data } = await queryAllPosition()
      positionList.value = data
    }
    // 编辑/新增职位赋值
    const setPosition = (e?: any) => {
      const { id, name, type } = positionList.value.find((item:any) => item.id === Number(e.split('-')[0]) && item.name === e.split('-')[1])
      if (type === '1') {
        form.value.designPostId = id
        form.value.designPostName = name
        form.value.managePostId = ''
        form.value.managePostName = ''
      } else {
        form.value.managePostId = id
        form.value.managePostName = name
        form.value.designPostId = ''
        form.value.designPostName = ''
      }
    }

    const changeTab = (id: number): void => {
      if (id !== tabActiveIndex.value) {
        tabActiveIndex.value = id
        getEmployeeLists()
      }
    }
    // 列表
    const getEmployeeLists = async () => {
      tableLoading.value = true
      const query = {
        designPostId: '',
        keyword: '',
        limit: -1,
        page: 1,
        status: '' // 状态(0实习 1正式 2已离职 默认空为全部)
      }
      if (tabActiveIndex.value === -1) {
        query.designPostId = ''
      } else if (tabActiveIndex.value === -2) {
        query.designPostId = ''
        query.status = '2'
      } else {
        query.designPostId = tabActiveIndex.value
        query.status = ''
      }
      const { code, data } = await getEmployeeList({
        ...query
      })
      if (code === 200) {
        tableData.value = data?.list
      }
      tableLoading.value = false
    }
    // 岗位列表
    const getDesignPosts = async () => {
      const { code, data } = await getDesignPost()
      if (code === 200) {
        if (data && data.length > 0) {
          data.map((item: any) => {
            tabs.value.push(item)
          })
          tabs.value.push({
            name: '已离职人员',
            id: -2,
            subTitle: ''
          })
        }
        designPosts.value = data
      }
    }
    // 查看附件
    const showContractFile = (href: string) => {
      window.open(href, '_blank')
    }
    // 打开新增编辑弹窗
    const openModal = (row: any) => {
      if (row && row.id) {
        for (const key in form.value) {
          if (key === 'historyWageList') {
            form.value[key] = JSON.parse(JSON.stringify(row[key] || []))
          } else {
            form.value[key] = row[key]
          }
        }
        form.value.positionId = row.designPostId ? `${row.designPostId}-${row.designPostName}` : `${row.managePostId}-${row.managePostName}`
      } else {
        for (const key in form.value) {
          if (key === 'historyWageList') {
            form.value[key] = []
          } else {
            form.value[key] = ''
          }
        }
      }
      addEmployeeModal.value = true
    }
    // 添加历史调薪记录
    const addHistoryWage = () => {
      form.value.historyWageList.push({
        changeTime: '',
        wage: ''
      })
    }
    // 文件上传
    const uploadFileChange = async (e: any) => {
      if (e.target.files && e.target.files[0]) {
        const { code, data } = await uploadFile(e.target.files[0])
        if (code === 200) {
          form.value.contractFileUrl = data[0].url
          ;(leftModalRef.value as any).validateField(['contractFileUrl'])
        }
      }
    }
    // 图片删除
    const deleteImg = () => {
      form.value.contractFileUrl = ''
      ;(leftModalRef.value as any).validateField(['contractFileUrl'])
    }
    // 编辑、新增保存
    const saveEmployeeClick = async (
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
          getEmployeeLists()
          // 关闭弹窗
          addEmployeeModal.value = false
        }
      }
      leftModalRef.validate(async (valid) => {
        if (valid) {
          form.value.historyWageList = form.value.historyWageList.filter(
            (his: any) => his.changeTime && his.wage
          )
          const query = {
            ...form.value,
            positionId: JSON.stringify(form.value.positionId)?.split('-')[0]
          }
          rightModalRef.validate(async (rightValid) => {
            if (rightValid) {
              if (!form.value.id) {
                // 新增
                const { code } = await saveEmployee(query)
                if (code === 200) {
                  sucess(code)
                }
              } else {
                // 编辑
                const { code } = await updateEmployee(query)
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
    // 删除
    const deleteEmployee = async (id: string) => {
      ElMessageBox.confirm('确定删除该项吗?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await logicDeleteEmployee(id)
        if (code === 200) {
          getEmployeeLists()
        }
      })
    }
    onMounted(() => {
      getEmployeeLists()
      getDesignPosts()
      getPositionList()
      nextTick(() => {
        height.value = document.documentElement.clientHeight - 160
      })
    })
    return {
      tabs,
      tabActiveIndex,
      changeTab,
      tableHeaderData,
      tableData,
      height,
      showContractFile,
      tableLoading,
      addEmployeeModal,
      formRuls,
      form,
      openModal,
      designPosts,
      addHistoryWage,
      uploadFileChange,
      leftModalRef,
      rightModalRef,
      deleteImg,
      saveEmployeeClick,
      deleteEmployee,
      positionList,
      setPosition,
      getEmployeeLists
    }
  }
})
</script>

<style lang="less" scoped>
.employee-info-container {
  box-sizing: border-box;
  .fillter-header-content {
    margin-bottom: 10px;
    &-left .content {
      div,
      p {
        margin: 0;
        padding: 0;
      }
    }
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
}
</style>
