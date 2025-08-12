interface ProductSpecsProps {
  category?: string;
  style?: string;
  phoneModel?: string;
  productType?: string;
  trend?: string;
  imageType?: string;
  copyright?: string;
  biodegradable?: string;
  ecoMaterial?: string;
  itemNo?: string;
  className?: string;
}

export function ProductSpecs({
  category,
  style,
  phoneModel,
  productType,
  trend,
  imageType,
  copyright,
  biodegradable,
  ecoMaterial,
  itemNo,
  className = ''
}: ProductSpecsProps) {
  const specs = [
    { label: '商品分类', value: category },
    { label: '适用机型', value: phoneModel },
    { label: '产品类型', value: productType },
    { label: '风格款式', value: style },
    { label: '流行元素', value: trend },
    { label: '图片类型', value: imageType },
    { label: '版权信息', value: copyright },
    { label: '环保材质', value: ecoMaterial },
    { label: '可降解性', value: biodegradable },
    { label: '商品货号', value: itemNo },
  ].filter(spec => spec.value); // 过滤掉空值

  if (specs.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">商品规格</h3>
      
      <div className="space-y-3">
        {specs.map((spec, index) => (
          <div key={index} className="flex justify-between items-start">
            <span className="text-gray-600 text-sm flex-shrink-0 w-20">
              {spec.label}
            </span>
            <span className="text-gray-900 text-sm text-right flex-1 ml-4">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
