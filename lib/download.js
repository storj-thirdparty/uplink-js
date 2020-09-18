const stream = require('stream');
const bindings = require('../bindings');

module.exports = class Download {
	constructor(_download, _options) {
		this._download = _download;
		this._options = {
			offset: 0,
			length: Infinity,
			..._options
		};
	}

	[Symbol.asyncIterator]() {
		const buffer = Buffer.alloc(1000);
		let length = null;
		let totalRead = 0;

		const _this = this;

		return {
			async next() {
				if(length === null) {
					const {content_length} = (await bindings.download_info(_this._download)).system;

					length = Math.min(content_length, _this._options.length);
				}

				if(totalRead === length) {
					await bindings.close_download(_this._download);

					return {
						value: Buffer.alloc(0),
						done: true
					};
				}

				const bytesRead = (await bindings.download_read(_this._download, buffer, buffer.length)).bytes_read;

				totalRead += bytesRead;

				const value = buffer.slice(0, bytesRead);

				return {
					value,
					done: false
				};
			}
		};
	}

	stream() {
		const readable = new stream.Readable();

		let waiting = false;

		const iter = this[Symbol.asyncIterator]();

		readable._read = async () => {
			if(waiting === true) {
				return;
			}

			waiting = true;

			const { value, done } = await iter.next();

			readable.push(value);

			if(done === true) {
				readable.push(null);
			}

			waiting = false;
		};

		return readable;
	}

	async buffer() {
		let buffer = Buffer.alloc(0);

		for await (const chunk of this) {
			buffer = Buffer.concat([ buffer, chunk ]);
		}

		return buffer;
	}

	async info() {
		const { info } = await bindings.download_info(this._download);

		return info;
	}
}
