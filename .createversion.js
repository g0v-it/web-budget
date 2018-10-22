const buildVersion = require('build-version');
const fs = require('fs');

buildVersion().then((version) => {
  const content = JSON.stringify({ version: version });

  fs.writeFile("public/version.json", content, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }

    console.log(`Wrote version info ${version}`);
  });

});
