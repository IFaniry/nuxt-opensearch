import { Client } from "@elastic/elasticsearch";
import { readFileSync } from "node:fs";

export default defineEventHandler(async () => {
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

  const res = await client.sql.translate({
    query: `SELECT verse, text FROM "${elasticConfig.verseIndex}" WHERE bookShortName='Gen' AND chapter=1 ORDER BY verse ASC`,
    fetch_size: 120,
  });

  return res.query; // or res.size
});
