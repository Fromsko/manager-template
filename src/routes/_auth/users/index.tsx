import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { Button, Form, Input, Select, Space, Tag, message, Popconfirm } from 'antd';
import { useMemo, useState } from 'react';
import { PageContainer } from '@/components/PageContainer';
import { DataTable } from '@/components/DataTable';
import { FilterToolbar } from '@/components/FilterToolbar';
import { FormModal } from '@/components/FormModal';
import { Auth } from '@/components/Auth';
import { useResourceCrud } from '@/hooks/use-resource-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { userApi } from '@/api/user';
import { Plus, Pencil, Trash2, Search } from '@/core/icons';
import type { User, CreateUserRequest, UpdateUserRequest } from '@/api/schemas';
import type { ColumnsType } from 'antd/es/table';

const UserSearchSchema = z.object({
  limit: z.coerce.number().int().positive().catch(10),
  offset: z.coerce.number().int().nonnegative().catch(0),
  sortField: z.string().nullable().catch(null),
  sortOrder: z.enum(['ascend', 'descend']).nullable().catch(null),
  keyword: z.string().catch(''),
  role: z.string().catch(''),
});

export const Route = createFileRoute('/_auth/users/')({
  validateSearch: (search) => UserSearchSchema.parse(search),
  component: UsersPage,
  staticData: { breadcrumb: '用户管理' },
});

function UsersPage() {
  const navigate = useNavigate({ from: Route.fullPath });
  const search = Route.useSearch();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const debouncedKeyword = useDebounce(search.keyword, 300);

  const listParams = useMemo(
    () => ({ ...search, keyword: debouncedKeyword }),
    [search, debouncedKeyword],
  );

  const { listQuery, createMutation, updateMutation, deleteMutation } = useResourceCrud<
    User,
    CreateUserRequest,
    UpdateUserRequest
  >({
    resourceKey: 'users',
    api: userApi,
    listParams: listParams as Record<string, unknown>,
  });

  const columns: ColumnsType<User> = [
    { title: '名称', dataIndex: 'name', sorter: true },
    { title: '邮箱', dataIndex: 'email', sorter: true },
    {
      title: '角色',
      dataIndex: 'role',
      render: (role: string) => {
        const colorMap: Record<string, string> = { admin: 'red', editor: 'blue', viewer: 'green' };
        return <Tag color={colorMap[role] ?? 'default'}>{role}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space>
          <Auth permission="user:update">
            <Button
              type="link"
              size="small"
              icon={<Pencil size={14} />}
              onClick={() => {
                setEditingUser(record);
                setModalOpen(true);
              }}
            >
              编辑
            </Button>
          </Auth>
          <Auth permission="user:delete">
            <Popconfirm title="确定删除？" onConfirm={() => void handleDelete(record.id)}>
              <Button type="link" size="small" danger icon={<Trash2 size={14} />}>
                删除
              </Button>
            </Popconfirm>
          </Auth>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    message.success('删除成功');
  };

  const handleSubmit = async (values: CreateUserRequest) => {
    if (editingUser) {
      const data: UpdateUserRequest = {
        name: values.name,
        email: values.email,
        role: values.role,
      };
      await updateMutation.mutateAsync({ id: editingUser.id, data });
      message.success('更新成功');
    } else {
      await createMutation.mutateAsync(values);
      message.success('创建成功');
    }
    setModalOpen(false);
    setEditingUser(null);
  };

  const updateSearch = (updates: Partial<typeof search>) => {
    navigate({ search: (prev) => ({ ...prev, ...updates }) });
  };

  const modalInitial =
    editingUser === null
      ? undefined
      : { name: editingUser.name, email: editingUser.email, role: editingUser.role };

  return (
    <PageContainer
      title="用户管理"
      extra={
        <Auth permission="user:create">
          <Button
            type="primary"
            icon={<Plus size={14} />}
            onClick={() => {
              setEditingUser(null);
              setModalOpen(true);
            }}
          >
            新建用户
          </Button>
        </Auth>
      }
    >
      <FilterToolbar
        filters={[
          {
            key: 'keyword',
            element: (
              <Input
                placeholder="搜索用户名/邮箱"
                prefix={<Search size={14} />}
                value={search.keyword}
                onChange={(e) => updateSearch({ keyword: e.target.value, offset: 0 })}
                allowClear
              />
            ),
          },
          {
            key: 'role',
            element: (
              <Select
                placeholder="角色筛选"
                value={search.role || undefined}
                onChange={(val) => updateSearch({ role: val ?? '', offset: 0 })}
                allowClear
                style={{ width: '100%' }}
                options={[
                  { label: '管理员', value: 'admin' },
                  { label: '编辑', value: 'editor' },
                  { label: '观察者', value: 'viewer' },
                ]}
              />
            ),
          },
        ]}
      />

      <DataTable<User>
        loading={listQuery.isLoading}
        dataSource={listQuery.data?.items}
        columns={columns}
        rowKey="id"
        pagination={{
          current: Math.floor(search.offset / search.limit) + 1,
          pageSize: search.limit,
          total: listQuery.data?.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) =>
            updateSearch({ offset: (page - 1) * pageSize, limit: pageSize }),
        }}
        onChange={(_pagination, _filters, sorter) => {
          if (!Array.isArray(sorter)) {
            updateSearch({
              sortField: (sorter.field as string) ?? null,
              sortOrder: sorter.order ?? null,
            });
          }
        }}
        style={{ marginTop: 16 }}
      />

      <FormModal<CreateUserRequest>
        open={modalOpen}
        title={editingUser ? '编辑用户' : '新建用户'}
        onCancel={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
        initialValues={modalInitial}
      >
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="role" label="角色" rules={[{ required: true }]}>
          <Select
            options={[
              { label: '管理员', value: 'admin' },
              { label: '编辑', value: 'editor' },
              { label: '观察者', value: 'viewer' },
            ]}
          />
        </Form.Item>
        {!editingUser && (
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
        )}
      </FormModal>
    </PageContainer>
  );
}
