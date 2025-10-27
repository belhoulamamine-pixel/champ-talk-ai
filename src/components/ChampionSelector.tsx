import { Champion } from "@/types/chat";
import { Card } from "@/components/ui/card";

interface ChampionSelectorProps {
  champions: Champion[];
  onSelect: (champion: Champion) => void;
}

const ChampionSelector = ({ champions, onSelect }: ChampionSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {champions.map((champion) => (
        <Card
          key={champion.id}
          className="cursor-pointer overflow-hidden champion-glow border-2 hover:border-primary transition-all"
          onClick={() => onSelect(champion)}
        >
          <div className="aspect-square relative">
            <img
              src={champion.image}
              alt={champion.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-bold text-white text-sm">{champion.name}</h3>
              <p className="text-xs text-white/80 truncate">{champion.title}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ChampionSelector;
