import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function UserAgreementPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100  sticky top-0">
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              代拿网用户服务协议
            </h2>
            <p className="text-sm text-gray-600">最后更新时间：2025年9月</p>
          </div>

          {/* 重要提示 */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-orange-800 leading-relaxed">
                  <strong>重要声明：</strong>
                  欢迎使用代拿网！本协议是您与深圳市贤合贸易有限公司之间的法律协议。我们致力于为档口批发行业提供专业、可靠的服务平台。请您务必仔细阅读本协议，特别是
                  <strong>加粗标注</strong>的重要条款。
                </p>
                <p className="text-sm text-orange-800 leading-relaxed mt-2">
                  点击"同意"或使用我们的服务，即表示您完全理解并同意遵守本协议的所有条款。
                  <strong>
                    未满18周岁的用户，请在监护人指导下使用本服务。
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* 协议条款 */}
          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第一条 术语定义
              </h3>
              <p className="mb-3">
                为便于理解，本协议中使用的专业术语定义如下：
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <p className="mb-2">
                  1.1 <strong>代拿网/平台</strong>
                  ：指由深圳市贤合贸易有限公司运营的档口批发服务平台，包括网站、移动应用程序及相关服务。
                </p>
                <p className="mb-2">
                  1.2 <strong>用户</strong>
                  ：指注册并使用代拿网服务的个人、企业或其他组织，包括档口商家、批发商、代理商等。
                </p>
                <p className="mb-2">
                  1.3 <strong>档口</strong>
                  ：指在批发市场中从事商品批发业务的经营场所或经营主体。
                </p>
                <p className="mb-2">
                  1.4 <strong>代发服务</strong>
                  ：指档口商家委托平台或其他用户代为发货的服务模式。
                </p>
                <p className="mb-2">
                  1.5 <strong>个人信息</strong>
                  ：指能够单独或与其他信息结合识别特定自然人身份或反映特定自然人活动情况的各种信息。
                </p>
                <p className="mb-2">
                  1.6 <strong>商业信息</strong>
                  ：指用户在平台上发布的商品信息、价格信息、库存信息等与商业经营相关的数据。
                </p>
                <p>
                  1.7 <strong>违规行为</strong>
                  ：指违反本协议、国家法律法规或平台规则的行为。
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第二条 协议范围
              </h3>
              <p className="mb-2">
                2.1
                本条款是用户（简称"您"）与深圳市贤合贸易有限公司（简称"公司"）产品之间关于用户使用本产品所订立的协议。"用户"是指注册、登录、使用本产品的个人或组织。
              </p>
              <p className="mb-2">
                2.2
                本服务是指代拿网根据本协议向您提供的服务，包括档口批发、代发服务、商品展示、交易撮合等。我们会不断丰富您使用本服务的终端、形式等，本协议自动适用于您对所有版本的软件和服务的使用。
              </p>
              <p className="mb-2">
                2.3{" "}
                <strong>
                  提供本服务的代拿网的所有权和全部的使用权均归公司所有
                </strong>
                ，您开通后仅授权使用部分功能，具体以产品展示的为准。
              </p>
              <p>
                2.4
                本协议内容包括本协议正文及所有我们已经发布或将来可能发布的隐私权政策、各项政策、规则、声明、通知、警示、提示、说明（以下统称为"用户规则"）。前述用户规则为本协议不可分割的补充部分，与本协议具有同等法律效力。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第三条 服务规则
              </h3>
              <p className="mb-3 font-medium">3.1 服务的内容</p>
              <p className="mb-3">
                服务内容是指公司向用户提供的档口批发代发工具（以下简称"代拿网"），为用户提供包括但不限于商品展示、交易撮合、信息发布、档口管理等功能的软件许可及服务。
              </p>

              <p className="mb-3 font-medium">3.2 服务的形式</p>
              <p className="mb-3">
                您使用本服务需要下载代拿网软件或通过网页访问，对于这些软件，公司给予您一项个人的、不可转让及非排他性的许可。您仅可为访问或使用本服务的目的而使用这些软件及服务。
              </p>

              <p className="mb-3 font-medium">3.3 本服务许可的范围</p>
              <p className="mb-2">
                3.3.1
                公司给予您一项个人的、不可转让及非排他性的许可，以使用本软件。您可以为商业目的在单一台终端设备上安装、使用、显示、运行本软件。
              </p>
              <p className="mb-2">
                3.3.2
                您可以为使用本软件及服务的目的复制本软件的一个副本，仅用作备份。备份副本必须包含原软件中含有的所有著作权信息。
              </p>
              <p>
                3.3.3
                本条及本协议其他条款未明示授权的其他一切权利仍由公司保留，您在行使这些权利时须另外取得公司的书面许可。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第四条 用户账户
              </h3>
              <p className="mb-2">
                4.1 您有权使用您设置的账户名称以及设置的密码登录本软件。
              </p>
              <p className="mb-2">
                4.2
                用户需要注册账户才能使用本平台的部分服务，用户应提供真实、准确的基本联系信息。
              </p>
              <p className="mb-2">
                4.3{" "}
                <strong>
                  用户应妥善保管账户密码，不得将账户借给他人使用。用户对账户下的所有活动承担责任。
                </strong>
              </p>
              <p>4.4 如发现账户被他人非法使用，用户应立即通知本平台。</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第五条 用户个人信息保护
              </h3>
              <p className="mb-2">
                5.1 <strong>保护用户个人信息是公司的一项基本原则</strong>
                ，公司将会采取合理的措施保护用户的个人信息。除法律法规规定的情形外，未经用户许可公司不会向第三方公开、透露用户个人信息。
              </p>
              <p className="mb-2">
                5.2
                您在注册账号或使用本服务的过程中，需要提供一些必要的信息，例如：为向您提供账号注册服务，需要您填写手机号码等基本联系信息。如平台业务发展需要或法律法规要求，可能需要您提供更详细的身份信息。
              </p>
              <p className="mb-2">
                5.3
                一般情况下，您可随时浏览、修改自己提交的信息，但出于安全性和身份识别的考虑，您可能无法修改注册时提供的初始注册信息及其他验证信息。
              </p>
              <p className="mb-2">
                5.4
                公司将运用各种安全技术和程序建立完善的管理制度来保护您的个人信息，以免遭受未经授权的访问、使用或披露。
              </p>
              <p>
                5.5{" "}
                <strong>
                  公司非常重视对未成年人个人信息的保护。若您是18周岁以下的未成年人，在使用公司产品的服务前，应事先取得您家长或法定监护人的书面同意。
                </strong>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第六条 用户行为规范
              </h3>

              <p className="mb-3 font-medium">6.1 基本行为准则</p>
              <p className="mb-2">
                代拿网致力于构建诚信、安全、高效的档口批发生态环境。
                <strong>
                  所有用户在使用平台服务时，应当遵守法律法规，恪守商业道德，维护平台秩序。
                </strong>
              </p>

              <p className="mb-3 font-medium">6.2 禁止的内容行为</p>
              <p className="mb-2">用户不得在平台上发布、传播以下内容：</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>
                  <strong>违法违规内容：</strong>
                  违反国家法律法规、危害国家安全、损害国家荣誉和利益的信息
                </li>
                <li>
                  <strong>虚假信息：</strong>
                  发布虚假商品信息、价格信息、库存信息或其他误导性内容
                </li>
                <li>
                  <strong>侵权内容：</strong>
                  侵犯他人知识产权、肖像权、名誉权、隐私权的内容
                </li>
                <li>
                  <strong>有害信息：</strong>
                  色情、暴力、恐怖、赌博、迷信等有害信息
                </li>
                <li>
                  <strong>垃圾信息：</strong>
                  恶意刷屏、重复发布、无关广告等垃圾信息
                </li>
                <li>
                  <strong>恶意评价：</strong>
                  恶意差评、虚假好评、诽谤中伤等不实评价
                </li>
              </ul>

              <p className="mb-3 font-medium">6.3 禁止的交易行为</p>
              <p className="mb-2">
                为维护公平的交易环境，用户不得从事以下行为：
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>
                  <strong>欺诈行为：</strong>虚构交易、刷单刷量、恶意炒作信誉等
                </li>
                <li>
                  <strong>价格操控：</strong>恶意哄抬价格、价格垄断、不正当竞争
                </li>
                <li>
                  <strong>违约行为：</strong>
                  恶意拖欠货款、无故拒收货物、恶意退换货
                </li>
                <li>
                  <strong>侵权销售：</strong>
                  销售假冒伪劣商品、侵权商品、违禁商品
                </li>
                <li>
                  <strong>逃税行为：</strong>虚开发票、偷税漏税、洗钱等违法行为
                </li>
                <li>
                  <strong>恶意竞争：</strong>
                  恶意诋毁竞争对手、散布不实信息影响他人经营
                </li>
              </ul>

              <p className="mb-3 font-medium">6.4 禁止的技术行为</p>
              <p className="mb-2">用户不得通过技术手段干扰平台正常运营：</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>
                  <strong>系统攻击：</strong>攻击、入侵平台系统，破坏系统安全
                </li>
                <li>
                  <strong>数据窃取：</strong>
                  非法获取、使用、传播平台数据或其他用户信息
                </li>
                <li>
                  <strong>恶意软件：</strong>使用或传播病毒、木马、恶意代码等
                </li>
                <li>
                  <strong>自动化工具：</strong>
                  使用机器人、爬虫等自动化工具干扰平台运营
                </li>
                <li>
                  <strong>逆向工程：</strong>对平台软件进行反编译、破解、修改
                </li>
                <li>
                  <strong>漏洞利用：</strong>恶意利用系统漏洞获取不当利益
                </li>
              </ul>

              <p className="mb-3 font-medium">6.5 账户使用规范</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>
                  <strong>信息真实：</strong>
                  注册时提供真实、准确的基本信息，如需要时配合平台进行身份验证
                </li>
                <li>
                  <strong>账户安全：</strong>
                  妥善保管账户密码，不得出借、转让账户
                </li>
                <li>
                  <strong>合理使用：</strong>
                  不得恶意注册多个账户，避免影响平台正常运营
                </li>
                <li>
                  <strong>信息更新：</strong>
                  及时更新联系方式、经营地址等重要信息
                </li>
                <li>
                  <strong>诚信经营：</strong>
                  确保经营行为合法合规，维护良好的商业信誉
                </li>
              </ul>

              <p className="mb-3 font-medium">6.6 商品管理规范</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>
                  <strong>真实描述：</strong>
                  商品图片、描述、参数等信息必须真实准确
                </li>
                <li>
                  <strong>价格透明：</strong>明确标示价格、运费、税费等费用信息
                </li>
                <li>
                  <strong>库存管理：</strong>及时更新库存状态，避免超卖或缺货
                </li>
                <li>
                  <strong>质量保证：</strong>确保商品质量符合描述和相关标准
                </li>
                <li>
                  <strong>分类准确：</strong>将商品发布到正确的分类目录中
                </li>
              </ul>

              <p className="mb-3 font-medium">6.7 沟通交流规范</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>
                  <strong>文明用语：</strong>使用文明、礼貌的语言进行沟通交流
                </li>
                <li>
                  <strong>及时回复：</strong>及时回复客户咨询和平台通知
                </li>
                <li>
                  <strong>诚信沟通：</strong>提供真实、准确的商品和服务信息
                </li>
                <li>
                  <strong>隐私保护：</strong>不得泄露他人隐私信息或商业机密
                </li>
                <li>
                  <strong>纠纷处理：</strong>理性处理交易纠纷，配合平台调解
                </li>
              </ul>

              <p className="mb-3 font-medium">6.8 特殊商品管理</p>
              <p className="mb-2">对于以下特殊商品，用户需要特别注意：</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>
                  <strong>品牌商品：</strong>确保具有合法的品牌授权或代理资质
                </li>
                <li>
                  <strong>进口商品：</strong>提供合法的进口手续和检验检疫证明
                </li>
                <li>
                  <strong>特殊许可商品：</strong>确保具备相应的经营许可证和资质
                </li>
                <li>
                  <strong>定制商品：</strong>明确定制要求、交期和退换货政策
                </li>
                <li>
                  <strong>易损商品：</strong>做好包装保护，明确运输和保险责任
                </li>
              </ul>

              <p className="mb-3 font-medium">6.9 数据使用规范</p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>
                  <strong>合法使用：</strong>仅可将平台数据用于正当的商业用途
                </li>
                <li>
                  <strong>禁止滥用：</strong>不得批量采集、存储、传播平台数据
                </li>
                <li>
                  <strong>隐私保护：</strong>严格保护客户个人信息和交易数据
                </li>
                <li>
                  <strong>商业机密：</strong>不得泄露或恶意使用他人商业机密
                </li>
              </ul>

              <p className="mb-3 font-medium">6.10 责任承担</p>
              <p className="mb-2">
                <strong>用户对其在平台上的所有行为承担完全责任。</strong>
                包括但不限于：
              </p>
              <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>发布的所有内容和信息的真实性、合法性</li>
                <li>交易行为的合规性和履约责任</li>
                <li>对其他用户或第三方造成的损失</li>
                <li>违反本协议给平台造成的损失</li>
              </ul>

              <div className="text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
                <strong>温馨提示：</strong>
                代拿网将通过技术手段和人工审核相结合的方式监督用户行为。对于违反上述规范的行为，平台有权采取警告、限制功能、暂停服务、终止合作等措施，情节严重的将移交司法机关处理。
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第七条 知识产权声明
              </h3>
              <p className="mb-2">
                7.1 <strong>公司是本软件的知识产权权利人。</strong>
                本软件的一切著作权、商标权、专利权、商业秘密等知识产权，以及与本软件相关的所有信息内容均受中华人民共和国法律法规保护，公司享有上述知识产权。
              </p>
              <p className="mb-2">
                7.2
                未经公司或相关权利人书面同意，您不得为任何商业或非商业目的自行或许可任何第三方实施、利用、转让上述知识产权。
              </p>
              <p>
                7.3
                您使用本软件及服务过程中上传、发布的全部内容，均不会因为上传、发布行为发生知识产权、肖像权等权利的转移。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第八条 终端安全责任
              </h3>
              <p className="mb-2">
                8.1
                您理解并同意，本软件同大多数互联网软件一样，可能会受多种因素影响，也可能会受各种安全问题的侵扰。因此，
                <strong>
                  您应加强信息安全及个人信息的保护意识，注意密码保护以免遭受损失。
                </strong>
              </p>
              <p className="mb-2">
                8.2
                您不得制作、发布、使用、传播用于窃取公司账号及他人个人信息、财产的恶意程序。
              </p>
              <p className="mb-2">
                8.3
                维护软件安全与正常使用是公司和您的共同责任，公司将按照行业标准合理审慎地采取必要技术措施保护您的终端设备信息和数据安全。
              </p>
              <p>
                8.4{" "}
                <strong>
                  在任何情况下，您不应轻信借款、索要密码或其他涉及财产的网络信息。
                </strong>
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第九条 违约处理
              </h3>
              <p className="mb-2">
                9.1 如果公司发现或收到他人举报或投诉用户违反本协议约定的，
                <strong>
                  公司有权不经通知随时对违规账号进行包括但不限于警告、限制或禁止使用部分或全部功能、账号封禁直至注销的处罚。
                </strong>
              </p>
              <p className="mb-2">
                9.2
                您理解并同意，公司有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动。
              </p>
              <p>
                9.3
                您理解并同意，因您违反本协议或相关服务条款的规定，导致或产生第三方主张的任何索赔、要求或损失，您应当独立承担责任；公司因此遭受损失的，您也应当一并赔偿。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第十条 免责声明
              </h3>
              <p className="mb-2">
                10.1
                本平台不保证服务的绝对安全性和稳定性，因系统故障、网络中断等原因造成的损失，本平台不承担责任。
              </p>
              <p className="mb-2">
                10.2
                用户之间的交易纠纷，本平台可提供必要协助，但不承担法律责任。
              </p>
              <p>10.3 因不可抗力因素导致的服务中断或损失，本平台不承担责任。</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第十一条 协议的修改与终止
              </h3>
              <p className="mb-2">
                11.1 您使用本软件即视为您已阅读并同意受本协议的约束。
                <strong>公司有权在必要时修改本协议条款。</strong>
                您可以在本软件的最新版本中查阅相关协议条款。
              </p>
              <p className="mb-2">
                11.2 用户可以随时注销账户，终止使用本平台服务。
              </p>
              <p className="mb-2">
                11.3 本平台有权因用户违反协议或法律法规，终止向用户提供服务。
              </p>
              <p>11.4 协议终止后，用户仍应对协议期间的行为承担责任。</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第十二条 争议解决
              </h3>
              <p className="mb-2">
                12.1 <strong>本协议签订地为中华人民共和国广东省深圳市。</strong>
              </p>
              <p className="mb-2">
                12.2
                本协议的成立、生效、履行、解释及纠纷解决，适用中华人民共和国大陆地区法律（不包括冲突法）。
              </p>
              <p className="mb-2">
                12.3 若您和公司之间发生任何纠纷或争议，首先应友好协商解决。
              </p>
              <p>
                12.4
                协商不成的，您同意将纠纷或争议提交本协议签订地有管辖权的人民法院管辖。
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                第十三条 其他条款
              </h3>
              <p className="mb-2">
                13.1
                本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。
              </p>
              <p className="mb-2">
                13.2
                本协议可能存在包括中文、英文在内的多种语言的版本，如果存在中文版本与其他语言的版本相冲突的地方，以中文版本为准。
              </p>
              <p className="mb-2">
                13.3
                本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。
              </p>
              <p>
                13.4
                如对本协议有任何疑问，请通过以下方式联系我们：客服电话：13148865179，工作时间：周一至周日
                9:00-22:00。
              </p>
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
