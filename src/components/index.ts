// 获取当前目录所有 .vue 组件
const components = require.context('./', false, /\.vue$/)

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function registerGlobalComponents (app: any): void {
  components.keys().forEach((componentPath) => {
    // 自动导入组件
    const component = components(componentPath).default
    app.component(component.name, component)
  })
}
