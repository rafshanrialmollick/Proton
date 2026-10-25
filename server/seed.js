// import "dotenv/config";
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import crypto from "crypto";

// // ── models (inline-import so seed runs standalone) ────────────────────────────
// import User from "./src/model/user.js";
// import Product from "./src/model/product.js";
// import Review from "./src/model/review.js";
// import Contact from "./src/model/contact.js";
// import AuthToken from "./src/model/auth.js";

// // ── helpers ───────────────────────────────────────────────────────────────────
// const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
// const rndInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// const rndFloat = (min, max, dp = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(dp));
// const slug = (s) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

// // ── data pools ────────────────────────────────────────────────────────────────
// const FIRST_NAMES = ["James","Emma","Liam","Olivia","Noah","Ava","Oliver","Isabella","Elijah","Sophia","William","Mia","Benjamin","Charlotte","Lucas","Amelia","Henry","Harper","Alexander","Evelyn","Mason","Abigail","Ethan","Emily","Daniel","Elizabeth","Michael","Mila","Jackson","Ella","Sebastian","Avery","Aiden","Sofia","Matthew","Camila","Samuel","Aria","David","Scarlett","Joseph","Victoria","Carter","Madison","Owen","Luna","Wyatt","Grace","John","Chloe","Jack","Penelope","Luke","Layla","Jayden","Riley","Dylan","Zoey","Grayson","Nora","Levi","Lily","Isaac","Eleanor","Gabriel","Hannah","Julian","Lillian","Mateo","Addison","Anthony","Aubrey","Jaxon","Ellie","Lincoln","Stella","Joshua","Natalie","Christopher","Zoe","Andrew","Leah","Theodore","Hazel","Caleb","Violet","Ryan","Aurora","Asher","Savannah","Nathan","Audrey","Thomas","Brooklyn","Leo","Bella","Isaiah","Claire","Charles","Skylar"];
// const LAST_NAMES = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts"];
// const DOMAINS = ["gmail.com","yahoo.com","outlook.com","hotmail.com","proton.me","icloud.com"];
// const STREET_TYPES = ["Street","Avenue","Boulevard","Drive","Lane","Road","Court","Way","Place"];
// const CITIES = ["New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia","San Antonio","San Diego","Dallas","San Jose","Austin","Jacksonville","Fort Worth","Columbus","Charlotte","Indianapolis","San Francisco","Seattle","Denver","Nashville"];
// const COUNTRIES = ["United States","Canada","United Kingdom","Australia","Germany","France","Japan","Brazil","India","Mexico"];

// const CATEGORIES = ["Electronics","Clothing","Home & Garden","Sports","Books","Beauty","Toys","Automotive","Food & Grocery","Health","Office Supplies","Jewelry","Pet Supplies","Music","Art & Crafts"];
// const BRANDS = ["TechPro","StyleCo","HomeElite","SportMax","ReadMore","GlowUp","KidsWorld","AutoPlus","FreshMart","WellnessHub","OfficeEdge","LuxeJewels","PetCare","MeloSound","CreateArt","EcoLife","UrbanWear","SmartHome","FitGear","NatureBlend"];

// const PRODUCT_ADJECTIVES = ["Premium","Ultra","Pro","Smart","Eco","Deluxe","Classic","Modern","Compact","Wireless","Portable","Advanced","Elite","Essential","Original","Signature","Luxury","Budget","Ergonomic","Durable"];
// const PRODUCT_NOUNS = {
//   Electronics: ["Headphones","Speaker","Laptop Stand","Webcam","Keyboard","Mouse","Monitor","USB Hub","Charger","Power Bank","Smartwatch","Earbuds","Tablet Case","Cable Management Kit","Desk Lamp"],
//   Clothing: ["T-Shirt","Hoodie","Jeans","Jacket","Sneakers","Dress","Yoga Pants","Polo Shirt","Shorts","Boots","Swimwear","Beanie","Scarf","Gloves","Socks"],
//   "Home & Garden": ["Throw Pillow","Scented Candle","Plant Pot","Wall Clock","Curtains","Rug","Storage Basket","Picture Frame","Vase","Garden Hose","Pruning Shears","Outdoor Chair","Table Lamp","Bedsheet Set","Kitchen Organizer"],
//   Sports: ["Yoga Mat","Resistance Bands","Dumbbell Set","Running Shoes","Water Bottle","Gym Bag","Jump Rope","Cycling Gloves","Protein Shaker","Foam Roller","Sports Towel","Knee Support","Fitness Tracker Band","Boxing Gloves","Swim Goggles"],
//   Books: ["Programming Guide","Self-Help Book","Novel","Cookbook","History Book","Science Textbook","Art Book","Travel Journal","Business Strategy","Mindfulness Guide","Fantasy Series","Biography","Language Workbook","Poetry Collection","Children Picture Book"],
//   Beauty: ["Face Serum","Moisturizer","Lipstick","Mascara","Foundation","Eye Shadow Palette","Perfume","Shampoo","Conditioner","Face Mask","Sunscreen","Nail Polish","Toner","BB Cream","Hair Oil"],
//   Toys: ["Building Blocks","Action Figure","Puzzle","Board Game","Remote Car","Dollhouse","Art Kit","Science Kit","Stuffed Animal","Card Game","Slime Kit","Magnetic Tiles","Model Train","Educational Tablet","Outdoor Bubbles"],
//   Automotive: ["Car Vacuum","Seat Cover","Dashboard Camera","Car Freshener","Tire Pressure Gauge","Jump Starter","Floor Mats","Phone Mount","LED Bulbs","Car Polish","Trunk Organizer","Windshield Wiper","Oil Funnel","Wheel Cleaner","First Aid Kit"],
//   "Food & Grocery": ["Organic Coffee","Herbal Tea","Protein Bar","Dried Fruits Mix","Olive Oil","Almond Butter","Granola","Dark Chocolate","Pasta","Coconut Water","Green Tea Bags","Spice Set","Honey",  "Quinoa","Chia Seeds"],
//   Health: ["Vitamin D3","Omega-3 Fish Oil","Probiotic Capsules","Zinc Tablets","Multivitamin","Melatonin","Collagen Powder","Magnesium","Turmeric Capsules","Biotin","Ashwagandha","Elderberry Syrup","Protein Powder","BCAA","Creatine"],
//   "Office Supplies": ["Stapler","Mechanical Pencil","Highlighter Set","Sticky Notes","Desk Organizer","File Folder","Whiteboard","Paper Clips","Tape Dispenser","Pen Set","Label Maker","Binder","Scissors","Eraser Pack","Index Cards"],
//   Jewelry: ["Gold Necklace","Silver Ring","Diamond Earrings","Pearl Bracelet","Rose Gold Watch","Charm Anklet","Crystal Set","Cufflinks","Boho Earrings","Tennis Bracelet","Birthstone Necklace","Signet Ring","Hoop Earrings","Pendant Set","Minimalist Ring"],
//   "Pet Supplies": ["Dog Bed","Cat Tree","Pet Carrier","Dog Collar","Cat Litter","Pet Shampoo","Chew Toy","Fish Tank","Bird Cage","Hamster Wheel","Dog Leash","Cat Toy Set","Pet Food Bowl","Aquarium Filter","Reptile Lamp"],
//   Music: ["Acoustic Guitar","Digital Piano","Drum Pad","Violin","Ukulele","Harmonica","Music Stand","Guitar Picks","Metronome","Capo","Drum Sticks","Keyboard Stand","Tuner","Cable Set","Microphone"],
//   "Art & Crafts": ["Acrylic Paint Set","Sketchbook","Watercolor Kit","Canvas Board","Colored Pencils","Brush Set","Craft Scissors","Washi Tape","Embroidery Kit","Clay Set","Linoleum Block","Calligraphy Set","Hot Glue Gun","Stencil Pack","Origami Paper"],
// };

// const REVIEW_TITLES = ["Absolutely love it!","Great value for money","Exceeded my expectations","Decent product","Not what I expected","Perfect for daily use","Highly recommend","Good quality","Could be better","Amazing purchase","Works as described","Worth every penny","Solid product","Some minor issues","Best I've used so far"];
// const REVIEW_BODIES = [
//   "This product has been a game-changer for me. The quality is outstanding and it arrived quickly. Will definitely buy again.",
//   "Bought this as a gift and the recipient loved it. Great packaging and very good build quality overall.",
//   "Exactly as described. Setup was easy and it works perfectly. Customer service was also very helpful.",
//   "Good product for the price. Nothing extraordinary but does what it promises. Delivered on time.",
//   "Had some initial concerns but after using it for a week, I'm very satisfied. Highly recommend.",
//   "The quality is not as great as I expected from the photos. Looks slightly different in person.",
//   "Very impressed with this purchase. The materials feel premium and it's very durable.",
//   "I've tried several similar products and this is by far the best. Great attention to detail.",
//   "Arrived faster than expected and exactly as described. No complaints whatsoever.",
//   "Solid value for the price point. Great everyday use, nothing fancy but very reliable.",
//   "The product quality is decent but I've seen better. Might look for alternatives next time.",
//   "Wonderful! My family loves it. We use it every day and it's held up wonderfully.",
//   "Bought based on the reviews and I'm not disappointed. Truly a quality product.",
//   "A bit smaller than I imagined but still works great for my needs. Good purchase overall.",
//   "Top notch quality. I was skeptical at first but this is now one of my favourite purchases.",
// ];
// const CONTACT_SUBJECTS = ["Issue with my order","Request for refund","Product inquiry","Shipping delay","Account access problem","Payment issue","Product feedback","Wrong item delivered","Damaged item received","Missing item in package","Subscription cancellation","Bulk order inquiry","Warranty claim","Technical support needed","General question"];
// const CONTACT_MESSAGES = [
//   "I placed an order last week and it still hasn't arrived. Could you please check the status?",
//   "I received the wrong item in my order. I ordered the blue one but got the red one instead.",
//   "The product I received was damaged. The packaging looked fine but the item itself was broken.",
//   "I would like to request a refund for my recent purchase. It didn't meet my expectations.",
//   "I'm having trouble logging into my account. I've tried resetting my password but it's not working.",
//   "My payment was charged but I didn't receive an order confirmation. Please help.",
//   "I love your products! Just wanted to share some positive feedback about my recent purchase.",
//   "One item from my order was missing. The rest arrived fine but the main item wasn't there.",
//   "I'd like to cancel my subscription. Please process this as soon as possible.",
//   "I'm interested in placing a bulk order for my business. Could you provide pricing details?",
//   "My product stopped working after a few weeks. I'd like to make a warranty claim.",
//   "Can you help me with the technical setup of the product? The instructions aren't clear.",
//   "What is the expected delivery time for international orders?",
//   "Do you offer discounts for repeat customers or loyalty programs?",
//   "I need to change the shipping address for my pending order. Is that possible?",
// ];

// // ── seed ──────────────────────────────────────────────────────────────────────
// async function seed() {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("✓ Connected to MongoDB");

//   // Wipe existing data
//   await Promise.all([
//     User.deleteMany({}),
//     Product.deleteMany({}),
//     Review.deleteMany({}),
//     Contact.deleteMany({}),
//     AuthToken.deleteMany({}),
//   ]);
//   console.log("✓ Cleared existing data");

//   // ── 1. Users ────────────────────────────────────────────────────────────────
//   const passwordHash = await bcrypt.hash("Password123!", 12);

//   const usersData = Array.from({ length: 100 }, (_, i) => {
//     const firstName = rnd(FIRST_NAMES);
//     const lastName = rnd(LAST_NAMES);
//     const uniqueSuffix = `${i}${Date.now()}${Math.random().toString(36).slice(2, 5)}`;
//     return {
//       fullName: `${firstName} ${lastName}`,
//       email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${uniqueSuffix}@${rnd(DOMAINS)}`,
//       phoneNumber: `+1${rndInt(2000000000, 9999999999)}`,
//       password: passwordHash,
//       role: i < 5 ? "admin" : "customer",
//       isEmailVerified: Math.random() > 0.2,
//       isActive: true,
//       preferences: {
//         currency: rnd(["USD", "EUR", "GBP", "CAD", "AUD"]),
//         language: rnd(["en", "es", "fr", "de", "ja"]),
//         newsletterSubscribed: Math.random() > 0.5,
//       },
//       addresses: [
//         {
//           label: rnd(["Home", "Work", "Other"]),
//           street: `${rndInt(1, 9999)} ${rnd(["Oak", "Maple", "Cedar", "Pine", "Elm", "Main", "First", "Second", "Park", "Lake"])} ${rnd(STREET_TYPES)}`,
//           city: rnd(CITIES),
//           state: rnd(["CA", "NY", "TX", "FL", "WA", "IL", "PA", "OH", "GA", "NC"]),
//           postalCode: String(rndInt(10000, 99999)),
//           country: "United States",
//           isDefault: true,
//         },
//       ],
//       rewardPoints: rndInt(0, 2000),
//     };
//   });

//   const users = await User.insertMany(usersData);
//   console.log(`✓ ${users.length} users seeded (5 admin, 95 customer)`);

//   // ── 2. Products ──────────────────────────────────────────────────────────────
//   const categoryKeys = Object.keys(PRODUCT_NOUNS);
//   const adminUsers = users.filter((u) => u.role === "admin");

//   const productsData = Array.from({ length: 200 }, (_, i) => {
//     const category = rnd(categoryKeys);
//     const noun = rnd(PRODUCT_NOUNS[category]);
//     const adj = rnd(PRODUCT_ADJECTIVES);
//     const brand = rnd(BRANDS);
//     const name = `${adj} ${brand} ${noun}`;
//     const price = rndFloat(4.99, 499.99);
//     const hasDiscount = Math.random() > 0.4;
//     const compareAtPrice = hasDiscount ? parseFloat((price * rndFloat(1.1, 1.6)).toFixed(2)) : null;
//     const uniqueSuffix = `${i}-${crypto.randomBytes(4).toString("hex")}`;

//     return {
//       name,
//       description: `The ${name} is crafted for those who value quality and performance. With its ${adj.toLowerCase()} design and robust build, it delivers exceptional results every time. Whether for personal or professional use, this product from ${brand} stands out in the ${category} category.`,
//       shortDescription: `${adj} ${noun} by ${brand} — reliable, stylish, and built to last.`,
//       brand,
//       category: null,
//       tags: [category.toLowerCase(), brand.toLowerCase(), noun.toLowerCase(), adj.toLowerCase()],
//       price,
//       compareAtPrice,
//       currency: "USD",
//       sku: `${brand.substring(0, 3).toUpperCase()}-${noun.substring(0, 3).toUpperCase()}-${uniqueSuffix}`.toUpperCase(),
//       stock: rndInt(0, 500),
//       lowStockThreshold: 10,
//       trackInventory: true,
//       hasVariants: false,
//       images: [
//         {
//           url: `https://picsum.photos/seed/${uniqueSuffix}/600/600`,
//           altText: name,
//           isPrimary: true,
//           order: 0,
//         },
//         {
//           url: `https://picsum.photos/seed/${uniqueSuffix}b/600/600`,
//           altText: `${name} - alternate view`,
//           isPrimary: false,
//           order: 1,
//         },
//       ],
//       shipping: {
//         weight: rndInt(50, 5000),
//         length: rndInt(5, 60),
//         width: rndInt(5, 60),
//         height: rndInt(2, 40),
//         requiresShipping: true,
//         isFreeShipping: Math.random() > 0.7,
//       },
//       seo: {
//         slug: `${slug(name)}-${uniqueSuffix}`,
//         title: `${name} | Proton Shop`,
//         description: `Buy the ${name} online. ${adj} quality at a great price. Free shipping available.`,
//         keywords: [category, brand, noun, adj],
//       },
//       status: rnd(["active", "active", "active", "active", "draft", "archived"]),
//       isFeatured: Math.random() > 0.8,
//       isDigital: false,
//       ratingAverage: 0,
//       ratingCount: 0,
//       soldCount: rndInt(0, 1000),
//       createdBy: rnd(adminUsers)._id,
//     };
//   });

//   const products = await Product.insertMany(productsData);
//   console.log(`✓ ${products.length} products seeded`);

//   // ── 3. Reviews ───────────────────────────────────────────────────────────────
//   const activeProducts = products.filter((p) => p.status === "active");
//   const customerUsers = users.filter((u) => u.role === "customer");

//   const reviewsData = [];
//   const usedPairs = new Set();

//   // Each product gets 2-8 reviews; each user can only review a product once
//   for (const product of activeProducts) {
//     const reviewCount = rndInt(2, 8);
//     const shuffledUsers = [...customerUsers].sort(() => Math.random() - 0.5);

//     for (let r = 0; r < Math.min(reviewCount, shuffledUsers.length); r++) {
//       const user = shuffledUsers[r];
//       const pairKey = `${product._id}-${user._id}`;
//       if (usedPairs.has(pairKey)) continue;
//       usedPairs.add(pairKey);

//       reviewsData.push({
//         product: product._id,
//         user: user._id,
//         rating: rnd([3, 3, 4, 4, 4, 4, 5, 5, 5, 2, 1]),
//         title: rnd(REVIEW_TITLES),
//         body: rnd(REVIEW_BODIES),
//         isVerifiedPurchase: Math.random() > 0.3,
//         status: rnd(["approved", "approved", "approved", "approved", "pending", "rejected"]),
//         helpfulVotes: rndInt(0, 50),
//         notHelpfulVotes: rndInt(0, 10),
//       });
//     }
//   }

//   const reviews = await Review.insertMany(reviewsData);
//   console.log(`✓ ${reviews.length} reviews seeded`);

//   // ── 4. Update product rating aggregates ────────────────────────────────────
//   const ratingPipeline = await Review.aggregate([
//     { $match: { status: "approved" } },
//     {
//       $group: {
//         _id: "$product",
//         avg: { $avg: "$rating" },
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   await Promise.all(
//     ratingPipeline.map(({ _id, avg, count }) =>
//       Product.findByIdAndUpdate(_id, {
//         ratingAverage: Math.round(avg * 10) / 10,
//         ratingCount: count,
//       })
//     )
//   );
//   console.log("✓ Product rating aggregates updated");

//   // ── 5. Contacts ──────────────────────────────────────────────────────────────
//   const contactsData = [];
//   const allUsers = [...users];

//   for (let i = 0; i < 60; i++) {
//     const user = i < 50 ? rnd(allUsers) : null; // 50 logged-in, 10 guest
//     const subject = rnd(CONTACT_SUBJECTS);
//     const message = rnd(CONTACT_MESSAGES);
//     const status = rnd(["open", "open", "in_progress", "in_progress", "awaiting_customer", "resolved", "closed"]);

//     const contact = {
//       user: user ? user._id : null,
//       guestName: user ? null : `${rnd(FIRST_NAMES)} ${rnd(LAST_NAMES)}`,
//       guestEmail: user ? null : `guest${i}@${rnd(DOMAINS)}`,
//       subject,
//       category: rnd(["order_issue", "return_refund", "product_inquiry", "shipping", "account", "payment", "feedback", "other"]),
//       relatedProduct: Math.random() > 0.5 ? rnd(products)._id : null,
//       priority: rnd(["low", "medium", "medium", "high", "urgent"]),
//       status,
//       messages: [
//         {
//           sender: user ? user._id : null,
//           senderEmail: user ? null : `guest${i}@${rnd(DOMAINS)}`,
//           body: message,
//           isStaffReply: false,
//           readAt: null,
//         },
//       ],
//       satisfactionRating: ["resolved", "closed"].includes(status) && Math.random() > 0.4
//         ? rndInt(1, 5)
//         : null,
//       resolvedAt: status === "resolved" || status === "closed" ? new Date(Date.now() - rndInt(1, 30) * 86400000) : null,
//       closedAt: status === "closed" ? new Date() : null,
//     };

//     // Add a staff reply for in-progress / resolved tickets
//     if (["in_progress", "awaiting_customer", "resolved", "closed"].includes(status)) {
//       contact.messages.push({
//         sender: rnd(adminUsers)._id,
//         senderEmail: null,
//         body: "Thank you for reaching out to us. We have received your request and our team is looking into it. We will get back to you shortly.",
//         isStaffReply: true,
//         readAt: new Date(),
//       });
//       contact.assignedTo = rnd(adminUsers)._id;
//     }

//     contactsData.push(contact);
//   }

//   const contacts = await Contact.insertMany(contactsData);
//   console.log(`✓ ${contacts.length} contact tickets seeded`);

//   // ── Summary ───────────────────────────────────────────────────────────────
//   console.log("\n╔══════════════════════════════════════╗");
//   console.log("║           SEED COMPLETE              ║");
//   console.log("╠══════════════════════════════════════╣");
//   console.log(`║  Users    : ${String(users.length).padEnd(25)}║`);
//   console.log(`║  Admins   : 5${" ".repeat(24)}║`);
//   console.log(`║  Customers: 95${" ".repeat(22)}║`);
//   console.log(`║  Products : ${String(products.length).padEnd(25)}║`);
//   console.log(`║  Reviews  : ${String(reviews.length).padEnd(25)}║`);
//   console.log(`║  Contacts : ${String(contacts.length).padEnd(25)}║`);
//   console.log("╚══════════════════════════════════════╝");
//   console.log("\n  All users password: Password123!");
//   console.log("  Admin emails: check users with role=admin\n");

//   await mongoose.disconnect();
//   process.exit(0);
// }

// seed().catch((err) => {
//   console.error("Seed failed:", err);
//   process.exit(1);
// });

// ---------------------------------------------------------------------------------------------------

/**
 * Realistic database seeder (uses @faker-js/faker)
 *
 *   npm i -D @faker-js/faker
 *   node seed.js
 *
 * Creates: 1 admin, 1 demo customer + 99 more customers, 7 parent categories with
 * 21 sub-categories, 100 products (variants, digital items, discounts, low stock),
 * reviews (sentiment matches rating), support tickets, and product rating aggregates.
 *
 * Env (optional): MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD, SEED (fixed number = same data every run)
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

import User from "./src/model/user.js";
import Product from "./src/model/product.js";
import Review from "./src/model/review.js";
import Contact from "./src/model/contact.js";
import AuthToken from "./src/model/auth.js";
import Category from "./src/model/category.js";

// ── config ────────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL || "admin@protonshop.com"
).toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";
const CUSTOMER_PASSWORD = "Password123!";
const DEMO_CUSTOMER_EMAIL = "customer@protonshop.com";
const COUNTS = { customers: 100, products: 100, tickets: 40 };

if (
  process.env.NODE_ENV === "production" &&
  process.env.FORCE_SEED !== "true"
) {
  console.error(
    "Refusing to seed in production (this deletes all data). Set FORCE_SEED=true to override.",
  );
  process.exit(1);
}

faker.seed(Number(process.env.SEED) || Date.now() % 100000);

// ── helpers ───────────────────────────────────────────────────────────────────
const pick = (arr) => faker.helpers.arrayElement(arr);
const int = (min, max) => faker.number.int({ min, max });
const float = (min, max) => faker.number.float({ min, max, fractionDigits: 2 });
const chance = (p) => faker.datatype.boolean({ probability: p });
const weighted = (pairs) =>
  faker.helpers.weightedArrayElement(
    pairs.map(([weight, value]) => ({ weight, value })),
  );
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
const cleanSku = (s) => s.toUpperCase().replace(/[^A-Z0-9-]/g, "");
const money = (n) => parseFloat(n.toFixed(2));
const between = (from, to) =>
  from >= to ? new Date(from) : faker.date.between({ from, to });

// realistic "charm" prices: skewed to the cheaper end of the range
const niceFloat = ([min, max]) => {
  const raw = min + (max - min) * faker.number.float({ min: 0, max: 1 }) ** 2;
  if (raw < 20) return money(Math.floor(raw) + 0.99);
  if (raw < 100) return money(Math.round(raw) - 0.01);
  return money(Math.round(raw / 5) * 5 - 0.01);
};

// ── catalog: parent category -> sub-categories -> product types ───────────────
const COLOR = (values) => ({ name: "Color", values, step: 0 });
const SIZE = (values, step = 0) => ({ name: "Size", values, step });
const LETTER_SIZES = SIZE(["S", "M", "L", "XL"]);
const SHOE_SIZES = SIZE(["7", "8", "9", "10", "11"]);
const VOLUME = SIZE(["30ml", "50ml", "100ml"], 0.55);

const CATALOG = [
  {
    name: "Electronics",
    description:
      "Headphones, computer accessories and smart home gadgets from trusted tech brands.",
    brands: ["Auralis", "VoltEdge", "Nexora", "PixelWorks", "Zenith Labs"],
    children: [
      {
        name: "Audio",
        price: [19, 349],
        nouns: [
          "Wireless Earbuds",
          "Bluetooth Speaker",
          "Over-Ear Headphones",
          "Soundbar",
          "Studio Microphone",
        ],
        variants: [COLOR(["Black", "White", "Midnight Blue"])],
      },
      {
        name: "Computers & Accessories",
        price: [12, 899],
        nouns: [
          "Mechanical Keyboard",
          "Wireless Mouse",
          "27-inch Monitor",
          "USB-C Hub",
          "Laptop Stand",
          "HD Webcam",
        ],
        variants: [COLOR(["Black", "Silver"])],
      },
      {
        name: "Smart Home",
        price: [15, 249],
        nouns: [
          "Smart Plug",
          "Video Doorbell",
          "LED Smart Bulb Kit",
          "Security Camera",
          "Robot Vacuum",
        ],
        variants: [],
      },
    ],
  },
  {
    name: "Fashion",
    description:
      "Everyday clothing, footwear and accessories for men and women.",
    brands: ["Northfold", "Aveline", "Kinsley & Co", "Ridgeway", "Maison Lune"],
    children: [
      {
        name: "Men's Clothing",
        price: [14, 140],
        weight: [150, 900],
        nouns: [
          "Cotton T-Shirt",
          "Pullover Hoodie",
          "Slim Chino Pants",
          "Denim Jacket",
          "Polo Shirt",
        ],
        variants: [LETTER_SIZES, COLOR(["Black", "Navy", "Olive"])],
      },
      {
        name: "Women's Clothing",
        price: [16, 160],
        weight: [150, 900],
        nouns: [
          "Summer Dress",
          "Knit Cardigan",
          "High-Waist Jeans",
          "Silk Blouse",
          "Yoga Leggings",
        ],
        variants: [LETTER_SIZES, COLOR(["Black", "Cream", "Rose"])],
      },
      {
        name: "Footwear",
        price: [29, 180],
        weight: [400, 1400],
        nouns: [
          "Running Sneakers",
          "Leather Boots",
          "Canvas Shoes",
          "Slide Sandals",
        ],
        variants: [SHOE_SIZES, COLOR(["Black", "White", "Grey"])],
      },
      {
        name: "Fashion Accessories",
        price: [12, 220],
        weight: [50, 800],
        nouns: [
          "Leather Wallet",
          "Canvas Backpack",
          "Polarized Sunglasses",
          "Wool Scarf",
          "Minimalist Watch",
        ],
        variants: [COLOR(["Black", "Brown", "Tan"])],
      },
    ],
  },
  {
    name: "Home & Kitchen",
    description:
      "Cookware, furniture, decor and bedding to make your home comfortable.",
    brands: ["Hearthwell", "Casa Verde", "Olmstead", "Brightnest", "TerraHome"],
    children: [
      {
        name: "Kitchen & Dining",
        price: [12, 199],
        weight: [300, 5000],
        nouns: [
          "Chef Knife Set",
          "Non-Stick Frying Pan",
          "Ceramic Dinnerware Set",
          "Electric Kettle",
          "French Press",
        ],
        variants: [],
      },
      {
        name: "Furniture & Decor",
        price: [18, 420],
        weight: [1500, 15000],
        nouns: [
          "Throw Pillow Set",
          "Floor Lamp",
          "Area Rug",
          "Wall Mirror",
          "Floating Bookshelf",
        ],
        variants: [COLOR(["Grey", "Beige", "Forest Green"])],
      },
      {
        name: "Bedding & Bath",
        price: [20, 180],
        weight: [500, 4000],
        nouns: [
          "Cotton Sheet Set",
          "Memory Foam Pillow",
          "Bath Towel Set",
          "Weighted Blanket",
        ],
        variants: [SIZE(["Twin", "Queen", "King"], 0.15)],
      },
    ],
  },
  {
    name: "Sports & Outdoors",
    description: "Gear for the gym, the trail and the road.",
    brands: ["SummitPeak", "IronForge", "TrailBlaze", "AquaStride", "PulseFit"],
    children: [
      {
        name: "Fitness",
        price: [9, 260],
        weight: [200, 9000],
        nouns: [
          "Yoga Mat",
          "Adjustable Dumbbells",
          "Resistance Band Set",
          "Speed Jump Rope",
          "Foam Roller",
        ],
        variants: [COLOR(["Black", "Blue", "Red"])],
      },
      {
        name: "Camping & Hiking",
        price: [14, 320],
        weight: [200, 4500],
        nouns: [
          "Hiking Backpack",
          "2-Person Tent",
          "Insulated Water Bottle",
          "Sleeping Bag",
          "Rechargeable Headlamp",
        ],
        variants: [COLOR(["Olive", "Orange", "Charcoal"])],
      },
      {
        name: "Cycling",
        price: [9, 150],
        weight: [100, 1500],
        nouns: [
          "Bike Helmet",
          "Cycling Gloves",
          "LED Bike Light Set",
          "U-Lock",
          "Bike Repair Kit",
        ],
        variants: [],
      },
    ],
  },
  {
    name: "Beauty & Personal Care",
    description: "Skincare, hair care and fragrance for every routine.",
    brands: ["Lumina", "Verdant Skin", "Pure Ritual", "Aurelle", "Botanica"],
    children: [
      {
        name: "Skincare",
        price: [8, 85],
        weight: [50, 400],
        nouns: [
          "Vitamin C Serum",
          "Hydrating Moisturizer",
          "Mineral Sunscreen SPF 50",
          "Clay Face Mask",
          "Gentle Cleanser",
        ],
        variants: [VOLUME],
      },
      {
        name: "Hair Care",
        price: [7, 120],
        weight: [100, 900],
        nouns: [
          "Argan Oil Shampoo",
          "Repair Conditioner",
          "Ionic Hair Dryer",
          "Heat Protectant Spray",
        ],
        variants: [],
      },
      {
        name: "Fragrance",
        price: [15, 140],
        weight: [100, 500],
        nouns: ["Eau de Parfum", "Body Mist", "Scented Candle Set"],
        variants: [VOLUME],
      },
    ],
  },
  {
    name: "Books & Stationery",
    description:
      "Bestselling reads, instant-download e-books and desk essentials.",
    brands: [
      "Pageturn Press",
      "Inkwell",
      "Quill & Co",
      "Northlight Publishing",
      "PaperCraft",
    ],
    children: [
      {
        name: "Books",
        price: [8, 38],
        weight: [200, 900],
        titled: true,
        nouns: [
          "Novel",
          "Cookbook",
          "Science Guide",
          "Self-Improvement Book",
          "Illustrated Children's Book",
        ],
        variants: [],
      },
      {
        name: "E-books",
        price: [4.99, 24.99],
        titled: true,
        digital: true,
        nouns: [
          "Programming Handbook",
          "Business Strategy Guide",
          "Mindfulness Workbook",
          "Travel Guide",
        ],
        variants: [],
      },
      {
        name: "Stationery",
        price: [4, 65],
        weight: [50, 600],
        nouns: [
          "Hardcover Notebook",
          "Gel Pen Set",
          "Desk Organizer",
          "Weekly Planner",
          "Fountain Pen",
        ],
        variants: [COLOR(["Black", "Blue", "Green"])],
      },
    ],
  },
  {
    name: "Toys & Games",
    description: "Board games, building sets and creative kits for all ages.",
    brands: ["Playmore", "BrickWorld", "Wonderkin", "Tinkerly", "FunHaven"],
    children: [
      {
        name: "Board Games",
        price: [9, 60],
        weight: [300, 2500],
        nouns: [
          "Strategy Board Game",
          "Family Card Game",
          "1000-Piece Puzzle",
          "Trivia Game",
        ],
        variants: [],
      },
      {
        name: "Building & Creative",
        price: [10, 120],
        weight: [300, 3500],
        nouns: [
          "Building Block Set",
          "Art & Craft Kit",
          "Science Experiment Kit",
          "Magnetic Tiles",
        ],
        variants: [],
      },
    ],
  },
];

// ── text pools ────────────────────────────────────────────────────────────────
const ADJECTIVES = [
  "Studio",
  "Everyday",
  "Classic",
  "Essential",
  "Signature",
  "Premium",
  "Urban",
  "Compact",
  "Ultra",
  "Heritage",
];
const SERIES = ["Pro", "Max", "Lite", "Plus", "Mini", "Air"];
const TAGLINES = [
  "Built to last.",
  "Designed for everyday use.",
  "A customer favourite.",
  "Great value, great quality.",
];
const HIGHLIGHTS = [
  "Quality-tested for durability",
  "Easy to use right out of the box",
  "Designed for everyday comfort",
  "Backed by a 12-month warranty",
  "Responsibly packaged to reduce waste",
  "Free returns within 30 days",
];
const HIGHLIGHTS_DIGITAL = [
  "Instant download after purchase",
  "Readable on phone, tablet and computer",
  "Lifetime access to free updates",
  "No shipping required",
];

const REVIEWS = {
  positive: {
    titles: [
      "Absolutely love it",
      "Exactly what I needed",
      "Great quality for the price",
      "Highly recommend",
      "Five stars, no regrets",
      "Better than expected",
    ],
    bodies: [
      "I've been using this {noun} for a few weeks now and it has been fantastic. The build quality feels solid and it arrived earlier than expected.",
      "Bought this {noun} as a gift and the recipient loved it. Packaging was great and everything matched the description.",
      "Really impressed with this {noun}. It does exactly what it promises and feels much more premium than the price suggests.",
      "Second time buying this {noun}. Reliable, well made and easy to use. Would happily buy again.",
    ],
  },
  neutral: {
    titles: ["It's okay", "Decent, but not perfect", "Does the job"],
    bodies: [
      "The {noun} works fine and arrived on time, but it doesn't feel quite as premium as the photos suggest. Fair for the price.",
      "Average {noun}. Nothing wrong with it, nothing special either. I'd consider alternatives next time.",
      "It does what I need, though the instructions could be clearer and the finish is a little basic.",
    ],
  },
  negative: {
    titles: ["Disappointed", "Not as described", "Stopped working too soon"],
    bodies: [
      "Sadly this {noun} didn't live up to the description. The quality feels cheap and I expected much more.",
      "Had problems with this {noun} after only a couple of weeks. Customer support was polite but it was still frustrating.",
      "Arrived with a minor defect and the size/colour wasn't what I expected. Returning it.",
    ],
  },
};

const TICKET_TEMPLATES = {
  order_issue: [
    {
      subject: "Wrong item in my order",
      message:
        "I received the wrong item in my latest order. I ordered a different one and would like it replaced as soon as possible.",
    },
    {
      subject: "Missing item in package",
      message:
        "One item from my order was missing from the package. The rest arrived fine but the main item wasn't there.",
    },
    {
      subject: "Damaged item received",
      message:
        "My order arrived damaged. The box looked fine but the product inside was broken. Can you help?",
    },
  ],
  return_refund: [
    {
      subject: "Request for refund",
      message:
        "I would like to return my recent purchase and get a refund. It didn't meet my expectations.",
    },
    {
      subject: "How do I return an item?",
      message:
        "I need to send back an item I bought last week. Could you tell me the return process and whether shipping is covered?",
    },
  ],
  product_inquiry: [
    {
      subject: "Question about a product",
      message:
        "Before I buy, could you confirm whether this product is compatible with what I already own and what the warranty covers?",
    },
    {
      subject: "Bulk order inquiry",
      message:
        "I'm interested in placing a bulk order for my business. Could you provide pricing details and lead times?",
    },
  ],
  shipping: [
    {
      subject: "Shipping delay",
      message:
        "I placed an order over a week ago and it still hasn't arrived. Could you please check the tracking status?",
    },
    {
      subject: "Change shipping address",
      message:
        "I need to change the shipping address for my pending order. Is that still possible?",
    },
  ],
  account: [
    {
      subject: "Account access problem",
      message:
        "I'm having trouble logging into my account. I've tried resetting my password but the email never arrives.",
    },
    {
      subject: "Update my email address",
      message:
        "I'd like to change the email address on my account but can't find the option. Can you help?",
    },
  ],
  payment: [
    {
      subject: "Charged but no confirmation",
      message:
        "My payment was taken from my card but I never received an order confirmation. Please look into it.",
    },
    {
      subject: "Charged twice",
      message:
        "I think I was charged twice for the same order. Please check and refund the duplicate payment.",
    },
  ],
  feedback: [
    {
      subject: "Great shopping experience",
      message:
        "Just wanted to share some positive feedback about my recent purchase. Delivery was quick and the product is excellent!",
    },
    {
      subject: "Website suggestion",
      message:
        "Love the store, but it would be great to filter products by brand on the category pages.",
    },
  ],
  other: [
    {
      subject: "Do you offer loyalty rewards?",
      message:
        "Do you offer discounts for repeat customers or any kind of loyalty programme?",
    },
  ],
};

const STAFF_REPLIES = [
  "Thank you for reaching out. We've received your request and our team is looking into it. We'll update you shortly.",
  "Hi there, sorry about the trouble. I've escalated this to the relevant team and will get back to you within 24 hours.",
  "Thanks for contacting Proton Shop. Could you please share your order number so we can look into this right away?",
  "We're sorry for the inconvenience. We've issued a resolution on your account. Let us know if you need anything else.",
];

const DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "proton.me",
  "icloud.com",
];

// ── builders ──────────────────────────────────────────────────────────────────
const usedEmails = new Set([ADMIN_EMAIL, DEMO_CUSTOMER_EMAIL]);
const makeEmail = (first, last) => {
  const base = `${first}.${last}`.toLowerCase().replace(/[^a-z.]/g, "");
  let email;
  let n = 0;
  do {
    email = `${base}${n || ""}@${pick(DOMAINS)}`;
    n++;
  } while (usedEmails.has(email));
  usedEmails.add(email);
  return email;
};

const makeAddress = (isDefault) => ({
  label: pick(["Home", "Work", "Other"]),
  street: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  postalCode: faker.location.zipCode("#####"),
  country: "United States",
  isDefault,
});

const makeCustomer = (index, passwordHash) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const demo = index === 0;
  return {
    fullName: demo ? "Demo Customer" : `${firstName} ${lastName}`,
    email: demo ? DEMO_CUSTOMER_EMAIL : makeEmail(firstName, lastName),
    phoneNumber: `+1${int(2000000000, 9999999999)}`,
    password: passwordHash,
    role: "customer",
    isEmailVerified: demo || chance(0.85),
    isActive: true,
    preferences: {
      currency: weighted([
        [70, "USD"],
        [10, "EUR"],
        [10, "GBP"],
        [10, "CAD"],
      ]),
      language: weighted([
        [75, "en"],
        [10, "es"],
        [8, "fr"],
        [7, "de"],
      ]),
      newsletterSubscribed: chance(0.45),
    },
    addresses: chance(0.3)
      ? [makeAddress(true), makeAddress(false)]
      : [makeAddress(true)],
    rewardPoints: chance(0.4) ? 0 : int(10, 2500),
    createdAt: faker.date.past({ years: 2 }),
  };
};

const buildVariants = (groups, basePrice, sku) =>
  groups.map((group) => ({
    name: group.name,
    options: group.values.map((value, idx) => {
      const price = money(basePrice * (1 + group.step * idx));
      const stock = chance(0.1) ? 0 : int(5, 150);
      return {
        value,
        sku: cleanSku(`${sku}-${group.name.substring(0, 3)}-${value}`),
        price,
        compareAtPrice: chance(0.3) ? money(price * float(1.1, 1.4)) : null,
        stock,
        weight: int(80, 3000),
        image: null,
        isAvailable: stock > 0,
      };
    }),
  }));

const makeProduct = (index, leaf, categoryId, adminId, now) => {
  const { parent, child } = leaf;
  const noun = pick(child.nouns);
  const brand = pick(parent.brands);
  const adj = pick(ADJECTIVES);
  const digital = Boolean(child.digital);

  const name = child.titled
    ? `The ${cap(faker.word.adjective({ length: { min: 4, max: 8 } }))} ${cap(faker.word.noun({ length: { min: 4, max: 8 } }))}: A ${noun}`
    : `${brand} ${adj} ${noun}${chance(0.35) ? ` ${pick(SERIES)}` : ""}`;

  const price = niceFloat(child.price);
  const sku = cleanSku(
    `${brand.substring(0, 3)}-${noun.substring(0, 3)}-${index + 1}-${faker.string.alphanumeric(4)}`,
  );
  const hasVariants = child.variants.length > 0 && chance(0.7);
  const variants = hasVariants ? buildVariants(child.variants, price, sku) : [];
  const stock = digital
    ? 0
    : hasVariants
      ? variants[0].options.reduce((sum, o) => sum + o.stock, 0)
      : chance(0.08)
        ? int(0, 5)
        : int(20, 400);

  const [wMin, wMax] = child.weight || [100, 3000];
  const status = weighted([
    [88, "active"],
    [7, "draft"],
    [5, "archived"],
  ]);
  const createdAt = faker.date.past({ years: 2 });
  const highlights = faker.helpers.arrayElements(
    digital ? HIGHLIGHTS_DIGITAL : HIGHLIGHTS,
    3,
  );
  const popularity = faker.number.float({ min: 0, max: 1 }) ** 3; // few bestsellers, many slow sellers

  const doc = {
    name,
    description: [
      faker.commerce.productDescription(),
      `The ${name} from ${brand} combines ${adj.toLowerCase()} design with dependable everyday performance.`,
      "",
      "Highlights:",
      ...highlights.map((h) => `- ${h}`),
    ].join("\n"),
    shortDescription: `${adj} ${noun} by ${brand}. ${pick(TAGLINES)}`,
    category: categoryId,
    brand,
    tags: [
      ...new Set(
        [parent.name, child.name, noun, brand].map((t) => t.toLowerCase()),
      ),
    ],
    price,
    compareAtPrice: chance(0.35) ? money(price * float(1.1, 1.5)) : null,
    currency: "USD",
    sku,
    stock,
    lowStockThreshold: 5,
    trackInventory: !digital,
    hasVariants,
    variants,
    images: [1, 2, 3].map((n) => ({
      url: `https://picsum.photos/seed/${sku.toLowerCase()}-${n}/800/800`,
      altText: n === 1 ? name : `${name} - view ${n}`,
      isPrimary: n === 1,
      order: n - 1,
    })),
    shipping: {
      weight: digital ? 0 : int(wMin, wMax),
      length: digital ? 0 : int(5, 60),
      width: digital ? 0 : int(5, 60),
      height: digital ? 0 : int(2, 40),
      requiresShipping: !digital,
      isFreeShipping: digital || chance(0.3),
    },
    seo: {
      title: `${name} | Proton Shop`.slice(0, 70),
      description:
        `Buy the ${name} online at Proton Shop. ${pick(TAGLINES)}`.slice(
          0,
          160,
        ),
      keywords: [parent.name, child.name, brand, noun],
      slug: `${slug(name)}-${index + 1}`.slice(0, 120),
    },
    status,
    isFeatured: status === "active" && chance(0.12),
    isDigital: digital,
    ratingAverage: 0,
    ratingCount: 0,
    soldCount: Math.round(2000 * popularity),
    createdBy: adminId,
    deletedAt: null,
    createdAt,
    updatedAt: between(createdAt, now),
  };

  return { doc, noun: noun.toLowerCase(), createdAt };
};

const makeReview = (product, noun, productCreatedAt, user, now) => {
  const rating = weighted([
    [6, 1],
    [7, 2],
    [12, 3],
    [32, 4],
    [43, 5],
  ]);
  const tone =
    REVIEWS[rating >= 4 ? "positive" : rating === 3 ? "neutral" : "negative"];
  const from = new Date(Math.max(+productCreatedAt, +(user.createdAt || 0)));
  return {
    product: product._id,
    user: user._id,
    rating,
    title: pick(tone.titles),
    body: pick(tone.bodies).replace("{noun}", noun),
    isVerifiedPurchase: chance(0.7),
    status: weighted([
      [91, "approved"],
      [6, "pending"],
      [3, "rejected"],
    ]),
    helpfulVotes: rating >= 4 ? int(0, 30) : int(0, 12),
    notHelpfulVotes: int(0, 6),
    createdAt: between(from, now),
  };
};

const makeTicket = (index, { customers, products, adminId, now }) => {
  const isGuest = index >= COUNTS.tickets - 8;
  const user = isGuest ? null : pick(customers);
  const category = weighted([
    [28, "order_issue"],
    [14, "return_refund"],
    [14, "product_inquiry"],
    [16, "shipping"],
    [8, "account"],
    [10, "payment"],
    [6, "feedback"],
    [4, "other"],
  ]);
  const template = pick(TICKET_TEMPLATES[category]);
  const status = weighted([
    [20, "open"],
    [25, "in_progress"],
    [10, "awaiting_customer"],
    [25, "resolved"],
    [20, "closed"],
  ]);
  const done = status === "resolved" || status === "closed";
  const hasStaffReply = status !== "open";

  const guestFirst = faker.person.firstName();
  const guestLast = faker.person.lastName();
  const guestEmail = makeEmail(guestFirst, guestLast);
  const createdAt = faker.date.recent({ days: 90 });
  const resolvedAt = done
    ? between(createdAt, new Date(Math.min(+now, +createdAt + 5 * 86400000)))
    : null;
  const closedAt =
    status === "closed"
      ? between(
          resolvedAt,
          new Date(Math.min(+now, +resolvedAt + 3 * 86400000)),
        )
      : null;

  const messages = [
    {
      sender: user ? user._id : null,
      senderEmail: user ? null : guestEmail,
      body: template.message,
      isStaffReply: false,
      readAt: hasStaffReply ? createdAt : null,
    },
  ];
  if (hasStaffReply) {
    messages.push({
      sender: adminId,
      senderEmail: null,
      body: pick(STAFF_REPLIES),
      isStaffReply: true,
      readAt: chance(0.7) ? resolvedAt || now : null,
    });
  }
  if (done && chance(0.6)) {
    messages.push({
      sender: user ? user._id : null,
      senderEmail: user ? null : guestEmail,
      body: "Thanks for the quick help, that sorted it out!",
      isStaffReply: false,
      readAt: closedAt || resolvedAt,
    });
  }

  return {
    user: user ? user._id : null,
    guestName: user ? null : `${guestFirst} ${guestLast}`,
    guestEmail: user ? null : guestEmail,
    subject: template.subject,
    category,
    relatedProduct:
      ["order_issue", "return_refund", "product_inquiry"].includes(category) &&
      chance(0.7)
        ? pick(products)._id
        : null,
    priority:
      category === "payment"
        ? weighted([
            [60, "high"],
            [40, "urgent"],
          ])
        : weighted([
            [20, "low"],
            [50, "medium"],
            [22, "high"],
            [8, "urgent"],
          ]),
    status,
    messages,
    assignedTo: hasStaffReply ? adminId : null,
    satisfactionRating:
      done && chance(0.6)
        ? weighted([
            [5, 1],
            [5, 2],
            [15, 3],
            [35, 4],
            [40, 5],
          ])
        : null,
    resolvedAt,
    closedAt,
    createdAt,
  };
};

// ── seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`✓ Connected to MongoDB (${mongoose.connection.name || "db"})`);
  const now = new Date();

  // 0. wipe everything
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Review.deleteMany({}),
    Contact.deleteMany({}),
    AuthToken.deleteMany({}),
    Category.deleteMany({}),
  ]);
  console.log("✓ Cleared existing data");

  // 1. users: 1 admin + customers (insertMany skips pre-save hooks, so hash manually)
  const [adminHash, customerHash] = await Promise.all([
    bcrypt.hash(ADMIN_PASSWORD, 12),
    bcrypt.hash(CUSTOMER_PASSWORD, 12),
  ]);

  const adminDoc = {
    fullName: "Super Admin",
    email: ADMIN_EMAIL,
    phoneNumber: "+12025550100",
    password: adminHash,
    role: "admin",
    isEmailVerified: true,
    isActive: true,
    preferences: {
      currency: "USD",
      language: "en",
      newsletterSubscribed: false,
    },
    addresses: [],
    rewardPoints: 0,
    createdAt: faker.date.past({ years: 2 }),
  };
  const customerDocs = Array.from({ length: COUNTS.customers }, (_, i) =>
    makeCustomer(i, customerHash),
  );
  const users = await User.insertMany([adminDoc, ...customerDocs]);
  const admin = users.find((u) => u.role === "admin");
  const customers = users.filter((u) => u.role === "customer");
  console.log(
    `✓ ${users.length} users (1 admin, ${customers.length} customers)`,
  );

  // 2. categories: parents first, then children linked via `parent`
  const parents = await Category.insertMany(
    CATALOG.map((p, i) => ({
      name: p.name,
      slug: slug(p.name),
      description: p.description,
      image: `https://picsum.photos/seed/cat-${slug(p.name)}/800/500`,
      parent: null,
      isActive: true,
      order: i,
    })),
  );
  const parentId = Object.fromEntries(parents.map((c) => [c.name, c._id]));

  const leaves = CATALOG.flatMap((parent) =>
    parent.children.map((child) => ({ parent, child })),
  );
  const children = await Category.insertMany(
    leaves.map(({ parent, child }, i) => ({
      name: child.name,
      slug: slug(`${parent.name} ${child.name}`),
      description: `${child.name} in ${parent.name}.`,
      image: `https://picsum.photos/seed/cat-${slug(child.name)}/800/500`,
      parent: parentId[parent.name],
      isActive: true,
      order: i,
    })),
  );
  const childId = Object.fromEntries(children.map((c) => [c.name, c._id]));
  console.log(
    `✓ ${parents.length + children.length} categories (${parents.length} parent, ${children.length} sub)`,
  );

  // 3. products (every sub-category gets at least one)
  const built = Array.from({ length: COUNTS.products }, (_, i) => {
    const leaf = i < leaves.length ? leaves[i] : pick(leaves);
    return {
      ...makeProduct(i, leaf, childId[leaf.child.name], admin._id, now),
      leaf,
    };
  });
  const products = await Product.insertMany(built.map((b) => b.doc));
  const withVariants = products.filter((p) => p.hasVariants).length;
  console.log(`✓ ${products.length} products (${withVariants} with variants)`);

  // 4. reviews: popular products get more, one review per user per product
  const reviewDocs = [];
  products.forEach((product, i) => {
    if (product.status !== "active") return;
    const count = Math.min(
      customers.length,
      Math.round(product.soldCount / 180) + int(0, 3),
    );
    for (const user of faker.helpers.arrayElements(customers, count)) {
      reviewDocs.push(
        makeReview(product, built[i].noun, built[i].createdAt, user, now),
      );
    }
  });
  const reviews = await Review.insertMany(reviewDocs);
  console.log(`✓ ${reviews.length} reviews`);

  // 5. product rating aggregates (approved reviews only)
  const ratings = await Review.aggregate([
    { $match: { status: "approved" } },
    {
      $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } },
    },
  ]);
  await Promise.all(
    ratings.map(({ _id, avg, count }) =>
      Product.findByIdAndUpdate(_id, {
        ratingAverage: Math.round(avg * 10) / 10,
        ratingCount: count,
      }),
    ),
  );
  console.log("✓ Product rating aggregates updated");

  // 6. support tickets
  const ticketDocs = Array.from({ length: COUNTS.tickets }, (_, i) =>
    makeTicket(i, { customers, products, adminId: admin._id, now }),
  );
  const contacts = await Contact.insertMany(ticketDocs);
  console.log(`✓ ${contacts.length} support tickets`);

  // summary
  console.log("\n=============== SEED COMPLETE ===============");
  console.log(
    `Users      : ${users.length} (1 admin + ${customers.length} customers)`,
  );
  console.log(`Categories : ${parents.length + children.length}`);
  console.log(`Products   : ${products.length}`);
  console.log(`Reviews    : ${reviews.length}`);
  console.log(`Tickets    : ${contacts.length}`);
  console.log("\nProducts per sub-category:");
  for (const { leaf } of [
    ...new Map(built.map((b) => [b.leaf.child.name, b])).values(),
  ]) {
    const n = built.filter((b) => b.leaf.child.name === leaf.child.name).length;
    console.log(`  ${leaf.parent.name} > ${leaf.child.name}: ${n}`);
  }
  console.log("\nADMIN LOGIN");
  console.log(`  Email    : ${ADMIN_EMAIL}`);
  console.log(`  Password : ${ADMIN_PASSWORD}`);
  console.log("\nDEMO CUSTOMER LOGIN");
  console.log(`  Email    : ${DEMO_CUSTOMER_EMAIL}`);
  console.log(`  Password : ${CUSTOMER_PASSWORD}`);
  console.log(`\nAll other customers use password: ${CUSTOMER_PASSWORD}\n`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
