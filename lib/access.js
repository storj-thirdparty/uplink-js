const bindings = require('../bindings');
const Project = require('./project');

module.exports = class Access {
	constructor(_access) {
		this._access = _access;
	}

	async openProject() {
		const { project } = await bindings.open_project(this._access);

		return new Project(project);
	}
};
