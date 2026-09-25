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

export const menuCategories: MenuCategory[] = [
  {
    id: "pasta",
    number: "01",
    title: "Pasta",
    subtitle: "Comfort, twirled around a fork.",
    aside: "La pasta",
    items: [
      {
        id: "spaghetti-carbonara",
        name: "Spaghetti Carbonara",
        price: "PHP 420.00",
        description:
          "Spaghetti coated in silky egg and Pecorino, with crisp guanciale and a generous crack of black pepper.",
        badges: [{ label: "Chef's Special", variant: "special" }],
      },
      {
        id: "penne-arrabbiata",
        name: "Penne Arrabbiata",
        price: "PHP 350.00",
        description:
          "Penne tossed in a lively tomato sauce with garlic, fiery red chili, and fresh parsley.",
        badges: [
          { label: "Vegetarian", variant: "vegetarian" },
          { label: "Spicy", variant: "spicy" },
        ],
      },
      {
        id: "fettuccine-alfredo",
        name: "Fettuccine Alfredo",
        price: "PHP 390.00",
        description:
          "Long ribbons of fettuccine folded through a rich butter and Parmesan sauce with a delicate peppery finish.",
      },
      {
        id: "lasagna",
        name: "Lasagna",
        price: "PHP 460.00",
        description:
          "Layers of pasta, slow-simmered beef ragù, and creamy béchamel baked to a golden, bubbling top.",
        badges: [{ label: "Chef's Special", variant: "special" }],
      },
    ],
  },
  {
    id: "pizza",
    number: "02",
    title: "Pizza",
    subtitle: "A golden crust. A generous heart.",
    aside: "Dal forno",
    items: [
      {
        id: "margherita",
        name: "Margherita",
        price: "PHP 390.00",
        description:
          "Sweet tomato, milky mozzarella, and fragrant basil meet a lightly charred, wood-fired crust.",
        badges: [{ label: "Vegetarian", variant: "vegetarian" }],
      },
      {
        id: "quattro-formaggi",
        name: "Quattro Formaggi",
        price: "PHP 490.00",
        description:
          "Mozzarella, Gorgonzola, fontina, and Parmesan melt into a bold, creamy four-cheese medley.",
      },
      {
        id: "prosciutto-e-funghi",
        name: "Prosciutto e Funghi",
        price: "PHP 520.00",
        description:
          "Savory prosciutto and earthy mushrooms sit over tomato and mozzarella, finished with olive oil.",
        badges: [{ label: "Chef's Special", variant: "special" }],
      },
      {
        id: "diavola",
        name: "Diavola",
        price: "PHP 480.00",
        description:
          "Spicy salami, melted mozzarella, and red chili bring a warming kick to a bright tomato base.",
        badges: [{ label: "Spicy", variant: "spicy" }],
      },
    ],
  },
  {
    id: "antipasti",
    number: "03",
    title: "Antipasti & Salads",
    subtitle: "A fresh beginning, best shared.",
    aside: "Per iniziare",
    items: [
      {
        id: "bruschetta",
        name: "Bruschetta",
        price: "PHP 220.00",
        description:
          "Garlic-rubbed toast piled with ripe tomatoes, fresh basil, and a bright drizzle of extra-virgin olive oil.",
        badges: [{ label: "Vegetarian", variant: "vegetarian" }],
      },
      {
        id: "caprese-salad",
        name: "Caprese Salad",
        price: "PHP 290.00",
        description:
          "Juicy tomatoes and soft mozzarella layered with basil, olive oil, and a sweet balsamic finish.",
        badges: [{ label: "Vegetarian", variant: "vegetarian" }],
      },
      {
        id: "arancini",
        name: "Arancini",
        price: "PHP 280.00",
        description:
          "Crisp golden risotto balls reveal a melting mozzarella center, served with a tangy tomato dip.",
      },
      {
        id: "insalata-mista",
        name: "Insalata Mista",
        price: "PHP 240.00",
        description:
          "A crisp mix of leafy greens, cucumber, and cherry tomatoes dressed with a zesty lemon vinaigrette.",
        badges: [{ label: "Vegetarian", variant: "vegetarian" }],
      },
    ],
  },
  {
    id: "desserts",
    number: "04",
    title: "Desserts",
    subtitle: "Always leave a little room.",
    aside: "La dolce vita",
    items: [
      {
        id: "tiramisu",
        name: "Tiramisu",
        price: "PHP 250.00",
        description:
          "Espresso-soaked ladyfingers and airy mascarpone meet a bittersweet dusting of cocoa.",
        badges: [{ label: "Chef's Special", variant: "special" }],
      },
      {
        id: "panna-cotta",
        name: "Panna Cotta",
        price: "PHP 230.00",
        description:
          "Silky vanilla cream with a delicate wobble, balanced by a tart mixed-berry compote.",
      },
      {
        id: "cannoli",
        name: "Cannoli",
        price: "PHP 260.00",
        description:
          "Crisp pastry shells filled with sweet ricotta, flecks of dark chocolate, and fragrant orange zest.",
      },
      {
        id: "gelato",
        name: "Gelato",
        price: "PHP 180.00",
        description:
          "Two creamy scoops in your choice of chocolate, vanilla, or pistachio for a cool, velvety finish.",
      },
    ],
  },
];
