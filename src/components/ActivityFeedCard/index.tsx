import { Card, List, Tag, Typography } from 'antd';

interface ActivityItem {
  title: string;
  time: string;
  tag: string;
  tone: 'default' | 'processing' | 'success' | 'warning' | 'error';
}

interface ActivityFeedCardProps {
  title: string;
  items: ActivityItem[];
}

export function ActivityFeedCard({ title, items }: ActivityFeedCardProps) {
  return (
    <Card title={title} className="dash-card">
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item extra={<Typography.Text type="secondary">{item.time}</Typography.Text>}>
            <List.Item.Meta
              title={
                <>
                  <Tag color={item.tone}>{item.tag}</Tag> {item.title}
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
