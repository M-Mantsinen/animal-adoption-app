# Eläinten adoptointisovellus

Vaasan Eläinsuoja ry:lle toteutettu web-sovellus eläinten adoptointeja varten. Sovelluksessa käyttäjä voi tutustua adoptoitaviin eläimiin verkossa ja jättää adoptiohakemuksen sähköisesti.

Sovellus koostuu SQLite-tietokannasta, kahdesta erillisestä palvelimesta (Server A ja Server B) sekä frontendistä.

## Asennus ja sovelluksen käynnistys

1. Avaa Docker Desktop
2. Avaa Visual Studio Code ja avaa siellä uusi terminaali
3. Siirry terminaalissa kansioon, johon haluat ladata projektin
4. Suorita komento: git clone https://github.com/M-Mantsinen/animal-adoption-app.git
5. Siirry projektin juurikansioon ja suorita komento: docker compose up --build
6. Avaa selain osoitteessa: http://localhost:3000

Tietokantatiedosto sijaitsee projektin database -kansiossa ja se luodaan automaattisesti palvelimien käynnistyessä.

### Sovelluksen pysäyttäminen

1. Suorita terminaalissa: Crtl + C
2. Pysäytä ja poista Docker kontit suorittamalla komento: docker compose down