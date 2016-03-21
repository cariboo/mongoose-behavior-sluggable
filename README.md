# mongoose-behavior-sluggable
A concurrency safe mongoose plugin that populates a Mongoose Schema with a slug (that may be unique), from one or more existing properties.

### MIT Licence

This plugin is based on the work of Dariusz Półtorak (https://github.com/dariuszp/mongoose-sluggable) and the concurrency safe code has been inspired by Jason Choy (https://github.com/jjwchoy/mongoose-shortid).

### 1.0.0

### How to use?

Add plugin:

````
var mongooseSluggable = require('mongoose-behavior-sluggable');
MySchema.plugin(mongooseSluggable, {
  field    : 'slug',
  source   : ['firstname', 'lastname'],
  unique   : true,
  updatable: false
});
````

You can add any of these options :

| Option  | Description |
| ------------- | ------------- |
| **field**  | Name of field that will be used to store slug. *Default "slug"* |
| **unique**  | Should slug be unique for this collection? *Default "false"*. |
| **source**  | Name of fields that will be used to create slug. You can pass string or array of strings? *Default "title"*. |
| **separator**  | Separator used to replace all non a-z and 0-9 characters. *Default "-"*. |
| **updatable**  | If set to *"false"*, not empty slug will not be changed by the plugin. *Default "true"*. |
| **charmap**  | Set a char map to replace unhandled characters. *Default "true"*. |
| **multicharmap**  | Set a multi char map to replace unhandled characters. *Default "true"*. |

This plugin is based on the slug plugin for slug generation. You can find more about charmap and multicharmap in the slug module documentation (https://www.npmjs.com/package/slug)

**About unique !**
When using "unique: true", the plugin will not throw any error when slug already exists. It will append separator and an incremental number at the end.