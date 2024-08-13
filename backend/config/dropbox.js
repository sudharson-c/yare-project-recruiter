const Dropbox=  require('dropbox').Dropbox;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_KEY, fetch });

module.exports = dbx;
