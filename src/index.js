DOG_URL = "http://localhost:3000/pups"
let FILTER_DOGS = false
let dogList
document.addEventListener('DOMContentLoaded', () => {
    getDogs()
    addFilterListener()

})

function getDogs() {
    fetch(DOG_URL).then(res => res.json()).then(json => {
        dogList = json;
        renderDogList()
    })

}

function renderDogList() {
    document.getElementById('dog-bar').innerHTML = ''

    const goodDogs = dogList.filter(dog =>
        dog.isGoodDog == true
    )
    if (FILTER_DOGS) {
        for (const dog of goodDogs) {
            addPupToDogBar(dog)
        }
    } else {
        for (const dog of dogList) {
            addPupToDogBar(dog)
        }
    }
}

function addPupToDogBar(dog) {
    const dogBar = document.getElementById('dog-bar')

    const dogSpan = document.createElement('span')
    dogSpan.innerHTML = dog.name
    dogSpan.addEventListener('click', e => {
        showDogStuff(dog)
    })

    dogBar.appendChild(dogSpan)
}

function showDogStuff(dog) {
    const dogInfo = document.getElementById('dog-info')
    dogInfo.innerHTML = `
    <img src=${dog.image}> 
    <h2>${dog.name}</h2> 
    <button id="toggle-dog-button">${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
    `

    const toggleDogButton = document.getElementById('toggle-dog-button')
    toggleDogButton.addEventListener('click', e => {
        fetch(`${DOG_URL}/${dog.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": 'application/json',
                Accept: "application/json"
            },
            body: JSON.stringify({
                isGoodDog: !dog.isGoodDog
            })
        })
            .then(res => res.json()).then(dog => {
                getDogs();
                showDogStuff(dog)
            })
    })
}

function addFilterListener() {
    const dogFilter = document.getElementById('good-dog-filter')
    dogFilter.addEventListener('click', e => {
        FILTER_DOGS = !FILTER_DOGS
        dogFilter.innerHTML = `Filter good dogs: ${FILTER_DOGS ? "ON" : "OFF"}`
        renderDogList()
    })
}