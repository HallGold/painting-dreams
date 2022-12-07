<template>
  <div class="painter-info-container">
    <div class="filter-header-content d-flex d-f-row-bet">
      <div class="filter-left d-flex d-f-col-center">
        <d-tab
          v-for="tab in tabs"
          :key="tab.id"
          :text="tab.name"
          :active="tab.id === activeTabIndex"
          :mr="10"
          @click="changeTab(tab.id)"
        />
      </div>
      <div class="filter-right">
        <d-add text="添加外发" v-permission="'add'" @click="openMoadl" />
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-content">
      <el-table
        border
        :stripe="true"
        :height="height"
        size="large"
        v-loading="tableLoading"
        :data="tableData"
        style="width: 100%"
      >
        <template v-for="(head, index) in tableHeaderData" :key="index">
          <!-- 非附件展示 -->
          <el-table-column
            v-if="head.prop !== 'contractFileUrl'"
            :prop="head.prop"
            :label="head.name"
            :width="head.width"
          />
          <el-table-column :label="head.name" :width="head.width" v-else>
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                @click.prevent="
                  downloadContractFileUrl(scope.row.contractFileUrl)
                "
              >
                查看
              </el-button>
            </template>
          </el-table-column>
        </template>

        <el-table-column fixed="right" label="操作" v-permission="'table'" width="120">
          <template #default="scope">
            <div style="width: 120px">
              <el-button type="text" v-permission="'edit'" size="small" @click="openMoadl(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                v-permission="'delete'"
                @click="deleteOutgoingPainter(scope.row.id)"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加外发弹窗 -->
    <el-drawer
      size="50%"
      v-model="addOutgoingModal"
      title="新增外发"
      :with-header="true"
    >
      <template #title>
        <p class="t-c t-main-color f20">新增外发</p>
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
            <el-form-item label="身份证" prop="idCard">
              <el-input placeholder="请输入身份证号码" v-model="form.idCard" />
            </el-form-item>
            <el-form-item label="合同地址" prop="contractAddress">
              <el-input
                placeholder="请输入合同地址"
                v-model="form.contractAddress"
              />
            </el-form-item>
            <el-form-item label="外发价格" prop="amount">
              <el-input placeholder="请输入外发价格" v-model="form.amount" />
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
            <el-form-item label="职位" prop="designPostId">
              <el-select
                style="width: 100%"
                v-model="form.designPostId"
                placeholder="请选择职位"
              >
                <el-option
                  v-for="design in designPosts"
                  :key="design.id"
                  :label="design.name"
                  :value="design.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="联系方式" prop="phone">
              <el-input placeholder="请输入电话号码" v-model="form.phone" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                style="width: 100%"
                v-model="form.status"
                placeholder="请选择状态"
              >
                <el-option label="未合作" value="0" />
                <el-option label="合作中" value="1" />
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
            @click="savePainter(leftModalRef, rightModalRef)"
            >保存</el-button
          >
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, Ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { uploadFile } from '@/utils/index'
import {
  getOutgoingPainterList,
  getDesignPost,
  saveOutgoingPainter,
  updateOutgoingPainter,
  logicDeleteOutgoingPainter
} from '@/request/index'
import { Plus, CircleCloseFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableHeaderData = [
  { name: '姓名', prop: 'name', width: 160 },
  { name: '岗位', prop: 'designPostName', width: 120 },
  { name: '身份证', prop: 'idCard', width: 200 },
  { name: '外发价格', prop: 'amount' },
  { name: '联系方式', prop: 'phone', width: 160 },
  { name: '地址', prop: 'contractAddress', width: 160 },
  { name: '合同扫描件', prop: 'contractFileUrl', width: 160 },
  { name: '备注', prop: 'remark', width: 200 }
]

export default defineComponent({
  components: {
    Plus,
    CircleCloseFilled
  },
  setup () {
    const height: Ref<number> = ref(500)
    const addOutgoingModal: Ref<boolean> = ref(false)
    const rightModalRef = ref<FormInstance>()
    const leftModalRef = ref<FormInstance>()
    const tableLoading = ref(false)
    const designPosts: Ref<
      Array<{
        id: string
        name: string
      }>
    > = ref([])
    const tabs = ref([{ name: '全部外发', id: -1 }])
    const activeTabIndex = ref(-1)
    const tableData = ref([])

    const changeTab = (id: number): void => {
      if (activeTabIndex.value !== id) {
        activeTabIndex.value = id
        getOutgoingPainterLists()
      }
    }
    const getOutgoingPainterLists = async () => {
      tableLoading.value = true
      try {
        const { code, data } = await getOutgoingPainterList({
          designPostId: activeTabIndex.value === -1 ? '' : activeTabIndex.value,
          keyword: '',
          limit: -1,
          page: 1,
          status: ''
        })
        if (code === 200) {
          tableData.value = data?.list
        }
      } finally {
        tableLoading.value = false
      }
    }

    // 打开弹窗
    const openMoadl = (row: any) => {
      if (row && row.id) {
        for (const key in form) {
          form[key] = row[key]
        }
      } else {
        for (const key in form) {
          form[key] = ''
        }
      }
      addOutgoingModal.value = true
    }
    // 获取职位列表
    const getDesignPosts = async () => {
      const { code, data } = await getDesignPost()
      if (code === 200 && data) {
        designPosts.value = (data || []).map((item: any) => {
          return { ...item, id: String(item.id) }
        })
        ;(data || []).map((item: any) => {
          tabs.value.push(item)
        })
      }
    }

    // 图片上传
    const uploadFileChange = async (e: any) => {
      if (e.target.files && e.target.files[0]) {
        const { code, data } = await uploadFile(e.target.files[0])
        if (code === 200) {
          form.contractFileUrl = data[0].url
          ;(leftModalRef.value as any).validateField(['invoiceFileUrl'])
        }
      }
    }

    // 图片删除
    const deleteImg = async () => {
      form.contractFileUrl = ''
      ;(leftModalRef.value as any).validateField(['contractFileUrl'])
    }
    // 新增编辑提交
    const savePainter = async (
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
          getOutgoingPainterLists()
          // 关闭弹窗
          addOutgoingModal.value = false
        }
      }
      leftModalRef.validate(async (valid) => {
        if (valid) {
          const query = {
            ...form
          }
          rightModalRef.validate(async (rightValid) => {
            if (rightValid) {
              if (!form.id) {
                // 新增
                const { code } = await saveOutgoingPainter(query)
                if (code === 200) {
                  sucess(code)
                }
              } else {
                // 编辑
                const { code } = await updateOutgoingPainter(query)
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

    // 打开合同文件
    const downloadContractFileUrl = (href: string) => {
      window.open(href, '_blank')
    }
    // 删除
    const deleteOutgoingPainter = async (id: string) => {
      ElMessageBox.confirm('确定删除该项吗?', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await logicDeleteOutgoingPainter(id)
        if (code === 200) {
          getOutgoingPainterLists()
        }
      })
    }
    onMounted(() => {
      getOutgoingPainterLists()
      getDesignPosts()
      nextTick(() => {
        height.value = document.documentElement.clientHeight - 160
      })
    })

    const form = reactive({
      contractFileUrl: '', // 扫描件 url
      id: '',
      name: '', // 姓名
      idCard: '', // 身份证
      amount: '', // 价格
      contractAddress: '', // 合同地址
      designPostId: '', // 职位id
      phone: '', // 电话号码
      status: '', // 合作状态
      remark: '' // 备注
    })

    const formRuls = {
      contractFileUrl: [
        { required: true, message: '请上传合同扫描件', trigger: 'blur' }
      ], // 扫描件 url
      id: '',
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }], // 姓名
      idCard: [
        { required: true, message: '请输入身份证号码', trigger: 'blur' }
      ], // 身份证
      contractAddress: [
        { required: true, message: '数输入合同地址', trigger: 'blur' }
      ], // 合同地址
      amount: [
        {
          required: true,
          message: '数输入外发价格',
          trigger: 'blur'
        }
      ],
      designPostId: [
        { required: true, message: '请选择职位', trigger: 'blur' }
      ], // 职位id
      phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }], // 电话号码
      status: [{ required: true, message: '请选择合作状态', trigger: 'blur' }], // 合作状态
      remark: [{ required: true, message: '请输入备注', trigger: 'blur' }] // 备注
    }

    return {
      Plus,
      tabs,
      activeTabIndex,
      changeTab,
      tableHeaderData,
      tableData,
      height,
      addOutgoingModal,
      form,
      savePainter,
      leftModalRef,
      rightModalRef,
      uploadFileChange,
      deleteImg,
      designPosts,
      formRuls,
      openMoadl,
      deleteOutgoingPainter,
      downloadContractFileUrl,
      tableLoading
    }
  }
})
</script>

<style lang="less" scoped>
.painter-info-container {
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
</style>
