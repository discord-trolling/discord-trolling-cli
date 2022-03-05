#! /usr/bin/env node

const figlet = require("figlet");
const inquirer = require("inquirer");

figlet("discord-trolling", (err, result) => {
  if (err) throw "There was an error initializing the CLI!";

  console.log(result);

  inquirer
    .prompt([
      {
        name: "Action",
        type: "list",
        choices: [
          {
            name: "Plugins",
            value: "plugins",
          },
        ],
      },
    ])
    .then((answers) => {
      require(`./operations/${answers.Action}`)[answers.Action].run();
    })
    .catch((err) => console.error(err));
});
