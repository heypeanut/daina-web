import React from 'react';
import { MobileLayout } from '@/components/layout';
import { ClientHomepage } from './components';

const HomePage: React.FC = () => {
  return (
    <MobileLayout>
      <ClientHomepage />
    </MobileLayout>
  );
};

export default HomePage;