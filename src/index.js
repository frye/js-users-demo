// index.js:
// This file defines the Express server and loads the routes from the routes.js file.
// Just a comment for test

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const YAML = require('yamljs');

app.use(express.json());

// Load routes from routes.js file
const routes = require('./routes');
app.use('/api', routes);

// function to fetch users from api/users and display in a bootstrap table
async function indexPage() {
  let contentStart = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title>Users API</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  </head>
  <body>

  <div class="container">

    <!-- blank row -->
    <div class="row">
      <div class="col-sm-12">
        <p></p>
      </div>
    </div>

    <div class="jumbotron text-center">
      <h1>Users API</h1>
      <p>Simple site with list of users.</p>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <h3>API Docs</h3>
          <a href="/redoc" class="btn btn-primary" role="button">API Docs</a>
        </div>
      </div>
    </div>
  `;

  let userTable = fetch(`http://localhost:${port}/api/users`)
    .then((response) => response.json())
    .then((data) => {
      // use bootstrap to style the table
      // Build the table headers and rows based on the data
      // Table headers and rows should be dynamic based on the returned data

      function tableHeaders(data) {
        let headers = '';
        for (let i = 0; i < data.length; i++) {
          headers += `<th scope="col">${data[i]}</th>`;
        }
        return headers;
      }

      function tableRows(data) {
        let rows = '';
        for (let i = 0; i < data.length; i++) {
          rows += `<td>${data[i]}</td>`;
        }
        return rows;
      }
      let table = `
      <table class="table table-striped">
        <thead>
      `;

      table += `
          <tr>
            ${tableHeaders(Object.keys(data[0]))}
          </tr>

        </thead>
        <tbody>
    `;

      for (let i = 0; i < data.length; i++) {
        table += `
          <tr>
            ${tableRows(Object.values(data[i]))}
          </tr>
        `;
      }

      table += `
          </tbody>
        </table>
      `;

      return table;
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  let contentEnd = `
  </div>

  </body>
  </html>
  `;

  let response = contentStart;

  // wait for userTable to be populated
  await userTable.then((table) => {
    response += table;
  });

  response += contentEnd;

  return response;
}


// Default route which serves link to API documentation
app.get('/', async(req, res) => {
  // Log the request to the console with the source IP address, request method and URL
  console.log(`${req.ip} ${req.method} ${req.url}`);
  // log query parameters
  console.log(req.query);
  // send the index page as the response
  res.send(await indexPage());
});

// serve openapi.yaml as openapi.json
app.get('/openapi.json', (req, res) => {
  // set the response header to indicate that the response is JSON
  res.setHeader('Content-Type', 'application/json');
  // send the openapi.yaml file as JSON
  res.send(YAML.load('./src/openapi.yaml'));
});

// Serve redoc content
app.get('/redoc', (req, res) => {
  // set the response header to indicate that the response is HTML
  res.setHeader('Content-Type', 'text/html');
  // send the redoc content as the response
  res.send(require('./redoc'));
});

//AI_start
// Export the app for testing purposes
module.exports = app;
//AI_end

// Start server only when not being required (i.e., not during testing)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

