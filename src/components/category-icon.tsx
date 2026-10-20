import {
  Armchair,
  HeartPulse,
  Laptop,
  MapPin,
  Printer,
  ShoppingBasket,
  Ticket,
  Utensils,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  makan: Utensils,
  nongkrong: Armchair,
  nugas: Laptop,
  laundry: WashingMachine,
  fotokopi: Printer,
  sembako: ShoppingBasket,
  kesehatan: HeartPulse,
  hiburan: Ticket,
};

export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = icons[slug] ?? MapPin;
  return <Icon className={className} aria-hidden="true" />;
}
