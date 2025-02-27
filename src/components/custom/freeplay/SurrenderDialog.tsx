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

interface SurrenderDialogProps {
  isOpen: boolean
  onClose: () => void
  onSurrender: () => void
}

export function SurrenderDialog({ isOpen, onClose, onSurrender }: SurrenderDialogProps) {
  const handleSurrender = () => {
    onSurrender()
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Surrender</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to surrender this game? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleSurrender} variant="destructive">
              Surrender
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}