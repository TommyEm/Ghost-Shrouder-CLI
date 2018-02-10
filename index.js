#!/usr/bin/env node

var program      = require('commander');
var readlineSync = require('readline-sync');
var shell        = require('shelljs');
var replace      = require('replace-in-file');


program
  .version('0.0.1')
  .parse(process.argv);


if (!shell.which('git')) {
  shell.echo('Sorry, git is not installed.');
  shell.exit(1);
}

var projectName = readlineSync.question('What\'s your project name: ');
var frameworks = ['Foundation', 'Bootstrap', 'None'],
    frameworkIndex = readlineSync.keyInSelect(frameworks, 'Do you want to use a framework? '),
    frameworkUsed = frameworks[frameworkIndex];

shell.echo('Cloning Ghostjacking repo');
shell.exec('git clone --depth 1 https://github.com/TommyEm/Ghost-Shrouder-starter-theme.git ' + projectName);

shell.echo('Installing node packages');
shell.cd(projectName);
shell.exec('npm install');

// Write project name
replaceString(['./gulpfile.js', './package.json'], /my-ghost-theme/g, projectName);


if (frameworkUsed == 'Foundation') {
  shell.echo('Installing Foundation');
  shell.exec('git clone https://github.com/zurb/foundation-sites-template.git foundation');
  shell.cd('foundation');
  shell.exec('bower install');
  shell.cd('./..');

  // Import Foundation
  replaceString('./assets/sass/style.sass', /\/\/ @import 'app'/g, "@import 'app'");

} else if (frameworkUsed == 'Bootstrap') {
  shell.echo('Installing Bootstrap');
  shell.exec('npm install bootstrap --save-dev');

  // Import Bootstrap
  replaceString('./assets/sass/style.sass', /\/\/ @import 'bootstrap'/g, "@import 'bootstrap'");
}


shell.echo('Installation OK');
shell.echo('Now run a new Docker container using this model:');
shell.echo('docker run -it -d --name ghost-theme-dev -v /your/local/template/path:/var/lib/ghost/content/themes/my-ghost-theme --env NODE_ENV=development -P ghost');
shell.echo('Then run the command: docker ps   and get the exposed port used by the container (usually beginning by 327xx)');
shell.echo('Finally launch Gulp with this port. For example: PORT=32768 gulp');



function replaceString(files, from, to) {
  try {
    var changes = replace.sync({
      files: files,
      from: from,
      to: to
    });
  }
  catch (error) {
    console.error('Error occurred:', error);
  }
}
