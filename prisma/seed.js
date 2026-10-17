// Seeds the first admin account plus dummy bakery data (Arabic). Safe to run more than once.
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

// The old English food-menu data, removed so the store shows only the bakery.
const oldCategories = ["Burgers", "Pizza", "Salads", "Desserts", "Drinks"];
const oldProducts = [
  "Classic Burger", "Cheese Burger", "Margherita Pizza", "Pepperoni Pizza",
  "Greek Salad", "Caesar Salad", "Chocolate Cake", "Fresh Orange Juice",
];

const categories = [
  { title: "كيك المناسبات", description: "كيك طازج لأعياد الميلاد والمناسبات بتصاميم مميزة", image: img("photo-1464349095431-e9a21285b5f3") },
  { title: "حلويات شرقية", description: "بقلاوة وكنافة وزلابية بالطريقة العراقية الأصيلة", image: img("photo-1519676867240-f03562e64548") },
  { title: "معجنات", description: "كرواسون وفطائر ومعجنات مخبوزة كل صباح", image: img("photo-1555507036-ab1f4038808a") },
  { title: "خبز ومخبوزات", description: "خبز طازج من التنور والفرن يومياً", image: img("photo-1509440159596-0249088772ff") },
  { title: "كوكيز وبراونيز", description: "قطع صغيرة مقرمشة وطرية تناسب الشاي والقهوة", image: img("photo-1499636136210-6f4ee915583e") },
  { title: "حلويات باردة", description: "تشيز كيك وتيراميسو وحلويات الكاسات المبردة", image: img("photo-1533134242443-d4fd215305ad") },
];

const products = [
  // كيك المناسبات
  { name: "كيك الشوكولاتة البلجيكية", category: "كيك المناسبات", price: 35000, featured: true, image: img("photo-1578985545062-69928b1d9587"),
    description: "طبقات من كيك الشوكولاتة الطري محشوة بكريمة الشوكولاتة البلجيكية ومغطاة بصوص الكناش اللامع، تكفي من ثمانية إلى عشرة أشخاص." },
  { name: "كيك الفانيلا بالفراولة", category: "كيك المناسبات", price: 30000, featured: false, image: img("photo-1565958011703-44f9829ba187"),
    description: "كيك فانيلا خفيف بطبقات من الكريمة الطازجة وقطع الفراولة، مثالي لحفلات أعياد الميلاد والمناسبات العائلية." },
  { name: "كيك الريد فيلفت", category: "كيك المناسبات", price: 32000, featured: false, image: img("photo-1586788680434-30d324b2d46f"),
    description: "كيك ريد فيلفت أحمر مخملي مع كريمة الجبن الغنية، يقدم بتزيين أنيق يناسب المناسبات الخاصة والهدايا." },
  { name: "كب كيك مشكل (6 قطع)", category: "كيك المناسبات", price: 9000, featured: false, image: img("photo-1576618148400-f54bed99fcfd"),
    description: "ست قطع كب كيك بنكهات متنوعة من الشوكولاتة والفانيلا والفراولة، مزينة بالكريمة وتناسب الضيافة والحفلات الصغيرة." },

  // حلويات شرقية
  { name: "بقلاوة بالفستق", category: "حلويات شرقية", price: 18000, featured: true, image: img("photo-1598110750624-207050c4f28c"),
    description: "بقلاوة مقرمشة من رقائق العجين الرقيقة محشوة بالفستق الحلبي ومسقية بالقطر، الكيلو الواحد طازج من الفرن." },
  { name: "كنافة بالجبن", category: "حلويات شرقية", price: 12000, featured: false, image: img("photo-1579372786545-d24232daf58c"),
    description: "كنافة ناعمة محشوة بالجبن العكاوي الذائب ومزينة بالفستق، تقدم ساخنة مع القطر حسب الرغبة لأربعة أشخاص." },
  { name: "زلابية عراقية", category: "حلويات شرقية", price: 6000, featured: false, image: img("photo-1551024601-bec78aea704b"),
    description: "زلابية عراقية ذهبية مقرمشة مقلية طازجة ومغموسة بالقطر، الحلوى المفضلة في رمضان والمناسبات، الكيلو الواحد." },
  { name: "كليجة بالتمر", category: "حلويات شرقية", price: 10000, featured: false, image: img("photo-1590080875515-8a3a8dc5735e"),
    description: "كليجة عراقية بالهيل محشوة بالتمر والجوز ومخبوزة على الطريقة البغدادية، الكيلو الواحد مناسب للعيد والضيافة." },

  // معجنات
  { name: "كرواسون بالزبدة", category: "معجنات", price: 2000, featured: true, image: img("photo-1530610476181-d83430b64dcd"),
    description: "كرواسون فرنسي هش بطبقات الزبدة الطبيعية، يخبز كل صباح ويقدم دافئاً مع القهوة أو الشاي للفطور." },
  { name: "فطيرة جبن وزعتر", category: "معجنات", price: 1500, featured: false, image: img("photo-1509365465985-25d11c17e812"),
    description: "فطيرة طرية محشوة بخليط الجبن الأبيض والزعتر البلدي وزيت الزيتون، وجبة فطور خفيفة ولذيذة لكل يوم." },
  { name: "سينابون بالقرفة", category: "معجنات", price: 3000, featured: false, image: img("photo-1509365390695-33aee754301f"),
    description: "لفائف عجين طرية بالقرفة والسكر البني مغطاة بكريمة الجبن الحلوة، تقدم ساخنة مباشرة من الفرن." },
  { name: "دونات مشكل (4 قطع)", category: "معجنات", price: 5000, featured: false, image: img("photo-1551106652-a5bcf4b29ab6"),
    description: "أربع قطع دونات طرية بتغطيات مختلفة من الشوكولاتة والفراولة والسكر الناعم، محبوبة عند الصغار والكبار." },

  // خبز ومخبوزات
  { name: "خبز تنور (10 أرغفة)", category: "خبز ومخبوزات", price: 2500, featured: false, image: img("photo-1549931319-a545dcf3bc73"),
    description: "عشرة أرغفة من خبز التنور العراقي الطازج، مخبوز على الحطب بالطريقة التقليدية ومناسب لكل الوجبات اليومية." },
  { name: "صمون حجري", category: "خبز ومخبوزات", price: 1000, featured: false, image: img("photo-1608198093002-ad4e005484ec"),
    description: "صمون عراقي حجري مقرمش من الخارج وطري من الداخل، يخبز على مدار اليوم ويباع بالكيس الصغير." },
  { name: "خبز الحبوب الكاملة", category: "خبز ومخبوزات", price: 3500, featured: false, image: img("photo-1509440159596-0249088772ff"),
    description: "رغيف خبز صحي من دقيق القمح الكامل مع بذور الشوفان والكتان، غني بالألياف ومناسب للحمية الغذائية." },

  // كوكيز وبراونيز
  { name: "كوكيز بقطع الشوكولاتة", category: "كوكيز وبراونيز", price: 7000, featured: false, image: img("photo-1558961363-fa8fdf82db35"),
    description: "علبة كوكيز أمريكية مقرمشة الأطراف وطرية من الوسط مع قطع الشوكولاتة الكبيرة، تحتوي على عشر قطع." },
  { name: "براونيز بالجوز", category: "كوكيز وبراونيز", price: 8000, featured: true, image: img("photo-1606313564200-e75d5e30476c"),
    description: "مربعات براونيز غنية بالشوكولاتة الداكنة وقطع الجوز المحمص، قوامها كثيف وطري، العلبة تحتوي على ست قطع." },
  { name: "معمول بالتمر والجوز", category: "كوكيز وبراونيز", price: 11000, featured: false, image: img("photo-1607920591413-4ec007e70023"),
    description: "معمول منزلي بالسميد والسمن محشو بالتمر أو الجوز ومرشوش بالسكر الناعم، الكيلو الواحد للعيد والضيافة." },

  // حلويات باردة
  { name: "تشيز كيك التوت", category: "حلويات باردة", price: 25000, featured: false, image: img("photo-1533134242443-d4fd215305ad"),
    description: "تشيز كيك نيويورك الكريمي على قاعدة البسكويت المقرمشة مع صوص التوت البري، يقدم بارداً ويكفي ثمانية أشخاص." },
  { name: "تيراميسو إيطالي", category: "حلويات باردة", price: 6000, featured: false, image: img("photo-1571877227200-a0d98ea607e9"),
    description: "طبقات من بسكويت السافوياردي المنقوع بالقهوة مع كريمة الماسكاربوني والكاكاو، حلوى إيطالية كلاسيكية بالكاسة الفردية." },
  { name: "كاسة المهلبية بالفستق", category: "حلويات باردة", price: 3000, featured: false, image: img("photo-1488477181946-6428a0291777"),
    description: "مهلبية ناعمة بماء الورد والهيل مزينة بالفستق المطحون، حلوى شرقية خفيفة ومنعشة تقدم باردة بعد الأكل." },
];

const reviews = [
  { product: "كيك الشوكولاتة البلجيكية", rating: 5, comment: "أطيب كيك شوكولاتة جربته، طازج والكل بالحفلة عجبهم." },
  { product: "بقلاوة بالفستق", rating: 5, comment: "البقلاوة مقرمشة والفستق كثير، تستاهل كل دينار." },
  { product: "كرواسون بالزبدة", rating: 4, comment: "كرواسون هش وريحته زبدة، بس أتمنى يكون أكبر شوية." },
  { product: "براونيز بالجوز", rating: 5, comment: "براونيز طري وغني بالشوكولاتة، صار طلبي الأسبوعي." },
  { product: "زلابية عراقية", rating: 4, comment: "ذكرتني بزلابية رمضان أيام زمان، طعمها أصلي." },
];

async function main() {
  const { ADMIN_NAME = "مدير المخبز", ADMIN_EMAIL = "admin@example.com", ADMIN_PASSWORD = "Admin12345" } = process.env;

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "ADMIN" },
    create: { name: ADMIN_NAME, email: ADMIN_EMAIL, password: await bcrypt.hash(ADMIN_PASSWORD, 10), role: "ADMIN" },
  });

  const customer = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: { name: "زبون تجريبي", email: "user@example.com", password: await bcrypt.hash("User12345", 10) },
  });

  await prisma.product.deleteMany({ where: { name: { in: oldProducts } } });
  await prisma.category.deleteMany({ where: { title: { in: oldCategories } } });

  const categoryIds = {};
  for (const { title, ...data } of categories) {
    const category = await prisma.category.upsert({
      where: { title },
      update: {},
      create: { title, ...data, userId: admin.id },
    });
    categoryIds[title] = category.id;
  }

  const productIds = {};
  for (const { category, ...data } of products) {
    const existing = await prisma.product.findFirst({ where: { name: data.name } });
    const product =
      existing ||
      (await prisma.product.create({
        data: { ...data, userId: admin.id, categoryId: categoryIds[category] },
      }));
    productIds[data.name] = product.id;
  }

  for (const name of Object.keys(productIds).slice(0, 3)) {
    await prisma.favorite.upsert({
      where: { userId_productId: { userId: customer.id, productId: productIds[name] } },
      update: {},
      create: { userId: customer.id, productId: productIds[name] },
    });
  }

  for (const { product, ...data } of reviews) {
    const productId = productIds[product];
    const exists = await prisma.review.findFirst({ where: { userId: customer.id, productId } });
    if (!exists) await prisma.review.create({ data: { ...data, userId: customer.id, productId } });
  }

  console.log(
    `Seeded: ${categories.length} categories, ${products.length} products, ${reviews.length} reviews\n` +
      `  admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}\n  user:  user@example.com / User12345`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
