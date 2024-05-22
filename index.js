#!/usr/bin/env node
import inquirer from 'inquirer';
import { program } from 'commander';
import { processFile } from './components/file.cli.js';
import { processConsole } from './components/console.cli.js';
import chalk from 'chalk';
import { handShake } from './components/hand.shake.js';

async function main() {
  program.version('0.1.3');

  let defaultPort = 3000;
  let defaultHost = 'localhost';
  let username, password;
  let port = defaultPort;
  let host = defaultHost;

  program
    .option('-f, --file <filepath>', 'Specify the file to process')
    .option('-i, --input <command>', 'Specify the initial command to process')
    .option('-P, --port <port>', 'Specify the port')
    .option('-H, --host <hostname>', 'Specify the hostname')
    .option('-u, --username <username>', 'Specify the username to make the initial connection')
    .option('-p, --password <password>', 'Specify the password to make the initial connection')

  program.parse(process.argv);

  const options = program.opts();

  port = options.port ? options.port : port;
  host = options.host ? options.host : host;
  username = options.username;
  password = options.password;

  if (!username && !password) {
    console.log(chalk.yellow.bold('[w] Username and password not specified:\n'))

    const usernamePrompt = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Username: ',
      },
    ]);
    username = usernamePrompt.username;

    const passwordPrompt = await inquirer.prompt([
      {
        type: 'password',
        mask: '*',
        name: 'password',
        message: 'Password: ',
      },
    ]);
    password = passwordPrompt.password;
    console.log('')
  }

  try {
    const res = await handShake(host, port, username, password);
    console.log(chalk.blue.bold('[i] ' + res))

    console.log(chalk.blue.bold(`
  ////////////////////////////////////////////////////////////////
  //                                                            //
  //   _   _           ____________        _____  _     _____   //
  //  | \\ | |          |  _  \\ ___ \\      /  __ \\| |   |_   _|  //
  //  |  \\| |_   _  ___| | | | |_/ /______| /  \\/| |     | |    //
  //  | . \` | | | |/ _ \\ | | | ___ \\______| |    | |     | |    //
  //  | |\\  | |_| |  __/ |/ /| |_/ /      | \\__/\\| |_____| |_   //
  //  \\_| \\_/\\__,_|\\___|___/ \\____/        \\____/\\_____/\\___/   //
  //                                                            //
  ////////////////////////////////////////////////////////////////
              Copyright © 2024. All rights reserved.`));

    console.log(`
  # Welcome to NueDB-cli. Please enter the documentation here if you want to
  # know about NueDB command syntax and functionalities -> https://nuedb.org/docs
  `)


    if (options.file) {
      processFile(host, port, options.file)
        .then(() => {
          if (options.input) {
            return processConsole(host, port, options.input);
          } else {
            return processConsole(host, port);
          }
        })
        .catch(error => console.error(error));
    } else if (options.input) {
      processConsole(host, port, options.input)
        .catch(error => console.error(error));
    } else {
      processConsole(host, port)
        .catch(error => console.error(error));
    }
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.log(chalk.red.bold('Error while connecting to NueDB server. Is the server up or are the host and the port correct?'))
    }
  }
}

main();