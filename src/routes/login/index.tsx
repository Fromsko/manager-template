import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { Card, Form, Input, Button, Typography, message, Flex } from 'antd';
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
  const setTokens = useAuthStore((s) => s.setTokens);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginRequest) => {
    try {
      setLoading(true);
      const tokens = await authApi.login(values);
      setTokens(tokens);
      await fetchSessionAndApplyToStore();
      message.success('登录成功');
      navigate({ to: '/dashboard' });
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : '登录失败');
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
          maxWidth: 400,
          padding: '0 16px',
        }}
      >
        <Card
          style={{
            backdropFilter: 'blur(20px)',
            background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {APP_BRAND_NAME}
            </Typography.Title>
            <Button
              type="text"
              icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
              onClick={toggle}
            />
          </Flex>

          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ username: 'admin', password: 'admin' }}
          >
            <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input prefix={<User size={16} />} placeholder="用户名" size="large" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<Lock size={16} />} placeholder="密码" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                登录
              </Button>
            </Form.Item>
          </Form>

          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            默认账号: admin / admin
          </Typography.Text>
        </Card>
      </motion.div>
    </div>
  );
}
