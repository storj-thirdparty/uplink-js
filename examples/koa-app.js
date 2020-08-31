const Koa = require('koa');
const uplink = require('../lib/uplink');

(async () => {

	const app = new Koa();

	const access = await uplink.parseAccess(process.env.ACCESS);

	const project = await access.openProject();

	app.use(async ctx => {
		const download = await project.downloadObject("node-storj", "index.html");

		ctx.response.set("Content-Type", "text/html");

		ctx.body = download.stream();
	});

	app.listen(3000);

})();
