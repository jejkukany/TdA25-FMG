import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

type DifficultyIconProps = {
  difficulty: string;
};

const DifficultyIcon: React.FC<DifficultyIconProps> = ({ difficulty }) => {
  const iconMap: { [key: string]: string } = {
    beginner: "zarivka_beginner_modre",
    easy: "zarivka_easy_modre",
    medium: "zarivka_medium_modre",
    hard: "zarivka_hard_modre",
    extreme: "zarivka_extreme_modre",
  };

  const iconName =
    iconMap[difficulty.toLowerCase()] || "zarivka_beginner_modre";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Image
            src={`/TDA/${iconName}.svg`}
            alt={`${difficulty} difficulty`}
            width={34}
            height={34}
          />
        </TooltipTrigger>
        <TooltipContent className="m-1 bg-background text-foreground shadow-sm border">
          <p>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DifficultyIcon;
