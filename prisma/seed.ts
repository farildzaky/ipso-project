import { config } from "dotenv";
// Memuat file .env (ubah jadi ".env.local" kalau kamu pakainya itu)
config({ path: ".env" });

import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";


const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.createMany({
    data: [
      {
        namaProduct: "Vegetable Salad",
        harga: 20000,
        stok: 54,
        deskripsi:
          "Immerse yourself in the vibrant medley of flavors and textures with our exquisite Vegetable Salad. Crafted with an assortment of crisp, farm-fresh vegetables, each ingredient is hand-selected to ensure optimal taste and nutritional value.",
        kategori: "Healthy Food",
        tenant: "The Aston Family",
        gambarUrls: [

        ],
      },
      {
        namaProduct: "Tenderloin Steak",
        harga: 35000,
        stok: 12,
        deskripsi:
          "Premium tenderloin steak grilled to perfection, served with black pepper sauce and roasted baby potatoes. Surplus from our dinner banquet.",
        kategori: "Main Course",
        tenant: "Rainbow Hotel",
        gambarUrls: [],
      },
      {
        namaProduct: "Breakfast Set",
        harga: 23000,
        stok: 25,
        deskripsi:
          "Complete continental breakfast set including waffles, fresh berries, scrambled eggs, and honey. Leftover from morning buffet.",
        kategori: "Breakfast",
        tenant: "SunMoon Resort",
        gambarUrls: [],
      },
      {
        namaProduct: "Fresh Broccoli",
        harga: 7000,
        stok: 30,
        deskripsi:
          "Fresh, high-quality organic broccoli unused from our kitchen prep. Perfect for your own cooking needs.",
        kategori: "Raw Ingredients",
        tenant: "Hotel California",
        gambarUrls: [],
      },
      {
        namaProduct: "Smoked Salmon",
        harga: 33000,
        stok: 15,
        deskripsi:
          "Norwegian smoked salmon served with cream cheese and dill. Perfectly preserved from our high-end appetizer menu.",
        kategori: "Seafood",
        tenant: "D'Kingdom",
        gambarUrls: [],
      },
      {
        namaProduct: "Dimsum Assortment",
        harga: 12000,
        stok: 40,
        deskripsi:
          "Authentic handmade dimsum assortment including hakau and siew mai. Steamed fresh today.",
        kategori: "Asian",
        tenant: "Koberium",
        gambarUrls: [],
      },
      {
        namaProduct: "Chicken Teriyaki",
        harga: 19000,
        stok: 20,
        deskripsi:
          "Grilled chicken glazed in authentic Japanese teriyaki sauce, sprinkled with sesame seeds.",
        kategori: "Asian",
        tenant: "D'Kingdom",
        gambarUrls: [],
      },
      {
        namaProduct: "Meatball Spaghetti",
        harga: 15000,
        stok: 18,
        deskripsi:
          "Classic Italian spaghetti tossed in rich marinara sauce with homemade beef meatballs and parmesan cheese.",
        kategori: "Pasta",
        tenant: "Nirwana Suites",
        gambarUrls: [],
      },
      {
        namaProduct: "Salad Set (Fruit)",
        harga: 24000,
        stok: 22,
        deskripsi:
          "A refreshing mix of seasonal tropical fruits served in an avocado shell, topped with feta cheese.",
        kategori: "Healthy Food",
        tenant: "D'Cozy Living",
        gambarUrls: [],
      },
      {
        namaProduct: "Wagyu Beef Burger",
        harga: 45000,
        stok: 10,
        deskripsi:
          "Gourmet burger featuring a juicy Wagyu beef patty, caramelized onions, and truffle mayo on a brioche bun.",
        kategori: "Western",
        tenant: "The Ritz Lounge",
        gambarUrls: [],
      },
      {
        namaProduct: "Seafood Paella",
        harga: 55000,
        stok: 8,
        deskripsi:
          "Traditional Spanish rice dish loaded with shrimp, mussels, and calamari. Flavored with real saffron.",
        kategori: "Main Course",
        tenant: "Mediterraneo Resort",
        gambarUrls: [],
      },
      {
        namaProduct: "Tiramisu Cake Slice",
        harga: 25000,
        stok: 15,
        deskripsi:
          "Classic Italian dessert made of ladyfingers dipped in coffee, layered with a whipped mixture of eggs, sugar, and mascarpone cheese.",
        kategori: "Dessert",
        tenant: "SunMoon Resort",
        gambarUrls: [],
      },
      {
        namaProduct: "Roasted Duck Half",
        harga: 65000,
        stok: 5,
        deskripsi:
          "Crispy skin roasted duck served with hoisin sauce and thin pancakes. Prepared by our executive chef.",
        kategori: "Asian",
        tenant: "Emperor Dynasty Hotel",
        gambarUrls: [],
      },
      {
        namaProduct: "Mushroom Risotto",
        harga: 28000,
        stok: 14,
        deskripsi:
          "Creamy Arborio rice slow-cooked with porcini mushrooms and finished with truffle oil and parmesan.",
        kategori: "Main Course",
        tenant: "Nirwana Suites",
        gambarUrls: [],
      },
      {
        namaProduct: "Assorted French Pastries",
        harga: 30000,
        stok: 20,
        deskripsi:
          "A box of 4 beautifully crafted French pastries including eclairs and fruit tarts. Surplus from our afternoon tea.",
        kategori: "Dessert",
        tenant: "Le Petit Chateau",
        gambarUrls: [],
      },
    ],
  });

  console.log("✓ Seed produk ala Hotel & Resort berhasil masuk ke database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
