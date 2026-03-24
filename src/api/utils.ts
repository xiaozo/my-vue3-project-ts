const TokenKey = 'App-Token'

export function getToken() {
  return uni.getStorageSync(TokenKey)
}

export function setToken(token: string) {
  return uni.setStorageSync(TokenKey, token)
}

export function removeToken() {
  return uni.removeStorageSync(TokenKey)
}

///合并RequestOptions
export const mergeRequestOptions = (defaultOptions?: RequestOptions, options?: RequestOptions) => {
    return { ...defaultOptions, ...options, headers: { ...defaultOptions?.headers, ...options?.headers } };

}

///接收ApiRequestObj，RequestOptions(合并options)
export const mergeApiRequestObj = (data: ApiRequestObj, options: RequestOptions) => {
    return { ...data, options: mergeRequestOptions(options,data?.options) };
}