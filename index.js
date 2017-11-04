#!/usr/bin/env node

var program      = require('commander');
var readlineSync = require('readline-sync');
var shell        = require('shelljs');


program
  .version('0.0.1')
  .parse(process.argv);
  

if (!shell.which('git')) {
  shell.echo('Sorry, git is not installed.');
  shell.exit(1);
}

var projectName = readlineSync.question('What\'s your project name: ');

shell.echo('Cloning Ghostjacking repo');
shell.exec('git clone --depth 1 https://Holyshitem@bitbucket.org/Holyshitem/ghostjacking.git ' + projectName);

shell.echo('Cloning Ghost');
shell.exec('git clone --depth 1 https://github.com/TryGhost/Ghost.git ' + projectName + '/dest');
// shell.exec('git filter-branch --prune-empty --subdirectory-filter ' + projectName + '/dest/content HEAD');
shell.rm('-rf', projectName + '/dest/.git');
shell.rm('-rf', projectName + '/dest/.github');

shell.echo('Cloning Casper');
shell.exec('git clone --depth=1 --branch=master https://github.com/TryGhost/Casper.git ' + projectName + '/src');
shell.rm('-rf', projectName + '/src/.git');

shell.echo('Installing node packages');
shell.cd(projectName);
shell.exec('npm install');

shell.echo('Cloning and installing Foundation');
shell.exec('git clone https://github.com/zurb/foundation-sites-template.git foundation');
shell.cd('foundation');
shell.exec('bower install');
shell.exec('bower install modular-scale');
