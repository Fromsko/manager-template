import { Typography } from 'antd';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { fadeVariants } from '@/core/motion';

const { Title } = Typography;

interface PageContainerProps {
  title?: string;
  extra?: ReactNode;
  children: ReactNode;
}

export function PageContainer({ title, extra, children }: PageContainerProps) {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}
    >
      {(title || extra) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title ? <Title level={4} style={{ margin: 0 }}>{title}</Title> : null}
          {extra ? <div>{extra}</div> : null}
        </div>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>
    </motion.div>
  );
}
