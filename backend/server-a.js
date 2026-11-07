const express = require('express');

const {
  db,
  initDatabase
} = require('./database');

const app = express();

app.use(express.json());

initDatabase();


// GET /animals (Hae kaikki eläimet) 

app.get('/animals', (req, res) => {
    try {
        // palauta kaikki adoptoimattomat eläimet
        const animals = db.prepare('SELECT * FROM animals WHERE status = 0').all();  
        res.json(animals); 
  
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

// GET /animals/:id (Hae yksi eläin) 

app.get('/animals/:id', (req, res) => {
    try {
        const { id } = req.params; 
        const animal = db.prepare('SELECT * FROM animals WHERE id = ?').get(id); 
    
        if (animal === undefined) { // eläintä ei löytynyt
            return res.status(404).json({ error: "Eläintä ei löytynyt" }); 
        } else { // eläin löytyi
            res.json(animal); 
        }

    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    }
});

// POST /animals/:id/adopt (vastaanota adoptiohakemus ja lähetä se server B:lle)

app.post('/animals/:id/adopt', async (req, res) => {
    try {
        const animalId = req.params.id; 
        const { applicant_name, email, phone, message } = req.body;
        
        // tarkistetaan pakolliset tiedot
        if (!animalId || !applicant_name || !email || !phone ) {
            return res.status(400).json({ error: "Pakollisia tietoja puuttuu"}); 
        }
        // tarkistetaan että eläin on olemassa ja adoptoitavissa
        const animal = db.prepare('SELECT * FROM animals WHERE id = ?').get(animalId); 
        
        // eläintä ei löytynyt
        if (animal === undefined) { 
            return res.status(404).json({ error: "Eläintä ei löytynyt" }); 
        }

        // eläin on jo adoptoitu
        if (animal.status === 1) { 
            return res.status(409).json({ error: "Eläin on jo adoptoitu" }); 
        } 

        // lähetetään adoptiohakemus server B:lle
        const response = await fetch('http://localhost:4000/adoptions', { 
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({
                animal_id: animalId,
                applicant_name,
                email,
                phone,
                message
            })
        });

        if (!response.ok) { 
            const result = await response.json(); 
            return res.status(response.status).json(result); 
        }

        // ilmoitetaan frontendille adoption onnistumisesta
        return res.status(201).json({ message: "Adoptiohakemus on vastaanotettu"}); 

    } catch (error) { 
      res.status(500).json({ error: error.message }); 
    }
});


// server A:n portti 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server A käynnissä: http://localhost:${PORT}`);
});