const bindings = require('../bindings');
const Access = require('./access');

module.exports = {
    async parseAccess(accessString) {
     	const { access } = await bindings.parse_access(accessString);

        return new Access(access);
    }
};
