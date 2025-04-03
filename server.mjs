import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Konfigurasi multer untuk Cloudinary
const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "uploads",
      allowed_formats: ["jpg", "webp", "png", "mp4"]
    }
  })
});

app.use(express.json());
const GAS_URL = process.env.GAS_URL;

// API Submit Form
app.post("/upload", upload.single("media"), async (req, res) => {
  if (!req.body.nama)
    return res
      .status(400)
      .json({ error: "Nama nya jangan dikosongin ya baby" });
  if (!req.body.pesan)
    return res
      .status(400)
      .json({ error: "Masa iya kirim ginian pesannya kosong sih baby" });

  const data = {
    nama: req.body.nama,
    pesan: req.body.pesan,
    file: req.file?.path || null
  };

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    res.json({
      balasan: "Sudah terkikirim, thankyou baby",
      response: await response.json()
    });
  } catch {
    res.status(500).json({ error: "Gagal menyimpan data ke google sheet" });
  }
});

app.listen(port, () => console.log(`Server berjalan di port ${port}`));
