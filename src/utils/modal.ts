// utils/message.ts

// 消息提示
export function msgToast(content: string) {
  uni.showToast({
    icon: 'none',
    title: content,
    duration: 2000
  })
}

// 错误消息
export function msgErrorToast(content: string) {
  uni.showToast({
    icon: 'error',  // 修正：添加 icon 参数
    title: content,
    duration: 2000
  })
}

// 成功消息
export function msgSuccessToast(content: string) {
  uni.showToast({
    icon: 'success',
    title: content,
    duration: 2000
  })
}

// 隐藏消息
export function hideMsg() {  // 修正：移除无用的 content 参数
  uni.hideToast()
}

// 弹出提示
export function alert(content: string, title: string = '系统提示') {
  uni.showModal({
    title: title,
    content: content,
    showCancel: false
  })
}

// 确认窗体
export function confirm(content: string, title: string = '系统提示'): Promise<boolean> {
  return new Promise((resolve) => {
    uni.showModal({
      title: title || '系统提示',
      content: content,
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        resolve(res.confirm)
      }
    })
  })
}
