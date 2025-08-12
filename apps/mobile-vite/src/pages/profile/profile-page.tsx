import { MobileLayout } from '@/components/layout';
import {
  ProfileHeader,
  QuickActions,
  ServiceSection,
} from './components';

const ProfilePage: React.FC = () => {
  return (
    <MobileLayout>
      <div className="min-h-full bg-gray-50">
        {/* 用户头部信息 */}
        <ProfileHeader />

        {/* 快捷功能区域 */}
        <QuickActions />

        {/* 我的服务 */}
        <ServiceSection />
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
