const Koa = require('koa');
const mime = require('mime-types');
const uplink = require('../lib/uplink');

(async () => {
	const app = new Koa();

	const access = await uplink.parseAccess(process.env.ACCESS);
	const bucket = process.env.BUCKET;

	console.log(process.env.ACCESS, process.env.BUCKET);

	const project = await access.openProject();

	const renderListing = ({ path, listing }) => `
		<!DOCTYPE html>
		<head>
			<title>storj-browser</title>

			<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">

			<style>
			main, ul {
				margin-top: 2rem;
			}
			</style>

		</head>
		<body>

			<main class="container">

				<h1>storj-browser</h1>

				<p>built with <a href="https://github.com/storj/node-storj3">node-storj3</a></p>

				<ul class="list-group">
					<li class="list-group-item"><a href="../">../</a></li>

					${listing.map(key => `
						<li class="list-group-item"><a href="${key}">${key}</a></li>
					`).join("")}
				</ul>

			</main>

		</body>
	`;

	app.use(async ctx => {
		const path = decodeURI(ctx.path).slice(1);

		let stat;

		try {
			stat = await project.statObject(bucket, path);
		} catch(err) {

		}

		console.log(stat);

		if(typeof stat !== 'object') {
			// list directory
			const listing = [];

			for await (const object of project.listObjects(bucket, { prefix: path })) {
				listing.push(object.key.slice(path.length));
			}

			ctx.body = renderListing({ path, listing });
		} else {
			// return object stream
			const download = await project.downloadObject(bucket, path);

			ctx.set('Content-Type', mime.lookup(path));
			ctx.set('Content-Length', stat.system.content_length);

			ctx.body = download.stream();
		}
	});

	app.listen(3000);

})().catch(err => { console.log(err); process.exit(0) });
