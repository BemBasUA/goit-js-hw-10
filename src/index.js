import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector(`[id="search-box"]`),
  countryList: document.querySelector(`.country-list`),
  countryInfo: document.querySelector(`.country-info`),
};

let markup = '';

refs.searchBox.addEventListener(
  `input`,
  debounce(onSearchInput, DEBOUNCE_DELAY)
);

function onSearchInput() {
  if (!refs.searchBox.value.trim()) {
    refs.countryList.innerHTML = '';
    return;
  }
  fetchCountries(refs.searchBox.value.trim())
    .then(createMurkup)
    .catch(error =>
      Notiflix.Notify.failure(`Oops, there is no country with that name`)
    );
}

function createMurkup(countries) {
  if ((countries.length >= 2) & (countries.length <= 10)) {
    createCountriesListMurkup(countries);
  } else if (countries.length === 1) {
    createCountryMurkup(countries);
  } else if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else {
    Notiflix.Notify.failure(`Oops, there is no country with that name`);
  }
  refs.countryList.innerHTML = markup;
}

function createCountriesListMurkup(countries) {
  markup = countries
    .map(country => {
      return `<li>
    <img src="${country.flags.svg}" width = 30 alt="" />
    <span>${country.name.official}</span>
  </li>`;
    })
    .join(``);
}

function createCountryMurkup(countries) {
  markup = countries.map(country => {
    return `<li>
    <img src="${country.flags.svg}" width = 30 alt="" />
    <span>${country.name.official}</span>
  </li>
  <div>Capital: ${country.capital}</div>
  <div>Population: ${country.population}</div>
  <div>Languages: ${Object.values(country.languages).join(`, `)}</div>`;
  });
}
