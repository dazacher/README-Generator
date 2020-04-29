const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);
// const author, title, description, installation, usage, license, contributing, tests, picture, email, githubUserName;
// const ({author, title, description, installation, usage, license, contributing, tests, picture, email, githubUserName} = { answers.author, answers.title, answers.description, answers.installation, answers.usage, answers.license, answers.contributing, answers.tests, answers.picture, answers.email, answers.githubUserName });
function userPrompt() {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "author",
                message: "Who is the author?"
            },
            {
                type: "input",
                name: "title",
                message: "What is the project title?"
            },
            {
                type: "input",
                name: "description",
                message: "Give a description of the project:"
            },
            {
                type: "input",
                name: "installation",
                message: "How do you install you project it?"
            },
            {
                type: "input",
                name: "usage",
                message: "Usage?"
            },
            {
                type: "list",
                name: "license",
                message: "What kind of licensing would you like for your project?",
                choices:
                    [
                        'MIT',
                        'APACHE 2.0',
                        'GPL 3.0',
                        'BSD3',
                        'None',
                        'Other'
                    ]
            },
            {
                type: "input",
                name: "contributing",
                message: "Contributing?"
            },
            {
                type: "input",
                name: "tests",
                message: "Tests?"
            },
            {
                type: "list",
                name: "picture",
                message: "Due you want your profile picture?",
                choices:
                    [
                        "Yes",
                        "No"
                    ]
            },
            {
                type: "list",
                name: "email",
                message: "Due you want your GitHub email?",
                choices:
                    [
                        "Yes",
                        "No"
                    ]
            },
            {
                type: "input",
                name: "githubUserName",
                message: "What is your GitHub user name?"
            }
        ])

        .then(function (answers) {

            const queryAvatarURL = `https://api.github.com/repos/${answers.githubUserName}/${answers.title}`;

            return axios
                .get(queryAvatarURL)
                .then(function (responseAvatar) {
                    // console.log(responseAvatar.data)
                    const avatar = responseAvatar.data.owner.avatar_url;
                    console.log(avatar);


                    const queryEmailURL = `https://api.github.com/users/${answers.githubUserName}/events/public`

                    return axios
                        .get(queryEmailURL)
                        .then(function (responseEmail) {

                            // console.log(responseEmail.data);
                            const emailAddress = responseEmail.data[0].payload.commits[0].author.email;
                            console.log(emailAddress);

                            // const queryBadgeURL = `https://api.github.com/github/package-json/v/${answers.githubUserName}/${answers.title}`

                            // return axios
                            // .get(queryBadgeURL)
                            // .then(function(responseBadge){
                            //     console.log(responseBadge.data)

                            return { avatar, emailAddress, ...answers };

                        })
                        .catch(function (err) {
                            console.log(err);
                        })
                })
        })
}

function generateReadMe({ author, title, description, installation, usage, license, contributing, tests, picture, email, githubUserName, avatar, emailAddress }) {
    return `#### Table
* Table of Contents
* [Author](#author)
* [Title](#title)
* [Description](#description)
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Contributing](#contributing)
* [Tests](#test)
* Questions
    * [Picture](#picture) Due you want your profile picture?
    * [Email](#email) Do you want your GitHub email?
    
### Author

The author of this project is: ${author}

### Title

${title}

### Decription

${description}

### Installation

Install the project by doing the following: ${installation}

### Usage

Usage: ${usage}

### License

License: ${license}

### Contributing

Contributing: ${contributing}

### Tests

Tests: ${tests}

### Picture

${picture === "Yes" ? `<img src="${avatar}"/>` : ""}

### Email

${email === "Yes" ? `${emailAddress}` : ""}

### Badge

[![GitHub license](https://img.shields.io/badge/license-${license.replace(" ", "")}-brightgreen.svg)](https://api.github.com/${githubUserName}/${title})
`;
}

userPrompt()
    .then(function (answers) {
        const readMe = generateReadMe(answers)

        return writeFileAsync("README.md", readMe);
    })
    .then(function () {
        console.log("Successfully wrote to README.md");
    })
    .catch(function (err) {
        console.log(err);
    })
