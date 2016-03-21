var mongoose = require('mongoose'),
    generateSlug = require('slug');

var defaultSave = mongoose.Model.prototype.save;

module.exports = function (schema, options) {

    options = options || {};
    var slug = options.field ? String(options.field) : 'slug',
        unique = options.unique ? true : false,
        source = options.source ? options.source : 'title',
        separator = options.separator ? String(options.separator) : '-',
        updatable = ((options.updatable) || (options.updatable === undefined)) ? true : false,
        charmap = (options.charmap) ? options.charmap : generateSlug.charmap,
        multicharmap = (options.multicharmap) ? options.multicharmap : generateSlug.multicharmap,
        symbols = (options.symbols || options.symbols === undefined) ? true : false;

    schema.add({ slug: {type: String, index: true, trim: true, unique: unique } });

    schema.pre('save', function(next) {
        if (this.slug === undefined || updatable) {
            this.slug = this.makeSlug();
        }
        next();
    });

    schema.methods.makeSlug = function(suffix) {

        var self = this;

        var value = '',
            errorFields = [],
            fields = [];

        if (typeof source === 'string') {
            errorFields.push(source);
            fields.push(String(this[source] || '').trim());
        } else if (source instanceof Array) {
            for (var i = 0; i < source.length; i++) {
                errorFields.push(source[i]);
                fields.push(String(this[source[i]] || '').trim());
            }
        } else {
            throw new Error('Source can be an array or a string');
        }

        if (suffix !== undefined) {
            fields.push(suffix);
        }
        value = fields.join(separator);

        value = generateSlug(value, {
            replacement: separator,
            lower: true,
            charmap: charmap,
            multicharmap: multicharmap,
            symbols: symbols
        });

        if (value.length === 0) {
            throw new Error('One of the fields is required: ' + String(errorFields.join(', ')));
        }

        return value;
    };

    mongoose.Model.prototype.save = function(options, callback) {

        if (typeof options === 'function') {
            callback = options;
            options = null;
        }

        for (key in this.schema.tree) {

            var fieldName = key
            if (fieldName === slug) {

                var self = this;
                function attemptSave(slug_counter) {
                    slug_counter = slug_counter || 1;

                    defaultSave.call(self, function(err, obj) {
                        if (err && err.code == 11000 && err.errmsg.indexOf(slug) !== -1) {
                            self.slug = self.makeSlug(slug_counter);
                            attemptSave(slug_counter + 1);
                        } else {
                            // TODO check these args
                            if (callback && typeof callback === 'function') {
                                callback(err, obj);
                            }
                        }
                    });
                }
                attemptSave();
                return;
            }
        }

        defaultSave.call(this, callback);
    };
};
