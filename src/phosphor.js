const compile = require("vue").compile;
const compiled = new Map();

function pushNew(array, element) {
    if (array.indexOf(element) === -1) {
        array.push(element);
    }
}

module.exports = function(obj) {
    const _setup = obj.setup;
    const extended = Object.assign(obj, {
        setup: function(props) {
            const setupResult = _setup(props);
            const cacheKey = props.noCache ? obj : obj.name;
            if (!compiled.has(cacheKey)) {
                const renderFunction = compile(props.template, {delimiters: ['{', '}']});
                compiled.set(cacheKey, renderFunction);
            }
            obj.render = compiled.get(cacheKey);

            return setupResult;
        },
    });
    if (extended.props) {
        if (Array.isArray(extended.props)) {
            pushNew(extended.props, 'template');
            pushNew(extended.props, 'noCache');
        } else {
            extended.props.template = String;
            extended.props.noCache = Boolean;
        }
    } else {
        extended.props = {
            template: String,
            noCache: Boolean
        };
    }
    return extended;
}
