import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100 sticky top-0">
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              代拿网隐私政策
            </h2>
            <p className="text-sm text-gray-600">最后更新时间：2025年9月</p>
          </div>

          {/* 政策条款 */}
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第一条 隐私政策的适用范围
              </h3>
              <p className="mb-2">
                1.1
                本隐私政策适用于代拿网（以下简称"我们"或"本平台"）提供的所有服务。
              </p>
              <p className="mb-2">
                1.2 本政策描述了我们如何收集、使用、储存和分享您的个人信息。
              </p>
              <p>
                1.3 我们建议您仔细阅读本政策，了解我们处理您个人信息的详细情况。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第二条 我们收集的信息
              </h3>
              <p className="mb-3 font-medium">2.1 您主动提供的信息：</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>注册信息：手机号码、密码、昵称等</li>
                <li>个人资料：头像、个人简介、联系方式等</li>
                <li>商业信息：商品信息、档口信息、联系方式等</li>
                <li>反馈信息：客服咨询、意见反馈、评价内容等</li>
              </ul>

              <p className="mb-3 font-medium">2.2 自动收集的信息：</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>设备信息：设备型号、操作系统、唯一设备标识等</li>
                <li>日志信息：IP地址、访问时间、页面路径等</li>
                <li>网络信息：网络类型、运营商信息等</li>
                <li>使用数据：浏览记录、搜索记录、点击行为等</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第三条 信息使用目的
              </h3>
              <p className="mb-3">我们收集和使用您的个人信息用于以下目的：</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>提供和维护我们的服务</li>
                <li>促进档口批发业务撮合</li>
                <li>进行身份验证和账户安全</li>
                <li>改善用户体验和服务质量</li>
                <li>发送重要通知和服务更新</li>
                <li>提供客户支持</li>
                <li>进行数据分析和业务优化</li>
                <li>遵守法律法规要求</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第四条 信息共享和披露
              </h3>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第五条 信息存储和安全
              </h3>
              <p className="mb-2">
                5.1
                我们采用行业标准的安全措施保护您的个人信息，包括数据加密、访问控制、安全审计等。
              </p>
              <p className="mb-2">
                5.2 您的个人信息将存储在中国境内的安全服务器上。
              </p>
              <p className="mb-2">
                5.3
                我们会根据法律要求和业务需要确定信息保存期限，超期后会安全删除。
              </p>
              <p>
                5.4
                尽管我们采取了安全措施，但互联网传输无法保证绝对安全，请您妥善保管账户信息。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第六条 征得授权同意的例外
              </h3>
              <p className="mb-3">
                在以下情形中，我们收集、使用个人信息无需获得您的授权同意：
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>与国家安全、国防安全有关的</li>
                <li>与公共安全、公共卫生、重大公共利益有关的</li>
                <li>与犯罪侦查、起诉、审判和判决执行等有关的</li>
                <li>
                  出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的
                </li>
                <li>您自行向社会公众公开的个人信息</li>
                <li>从合法公开披露的信息中收集的个人信息</li>
                <li>根据您的要求签订合同所必需的</li>
                <li>用于维护所提供的产品与服务的安全稳定运行所必需的</li>
                <li>法律法规规定的其他情形</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第七条 第三方服务说明
              </h3>
              <p className="mb-3">
                为了向您提供更好的服务，我们的应用可能会集成第三方服务，包括：
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">基础服务</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>
                    <strong>数据统计分析</strong>
                    ：用于应用性能分析和用户体验优化，可能收集设备信息、使用数据等
                  </li>
                  <li>
                    <strong>消息推送服务</strong>
                    ：用于向用户发送重要通知和服务更新，可能收集设备标识信息
                  </li>
                  <li>
                    <strong>云存储服务</strong>
                    ：用于存储用户上传的图片和文件，确保数据安全和访问稳定性
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                这些第三方服务有自己的隐私政策，我们建议您在使用前仔细阅读相关条款。我们会要求第三方服务提供商采取适当的数据保护措施。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第八条 您的权利
              </h3>

              <p className="mb-3 font-medium">8.1 访问和更正您的个人信息</p>
              <p className="mb-3">
                您有权访问和更正您的个人信息。您可以通过以下方式行使这些权利：
              </p>
              <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
                <li>登录您的账户查看和编辑个人资料</li>
                <li>通过客服联系我们协助处理</li>
                <li>发送邮件至客服邮箱</li>
              </ul>

              <p className="mb-3 font-medium">8.2 删除您的个人信息</p>
              <p className="mb-2">
                在以下情况下，您可以要求我们删除您的个人信息：
              </p>
              <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
                <li>我们处理个人信息的行为违反法律法规</li>
                <li>我们收集、使用您的个人信息，却未征得您的同意</li>
                <li>您不再使用我们的产品或服务</li>
                <li>我们不再为您提供产品或服务</li>
              </ul>

              <p className="mb-3 font-medium">8.3 撤回同意</p>
              <p className="mb-4">您可以通过以下方式撤回您的同意：</p>
              <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
                <li>在设备设置中关闭相应权限</li>
                <li>注销您的账户</li>
                <li>停止使用我们的服务</li>
              </ul>

              <p className="mb-3 font-medium">8.4 账户注销</p>
              <p className="mb-2">您可以随时申请注销您的账户：</p>
              <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
                <li>通过"我的-设置-账户安全-注销账户"功能</li>
                <li>联系客服协助处理</li>
                <li>注销后，我们将删除或匿名化处理您的个人信息</li>
              </ul>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>注意：</strong>
                  某些功能需要基本的个人信息才能完成，当您撤回同意后，我们可能无法继续为您提供相应的服务。
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第七条 Cookie和类似技术
              </h3>
              <p className="mb-2">
                7.1 我们使用Cookie和类似技术来改善用户体验，记住您的偏好设置。
              </p>
              <p className="mb-2">
                7.2 您可以通过浏览器设置管理Cookie，但这可能影响某些功能的使用。
              </p>
              <p>7.3 我们也可能使用第三方分析工具来了解服务使用情况。</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第八条 未成年人保护
              </h3>
              <p className="mb-2">8.1 我们非常重视未成年人的个人信息保护。</p>
              <p className="mb-2">
                8.2
                如果您是18岁以下的未成年人，请在监护人陪同下阅读本政策并使用我们的服务。
              </p>
              <p>8.3 我们不会主动收集未成年人的个人信息，如发现会及时删除。</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第九条 信息安全事件处理
              </h3>
              <p className="mb-3">
                我们已建立专门的安全团队和完善的安全管理制度来保护您的个人信息。在不幸发生个人信息安全事件后，我们将：
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>立即启动应急预案，阻止安全事件扩大</li>
                <li>及时评估安全事件的影响范围和程度</li>
                <li>按照法律要求，及时向您告知事件基本情况和应对措施</li>
                <li>向监管部门报告安全事件处置情况</li>
                <li>配合相关部门进行调查处理</li>
              </ul>
              <p className="text-sm text-gray-600">
                如果难以逐一告知，我们会采取合理、有效的方式发布公告。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第十条 未成年人信息保护
              </h3>
              <p className="mb-3">我们非常重视未成年人个人信息的保护：</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>
                  <strong>年龄限制</strong>
                  ：我们的服务主要面向成年人，不满18周岁的用户需在监护人陪同下使用
                </li>
                <li>
                  <strong>监护人同意</strong>
                  ：未成年人使用我们的服务前，应事先取得监护人的明确同意
                </li>
                <li>
                  <strong>信息收集限制</strong>
                  ：我们不会主动收集未成年人的个人信息
                </li>
                <li>
                  <strong>发现处理</strong>
                  ：如发现在未事先获得监护人同意的情况下收集了未成年人信息，会立即删除
                </li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>监护人提醒：</strong>
                  如果您是监护人，请指导和监督未成年人使用我们的服务，确保他们在安全的环境下使用互联网。
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第十一条 跨境数据传输
              </h3>
              <p className="mb-3">
                我们在中华人民共和国境内收集和产生的个人信息将存储在中华人民共和国境内。
              </p>
              <p className="mb-3">
                如因业务需要确需向境外传输个人信息的，我们会：
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>事先获得您的明确同意</li>
                <li>确保接收方具备充分的数据保护能力</li>
                <li>签署数据传输协议，约定数据保护责任</li>
                <li>遵守相关法律法规的要求</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第十二条 政策更新
              </h3>
              <p className="mb-3">
                我们可能会不时更新本隐私政策。对于重大变更，我们会通过以下方式通知您：
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>在应用内发送通知或弹窗提醒</li>
                <li>通过官方网站发布公告</li>
                <li>向您的注册邮箱发送邮件</li>
                <li>通过短信方式通知</li>
              </ul>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>重大变更包括但不限于：</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-gray-600">
                  <li>服务模式发生重大变化</li>
                  <li>个人信息处理目的、类型发生变化</li>
                  <li>个人信息共享、转让或披露的主要对象发生变化</li>
                  <li>您参与个人信息处理方面的权利发生重大变化</li>
                  <li>负责处理个人信息安全的部门联系方式发生变化</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第十三条 投诉举报
              </h3>
              <p className="mb-3">
                如果您认为我们的个人信息处理行为损害了您的合法权益，您可以通过以下渠道进行投诉举报：
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    平台投诉
                  </h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• 应用内"意见反馈"功能</li>
                    <li>• 客服热线：13148865179</li>
                    <li>• 在线客服咨询</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">监管投诉</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 国家网信办举报中心</li>
                    <li>• 工信部申诉受理中心</li>
                    <li>• 消费者协会</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                我们将在收到您的投诉后15个工作日内给予回复。如果您对我们的回复不满意，还可以向有关监管部门投诉或举报。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第十四条 联系我们
              </h3>
              <p className="mb-3">
                如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：
              </p>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      联系方式
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>
                        <strong>客服电话：</strong>13148865179
                      </li>
                      <li>
                        <strong>工作时间：</strong>周一至周日 9:00-22:00
                      </li>
                      <li>
                        <strong>响应时间：</strong>15个工作日内回复
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      公司地址
                    </h4>
                    <p className="text-sm text-gray-700">
                      深圳市福田区华强北街道福强社区三号路86号京华11栋1层8号深圳市贤合贸易有限公司
                    </p>
                  </div>
                </div>
              </div>
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
