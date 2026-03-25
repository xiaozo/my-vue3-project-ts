
import { mergeRequestOptions, getToken } from './utils'
import { msgErrorToast } from '@/utils'


const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const ErrorCode = {
	'401': '认证失败，无法访问系统资源',
	'403': '当前操作没有权限',
	'404': '访问资源不存在',
	'default': '系统未知错误，请反馈给管理员'
}
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