import { ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { ProFormInstance } from '@ant-design/pro-form/lib';

export type props = {
  values: API.InterfaceInfo;
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<void>;
  visible: boolean;
};

const CreateModel: React.FC<props> = (props) => {
  const { values, visible, columns, onCancel, onSubmit } = props;

  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    if (formRef) {
      formRef.current?.setFieldsValue(values);
    }
  }, [values]);

  console.log('received: ', values);

  return (
    <Modal visible={visible} footer={null} onCancel={onCancel}>
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (value) => onSubmit?.(value)}
        formRef={formRef}
      />
    </Modal>
  );
};

export default CreateModel;
