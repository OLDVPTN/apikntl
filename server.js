const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Koneksi ke MongoDB
mongoose.connect('mongodb+srv://dbPoko:pokocompany@dbeventpoko.w5k59.mongodb.net/?retryWrites=true&w=majority&appName=DBEVENTPOKO', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Definisikan schema untuk data user
const browserSchema = new mongoose.Schema({
    name: String,
    version: String,
});

const userInfoSchema = new mongoose.Schema({
    ip: String,
    isp: String,
    country: String,
    city: String,
    os: String,
    browser: browserSchema, // Nested schema untuk browser
    battery: String,
});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

// Route untuk mengecek server
app.get('/', (req, res) => {
    res.send('OK');
});

app.get('/save-user-info', (req, res) => {
    res.send('OK');
});

// Route untuk menyimpan data user
app.post('/save-user-info', async (req, res) => {
    const userInfo = req.body;

    try {
        // Cek apakah data user sudah ada berdasarkan IP
        const existingUser = await UserInfo.findOne({ ip: userInfo.ip });

        if (existingUser) {
            // Jika sudah ada, kirim respon tanpa menyimpan data
            return res.status(200).send('User info already exists');
        }

        // Jika data belum ada, simpan ke MongoDB
        const newUserInfo = new UserInfo(userInfo);
        await newUserInfo.save();

        res.status(200).send('User info saved successfully');
    } catch (err) {
        console.error('Error saving user info:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Jalankan server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});