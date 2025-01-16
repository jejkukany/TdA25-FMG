import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SaveGameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, difficulty: string) => void;
}

export function SaveGameDialog({
  isOpen,
  onClose,
  onSave,
}: SaveGameDialogProps) {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleSave = () => {
    if (name.trim() && difficulty) {
      onSave(name.trim(), difficulty);
      onClose();
    }
  };

  const isFormValid = name.trim() !== "" && difficulty !== "";

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save Game</AlertDialogTitle>
          <AlertDialogDescription>
            Enter a name for your game and select the difficulty level.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              Difficulty
              <span className="text-red-500">*</span>
            </Label>
            <Select onValueChange={setDifficulty} value={difficulty}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="extreme">Extreme</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleSave} disabled={!isFormValid}>
              Save
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}