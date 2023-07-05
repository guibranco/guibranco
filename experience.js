const fs = require('fs');
const calculateAge = require('calculate-age').default
const fileName = 'experience.json';

function main() {
    try {
        const strData = fs.readFileSync(fileName, 'utf8');
        const data = JSON.parse(strData);
        for (const element of data) {
            element.age = calculateAge(element.since).getObject().years;
        }
        data.sort((a, b) => a.tech > b.age ? 1 : -1);
        data.sort((a,b) => a.age < b.age ? 1 : -1);
        const result = JSON.stringify(data);
        fs.writeFileSync(fileName, result);
    } catch (err) {
        console.error(err);
    }
}

main();