import { Card, Flex, List, Tag, Typography } from 'antd';

interface HealthItem {
  name: string;
  zone: string;
  status: 'healthy' | 'degraded';
  latency: string;
}

interface GatewayHealthCardProps {
  title: string;
  items: HealthItem[];
}

export function GatewayHealthCard({ title, items }: GatewayHealthCardProps) {
  return (
    <Card title={title} className="dash-card">
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item.name} description={item.zone} />
            <Flex vertical align="flex-end" gap={4}>
              <Tag color={item.status === 'healthy' ? 'success' : 'warning'}>
                {item.status === 'healthy' ? '健康' : '关注'}
              </Tag>
              <Typography.Text type="secondary">{item.latency}</Typography.Text>
            </Flex>
          </List.Item>
        )}
      />
    </Card>
  );
}
