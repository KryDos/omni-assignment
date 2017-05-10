const http = require('http');
const director = require('director');
const repo = require('./repository');

const port = process.env.PORT || 3000;
var repository = new repo();

// handle get requests
// and return 200 or 304 status
const handleGet = function(client, version) {
    var self = this;
    const etag = self.req.headers['if-none-match'];

    // currently I think it's fine to have 4 parameters
    // for this method, but consider to change it to
    // object in case new argument will be added
    repository.getDataSinceTag(etag, client, version, (data) => {
        const results = data.results;
        var headers = {
            'Content-Type': 'application/json'
        };

        if (data.latest_record_timestamp) {
            headers['Etag'] = data.latest_record_timestamp;
        }

        if (Object.keys(results).length === 0) {
            self.res.writeHead(304, headers);
            self.res.end();
        } else {
            self.res.writeHead(200, headers);
            self.res.end(JSON.stringify(results));
        }

    });
};

// handle post request and
// save object passed from the request
const handlePost = function(client, version) {
    var self = this;
    var json_body = '';

    // collecting request body
    this.req.on('data', (data) => {
        json_body += data;
    });

    // save body to db
    this.req.on('end', () => {
        json_body = JSON.parse(json_body); // convert string to Object

        repository.storeData(json_body); // save it

        self.res.writeHead(201, {'Content-Type': 'application/json'}); // always success :|
        self.res.end();
    });
};

// below is just routes registration and
// server creation.
const router = new director.http.Router();
const server = http.createServer((req, res) => {
    router.dispatch(req, res, (err) => {
        if (err) {
            res.writeHead(404);
            res.end('Nothing is here');
        }
    });
});

router.get('/config/:client/:version', handleGet);
router.post('/config', {stream: true}, handlePost);

server.listen(port);
