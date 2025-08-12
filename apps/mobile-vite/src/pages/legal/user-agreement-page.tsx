import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function UserAgreementPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
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
          <h1 className="text-lg font-semibold text-gray-900">用户服务协议</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 协议内容 */}
      <div className="p-6">
        <div className="bg-white rounded-lg p-6 space-y-6">
          {/* 协议标题 */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">代拿网用户服务协议</h2>
            <p className="text-sm text-gray-600">最后更新时间：2024年12月</p>
          </div>

          {/* 协议条款 */}
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第一条 协议的接受与修改</h3>
              <p className="mb-2">
                1.1 本协议是用户与代拿网（以下简称"本平台"）之间关于用户使用本平台服务的协议。
              </p>
              <p className="mb-2">
                1.2 用户通过注册、登录或使用本平台服务，即表示同意接受本协议的全部条款。
              </p>
              <p>
                1.3 本平台有权根据需要修改本协议条款，修改后的协议将在平台上公布，用户继续使用服务即视为同意修改后的协议。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第二条 用户账户</h3>
              <p className="mb-2">
                2.1 用户需要注册账户才能使用本平台的部分服务，用户应提供真实、准确、完整的个人信息。
              </p>
              <p className="mb-2">
                2.2 用户应妥善保管账户密码，不得将账户借给他人使用。用户对账户下的所有活动承担责任。
              </p>
              <p>
                2.3 如发现账户被他人非法使用，用户应立即通知本平台。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第三条 服务内容</h3>
              <p className="mb-2">
                3.1 本平台为用户提供档口批发代发服务，包括但不限于商品展示、交易撮合、信息发布等。
              </p>
              <p className="mb-2">
                3.2 本平台仅作为信息发布和交易撮合平台，不直接参与商品交易，用户应自行判断商品和服务的真实性。
              </p>
              <p>
                3.3 本平台有权根据业务需要调整服务内容，并会提前通知用户。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第四条 用户行为规范</h3>
              <p className="mb-2">
                4.1 用户在使用本平台服务时，应遵守国家法律法规，不得从事违法违规活动。
              </p>
              <p className="mb-2">
                4.2 用户不得发布虚假信息、恶意评价，不得恶意竞争或扰乱平台秩序。
              </p>
              <p className="mb-2">
                4.3 用户不得利用本平台从事欺诈、洗钱、传销等违法活动。
              </p>
              <p>
                4.4 违反本条款的用户，本平台有权采取警告、限制功能、暂停或终止服务等措施。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第五条 知识产权</h3>
              <p className="mb-2">
                5.1 本平台的商标、Logo、软件、界面设计等知识产权归本平台所有。
              </p>
              <p className="mb-2">
                5.2 用户发布的内容，其知识产权归用户所有，但用户授权本平台在服务范围内使用。
              </p>
              <p>
                5.3 任何人不得侵犯本平台或用户的知识产权。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第六条 免责声明</h3>
              <p className="mb-2">
                6.1 本平台不保证服务的绝对安全性和稳定性，因系统故障、网络中断等原因造成的损失，本平台不承担责任。
              </p>
              <p className="mb-2">
                6.2 用户之间的交易纠纷，本平台可提供必要协助，但不承担法律责任。
              </p>
              <p>
                6.3 因不可抗力因素导致的服务中断或损失，本平台不承担责任。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第七条 协议终止</h3>
              <p className="mb-2">
                7.1 用户可以随时注销账户，终止使用本平台服务。
              </p>
              <p className="mb-2">
                7.2 本平台有权因用户违反协议或法律法规，终止向用户提供服务。
              </p>
              <p>
                7.3 协议终止后，用户仍应对协议期间的行为承担责任。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第八条 争议解决</h3>
              <p className="mb-2">
                8.1 因本协议产生的争议，双方应友好协商解决。
              </p>
              <p>
                8.2 协商不成的，任何一方可向本平台所在地人民法院提起诉讼。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">第九条 联系方式</h3>
              <p className="mb-2">
                如对本协议有任何疑问，请通过以下方式联系我们：
              </p>
              <p className="mb-1">客服电话：400-123-4567</p>
              <p className="mb-1">客服邮箱：service@dainawang.com</p>
              <p>工作时间：周一至周日 9:00-18:00</p>
            </section>
          </div>

          {/* 底部提示 */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 text-center">
              本协议自发布之日起生效，代拿网保留对本协议的最终解释权。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
