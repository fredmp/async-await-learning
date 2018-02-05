const axios = require('axios');

const getExchangeRate = async (from, to) => {
  try {
    const response = await axios.get(`https://api.fixer.io/latest?base=${from}&symbols=${to}`);
    const rate = response.data.rates[to];
    if (!rate) throw new Error();
    return rate;
  } catch (e) {
    throw new Error(`Unable to get exchanged rate for ${from} and ${to}`);
  }
};

const getCountries = async currencyCode => {
  try {
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
    return response.data.map(country => country.name);
  } catch (e) {
    throw new Error(`Unable to get countries that use ${currencyCode}`);
  }
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

convertAsync('USD', 'BRL', 100)
  .then(status => {
    console.log(status);
  })
  .catch(error => {
    console.log(error.message);
  });
