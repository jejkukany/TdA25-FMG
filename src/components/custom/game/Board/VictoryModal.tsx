import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VictoryModalProps {
  isOpen: boolean;
  onRematch: () => void;
  onClose: () => void;
  winner: "X" | "O" | null;
}

export function VictoryModal({
  isOpen,
  winner,
  onRematch,
  onClose,
}: VictoryModalProps) {
  const getWinnerImage = () => {
    if (winner === "X") {
      return <img src="/X_modre.svg" alt="Winner X" className="w-6 h-6 inline-block" />;
    }
    if (winner === "O") {
      return <img src="/O_cervene.svg" alt="Winner O" className="w-6 h-6 inline-block" />;
    }
    return null;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[300px] bg-card text-card-foreground border-border">
          <DialogHeader className="flex items-center space-y-3">
            <Trophy className="h-8 w-8 text-white-400 dark:text-black-400" />
            <DialogTitle className="text-xl font-bold">
              Winner: {getWinnerImage()}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-row gap-2 pt-2">
            <Button
              onClick={onRematch}
              variant="outline"
              className="flex-1 border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              Play Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
