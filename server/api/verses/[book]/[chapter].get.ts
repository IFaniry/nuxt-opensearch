import { Client } from "@elastic/elasticsearch";
import { readFileSync } from "node:fs";
import { z } from "zod";

const inputSchema = z.object({
  book: z.string().min(1),
  chapter: z.coerce.number().min(1),
});

export default defineEventHandler(async (event) => {
  // or `.safeParse` for custom error messages
  // https://unjs.io/blog/2023-08-15-h3-towards-the-edge-of-the-web#runtime-type-safe-request-utils
  const { book, chapter } = await getValidatedRouterParams(event, (params) =>
    inputSchema.parse(params)
  );

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
        bool: {
          must: [
            {
              term: {
                "bookShortName.keyword": {
                  value: book,
                },
              },
            },
            {
              term: {
                chapter: {
                  value: chapter,
                },
              },
            },
          ],
          boost: 1,
        },
      },

      // query: {
      //   bool: {
      //     // must: [{ match: { bookShortName: book } }, { match: { chapter } }],
      //     filter: [
      //       {
      //         term: {
      //           bookShortName: {
      //             value: book,
      //             boost: 1.0,
      //           },
      //         },
      //       },
      //       // {
      //       //   term: {
      //       //     chapter: {
      //       //       value: chapter,
      //       //       boost: 1.0,
      //       //     },
      //       //   },
      //       // },
      //     ],
      //   },
      // },

      sort: [
        {
          bookRank: "asc",
          chapter: "asc",
          verse: "asc",
        },
      ],
      size: 200, // the longest chapter in the Bible is Psalms 119 with 22 sections or “stanzas” and 176 verses
      // query: {
      //   bool: {
      //     must: [{ match: { bookShortName } }, { match: { chapter } }],
      //   },
      // },
    },
  });

  return hits.hits.map((hit) => hit._source);
  /******************************************************* */
  // return [{ text: "dhdghdghdgh1" }, { text: "dsghdthdhdh2" }];
});
