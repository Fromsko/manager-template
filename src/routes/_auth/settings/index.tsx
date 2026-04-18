import { createFileRoute } from '@tanstack/react-router';
import { Card, Form, Switch, Select, Divider, Typography, Flex } from 'antd';
import { PageContainer } from '@/components/PageContainer';
import { useSettingsStore } from '@/stores/settings';
import { useTheme } from '@/core/theme';
import { getAllPresets } from '@/core/theme/presets';
import { Sun, Moon, Globe } from '@/core/icons';

export const Route = createFileRoute('/_auth/settings/')({
  component: SettingsPage,
  staticData: { breadcrumb: '系统设置' },
});

function SettingsPage() {
  const { isDark, toggle } = useTheme();
  const settings = useSettingsStore();
  const presets = getAllPresets();

  return (
    <PageContainer title="系统设置">
      <Card>
        <Typography.Title level={5}>外观</Typography.Title>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="深色模式">
            <Switch
              checked={isDark}
              onChange={toggle}
              checkedChildren={<Moon size={12} />}
              unCheckedChildren={<Sun size={12} />}
            />
          </Form.Item>
          <Form.Item label="主题预设">
            <Select
              value={settings.themePreset}
              onChange={settings.setThemePreset}
              options={presets.map((p) => ({ label: p.label, value: p.name }))}
              style={{ width: 200 }}
            />
          </Form.Item>
        </Form>

        <Divider />

        <Typography.Title level={5}>语言</Typography.Title>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="界面语言">
            <Flex align="center" gap={8}>
              <Globe size={14} />
              <Select
                value={settings.locale}
                onChange={settings.setLocale}
                options={[
                  { label: '简体中文', value: 'zh-CN' },
                  { label: 'English', value: 'en-US' },
                ]}
                style={{ width: 200 }}
              />
            </Flex>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
}
