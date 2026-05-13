import { useThemeStore } from "@/stores/themeStore";
import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import  Picker  from "@emoji-mart/react";
import data from "@emoji-mart/data"
const EmojiPiker = ({onChange}) => {
    const {isDark} = useThemeStore();
  return (
    <Popover>
        <PopoverTrigger>
            <Smile className="h-5 w-5 text-orange-500"/>
        </PopoverTrigger>
        <PopoverContent side="right" sideOffset={40} className={`bg-transparent border-none shadow-none drop-shadow-none mb-12`}>
            <Picker
            theme={isDark ? "dark" : "light"}
            data={data}
            onEmojiSelect={(emoji) => onChange(emoji.native)}
            emojiSize={24}
            />
        </PopoverContent>
    </Popover>
  );
};

export default EmojiPiker;
