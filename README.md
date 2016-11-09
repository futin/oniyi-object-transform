# oniyi-object-transform [![NPM version][npm-image]][npm-url]

> offers simple transformations for object literals

## Installation

```sh
$ npm install --save oniyi-object-transform
```

## Usage

```js
const transform = require('oniyi-object-transform');

```

### transform(params) ⇒ <code>Object</code>
Transforms one object into another

**Kind**: global function  
**Returns**: <code>Object</code> - result of transforms applied to params.source  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | describing the function arguments |
| params.source | <code>Object</code> | source object to be transformed. takes precendence over `params.src` |
| [params.src] | <code>Object</code> | alias for `params.source` |
| [params.target] | <code>Object</code> | target object to join the transformed source into |
| [params.method] | <code>String</code> | name of method to be used when joining results from `pick` and `map`.                                          Options are: [`merge`, `assign`, `defaults`, `defaultsDeep`].                                          For details see lodash documentation: https://lodash.com/docs#assign |
| [params.map] | <code>Object</code> | key => value map of source properties to be copied to target with a different name |
| [params.whitelist] | <code>Array.&lt;String&gt;</code> | list of strings that are allowed as `params.map` values.                                          This feature is helpful when you transform from one object to a specified schema                                          and want to restrict target names of `params.map` to the list of schema keys |
| [params.pick] | <code>Array.&lt;String&gt;</code> | properties to be picked from source and copied to target with the same name |
| [params.parse] | <code>Object</code> | key => value map of target properties to be run through value parsers.                                          Value can be either of type `String` to reference one of the built-in parsers                                          [`integer`, `date`, `lowercase`, `uppercase`, `trim`]                                          or of type `Function` to be called with the original value as single argument. |


## License

Apache-2.0 © [Benjamin Kroeger]()


[npm-image]: https://badge.fury.io/js/oniyi-object-transform.svg
[npm-url]: https://npmjs.org/package/oniyi-object-transform
