<template>
  <my-paging ref="paging" v-model="dataList" @query="queryList" @pageLoad="pageLoad">
    <!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
    <!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
    <image :src="codeUrl" class="login-code-img" @click="loginAction" show-menu-by-longpress="true"></image>
    <text v-if="$hasPermission(['*:*:*'])">{{ loginForm.username }}</text>
    <input v-model="loginForm.code" type="number" class="input" placeholder="请输入验证码" maxlength="4" />
    <view class="item" v-for="(item, index) in dataList" :key="index">
      <view class="item-title"> </view>
    </view>
  </my-paging>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, type ComponentInternalInstance } from 'vue';
import {
  onLoad
} from '@dcloudio/uni-app';
const { proxy } = getCurrentInstance() as ComponentInternalInstance
import { login, getCodeImg, getInfo } from '@/api/login';
import { setToken } from '@/api/utils';
import { pageHook } from "@/common/pageHook"
import { useUserStore } from '@/store'
import { request } from "@/api/request"
const userStore = useUserStore()

const codeUrl = ref("")
// v-model绑定的这个变量不要在分页请求结束中自己赋值，直接使用即可
const dataList = ref([])

// 或使用简化写法
const paging = ref<MyPagingRef>();

const loginForm = ref({
  username: "admin",
  password: "admin123",
  code: "",
  uuid: ""
})

const {
  _options,
  _pagePro
} = pageHook(paging);

onLoad(() => {
  // console.log(proxy.$modal);
  setTimeout(() => {
    // getCodeImg.bind(proxy)({}).then((res: GetCodeImgRes) => {
    //   codeUrl.value = 'data:image/gif;base64,' + res.img
    //   loginForm.value.uuid = res.uuid
    //   paging.value?.complete();

    // }).catch((err: ApiError) => {

    //   console.log("getCodeImg err", err)

    // })
    // request.bind(proxy)("/wechat/user/update-info", {
    //   params: {
    //     name: "华伦校友6572",
    //     ossPath: ""
    //   },
    //   options: {
    //     method: "POST"
    //   }

    // }).then((res: any) => {
    //   paging.value?.complete();
    //   console.log("res", res)

    // }).catch((err: ApiError) => {
    //   console.log("err", err)
    // })
  }, 200);

})

// @pageLoad 绑定的方法,页面加载完成时触发
const pageLoad = (options: any) => {
  console.log('页面参数:', options);
}

// @query所绑定的方法，具体的参数参数类型可在html上的@query注释中查看
const queryList = (pageNo: number, pageSize: number) => {
  // paging.value?.complete([]);

}

const loginAction = () => {
  // console.log("loginAction", loginForm.value);
  ///请求登录接口
  // login({
  //   params: loginForm.value
  // }).then((res: LoginRes) => {

  //   setToken(res.token)
  //   getInfo({}).then((res: GetInfoRes) => {
  //     console.log("getInfo res", res)
  //   })
  // })

  if (userStore.isLoggedIn) {
    console.log("hasadimin:", userStore.hasPermission(["*:*:*"]))


  } else {
    userStore.login(
      loginForm.value
    ).then((res: LoginRes) => {

      userStore.getInfo().then((res: GetInfoRes) => {
        console.log("getInfo res", res)
      })
    })
  }



}

</script>