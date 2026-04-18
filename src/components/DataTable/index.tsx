import { Table, theme } from 'antd';
import type { TableProps } from 'antd';
import { DataTableSkeleton } from './DataTableSkeleton';
import { DataTableEmpty } from './DataTableEmpty';

interface DataTableProps<T> extends Omit<TableProps<T>, 'loading'> {
  loading?: boolean;
  skeletonRows?: number;
  maxHeight?: number;
}

export function DataTable<T extends object>({
  loading,
  skeletonRows = 5,
  maxHeight,
  ...tableProps
}: DataTableProps<T>) {
  const { token } = theme.useToken();

  if (loading) {
    return <DataTableSkeleton rows={skeletonRows} />;
  }

  return (
    <div
      style={{
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadius,
        overflow: 'hidden',
        flex: 1,
      }}
    >
      <Table<T>
        size="middle"
        locale={{ emptyText: <DataTableEmpty /> }}
        scroll={maxHeight ? { y: maxHeight } : undefined}
        {...tableProps}
      />
    </div>
  );
}
