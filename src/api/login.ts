import { request } from "@/api/request"
import { mergeApiRequestObj } from './utils'
declare global {
    
    ///登录参数 类型转换
    interface LoginParams {
        username: string,
        password: string,
        code: string,
        uuid: string
    }

    interface GetCodeImgRes extends ApiCommonRes {
        img: string
        captchaEnabled: boolean,
        uuid: string
    }

}

export function login(data: ApiRequestObj<LoginParams>) {
    return request.bind(this)<LoginParams>('/login', mergeApiRequestObj(data, {
        method: 'POST',
        headers: {
            isToken: false
        }
    }));
}

// 获取验证码
export function getCodeImg(data: ApiRequestObj<AnyObject>) {
    return request.bind(this)<GetCodeImgRes>('/captchaImage', mergeApiRequestObj(data, {
        headers: {
            isToken: false
        },
        timeout: 20000
    }));
}