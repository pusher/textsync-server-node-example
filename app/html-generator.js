const generate = (port, endpoint) => {
  return `<html>
  <head>
    <title>TextSync Example Auth Server</title>
  </head>
  <body>
    <h1>SUCCESS</h1>
    <p>
      Your TextSync example auth server is up and running try sending a <code>POST</code>
      request to:
      <code>localhost:${port}${endpoint}</code>
    </p>
    <p>Example using <code>curl</code>
    <pre>
curl -X POST localhost:${port}${endpoint} \\
  -H "Content-Type: application/json" \\
  -d '{"docId": "example document"}'
    </pre>
  </body>
</html>`;
};

exports.generate = generate;
