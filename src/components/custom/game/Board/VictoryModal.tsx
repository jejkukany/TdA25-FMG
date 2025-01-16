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
  onNextGame: () => void;
  onRematch: () => void;
  onClose: () => void;
  winner: "X" | "O" | null;
}

export function VictoryModal({
  isOpen,
  onNextGame,
  winner,
  onRematch,
  onClose,
}: VictoryModalProps) {
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
            <Trophy className="h-8 w-8 text-yellow-400" />
            <DialogTitle className="text-xl font-bold">
              Winner: {winner}
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
            <Button
              onClick={onNextGame}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Next Game
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
