// Display six cards when the window is loaded initially
window.addEventListener('load', () => {
    let url = 'https://openapi.programming-hero.com/api/ai/tools'
    fetch(url)
        .then(res => res.json())
        .then(data => displayData(data.data.tools.slice(0, 6)))
        .catch(error => console.log(error.message))
})

// Display all cards when clicked show more button
let showMoreBtn = document.querySelector('.show-more-btn')
let isAllShow = false
showMoreBtn.addEventListener('click', () => {
    // initially show more btn hidden when clicked
    showMoreBtn.style.display = 'none'
    // Clear initially loaded 6 data on display/UI
    document.querySelector('.ai-universe-items').innerHTML = ''
    // again when button click then spinner is loaded until data loaded
    document.querySelector('.spinner').style.display = 'block';
    // show all data or 6 data based on checking condition
    if (isAllShow) {
        let url = 'https://openapi.programming-hero.com/api/ai/tools'
        fetch(url)
            .then(res => res.json())
            .then(data => displayData(data.data.tools.slice(0, 6)))
            .catch(error => console.log(error.message));
        isAllShow = false
        showMoreBtn.innerText = 'Show More'
    } else {
        let url = 'https://openapi.programming-hero.com/api/ai/tools'
        fetch(url)
            .then(res => res.json())
            .then(data => displayData(data.data.tools))
            .catch(error => console.log(error.message));
        isAllShow = true
        showMoreBtn.innerText = 'Show Less'
    }
})

// function for dynamically display data
function displayData(data) {
    // spinner hidden
    document.querySelector('.spinner').style.display = 'none';
    // when data loaded then show more button is visible
    document.querySelector('.show-more-btn').style.display = 'block'

    // Traverse all data for display dynamic card
    let aiUniverseItems = document.querySelector('.ai-universe-items')
    data.forEach(cardData => {
        let cardFeaturesLi = cardData.features.map((elem, ind) => `<li>${ind + 1}. ${elem}</li>`)
        aiUniverseItems.innerHTML += `<div class='card bg-base-100 shadow-xl cardDiv'> 
        <figure><img src="${cardData.image}" alt="Shoes" /></figure>
        <div class="card-body border-b">
            <h2 class="card-title">Features</h2>
            <ul class='card-features-li'>
                ${cardFeaturesLi.join('')}
            </ul>
        </div>
        <div class="card-footer p-6 space-y-2">
            <h2 class='font-semibold text-xl'>${cardData.name}</h2>
            <div class="flex justify-between items-center">
                <p><i class="fa-regular fa-calendar-days"></i> <span class='cardDate'>${cardData.published_in}</span></p>
                <label for="my-modal-3" onclick='cardDetailsFunc("${cardData.id}")' class="cursor-pointer text-2xl text-orange-400 hover:text-orange-500 hover:scale-110 transition"><i class="fa-solid fa-circle-info"></i></label>
            </div>
        </div>
        </div>`
    });
}

// fetch function for show modal for each card
function cardDetailsFunc(id) {
    document.querySelector('.spinner').style.display = 'block' //visible spinner
    let url = `https://openapi.programming-hero.com/api/ai/tool/${id}`
    fetch(url)
        .then(res => res.json())
        .then(data =>
            cardModalFunc(data))
}

// dynamic modal for individual item
function cardModalFunc(data) {
    document.querySelector('.spinner').style.display = 'none' //hide spinner

    document.querySelector('.modal-right-img').src = data.data.image_link[0]
    setInnerTextByClassName('.modal-description', data.data.description)

    // modal pricing
    // setInnerTextByClassName('.modal-subscription-1', (data.data?.pricing?.length > 0 ? Object.values(data.data.pricing[0]).reverse().join(' ') : 'Free of cost'));
    setInnerTextByClassName('.modal-subscription-1', data.data?.pricing?.[0] ? Object.values(data.data?.pricing?.[0]).reverse().join(' ') : 'Free of cost');
    // setInnerTextByClassName('.modal-subscription-2', (data.data?.pricing?.length > 0 ? Object.values(data.data.pricing[1]).reverse().join(' ') : 'Free of cost'));
    setInnerTextByClassName('.modal-subscription-2', data.data?.pricing?.[1] ? Object.values(data.data?.pricing?.[1]).reverse().join(' ') : 'Free of cost');
    // setInnerTextByClassName('.modal-subscription-3', (data.data?.pricing?.length > 0 ? Object.values(data.data.pricing[2]).reverse().join(' ') : 'Free of cost'));
    setInnerTextByClassName('.modal-subscription-3', data.data?.pricing?.[2] ? Object.values(data.data?.pricing?.[2]).reverse().join(' ') : 'Free of cost');

    // modal features
    let modalFeatureArr = []
    for (key in data.data.features) {
        modalFeatureArr.push(data.data.features[key]['feature_name'])
    }
    let modalFeatureArr2 = modalFeatureArr.map(elem => `<li>${elem}</li>`)
    setInnerHtmlByClassName('.modal-features-ul', modalFeatureArr2.join(''))

    // modal integration
    let integrationLi = (data.data.integrations ?? ['No Data Found']).map(elem => `<li>${elem}</li>`)
    setInnerHtmlByClassName('.modal-integration-ul', integrationLi.join(''))

    // modal img accuracy
    let modalImgAccuracy = document.querySelector('.accuracy')
    modalImgAccuracy.style.display = 'block'
    if (data.data?.accuracy?.score != null) {
        modalImgAccuracy.innerText = `${data.data.accuracy.score * 100}% accuracy`
    } else {
        modalImgAccuracy.style.display = 'none'
    }
        
    // Modal right side ques & ans
    setInnerTextByClassName('.modal-right-example-ques', (data.data?.input_output_examples?.[0]?.input ?? 'Can you give any example?'))
    setInnerTextByClassName('.modal-right-example-ans', (data.data?.input_output_examples?.[0]?.output ?? 'No! Not yet! take a break.'))
}

// sort card by date
document.querySelector('.sortByBtn').addEventListener('click', () => {
    let allCardDiv = document.querySelectorAll('.cardDiv')
    let cardArr = Array.from(allCardDiv)
    cardArr.sort((card1, card2) => {
        let date1 = new Date(card1.querySelector('.cardDate').innerText)
        let date2 = new Date(card2.querySelector('.cardDate').innerText)
        if (date1 > date2) {
            return 1
        } else if (date1 < date2) {
            return -1
        } else {
            return 0
        }
    })
    for (card of cardArr) {
        document.querySelector('.ai-universe-items').appendChild(card)
    }
})



// utility function
// set inner text by class name
function setInnerTextByClassName(className, value) {
    document.querySelector(className).innerText = value
}
// set inner html by class name
function setInnerHtmlByClassName(className, value) {
    document.querySelector(className).innerHTML = value
}