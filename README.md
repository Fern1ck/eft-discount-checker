# Escape from Tarkov Discount Checker

A simple script to notify via Discord Webhooks if there are discounts in the game Escape from Tarkov.

## Prerequisites

This project requires [NodeJS](http://nodejs.org/) and [NPM](https://npmjs.org/).
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
```

A [Discord Webhook](https://discord.com/developers/docs/resources/webhook) is required to use this script, because that's how it's going to notify that there's discounts active. Make sure you create it first.

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
DISCORD_WEBHOOK = example_url
HORAS_ENTRE_QUERIES = 12
```

## Usage

```sh
$ npm start
```
