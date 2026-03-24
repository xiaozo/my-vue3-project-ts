

import { ref, watch, computed, onMounted, onUnmounted, nextTick, toRef, toRaw, type Ref } from 'vue';

import Eventbus from '@/utils/eventbus';


///PageHookConfig
export interface ComponentHookConfig {

	onComponentPageShow?: () => void,   ///页面显示
	onComponentPageHide?: () => void,   ///页面隐藏
	pageLoad?: (options: any) => void,   ///页面加载完成

}

/**
 * BaseComponentPageProps 接口
 * 基础页面组件的属性定义
 */
export interface BaseComponentPageProps {
  /**
   * 页面属性对象
   * @default { options: {}, isShow: false }
   */
  pagePro?: {
    /**
     * 页面选项
     */
    options?: Record<string, any>;
    /**
     * 是否显示
     */
    isShow?: boolean;
  };

  /**
   * 选项参数
   * @default {}
   */
  options?: Record<string, any>;

  /**
   * 当前组件的索引（在 swiper 中的位置）
   * @default 0
   */
  tabIndex?: number;

  /**
   * 当前 swiper 切换到第几个索引
   * @default 0
   */
  currentIndex?: number;

  /**
   * 当前组件的模式
   * - 'tabs': 适用于 MyTabsSwiper 组件内
   * - 'common': 普通模式
   * @default 'tabs'
   */
  model?: 'tabs' | 'common';
}

export const baseComponentPageProps = {
	pagePro: {
		type: Object,
		default: function () {
			return {
				options: {},
				isShow: false
			}
		},
	},
	///options 参数
	options: {
		type: Object,
		default: function () {
			return {

			}
		},
	},
	//当前组件的index，也就是当前组件是swiper中的第几个
	tabIndex: {
		type: Number,
		default: function () {
			return 0;
		},
	},
	//当前swiper切换到第几个index
	currentIndex: {
		type: Number,
		default: function () {
			return 0;
		},
	},
	////当前组件的模式，tabs：适用于MyTabsSwiper组件内  common:普通模式
	model: {
		type: String,
		default: 'tabs'
	}
};

export function componentPageHook(props: BaseComponentPageProps, paging: Ref<MyPagingRef | undefined>, userConfig = {

}) {

	// 合并配置
	const config:ComponentHookConfig = {
		...userConfig      // 用户传入的配置
	};

	const Tag = ref(null)

	const cPaging:any = !!paging ? paging.value || paging : null;

	const _options = ref(props?.options || {})

	const _mainPageOptions = computed(() => props.pagePro?.options || {});

	const isShow = computed(() => props.pagePro?.isShow || false);

	const _mainPageIsShow = toRef(isShow)

	const _componentPro = {
		firstLoadedData: false,
		isShowRefresh: false,
		isLoad: false,

	}

	// 监听 isShow
	watch(isShow, (newValue, oldValue) => {
		__pageStatusHandle()
	});

	///onMounted
	onMounted(() => {

		Eventbus.sub('loginSuccess', Tag, () => {
			refresh()
		})

		Eventbus.sub('GlobalRefresh', Tag, () => {
			refresh()
		})

		nextTick(() => {
			///如果IsLoad没有加载过，就加载一个__pageStatusHandle
			if (!_componentPro.isLoad) {
				__pageStatusHandle()
			}
		});

	});

	onUnmounted(() => {
		Eventbus.cancel('loginSuccess', Tag)
		Eventbus.cancel('GlobalRefresh', Tag)

	});


	///刷新页面
	const refresh = (firstLoad = false) => {
		if (_componentPro.isShowRefresh) return
		if (props.model != 'tabs') {
			_componentPro.firstLoadedData = true
		}

		if (!firstLoad && !_componentPro.firstLoadedData && !_componentPro.isLoad) {
			return
		}

		if (!!cPaging?.value) {
			cPaging.value._options = toRaw(_options.value)
			cPaging.value?.reload()
		} else {
			config.pageLoad?.(toRaw(_options.value))
		}
	}

	const __pageStatusHandle = () => {

		if (!!isShow.value) {
			///显示页面
			if (!!_componentPro.isShowRefresh) {
				_componentPro.isShowRefresh = false
				refresh()
			}

			config.onComponentPageShow?.()

			!_componentPro.isLoad && nextTick(() => _componentPro.isLoad = true)
		} else {
			///隐藏页面
			config.onComponentPageHide?.()
		}
	}

	return {
		_options, ///当前的_options
		_mainPageOptions, ///主页的options
		_componentPro,	///组件的状态对象
		_mainPageIsShow, ////主页面是否显示
		refresh		///刷新方法
	};
}

