/*
 * @Description:
 * @Author: Author
 * @Date: 2022-06-13 09:49:04
 * @LastEditTime: 2022-06-14 11:05:57
 * @LastEditors: Author
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import './style/common.css'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import registerGlobalComponents from '@/components/index'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import permission from '@/directives/permission'

export const app: any = createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
    size: 'large'
  })
  .use(VXETable)
registerGlobalComponents(app)
permission(app)
app.mount('#app')

// 设置全局属性 弹窗默认点击遮罩层不关闭
app._instance.appContext.components.ElDialog.props.closeOnClickModal.default =
  false
