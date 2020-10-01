const os = require('os');

const urls = {
	'linux-x64': 'https://dl.google.com/go/go1.15.2.linux-amd64.tar.gz',
	'linux-arm64': 'https://dl.google.com/go/go1.15.2.linux-arm64.tar.gz',
	'darwin-x64': 'https://dl.google.com/go/go1.15.2.darwin-amd64.tar.gz'
};

const key = `${os.platform()}-${os.arch()}`;

console.log(urls[key]);
