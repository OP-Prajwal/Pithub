#!/usr/bin/env node

const {program}=require('commander')
const addremote=require('./commands/remote')
const init=require('./commands/init')
const commit=require('./commands/commit')
const add=require('./commands/add')
program.name("mygit")
.description("a simple git clone")
.version("0.1.0")


program.command('init')
.description("initializes an repo")
.action(init)

program.command('remote:add <url>')
.description("helps to connect git")
.action(addremote)

program.command("add <file>")
.description("helps to stage files")
.action(add)

program
  .command('commit')
  .option('-m, --message <message>', 'Commit message')
  .description('Create a new commit')
  .action((opts) => {
    commit(opts.message || 'No message');
  });


const push = require('./commands/push');

program
  .command('push')
  .description('Push to remote repo')
  .action(() => {
    push();
  });







program.parse(process.argv)
