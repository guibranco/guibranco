const fs = require('fs');
const { ReadmeBox } = require('readme-box');
const chunk = require('chunk');
const fileName = '.github/automations/code-with.json';

const generateRow = (data) => {
  return data;
};

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
            section: 'code-with-section',
            emptyCommits: false
        });
    } catch (err) {
        console.error(err);
    }
}

main();
