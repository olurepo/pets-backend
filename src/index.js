const Controllers = require('./controllers');
const Cache = require('./cache');

module.exports = {
    ...Controllers,
    ...Cache,
};
