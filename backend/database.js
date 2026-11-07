const Database = require('better-sqlite3');
const db = new Database('./adoption.db');

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

    // lisää image_url myöhemmin!
    const animals = [
      ['Testieläin1', 'Kissa', 3, 'Maatiainen', 'Leikkisä', null, 1],
      ['Testieläin2', 'Koira', 5, 'Kultainennoutaja', 'Leikkisä', null, 1],
      ['Rekku', 'Koira', 7, 'Labradorinnoutaja', 'Leikkisä', null, 0],
      ['Nemo', 'Kala', 1, 'Kultakala', 'Utelias', null, 0],
      ['Puppe', 'Kani', 2, 'Kääpiöluppa', 'Ujo', null, 0],
      ['Rolle', 'Koira', 4, 'Kääpiöpinseri', 'Vauhdikas', null, 0],
      ['Rio', 'Lintu', 10, 'Undulaatti', 'Laulavainen', null, 0],
      ['Mauno', 'Kissa', 9, 'Maatiainen', 'Rauhallinen', null, 0],
      ['Risto', 'Kani', 1, 'Hollantilainen', 'Utelias', null, 0],
      ['Nelli', 'Lintu', 8, 'Papukaija', 'Sosiaalinen', null, 0],
      ['Mirri', 'Kissa', 3, 'Maatiainen', 'Utelias', null, 0]
    ];

    const insertAnimal = db.prepare(`
      INSERT INTO animals
      (name, species, age, breed, description, image_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
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