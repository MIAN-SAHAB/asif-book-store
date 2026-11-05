import type { LucideIcon } from "lucide-react";
import {
  Atom,
  Backpack,
  BatteryCharging,
  BookA,
  BookHeart,
  BookOpen,
  BookOpenText,
  Brain,
  Calculator,
  Clock3,
  Compass,
  Cpu,
  Feather,
  Footprints,
  Gem,
  GraduationCap,
  Headphones,
  Hourglass,
  Keyboard,
  Landmark,
  Laptop,
  Microscope,
  Notebook,
  Palette,
  PenTool,
  Pencil,
  PersonStanding,
  Ribbon,
  Ruler,
  Shirt,
  Smartphone,
  Speaker,
  Tablet,
  Timer,
  Usb,
  Watch,
} from "lucide-react";

/*
 * Front-end demo catalogue. All products, prices, ratings and reviews below
 * are placeholder data for the homepage prototype — replace with real
 * inventory from the store's backend before going live.
 */

export type Category = "books" | "uniforms" | "gadgets" | "watches";
export type Badge = "Best Seller" | "Authorized" | "New" | "Limited";
export type Tone = "royal" | "gold" | "ink" | "sky" | "ember" | "mint" | "plum" | "cream";

export interface Product {
  id: string;
  name: string;
  category: Category;
  /** Sub-category (books) or garment type (uniforms) etc. */
  sub: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  badge?: Badge;
  icon: LucideIcon;
  tone: Tone;
  school?: string;
  specs?: string[];
  blurb?: string;
}

export const CATEGORY_META: Record<
  Category,
  { label: string; icon: LucideIcon; tagline: string; from: number }
> = {
  books: { label: "Books", icon: BookOpen, tagline: "Course books, fiction & prep guides", from: 350 },
  uniforms: { label: "Uniforms", icon: Shirt, tagline: "Official school uniforms & gear", from: 650 },
  gadgets: { label: "Gadgets", icon: Headphones, tagline: "Study tech & everyday electronics", from: 1200 },
  watches: { label: "Watches", icon: Watch, tagline: "Timepieces for every wrist", from: 2400 },
};

export const BOOK_FILTERS = ["All", "Academic", "Fiction", "Competitive Exams", "Stationeries"] as const;
export type BookFilter = (typeof BOOK_FILTERS)[number];

export const books: Product[] = [
  { id: "bk-1", name: "Primary Mathematics Workbook — Grade 5", category: "books", sub: "Academic", price: 890, compareAt: 990, rating: 4.9, reviews: 412, badge: "Authorized", icon: Ruler, tone: "royal", school: "The City School" },
  { id: "bk-2", name: "O-Level Physics Course Companion", category: "books", sub: "Academic", price: 2450, rating: 4.8, reviews: 286, badge: "Best Seller", icon: Atom, tone: "ink" },
  { id: "bk-3", name: "English Grammar in Practice — Middle Years", category: "books", sub: "Academic", price: 1150, rating: 4.7, reviews: 198, icon: BookA, tone: "sky" },
  { id: "bk-4", name: "Whispers of the Indus", category: "books", sub: "Fiction", price: 1650, rating: 4.8, reviews: 154, badge: "New", icon: Feather, tone: "plum" },
  { id: "bk-5", name: "Stars Over Karakoram", category: "books", sub: "Fiction", price: 1395, compareAt: 1600, rating: 4.6, reviews: 121, icon: BookHeart, tone: "ember" },
  { id: "bk-6", name: "The Lantern Keeper's Atlas", category: "books", sub: "Fiction", price: 1890, rating: 4.9, reviews: 233, badge: "Best Seller", icon: Compass, tone: "gold" },
  { id: "bk-7", name: "MDCAT Complete Prep Guide 2027", category: "books", sub: "Competitive Exams", price: 3200, rating: 4.8, reviews: 540, badge: "Best Seller", icon: Microscope, tone: "mint" },
  { id: "bk-8", name: "ECAT Engineering Entry Practice", category: "books", sub: "Competitive Exams", price: 2750, rating: 4.7, reviews: 312, icon: Brain, tone: "royal" },
  { id: "bk-9", name: "CSS Essay & Précis Handbook", category: "books", sub: "Competitive Exams", price: 2100, rating: 4.6, reviews: 178, badge: "New", icon: Landmark, tone: "cream" },
  { id: "bk-10", name: "Geometry Box Pro — 12 Piece Set", category: "books", sub: "Stationeries", price: 650, rating: 4.7, reviews: 690, badge: "Best Seller", icon: Compass, tone: "sky" },
  { id: "bk-11", name: "Gold Nib Fountain Pen", category: "books", sub: "Stationeries", price: 1450, rating: 4.9, reviews: 96, badge: "New", icon: PenTool, tone: "gold" },
  { id: "bk-12", name: "A4 Spiral Notebooks — 5 Pack", category: "books", sub: "Stationeries", price: 980, compareAt: 1200, rating: 4.8, reviews: 455, icon: Notebook, tone: "ember" },
  { id: "bk-13", name: "Artist Colour Pencils — 48 Shades", category: "books", sub: "Stationeries", price: 1750, rating: 4.8, reviews: 207, icon: Palette, tone: "plum" },
  { id: "bk-14", name: "Urdu Reader — Primary Series Set", category: "books", sub: "Academic", price: 1320, rating: 4.7, reviews: 164, badge: "Authorized", icon: BookOpenText, tone: "mint", school: "Beaconhouse" },
  { id: "bk-15", name: "HB Pencil Super Pack — 24", category: "books", sub: "Stationeries", price: 420, rating: 4.6, reviews: 802, icon: Pencil, tone: "cream" },
];

export const SCHOOLS = [
  "The City School",
  "Beaconhouse",
  "Lahore Grammar School",
  "Roots Millennium",
  "Froebel's International",
  "Headstart School",
  "Educators",
  "Allied School",
] as const;
export type School = (typeof SCHOOLS)[number];

export const uniforms: Product[] = [
  { id: "un-1", name: "Summer Shirt — Half Sleeve", category: "uniforms", sub: "Shirts", price: 1250, rating: 4.8, reviews: 620, badge: "Authorized", icon: Shirt, tone: "sky", school: "The City School" },
  { id: "un-2", name: "Winter Blazer with Embroidered Crest", category: "uniforms", sub: "Outerwear", price: 6450, rating: 4.9, reviews: 318, badge: "Authorized", icon: PersonStanding, tone: "royal", school: "The City School" },
  { id: "un-3", name: "Grey Trousers — Regular Fit", category: "uniforms", sub: "Bottoms", price: 1850, rating: 4.7, reviews: 402, icon: PersonStanding, tone: "ink", school: "The City School" },
  { id: "un-4", name: "Striped House Tie", category: "uniforms", sub: "Accessories", price: 450, rating: 4.8, reviews: 288, badge: "Best Seller", icon: Ribbon, tone: "gold", school: "Beaconhouse" },
  { id: "un-5", name: "V-Neck Sweater — Navy", category: "uniforms", sub: "Outerwear", price: 2650, rating: 4.7, reviews: 211, badge: "Authorized", icon: Shirt, tone: "royal", school: "Beaconhouse" },
  { id: "un-6", name: "Pinafore Dress — Junior", category: "uniforms", sub: "Dresses", price: 2200, rating: 4.8, reviews: 176, icon: PersonStanding, tone: "plum", school: "Lahore Grammar School" },
  { id: "un-7", name: "Sports Kit — Dri-Fit Tee & Shorts", category: "uniforms", sub: "Sportswear", price: 1990, rating: 4.6, reviews: 254, badge: "New", icon: Shirt, tone: "mint", school: "Roots Millennium" },
  { id: "un-8", name: "Leather School Shoes — Black", category: "uniforms", sub: "Footwear", price: 3850, compareAt: 4300, rating: 4.7, reviews: 367, icon: Footprints, tone: "ink", school: "Lahore Grammar School" },
  { id: "un-9", name: "Ergo School Backpack — 28L", category: "uniforms", sub: "Bags", price: 4250, rating: 4.9, reviews: 509, badge: "Best Seller", icon: Backpack, tone: "ember", school: "Roots Millennium" },
  { id: "un-10", name: "PE Track Jacket", category: "uniforms", sub: "Sportswear", price: 2950, rating: 4.6, reviews: 98, badge: "New", icon: Shirt, tone: "sky", school: "Beaconhouse" },
];

export const gadgets: Product[] = [
  { id: "gd-1", name: "StudyTab 10\" Learning Tablet", category: "gadgets", sub: "Tablets", price: 42999, compareAt: 47999, rating: 4.8, reviews: 211, badge: "Best Seller", icon: Tablet, tone: "royal", specs: ['10.1" FHD', "6GB RAM", "Stylus ready"], blurb: "A distraction-free tablet built for e-books, notes and online classes." },
  { id: "gd-2", name: "AirBeat Pro Earbuds", category: "gadgets", sub: "Audio", price: 6499, rating: 4.7, reviews: 488, badge: "New", icon: Headphones, tone: "plum", specs: ["ANC", "40h battery"] },
  { id: "gd-3", name: "Scientific Calculator FX-Plus", category: "gadgets", sub: "Calculators", price: 3299, rating: 4.9, reviews: 932, badge: "Best Seller", icon: Calculator, tone: "ink", specs: ["417 functions", "Exam approved"] },
  { id: "gd-4", name: "PowerCore 20000mAh Bank", category: "gadgets", sub: "Accessories", price: 4799, rating: 4.6, reviews: 305, icon: BatteryCharging, tone: "mint", specs: ["22.5W fast", "USB-C PD"], blurb: "Two days of charge for phone, earbuds and tablet." },
  { id: "gd-5", name: "Studio Over-Ear Headphones", category: "gadgets", sub: "Audio", price: 9999, rating: 4.8, reviews: 176, icon: Headphones, tone: "gold", specs: ["Hi-Res", "Foldable"] },
  { id: "gd-6", name: "Silent Wireless Keyboard Combo", category: "gadgets", sub: "Accessories", price: 5499, rating: 4.5, reviews: 141, icon: Keyboard, tone: "sky", specs: ["2.4GHz", "Silent keys"] },
  { id: "gd-7", name: "Pocket Bluetooth Speaker", category: "gadgets", sub: "Audio", price: 3999, rating: 4.6, reviews: 220, badge: "New", icon: Speaker, tone: "ember", specs: ["IPX7", "12h play"] },
  { id: "gd-8", name: "Student Laptop Sleeve + Hub", category: "gadgets", sub: "Accessories", price: 2899, rating: 4.4, reviews: 87, icon: Laptop, tone: "cream", specs: ["7-in-1 hub"] },
  { id: "gd-9", name: "USB-C Fast Charger 35W", category: "gadgets", sub: "Accessories", price: 2499, rating: 4.7, reviews: 356, icon: Usb, tone: "royal", specs: ["GaN", "Dual port"] },
  { id: "gd-10", name: "Kids Smartphone Lite", category: "gadgets", sub: "Phones", price: 18999, rating: 4.3, reviews: 64, icon: Smartphone, tone: "plum", specs: ["Parental control"] },
];

export const watches: Product[] = [
  { id: "wt-1", name: "Regent Gold Chronograph", category: "watches", sub: "Luxury", price: 24999, compareAt: 28999, rating: 4.9, reviews: 142, badge: "Best Seller", icon: Watch, tone: "gold", specs: ["Sapphire", "50m WR"] },
  { id: "wt-2", name: "Navigator Steel Diver", category: "watches", sub: "Sport", price: 18499, rating: 4.8, reviews: 98, badge: "New", icon: Timer, tone: "royal", specs: ["200m WR", "Luminous"] },
  { id: "wt-3", name: "Classic Leather Dress", category: "watches", sub: "Classic", price: 8999, rating: 4.7, reviews: 210, icon: Clock3, tone: "cream", specs: ["Italian leather"] },
  { id: "wt-4", name: "Junior Sport Digital", category: "watches", sub: "Kids", price: 2499, rating: 4.6, reviews: 388, badge: "Best Seller", icon: Timer, tone: "ember", specs: ["Alarm", "Backlight"] },
  { id: "wt-5", name: "Aurora Rose Gold", category: "watches", sub: "Luxury", price: 21999, rating: 4.9, reviews: 77, badge: "Limited", icon: Gem, tone: "plum", specs: ["Crystal bezel"] },
  { id: "wt-6", name: "SmartFit Watch S2", category: "watches", sub: "Smart", price: 12999, rating: 4.5, reviews: 264, badge: "New", icon: Cpu, tone: "ink", specs: ["SpO2", "7-day battery"] },
  { id: "wt-7", name: "Heritage Automatic", category: "watches", sub: "Luxury", price: 34999, rating: 5, reviews: 41, badge: "Limited", icon: Hourglass, tone: "gold", specs: ["Open heart", "42h reserve"] },
  { id: "wt-8", name: "Scholar Field Watch", category: "watches", sub: "Classic", price: 6499, rating: 4.7, reviews: 156, icon: Clock3, tone: "mint", specs: ["Canvas strap"] },
];

export const ALL_PRODUCTS: Product[] = [...books, ...uniforms, ...gadgets, ...watches];

/* ---------- School kit selector ---------- */

export const SCHOOL_LEVELS = ["Pre-School", "Primary (1–5)", "Middle (6–8)", "O-Level"] as const;
export type SchoolLevel = (typeof SCHOOL_LEVELS)[number];

export interface KitLine {
  id: string;
  name: string;
  price: number;
  icon: LucideIcon;
  category: Category;
}

const LEVEL_MULTIPLIER: Record<SchoolLevel, number> = {
  "Pre-School": 0.7,
  "Primary (1–5)": 1,
  "Middle (6–8)": 1.35,
  "O-Level": 1.8,
};

export function buildSchoolKit(school: School, level: SchoolLevel): KitLine[] {
  const m = LEVEL_MULTIPLIER[level];
  const slug = `${school}-${level}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const base: Omit<KitLine, "id">[] = [
    { name: `Official Course Book Set — ${level}`, price: 5200 * m, icon: BookOpen, category: "books" },
    { name: "Summer Uniform (2 Shirts + Bottoms)", price: 3900 * (m > 1 ? 1.2 : 1), icon: Shirt, category: "uniforms" },
    { name: "Winter Sweater / Blazer", price: (level === "O-Level" ? 6450 : 2650) * 1, icon: PersonStanding, category: "uniforms" },
    { name: "Stationery Essentials Pack", price: 1450 * m, icon: Pencil, category: "books" },
    { name: "Crested School Bag", price: 3250, icon: Backpack, category: "uniforms" },
  ];
  if (level === "O-Level" || level === "Middle (6–8)") {
    base.push({ name: "Scientific Calculator", price: 3299, icon: Calculator, category: "gadgets" });
  }
  if (level === "Pre-School") {
    base.push({ name: "Activity & Colouring Bundle", price: 980, icon: Palette, category: "books" });
  }
  return base.map((l, i) => ({ ...l, price: Math.round(l.price / 10) * 10, id: `kit-${slug}-${i}` }));
}

/* ---------- Bundle builder ---------- */

export const BUNDLE_TIERS = [0, 0.05, 0.1, 0.15] as const;

export const BUNDLE_OPTIONS: Record<Category, Product[]> = {
  books: [books[0], books[1], books[6], books[3]],
  uniforms: [uniforms[0], uniforms[1], uniforms[8], uniforms[7]],
  gadgets: [gadgets[2], gadgets[1], gadgets[3], gadgets[0]],
  watches: [watches[3], watches[7], watches[2], watches[5]],
};

/* ---------- Reviews (demo) ---------- */

export interface Review {
  name: string;
  role: string;
  text: string;
  rating: number;
  icon: LucideIcon;
}

export const reviews: Review[] = [
  { name: "Ayesha K.", role: "Parent · The City School", text: "Got the full Grade 4 course set and two uniforms in one visit. Everything was the official version — no running around the city.", rating: 5, icon: GraduationCap },
  { name: "Hamza R.", role: "O-Level student", text: "Found my physics companion, a proper exam calculator and earbuds for online classes. Prices were better than online.", rating: 5, icon: Atom },
  { name: "Sana M.", role: "Teacher", text: "My go-to for stationery and reference books. Staff actually know the syllabus and what each class needs.", rating: 5, icon: BookOpenText },
  { name: "Bilal A.", role: "Parent · Beaconhouse", text: "Blazer sizing was spot on thanks to their size guide. Exchange was painless when my son grew mid-term.", rating: 4, icon: Shirt },
  { name: "Mehwish T.", role: "Gift shopper", text: "Bought a rose-gold watch for my sister — gift-wrapped beautifully and it came with a proper warranty card.", rating: 5, icon: Gem },
  { name: "Usman F.", role: "MDCAT aspirant", text: "Their MDCAT prep guide plus the practice tests are the real deal. Stocked before the rush every single year.", rating: 5, icon: Microscope },
  { name: "Fatima Z.", role: "Parent · LGS", text: "The back-to-school bundle saved us a solid amount. Books, shoes and a watch for my daughter in one order.", rating: 5, icon: Backpack },
  { name: "Daniyal S.", role: "University student", text: "Picked up the StudyTab and a power bank. Good after-sales and they set up the tablet for me in-store.", rating: 4, icon: Tablet },
];

