const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { nanoid } = require('nanoid');
const Url = require('./models/Url');

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const urls = await Url.find().sort({ createdAt: -1 });
  res.render('index', { urls, baseUrl: process.env.BASE_URL });
});

app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const shortId = nanoid(6);
  const url = new Url({ longUrl, shortId });
  await url.save();
  res.redirect('/');
});

app.get('/:shortId', async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId });
  if (!url) return res.sendStatus(404);
  url.clicks++;
  await url.save();
  res.redirect(url.longUrl);
});

app.post('/delete/:id', async (req, res) => {
  await Url.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Add this route to return all shortened links as JSON
app.get("/api/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
