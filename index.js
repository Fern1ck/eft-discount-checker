const { default: axios } = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
require("dotenv").config();

function setTerminalTitle(title) {
  process.stdout.write(
    String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
  );
}

async function main() {
  setTerminalTitle("Escape from Tarkov Discount Checker");
  if (process.env.MINUTES_IN_BETWEEN_QUERIES == undefined) {
    console.log("MINUTES_IN_BETWEEN_QUERIES not defined in the .env file");
    process.exit(1);
  }

  if (process.env.DISCORD_WEBHOOK == undefined) {
    console.log("DISCORD_WEBHOOK  not defined in the .env file");
    process.exit(1);
  }

  console.clear();
  let first_iteration = true;

  while (true) {
    if (!first_iteration) {
      console.log(
        `Waiting ${process.env.MINUTES_IN_BETWEEN_QUERIES} minutes before checking again...`
      );
      await new Promise((r) =>
        setTimeout(r, 1000 * 60 * process.env.MINUTES_IN_BETWEEN_QUERIES)
      );
    }
    first_iteration = false;

    try {
      const res = await axios.get(
        "https://www.escapefromtarkov.com/preorder-page"
      );
      const dom = new JSDOM(res.data);

      let discountText = dom.window.document.querySelector(
        "#preorder_standard > div > div.foot > div:nth-child(2) > div.discount.inline > div > div.discount_text"
      )?.textContent;

      if (!discountText) {
        console.log("No discounts at the moment.");
        continue;
      }

      divIds = [
        "preorder_standard",
        "preorder_left_behind",
        "preorder_prepare_for_escape",
        "preorder_edge_of_darkness",
      ];

      let normalPrices = [];
      let discountPrices = [];

      //Fill normalPrices and discountPrices Array
      divIds.forEach((divId) => {
        let normalPrice = dom.window.document.querySelector(
          `#${divId} > div > div.foot > div:nth-child(2) > div.old.price.strikeout.inline > span`
        )?.textContent;

        let discountPrice = dom.window.document.querySelector(
          `#${divId} > div > div.foot > div:nth-child(3) > div.price.inline > span`
        )?.textContent;

        if (!normalPrice || !discountPrice) return null;

        normalPrices.push(parseFloat(normalPrice));
        discountPrices.push(parseFloat(discountPrice));
      });

      if (normalPrices.length != 4 || discountPrices.length != 4) {
        console.log("No discounts at the moment.");
        continue;
      }

      const content = `@here ${discountText} in Escape from Tarkov!\nhttps://www.escapefromtarkov.com/preorder-page\n\nDiscount Prices:\nStandard: ~~$${normalPrices[0]}~~ **$${discountPrices[0]}**\nLeft Behind: ~~$${normalPrices[1]}~~ **$${discountPrices[1]}**\nPrepare for Escape: ~~$${normalPrices[2]}~~ **$${discountPrices[2]}**\nEdge of Darkness: ~~$${normalPrices[3]}~~ **$${discountPrices[3]}**`;

      await axios.post(process.env.DISCORD_WEBHOOK, { content });

      console.log("There's discounts! Notified on Discord.");
    } catch (err) {
      console.error(err);
    }
  }
}

main();
