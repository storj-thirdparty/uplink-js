# node-storj

ES9+ compatible [Storj](https://storj.io) bindings, for use with [Tardigrade](https://tardigrade.io/).

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
	const download = await project.downloadObject("my-bucket", "file.txt");

	// read chunks to program output
	for await (const chunk of download) {
		process.stdout.write(chunk);
	}

})();

```

### Example with streams

``` javascript
// initiate file download
const download = await project.downloadObject("my-bucket", "file.txt");

download
	.stream()
	.pipe(process.stdout);
```
