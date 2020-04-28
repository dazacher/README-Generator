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
                    ['MIT',
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
                    // /github/package-json/v/:user/:repo


                    // Get the email address
                    // const queryEmailURL = `https://api.github.com/${answers.githubUserName}/emails`
                    // return axios
                    //     .get(queryEmailURL)
                    //     .then(function (responseEmail) {
                    // const email = responseEmail.data.email;
                    // console.log(responseEmail.data);
                    // const email = responseEmail.data[0].actor.avatar_url;
                    // return {email, ...answers};

                    // Get the badge for the License
                    // const queryBadgeURL = `[![GitHub license](https://img.shields.io/badge/license-${answers.license}-brightgreen.svg)](https://api.github.com/${answers.githubUserName}/${answers.project})`

                    // const queryBadgeURL = `[![GitHub badge]https://img.shields.io/badge/github/package-json/v/${answers.githubUserName}/${answers.title}`
                    // return axios
                    //     .get(queryBadgeURL)
                    //     .then(function (responseBadge) {

                    //         console.log(responseBadge);
                    //         const badge = responseBadge.data.config.url;
                    //         console.log(badge);
                    return { avatar, ...answers };

                    // return {badge, ...answers};

                    // })

                    // })
                })
        })
}
//         )
// }

function generateReadMe(answers) {
    // console.log(answers)
    return `
    ## Table
    * Table of Contents
    * [Author](#author)
    * [title](#title)
    * [description](#description)
    * [installation](#installation)
    * Usage
    * License
    * Contributing
    * Tests
    
    ## Author

    The author of this project is: ${answers.author}

    ## Title

    ${answers.title}

    ## Decription

    ${answers.description}

    ## Installation

    Install the project by doing the following: ${answers.installation}

    ## Usage

    Usage: ${answers.usage}

    ## License

    License: ${answers.license}

    ## Contributing

    Contributing: ${answers.contributing}

    ## Tests

    Tests: ${answers.tests}

    ${answers.picture === "Yes" ? `![profile_image](${answers.avatar})` : ""}

    ${answers.email === "Yes" ? `${answers.email}` : ""}

    Badge: ${answers.badge}
        `;
}

userPrompt()
    .then(function (answers) {
        const readMe = generateReadMe({ answers })
        writeFileAsync("README.md", readMe);
    })
    .then(function () {
        console.log("Successfully wrote to README.md");
    })
    .catch(function (err) {
        console.log(err);
    })
