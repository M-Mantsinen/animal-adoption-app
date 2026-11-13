const animalsContainer = document.getElementById("animals-container");
const animalContainer = document.getElementById("animal-container");


// TÄMÄ PALAUTTAA KAIKKIEN ELÄINTEN TIEDOT

function fetchAllAnimals() {
    return fetch("http://localhost:3000/animals")
        .then((response) => {

            // Tarkistetaan virhetilanteet 
            if (!response.ok) {
                throw new Error("Eläinten hakeminen epäonnistui");
            }

            return response.json()
        })
        
        .then((animals) => {
            animals.forEach((animal) => {
                const card = document.createElement("div");
                card.classList.add("animal-intro-card");
                
                // Luodaan elementin html osio
                card.innerHTML = `
                    <img src="${animal.image_url ?? "images/placeholder.jpg"}" alt="${animal.breed}" class="animal-intro-card-image">
                    
                    <div class="animal-intro-card-info-container">
                        <h3>${animal.name}</h3>
                        <p><strong>Laji:</strong> ${animal.species}</p>
                        <p><strong>Ikä:</strong> ${animal.age ?? "Ikää ei tiedetä"}</p>
                        <button type="button">Katso lisää</button>
                    </div>
                `;
                
                // Lisätään painikkeeseen tapahtumakuuntelija
                const button = card.querySelector("button");
                
                button.addEventListener("click", () => {
                    // Ohjataan käyttäjä sivulle animal.html id:n perusteella
                    window.location.href = `animal.html?id=${animal.id}`;
                });
                
                // Lisätään "card" html tiedostoon oikeaan kohtaan
                animalsContainer.appendChild(card);
            });

            // Virhetilanteen käsittely
        }).catch((error) => {
            console.error("Virhe eläinten hakemisessa:", error);
    });
}


// TÄMÄ PALAUTTAA YHDEN ELÄIMEN TIEDOT ID:N PERUSTEELLA

function fetchOneAnimal() {

    // Haetaan eläimen ID url osoitteesta
    const urlParams = new URLSearchParams(window.location.search);
    const animalId = urlParams.get("id");

    return fetch(`http://localhost:3000/animals/${animalId}`)
        .then((response) => {
            
            // Tarkistetaan virhetilanteet 
            if (!response.ok) {
                throw new Error("Eläimen hakeminen epäonnistui");
            }

            return response.json();
        })

        .then((animal) => {
            const card = document.createElement("div");
            card.classList.add("animal-card");

            // Luodaan elementin html osio
            card.innerHTML = `
                <img src="${animal.image_url ?? "images/placeholder.jpg"}" alt="${animal.breed}" class="animal-card-image">
                
                <div class="animal-card-info-container">
                    <h1>${animal.name}</h1>
                    <p><strong>Laji:</strong> ${animal.species}</p>
                    <p><strong>Ikä:</strong> ${animal.age ?? "Ikää ei tiedetä"}</p>
                    <p><strong>Rotu:</strong> ${animal.breed}</p>
                    <p><strong>Sukupuoli:</strong> ${animal.gender}</p>
                    <p><strong>Kuvaus:</strong> ${animal.description}</p>
                    <p class="animal-status"><strong>Tila:</strong> ${animal.status === 1 ? "Adoptoitu" : "Adoptoitavissa"}</p>
                </div>
            `;

            // Lisätään "card" html tiedostoon oikeaan kohtaan
            animalContainer.appendChild(card);

            // Virhetilanteen käsittely
        }).catch((error) => {
            console.error("Virhe eläimen hakemisessa:", error);
    });
}


// TÄMÄ LÄHETTÄÄ ADOPTIOLOMAKKEEN SERVER B:LLE

function adoptAnimal() {

    // Haetaan eläimen ID url osoitteesta
    const urlParams = new URLSearchParams(window.location.search);
    const animalId = urlParams.get("id");

    // Haetaan lomake html tiedostosta
    const adoptionForm = document.querySelector("form"); 

    // Lisätään lomakkeeseen tapahtumakuuntelija 
    adoptionForm.addEventListener("submit", (event) => {

        event.preventDefault();

        // Haetaan lomakkeen tiedot
        const applicant_name = document.getElementById("fullname").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const message = document.getElementById("messageBox").value;

        // Lähetetään tiedot Server A:lle
        fetch(`http://localhost:3000/animals/${animalId}/adopt`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                applicant_name,
                email,
                phone,
                message
            })
        })

        .then((response) => {

            // Virheilmoitus 
            if (!response.ok) {
                throw new Error("Lomakkeen lähetys epäonnistui");
            }

            // Vastaus
            return response.json();

        })

        .then(() => {

            // Ohjataan käyttäjä vahvistussivulle
            window.location.href = "adoption.html";

            // Virhetilanteen käsittely
        }).catch((error) => {
            console.error("Virhe lomakkeen lähettämisessä:", error);
        });
    });
}





