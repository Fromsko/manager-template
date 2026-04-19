import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { Card, Form, Input, Button, Typography, message, Flex, theme } from 'antd';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/api/auth';
import { fetchSessionAndApplyToStore } from '@/core/auth/session';
import { Aurora } from '@/components/Aurora';
import { useTheme } from '@/core/theme';
import { Sun, Moon, Lock, User } from '@/core/icons';
import { scaleVariants } from '@/core/motion';
import { APP_BRAND_NAME } from '@/utils/constants';
import type { LoginRequest } from '@/api/schemas';

export const Route = createFileRoute('/login/')({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();
  const { token } = theme.useToken();
  const setTokens = useAuthStore((s) => s.setTokens);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginRequest) => {
    try {
      setLoading(true);
      const tokens = await authApi.login(values);
      setTokens(tokens);
      await fetchSessionAndApplyToStore();
      message.success('已登录控制台');
      navigate({ to: '/dashboard' });
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : '登录未成功，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: token.colorBgLayout,
      }}
    >
      <Aurora />
      <motion.div
        variants={scaleVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 440,
          padding: '0 20px',
        }}
      >
        <Card
          style={{
            boxShadow: isDark
              ? '0 18px 48px rgba(2, 6, 23, 0.45)'
              : '0 18px 48px rgba(15, 23, 42, 0.08)',
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
          }}
        >
          <Flex justify="space-between" align="flex-start" style={{ marginBottom: 24 }}>
            <div>
              <Typography.Text type="secondary">Gateway Control Plane</Typography.Text>
              <Typography.Title level={3} style={{ margin: '8px 0 4px' }}>
                {APP_BRAND_NAME}
              </Typography.Title>
              <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                统一登录网关控制台，查看运行状态、策略变更与访问治理能力。
              </Typography.Paragraph>
            </div>
            <Button
              type="text"
              icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
              onClick={toggle}
              aria-label="切换主题"
            />
          </Flex>

          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ username: 'admin', password: 'admin' }}
          >
            <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input prefix={<User size={16} />} placeholder="用户名" size="large" />
            </Form.Item>
            <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<Lock size={16} />} placeholder="密码" size="large" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 12 }}>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                登录控制台
              </Button>
            </Form.Item>
          </Form>

          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            默认账号：admin / admin
          </Typography.Text>
        </Card>
      </motion.div>
    </div>
  );
}
