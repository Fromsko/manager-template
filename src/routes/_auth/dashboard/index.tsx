import { createFileRoute } from '@tanstack/react-router';
import { Card, Row, Col, Statistic, Typography, List, Tag } from 'antd';
import { motion } from 'motion/react';
import { PageContainer } from '@/components/PageContainer';
import { staggerContainerVariants, staggerItemVariants } from '@/core/motion';
import { Users, Activity, Server, Zap } from '@/core/icons';
import './index.css';

export const Route = createFileRoute('/_auth/dashboard/')({
  component: DashboardPage,
  staticData: { breadcrumb: '仪表盘' },
});

const stats = [
  { title: '活跃用户', value: 1286, icon: Users, color: '#1677ff' },
  { title: '请求总量', value: 52890, icon: Activity, color: '#52c41a' },
  { title: '在线服务', value: 24, icon: Server, color: '#722ed1' },
  { title: '平均响应', value: '42ms', icon: Zap, color: '#fa8c16' },
];

const recentActivities = [
  { title: '用户 admin 登录系统', time: '2 分钟前', tag: '登录', color: 'blue' },
  { title: '新增用户 test@dev.com', time: '15 分钟前', tag: '创建', color: 'green' },
  { title: '更新系统配置', time: '1 小时前', tag: '更新', color: 'orange' },
  { title: '删除过期会话', time: '3 小时前', tag: '清理', color: 'red' },
  { title: '服务器重启完成', time: '6 小时前', tag: '系统', color: 'purple' },
];

function DashboardPage() {
  return (
    <PageContainer title="仪表盘">
      <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
        <Row gutter={[16, 16]}>
          {stats.map((stat) => (
            <Col xs={12} sm={12} md={6} key={stat.title}>
              <motion.div variants={staggerItemVariants}>
                <Card hoverable className="dash-stat-card">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={<stat.icon size={20} color={stat.color} />}
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={16}>
            <motion.div variants={staggerItemVariants}>
              <Card title="最近活动" className="dash-card">
                <List
                  dataSource={recentActivities}
                  renderItem={(item) => (
                    <List.Item extra={<Typography.Text type="secondary">{item.time}</Typography.Text>}>
                      <List.Item.Meta
                        title={
                          <>
                            <Tag color={item.color}>{item.tag}</Tag> {item.title}
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} md={8}>
            <motion.div variants={staggerItemVariants}>
              <Card title="系统信息" className="dash-card">
                <Statistic title="CPU 使用率" value={23.4} suffix="%" />
                <Statistic title="内存使用" value={67.2} suffix="%" style={{ marginTop: 16 }} />
                <Statistic title="磁盘使用" value={45.8} suffix="%" style={{ marginTop: 16 }} />
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </PageContainer>
  );
}
