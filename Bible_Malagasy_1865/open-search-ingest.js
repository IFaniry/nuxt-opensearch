import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";
import { BOOKS } from "./books.constant.js";
import { Client } from "@elastic/elasticsearch";
import pLimit from "p-limit";
import config from "config";

const elasticConfig = config.get("elastic");

// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-connecting.html#auth-tls
const client = new Client({
  node: elasticConfig.node,
  auth: {
    username: elasticConfig.username,
    password: elasticConfig.password,
  },
  // # The certificate fingerprint can be calculated using openssl x509 with the certificate file:
  // openssl x509 -fingerprint -sha256 -noout -in /path/to/http_ca.crt
  // caFingerprint: elasticConfig.caFingerprint,
  tls: {
    // From the installation directory config\\certs\\http_ca.crt
    ca: readFileSync(elasticConfig.ca),
    rejectUnauthorized: !elasticConfig.local,
  },
});

// Pour tester la connexion avant d'aller plus loin
// https://www.elastic.co/guide/en/cloud/current/ec-getting-started-node-js.html#ec_get_the_elasticsearch_and_config_packages
// client
//   .info()
//   .then((response) => console.log(response))
//   .catch((error) => console.error("error", error));

const MG_BIBLE_INDEX = "mg-bible-verses";

await client.indices.delete({ index: MG_BIBLE_INDEX });

await client.indices.create({ index: MG_BIBLE_INDEX });

const limit = pLimit(4);

async function elasticSearchIndex(book) {
  const bookHtml = await fs.readFile(`./${book?.PathName}`, {
    encoding: "utf8",
  });
  const $ = cheerio.load(bookHtml);

  $("h4").each(async function () {
    const chapter = Number($(this).text().trim());

    let thisVerse = $(this).next("p");
    while (thisVerse.is("p")) {
      const verseNum = Number(thisVerse.children("sup").first().text().trim());
      const verseText = thisVerse.contents().not("sup").text().trim();
      console.log(`Processing ${book.FullName} ${chapter}:${verseNum}`);
      await client.index({
        index: MG_BIBLE_INDEX,
        body: {
          bookFullName: book.FullName,
          bookChapterQty: book.ChapterQty,
          bookShortName: book.ShortName,
          bookRank: Number(
            book.PathName.substring(0, book.PathName.indexOf("_"))
          ),
          chapter,
          verse: verseNum,
          text: verseText,
        },
      });
      thisVerse = thisVerse.next("p");
    }
    await client.indices.refresh({ index: MG_BIBLE_INDEX });
  });
}

const input = BOOKS.map((book) => limit(() => elasticSearchIndex(book)));

await Promise.all(input).catch(console.log);
