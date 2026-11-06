import {
  Box,
  CalendarDays,
  ChefHat,
  Clock,
  Cog,
  Droplets,
  Funnel,
  Leaf,
  Package,
  ShieldCheck,
  Slice,
  Sprout,
  Sun,
  Tag,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  sprout: Sprout,
  droplets: Droplets,
  knife: Slice,
  sun: Sun,
  cog: Cog,
  filter: Funnel,
  package: Package,
  tag: Tag,
  clock: Clock,
  leaf: Leaf,
  shield: ShieldCheck,
  box: Box,
  calendar: CalendarDays,
  chef: ChefHat,
};

export default function BrandIcon({ name, size = 22, className }: { name: string; size?: number; className?: string }) {
  const Icon = ICONS[name] ?? Leaf;
  return <Icon size={size} className={className} aria-hidden />;
}
