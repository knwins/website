import type { ProFormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormDigit
} from '@ant-design/pro-form';
import { useIntl } from '@umijs/max';

import type { FC } from 'react';
import { useRef } from 'react';
import { useRequest } from 'umi';

import type { EnvironmentItem } from '../data';
import styles from '../style.less';
import { getProxyList } from '@/pages/Proxy/service';

export type pageParams = {
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
};

type OperationModelProps = {
  done: boolean;
  visible: boolean;
  current: Partial<EnvironmentItem> | undefined;
  onDone: () => void;
  onSubmit: (values: EnvironmentItem) => void;
};

const OperationModel: FC<OperationModelProps> = (props) => {

  const { done, visible, current, onDone, onSubmit, children } = props;
  // const [environment, setEnvironment] = useState<EnvironmentItem>();
  const formRef = useRef<ProFormInstance>();

  //国际化
  const intl = useIntl();

  //查找所有IP
  const { data: proxyListData } = useRequest(() => {
    return getProxyList({
      current: 1,
    });
  });

  const dataList = proxyListData || [];
  const dataListOptions = [];
  if (dataList) {
    for (let i = 0; i < dataList.length; i += 1) {
      const item = dataList[i];
      if (item) {
        dataListOptions.push({
          label: item.ip,
          value: item.id,
        });
      }
    }
  }

  if (!visible) {
    return null;
  }


  return (
    <ModalForm<EnvironmentItem>
      visible={visible}
      title={intl.formatMessage({
        id: 'pages.new',
      })}
      initialValues={current}
      formRef={formRef}
      className={styles.standardListForm}
      width={640}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done ? { padding: '72px 0' } : {},
      }}
    >

      <ProFormText
        name="name"
        label={intl.formatMessage({
          id: 'pages.environment.name.label',
        })}
        width="md"
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.environment.name.required',
            }),
          },
        ]}
        placeholder={intl.formatMessage({
          id: 'pages.environment.name.placeholder',
        })}
      />


      <ProFormSelect
        name="runsoft"
        width="md"

        label={intl.formatMessage({
          id: 'pages.environment.runsoft.label',
        })}
        options={[
          { label: 'AdsPower', value: 'AdsPower' },
          { label: 'Hubstudio', value: 'Hubstudio' },
        ]}
      />

      <ProFormSelect
        name="proxyId"
        initialValue={current?.proxy?.ip + ''}
        label={intl.formatMessage({
          id: 'pages.environment.proxy.name.label',
        })}
        width="md"
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'pages.environment.proxy.name.required',
            }),
          },
        ]}
        options={dataListOptions}
      />

      <ProFormSelect
        name="status"
        width="md"
        label={intl.formatMessage({
          id: 'pages.environment.status.label',
        })}
        options={[
          {
            label: intl.formatMessage({
              id: 'pages.environment.status.normal',
            }), value: 'Normal'
          },
          {
            label: intl.formatMessage({
              id: 'pages.environment.status.abnormality',
            }), value: 'Abnormality'
          },
        ]}
      />

      <ProFormDigit name="id" hidden />
    </ModalForm>
  );
};

export default OperationModel;
