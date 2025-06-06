import { useMediaQuery } from '@uidotdev/usehooks';
import React from 'react';
import { useParams } from 'wouter';
import History from './History';
import { TVWidget } from './TVWidget';

const ProductDetail = () => {
  const { productId } = useParams();

  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = isDark ? 'dark' : 'light';

  if (!productId) return <div>productId is missing...</div>;
  const symbol = `COINBASE:${productId.replace('-', '')}`;

  return (
    <div className='h-full grow flex flex-col md:flex-row gap-4 p-4'>
      <div className='flex grow'>
        <TVWidget symbol={symbol} theme={theme} />
      </div>
      <div className='hidden md:block overflow-y-hidden h-full'>
        <History productId={productId} />
      </div>
    </div>
  );
};

export default React.memo(ProductDetail);
