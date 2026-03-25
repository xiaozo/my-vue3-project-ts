import {
    customRef
} from 'vue';

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
export * from './modal';
export * from './validate';


