const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

async function fetchDataForecast(search) {
  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/forecast?",
    {
      params: {
        q: search,
        appid: "bc69e2d065d9b29d519d19cf4933413e",
      },
    }
  );
  if (response) {
    return response.data.list;
  }
}

const displaySection = document.getElementById("display");

function display(weather, icon, day, date) {
  return `<div class="column">
    <div class="tile is-parent">
      <article class="tile is-child notification is-primary">
        <p id ='' class="title has-text-centered">${day}</p>
        <p id ='' class="subtitle has-text-centered">${weather}</p>
        <figure class="image is-4by3">
          <img src="http://openweathermap.org/img/wn/${icon}@2x.png" />
        </figure>
        <p class="subtitle has-text-centered">${date}</p>
      </article>
    </div>
  </div>`;
}

function dateTime(day) {
  var datei = new Date();
  datei.setDate(datei.getDate() + day);
  return datei;
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const forecast = async (event) => {
  let col = ``;
  let d = new Date();
  let date = d.getDay();
  if (!event.target.value) {
    return;
  }
  const forecastdata = await fetchDataForecast(event.target.value);

  let a = 0;
  for (let i = 0; i < forecastdata.length; i++) {
    if ([2, 10, 18, 26].includes(i)) {
      let tempDate = String(dateTime(a)).slice(0, 15);

      let temp = display(
        forecastdata[i].weather[0].description,
        forecastdata[i].weather[0].icon,
        days[date],
        tempDate
      );

      col = col.concat(temp);
      date++;
      a++;
    }
  }

  displaySection.innerHTML = col;
};

forecast();

const cityInput = document.getElementById("input");
cityInput.addEventListener("input", debounce(forecast, 800));
