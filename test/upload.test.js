const assert = require('assert');
const util = require('util');
const crypto = require('crypto');
const uplink = require('../lib/uplink');

const randomBytes = util.promisify(crypto.randomBytes);

let project;

jest.setTimeout(60000);

beforeAll(async () => {
	const access = await uplink.parseAccess(process.env.ACCESS);

	project = await access.openProject();
});

test('uploads 10m file via async iterator', async () => {
	const bucketName = 'node-storj';
	const fileName = '10m-upload-test';
	const fileSize = 1234567;
	const chunkSize = 1000;

	const upload = await project.uploadObject(bucketName, fileName);
	const uploadHash = crypto.createHash('sha256');

	async function *generateUpload() {
		let bytesLeft = fileSize;

		while(bytesLeft != 0) {
			const chunk = await crypto.randomBytes(Math.min(chunkSize, bytesLeft));
			uploadHash.update(chunk);

			yield chunk;

			bytesLeft -= chunk.length;
		}
	}

	await upload.iterable(generateUpload());

	const uploadHashDigest = uploadHash.digest('hex');

	const download = await project.downloadObject(bucketName, fileName);
	const downloadHash = crypto.createHash('sha256');

	for await(const chunk of download) {
		downloadHash.update(chunk);
	}

	const downloadHashDigest = downloadHash.digest('hex');

	assert.equal(uploadHashDigest, downloadHashDigest);
});
