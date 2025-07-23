// server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import nodemailer from 'nodemailer';
// import xss from 'xss-clean';

// Models
import Blog from './Models/Blogs.js';
import AskQuery from './Models/AskQuery.js';
import Newsletter from './Models/Newsletter.js';
import Product from './Models/Product.js';
import Contact from './Models/Contact.js';
import Service from './Models/Service.js'; // ✅ ADDED
import Quote from './Models/Quote.js';
import HospitalCard from './Models/HospitalsCards.js'; // ✅ ADDED

// __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📂 'uploads' folder created");
}

// Express setup
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const allowedOrigins = [
  'https://globaljpkp20caresurgisals746jj.firebaseapp.com',
  'https://globaljpkp20caresurgisals746jj.web.app',
  'https://globalcaresurgical.in',
  'https://secureapi-b8p3vzk19x.globalcaresurgical.in',
  'https://global-care-surgicals-user-app.firebaseapp.com'
];

// CORS middleware setup
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});


app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Security middlewares
app.use(helmet());
// app.use(xss());


app.get('/', (req, res) => {
  res.send('✅ GlobalCare API is running');
});

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/GlobalCare')
  .then(() => console.log('✅ MongoDB connected to GlobalCare DB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max file size
  },
});


const sendNewsletterWelcomeEmail = async (subscriberEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'donotreply.globalcaresurgicals@gmail.com',  // ✅ Your Gmail
        pass: 'ofqm ykjy pnaf lgqz',          // ✅ App Password
      },
    });

    const mailOptions = {
      from: '"Global Care Surgicals" <office@globalcaresurgicals.in>',
      to: subscriberEmail,
      subject: 'Thank you for subscribing to Global Care Surgicals!',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #007bff;">🌟 Welcome to Global Care Surgicals!</h2>
          <p>Hi there,</p>
          <p>Thank you for subscribing to our newsletter! We're thrilled to have you on board.</p>
          <p>Stay tuned for updates on our latest surgical innovations, cleanroom solutions, and healthcare infrastructure services.</p>
          <a href="https://www.globalcaresurgicals.in" style="display:inline-block; margin: 15px 0; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Visit Our Website
          </a>
          <p>Warm regards,<br>Team Global Care Surgicals</p>
          <hr>
          <p style="font-size: 12px; color: #999;">This email was sent by office@globalcaresurgicals.in</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Welcome email sent to ${subscriberEmail}`);
  } catch (error) {
    console.error('❌ Failed to send newsletter email:', error.message);
  }
};


// ===== BLOG ROUTES =====
app.post('/api/blogs', upload.single('image'), async (req, res) => {
  try {
    const { title, tagline, dateTime, location, mapLink } = req.body;
    const image = req.file?.filename || '';
    const blog = new Blog({ title, tagline, dateTime, location, mapLink, image });
    await blog.save();
    res.json({ success: true, blog });
  } catch (err) {
    console.error("❌ Error creating blog:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (blog?.image) {
      const filePath = path.join(uploadDir, blog.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ASK US ANYTHING =====
app.post('/api/ask-query', async (req, res) => {
  try {
    const { name, mobile, email, query } = req.body;
    const newQuery = new AskQuery({ name, mobile, email, query });
    await newQuery.save();
    res.status(201).json({ message: 'Query saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/ask-query', async (req, res) => {
  try {
    const queries = await AskQuery.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch queries' });
  }
});

// ===== NEWSLETTER =====
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    const newSubscription = new Newsletter({ email });
    await newSubscription.save();

    // 💌 Send email in background
    setImmediate(() => {
      sendNewsletterWelcomeEmail(email);
    });

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('❌ Newsletter subscribe error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'donotreply.globalcaresurgicals@gmail.com',
    pass: 'orpb snkv fwcl zagq', // Don't use .env, directly paste if you prefer
  },
});

app.post('/api/sendNewsletter', async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message are required' });
  }

  try {
    const subscribers = await Newsletter.find({}, 'email');
    const emails = subscribers.map(sub => sub.email);

    const mailOptions = {
      from: 'office@globalcaresurgicals.in',
      bcc: emails, // 👈 BCC hides emails from each other
      subject: subject,
      html: `<p>${message}</p><br><p>Visit us at <a href="https://www.globalcaresurgicals.in">globalcaresurgicals.in</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Newsletter sent to all subscribers!' });
  } catch (error) {
    console.error('Bulk newsletter send error:', error.message);
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
});



app.get('/api/newsletter', async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== PRODUCTS =====
app.post('/api/products', upload.array('images', 4), async (req, res) => {
  try {
    const {
      name, category, rating, description,
      material, dimensions, ventilation, reusable,
      details,
    } = req.body;

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    const product = new Product({
      name,
      category,
      rating,
      description,
      details,
      material,
      dimensions,
      ventilation,
      reusable,
      images: imagePaths,
    });

    await product.save();
    res.status(201).json({ message: 'Product saved successfully', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product?.images?.length) {
      product.images.forEach((imgPath) => {
        const fullPath = path.join(__dirname, imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products/:id/review', async (req, res) => {
  const { name, email, comment, rating } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.reviews = product.reviews || [];
    product.reviews.push({ name, email, comment, rating, date: new Date().toISOString().slice(0, 10) });

    if (product.reviews.length > 5) {
      product.reviews = product.reviews.slice(-5);
    }

    await product.save();
    res.json({ message: 'Review submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ===== CONTACT =====
// API: Save contact and send email
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save to MongoDB
    const contact = new Contact({ name, email, phone });
    await contact.save();

    // Send auto email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or 'smtp.hostinger.com' if using Hostinger
      auth: {
        user: 'donotreply.globalcaresurgicals@gmail.com',
        pass: 'uqpe miao ixda nqbi', // use App Password or SMTP password
      },
    });

    const mailOptions = {
      from: '"Global Care Surgicals" <office@globalcaresurgicals.in>',
      to: email,
      subject: 'Thanks for Contacting Global Care Surgicals!',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
          <h2 style="color: #007B8F;">Hello ${name},</h2>
          <p>Thank you for reaching out to <strong>Global Care Surgicals</strong>. We’ve received your request and one of our representatives will get in touch with you shortly.</p>

          <p>📞 <strong>Your Provided Number:</strong> ${phone}</p>
          <p>📱 <strong>Contact Us Directly:</strong> <a href="tel:+919483175375">94831 75375</a></p>
          <p>🌐 Visit us at: <a href="https://globalcaresurgical.in" target="_blank">globalcaresurgical.in</a></p>

          <br/>
          <p>Regards,<br/>
          <strong>Team Global Care Surgicals</strong><br/>
          <a href="mailto:office@globalcaresurgicals.in">office@globalcaresurgicals.in</a></p>

          <hr style="margin-top: 30px;" />
          <p style="font-size: 12px; color: #999;">This is an automated message. Please do not reply.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Contact saved and email sent successfully' });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== SERVICES =====
app.post('/api/services', upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'brochure', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, description, specs, features } = req.body;

    const images = (req.files['images'] || []).map(f => `/uploads/${f.filename}`);
    const brochure = req.files['brochure']?.[0]?.filename;

    const newService = new Service({
      title,
      description,
      specs: JSON.parse(specs),
      features: JSON.parse(features),
      brochure: brochure ? `/uploads/${brochure}` : '',
      images,
    });

    await newService.save();
    res.status(201).json({ message: 'Service created', service: newService });
  } catch (err) {
    console.error('❌ Error saving service:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    if (service.images?.length) {
      service.images.forEach(img => {
        const fullPath = path.join(__dirname, img);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    if (service.brochure) {
      const pdfPath = path.join(__dirname, service.brochure);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add review to a service
app.post('/api/services/:id/review', async (req, res) => {
  try {
    const { name, comment, rating } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    service.reviews = service.reviews || [];
    service.reviews.push({
      name,
      comment,
      rating,
      date: new Date().toISOString().slice(0, 10),
    });

    if (service.reviews.length > 5) {
      service.reviews = service.reviews.slice(-5); // Keep only last 5
    }

    await service.save();
    res.json({ message: 'Review submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// mail with book a quote 
app.post('/api/quotes', async (req, res) => {
  try {
    const { name, email, phone, product, quoteMessage } = req.body;

    // 1. Save to MongoDB
    const newQuote = new Quote({ name, email, phone, product, quoteMessage });
    await newQuote.save();

    // 2. Send Email Notification
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'donotreply.globalcaresurgicals@gmail.com',           // replace with your Gmail
        pass: 'lohn plzg aelf xcms',              // must use App Password if 2FA enabled
      },
    });

    const mailOptions = {
      from: 'your_email@gmail.com',
      to: email, // or a fixed admin email like 'globalcare@gmail.com'
      subject: 'Quote Request Received – Global Care Surgicals',
      html: `
        <h2>Thank You, ${name}!</h2>
        <p>We’ve received your quote request for <strong>${product}</strong>.</p>
        <p>Our team will reach out to you soon at <strong>${phone}</strong>.</p>
        <br/>
        <p><em>Your message:</em> ${quoteMessage}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Quote saved and email sent successfully' });

  } catch (error) {
    console.error('Quote Error:', error);

    // More specific message for email auth issues
    if (error.code === 'EAUTH') {
      return res.status(500).json({ error: 'Email authentication failed. Please check credentials.' });
    }

    res.status(500).json({ error: 'Failed to save quote or send email' });
  }
});


// ✅ GET all quote submissions
app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 }); // newest first
    res.json(quotes);
  } catch (err) {
    console.error('❌ Error fetching quotes:', err);
    res.status(500).json({ error: 'Server error while fetching quotes.' });
  }
});

// POST: Add Hospital Card
app.post("/api/hospitals", async (req, res) => {
  try {
    const { name, location, description, moreLink } = req.body;

    if (!name || !location || !description) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const newHospital = new HospitalCard({
      name,
      location,
      description,
      moreLink
    });

    await newHospital.save();
    res.status(201).json({ message: "Hospital card saved successfully" });
  } catch (error) {
    console.error("Error saving hospital:", error);
    res.status(500).json({ error: "Server error while saving hospital" });
  }
});

app.get("/api/hospitals", async (req, res) => {
  try {
    const hospitals = await HospitalCard.find().sort({ _id: -1 });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hospital cards" });
  }
});


app.delete("/api/hospitals/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await HospitalCard.findByIdAndDelete(id);
    res.status(200).json({ message: "Hospital card deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hospital card" });
  }
});




// ===== START SERVER =====
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});