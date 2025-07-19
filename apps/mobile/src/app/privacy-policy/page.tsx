'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">隐私政策</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 隐私政策内容 */}
      <div className="p-6">
        <div className="bg-white rounded-lg p-6 space-y-6">
          {/* 政策标题 */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">代拿网隐私政策</h2>
            <p className="text-sm text-gray-600">最后更新时间：2024年12月</p>
          </div>

          {/* 政策条款 */}
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第一条 隐私政策的适用范围</h3>
              <p className="mb-2">
                1.1 本隐私政策适用于代拿网（以下简称"我们"或"本平台"）提供的所有服务。
              </p>
              <p className="mb-2">
                1.2 本政策描述了我们如何收集、使用、储存和分享您的个人信息。
              </p>
              <p>
                1.3 我们建议您仔细阅读本政策，了解我们处理您个人信息的详细情况。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第二条 我们收集的信息</h3>
              <p className="mb-3 font-medium">2.1 您主动提供的信息：</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>注册信息：手机号码、密码、昵称等</li>
                <li>个人资料：头像、个人简介、联系方式等</li>
                <li>交易信息：订单详情、支付信息、收货地址等</li>
                <li>反馈信息：客服咨询、意见反馈、评价内容等</li>
              </ul>
              
              <p className="mb-3 font-medium">2.2 自动收集的信息：</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>设备信息：设备型号、操作系统、唯一设备标识等</li>
                <li>日志信息：IP地址、访问时间、页面路径等</li>
                <li>位置信息：基于您的授权获取的位置数据</li>
                <li>使用数据：浏览记录、搜索记录、点击行为等</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第三条 信息使用目的</h3>
              <p className="mb-3">我们收集和使用您的个人信息用于以下目的：</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>提供和维护我们的服务</li>
                <li>处理交易和订单</li>
                <li>进行身份验证和账户安全</li>
                <li>改善用户体验和服务质量</li>
                <li>发送重要通知和服务更新</li>
                <li>提供客户支持</li>
                <li>进行数据分析和业务优化</li>
                <li>遵守法律法规要求</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第四条 信息共享和披露</h3>
              <p className="mb-3">在以下情况下，我们可能会共享您的个人信息：</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>获得您的明确同意</li>
                <li>与合作伙伴共享必要信息以提供服务</li>
                <li>遵守法律法规或政府要求</li>
                <li>保护我们或他人的权利、财产或安全</li>
                <li>业务转让时的信息转移</li>
              </ul>
              <p>
                我们不会出售、出租或以其他方式向第三方披露您的个人信息，除非获得您的明确同意。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第五条 信息存储和安全</h3>
              <p className="mb-2">
                5.1 我们采用行业标准的安全措施保护您的个人信息，包括数据加密、访问控制、安全审计等。
              </p>
              <p className="mb-2">
                5.2 您的个人信息将存储在中国境内的安全服务器上。
              </p>
              <p className="mb-2">
                5.3 我们会根据法律要求和业务需要确定信息保存期限，超期后会安全删除。
              </p>
              <p>
                5.4 尽管我们采取了安全措施，但互联网传输无法保证绝对安全，请您妥善保管账户信息。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第六条 您的权利</h3>
              <p className="mb-3">根据相关法律法规，您享有以下权利：</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>知情权：了解我们处理您个人信息的情况</li>
                <li>访问权：查看我们收集的您的个人信息</li>
                <li>更正权：更正错误或不完整的个人信息</li>
                <li>删除权：要求删除您的个人信息</li>
                <li>限制处理权：限制我们处理您的个人信息</li>
                <li>数据可携权：获取您的个人信息副本</li>
                <li>撤回同意权：撤回您此前给予的同意</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第七条 Cookie和类似技术</h3>
              <p className="mb-2">
                7.1 我们使用Cookie和类似技术来改善用户体验，记住您的偏好设置。
              </p>
              <p className="mb-2">
                7.2 您可以通过浏览器设置管理Cookie，但这可能影响某些功能的使用。
              </p>
              <p>
                7.3 我们也可能使用第三方分析工具来了解服务使用情况。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第八条 未成年人保护</h3>
              <p className="mb-2">
                8.1 我们非常重视未成年人的个人信息保护。
              </p>
              <p className="mb-2">
                8.2 如果您是18岁以下的未成年人，请在监护人陪同下阅读本政策并使用我们的服务。
              </p>
              <p>
                8.3 我们不会主动收集未成年人的个人信息，如发现会及时删除。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第九条 政策更新</h3>
              <p className="mb-2">
                9.1 我们可能会不时更新本隐私政策，更新后会在平台上发布。
              </p>
              <p className="mb-2">
                9.2 重大变更会通过显著方式通知您。
              </p>
              <p>
                9.3 继续使用我们的服务即表示您同意更新后的政策。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第十条 联系我们</h3>
              <p className="mb-2">
                如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
              </p>
              <p className="mb-1">客服电话：400-123-4567</p>
              <p className="mb-1">客服邮箱：privacy@dainawang.com</p>
              <p className="mb-1">联系地址：中国广东省广州市天河区代拿网科技有限公司</p>
              <p>工作时间：周一至周日 9:00-18:00</p>
            </section>
          </div>

          {/* 底部提示 */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 text-center">
              本隐私政策自发布之日起生效，代拿网保留对本政策的最终解释权。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}