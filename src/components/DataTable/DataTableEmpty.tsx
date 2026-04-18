import { Typography } from 'antd';
import { Database } from '@/core/icons';

export function DataTableEmpty() {
  return (
    <div style={{ padding: '32px 0', textAlign: 'center' }}>
      <Database size={40} style={{ opacity: 0.3, marginBottom: 8 }} />
      <Typography.Text type="secondary">暂无数据</Typography.Text>
    </div>
  );
}
