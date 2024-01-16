import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name layout 配置
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#f7cac9',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  siderMenuType: 'sub',
  title: 'API-Management',
  pwa: true,
  logo: '/logo.png',
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    bgLayout: 'rgb(255, 255, 244)',
    sider: {
      colorMenuBackground: '#f5f5e9',
      colorBgMenuItemSelected: '#ccccc0',
    },
    header: {
      colorBgHeader: 'rgb(243, 243, 243)',
    },
  },
};

export default Settings;
