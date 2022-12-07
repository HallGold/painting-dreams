/**
 * 员工状态
 */
export const userStatus: any = {
  1: { text: '实习', color: '#845EC2' },
  2: { text: '试用', color: '#008E9B' },
  3: { text: '正式', color: '#0081CF' },
  4: { text: '离职', color: '#FF9671' },
  5: { text: '停薪留职', color: '#F9F871' },
  6: { text: '外放', color: '#D65DB1' }
}

/**
 * 人员类型
*/
export const userType: any = {
  1: { text: '在职员工' },
  2: { text: '外发画师' }, // status 转换为员工状态值
  3: { text: '在职员工', status: 6 }
}

/**
 * 项目状态
 */
export const projectStatus: any = [
  {},
  { key: '1', text: '未分配', color: '#eee' },
  { key: '2', text: '测试中', color: '#E6A23C' },
  { key: '3', text: '测试中(未通过)', color: '#CCC' },
  { key: '4', text: '进行中', color: '#68c23c' },
  { key: '5', text: '移交', color: 'rgb(112, 182, 3)' },
  { key: '6', text: '已完成', color: 'rgb(112, 182, 3)' },
  { key: '7', text: '已完成(已开发票)', color: 'rgb(0, 191, 191)' },
  { key: '8', text: '已完成(已收款)', color: '#409EFF' }
]

/**
 * 在职人员效率状态
 */
export const efficiencyStatus: any = [
  { text: '正常', content: '正常（<0.7)', color: 'rgb(202, 249, 130)' },
  { text: '注意', content: '注意（0.7 ~ 0.8）', color: 'rgb(250, 205, 145)' },
  { text: '不合格', content: '不合格（0.9 ~ 1）', color: 'rgb(245, 154, 35)' },
  { text: '亏损', content: '亏损（>1）', color: 'rgb(217, 0, 27)' }
]

export const getEfficiencyStatus = (value: number): any => {
  let status: any = {}
  if (value < 0.7) {
    status = efficiencyStatus[0]
  } else if (value <= 0.8) {
    status = efficiencyStatus[1]
  } else if (value <= 1) {
    status = efficiencyStatus[2]
  } else {
    status = efficiencyStatus[3]
  }
  return status
}
