# Escape from Tarkov Discount Checker

A simple script to notify via Discord Webhooks if there are discounts in the game Escape from Tarkov.

## Prerequisites

This project requires [NodeJS](http://nodejs.org/) and [NPM](https://npmjs.org/).
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
```

A [Discord Webhook](https://discord.com/developers/docs/resources/webhook) is required to use this script, because that's how it's going to notify that there's discounts active. Make sure you create it first. To create it:

1. Go to your Discord server settings.
2. Go to Integrations
3. Click to Webhooks
4. Click on "New Webhook". A webhook will be created with a random name.
5. Click on it, change the name if you want and select the text channel this script is going to notify on.
6. Copy the webhook URL, you'll need to paste in the .env file in step (3)

## Installation

### 1) Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/Fern1ck/eft-discount-checker
$ cd eft-discount-checker
```

### 2) To install and set up the dependencies, run:

```sh
$ npm i
```

### 3) Create a `.env` file

Create a `.env` file in the root of your project and insert
the following key/value pairs in the following format of `KEY=VALUE`:

```sh
DISCORD_WEBHOOK = your_webhook_url
MINUTES_IN_BETWEEN_QUERIES = 60
```

Replace "your_webhook_url with the url you copied from step (1).

## Usage

```sh
$ npm start
```
