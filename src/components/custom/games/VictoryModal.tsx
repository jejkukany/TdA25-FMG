import { Trophy, Equal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VictoryModalProps {
  isOpen: boolean
  onNextGame: () => void
  onRematch: () => void
  onClose: () => void
  result: "X" | "O" | "draw" | null
  disableNextGame: boolean
}

export function VictoryModal({ isOpen, onNextGame, result, onRematch, onClose, disableNextGame }: VictoryModalProps) {
  const getResultImage = () => {
    if (result === "X") {
      return <img src="/TDA/X_modre.svg" alt="Winner X" className="w-6 h-6 inline-block" />
    }
    if (result === "O") {
      return <img src="/TDA/O_cervene.svg" alt="Winner O" className="w-6 h-6 inline-block" />
    }
    if (result === "draw") {
      return <Equal className="w-6 h-6 inline-block text-yellow-400" />
    }
    return null
  }

  const getResultText = () => {
    if (result === "draw") {
      return "Draw"
    }
    return "Winner:"
  }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" aria-hidden="true" />}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[300px] bg-card text-card-foreground border-border">
          <DialogHeader className="flex items-center space-y-3">
            {result === "draw" ? (
              <Equal className="h-8 w-8 text-yellow-400" />
            ) : (
              <Trophy className="h-8 w-8 text-yellow-400" />
            )}
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {getResultText()} {getResultImage()}
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
              disabled={disableNextGame}
            >
              Next Game
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}