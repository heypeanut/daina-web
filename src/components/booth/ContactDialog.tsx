import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ContactContent } from "./ContactSheet";
import { Booth } from "@/types/booth";

const ContactDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booth: Booth;
}> = ({ open, onOpenChange, booth }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm w-full p-4">
      <DialogHeader className="text-center px-2">
        <DialogTitle className="text-xl">联系商家</DialogTitle>
      </DialogHeader>
      <ContactContent booth={booth} />
    </DialogContent>
  </Dialog>
);

export default ContactDialog;
