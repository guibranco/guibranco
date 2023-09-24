const fs = require('fs');
const { ReadmeBox } = require('readme-box');
const chunk = require('chunk');
const calculateAge = require('calculate-age').default;
const fileName = '.github/automations/experience.json';

const columns = 5;

const generateCell = (data) => `<td><strong>${calculateAge(data.since).getObject().years}+</strong> ${data.tech}</td>`;

const generateRow = (data) => {
    const cells = data.map((cell) => generateCell(cell));

    if (cells.length < columns) {
        cells.push('<td></td>'.repeat(columns - cells.length));
    }

    return `<tr>${cells.join('')}</tr>`;
}

async function main() {
    try {
        const data = fs.readFileSync(fileName, 'utf8');
        const json = JSON.parse(data);
        const rows = chunk(json, columns).map((row) => generateRow(row));
        const html = `<table width="100%"><thead><th colspan="5">Experience (in years)</th></thead><tbody>${rows.join('')}</tbody></table>`;

        await ReadmeBox.updateSection(html, {
            owner: process.env.GITHUB_REPOSITORY.split('/')[0],
            repo: process.env.GITHUB_REPOSITORY.split('/')[1],
            token: process.env.GITHUB_TOKEN,
            branch: 'main',
            section: 'experience-section',
            emptyCommits: false
        });
    } catch (err) {
        console.error(err);
    }
}

main();
