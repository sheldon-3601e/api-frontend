import Footer from '@/components/Footer';
import { userLogin, userRegister } from '@/services/api-backend/userController';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ModalForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { ProFormInstance } from '@ant-design/pro-form/lib';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, Helmet, history, useIntl, useModel } from '@umijs/max';
import { message } from 'antd';
import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/mySettings';
// import './index.scss'

// 定义表单布局的常量 formLayout
const formLayout = {
  // 设置标签布局，分别指定在不同屏幕尺寸下的列数
  labelCol: {
    // 在小屏幕下（xs），标签占据整行的 24 列
    xs: { span: 24 },
    // 在中等屏幕尺寸下（sm），标签占据 8 列
    sm: { span: 8 },
  },
  // 设置表单项内容布局，同样分别指定在不同屏幕尺寸下的列数
  wrapperCol: {
    // 在小屏幕下（xs），表单项内容占据整行的 24 列
    xs: { span: 12 },
    // 在中等屏幕尺寸下（sm），表单项内容占据 16 列
    sm: { span: 10 },
  },
};

const Login: React.FC = () => {
  // const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [registerModalVisit, setRegisterModalVisit] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundColor: 'rgb(243, 243, 243)',
      backgroundSize: '100% 100%',
    };
  });

  const intl = useIntl();

  // 异步函数 fetchUserInfo 用于获取用户信息
  const fetchUserInfo = async () => {
    // 调用 initialState 中的 fetchUserInfo 方法，获取用户信息
    const userInfo = await initialState?.fetchUserInfo?.();

    // 如果成功获取到用户信息
    if (userInfo) {
      // 使用 flushSync 来同步更新状态，确保状态更新发生在浏览器绘制之前
      flushSync(() => {
        // 使用 setInitialState 更新应用程序状态，将 currentUser 设置为新获取的用户信息
        setInitialState((res) => ({
          ...res,
          loginUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.UserLoginRequest) => {
    try {
      // 登录
      const res = await userLogin({
        ...values,
      });

      if (res.data) {
        await fetchUserInfo();
        setTimeout(() => {
          const urlParams = new URL(window.location.href).searchParams;
          // console.log(urlParams.get('redirect') || '/');
          history.push(urlParams.get('redirect') || '/');
        }, 1000);

        return;
      }

      // 如果失败去设置用户错误信息
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
      });
      // console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const handleRegister = async (value: any) => {
    // console.log(value);
    const res = await userRegister({
      ...value,
    });
    // console.log(res)
    if (res.code === 0) {
      message.success('注册成功');
      setRegisterModalVisit(false);
    } else {
      message.error(res.message);
    }
  };

  const [autoCompleteResult] = useState<string[]>([]);
  autoCompleteResult.map((website) => ({
    label: website,
    value: website,
  }));

  const restFormRef = useRef<ProFormInstance>();

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.png" style={{ width: '55px' }} />}
          title="API-Manager"
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            autoLogin: false,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequest);
          }}
        >
          <>
            <ProFormText
              name="userAccount"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '用户名: Admin or user',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="userPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
              })}
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="pages.login.password.required" />,
                },
              ]}
            />
          </>

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
              onClick={() => {
                setRegisterModalVisit(true);
              }}
            >
              <FormattedMessage id="pages.login.userRegister" />
            </a>
          </div>
        </LoginForm>
        <>
          <ModalForm
            title="注冊用戶"
            {...formLayout}
            formRef={restFormRef}
            layout="horizontal"
            submitter={{
              searchConfig: {
                resetText: '重置',
              },
              resetButtonProps: {
                onClick: () => {
                  restFormRef.current?.resetFields();
                },
              },
            }}
            open={registerModalVisit}
            onFinish={async (value) => {
              await handleRegister(value);
              restFormRef.current?.resetFields();
              return true;
            }}
            onOpenChange={setRegisterModalVisit}
          >
            <ProFormText
              name="userAccount"
              label="用户名"
              rules={[
                {
                  pattern: /^[a-zA-Z0-9_-]{4,16}$/,
                  message: '用户名必须是4到16位（字母，数字，下划线，减号）',
                },
                {
                  required: true,
                  message: '请输入你的用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="userPassword"
              label="密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                  message: '密码必须是8位以上，包含字母、数字',
                },
              ]}
              hasFeedback
            />
            <ProFormText.Password
              name="checkPassword"
              label="确认密码"
              dependencies={['userPassword']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: '请确认密码!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('userPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('密码不一致!'));
                  },
                }),
              ]}
            />
            <ProFormCheckbox
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('请您阅读并同意协议!')),
                },
              ]}
            >
              我已 阅读 <a href="">agreement</a>
            </ProFormCheckbox>
          </ModalForm>
        </>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
