var weatherData;
var dateAndTime;

const form = document.querySelector('.form')
const input = document.querySelector('#input')
const weatherCard = document.querySelector("section")
const app = document.querySelector(".app")


form.addEventListener('submit', e => {
    e.preventDefault();
    const inputCity = input.value
    getWeatherReport(inputCity).then(data => {
        weatherData = data;
        console.log(data)
        getTimeOfInputPlace().then(data => {
            console.log(data);
            dateAndTime = data;
            updateWeather();
            updateTime();
        })
    });
})



function updateWeather() {

    let tempElement = `<sup>°c</sup><span class="app__report__details__type">${weatherData.weather[0]["main"]}</span>`

    // Details update
    document.querySelector(".app__report__details__place").innerHTML = weatherData.name;
    document.querySelector(".app__report__details__temp").innerHTML = Math.round(weatherData.main.temp) + tempElement;
}

function updateTime() {
    // regex Starts
    regexDate = /-[0-9]{1,2}-[0-9]{1,2}/;
    regexTime = /[0-9:]+:/

    let rawDate = dateAndTime.formatted;
    let date = rawDate.match(regexDate).toString().replace(/[-]/g, '');
    let time = rawDate.match(regexTime).toString().replace(/[:]/g, '');

    let hours = time.match(/^[0-9]{2}/).toString();
    let minutes = time.match(/\d{2}$/).toString();
    let day = date.match(/\d{2}$/).toString();
    day = parseInt(day.replaceAll(/^0+/g, ''));
    let month = date.match(/^[0-9]{2}/).toString();
    month = parseInt(month.replaceAll(/^0+/g, ''));

    // console.log(`
    // date:${date}, time:${time}, day:${day}, month:${month}, hours:${hours}, minutes:${minutes}
    // `)

    // regex Ends


    // Formatting Time and Date for HTML update

    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    resultTime = `${hours}:${minutes} <span>${ampm}</span>`;


    let DT = new Date();
    let fullYear = DT.getFullYear();

    function dayofweek(d, m, y) {
        let t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
        y -= (m < 3);
        return (y + y / 4 - y / 100 + y / 400 + t[m - 1] + d) % 7;
    }


    let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    let months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let resultDay = dayofweek(day, month, fullYear)

    resultDate = `${days[Math.ceil(resultDay)]}, ${day} ,${months[month]}`;

    // console.log(resultTime, resultDate)

    resultTime = resultTime.toString()
    resultDate = resultDate.toString()

    document.querySelector(".app__report__day__time").innerHTML = resultTime;
    document.querySelector(".app__report__day__date").innerHTML = resultDate;
    document.querySelector(".app__report__day__img").src = `http://openweathermap.org/img/wn/${weatherData.weather[0]["icon"]}@2x.png`


}

function showWeatherCard() {
    if (weatherCard.classList.contains("hide")) {
        weatherCard.classList.remove("hide");
    } else {
        weatherCard.classList.add("hide");
        setTimeout(() => { weatherCard.classList.remove("hide"); }, 500);
    }
}


async function getWeatherReport(inputCity) {
    let apiKey = '1457f38cc1e5a27c09d4e6d68cde0a03';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("Some error has occured :" + err);
    }
}

async function getTimeOfInputPlace() {
    let apiKey = '12M6FF3K2XG2'
    let url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${weatherData.coord.lat}&lng=${weatherData.coord.lon}`

    try {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("Some error occured in getTimeOfInputPlace Error: " + err);
    }

}