import { ImageLazyLoader } from "@/components/common";
import type { Booth } from "@/types/api";
import { Heart, MapPin } from "lucide-react";

interface BoothCardProps {
	booth: Booth;
	handleBoothClick: (booth: Booth) => void;
	handleFavoriteClick: (booth: Booth) => void;
}

export function BoothCard({ booth, handleBoothClick, handleFavoriteClick }: BoothCardProps) {
	return (
		<div
			key={booth.id}
			className="bg-white rounded-xl shadow-sm border border-gray-100/50 overflow-hidden mb-3"
			onClick={(e) => {
				// 防止点击收藏按钮时触发卡片点击
				if ((e.target as Element).closest("[data-favorite-btn]")) {
					return;
				}
				handleBoothClick(booth);
			}}
		>
			{/* 档口头像 */}
			<div className="relative">
				<ImageLazyLoader
					src={booth.imageUrl || booth.coverImg || ''}
					alt={booth.boothName || '档口图片'}
					width={200}
					height={200}
					className="w-full aspect-auto object-cover transition-transform duration-200"
					fallbackSrc="/cover.png"
				/>

				{/* 收藏按钮 */}
				<button
					data-favorite-btn
					onClick={(e) => {
						e.stopPropagation();
						handleFavoriteClick(booth);
					}}
					className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
				>
					<Heart size={16} className="text-gray-400" />
				</button>
			</div>

			{/* 档口信息 */}
			<div className="p-3">
				<h3 className="font-bold text-gray-900 text-base mb-2 leading-tight">
					{booth.boothName}
				</h3>

				<div className="flex items-center text-xs text-gray-500">
					<MapPin size={12} className="mr-1.5 text-gray-400" />
					<span className="truncate font-medium">
						{booth.market || "批发市场"}
					</span>
				</div>
			</div>
		</div>
	);
}