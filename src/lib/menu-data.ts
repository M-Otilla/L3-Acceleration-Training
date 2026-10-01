export type MenuBadge = {
  label: string;
  variant?: "special" | "spicy" | "vegetarian";
};

export type MenuItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  badges?: MenuBadge[];
};

export type MenuCategory = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  aside: string;
  items: MenuItem[];
};

export const homeTeasers = [
  {
    id: "pasta",
    eyebrow: "01 / Comfort on a plate",
    title: "Pasta",
    description: "Silky sauces, slow-cooked favorites, and one more forkful.",
    href: "/menu#pasta",
  },
  {
    id: "pizza",
    eyebrow: "02 / From the oven",
    title: "Pizza",
    description: "Golden crusts, bright tomatoes, and toppings worth sharing.",
    href: "/menu#pizza",
  },
  {
    id: "antipasti",
    eyebrow: "03 / A fresh start",
    title: "Antipasti & Salads",
    description: "Crisp greens and little bites to begin a good meal.",
    href: "/menu#antipasti",
  },
  {
    id: "desserts",
    eyebrow: "04 / A sweet finish",
    title: "Desserts",
    description: "A little espresso, a little cocoa, a moment to linger.",
    href: "/menu#desserts",
  },
];
