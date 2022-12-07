import { Base64 } from 'js-base64'
import { uploadFileRequest } from '@/request/index'
import md5 from 'js-md5'
import store from '@/store'
import router from '@/router'
interface userInfoProps {
  token: string
  [key: string]: any
}

type userInfoTypes = userInfoProps | null

/**
 * @description 判断是否登录
 * @param userInfo
 * */
export const isLogin = (): boolean => {
  const userInfo: userInfoTypes = store.state.userInfo
  if (userInfo === null) return false
  return true
}

/**
 * @description 退出登录，清除数据
 * */
export const logOut = async (): Promise<any> => {
  // 清除store数据
  await store.commit('REMOVE_STROE', ['userInfo'])
  await router.replace('/login')
}

/**
 *  @description Base64 加密
 */
export const base64Encode = (str: string): string => {
  return Base64.encode(str)
}

/**
 * @description md5 加密
 */
export const md5Encode = (str: string): string => {
  return md5(str)
}

/**
 * @description  获取 token
 * */
export const getToken = (): string | undefined => {
  if (store.state.userInfo) {
    return (store.state.userInfo as any).token
  }
}

/**
 * @description 文件上传
 * */
export const uploadFile = (data: any) => {
  const from = new FormData()
  from.append('file', data)
  return uploadFileRequest(from)
}
