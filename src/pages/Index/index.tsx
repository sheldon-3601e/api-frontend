import { listInterfaceInfoByPage } from '@/services/api-backend/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import { List, message } from 'antd';
import React, { useEffect, useState } from 'react';

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [params, setParams] = useState({
    current: 1,
    pageSize: 5,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoByPage(params);
      // console.log(res)
      setList(res?.data?.records ?? []);
      setTotal((res?.data?.total ?? 0) as number);
    } catch (error: any) {
      message.error('init failed, ' + error.message);
    }
    setLoading(false);
  };

  const pageChange = (page: any) => {
    setParams({
      ...params,
      current: page,
    });
  };

  useEffect(() => {
    loadData();
  }, [params]);

  return (
    <PageContainer title={'在线接口平台'}>
      <List
        className="interface-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`;
          return (
            <List.Item actions={[<a key={item.id} href={apiLink}>more</a>]}>
              <List.Item.Meta
                title={<a href={apiLink}>{item.name}</a>}
                description={item.description}
              />
            </List.Item>
          );
        }}
        pagination={{
          current: params.current,
          pageSize: params.pageSize,
          onChange: pageChange,
          total,
        }}
      />
    </PageContainer>
  );
};
export default Index;
