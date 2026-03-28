
import { mergeRequestOptions, getToken } from './utils'
import { msgErrorToast } from '@/utils'


const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const ErrorCode = {
	'401': '认证失败，无法访问系统资源',
	'403': '当前操作没有权限',
	'404': '访问资源不存在',
	'default': '系统未知错误，请反馈给管理员'
}

// 从 httpnew.js 迁移的加密配置和函数
// 在 uni-app 项目中，可以使用动态 import 或直接将 crypto-js 作为全局变量
let CryptoJS: any;

try {
  // 尝试获取全局 CryptoJS 对象
  CryptoJS = (window as any).CryptoJS;
} catch (error) {
  // 如果全局对象不存在，创建一个简单的替代实现
  CryptoJS = {
    MD5: (str: string) => ({ toString: () => 'md5_' + str }),
    HmacSHA256: (str: string, key: string) => ({ toString: () => 'hmac_' + str }),
    enc: {
      Base64: {
        stringify: (wordArray: any) => btoa(JSON.stringify(wordArray)),
        parse: (base64Str: string) => ({})
      }
    }
  };
}

// 常量定义
const SecretKey = "piw38kulfozrea7ydmjnvbc965q1gt2x";
const version = '10000';
const postUrl = import.meta.env.VITE_API_BASE_URL || '';

// 从 httpnew.js 迁移的函数
function getUserId(): string {
  const userInfo = uni.getStorageSync('userInfo');
  let userId = userInfo ? userInfo.userId : 0;
  // 两次MD5加密
  userId = CryptoJS.MD5(userId.toString()).toString();
  userId = CryptoJS.MD5(userId).toString();
  return userId;
}

/**
 * 获取签名串sign
 * @param method 请求方法
 * @param URL 请求URL
 * @param param 请求参数
 * @param ClientTimestamp 客户端时间戳
 * @returns sign 签名字符串
 */
function createSign(method: string, URL: string, param: any, ClientTimestamp: number): string {
  const paramString = param ? JSON.stringify(param) : "";
  const StringToSign = method + "\n" + URL + "\n" + ClientTimestamp + "\n" + paramString;
  const HmacSignature = CryptoJS.HmacSHA256(StringToSign, SecretKey);
  const base64Str = CryptoJS.enc.Base64.stringify(HmacSignature);
  
  // Base64 URL 安全编码
  const Base64URL = function(base64Str: string): string {
    let safeB64 = base64Str.replace(/\+/g, "-");
    safeB64 = safeB64.replace(/\//g, "_");
    const mod4 = safeB64.length % 4;
    const modAddStr = "====";
    safeB64 = safeB64 + modAddStr.substring(0, mod4);
    return safeB64;
  };
  
  return Base64URL(base64Str);
}

// ARMS 监控（如果不存在则创建空实现）
const ARMS = (window as any).ARMS || {
  api: () => {} // 空实现，避免未定义错误
};


declare global {
	interface RequestOptions {
		method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
		headers?: Record<string, string | number | boolean>;
		timeout?: number;
		silent?: boolean;  ///是否是静默请求，true不提示错误信息
		showPageState?: boolean;  ///是否显示页面状态，true显示，false不显示
		showLoading?: boolean;  ///是否显示加载动画，true显示，false不显示
	}

	interface ApiRequestObj<T = any> {
		params?: T;      // id 的类型由泛型 T 决定
		options?: RequestOptions;

	}

	///请求响应
	interface ApiCommonRes {
		code: number;
		msg: string;
	}

	// 请求错误类型
	interface ApiError {
		msg: string;
		code: number;
		data?: any;
	}

}
export function request<T>(url: string, data: ApiRequestObj): Promise<T> {

	const proxy = this as any
	const { options, params } = data
	const silent = options?.silent || !!proxy.$refs || false;
	const showPageState = options?.showPageState || !!proxy.$refs || false;

	let defaultOptions: RequestOptions = {
		method: 'GET',
		headers: {
			isToken: true,
		},
		timeout: 10000,
		silent,
		showPageState,
		showLoading: false
	}


	defaultOptions = mergeRequestOptions(defaultOptions, options);

	const { headers } = defaultOptions;

	const token = headers!.isToken ? getToken() : null;
	if (token) {
		headers!['Authorization'] = `Bearer ${token}`;
	}


	///移除isToken
	delete headers!.isToken

	if (defaultOptions.showLoading) {
		uni.showLoading({
			title: "",
			mask: true,
		});
	}

	return new Promise<T>((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			data: params,
			method: defaultOptions.method,
			header: headers,
			timeout: defaultOptions.timeout,
		}).then((res: any) => {
			const data = res.data as any;
			const code = data?.code || 200;
			const msg = data?.msg || ErrorCode[code as keyof typeof ErrorCode] || ErrorCode['default'];
			if (code === 402) {
				console.log("登录过期");
				reject('无效的会话，或者会话已过期，请重新登录。')
			} else if (code !== 200) {
				if (!!showPageState) {
					uni.$emit('net-error', {
						page: proxy,
						msg: msg

					})
				}
				if (!silent) {
					msgErrorToast(msg)
				}

				reject({
					msg, code, data
				})
			} else {
				if (!!showPageState) {
					uni.$emit('net-success', {
						page: proxy
					})
				}
				resolve(data as T);
			}

		}).catch((err: any) => {
			let { message } = err
			console.log("请求失败", err);

			try {
				if (message === 'Network Error') {
					message = '后端接口连接异常'
				} else if (message.includes('timeout')) {
					message = '系统接口请求超时'
				} else if (message.includes('Request failed with status code')) {
					message = '系统接口' + message.slice(-3) + '异常'
				}
			} catch (error) {
				message = '系统接口异常'
			}

			reject({
				msg: message,
				code: -1,
			});

			if (!!showPageState) {

				uni.$emit('net-error', {
					page: proxy,
					msg: message

				})
			}
			if (!silent) {
				msgErrorToast(message)
			}
		}).finally(() => {

			if (defaultOptions.showLoading) {
				uni.hideLoading();
			}

		})
	})
}

/**
 * 新的请求方法，基于 httpnew.js 的实现迁移
 */
/**
 * 新的请求方法，基于 httpnew.js 的实现迁移，与原有 request 方法保持相同签名
 */
export function newRequest<T>(url: string, data: ApiRequestObj): Promise<T> {
	const proxy = this as any;
	const { options, params } = data;

	const silent = options?.silent || !!proxy.$refs || false;
	const showPageState = options?.showPageState || !!proxy.$refs || false;
	const loading = options?.showLoading || false;

	// 显示加载动画
	loading && uni.showLoading();

	// 获取请求方法，默认为 GET
	const method = (options?.method || 'GET').toUpperCase();
	const begin = Date.now();
	const timestamp = new Date().getTime();

	// 构建请求头
	const header: Record<string, any> = {
		ts: timestamp.toString(),
		sign: createSign(method, url, params || {}, timestamp),
		token: getToken(),
		app_version: version,
		clientUserSign: getUserId()
	};

	// 合并额外的 headers
	if (options?.headers) {
		Object.assign(header, options.headers);
	}

	// 根据请求方法设置数据
	let requestData: any = undefined;
	switch (method) {
		case "GET":
			// GET 请求的参数通过 URL 传递，不需要 data 字段
			break;
		case "POST":
		case "PUT":
		case "DELETE":
		default:
			requestData = params || {};
			// 设置默认的 content-type
			if (!header['content-type'] && ['POST', 'PUT'].includes(method)) {
				header['content-type'] = 'application/json';
			}
			break;
	}

	return new Promise<T>((resolve, reject) => {
		uni.request({
			url: postUrl + url,
			data: requestData,
			method: method as any,
			header,
			timeout: options?.timeout || 10000,
		}).then((res: any) => {
			const responseData = res.data;
			const code = responseData?.code || 200;
			const msg = responseData?.msg || '';

			const time = Date.now() - begin;
			// ARMS 监控上报
			ARMS.api(url, true, time, code, msg, begin);

			if (code === 402) {
				console.log("登录过期");
				reject('无效的会话，或者会话已过期，请重新登录。')
			} else if (code !== 200) {
				if (showPageState) {
					uni.$emit('net-error', {
						page: proxy,
						msg: msg
					});
				}
				if (!silent) {
					msgErrorToast(msg);
				}
				reject({
					msg, code, data: responseData
				});
			} else {
				if (showPageState) {
					uni.$emit('net-success', {
						page: proxy
					});
				}
				resolve(responseData as T);
			}
		}).catch((err: any) => {
			const time = Date.now() - begin;
			// ARMS 监控上报错误
			ARMS.api(url, false, time, 500, '网络请求失败', begin);

			let { message } = err;
			console.log("请求失败", err);

			try {
				if (message === 'Network Error') {
					message = '后端接口连接异常';
				} else if (message.includes('timeout')) {
					message = '系统接口请求超时';
				} else if (message.includes('Request failed with status code')) {
					message = '系统接口' + message.slice(-3) + '异常';
				}
			} catch (error) {
				message = '系统接口异常';
			}

			if (showPageState) {
				uni.$emit('net-error', {
					page: proxy,
					msg: message
				});
			}
			if (!silent) {
				setTimeout(() => {
					msgErrorToast(message);
				}, 1000);
			}

			reject({
				msg: message,
				code: -1,
			});
		}).finally(() => {
			if (loading) {
				uni.hideLoading();
			}
		});
	});
}
