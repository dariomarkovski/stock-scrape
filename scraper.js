const cheerio = require('cheerio');
const request = require('request');

var exports = module.exports = {};

let tableDataQuery = 'http://money.cnn.com/data/hotstocks/index.html';
let symbolDataQuery = 'https://money.cnn.com/quote/quote.html?symb='

let extractText = (data) => {
    return cheerio.load(data).text();
}

exports.latestData = async () => {
    return new Promise((resolve, reject) => {
        let companies = [];
        request(tableDataQuery, (error, response, body) => {
            if(response.statusCode === 200) {
                var $bodyFromPage = cheerio.load(body);
                var $tables = $bodyFromPage('.wsod_dataTable.wsod_dataTableBigAlt');
                $tables.each((index, table) => {
                    $table = cheerio.load(table);
                    $trows = $table('tr').has('td');
                    $trows.each((index, trow) => {
                        $trow = cheerio.load(trow);
                        $tdatas = $trow('td');
                        $tdatasChildren = $tdatas.children();
                        let companyObject = {
                            'Company': extractText($tdatasChildren[0]),
                            'Price': extractText($tdatasChildren[2]),
                            'Change': extractText($tdatasChildren[3]),
                            'Change (Percent)': extractText($tdatasChildren[4])
                        }
                        companies.push(companyObject);
                    });
                });
                resolve(companies);
            }
        });
    });
}

exports.symbolData = (symbol) => {
    return new Promise((resolve, reject) => {
        let todayTrading = {};
        symbolDataQuery = symbolDataQuery + symbol;
        request(symbolDataQuery, (error, response, body) => {
            if(response.statusCode === 200){
                var $ = cheerio.load(body);
                var $tables = $('.wsod_dataTable');
                $tables.each((index, table) => {
                    if(index === 0){
                        $table = cheerio.load(table);
                        $trows = $table('tr').has('td');
                        $trows.each((index, trow) => {
                            $trow = cheerio.load(trow);
                            $tdata = $trow('td');
                            todayTrading[cheerio.load($tdata[0]).text()] = cheerio.load($tdata[1]).text();
                        })
                    }
                });
                resolve(todayTrading);
            }
        })
        
    });
}
