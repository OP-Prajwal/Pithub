#!/usr/bin/env node

const {program}=require('commander')
const addremote=require('./commands/remote')
const init=require('./commands/init')
const push=require('./commands/push')
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



program.command('push')
.description("pushes the files")
.action(push)






program.parse(process.argv)
