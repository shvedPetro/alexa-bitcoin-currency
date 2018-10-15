const request = require('request');
const qs = require('querystring');

const urlBlockchain = 'https://blockchain.info/tobtc';

module.exports = async (currency, value) => {
    return new Promise((resolve, reject) => {
        request({
            method: 'get',
            url: `${urlBlockchain}?${qs.stringify(
                {
                    currency,
                    value,
                },
            )}`,
        }, (err, httpResponse, body) => {
            if (!body || err) {
                return reject(new Error('Something went wrong!'));
            }

            return resolve(body);
        });
    });
};
