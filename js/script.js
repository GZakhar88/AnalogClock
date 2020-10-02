var body = document;
const deg = 6;
const hr = document.querySelector('#hr');
const mn = document.querySelector('#mn');
const sc = document.querySelector('#sc');
let dayButton = document.querySelector('#buttonDay');
let sunsetButton = document.querySelector('#buttonSunset');
let sunriseButton = document.querySelector('#buttonSunrise');
let nightButton = document.querySelector('#buttonNight');

var partOfTheDay = '';
var date = new Date();
let hour = date.getHours();
let testHour = 10; // for testing  hour => testHour

setInterval(() => {
    let day = new Date();
    let hh = day.getHours() * 30;
    let mm = day.getMinutes() * deg;
    let ss = day.getSeconds() * deg;
    hr.style.transform = `rotateZ(${(hh)+(mm/12)}deg)`;
    mn.style.transform = `rotateZ(${mm}deg)`;
    sc.style.transform = `rotateZ(${ss}deg)`;
});
//Theme change automatization
if(hour >= 18 && hour <= 20) {
    partOfTheDay = 'sunset';
} else if (hour >= 21 || hour <= 6) {
    partOfTheDay = 'night';
} else if (hour >= 7 && hour <= 9) {
    partOfTheDay = 'sunrise';
} else {
    partOfTheDay = 'day';
}
switch(partOfTheDay){
    case 'day':
        document.body.classList.toggle('day');
        break;
    case 'sunset':
        document.body.classList.toggle('sunset');
        break;
    case 'sunrise':
        document.body.classList.toggle('sunrise');
        break;
    default:
        document.body.classList.toggle('body');
}
//Theme change buttons 1. clear the class list 2. toggle the selected class
dayButton.addEventListener('click', ()=> {
    document.body.classList.remove('sunset','sunrise','body', false);
    document.body.classList.toggle('day', true);
    iconElement.innerHTML = `<img src="/images/icons/${weather.iconId}.png"/>`;
});
sunsetButton.addEventListener('click', ()=> {
    document.body.classList.remove('day','sunrise','body', false);
    document.body.classList.toggle('sunset', true);
    iconElement.innerHTML = `<img src="/images/icons/${weather.iconId}.png"/>`;
});
sunriseButton.addEventListener('click', ()=> {
    document.body.classList.remove('day','sunset','body', false);
    document.body.classList.toggle('sunrise', true);
    iconElement.innerHTML = `<img src="/images/icons/${weather.iconId}.png"/>`;
});
nightButton.addEventListener('click', ()=> {
    document.body.classList.remove('day','sunset','sunrise', false);
    document.body.classList.toggle('body', true);
    iconElement.innerHTML = `<img src="/images/iconsWhite/${weather.iconId}.png"/>`;
});
//Weather API---------------------------------------------------------------------//
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");
const weather = {};
const KELVIN = 273;
const key = '001cee30235e1dc103ba5531f0cfad99';

weather.temperature = {
    unit : 'celsius'
}
// Check browser support
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}
// Set geo position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}
// Show geoloc error
function showError(error){
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}
// Get weather 
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}
console.log(document.body.className);
// Display weather
function displayWeather(){
    if(document.body.className === 'body'){
        iconElement.innerHTML = `<img src="/images/iconsWhite/${weather.iconId}.png"/>`;
    } else if(document.body.className !== 'body') {
        iconElement.innerHTML = `<img src="/images/icons/${weather.iconId}.png"/>`;
    }
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}