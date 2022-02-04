const { default: axios } = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
require("dotenv").config();
const fs = require("fs");

function setTerminalTitle(title) {
  process.stdout.write(
    String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
  );
}

async function main() {
  setTerminalTitle("Notificador de descuentos en Escape from Tarkov");
  if (process.env.HORAS_ENTRE_QUERIES == undefined) {
    console.log("HORAS_ENTRE_QUERIES no definido en el archivo .env");
    process.exit(1);
  }

  if (process.env.DISCORD_WEBHOOK == undefined) {
    console.log("DISCORD_WEBHOOK no definido en el archivo .env");
    process.exit(1);
  }

  console.clear();
  console.log(`Verificando cada ${process.env.HORAS_ENTRE_QUERIES} horas.`);
  let first_iteration = true;

  while (true) {
    try {
      if (first_iteration) {
        await new Promise((r) =>
          setTimeout(r, 1000 * 60 * 60 * process.env.HORAS_ENTRE_QUERIES)
        );
        first_iteration = false;
      }
      const res = await axios.get(
        "https://www.escapefromtarkov.com/preorder-page"
      );

      function getPrice(divId) {
        const dom = new JSDOM(res.data);
        const price =
          dom.window.document.getElementById(divId).childNodes[1].childNodes[9]
            .childNodes[3].childNodes[1].childNodes[1].childNodes[0]
            .textContent;

        return parseFloat(price);
      }

      const standard = getPrice("preorder_standard");
      const leftBehind = getPrice("preorder_left_behind");
      const prepareForEscape = getPrice("preorder_prepare_for_escape");
      const edgeOfDarkness = getPrice("preorder_edge_of_darkness");

      const newPrices = [
        standard,
        leftBehind,
        prepareForEscape,
        edgeOfDarkness,
      ];

      let isDiscountActive = false;
      let prices_array = [];

      try {
        prices_array = fs
          .readFileSync("previousPrices.txt")
          .toString()
          .split("\n");
      } catch (err) {
        if (err.code === "ENOENT") {
          console.log(
            "No se escontro el archivo para comparar los precios, se creara uno nuevo con los precios actuales"
          );
          fs.writeFileSync("previousPrices.txt", newPrices.join("\n"));
          continue;
        } else {
          throw err;
        }
      }

      prices_array.forEach((prevPrice, index) => {
        if (prevPrice > newPrices[index]) {
          isDiscountActive = true;
        }
      });

      if (!isDiscountActive) {
        continue;
      }

      fs.writeFileSync("previousPrices.txt", newPrices.join("\n"));

      await axios.post(process.env.DISCORD_WEBHOOK, {
        content: `@here Hay descuentos en Escape from Tarkov! Precios actuales:\n\nStandard: $${standard}\nLeft Behind: $${leftBehind}\nPrepare for Escape: $${prepareForEscape}\nEdge of Darkness: $${edgeOfDarkness}`,
      });

      console.log("Hay un descuento! Enviado a discord.");
    } catch (err) {
      console.error(err);
    }
  }
}

main();
