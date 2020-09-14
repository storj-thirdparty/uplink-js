const bindings = require('../bindings');
const Download = require('./download');
const Upload = require('./upload');

module.exports = class Project {
	constructor(_project) {
		this._project = _project;
	}

	async downloadObject(bucket, uploadPath, downloadOptions = null) {
		const { download } = await bindings.download_object(this._project, bucket, uploadPath, downloadOptions);

		return new Download(download);
	}

	async uploadObject(bucket, uploadPath, uploadOptions = null) {
		const { upload } = await bindings.upload_object(this._project, bucket, uploadPath, uploadOptions);

		return new Upload(upload);
	}

	async *listObjects(bucket, _options = {}}) {
		const options = {
			cursor: "",
			recursive: false,
			...options
		}

		const objects = await bindings.list_objects(this._project, bucket, options);

		for(let key in objects) {
			yield objects[key];
		}
	}

	async deleteObject(bucket, uploadPath) {
		return await bindings.delete_object(this._project, bucket, uploadPath);
	}

	async statObject(bucket, uploadPath) {
		return await bindings.stat_object(this._project, bucket, uploadPath);
	}

	async createBucket(bucket) {
		await bindings.create_bucket(this._project, bucket);
	}

	async ensureBucket(bucket) {
		return await uplink.ensure_bucket(this._project, bucket);
	}

	async *listBuckets(options) {
	 	const buckets = await uplink.list_buckets(this._project, bucket);

		for(const bucket of buckets) {
			yield bucket;
		}
	}
}
