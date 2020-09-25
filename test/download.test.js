const assert = require('assert');
const crypto = require('crypto');
const uplink = require('../lib/uplink');

let project;

jest.setTimeout(240 * 1000);

beforeAll(async () => {
	const access = await uplink.parseAccess(process.env.ACCESS);

	project = await access.openProject();
});

test('downloads 100m file via async iterator', async () => {
	const download = await project.downloadObject('node-storj', '100m-file');

	const hash = crypto.createHash('sha256');

	let bytes = 0;

	for await (const chunk of download) {
		bytes += chunk.length;
		hash.update(chunk);
	}

	assert.equal(hash.digest('hex'), '1c29d0460c5d1542075ecd49b44b30900837cb6c7447286ab86304a6444232d3');
});

test('downloads 100m file via stream', async () => {
	const download = await project.downloadObject('node-storj', '100m-file');

	const hash = crypto.createHash('sha256');

	download
		.stream()
		.pipe(hash);

	const digest = await new Promise(resolve => hash.on('readable', resolve));

	assert.equal(hash.digest('hex'), '1c29d0460c5d1542075ecd49b44b30900837cb6c7447286ab86304a6444232d3');
});

test('downloads partial file as buffer', async () => {
	const download = await project.downloadObject('node-storj', '100m-file', {
		offset: 25000000,
		length: 13
	});

	const bytes = await download.buffer();

	assert.equal(bytes.toString('hex'), '12be81942bf1b4df8f2e919755');
});
