"use client";

import React from 'react';
import Image from 'next/image';
import { BoothDetail } from '@/lib/api/booth';
import { Phone, MessageCircle, Copy } from 'lucide-react';
import { Button, Drawer, DrawerContent, DrawerHeader, DrawerOverlay, DrawerTitle } from 'ui';

interface ContactDrawerProps {
  booth: BoothDetail;
  isOpen: boolean;
  onClose: () => void;
}

interface AgentContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// 联系商家内容组件
export const ContactContent: React.FC<{ booth: BoothDetail }> = ({ booth }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`已复制: ${text}`);
    });
  };

  return (
    <div className="px-4 flex-col items-center">
      {booth.phone && (
        <div className="flex items-center py-2 px-4 bg-gray-50 rounded-xl w-full mb-4">
          <Phone className="size-5 text-red-500 mr-3" />
          <div className="flex-1">
            <div className="text-sm text-gray-500">电话</div>
            <div className="font-medium">{booth.phone}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              copyToClipboard(booth.phone!);
            }}
          >
            <Copy className="size-4" />
          </Button>
        </div>
      )}

      {booth.wx && (
        <div className="flex items-center py-2 px-4 bg-gray-50 rounded-xl w-full mb-4">
          <MessageCircle className="size-5 text-green-500 mr-3" />
          <div className="flex-1">
            <div className="text-sm text-gray-500">微信</div>
            <div className="font-medium">{booth.wx}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              copyToClipboard(booth.wx!);
            }}
          >
            <Copy className="size-4" />
          </Button>
        </div>
      )}

      <div className="mt-4 bg-white p-2 rounded-2xl shadow-sm border w-full flex justify-center items-center mb-4">
        <Image
          src="/logo.jpg"
          alt="微信二维码"
          width={150}
          height={150}
          className="rounded-xl"
          priority
        />
      </div>
    </div>
  );
};

// 代拿服务内容组件
export const AgentContent: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`已复制: ${text}`);
    });
  };

  return (
    <div className="px-4 flex-col items-center">
      <div className="mt-4 bg-white p-2 rounded-2xl shadow-sm border w-full flex justify-center items-center mb-4">
        <Image
          src="/logo.jpg"
          alt="qrcode"
          width={150}
          height={150}
          className="rounded-xl"
          priority
        />
      </div>
      <div className="flex items-center py-2 px-4 bg-gray-50 rounded-xl w-full">
        <Phone className="size-5 text-red-500 mr-3" />
        <div className="flex-1">
          <div className="text-sm text-gray-500">联系电话 / 微信</div>
          <div className="font-medium">13148865179</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            copyToClipboard("13148865179");
          }}
        >
          <Copy className="size-4" />
        </Button>
      </div>
    </div>
  );
};

// 联系商家Drawer
export function ContactDrawer({ booth, isOpen, onClose }: ContactDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} >
      <DrawerOverlay asChild/>
      <DrawerContent className="pb-10">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl">联系商家</DrawerTitle>
        </DrawerHeader>
        <ContactContent booth={booth} />
      </DrawerContent>
    </Drawer>
  );
}

// 联系代拿Drawer
export function AgentContactDrawer({ isOpen, onClose }: AgentContactDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="pb-10">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl">联系代拿</DrawerTitle>
        </DrawerHeader>
        <AgentContent />
      </DrawerContent>
    </Drawer>
  );
}

// 保持向后兼容的默认导出
export function EnhancedContactModal(props: ContactDrawerProps) {
  return <ContactDrawer {...props} />;
}

// 为了向后兼容，也导出 Sheet 版本的别名
export const ContactSheet = ContactDrawer;
export const AgentContactSheet = AgentContactDrawer;