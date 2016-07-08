'use strict';

const assert = require('assert');
const transform = require('../lib');

describe('oniyi-object-transform', function () {
  it('should throw when called without params argument', function () {
    assert.throws(
      transform,
      /params argument is required/
    );
  });

  it('should throw when called with no `source` or `src` param', function () {
    assert.throws(
      () => {
        transform({});
      },
      /either\s`params.source`\sor\s`params.src`\smust\sbe\sprovided/
    );
  });
});

describe('oniyi-object-transform map', function () {
  it('should rename property `foo` to `sports`', function () {
    const source = {
      foo: 'bar',
      lorem: 'ipsum',
    };

    const transformed = transform({
      source,
      map: {
        foo: 'sports',
      },
    });

    assert(transformed.sports, source.foo, 'we expect `transformed.sports` to have the same value as `source.foo`');
  });
});

describe('oniyi-object-transform pick', function () {
  it('should pick only property `foo` from source', function () {
    const source = {
      foo: 'bar',
      lorem: 'ipsum',
    };

    const transformed = transform({
      source,
      pick: ['foo'],
    });

    assert(Object.keys(transformed).length === 1, 'we expect `transformed` to only have one property');
    assert(transformed.hasOwnProperty('foo'), 'we expect `transformed` to have own property `foo`');
    assert.equal(transformed.foo, source.foo, 'we expect `transformed.foo` to equal `souroce.foo`');
  });

  it('should return empty object literal when `pick` param is empty array', function () {
    const source = {
      foo: 'bar',
      lorem: 'ipsum',
    };

    const transformed = transform({
      source,
      pick: [],
    });

    assert(Object.keys(transformed).length === 0, 'we expect `transformed` to have zero properties');
  });
});
