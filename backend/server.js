const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Car = require("./models/Car");
const Brand = require("./models/Brand");
const Type = require("./models/Type");

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed!"), false);
    }
  }
});

const carMediaUpload = upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "video", maxCount: 1 }
]);

// Function to save base64 string as file
function saveBase64AsFile(base64String, prefix) {
  if (!base64String || !base64String.startsWith("data:")) {
    return base64String; // Return as is if not base64
  }
  try {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches) {
      return base64String;
    }
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const extension = mimeType.split('/')[1];
    const filename = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error saving base64 as file:", error);
    return base64String; // Fallback to original
  }
}

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// Migration function to convert base64 images/videos to files
async function migrateBase64ToFiles() {
  try {
    const cars = await Car.find({});
    for (const car of cars) {
      let updated = false;
      if (car.images && Array.isArray(car.images)) {
        car.images = car.images.map((img, index) => {
          if (img && img.startsWith("data:")) {
            updated = true;
            return saveBase64AsFile(img, `migrated-image${index + 1}`);
          }
          return img;
        });
      }
      if (car.video && car.video.startsWith("data:")) {
        car.video = saveBase64AsFile(car.video, 'migrated-video');
        updated = true;
      }
      if (car.videos && Array.isArray(car.videos)) {
        car.videos = car.videos.map((vid, index) => {
          if (vid && vid.startsWith("data:")) {
            updated = true;
            return saveBase64AsFile(vid, `migrated-video${index + 1}`);
          }
          return vid;
        });
      }
      if (updated) {
        await car.save();
        console.log(`Migrated car ${car._id}`);
      }
    }
    console.log("Migration completed");
  } catch (error) {
    console.error("Migration error:", error);
  }
}

const DB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/carDB";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "DIBU";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "DIBU237";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "under2k-admin-token";

// Email configuration - Replace with your real email settings
const EMAIL_USER = process.env.EMAIL_USER || "your-email@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "your-app-password";
const EMAIL_TO = process.env.EMAIL_TO || "your-real-email@example.com";

// Helper function to detect video URLs
function isVideoUrl(url) {
  const videoPatterns = [
    /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv|3gp)$/i,  // Direct video files
    /(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com|twitch\.tv)/i,  // Video platforms
    /\/videos?\//i,  // Common video path patterns
    /embed\//i  // Embed patterns
  ];
  return videoPatterns.some(pattern => pattern.test(url));
}

function normalizeCar(carDoc) {
  const car = carDoc.toObject ? carDoc.toObject() : carDoc;
  const { _id, __v, ...rest } = car;
  return {
    id: _id ? _id.toString() : rest.id,
    ...rest
  };
}

async function seedDefaultCars() {
  const count = await Car.countDocuments();
  if (count > 0) {
    return;
  }

  const defaultCars = [
    {
      name: "Model S Plaid",
      brand: "Tesla",
      price: 89990,
      year: 2024,
      mileage: "5,000 mi",
      type: "Electric",
      transmission: "Tri Motor All-Wheel Drive",
      fuelType: "Electric",
      color: "Pearl White",
      horsepower: "1,020 hp",
      topSpeed: "200 mph",
      acceleration: "0-60 mph in 1.99s",
      description: "Experience the pinnacle of electric performance with all-wheel-drive traction, Plaid badges, and a serene cabin.",
      specs: "",
      features: ["396 miles range", "Autopilot 2.0", "Premium sound"],
      images: [
        "https://images.unsplash.com/photo-1764307372847-0ec0b637bbd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGVsZWN0cmljJTIwY2FyJTIwbW9kZXJufGVufDF8fHx8MTc3NDcxNjQwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1549924231-f129b911e442?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8Mnx8c2luZ3xlbnwwfHx8fDE2OTUyOTU3Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      videos: [],
      video: ""
    },
    {
      name: "AMG GT",
      brand: "Mercedes-Benz",
      price: 118600,
      year: 2024,
      mileage: "2,000 mi",
      type: "Sports",
      transmission: "8-Speed Automatic",
      fuelType: "Gasoline",
      color: "Obsidian Black",
      horsepower: "523 hp",
      topSpeed: "193 mph",
      acceleration: "0-60 mph in 3.5s",
      description: "A sublime sports coupe with sculpted lines, active aerodynamics, and track-caliber handling every weekend.",
      specs: "",
      features: ["4.0L V8 Biturbo", "Active suspension", "Carbon ceramic brakes"],
      images: [
        "https://images.unsplash.com/photo-1771210353591-20006eba7ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwYmxhY2slMjBzZWRhbiUyMGF1dG9tb3RpdmV8ZW58MXx8fHwxNzc0NzE2NDA3fDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1615133847765-7d35f2addc7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyJTIwZGVzaWduJTJDbWVyY2VkZXMlMjBiZW56fGVufDF8fHx8MTc4Nzk3NzM0Nnxu&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      videos: [],
      video: ""
    },
    {
      name: "Range Rover Sport",
      brand: "Land Rover",
      price: 83000,
      year: 2024,
      mileage: "8,500 mi",
      type: "SUV",
      transmission: "8-speed Automatic",
      fuelType: "Gasoline",
      color: "Santorini Black",
      horsepower: "518 hp",
      topSpeed: "176 mph",
      acceleration: "0-60 mph in 4.3s",
      description: "A commanding SUV that blends luxury seating, off-road capability, and responsive V8 swagger.",
      specs: "",
      features: ["Terrain Response", "Adaptive air suspension", "Heated seats"],
      images: [
        "https://images.unsplash.com/photo-1767749995450-7b63ab7cd4fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBTVVYlMjB2ZWhpY2xlfGVufDF8fHx8MTc3NDY2MzM2OXww&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1613780779252-cd07e53ab3b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbGVuZHJvdmVyJTIwc3BvcnR8ZW58MXx8fHwxNjk1NDM4MDY1fDA&ixlib=rb-4.1.0&q=80&w=1080"
      ],
      videos: [],
      video: ""
    },
    {
      name: "911 Turbo S",
      brand: "Porsche",
      price: 207000,
      year: 2024,
      mileage: "1,200 mi",
      type: "Sports",
      transmission: "8-speed PDK",
      fuelType: "Gasoline",
      color: "Carmine Red",
      horsepower: "640 hp",
      topSpeed: "205 mph",
      acceleration: "0-60 mph in 2.6s",
      description: "Iconic engineering, rear-engine balance, and a twin-turbo roar make this the ultimate autobahn machine.",
      specs: "",
      features: ["Porsche Active Suspension Management", "Ceramic brakes", "Adaptive aerodynamics"],
      images: [
        "https://images.unsplash.com/photo-1769869263342-b36777a32747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBzcG9ydHMlMjBjYXIlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NzQ3MTY0MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NzZ8MHwxfHNlYXJjaHwxfHxwb3JzY2hlJTIwOTExfGVufDB8fHx8MTY5NTY0OTU3OA&ixlib=rb-4.0.3&q=80&w=1080"
      ],
      videos: ["https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"],
      video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    },
    {
      name: "S-Class Coupe",
      brand: "Mercedes-Benz",
      price: 112000,
      year: 2024,
      mileage: "3,800 mi",
      type: "Luxury",
      transmission: "9-speed Automatic",
      fuelType: "Gasoline",
      color: "Obsidian Black",
      horsepower: "496 hp",
      topSpeed: "155 mph",
      acceleration: "0-60 mph in 4.3s",
      description: "Sculpted lines, a serene cabin, and executive-grade tech make every drive effortless.",
      specs: "",
      features: ["E-Active Body Control", "Executive rear seats", "Burmeister audio"],
      images: [
        "https://images.unsplash.com/photo-1761139844220-388b0432d675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBjb3VwZSUyMGx1eHVyeXxlbnwxfHx8fDE3NzQ3MTY0MDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NzZ8MHwxfHNlYXJjaHwxfHxzJTIwY2xhc3N8ZW58MHx8fHwxNjk1NjUwMDky&ixlib=rb-4.0.3&q=80&w=1080"
      ],
      videos: [],
      video: ""
    },
    {
      name: "Z4 M40i",
      brand: "BMW",
      price: 66700,
      year: 2024,
      mileage: "6,200 mi",
      type: "Convertible",
      transmission: "8-speed Automatic",
      fuelType: "Gasoline",
      color: "Portimao Blue",
      horsepower: "382 hp",
      topSpeed: "155 mph",
      acceleration: "0-60 mph in 4.4s",
      description: "A lightweight roadster with aggressive styling, adaptive suspension, and an engaging inline-six note.",
      specs: "",
      features: ["M Sport differential", "Adaptive LED headlights", "Harman Kardon audio"],
      images: [
        "https://images.unsplash.com/photo-1659890063603-708fd0473544?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwY29udmVydGlibGUlMjBjYXJ8ZW58MXx8fHwxNzc0NjU1NDUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NzZ8MHwxfHNlYXJjaHwxfHxibXclMjB6NHxlbnwwfHx8fDE2OTU2MDQ1ODU&ixlib=rb-4.0.3&q=80&w=1080"
      ],
      videos: [],
      video: ""
    }
  ];

  await Car.insertMany(defaultCars);
  console.log("Seeded default cars into MongoDB.");
}

async function seedDefaultBrandsAndTypes() {
  const brandCount = await Brand.countDocuments();
  const typeCount = await Type.countDocuments();

  if (brandCount === 0) {
    const defaultBrands = [
      { name: "Tesla" },
      { name: "Mercedes-Benz" },
      { name: "Land Rover" },
      { name: "Porsche" },
      { name: "BMW" }
    ];
    await Brand.insertMany(defaultBrands);
    console.log("Seeded default brands into MongoDB.");
  }

  if (typeCount === 0) {
    const defaultTypes = [
      { name: "Electric" },
      { name: "Sports" },
      { name: "SUV" },
      { name: "Luxury" },
      { name: "Convertible" }
    ];
    await Type.insertMany(defaultTypes);
    console.log("Seeded default types into MongoDB.");
  }
}

const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["x-admin-token"];
  const token = authHeader && authHeader.toString().startsWith("Bearer ")
    ? authHeader.toString().slice(7)
    : authHeader;

  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

mongoose.connect(DB_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await seedDefaultCars();
    await migrateBase64ToFiles();
    // await seedDefaultBrandsAndTypes();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/admin-validate", adminAuthMiddleware, (req, res) => {
  res.json({ ok: true });
});

app.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find().lean();
    const normalized = cars.map((car) => normalizeCar(car));
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/cars/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).lean();
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json(normalizeCar(car));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/add-car", adminAuthMiddleware, carMediaUpload, async (req, res) => {
  try {
    console.log("Files received at /add-car:", req.files);
    const carData = { ...req.body };
    const image1 = req.files && req.files.image1 && req.files.image1[0];
    const image2 = req.files && req.files.image2 && req.files.image2[0];
    const videoFile = req.files && req.files.video && req.files.video[0];

    const uploadedImages = [];
    if (image1) {
      uploadedImages.push(`/uploads/${image1.filename}`);
    }
    if (image2) {
      uploadedImages.push(`/uploads/${image2.filename}`);
    }
    const uploadedVideo = videoFile ? `/uploads/${videoFile.filename}` : "";

    carData.images = uploadedImages;
    carData.video = uploadedVideo;
    carData.videos = uploadedVideo ? [uploadedVideo] : [];
    carData.features = carData.features
      ? Array.isArray(carData.features)
        ? carData.features
        : JSON.parse(carData.features)
      : [];

    const newCar = new Car(carData);
    await newCar.save();
    res.json(normalizeCar(newCar));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/edit-car/:id", adminAuthMiddleware, carMediaUpload, async (req, res) => {
  try {
    console.log("Files received at /edit-car:", req.files);
    const carData = { ...req.body };
    const image1 = req.files && req.files.image1 && req.files.image1[0];
    const image2 = req.files && req.files.image2 && req.files.image2[0];
    const videoFile = req.files && req.files.video && req.files.video[0];

    const uploadedImages = [];
    if (image1) {
      uploadedImages.push(`/uploads/${image1.filename}`);
    }
    if (image2) {
      uploadedImages.push(`/uploads/${image2.filename}`);
    }
    const uploadedVideo = videoFile ? `/uploads/${videoFile.filename}` : "";

    const existingCar = await Car.findById(req.params.id);
    if (!existingCar) {
      return res.status(404).json({ error: "Car not found" });
    }

    const existingImages = existingCar.images || [];
    const existingVideo = existingCar.video || (existingCar.videos && existingCar.videos[0]) || "";
    let finalImages = uploadedImages.length > 0 ? uploadedImages : existingImages.map((img, index) => saveBase64AsFile(img, `image${index + 1}`));
    let finalVideo = uploadedVideo || saveBase64AsFile(existingVideo, 'video');

    carData.images = finalImages;
    carData.video = finalVideo;
    carData.videos = finalVideo ? [finalVideo] : [];
    carData.features = carData.features
      ? Array.isArray(carData.features)
        ? carData.features
        : JSON.parse(carData.features)
      : [];

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, carData, {
      new: true,
      runValidators: true
    });
    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.json(normalizeCar(updatedCar));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/delete-car/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Delete uploaded files from filesystem
    const allMedia = [...(car.images || []), ...(car.videos || []), car.video].filter(Boolean);
    allMedia.forEach(mediaUrl => {
      if (mediaUrl && mediaUrl.includes('/uploads/')) {
        const filename = mediaUrl.split('/uploads/')[1];
        if (filename) {
          const filePath = path.join(uploadsDir, filename);
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (err) {
            console.warn("Failed to delete file:", filePath, err);
          }
        }
      }
    });

    await Car.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Brand routes
app.get("/brands", (req, res) => {
  res.json([{ id: "1", name: "Test Brand" }]);
});

app.post("/add-brand", adminAuthMiddleware, async (req, res) => {
  try {
    const newBrand = new Brand(req.body);
    await newBrand.save();
    res.json(normalizeCar(newBrand));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/edit-brand/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json(normalizeCar(updatedBrand));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/delete-brand/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const removed = await Brand.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Type routes
app.get("/types", async (req, res) => {
  try {
    const types = await Type.find();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/add-type", adminAuthMiddleware, async (req, res) => {
  try {
    const newType = new Type(req.body);
    await newType.save();
    res.json(normalizeCar(newType));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/edit-type/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const updatedType = await Type.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedType) {
      return res.status(404).json({ error: "Type not found" });
    }
    res.json(normalizeCar(updatedType));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/delete-type/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const removed = await Type.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: "Type not found" });
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contact form email
app.post("/contact", async (req, res) => {
  const { fullName, email, message } = req.body;
  if (!fullName || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_TO,
      subject: "New Contact Form Submission from Under2K Motors",
      text: `Name: ${fullName}\nEmail: ${email}\nMessage: ${message}`
    });
    res.json({ ok: true });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
