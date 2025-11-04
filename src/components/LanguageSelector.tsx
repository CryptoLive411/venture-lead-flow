import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "@/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <SelectValue>
            <span>{currentLanguage?.flag} {currentLanguage?.name}</span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
