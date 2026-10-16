import {
  ArrowUpDown,
  BadgeCheck,
  Baby,
  Camera,
  Car,
  Droplets,
  Dumbbell,
  Flame,
  Leaf,
  PhoneCall,
  ShieldCheck,
  Users,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  "passenger lift": ArrowUpDown,
  "generator backup": Zap,
  "secure parking": Car,
  "cctv surveillance": Camera,
  "rooftop garden": Leaf,
  gymnasium: Dumbbell,
  "community hall": Users,
  "fire safety system": Flame,
  intercom: PhoneCall,
  "children's play area": Baby,
  "water reservoir": Droplets,
  "gas supply": Flame,
  "high-speed internet ready": Wifi,
  "security guard station": ShieldCheck,
};

export function amenityIcon(name: string): LucideIcon {
  return map[name.toLowerCase()] ?? BadgeCheck;
}
