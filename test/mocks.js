var sinon = require('sinon'),
    _ = require('lodash');

module.exports = {
    IrcCommandHandler: function (modules) {
        var handlers = {};
        modules.map(function (m) {
            m({
                addHandler: function (command, handler) {
                  handlers[command] = handler;
                }
            });
        });
        var stubs = {
            emit: sinon.stub(),
            connection: {
                write: sinon.stub()
            }
        };
        var handler = _.mapValues(stubs, function spyify(value) {
            if (_.isFunction(value)) {
                return sinon.spy(value);
            } else if (_.isObject(value)) {
                return _.mapValues(value, spyify);
            }
        });
        return {
            handlers: _.mapValues(handlers, function(value) {
                return value.bind(handler);
            }),
            stubs: stubs,
            spies: handler
        };
    }
};
