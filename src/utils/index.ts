import {
    customRef
} from 'vue';

/**
* 显示消息提示框
* @param content 提示的标题
*/
export function msgToast(content: string) {
    uni.showToast({
        icon: 'none',
        title: content,
        duration: 2000
    })
}

/**
* 显示消息提示框
* @param content 提示的标题
*/
export function msgSuccessToast(content: string) {
    uni.showToast({
        icon: 'success',
        title: content,
        duration: 2000
    })
}

/**
* 显示消息提示框
* @param content 提示的标题
*/
export function msgErrorToast(content: string) {
    uni.showToast({
        title: content,
        icon: 'none',
        duration: 2000
    })
}


// 自动保存到 localStorage
export function useLocalStorageRef(key:string , initialValue:any) {
    return customRef((track, trigger) => {
        let value = uni.getStorageSync(key) || initialValue

        return {
            get() {
                track()
                return value
            },
            set(newValue) {
                value = newValue
                uni.setStorageSync(key, newValue);
                trigger()
            }
        }
    })
}

// 导出验证函数
export * from './validate';


