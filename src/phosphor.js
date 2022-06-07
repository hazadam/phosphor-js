const compile = require("vue").compile;
const compiled = new Map();

function pushNew(array, element) {
    if (array.indexOf(element) === -1) {
        array.push(element);
    }
}

module.exports = function(obj) {
    const extended = Object.assign(obj, {
        render: function() {
            const cacheKey = this.noCache ? this : this.$.type.name;
            if (!compiled.has(cacheKey)) {
                const renderFunction = compile(this.template, { delimiters: ['{', '}'] });
                compiled.set(cacheKey, renderFunction);
            }
            return compiled.get(cacheKey)(...Array.from(arguments));
        }
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
