const PUPS_URL = "http://localhost:3000/pups"
let pupFilterOn = false;

document.addEventListener("DOMContentLoaded", () => {
    fetchPups()

    const pupFilterButton = document.getElementById("pup-filter-button");
    pupFilterButton.addEventListener("click", () => pupFilter())
})

function fetchPups() {
    fetch(PUPS_URL)
        .then(resp => resp.json())
        .then(json => createPupSpans(json))
}

function createPupSpans(pups) {
    const pupBar = document.getElementById("pup-bar");
    pupBar.innerHTML = "";

    pups.forEach(pup => {
        const pupSpan = document.createElement("span");

        pupSpan.innerText = `${pup.name}`;
        pupSpan.addEventListener("click", () => pupSpanClick(pup))

        pupBar.appendChild(pupSpan);
    })
}

function pupSpanClick(pup) {
    const pupInfo = document.getElementById("pup-info")
    let buttonText;

    if (pup.isGoodDog) {
        buttonText = "Good Dog"
    } else {
        buttonText = "Bad Dog"
    }

    pupInfo.innerHTML = `
        <img src=${pup.image}>
        <h2>${pup.name}</h2>
        <button>${buttonText}</button>
    `;

    const pupInfoButton = pupInfo.querySelector("button")
    pupInfoButton.addEventListener("click", () => pupInfoBtnClick(pup, pupInfoButton))
}

function pupInfoBtnClick(pup, btnElement) {
    fetch(`${PUPS_URL}/${pup.id}`)
        .then(resp => resp.json())
        .then(pup => {

            let updatedValue;

            if (pup.isGoodDog) {
                updatedValue = false;
                btnElement.innerText = "Bad Dog";
            } else {
                updatedValue = true;
                btnElement.innerText = "Good Dog";
            }

            patchPup(pup, updatedValue);
        })
}

function patchPup(pup, updatedValue) {
    fetch(`${PUPS_URL}/${pup.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({ "isGoodDog": updatedValue })
    }).then(resp => resp.json()).then(pup => {
        if (pupFilterOn) {
            if (pup.isGoodDog) {
                const pupSpan = document.createElement("span");
                pupSpan.innerText = `${pup.name}`;

                document.getElementById("pup-bar").appendChild(pupSpan);
            }
        }
    })
}

function pupFilter() {
    const pupBar = document.getElementById("pup-bar")

    if (!pupFilterOn) {
        pupFilterOn = true;
        document.getElementById("pup-filter-button").innerText = "Filter good dogs: ON";

        fetch(PUPS_URL)
            .then(resp => resp.json())
            .then(pups => {
                allGoodDogs = [];
                pups.forEach(pup => {
                    if (pup.isGoodDog) {
                        allGoodDogs.push(pup);
                    }
                })
                createPupSpans(allGoodDogs);
            })
    } else if (pupFilterOn) {
        pupFilterOn = false;
        document.getElementById("pup-filter-button").innerText = "Filter good dogs: OFF";
        fetchPups();
    }
}