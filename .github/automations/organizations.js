const fs = require('fs');
const { ReadmeBox } = require('readme-box');
const fileName = '.github/automations/organizations.json';

const generateCell = (data) =>
    `<td><a href="https://github.com/${data.account}"><img alt="${data.account}" src="https://img.shields.io/badge/-${data.account.replace("-", "--")}-181717?style=for-the-badge&logo=github&logoColor=white" /></a></td><td>${data.description}</td>`;

const generateRow = (data) => `<tr>${generateCell(data)}</tr>`;

async function main() {
    const data = fs.readFileSync(fileName, 'utf8');
    const json = JSON.parse(data);
    const rows = json.map((row) => generateRow(row));
    const html = `<table width="100%"><thead><th>Account</th><th>Description</th></thead><tbody>${rows.join('')}</tbody></table>`;
    await ReadmeBox.updateSection(html, {
        owner: process.env.GITHUB_REPOSITORY.split('/')[0],
        repo: process.env.GITHUB_REPOSITORY.split('/')[1],
        token: process.env.GITHUB_TOKEN,
        branch: 'main',
        section: 'organizations-section',
        emptyCommits: false
    });
}

main();