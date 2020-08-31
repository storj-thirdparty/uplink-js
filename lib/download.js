const stream = require('stream');
const bindings = require('../bindings');

module.exports = class Download {
	constructor(_download) {
		this._download = _download;
	}

	[Symbol.asyncIterator]() {
		const buffer = Buffer.alloc(5);
		let length = null;
		let totalRead = 0;

		const _this = this;

		return {
			async next() {
				if(length === null) {
					length = (await bindings.download_info(_this._download)).system.content_length;
				}

				const bytesRead = (await bindings.download_read(_this._download, buffer, buffer.length)).bytes_read;

				totalRead += bytesRead;

				return {
					value: buffer,
					done: totalRead === length
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
