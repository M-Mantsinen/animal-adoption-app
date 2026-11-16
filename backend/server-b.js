const express = require('express');
const { db } = require('./database');

const app = express();

app.use(express.json());


// POST /adoptions (lisää adoptio tietokantaan ja muuta eläimen adoptiostatus)

app.post('/adoptions', (req, res) => { 
    try {
        const { animal_id, applicant_name, email, phone, message } = req.body; 

        // tarkistetaan pakolliset tiedot
        if (!animal_id || !applicant_name || !email || !phone ) {
            return res.status(400).json({ error: "Pakollisia tietoja puuttuu"}); 
        }
        // tarkistetaan että eläin on olemassa ja adoptoitavissa
        const animal = db.prepare('SELECT * FROM animals WHERE id = ?').get(animal_id); 
        
        // eläintä ei löytynyt
        if (animal === undefined) { 
            return res.status(404).json({ error: "Eläintä ei löytynyt" }); 
        }

        // eläin on jo adoptoitu
        if (animal.status === 1) { 
            return res.status(409).json({ error: "Eläin on jo adoptoitu" }); 
        } 

        const insertAdoption = db.transaction(() => {

            // lisätään uusi adoptio
            db.prepare('INSERT INTO adoptions (animal_id, applicant_name, email, phone, message) VALUES (?, ?, ?, ?, ?)') 
            .run( 
                animal_id,
                applicant_name,
                email,
                phone,
                message ?? null 
            );

            // päivitetään eläimen status 
            db.prepare('UPDATE animals SET status = ? WHERE id = ?')
            .run(
                1,
                animal_id
            );

        });

        insertAdoption();

        // ilmoitetaan server A:lle että adoptio onnistui
        res.status(201).json({ message: "Adoption lisääminen onnistui!" });
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// server B:n portti

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server B käynnissä: http://localhost:${PORT}`);
});
