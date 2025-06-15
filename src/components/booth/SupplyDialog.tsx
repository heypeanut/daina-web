import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { SupplyContent } from "./SupplySheet";

const SupplyDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm w-full p-4">
      <DialogHeader className="text-center px-2">
        <DialogTitle className="text-xl">联系代拿</DialogTitle>
      </DialogHeader>
      <SupplyContent />
    </DialogContent>
  </Dialog>
);

export default SupplyDialog;
