// Pointing to the .env file in the parent directory
require('dotenv').config({ path: '../.env' }); 
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Verify that the URI is loaded before connecting
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in your .env file.");
  process.exit(1);
}

console.log("📦 Seeding products to MongoDB Atlas...");

// Array of products with album details
const productsData = [
  // ALBUMS - With specific details
  {
    name: "The Echoes Of The West",
    price: 35.00,
    category: "ALBUMS",
    description: "Official audio record masterclass edition. A journey through the western echoes of sound and culture.",
    image: "https://via.placeholder.com/400x400/000/fff?text=Echoes+Of+The+West",
    albumDetails: {
      tracklist: [
        { 
          title: "Introduction: The West Echoes", 
          duration: "3:45",
          artist: "Robin Chand Thakuri"
        },
        { 
          title: "Masterclass Anthem", 
          duration: "4:12",
          artist: "Robin Chand Thakuri"
        },
        { 
          title: "Outro: Final Legacy", 
          duration: "2:50",
          artist: "Robin Chand Thakuri"
        }
      ],
      youtubeLink: "https://www.youtube.com/watch?v=Ri3JuT-MquA",
      releaseYear: "2024",
      label: "BartKush Records"
    }
  },
  {
    name: "Multiple Genre Disorder, VOL1",
    price: 25.00,
    category: "ALBUMS", 
    description: "Official studio record masterclass release. A fusion of multiple genres in one masterpiece.",
    image: "/src/assets/multiple-genre-disorder.jpg",
    albumDetails: {
      tracklist: [
        { 
          title: "Khaali Timi, Ma", 
          duration: "4:20",
          artist: "Robin Chand Thakuri",
          views: "7.7k views • 3 years ago",
          audioFile: "/src/assets/music/ayushmafinal.mp3",
          youtubeLink: "https://www.youtube.com/watch?v=hWIT38ST5fU"
        },
        { 
          title: "KINA KINA", 
          duration: "3:55",
          artist: "Robin Chand Thakuri",
          views: "13k views • 3 years ago",
          audioFile: "/src/assets/music/ayushmafinalsolowala.mp3",
          youtubeLink: "https://www.youtube.com/watch?v=Zq_HlGjXJL4"
        },
        { 
          title: "Aayushma (Official Audio)", 
          duration: "5:10",
          artist: "Robin Chand Thakuri",
          views: "639 views • 3 years ago",
          audioFile: "/src/assets/music/khalisong.mp3",
          youtubeLink: "https://www.youtube.com/watch?v=21kwnQrEfhU"
        },
        { 
          title: "Aayushma (Alternative Intro Version)", 
          duration: "4:45",
          artist: "Robin Chand Thakuri",
          views: "253 views • 3 years ago",
          audioFile: "/src/assets/music/kinatwkkushalrecordsfinal.mp3",
          youtubeLink: "https://www.youtube.com/watch?v=5m5t42QjNog"
        }
      ],
      youtubeLink: "https://www.youtube.com/watch?v=Zq_HlGjXJL4",
      releaseYear: "2024",
      label: "BartKush Records"
    }
  },
  
  // T-SHIRTS
  {
    name: "Masterclass Heavyweight Vintage Tee",
    price: 45.00,
    category: "T-SHIRTS",
    description: "Premium garment-dyed cotton streetwear tee.",
    image: "https://via.placeholder.com/400x400/000/fff?text=T-Shirt"
  },
  {
    name: "Limited Edition Hoodie",
    price: 55.00,
    category: "T-SHIRTS",
    description: "Premium quality hoodie with BartKush logo.",
    image: "https://via.placeholder.com/400x400/000/fff?text=Hoodie"
  },
  
  // CAPS
  {
    name: "BartKush Signature Embroidered Cap",
    price: 30.00,
    category: "CAPS",
    description: "Structured premium headwear with high-density embroidery.",
    image: "https://via.placeholder.com/400x400/000/fff?text=Cap"
  },
  {
    name: "Limited Edition Snapback",
    price: 32.00,
    category: "CAPS",
    description: "Classic snapback with BartKush logo.",
    image: "https://via.placeholder.com/400x400/000/fff?text=Snapback"
  },
  
  // JEWELRIES
  {
    name: "BartKush Gold Masterclass Pendant",
    price: 65.00,
    category: "JEWELRIES",
    description: "Custom engraved signature jewelry piece with elite finish.",
    image: "https://via.placeholder.com/400x400/000/fff?text=Gold+Pendant"
  },
  {
    name: "Silver BartKush Chain",
    price: 45.00,
    category: "JEWELRIES",
    description: "Premium sterling silver chain with BartKush emblem.",
    image: "https://via.placeholder.com/400x400/000/fff?text=Silver+Chain"
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB for seeding...");
    
    const deleted = await Product.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing products`);
    
    const inserted = await Product.insertMany(productsData);
    console.log(`✅ Inserted ${inserted.length} products`);
    
    const albums = productsData.filter(p => p.category === "ALBUMS");
    console.log(`\n🎵 ${albums.length} Albums added:`);
    albums.forEach(p => {
      console.log(`  - ${p.name} ($${p.price})`);
      console.log(`    Tracklist: ${p.albumDetails.tracklist.length} tracks`);
      console.log(`    YouTube: ${p.albumDetails.youtubeLink}`);
      console.log(`    Label: ${p.albumDetails.label}`);
      console.log(`    Image: ${p.image}`);
    });
    
    const tShirts = productsData.filter(p => p.category === "T-SHIRTS");
    const caps = productsData.filter(p => p.category === "CAPS");
    const jewelries = productsData.filter(p => p.category === "JEWELRIES");
    
    console.log(`\n👕 ${tShirts.length} T-Shirts added`);
    tShirts.forEach(p => console.log(`  - ${p.name} ($${p.price})`));
    
    console.log(`\n🧢 ${caps.length} Caps added`);
    caps.forEach(p => console.log(`  - ${p.name} ($${p.price})`));
    
    console.log(`\n💎 ${jewelries.length} Jewelries added`);
    jewelries.forEach(p => console.log(`  - ${p.name} ($${p.price})`));
    
    console.log("\n✅ All products added successfully!");
    console.log("📊 Total products:", inserted.length);
    
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Could not connect to MongoDB:", err);
    process.exit(1);
  });