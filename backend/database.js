const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'database', 'adoption.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

function initDatabase() {

  // luodaan taulut eläimille ja adoptioille
  db.exec(`
    CREATE TABLE IF NOT EXISTS animals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT NOT NULL,
      age INTEGER,
      breed TEXT,
      gender TEXT,
      description TEXT,
      image_url TEXT,
      status BOOLEAN NOT NULL
    );

    CREATE TABLE IF NOT EXISTS adoptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      animal_id INTEGER NOT NULL UNIQUE,
      applicant_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (animal_id)
      REFERENCES animals(id)
      ON DELETE CASCADE
    );
  `);

  // lisätään adoptioeläimet
  const animalCount = db
    .prepare('SELECT COUNT(*) AS count FROM animals')
    .get();

  if (animalCount.count === 0) {
    console.log('Lisätään adoptioeläimiä...');

    const animals = [
      ['Testieläin1', 'Kissa', 3, 'Maatiainen', 'Naaras', 'Leikkisä', null, 1],
      ['Testieläin2', 'Koira', 5, 'Kultainennoutaja', 'Uros', 'Leikkisä', null, 1],
      ['Elmo', 'Koira', 4, 'Labradorinnoutaja', 'Uros', 'Rauhallinen ja lojaali. Sopii parhaiten yhden omistajan lemmikiksi.', 'images/labrador.jpg', 0],
      ['Nemo', 'Kala', 2, 'Kultakala', 'Uros', 'Sosiaalinen ja utelias. Kova uimari.', 'images/goldfish.jpg', 0],
      ['Rumpali', 'Kani', 1, 'Kääpiöluppa', 'Uros', 'Vauhdikas ja rohkea. Rumpali on älykäs ja energinen kani, joka kaipaa monipuolisia virikkeitä.', 'images/mini-lop.jpg', 0],
      ['Martta', 'Koira', 3, 'Bordercollie', 'Naaras', 'Lempeä ja leikkisä. Martta on sosiaalinen ja sopii hyvin lapsiperheeseen ja toisten koirien kaveriksi.', 'images/bordercollie.jpg', 0],
      ['Coco', 'Lintu', 10, 'Siniotsa-amatsoni', 'Naaras', 'Älykäs ja ihmisrakas. Coco on myös nopea oppimaan.', 'images/parrot.jpg', 0],
      ['Hattara', 'Kissa', 5, 'Kirjava maatiainen', 'Naaras', 'Aktiivinen ja leikkisä. Nauttii muiden ihmisten ja kissojen seurasta.', 'images/calico-cat.jpg', 0],
      ['Kaneli', 'Kani', 3, 'Hollantilainen', 'Naaras', 'Kesy ja ystävällinen. Tykkää rapsutuksista ja auringossa köllöttelystä.', 'images/dutch-rabbit.jpg', 0],
      ['Hamtaro', 'Jyrsijä', 1, 'Syyrianhamsteri', 'Naaras', 'Utelias ja vikkelä. Aktiivinen öisin.', 'images/hamster.jpg', 0],
      ['Tikru', 'Kissa', 7, 'Ragdoll', 'Uros', 'Rauhallinen ja hieman arka. Kaipaa toista kissaa rohkaisuksi.', 'images/ragdoll.jpg', 0]
    ];

    const insertAnimal = db.prepare(`
      INSERT INTO animals
      (name, species, age, breed, gender, description, image_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertAnimals = db.transaction((animals) => {
      for (const animal of animals) {
        insertAnimal.run(...animal);
      }
    });

    insertAnimals(animals);
    console.log('Adoptioeläimet lisätty');
  }

  // lisätään adoptiot
  const adoptionCount = db
    .prepare('SELECT COUNT(*) AS count FROM adoptions')
    .get();

  if (adoptionCount.count === 0) {
    console.log('Lisätään adoptioita...');

    const adoptions = [
      [1, 'Matti', 'matti.meikalainen@gmail.com', '0401234567', 'viesti', '2026-10-30'],
      [2, 'Maija', 'maija.meikalainen@gmail.com', '0402345678', 'viesti', '2026-10-29']
    ];

    const insertAdoption = db.prepare(`
      INSERT INTO adoptions
      (animal_id, applicant_name, email, phone, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const insertAdoptions = db.transaction((adoptions) => {
      for (const adoption of adoptions) {
        insertAdoption.run(...adoption);
      }
    });

    insertAdoptions(adoptions);
    console.log('Adoptiot lisätty');
  }

  console.log('Tietokanta on valmis');
}

module.exports = {
  db,
  initDatabase
};