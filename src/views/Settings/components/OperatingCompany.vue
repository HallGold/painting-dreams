<template>
  <div class="operating-company-container">
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
        <el-table-column
          fixed="right"
          v-permission="'table'"
          label="操作"
          width="160"
        >
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              @click="openOperatingCompany(scope.row)"
              v-permission="'edit'"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="deleteOperatingCompany(scope.row.id)"
              size="small"
              v-permission="'delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
   </div>

    <div class="d-flex">
      <!-- 职位分工 -->
      <div class="job-division w100 mr40">
        <div class="job-division-header">
          <div class="tab-item">职位分工</div>
          <el-button
            size="large"
            v-permission="'add'"
            @click="openDesignPostsModal"
            :icon="CirclePlus"
            >新增分工</el-button
          >
        </div>
        <el-row v-loading="designPosts.tableLoading">
          <el-col v-for="(list, index) in designPosts.tableData" :key="index" :span="8">
            <el-table
            border
            :stripe="true"
            size="large"
            :data="list"
          >
            <el-table-column
                v-for="(head, index) in jobHeaderData"
                :key="index"
                :prop="head.key"
                :label="head.name"
                show-overflow-tooltip
              />
              <el-table-column
                fixed="right"
                v-permission="'table'"
                label="操作"
                width="130"
              >
                <template #default="scope">
                  <div style="width: 130px">
                    <el-button
                      type="text"
                      size="small"
                      v-permission="'edit'"
                      @click="openDesignPostsModal(scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      type="text"
                      size="small"
                      v-permission="'delete'"
                      @click="deleteDesignPosts(scope.row.id)"
                      >删除</el-button
                    >
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 后台人员 -->
    <div class="job-division">
      <div class="job-division-header">
        <div class="tab-item">后台人员</div>
        <el-button
          size="large"
          v-permission="'add'"
          @click="addPersonnelClick"
          :icon="CirclePlus"
          >新建人员</el-button
        >
      </div>
      <el-table
        border
        v-loading="peopleTable.loading"
        :stripe="true"
        height="250"
        size="large"
        :data="peopleTable.data"
        style="width: 100%"
      >
        <el-table-column
          v-for="(head, index) in peopleHeaderData"
          :key="index"
          :prop="head.key"
          :label="head.name"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="220"
          v-permission="'table'"
        >
          <template #default="scope">
            <div style="width: 220px">
              <el-button
                type="text"
                size="small"
                v-permission="'edit'"
                @click="handlePeopleEditClick(scope.row)"
                >编辑</el-button
              >
              <el-button
                @click="handlePeopleUpdatePwdlick(scope.row)"
                type="text"
                size="small"
                v-permission="'edit'"
                >修改密码</el-button
              >
              <el-button
                style="margin-right: 10px"
                @click="handlePeopleDeletelick(scope.row)"
                type="text"
                size="small"
                v-permission="'delete'"
                >删除人员</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 管理岗位 -->
    <div class="job-division">
      <div class="job-division-header">
        <div class="tab-item">管理岗位</div>
        <el-button
          size="large"
          v-permission="'add'"
          @click="addPositionClick"
          :icon="CirclePlus"
          >新建管理岗位</el-button
        >
      </div>
      <el-table
        border
        v-loading="managementPosition.loading"
        :stripe="true"
        height="250"
        size="large"
        :data="peopleTable.managerPosts"
        style="width: 100%"
      >
        <el-table-column
          v-for="(head, index) in managementPositionHeader"
          :key="index"
          :prop="head.key"
          :label="head.name"
        >
          <template #default="scope">
            <span v-if="head.key === 'permission'">{{
              getPermission(scope.row['permission'])
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          v-permission="'table'"
          label="操作"
          width="220"
        >
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              v-permission="'edit'"
              @click="addPositionClick(scope.row)"
              >编辑</el-button
            >
            <el-button
              @click="handlePositionClick(scope.row)"
              type="text"
              size="small"
              v-permission="'delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增运营公司弹窗 -->
    <el-dialog
      v-model="operatingCompany.addModal"
      top="55px"
      :title="operatingCompany.modal.id ? '编辑运营公司' : '新增运营公司'"
      width="35%"
      @close="closeModal"
      center
    >
      <div class="rule-modal modal scrollbar">
        <el-form
          ref="operatingCompanyFormRef"
          size="large"
          :model="operatingCompany.modal"
          :rules="operatingCompany.addmodalRule"
          label-width="120px"
        >
          <el-form-item label="简称" prop="shortName">
            <el-input
              placeholder="请输入简称"
              v-model="operatingCompany.modal.shortName"
            />
          </el-form-item>
          <el-form-item label="公司全名" prop="fullName">
            <el-input
              placeholder="请输入公司全名"
              v-model="operatingCompany.modal.fullName"
            />
          </el-form-item>
          <el-form-item label="运营状态" prop="status">
            <el-select
              style="width: 100%"
              v-model="operatingCompany.modal.operatingStatus"
              placeholder="请选择合作状态"
            >
              <el-option label="运营中" value="0" />
              <el-option label="已注销" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="邮寄合同地址" prop="contractAddress">
            <el-input
              placeholder="请输入邮寄合同地址"
              v-model="operatingCompany.modal.contractAddress"
            />
          </el-form-item>
          <el-form-item label="税号" prop="taxId">
            <el-input
              placeholder="请输入税号"
              v-model="operatingCompany.modal.taxId"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input
              placeholder="请输入联系电话"
              type="number"
              v-model="operatingCompany.modal.phone"
            />
          </el-form-item>
          <el-form-item label="银行名称" prop="name">
            <el-input
              placeholder="请输入银行名称"
              v-model="operatingCompany.modal.name"
            />
          </el-form-item>
          <el-form-item label="银行账号" prop="account">
            <el-input
              placeholder="请输入银行账号"
              v-model="operatingCompany.modal.account"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              placeholder="请输入备注"
              type="textarea"
              v-model="operatingCompany.modal.remark"
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
            @click="operatingCompanySubmit(operatingCompanyFormRef)"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- 新增分工弹窗 -->
    <el-dialog
      v-model="designPosts.addModal"
      top="55px"
      title="新增岗位"
      width="35%"
      center
    >
      <div class="rule-modal modal scrollbar">
        <el-form
          size="large"
          ref="designPostsFormRef"
          :rules="designPosts.modals.addModalRules"
          :model="designPosts.modals"
          label-width="120px"
        >
          <el-form-item label="岗位名称" prop="name">
            <el-input
              placeholder="请输入岗位名称"
              v-model="designPosts.modals.name"
            />
          </el-form-item>
          <el-form-item label="提成点数" prop="percentagePoints">
            <el-input
              placeholder="请输入提成点数"
              v-model="designPosts.modals.percentagePoints"
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
            @click="submitDesignPosts(designPostsFormRef)"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- 新建后台人员弹窗 -->
    <el-dialog
      v-loading="peopleTable.addModal.loading"
      v-model="peopleTable.addPersonnelModal"
      top="55px"
      :title="peopleTable.addModal.id ? '编辑后台人员信息' : '新建后台人员'"
      width="35%"
      center
    >
      <div class="rule-modal modal scrollbar">
        <el-form
          size="large"
          ref="peopleTableFormRef"
          :rules="peopleTable.addModalRules"
          :model="peopleTable.addModal"
          label-width="120px"
        >
          <el-form-item label="姓名" prop="name">
            <el-input
              placeholder="请输入姓名"
              v-model="peopleTable.addModal.name"
            />
          </el-form-item>
          <el-form-item label="岗位" prop="managePostId">
            <el-select
              style="width: 100%"
              v-model="peopleTable.addModal.managePostId"
              placeholder="请选择岗位"
            >
              <el-option
                v-for="manage in peopleTable.managerPosts"
                :key="manage.id"
                :label="manage.name"
                :value="manage.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="提成点数">
            <el-input
              disabled
              placeholder="和岗位绑定(岗位改变点数也改变)"
              :value="modalPostPoints"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input
              type="number"
              placeholder="请输入联系电话"
              v-model="peopleTable.addModal.phone"
            />
          </el-form-item>
          <el-form-item label="设置密码" prop="password">
            <el-input
              auto-complete="on"
              placeholder="请输入密码"
              type="password"
              v-model="peopleTable.addModal.password"
            />
          </el-form-item>
          <el-form-item label="确定密码" prop="password2">
            <el-input
              auto-complete="on"
              placeholder="请输入确定密码"
              type="password"
              v-model="peopleTable.addModal.password2"
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
            @click="submitAddPersonnelModal(peopleTableFormRef)"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      v-loading="peopleTable.updatePwdModals.loading"
      v-model="peopleTable.updatePwdModal"
      top="55px"
      title="修改密码"
      width="35%"
      center
    >
      <div class="rule-modal modal scrollbar">
        <el-form
          size="large"
          ref="peopleTableUpdatePwdFormRef"
          :rules="peopleTable.updatePwdModalRules"
          :model="peopleTable.updatePwdModals"
          label-width="120px"
        >
          <el-form-item label="设置密码" prop="password">
            <el-input
              auto-complete="on"
              placeholder="请输入密码"
              type="password"
              v-model="peopleTable.updatePwdModals.password"
            />
          </el-form-item>
          <el-form-item label="确定密码" prop="password2">
            <el-input
              auto-complete="on"
              placeholder="请输入确定密码"
              type="password"
              v-model="peopleTable.updatePwdModals.password2"
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
            @click="submitUpdatePersonnelPwdModal(peopleTableUpdatePwdFormRef)"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 新增管理岗位弹窗 -->
    <el-dialog
      v-model="managementPosition.addModal"
      top="55px"
      :title="managementPosition.addModal.id ? '编辑管理岗位' : '新增管理岗位'"
      width="35%"
      center
    >
      <div class="rule-modal modal scrollbar">
        <el-form
          size="large"
          ref="managementPositionFormRef"
          :rules="managementPosition.addModalRules"
          :model="managementPosition.addModals"
          label-width="120px"
        >
          <el-form-item label="名称" prop="name">
            <el-input
              placeholder="请输入岗位名称"
              v-model="managementPosition.addModals.name"
            />
          </el-form-item>
          <el-form-item label="提成点数" prop="percentagePoints">
            <el-input
              placeholder="请输入提成点数"
              v-model="managementPosition.addModals.percentagePoints"
            />
          </el-form-item>

          <el-form-item label="权限" prop="permission">
            <el-tree-select
              check-strictly
              style="width: 100%"
              v-model="managementPosition.addModals.permission"
              :data="permissionData"
              multiple
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
            @click="submitManagementPositionModal(managementPositionFormRef)"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import { CirclePlus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getSysUser,
  getManagerPost,
  addAddSysUser,
  updateAddSysUser,
  updateSysUserPassword,
  deleteSysUser,
  getOperatingCompanyList,
  getDesignPost,
  designPostSave,
  designPostUpdate,
  designPostDelete,
  operatingCompanySave,
  operatingCompanyUpdate,
  operatingCompanyDelete,
  saveManagePost,
  updateManagePost,
  logicDeleteManagePost
} from '@/request/index'
import {
  SysUserRequestProps,
  UersssyListItemProps
} from '@/request/requestProps'
import { md5Encode } from '@/utils/index'

interface peopleTableProps {
  data: Array<UersssyListItemProps>
  managerPosts: Array<any>
  addModal: any
  addPersonnelModal: boolean
  loading: boolean
  updatePwdModal: boolean
  updatePwdModals: any
  addModalRules: any
  updatePwdModalRules: any
}
const permissionData: any = [
  {
    value: '1',
    label: '工作日历'
  },
  {
    label: '所有项目',
    value: '2',
    children: [
      {
        label: '所有项目-新增',
        value: '2-add'
      },
      {
        label: '所有项目-编辑',
        value: '2-edit'
      },
      {
        label: '所有项目-删除',
        value: '2-delete'
      }
    ]
  },
  {
    label: '归档项目',
    value: '3'
  },
  {
    label: '公司项目',
    value: '4'
  },
  {
    label: '在职人员安排',
    value: '5'
  },
  {
    label: '外发画师安排',
    value: '6'
  },
  {
    label: '发票和收据',
    value: '7',
    children: [
      {
        label: '发票和收据-新增',
        value: '7-add'
      },
      {
        label: '发票和收据-删除',
        value: '7-delete'
      },
      {
        label: '发票和收据-编辑',
        value: '7-edit'
      }
    ]
  },
  {
    label: '员工资料',
    value: '8',
    children: [
      {
        label: '员工资料-删除',
        value: '8-delete'
      },
      {
        label: '员工资料-新增',
        value: '8-add'
      },
      {
        label: '员工资料-编辑',
        value: '8-edit'
      }
    ]
  },
  {
    label: '外发画师资料',
    value: '9',
    children: [
      {
        label: '外发画师资料-新增',
        value: '9-add'
      },
      {
        label: '外发画师资料-编辑',
        value: '9-edit'
      },
      {
        label: '外发画师资料-删除',
        value: '9-delete'
      }
    ]
  },
  {
    label: '工资表',
    value: '10',
    children: [
      {
        label: '工资表-新增',
        value: '10-add'
      },
      {
        label: '工资表-编辑',
        value: '10-edit'
      },
      {
        label: '工资表-删除',
        value: '10-delete'
      }
    ]
  },
  {
    label: '合作甲方公司信息',
    value: '11',
    children: [
      {
        label: '合作甲方公司信息-新增',
        value: '11-add'
      },
      {
        label: '合作甲方公司信息-编辑',
        value: '11-edit'
      },
      {
        label: '合作甲方公司信息-删除',
        value: '11-delete'
      }
    ]
  },
  {
    label: '管理成本',
    value: '12',
    children: [
      {
        label: '管理成本-新增',
        value: '12-add'
      },
      {
        label: '管理成本-编辑',
        value: '12-edit'
      },
      {
        label: '管理成本-删除',
        value: '12-delete'
      }
    ]
  },
  {
    label: '后台设置',
    value: '13',
    children: [
      {
        label: '后台设置-新增',
        value: '13-add'
      },
      {
        label: '后台设置-编辑',
        value: '13-edit'
      },
      {
        label: '后台设置-删除',
        value: '13-delete'
      }
    ]
  }
]
const getPermission = (data: Array<any>): any => {
  const result: any = []
  if (data && data.length > 0 && typeof data === 'string') {
    let newInfo = []
    try {
      newInfo = JSON.parse(data)
    } catch (err) {
      newInfo = []
    }
    newInfo.map((value: any) => {
      for (let i = 0; i < permissionData.length; i++) {
        if (value === permissionData[i].value) {
          result.push(permissionData[i].label)
          break
        } else {
          if (
            permissionData[i].children &&
            permissionData[i].children.length > 0
          ) {
            for (let j = 0; j < permissionData[i].children.length; j++) {
              if (value === permissionData[i].children[j].value) {
                result.push(permissionData[i].children[j].label)
              }
            }
          }
        }
      }
    })
  }
  return result.join(',')
}
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

const jobHeaderData = [
  {
    name: '名称',
    key: 'name'
  },
  { name: '返点', key: 'percentagePoints' }
]

const departmentHeaderData = [
  {
    name: '名称',
    key: 'name'
  },
  {
    name: '人数',
    key: 'name'
  }
]

const peopleHeaderData = [
  { name: '姓名', key: 'name' },
  { name: '岗位', key: 'managePostName' },
  { name: '提成点数', key: 'percentagePoints' },
  { name: '联系电话', key: 'phone' },
  { name: '添加时间', key: 'createTime' }
]

const managementPositionHeader = [
  { name: '名称', key: 'name' },
  { name: '提成点数', key: 'percentagePoints' },
  { name: '权限', key: 'permission' }
]
export default defineComponent({
  setup () {
    // 验证2次密码输入
    const validatorPassword2 = (rule: any, value: any, callback: any) => {
      if (!value) {
        callback('请输入确认密码')
      } else {
        if (rule.t === 'updatePwd') {
          // 修改密码
          if (value !== peopleTable.updatePwdModals.password) {
            callback('2次密码不一致')
          } else {
            callback()
          }
        } else {
          if (value !== peopleTable.addModal.password) {
            callback('2次密码不一致')
          } else {
            callback()
          }
        }
      }
    }
    const peopleTable: peopleTableProps = reactive({
      data: [], // 后台人员列表
      managerPosts: [], // 岗位列表
      loading: false, // loading
      addPersonnelModal: false, // 新增编辑弹窗
      updatePwdModal: false,
      updatePwdModals: {
        updatePwdRef: null,
        loading: false,
        id: '',
        password: '',
        password2: ''
      },
      addModalRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        managePostId: [
          { required: true, message: '请输选择岗位', trigger: 'change' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        password2: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validatorPassword2, trigger: 'blur' }
        ],
        phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }]
      },
      updatePwdModalRules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        password2: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          {
            validator: validatorPassword2,
            trigger: 'blur',
            t: 'updatePwd'
          }
        ]
      },
      addModal: {
        loading: false,
        // 弹窗数据
        id: '', // 新增为空，编辑需要携带
        managePostId: '', // 管理岗位的id
        name: '', // 姓名
        password: '', // 密码，需要 MD5加密
        password2: '', // 再次确认密码
        phone: '' // 电话号码
      }
    })
    const peopleTableFormRef = ref<FormInstance>()
    const peopleTableUpdatePwdFormRef = ref<FormInstance>()
    const designPostsFormRef = ref<FormInstance>()
    const operatingCompanyFormRef = ref<FormInstance>()
    const managementPositionFormRef = ref<FormInstance>()
    // 弹窗岗位点数
    const modalPostPoints = computed(() => {
      if (peopleTable.managerPosts && peopleTable.addModal.managePostId) {
        const item = peopleTable.managerPosts.find(
          (pe) => pe.id === peopleTable.addModal.managePostId
        )
        return item?.percentagePoints
      }

      return ''
    })
    const setRowStyle = () => {
      return { backgroundColor: 'rgba(255, 255, 255, 100)' }
    }
    // ====================运营中的公司数据===================
    interface OperatingCompanyProps {
      tableData: Array<any>
      tableLoading: boolean
      addModal: boolean
      modal: any
      addmodalRule: any
    }

    const operatingCompany: OperatingCompanyProps = reactive({
      tableData: [],
      tableLoading: false,
      addModal: false,
      addmodalRule: {
        contractAddress: [
          { required: true, message: '请输入合同地址', trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '请输入公司全称', trigger: 'blur' }
        ],
        operatingStatus: [
          { required: true, message: '请选择运营状态', trigger: 'change' }
        ],
        phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        shortName: [{ required: true, message: '请输入简称', trigger: 'blur' }],
        taxId: [{ required: true, message: '请输入税号', trigger: 'blur' }],
        account: [
          { required: true, message: '请输入银行卡账号', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入银行卡名称', trigger: 'blur' }]
      },
      modal: {
        id: '',
        contractAddress: '', // 合同地址
        fullName: '', // 公司全称
        operatingStatus: '', // 运营中状态，营运状态(0营运中 1已注销)
        phone: '', // 联系电话
        remark: '', // 备注(限200字符)
        shortName: '', // 简称
        taxId: '', // 税号
        account: '', // 银行卡账号名称
        name: '' // 名称
      }
    })
    // 编辑打开弹窗
    const openOperatingCompany = (row: any) => {
      const {
        id,
        contractAddress,
        fullName,
        phone,
        remark,
        shortName,
        taxId,
        bankName,
        bankAccount,
        operatingStatus
      } = row
      operatingCompany.modal.id = id
      operatingCompany.modal.contractAddress = contractAddress
      operatingCompany.modal.operatingStatus = operatingStatus // 运营中状态，营运状态(0营运中 1已注销)
      operatingCompany.modal.fullName = fullName
      operatingCompany.modal.phone = phone
      operatingCompany.modal.remark = remark
      operatingCompany.modal.shortName = shortName
      operatingCompany.modal.taxId = taxId
      operatingCompany.modal.name = bankName
      operatingCompany.modal.account = bankAccount
      operatingCompany.addModal = true
    }
    // 弹窗关闭
    const closeModal = () => {
      // 清空数据
      operatingCompany.modal.id = ''
      operatingCompany.modal.contractAddress = '' // 合同地址
      operatingCompany.modal.fullName = '' // 公司全称
      operatingCompany.modal.operatingStatus = '' // 运营中状态，营运状态(0营运中 1已注销)
      operatingCompany.modal.phone = '' // 联系电话
      operatingCompany.modal.remark = '' // 备注(限200字符)
      operatingCompany.modal.shortName = '' // 简称
      operatingCompany.modal.taxId = '' // 税号
      operatingCompany.modal.account = '' // 银行卡账号
      operatingCompany.modal.name = '' // 银行卡名称
    }
    // 新增
    const operatingCompanySubmit = async (
      FormRef: FormInstance | undefined
    ) => {
      if (!FormRef) return
      FormRef.validate(async (valid) => {
        if (valid) {
          const sucess = (code: number) => {
            if (code === 200) {
              ElMessage({
                type: 'success',
                message: '操作成功'
              })
              // 获取新的列表
              getOperatingCompanyLists()
              // 关闭弹窗
              operatingCompany.addModal = false
            }
          }
          if (operatingCompany.modal.id) {
            const { code } = await operatingCompanyUpdate({
              ...operatingCompany.modal,
              bankList: [
                {
                  name: operatingCompany.modal.name,
                  account: operatingCompany.modal.account
                }
              ]
            })
            sucess(code)
          } else {
            const { code } = await operatingCompanySave({
              ...operatingCompany.modal,
              bankList: [
                {
                  name: operatingCompany.modal.name,
                  account: operatingCompany.modal.account
                }
              ]
            })
            sucess(code)
          }
        }
      })
    }
    const getOperatingCompanyLists = async () => {
      operatingCompany.tableLoading = true
      const { code, data } = await getOperatingCompanyList({
        limit: -1,
        page: 1,
        operatingStatus: 0
      })
      if (code === 200 && data) {
        operatingCompany.tableData = data.list.map((item: any) => {
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

    // 删除
    const deleteOperatingCompany = async (id: string) => {
      ElMessageBox.confirm('确定删除该项吗?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await operatingCompanyDelete(id)
        if (code === 200) {
          getOperatingCompanyLists()
        }
      })
    }
    // ====================================================

    // ====================职位分工=========================

    const openDesignPostsModal = (row: any) => {
      // 新增编辑打开弹窗
      if (row && row.id) {
        const { id, name, percentagePoints } = row
        designPosts.modals.id = id
        designPosts.modals.name = name
        designPosts.modals.percentagePoints = percentagePoints
      } else {
        designPosts.modals.id = ''
        designPosts.modals.name = ''
        designPosts.modals.percentagePoints = ''
      }
      designPosts.addModal = true
    }

    // 新增编辑保存
    const submitDesignPosts = async (FormRef: FormInstance | undefined) => {
      if (!FormRef) return
      FormRef.validate(async (valid) => {
        if (valid) {
          const { name, percentagePoints, id } = designPosts.modals
          const sucess = (code: number) => {
            if (code === 200) {
              ElMessage({
                type: 'success',
                message: '操作成功'
              })
              // 获取新的列表
              getDesignPosts()
              // 关闭弹窗
              designPosts.addModal = false
            }
          }
          if (!id) {
            const { code } = await designPostSave({
              name,
              percentagePoints,
              id
            })
            sucess(code)
          } else {
            const { code } = await designPostUpdate({
              name,
              percentagePoints,
              id
            })
            sucess(code)
          }
        }
      })
    }

    // 职位分工-删除
    const deleteDesignPosts = async (id: string) => {
      ElMessageBox.confirm('确定删除该项吗?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await designPostDelete(id)
        if (code === 200) {
          getDesignPosts()
        }
      })
    }
    const designPosts = reactive({
      tableLoading: false,
      addModal: false,
      tableData: [] as any[],
      modals: {
        loading: false,
        name: '',
        id: '',
        percentagePoints: '',
        addModalRules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          percentagePoints: [
            { required: true, message: '请输入提成点数', trigger: 'blur' }
          ]
        }
      }
    })
    const getDesignPosts = async () => {
      designPosts.tableLoading = true
      const { code, data } = await getDesignPost()
      if (code === 200 && data?.length > 0) {
        designPosts.tableData = []
        const number = Math.ceil(data.length / 3)
        for (let i = 0; i < number; i++) {
          const list = data.splice(0, 3)
          designPosts.tableData.push(list)
        }
      }
      designPosts.tableLoading = false
    }

    // ====================后台管理人员交互==================

    // 获取后台管理人员列表
    const getSysUsers = async () => {
      peopleTable.loading = true
      const { code, data } = await getSysUser({ limit: -1, page: 1 })
      if (code === 200 && data) {
        peopleTable.data = data.list || []
      } else {
        peopleTable.data = []
      }
      peopleTable.loading = false
    }

    // 获取管理岗位列表
    const getManagerPosts = async () => {
      const { code, data } = await getManagerPost()
      if (code === 200) {
        peopleTable.managerPosts = data || []
      }
    }

    // 新建后台管理人员打开弹窗
    const addPersonnelClick = async () => {
      peopleTable.addPersonnelModal = true
      peopleTable.addModal.loading = true
      await getManagerPosts()
      // 初始化弹窗状态
      peopleTable.addModal.managePostId = ''
      peopleTable.addModal.id = ''
      peopleTable.addModal.name = ''
      peopleTable.addModal.phone = ''
      peopleTable.addModal.password = ''
      peopleTable.addModal.password2 = ''
      peopleTable.addModal.loading = false
    }

    // 新增后台管理人员
    const addAddSysUsers = async (query: SysUserRequestProps) => {
      const { code } = await addAddSysUser(query)
      if (code === 200) {
        ElMessage({
          type: 'success',
          message: '新增成功'
        })
        getSysUsers()
        peopleTable.addModal.loading = false
        peopleTable.addPersonnelModal = false
      }
    }

    // 编辑后台人员
    const updateAddSysUsers = async (query: SysUserRequestProps) => {
      const { code } = await updateAddSysUser(query)
      if (code === 200) {
        ElMessage({ type: 'success', message: '编辑成功' })
        getSysUsers()
        peopleTable.addModal.loading = false
        peopleTable.addPersonnelModal = false
      }
    }
    // 新增/编辑后台管理人员弹窗提交
    const submitAddPersonnelModal = async (
      peopleTableFormRef: FormInstance | undefined
    ) => {
      if (!peopleTableFormRef) return
      peopleTableFormRef.validate(async (valid) => {
        if (valid) {
          const { id, name, phone, managePostId, password } =
            peopleTable.addModal
          peopleTable.addModal.loading = true
          const query = {
            id,
            name,
            phone,
            managePostId,
            password: md5Encode(password)
          }
          // 新增
          if (!peopleTable.addModal.id) {
            addAddSysUsers(query)
          } else {
            updateAddSysUsers(query)
          }
        }
      })
    }
    // 编辑后台人员弹窗，初始化元数据
    const handlePeopleEditClick = async (row: any) => {
      const { id, managePostId, name, phone } = row
      peopleTable.addPersonnelModal = true
      peopleTable.addModal.loading = true
      peopleTable.addModal.id = id
      peopleTable.addModal.managePostId = managePostId
      peopleTable.addModal.name = name
      peopleTable.addModal.phone = phone
      peopleTable.addModal.password = ''
      peopleTable.addModal.password2 = ''
      if (peopleTable.managerPosts.length === 0) {
        await getManagerPosts()
      }
      peopleTable.addModal.loading = false
    }

    // 修改后台人员密码
    const handlePeopleUpdatePwdlick = (row: any) => {
      const { id } = row
      peopleTable.updatePwdModals.id = id
      peopleTable.updatePwdModal = true
    }

    // 修改密码提交
    const submitUpdatePersonnelPwdModal = async (
      FormRef: FormInstance | undefined
    ) => {
      if (!FormRef) return
      FormRef.validate(async (valid) => {
        if (valid) {
          const { code } = await updateSysUserPassword({
            id: peopleTable.updatePwdModals.id,
            newPassword: md5Encode(peopleTable.updatePwdModals.password)
          })
          if (code === 200) {
            peopleTable.updatePwdModal = false
            ElMessage({ type: 'success', message: '密码修改成功' })
          }
        }
      })
    }

    // 删除后台人员
    const handlePeopleDeletelick = async (row: any) => {
      ElMessageBox.confirm(`确定删除${row.name}?`, '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await deleteSysUser({ id: row.id })
        if (code === 200) {
          // 删除改成员
          const index = peopleTable.data.findIndex((item) => item.id === row.id)
          if (index > -1) {
            peopleTable.data.splice(index, 1)
            ElMessage({ type: 'success', message: '删除成功' })
          }
        }
      })
    }

    // ==================================================

    // ===================管理岗位交互==========================
    const managementPosition: any = reactive({
      data: [], // 后台人员列表
      managerPosts: [], // 岗位列表
      addModal: false, // 新增编辑弹窗
      addModalRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        percentagePoints: [
          { required: true, message: '请输输入提成点数', trigger: 'blur' }
        ],
        permission: [
          {
            required: true,
            type: 'array',
            message: '请输选择权限',
            trigger: 'change'
          }
        ]
      },
      addModals: {
        // 弹窗数据
        id: '', // 新增为空，编辑需要携带
        name: '', // 名称
        percentagePoints: '', // 提成点数
        permission: [] // 权限
      }
    })

    // 打开弹窗
    const addPositionClick = (row: any) => {
      if (row && row.id) {
        managementPosition.addModals.id = row.id
        managementPosition.addModals.name = row.name
        managementPosition.addModals.percentagePoints = row.percentagePoints
        if (row.permission && row.permission.length > 0) {
          try {
            managementPosition.addModals.permission = JSON.parse(row.permission)
          } catch (err) {
            managementPosition.addModals.permission = []
          }
        } else {
          managementPosition.addModals.permission = []
        }
      } else {
        managementPosition.addModals.id = ''
        managementPosition.addModals.name = ''
        managementPosition.addModals.percentagePoints = ''
        managementPosition.addModals.permission = ''
      }
      managementPosition.addModal = true
    }

    // 新增/编辑后台管理人员弹窗提交
    const submitManagementPositionModal = async (
      peopleTableFormRef: FormInstance | undefined
    ) => {
      if (!peopleTableFormRef) return
      peopleTableFormRef.validate(async (valid) => {
        if (valid) {
          const { id, name, percentagePoints, permission } =
            managementPosition.addModals
          const query = {
            id,
            name,
            percentagePoints,
            permission: JSON.stringify(permission)
          }
          // 新增
          if (!managementPosition.addModals.id) {
            const { code } = await saveManagePost(query)
            if (code === 200) {
              getManagerPosts()
              managementPosition.addModal = false
            }
          } else {
            const { code } = await updateManagePost(query)
            if (code === 200) {
              getManagerPosts()
              managementPosition.addModal = false
            }
          }
        }
      })
    }

    // 删除岗位
    const handlePositionClick = (row: any) => {
      ElMessageBox.confirm('确定删除该项吗?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await logicDeleteManagePost(row.id)
        if (code === 200) {
          getManagerPosts()
        }
      })
    }

    // ======================================================

    onMounted(() => {
      getOperatingCompanyLists()
      getDesignPosts()
      getSysUsers()
      getManagerPosts()
    })

    const showRuleModal = ref(false) // 后台配置说明
    const addCompanyModal = ref(false) // 新增公司弹窗
    const addDivisionModal = ref(false) // 新增分工弹窗
    const addDepartmentModal = ref(false) // 新建部门弹窗

    return {
      designPostsFormRef,
      setRowStyle,
      headerData,
      jobHeaderData,
      departmentHeaderData,
      peopleHeaderData,
      CirclePlus,
      showRuleModal,
      addCompanyModal,
      addDivisionModal,
      addDepartmentModal,
      peopleTable,
      addPersonnelClick,
      submitAddPersonnelModal,
      modalPostPoints,
      peopleTableFormRef,
      handlePeopleEditClick,
      handlePeopleUpdatePwdlick,
      submitUpdatePersonnelPwdModal,
      peopleTableUpdatePwdFormRef,
      handlePeopleDeletelick,
      operatingCompany,
      designPosts,
      openDesignPostsModal,
      submitDesignPosts,
      deleteDesignPosts,
      operatingCompanyFormRef,
      operatingCompanySubmit,
      openOperatingCompany,
      closeModal,
      deleteOperatingCompany,
      managementPosition,
      managementPositionHeader,
      addPositionClick,
      managementPositionFormRef,
      submitManagementPositionModal,
      handlePositionClick,
      permissionData,
      getPermission
    }
  }
})
</script>

<style lang="less" scoped>
.operating-company-container {
  box-sizing: border-box;
  padding-bottom: 20px;
  width: 100%;
  min-height: 500px;
  .el-button + .el-button {
    margin: 0 !important;
  }
  .tab-item {
    width: 160px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 6px;
    background-color: rgba(243, 245, 248, 100);
    font-size: 16px;

    color: rgba(16, 16, 16, 100);
  }
  .job-division {
    .job-division-header {
      margin: 20px 0 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
.modal {
  .el-form-item {
    margin: 20px 0 0 0;
  }
  .dialog-footer {
    .btn {
      width: 200px;
    }
  }
}
.mr40 {
  margin-right: 40px;
}
.w100 {
  width: 100%;
}
</style>
