const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

http.createServer(function (req, res) {
	const url = req.url;
	console.log(url);

	switch (url) {
		case '/':
			console.log('main');
			res.write('<h1>Main page</h1>');
			break;
		case '/contact':
			console.log('contact');
			let data = fs.readFileSync('./contact.html', { encoding: 'utf8', flag: 'r' });
			res.write(data);
			break;
			res.statusCode = 404;
			console.log(404);
	}
	res.end();
}).listen(PORT, HOSTNAME);