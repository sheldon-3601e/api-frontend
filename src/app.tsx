import Footer from '@/components/Footer';
import { Question } from '@/components/RightContent';
import { getLoginUser } from '@/services/api-backend/userController';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import mySettings from '../config/mySettings';
import { AvatarDropdown, AvatarName } from './components/RightContent/AvatarDropdown';
import { requestConfig } from './requestConfig';

// 判断是否为开发环境
const isDev = process.env.NODE_ENV === 'development';

// 登录页面路径
const loginPath = '/user/login';

/**
 * 获取页面初始状态的函数
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  loginUser?: API.UserVO;
  fetchUserInfo?: () => Promise<API.UserVO | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await getLoginUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const loginUser = await fetchUserInfo();
    // console.log('Initial settings:', settings); // Log the initial settings
    console.log('Fetched loginUser:', loginUser); // Log the fetched loginUser

    return {
      fetchUserInfo,
      loginUser,
      settings: mySettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: mySettings as Partial<LayoutSettings>,
  };
}

// 页面布局配置
// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  // 直接使用 mySettings 作为默认值
  const settings = mySettings as Partial<LayoutSettings>;

  return {
    // 页面顶部右侧的操作按钮
    actionsRender: () => [<Question key="doc" />],

    // 用户头像配置
    avatarProps: {
      src: initialState?.loginUser?.userAvatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },

    // 水印配置
    waterMarkProps: {
      content: initialState?.loginUser?.userName,
    },

    // 底部页脚配置
    footerRender: () => <Footer />,

    // 页面切换时的处理逻辑
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到登录页面
      if (!initialState?.loginUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },

    // // 背景图片配置
    // layoutBgImgList: [
    //   {
    //     src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
    //     left: 85,
    //     bottom: 100,
    //     height: '303px',
    //   },
    //   {
    //     src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
    //     bottom: -68,
    //     right: -45,
    //     height: '303px',
    //   },
    //   {
    //     src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
    //     bottom: 0,
    //     left: 0,
    //     width: '331px',
    //   },
    // ],

    // 根据开发环境配置的链接
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,

    // 子元素的渲染方式，添加设置抽屉组件
    childrenRender: (children) => {
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },

    // 初始状态中的设置
    ...settings,
  };
};

/**
 * @params request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = requestConfig;
