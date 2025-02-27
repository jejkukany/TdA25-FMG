import { Trophy, Equal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VictoryModalProps {
  isOpen: boolean
  onRematch: () => void
  onClose: () => void
  result: "X" | "O" | "draw" | null
  isWaitingForRematch?: boolean
}

export function VictoryModal({ isOpen, result, onRematch, onClose, isWaitingForRematch = false }: VictoryModalProps) {
  const getResultImage = () => {
    if (result === "X") {
      return <img src="/TDA/X_modre.svg" alt="Winner X" className="w-6 h-6 inline-block" />
    }
    if (result === "O") {
      return <img src="/TDA/O_cervene.svg" alt="Winner O" className="w-6 h-6 inline-block" />
    }
    if (result === "draw") {
      return "You will get them next time!"
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
            {isWaitingForRematch ? (
              <Button
                disabled
                variant="outline"
                className="flex-1 border-input bg-background items-center justify-center"
              >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Waiting for opponent...
              </Button>
            ) : (
              <Button
                onClick={onRematch}
                variant="outline"
                className="flex-1 border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
                Play Again
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}