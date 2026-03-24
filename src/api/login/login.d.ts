
declare global {

    ///登录参数
    interface LoginParams {
        username: string,
        password: string,
        code: string,
        uuid: string
    }


}

declare global {

    interface GetCodeImgRes extends ApiCommonRes {
        img: string
        captchaEnabled: boolean,
        uuid: string
    }

    interface LoginRes extends ApiCommonRes {
        token: string
    }

    interface GetInfoRes extends ApiCommonRes {
        permissions: string[];
        roles: string[];
        isDefaultModifyPwd: boolean;
        isPasswordExpired: boolean;
        user: MODEL.UserInfo;
    }

 

    
}


export { }