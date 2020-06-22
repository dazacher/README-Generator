const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

// define the write file as a promisify writefile
const writeFileAsync = util.promisify(fs.writeFile);

// Get answers to all questions needed to populate the readme file. Validate as needed.
function userPrompt() {
    return inquirer
        .prompt([
            {
                type: "input",
                name: "githubUserName",
                message: "What is your GitHub user name?",
                // validate:
                // async function validatesertName(value, userInput) {

                //     const queryUserURL = `https://api.github.com/users`;

                //     let responseUser = await axios
                //         .get(queryUserURL)

                //     userName = responseUser.data[0].login;

                //     const userEqualToUserInput = responseUser.data.filter(function (userName) {
                       
                //         return (userName.name === value)
                //     });
                   
                //     var pass = (userEqualToUserInput.length > 0);
                //     if (pass) {
                //         return true;
                //     }
                //     return `Please enter a valid Project name. The name ${value} does not match any in GitHubs database.`
                // }
                validate: function validateGitHubUserName(value) {
                    let userInput = value;

                    var pass = (value !== "");

                    if (pass) {
                        return true;
                    }
                    return `Please enter a valid GitHub user name.`
                }
            },
            {
                type: "input",
                name: "author",
                message: "Who is the author?"
            },
            {
                type: "input",
                name: "title",
                message: "What is the project title?",
                validate:
                    async function validateProjectName(value, userInput) {

                        const queryRepoURL = `https://api.github.com/users/${userInput.githubUserName}/repos`;

                        let responseRepo = await axios
                            .get(queryRepoURL)

                        repoName = responseRepo.data[0].name;

                        const projectEqualToUserInput = responseRepo.data.filter(function (repoName) {
                           
                            return (repoName.name === value)
                        });
                       
                        var pass = (projectEqualToUserInput.length > 0);
                        if (pass) {
                            return true;
                        }
                        return `Please enter a valid Project name. The name ${value} does not match any in your repository.`
                    }
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
                        new inquirer.Separator(),
                        `Other`
                    ],

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
            }
        ])
        .then(function (answers) {
           
            const queryAvatarURL = `https://api.github.com/repos/${answers.githubUserName}/${answers.title}`;

            return axios
                .get(queryAvatarURL)
                .then((responseAvatar) => {
                    // console.log(responseAvatar.data)
                    const avatar = responseAvatar.data.owner.avatar_url;
                    console.log(avatar);

                    const queryEmailURL = `https://api.github.com/users/${answers.githubUserName}/events/public`

                    return axios
                        .get(queryEmailURL)
                        .then((responseEmail) => {

                            // console.log(responseEmail.data);
                            const emailAddress = responseEmail.data[0].payload.commits[0].author.email;
                            console.log(emailAddress);

                            return { avatar, emailAddress, ...answers };
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        })
}


function generateReadMe({ author, title, description, installation, usage, license, contributing, tests, picture, email, githubUserName, avatar, emailAddress }) {
    // function generateReadMe(answers) {
    //     console.log(answers);
    return `#### Table of Contents

* [Author](#author)
* [Title](#title)
* [Description](#description)
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Contributing](#contributing)
* [Tests](#tests)
* Questions
    * [Picture](#picture) Due you want your profile picture?
    * [Email](#email) Do you want your GitHub email?
    
### Author

The author of this project is: ${author !== "" ? `${author}` : "The Author has chosen not to show their name."}

### Title

${title !== "" ? `${title}` : "The Author has chosen not to show a title."}

### Description

${description !== "" ? `${description}` : "The Author has chosen not to show a description."}

### Installation

Install the project by doing the following: ${installation !== "" ? `${installation}` : "The Author has chosen not to explain how to install their app."}

### Usage

Use the app by doing the following: ${usage !== "" ? `${usage}` : "The Author has chosen not to describe how to use their app."}

### License

License: ${license !== "" ? `${license}` : "The Author has not chosen any licensing."}

### Contributing

Contributing: ${contributing !== "" ? `${contributing}` : "There is no contributing data to show."}

### Tests

Tests: ${tests !== "" ? `${author}` : "The Author has no tests to show."}

### Picture

${picture === "Yes" ? `<img src="${avatar}"/>` : "The Author has chosen not to show an image."}

### Email

${email === "Yes" ? `${emailAddress}` : "The Author has chosen not to show an email."}

### Badge

[![GitHub license](https://img.shields.io/badge/license-${license.replace(" ", "")}-brightgreen.svg)](https://api.github.com/${githubUserName}/${title})
`;
}

userPrompt()
    .then((answers) => {
        const readMe = generateReadMe(answers)

        return writeFileAsync("README.md", readMe);
    })
    .then(() => {
        console.log("Successfully wrote to README.md");
    })
    .catch(function (err) {
        console.log(err);
    })
