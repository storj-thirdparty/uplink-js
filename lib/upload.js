const {EventEmitter} = require('events');
const stream = require('stream');
const bindings = require('../bindings');

module.exports = class Upload {
	constructor(_upload) {
		this._upload = _upload;
	}

	async iterable(iterable) {
		for await (const chunk of iterable) {
			await bindings.upload_write(this._upload, chunk, chunk.length);
		}

		await bindings.upload_commit(this._upload);
	}

	stream() {
		const ws = new stream.Writable();
		const channel = new EventEmitter();

		this.finish = new Promise(async resolve => {
			let finalCallback = () => {};

			await this.iterable({
				[Symbol.asyncIterator]() {
					ws._write = (chunk, encoding, done) => {
						console.log(chunk, encoding, done);

						channel.emit('iteration', {
							value: chunk,
							done: false
						});

						channel.once('ready', done);
					};

					ws._final = callback => {
						channel.emit('iteration', {
							done: true
						});

						finalCallback = callback;
					};

					return {
						async next() {
							channel.emit('ready');

							const response = await new Promise(resolve =>
									channel.once('iteration', resolve));

							return response;
						}
					};
				}
			});

			finalCallback();
			resolve();
		});

		return ws;
	}
}
