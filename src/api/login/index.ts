import { request } from "@/api/request"
import { mergeApiRequestObj } from '@/api/utils'


export function login(data: ApiRequestObj<LoginParams>) {
    return request.bind(this)<LoginRes>('/login', mergeApiRequestObj(data, {
        method: 'POST',
        headers: {
            isToken: false
        }
    }));
}

// 获取验证码
export function getCodeImg(data: ApiRequestObj<any>) {
    return request.bind(this)<GetCodeImgRes>('/captchaImage', mergeApiRequestObj(data, {
        headers: {
            isToken: false
        },
        timeout: 20000
    }));
}

// 获取用户详细信息
export function getInfo(data: ApiRequestObj<any>) {
    return request.bind(this)<GetInfoRes>('/getInfo', data);
}    

// 退出方法
export function logout(data: ApiRequestObj<any>) {
  return request.bind(this)<any>('/logout',  mergeApiRequestObj(data, {
       method: 'POST'
    }));
}

