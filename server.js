const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('OK');
});

app.get('/save-user-info', (req, res) => {
    res.send('OK');
});

app.post('/save-user-info', (req, res) => {
    const userInfo = req.body;

    // Baca file data_user.json
    fs.readFile('data_user.json', (err, data) => {
        let jsonData = [];
        if (!err) {
            try {
                jsonData = JSON.parse(data);
            } catch (e) {
                console.error('Error parsing JSON:', e);
            }
        }

        // Cek apakah data user sudah ada berdasarkan IP atau data lain yang unik
        const existingUser = jsonData.find(entry => entry.ip === userInfo.ip);
        
        if (existingUser) {
            // Jika sudah ada, kirim respon tanpa menyimpan data
            return res.status(200).send('User info already exists');
        }

        // Jika data belum ada, tambahkan ke dalam array
        jsonData.push(userInfo);

        // Simpan kembali ke data_user.json
        fs.writeFile('data_user.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).send('User info saved successfully');
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
