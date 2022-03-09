# uplink-js

[![Build Status](https://travis-ci.org/storj-thirdparty/uplink-js.svg?branch=master)](https://travis-ci.org/storj-thirdparty/uplink-js)
[![Coverage Status](https://coveralls.io/repos/github/storj-thirdparty/uplink-js/badge.svg?branch=master)](https://coveralls.io/github/storj-thirdparty/uplink-js?branch=master)

ES9+ compatible [Storj](https://storj.io) bindings for [Node](https://nodejs.org/en/), for use with [Tardigrade](https://tardigrade.io/).

> *This repository is not being actively developed. Consider using [Gateway MT](https://docs.storj.io/dcs/getting-started/gateway-mt/#generate-credentials-to-the-gateway-mt) with the new [AWS S3 SDK](https://github.com/aws/aws-sdk-js-v3).*

## Usage

### Example

``` javascript
const uplink = require('node-storj');

(async () => {

	// parse access
	const access = await uplink.parseAccess('your-access-here');

	// open project
	const project = await access.openProject();

	// initiate file download
	const download = await project.downloadObject('my-bucket', 'file.txt');

	// read chunks to program output
	for await (const chunk of download) {
		process.stdout.write(chunk);˜
	}

})();

```

### Example with streams

``` javascript
// initiate file download
const download = await project.downloadObject('my-bucket', 'file.txt');

download
	.stream()
	.pipe(process.stdout);
```


### API

### `Project`

#### `Promise`<`Download`> project.downloadObject(bucket, path)

Returns a Promise which resolves to a `Download` object.

``` javascript
const download = await project.downloadObject('my-bucket', 'my-path');
```

#### `Promise`<`Upload`> project.uploadObject(bucket, path)

Returns a Promise which resolves to an `Upload` object.

``` javascript
const upload = await project.uploadObject('my-bucket', 'my-path');
```

#### `Async Iterable` <`StorjObject`> project.listObjects(bucket, options)

Iterates through all objects in a bucket.

#### `Promise` project.deleteObject(bucket, path)

Delete an object.

##### options

###### prefix

Specifies from which prefix to list files.

type: `string`<br>
default: '/'

###### recursive

type: `bool`<br>
default: false`

``` javascript
for await (const object of project.listObjects('my-bucket')) {
	console.log(object.key);
}
```

###  `Download`

Implements [asyncIterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) which yields [Buffers](https://nodejs.org/api/buffer.html) as the download is streamed.

``` javascript
for await (const chunk of download) {
	console.log(chunk.toString())
}
```

#### [`ReadableStream`](https://nodejs.org/api/stream.html#stream_readable_streams) download.stream()

Returns a ReadableStream compatible with Node.js libraries and frameworks.

``` javascript
download.stream()
	.pipe(fs.createWriteStream('hello-world.txt'));
```

#### `Promise`<`Buffer`> download.buffer()

Returns a Promise that resolves to a Buffer containing the entire download.

``` javascript
const buf = await download.buffer();

console.log(buf.toString())
```

### `Upload`

#### `Promise` upload.iterable(iterable)

Uploads from an iterable that yields buffers.

``` javascript
async function* streamData() {
	yield Buffer.from('Hello, ');

	await new Promise(resolve => setTimeout(resolve, 100);

	yield Buffer.from('World!');
}

await upload.iterable(stremData());
```

#### [`WritableStream`](https://nodejs.org/api/stream.html#stream_writable_streams) upload.stream()

Returns a WritableStream compatible with Node.js libraries and frameworks.

``` javascript
fs.createReadStream('my-file.txt')
	.pipe(upload.stream());
```
