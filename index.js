'use strict';

const puppeteer = require('puppeteer');
const path = require('path');

const writePdf = async (req, res) => {
  console.log('Received a call to create pdf file');

const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
  const page = await browser.newPage();
  await page.setContent(req.body, { waitUntil: 'networkidle2' });
  await page.emulateMedia('screen');
  // headerTemplate footerTemplate
  const pdf = await page.pdf({ margin: { left: '64px', right: '64px' }, printBackground: true });

  res.send(new Buffer(pdf, 'binary'))
  browser.close();
};

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/html' }));

app.get('/', (req, res) => res.send());
app.post('/pdf', writePdf);

app.listen(port, () => console.log(`Pdf generator listening on port ${port}!`));
