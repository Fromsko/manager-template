import { createFileRoute } from '@tanstack/react-router';
import { Card, Row, Col, Typography, theme } from 'antd';
import { motion } from 'motion/react';
import { ActivityFeedCard } from '@/components/ActivityFeedCard';
import { AlertListCard } from '@/components/AlertListCard';
import { GatewayHealthCard } from '@/components/GatewayHealthCard';
import { MetricCard } from '@/components/MetricCard';
import { PageContainer } from '@/components/PageContainer';
import { SimpleLineChart } from '@/components/SimpleLineChart';
import { SystemOverviewCard } from '@/components/SystemOverviewCard';
import { staggerContainerVariants, staggerItemVariants } from '@/core/motion';
import { useConsoleStore } from '@/stores/console';
import { Activity, Server, Zap, Shield } from '@/core/icons';
import './index.css';

export const Route = createFileRoute('/_auth/dashboard/')({
  component: DashboardPage,
  staticData: { breadcrumb: '仪表盘' },
});

const trafficTrend = [
  { label: '00:00', value: 31 },
  { label: '04:00', value: 42 },
  { label: '08:00', value: 64 },
  { label: '12:00', value: 73 },
  { label: '16:00', value: 69 },
  { label: '20:00', value: 58 },
];

const recentActivities = [
  { title: '网关集群 north-gw 完成滚动发布', time: '2 分钟前', tag: '发布', tone: 'processing' as const },
  { title: 'WAF 规则集已同步到生产环境', time: '18 分钟前', tag: '安全', tone: 'success' as const },
  { title: '新增路由 /billing/v2 指向 billing-service', time: '35 分钟前', tag: '路由', tone: 'warning' as const },
  { title: '清理过期限流策略快照', time: '1 小时前', tag: '维护', tone: 'default' as const },
  { title: '检测到异常流量峰值并触发告警', time: '3 小时前', tag: '告警', tone: 'error' as const },
];

const criticalAlerts = [
  {
    title: 'south-gw 响应延迟升高',
    description: '最近 5 分钟 P95 延迟超过 80ms，建议优先检查上游服务健康度。',
    type: 'warning' as const,
  },
  {
    title: 'billing-service 出现异常流量峰值',
    description: '已自动命中限流策略，当前请求速率仍处在高位。',
    type: 'error' as const,
  },
];

function DashboardPage() {
  const { token } = theme.useToken();
  const gateways = useConsoleStore((s) => s.gateways);
  const alerts = useConsoleStore((s) => s.alerts);

  const healthyGateways = gateways.filter((item) => item.status === 'healthy').length;
  const criticalAlertCount = alerts.filter((item) => item.type === 'error').length;
  const gatewayHealth = gateways.map((item) => ({
    name: item.name,
    zone: item.region,
    status: item.status,
    latency: item.status === 'healthy' ? '38ms' : '86ms',
  }));

  const stats = [
    {
      title: '在线网关',
      value: `${healthyGateways} / ${gateways.length}`,
      icon: Server,
      tone: 'success' as const,
      detail: healthyGateways === gateways.length ? '全部实例健康，当前无离线节点' : '部分实例需要重点关注',
    },
    {
      title: '每分钟请求量',
      value: '52.9k',
      icon: Activity,
      tone: 'primary' as const,
      detail: '较上一时段 +8.4%，流量稳定增长',
    },
    {
      title: '平均响应延迟',
      value: '42ms',
      icon: Zap,
      tone: 'warning' as const,
      detail: '低于 80ms 预警阈值',
    },
    {
      title: '重点告警',
      value: criticalAlertCount,
      icon: Shield,
      tone: 'info' as const,
      detail: '共享告警状态已与控制台其他页面同步',
    },
  ];

  return (
    <PageContainer
      title="仪表盘"
      subtitle="集中查看网关健康状态、流量波动与最近策略变更。"
      extra={<Typography.Text type="secondary">最后同步：刚刚</Typography.Text>}
    >
      <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
        <Row gutter={[16, 16]}>
          {stats.map((stat) => (
            <Col xs={24} sm={12} md={6} key={stat.title}>
              <motion.div variants={staggerItemVariants}>
                <MetricCard
                  title={stat.title}
                  value={stat.value}
                  icon={<stat.icon size={20} />}
                  tone={stat.tone}
                  detail={stat.detail}
                />
              </motion.div>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={16}>
            <motion.div variants={staggerItemVariants}>
              <Card className="dash-card">
                <SimpleLineChart
                  title="24 小时流量趋势"
                  subtitle="按每 4 小时聚合请求量，便于观察高峰区间与异常波动。"
                  data={trafficTrend}
                  color={token.colorPrimary}
                  suffix="k"
                />
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} lg={8}>
            <motion.div variants={staggerItemVariants}>
              <SystemOverviewCard
                title="运行概况"
                items={[
                  { label: '成功率', percent: 99.92, color: token.colorSuccess },
                  { label: '限流容量', percent: 61, color: token.colorWarning },
                  { label: '证书有效期健康度', percent: 88, color: token.colorPrimary },
                ]}
              />
            </motion.div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={10}>
            <motion.div variants={staggerItemVariants}>
              <GatewayHealthCard title="网关实例状态" items={gatewayHealth} />
            </motion.div>
          </Col>
          <Col xs={24} lg={14}>
            <motion.div variants={staggerItemVariants}>
              <ActivityFeedCard title="最近变更与事件" items={recentActivities} />
            </motion.div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <motion.div variants={staggerItemVariants}>
              <AlertListCard title="重点告警" items={criticalAlertCount > 0 ? criticalAlerts : []} />
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </PageContainer>
  );
}
