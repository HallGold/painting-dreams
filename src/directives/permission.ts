/*
 * @Description:
 * @Author: Author
 * @Date: 2022-06-13 16:44:32
 * @LastEditTime: 2022-06-14 10:41:20
 * @LastEditors: Author
 */
import store from '@/store/index'

// 指令-控制按钮权限
export default (app: any) => {
  app.directive('permission', {
    mounted (el: any, options: any) {
      let permission: any = [] // 可控权限列表
      const userInfo: any = (store as any).state.userInfo
      const metaValue: any = (store as any).state.metaValue
      if (userInfo.type === '1') return // 超级管理员
      if (userInfo.permission && userInfo.permission.length > 0) {
        try {
          permission = JSON.parse(userInfo.permission)
        } catch (err) {
          permission = []
        }
      }
      const editIndex = permission.findIndex(
        (item: any) => item === `${metaValue}-edit`
      )
      const addIndex = permission.findIndex(
        (item: any) => item === `${metaValue}-add`
      )
      const deleteIndex = permission.findIndex(
        (item: any) => item === `${metaValue}-delete`
      )
      if (options.value === 'edit') {
        // 编辑按钮
        el.style.display = editIndex > -1 ? 'block' : 'none'
      } else if (options.value === 'add') {
        // 新增按钮
        el.style.display = addIndex > -1 ? 'block' : 'none'
      } else if (options.value === 'delete') {
        // 删除按钮
        el.style.display = deleteIndex > -1 ? 'block' : 'none'
      } else if (options.value === 'table') {
        if (editIndex === -1 && deleteIndex === -1) {
          el.parentNode.removeChild(el)
        }
      }
    }
  })
}
