
import { AccountTypeItem } from '@/pages/AccountType/data';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  EditableProTable,
  ModalForm,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Form, Space } from 'antd';
import type { FC } from 'react';

import React, { useRef, useState } from 'react';
import type { EnvironmentItem, AccountsItem, AccountsParams } from '../data';
import { getAccountsList, removeAccounts, updateAccounts } from '../service';
import styles from '../style.less';



type AccountModalProps = {
  done: boolean;
  visible: boolean;
  accountTypes: Partial<AccountTypeItem[]> | undefined;
  current: Partial<EnvironmentItem> | undefined;
  onDone: () => void;
};

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};



const AccountsModal: FC<AccountModalProps> = (props) => {
  // export default () => {
  //接收到数据
  const { done, visible, current, accountTypes, onDone, children } = props;

  const formRef = useRef<ProFormInstance>();
  //国际化
  const intl = useIntl();
  const dataListOptions = {};
  const listData = accountTypes || [];
  if (listData) {
    listData.map((item) => {
      if (item) {
        dataListOptions[item?.id] = {
          text: item?.name,
        };
      }

    });
  }


  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<AccountsItem[]>([]);
  const [form] = Form.useForm();
  if (!visible) {
    return null;
  }
  const params: AccountsParams = {
    environmentId: current?.id,
  };

  const columns: ProColumns<AccountsItem>[] = [
    {
      title: <FormattedMessage id="pages.accounts.typeName" />,
      dataIndex: "accountTypeId",
      valueType: 'select',
      valueEnum: dataListOptions,
      render: (_, row) => row?.accountType?.name
    },
    {
      title: <FormattedMessage id="pages.accounts.username" />,
      dataIndex: 'username',

    },

    {
      title: <FormattedMessage id="pages.accounts.password" />,
      dataIndex: 'password',
    },

    {
      title: <FormattedMessage id="pages.accounts.telephone" />,
      dataIndex: 'telephone',
    },

    {
      title: <FormattedMessage id="pages.accounts.email" />,
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.accounts.status" />,
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        Normal: {
          text: <FormattedMessage id="pages.accounts.status.normal" />,
        },
        Abnormality: {
          text: <FormattedMessage id="pages.accounts.status.abnormality" />,
        },
      },
    },

    {
      title: <FormattedMessage id="pages.option" />,
      valueType: 'option',
      width: '160px',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          <FormattedMessage id="pages.edit" />
        </a>,
        <EditableProTable.RecordCreator
          key="copy"
          record={{
            ...record,
            id: (Math.random() * 1000000).toFixed(0),
          }}
        >
          <a>
            <FormattedMessage id="pages.copy" />
          </a>
        </EditableProTable.RecordCreator>,

        <a
          key="delete"
          onClick={async () => {
            record.accountType=undefined;
            await removeAccounts(record);
            
            actionRef.current?.reloadAndRest?.();
          }}
        >
          <FormattedMessage id="pages.delete" />
        </a>,
      ],
    },
  ];

  return (
    <ModalForm<EnvironmentItem>
      visible={visible}
      title={intl.formatMessage({
        id: 'pages.environment.accounts.title',
      })}
      formRef={formRef}
      className={styles.standardListForm}
      width="70%"
      submitter={false}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
    >
      <EditableProTable<AccountsItem, AccountsParams>
        rowKey="id"
        actionRef={actionRef}
        maxLength={5}
        // 关闭默认的新建按钮
        recordCreatorProps={false}
        columns={columns}
        params={params}
        request={getAccountsList}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          form,
          editableKeys,
          onSave: async (rowKey, data) => {
            data.environmentId = current?.id;
            await updateAccounts(data);
            await waitTime(2000);
          },

          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => {
            actionRef.current?.addEditRecord?.({
              id: (Math.random() * 1000000).toFixed(0),
              title: <FormattedMessage id="pages.new" />,
            });
          }}
          icon={<PlusOutlined />}
        >
          <FormattedMessage id="pages.new" />
        </Button>
      </Space>
    </ModalForm>
  );
};

export default AccountsModal;
