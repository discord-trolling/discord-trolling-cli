const fs = require("fs");
const os = require("os");
const inquirer = require("inquirer");
const day = require("dayjs");

module.exports.plugins = class {
  static run() {
    try {
      const files = fs.readdirSync(`${os.homedir()}/discord-trolling/plugins`);

      inquirer
        .prompt([
          {
            name: "Plugins",
            type: "list",
            choices: [
              {
                name: "View plugins",
                value: "view",
              },
              {
                name: "Add plugin",
                value: "add",
              },
            ],
          },
        ])
        .then((answers) => {
          if (answers.Plugins === "view")
            console.table(
              fs
                .readdirSync(`${os.homedir()}/discord-trolling/plugins`)
                .map((file) => {
                  const fileStats = fs.statSync(
                    `${os.homedir()}/discord-trolling/plugins/${file}`
                  );

                  return {
                    "Plugin Name": file,
                    "Creation Time": day(fileStats.birthtime).format(
                      "MM/DD/YYYY - hh:mm a"
                    ),
                  };
                })
            );
          else if (answers.Plugins === "add")
            inquirer
              .prompt([
                {
                  name: "Plugin Path",
                  type: "input",
                },
              ])
              .then((answers) => {
                const path = answers["Plugin Path"];

                if (fs.existsSync(path)) {
                  fs.renameSync(
                    path,
                    `${os.homedir()}/discord-trolling/plugins/${path.slice(
                      path.lastIndexOf(`/`)
                    )}`
                  );

                  console.log("The plugin was successfully added!");
                } else console.error("A file at that path does not exist!");
              })
              .catch((err) =>
                console.log("There was an error adding the plugin!")
              );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      if (err.code === "ENOENT")
        return fs.mkdirSync(`${os.homedir()}/discord-trolling/plugins`, {
          recursive: true,
        });

      console.log("An error occurred trying to access your plugins!");
    }
  }
};
