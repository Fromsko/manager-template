import { Typography } from 'antd';

const { Text, Link } = Typography;

export function AppFooter() {
  return (
    <div style={{ textAlign: 'center', padding: '12px 0' }}>
      <Text type="secondary" style={{ fontSize: 12 }}>
        Gateway Manager © {new Date().getFullYear()} · Powered by{' '}
        <Link href="https://github.com/fromsko" target="_blank" rel="noreferrer">
          fromsko
        </Link>
      </Text>
    </div>
  );
}
