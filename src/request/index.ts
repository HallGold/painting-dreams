import { get, post, upload } from '@/request/axios'
import {
  HttpPromise,
  LoginRequestProps,
  LoginResponseProps,
  UserInfoProps,
  UersssyListProps,
  ManagerPostProps,
  SysUserRequestProps,
  PasswordRequestProps,
  OperatingCompanyRequestProps,
  OperatingCompanyResponseProps
} from './requestProps'
/**
 *  @description 登录-Login
 */
export const login = (
  query: LoginRequestProps
): HttpPromise<LoginResponseProps> => {
  return post('/api/login', query)
}

/**
 * @description 获取用户信息-getUserInfo
 * */
export const getUserInfo = (): HttpPromise<UserInfoProps> =>
  get('/api/getUserInfo')

/**
 * @description 后台设置-获取运营中的公司和已经注销公司列表
 * */
export const getOperatingCompanyList = (
  data: OperatingCompanyRequestProps
): HttpPromise<OperatingCompanyResponseProps> =>
  get('/api/operatingCompany/list', data)

/**
 * @description 后台设置-获取后台人员列表
 * */
export const getSysUser = (data: any): HttpPromise<UersssyListProps> =>
  get('/api/sysUser/list', data)

/**
 * @description 后台设置-新增后台管理人员
 * */
export const addAddSysUser = (
  data: SysUserRequestProps
): HttpPromise<SysUserRequestProps> => post('/api/sysUser/save', data)

/**
 * @description 后台人员设置-编辑后台管理人员
 */
export const updateAddSysUser = (
  data: SysUserRequestProps
): HttpPromise<SysUserRequestProps> => post('/api/sysUser/update', data)

/**
 * @description 后台人员设置-修改管理人员密码
 * */
export const updateSysUserPassword = (
  data: PasswordRequestProps
): HttpPromise<PasswordRequestProps> =>
  post('/api/sysUser/updatePassword', data)

/**
 * @description 后台人员设置-删除后台人员
 * */

export const deleteSysUser = (data: {
  id: string
}): HttpPromise<{ id: string }> => post('/api/sysUser/logicDelete', data)

/**
 * @description 【后台设置】-获取岗位列表
 * */

export const getManagerPost = (): HttpPromise<Array<ManagerPostProps>> =>
  get('/api/managePost/list')

/**
 * @description 后台人员设置-职位分工列表 /api/Pdeginosst / list
 * */
export const getDesignPost = () => get('/api/designPost/list')

/**
 * @description 后台设置-新增分工
 * */
export const designPostSave = (data: any) => post('/api/designPost/save', data)

/**
 * @description 后台设置-人员列表
 * */
export const getSysUserList = (data: any) => get('/api/sysUser/list', data)

/**
 * 后台设置-编辑职位分工
 * */
export const designPostUpdate = (data: any) =>
  post('/api/designPost/update', data)

/**
 * @description 后台设置-删除新增分工
 * */
export const designPostDelete = (id: string) =>
  post('/api/designPost/logicDelete', { id })

/**
 * @description 后台设置-新增运营公司
 * */
export const operatingCompanySave = (data: any) =>
  post('/api/operatingCompany/save', data)

/**
 * @description 后台设置-编辑运营公司
 * */
export const operatingCompanyUpdate = (data: any) =>
  post('/api/operatingCompany/update', data)

/**
 * @description 后台设置-删除运营公司
 * */
export const operatingCompanyDelete = (id: string) =>
  post('/api/operatingCompany/logicDelete', { id })

/**
 * @description 管理成本-固定成本列表
 * */
export const getFixedCostsList = (data: any) =>
  get('/api/fixedCosts/list', data)

/**
 * @description 管理成本-新增固定成本下拉列表
 * */
export const getFixedCostsSelectList = () => get('/api/fixedCosts/selectList')

/**
 * @description 管理成本-新增固定成本
 * */
export const saveFixedCosts = (data: any) => post('/api/fixedCosts/save', data)

/**
 * @description 管理成本-编辑固定成本
 * */
export const updateFixedCosts = (data: any) =>
  post('/api/fixedCosts/update', data)

/**
 * @description 管理成本-固定成本总计
 * */
export const getTotalFixedCosts = (data: any) =>
  get('/api/fixedCosts/totalFixedCosts', data)

/**
 * @description 管理成本-删除固定成本
 * */
export const logicDeleteFixedCosts = (id: string) =>
  post('/api/fixedCosts/logicDelete', { id })
/**
 * @description 管理成本-管理员成本列表
 * */
export const getManagerCostsList = (data: any) => get('/api/wage/list', data)

/**
 * @description 管理人员成本-新增
 * */
export const saveManagerCosts = (data: any) =>
  post('/api/managerCosts/save', data)

/**
 * @description 管理人员成本-删除
 * */
export const logicDeleteManagerCosts = (id: string) =>
  post('/api/managerCosts/logicDelete', { id })

/**
 * @description 管理人员成本-编辑
 * */
export const updateManagerCosts = (data: any) =>
  post('/api/managerCosts/update', data)
/**
 * @description 管理成本-管理人员成本统计
 * */
export const getTotalManagerCosts = (data: any) =>
  get('/api/managerCosts/totalManagerCosts', data)
/**
 * @description 管理成本-报销列表
 * */
export const getReimbursementCostsList = (data: any) =>
  get('/api/reimbursementCosts/list', data)

/**
 * @description 管理成本-新增报销
 * */
export const reimbursementCostsSave = (data: any) =>
  post('/api/reimbursementCosts/save', data)

/**
 * @description 管理成本-编辑报销
 * */
export const reimbursementCostsUpdate = (data: any) =>
  post('/api/reimbursementCosts/update', data)

/**
 * @description 管理成本-报销累计
 * */
export const getThisMonthReimbursementCosts = (data: any) =>
  get('/api/reimbursementCosts/thisMonthReimbursementCosts', data)
/**
 * @description 管理成本-删除报销
 * */
export const logicDeleteReimbursementCosts = (id: string) =>
  post('/api/reimbursementCosts/logicDelete', { id })

/**
 *  @description common-文件上传
 * */
export const uploadFileRequest = (data: any) =>
  upload('/api/common/upload', data)

/**
 * @description 合作甲方公司信息-列表
 * */
export const getPartyACompanyList = (data: any) =>
  get('/api/partyACompany/list', data)

/**
 * @description 合作甲方公司信息-新增
 * */
export const savePartyACompany = (data: any) =>
  post('/api/partyACompany/save', data)

/**
 * @descriotion 合作甲方公司-下拉列表-选择公司
 * */
export const getPartyACompanySelectList = () =>
  get('/api/partyACompany/selectList')

/**
 * @description 合作甲方公司-编辑
 * */
export const updatePartyACompany = (data: any) =>
  post('/api/partyACompany/update', data)

/**
 * @description 合作甲方公司-删除
 * */
export const logicDeletePartyACompany = (id: string) =>
  post('/api/partyACompany/logicDelete', { id })

/**
 *  @description 工资表-列表
 * */
export const getWageList = (data: any) => get('/api/wage/list', data)

/**
 * @description 工资表-改月份是否更新状态
 * */
export const getWageThisMonthUpdateStatus = (data: any) =>
  get('/api/wage/thisMonthUpdateStatus', data)

/**
 * @description 工资表-新增
 * */
export const saveWage = (data: any) => post('/api/wage/save', data)

/**
 * @description 工资表-编辑
 * */
export const updateWage = (data: any) => post('/api/wage/update', data)

/**
 * @description 工资表-删除
 * */
export const logicDeleteWage = (id: string) =>
  post('/api/wage/logicDelete', { id })

/**
 * @description commom-员工列表
 * */
export const getEmployeeList = (data: any) => get('/api/employee/list', data)

/**
 * @description 外发画师资料-列表
 **/
export const getOutgoingPainterList = (data: any) =>
  get('/api/outgoingPainter/list', data)

/**
 * @description 外发画师资料-新增
 * */
export const saveOutgoingPainter = (data: any) =>
  post('/api/outgoingPainter/save', data)

/**
 * @description 外发画师资料-编辑
 * */
export const updateOutgoingPainter = (data: any) =>
  post('/api/outgoingPainter/update', data)

/**
 * @description 外发画师资料-删除
 * */
export const logicDeleteOutgoingPainter = (id: string) =>
  post('/api/outgoingPainter/logicDelete', { id })

/**
 * @description 员工资料-新增
 * */
export const saveEmployee = (data: any) => post('/api/employee/save', data)

/**
 * @description 员工资料-编辑
 * */
export const updateEmployee = (data: any) => post('/api/employee/update', data)

/**
 * @description 员工资料-删除
 * */
export const logicDeleteEmployee = (id: string) =>
  post('/api/employee/logicDelete', { id })

/**
 * @description 发票和收据-列表
 * */
export const getInvoiceReceiptList = (data: any) =>
  get('/api/invoiceReceipt/list', data)

/**
 * @description 在职人员安排- 列表类型(1在职人员安排 2外发画师安排)
 * */
export const getplanProjectList = (data: any) =>
  get('/api/project/planProjectList', data)

/**
 * @description 公司项目列表
 * */
export const getProjectCompanyProjectList = (data: any) =>
  get('/api/project/companyProjectList', data)

/**
 * @description 归档项目-列表
 * */
export const getarProjectChiveProjectList = (data: any) =>
  get('/api/project/archiveProjectList', data)

/**
 * @description 所有项目-列表
 * */
export const getAllProjectList = (data: any) => get('/api/project/list', data)

/**
 * @description 所有项目-人员下拉
 * */
export const getStaffList = () => get('/api/project/staffList')

/**
 * @description 项目工作日历排期
 * */
export const getPlanProjectScheduleList = (data: any) =>
  get('/api/project/planProjectScheduleList', data)

/**
 * @description 删除项目
 * */
export const logicDeleteProject = (id: string) =>
  post('/api/project/logicDelete', { id })

/**
 * @description 新增项目
 * */
export const saveProject = (data: any) => post('/api/project/save', data)

/**
 * @description 编辑项目
 * */
export const updateProject = (data: any) => post('/api/project/update', data)

/**
 * @description 新增发票
 * */
export const saveInvoiceReceipt = (data: any) =>
  post('/api/invoiceReceipt/save', data)

/**
 * @description 发票编辑
 * */
export const updateInvoiceReceipt = (data: any) =>
  post('/api/invoiceReceipt/update', data)

/**
 * @description 发票删除
 * */
export const logicDeleteInvoiceReceipt = (id: string) =>
  post('/api/invoiceReceipt/logicDelete', { id })

/**
 * 管理岗位新增
 * */
export const saveManagePost = (data: any) => post('/api/managePost/save', data)

/**
 * @description 管理岗位-编辑
 * */
export const updateManagePost = (data: any) =>
  post('/api/managePost/update', data)

/**
 * @description 删除岗位
 * */
export const logicDeleteManagePost = (id: string) =>
  post('/api/managePost/logicDelete', { id })

/**
 * @description 项目归档
 * */
export const archiveProject = (id: string) =>
  post('/api/project/archiveProject', { id })

/**
 * @description 撤销归档
 * */
export const unArchiveProject = (id: string) =>
  post('/api/project/unArchiveProject', { id })

/**
 * @description 所有职位(新)
 * */
export const queryAllPosition = () =>
  get('/api/employee/postAllList')
