import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface TieDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirmTie: () => void
  isOffering?: boolean
}

export function TieDialog({ isOpen, onClose, onConfirmTie, isOffering = true }: TieDialogProps) {
  const handleConfirmTie = () => {
    onConfirmTie()
    onClose()
  }

  const title = isOffering ? "Offer a Tie" : "Accept Tie Offer"
  const description = isOffering
    ? "Are you sure you want to offer a tie in this game? Your opponent will need to accept."
    : "Your opponent has offered to end this game in a tie. Do you accept?"
  const confirmText = isOffering ? "Offer Tie" : "Accept Tie"

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleConfirmTie} variant="secondary">
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}