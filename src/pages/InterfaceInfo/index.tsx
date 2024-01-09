import {
  getInterfaceInfoVoById,
  invokeInterfaceInfo,
} from '@/services/api-backend/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import {Button, Card, Descriptions, Divider, Form, message} from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import TextArea from 'antd/es/input/TextArea';

const Index: React.FC = () => {
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>({});
  const params = useParams();
  const [invokeRes, setInvokeRes] = useState<any>()

  const loadData = async () => {
    // const id = params.id
    // console.log(typeof id)
    console.log('loadData: ', params);
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await getInterfaceInfoVoById({
        id: params.id,
      });
      // console.log(res)
      setData(res?.data ?? {});
    } catch (error: any) {
      message.error('init failed, ' + error.message);
    }
    setInvokeLoading(false);
  };

  const onFinish = async (values: any) => {

    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfo({
        id: params.id,
        ...values,
      });
      // console.log(res)
      setInvokeRes(res?.data ?? {});
    } catch (error: any) {
      message.error('init failed, ' + error.message);
    }
    setInvokeLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer title={'查看接口文档'}>
      <Card>
        <Descriptions title={data.name} column={1}>
          <Descriptions.Item label="statue">
            {data.statue === 1 ? '正常' : '关闭'}
          </Descriptions.Item>
          <Descriptions.Item label="description">{data.description}</Descriptions.Item>
          <Descriptions.Item label="url">{data.url}</Descriptions.Item>
          <Descriptions.Item label="method">{data.method}</Descriptions.Item>
          <Descriptions.Item label="requestParams">{data.requestParams}</Descriptions.Item>
          <Descriptions.Item label="requestHeader">{data.requestHeader}</Descriptions.Item>
          <Descriptions.Item label="responseHeader">{data.responseHeader}</Descriptions.Item>
          <Descriptions.Item label="createTime">{data.createTime}</Descriptions.Item>
          <Descriptions.Item label="updateTime">{data.updateTime}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Divider />
      <Card>
        <Form
          name="basic"
          labelCol={{ span: 30 }}
          wrapperCol={{ span: 20 }}
          style={{ maxWidth: 1000 }}
          onFinish={onFinish}
        >
          <Form.Item label="请求参数" name="requestParams">
            <TextArea />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title={'测试结果'} loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
