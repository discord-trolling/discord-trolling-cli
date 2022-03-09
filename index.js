#! /usr/bin/env node

const figlet = require("figlet");
const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios").default;
const os = require("os");
const multispinner = require("multispinner");

figlet("discord-trolling", (err, result) => {
  if (err) {
    console.error(err);
    throw "There was an error initializing the CLI!";
  }

  console.log(result);

  if (process.argv.length < 3)
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
  else {
    if (process.argv[2] !== "install")
      return console.log("That is not a valid command!");

    if (!process.argv[3])
      return console.log("You need to specify a package to install!");

    let spinner = new multispinner([`${process.argv[3]}...`], {
      preText: "Installing plugin",
    });

    axios
      .get(
        `https://raw.githubusercontent.com/discord-trolling/plugins/main/plugins/${process.argv[3]}.js`,
        {
          responseType: "stream",
        }
      )
      .then((res) => {
        res.data.pipe(
          fs.createWriteStream(
            `${os.homedir()}/discord-trolling/plugins/${process.argv[3]}.js`
          )
        );

        spinner.success(`${process.argv[3]}...`);
      })
      .catch((err) => {
        if (err.response)
          if (err.response.status === 404)
            return console.log("This plugin does not exist!");

        console.log("There was an error fetching your plugin!");
      });
  }
});
