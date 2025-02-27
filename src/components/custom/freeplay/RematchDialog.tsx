import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RematchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptRematch: () => void;
  onDeclineRematch: () => void;
}

export function RematchDialog({
  isOpen,
  onClose,
  onAcceptRematch,
  onDeclineRematch,
}: RematchDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rematch Request</DialogTitle>
          <DialogDescription>
            Your opponent has requested a rematch. Do you want to play again?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onDeclineRematch}>
            Decline
          </Button>
          <Button onClick={onAcceptRematch}>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}