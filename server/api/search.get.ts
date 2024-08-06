import { Client } from "@elastic/elasticsearch";
import { readFileSync } from "node:fs";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  // or `.safeParse` for custom error messages
  // https://unjs.io/blog/2023-08-15-h3-towards-the-edge-of-the-web#runtime-type-safe-request-utils
  const { q } = await getValidatedQuery(event, (params) =>
    searchSchema.parse(params)
  );

  /******************************************************* */
  const elasticConfig = useRuntimeConfig();
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

  // client
  // .info()
  // .then((response) => console.log(response))
  // .catch((error) => console.error("error", error));

  // const res = await client.sql.query({
  //   query: `SELECT verse, text FROM "${elasticConfig.verseIndex}" WHERE bookShortName='${book}' AND chapter=${chapter} ORDER BY verse ASC`,
  // });

  // const verses: {
  //   verse: number;
  //   text: string;
  // }[] = res.rows.map((row) => ({
  //   verse: row[0],
  //   text: row[1],
  // }));
  // return verses;

  // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-filter-context.html
  const { hits } = await client.search<{
    bookFullName: string;
    bookChapterQty: number;
    bookShortName: string;
    bookRank: number;
    chapter: number;
    verse: number;
    text: string;
  }>({
    index: elasticConfig.verseIndex,
    body: {
      query: {
        match: { text: q },
      },
      highlight: {
        fields: {
          text: { type: "plain" },
        },
      },
      sort: [
        {
          bookRank: "asc",
          chapter: "asc",
          verse: "asc",
        },
      ],
    },
  });

  return hits.hits.map((hit) => hit._source);
  /******************************************************* */
});
