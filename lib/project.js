const bindings = require('../bindings');
const Download = require('./download');

module.exports = class Project {
	constructor(_project) {
		this._project = _project;
	}

	async downloadObject(bucket, uploadPath, downloadOptions = null) {
		const { download } = await bindings.download_object(this._project, bucket, uploadPath, downloadOptions);

		return new Download(download);
	}
}
