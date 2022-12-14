import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage } from '@umijs/max';
import React, { useRef, useState } from 'react';
import type { TSTaskItem, TSTaskParams } from './data';
import { getTSTaskMyList } from './service';

const TSTask: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [params, setParams] = useState<Partial<TSTaskParams> | undefined>(undefined);

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
  };

  const columns: ProColumns<TSTaskItem>[] = [
    {
      title: <FormattedMessage id="pages.tstask.createTime" />,
      dataIndex: 'time',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
      width: 'md',
      align: 'center',
    },
    {
      title: <FormattedMessage id="pages.tstask.link" />,
      dataIndex: ['orders', 'link'],
      hideInSearch: true,
      valueType: 'text',
      width: 'lg',
    },

    {
      title: <FormattedMessage id="pages.tstask.username" />,
      dataIndex: ['bind', 'username'],
      hideInSearch: true,
      valueType: 'text',
      width: 'xs',
    },
    {
      title: 'UUID',
      dataIndex: 'uuid',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,
      width: 'xs',
    },

    {
      title: <FormattedMessage id="pages.tstask.info" />,
      dataIndex: 'info',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,
      width: '200px',
    },
    {
      title: <FormattedMessage id="pages.tstask.status" />,
      dataIndex: 'status',
      valueType: 'text',
      hideInSearch: true,
      hideInForm: true,

      width: 'xs',
    },
  ];

  return (
    <div>
      <PageContainer>
        <ProTable<TSTaskItem, TSTaskParams>
          headerTitle=""
          actionRef={actionRef}
          rowKey={(record) => record.id}
          search={false}
          params={params}
          pagination={paginationProps}
          onChange={(pagination, filters: any, sorter: any) => {
            console.log(pagination);
            if (sorter) {
              sorter.order = sorter.order === 'descend' ? 'DESC' : 'ASC';
              const goodsTypeParams: TSTaskParams = {
                sorter: sorter.order,
                filter: sorter.field,
              };
              setParams(goodsTypeParams);
            }
          }}
          request={getTSTaskMyList}
          columns={columns}
        />
      </PageContainer>
    </div>
  );
};
export default TSTask;
