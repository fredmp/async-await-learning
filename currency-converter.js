// USD CAD 20
// 24 USD is worth 28 CAD. You can spend this amount in the countries below.

const axios = require('axios');

const getExchangeRate = (from, to) => {
  return axios.get(`https://api.fixer.io/latest?base=${from}&symbols=${to}`)
    .then(response => {
      return response.data.rates[to];
    });
};

const getCountries = currencyCode => {
  return axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`)
    .then(response => {
      return response.data.map(country => country.name);
    });
};

const convert = (from, to, amount) => {
  let countries;
  return getCountries(to).then(c => {
    countries = c;
    return getExchangeRate(from, to);
  }).then(rate => {
    const exchangedAmount = amount * rate;
    return `${amount} ${from} is worth ${exchangedAmount} ${to} and can be used in ${countries.join(', ')}`;
  });
};

const convertAsync = async (from, to, amount) => {
  const countries = await getCountries(to);
  const rate = await getExchangeRate(from, to);

  if (!countries || !rate) throw new Error('Failed to retrieve info');

  const exchangedAmount = amount * rate;
  return `${amount} ${from} is worth ${exchangedAmount} ${to} and can be used in ${countries.join(', ')}`;
};

convert('USD', 'BRL', 100).then(status => {
  console.log(status);
});

convertAsync('USD', 'BRL', 100).then(status => {
  console.log(status);
});