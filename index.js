const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

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
                message: "How do you install it?"
            },
            {
                type: "input",
                name: "usage",
                message: "Usage?"
            },
            {
                type: "input",
                name: "license",
                message: "License?"
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
            const queryNameTitleURL = `https://api.github.com/repos/${answers.githubUserName}/${answers.title}`;

            return axios
                .get(queryNameTitleURL)
                .then(function (response) {
                    // console.log(response.data)
                    const avatar = response.data.owner.avatar_url;

                    const queryURL = `https://api.github.com/users/${answers.githubUserName}`
                    return axios
                        .get(queryURL)
                        .then(function (response2) {
                            const email = response2.data.email;
                            console.log(response2.data);

                            const readMe = generateReadMe({ ...answers, email, avatar })
                            writeFileAsync("README.md", readMe);
                        })
                })
        })
}


function generateReadMe(answers) {
    console.log(answers)
    return`
    * Table of Contents
    * Installation
    * Usage
    * License
    * Contributing
    * Tests
    
    The author of this project is: ${answers.author}
    ${answers.title}
    ${answers.description}
    Install the project by doing the following: ${answers.installation}
    Usage: ${answers.usage}
    License: ${answers.license}
    Contributing: ${answers.contributing}
    Tests: ${answers.tests}
    ${answers.picture === "Yes" ? `![profile_image](${answers.avatar})`: ""}
    ${answers.email === "Yes" ? `${answers.email}`: ""}
        `;
}
// /github/package-json/v/:user/:repo
userPrompt()
    .then(function () {
        console.log("Successfully wrote to README.md");
    })
    .catch(function (err) {
        console.log(err);
    })
