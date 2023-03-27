const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

const assetsPathRegex = new RegExp("^..*?(/assetPath/_next/static/)")

app.prepare().then(() => {
  const server = express();

  server.use(process.env.ASSET_DIRECTORY, express.static(".next"));

  server.get(assetsPathRegex, (req, res) => {
    const ogURL = req.originalUrl;
    const splitPath = ogURL.split(process.env.ASSET_STATIC_DIRECTORY);

    res.redirect(`${process.env.ASSET_STATIC_DIRECTORY}${splitPath[1]}`);
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(process.env.PORT, (err) => {
    if (err) throw err;
    console.log("Server ready");
  });
}).catch((ex) => {
  console.error(ex);
  process.exit(1);
})
