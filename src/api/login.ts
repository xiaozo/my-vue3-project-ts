import { request } from "@/api/request"
import { mergeApiRequestObj } from './utils'
declare global {
    interface LoginParams {
        id?: string;
        name: string;
    }

    interface GetCodeImgRes extends ApiCommonRes {
        img: string
        captchaEnabled: boolean
    }

}

export function login(data: ApiRequestObj<LoginParams>) {
    return request.bind(this)<ApiCommonRes>('/api/login', mergeApiRequestObj(data, {
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