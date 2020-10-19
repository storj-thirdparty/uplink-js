const {EventEmitter} = require('events');
const stream = require('stream');
const toStream = require('it-to-stream')
const bindings = require('../bindings');

module.exports = class Upload {
	constructor(_upload) {
		this._upload = _upload;
		this.commit = new Promise(resolve => this._commitResolve = resolve);
	}

	async iterable(iterable) {
		for await (const chunk of iterable) {
			await bindings.upload_write(this._upload, chunk, chunk.length);
		}

		await bindings.upload_commit(this._upload);
		this._commitResolve();
	}

	stream() {
		return toStream.writable(source => this.iterable(source));
	}
}
