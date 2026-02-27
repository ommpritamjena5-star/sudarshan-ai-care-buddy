const http = require('http');

const data = JSON.stringify({
    name: "Tester",
    email: "test4@example.com",
    password: "password123"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let chunks = '';
    res.on('data', d => chunks += d);
    res.on('end', () => console.log(chunks));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
