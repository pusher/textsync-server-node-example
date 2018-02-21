const generate = endpoint => {
  return `<html>
  <head>
    <title>TextSync Auth Server Example</title>
  </head>
  <body>
    <h1>TextSync Auth Server Example</h1>
    <p>Your TextSync example auth server is up and running.</p>
    <p>Your <code>authEndpoint</code> is:</p>
    <pre>
<span id="host"></span>${endpoint}
    </pre>
    <p>Try sending an example <code>POST</code> request using <code>curl</code>
    <pre>
curl -X POST <span id="host"></span>${endpoint} \\
  -H "Content-Type: application/json" \\
  -d '{"docId": "example document"}'
    </pre>
  </body>
  <script>
    document
      .querySelectorAll('#host')
      .forEach(node => {
        node.innerText = window.location.origin
      })
  </script>
</html>`;
};

exports.generate = generate;
