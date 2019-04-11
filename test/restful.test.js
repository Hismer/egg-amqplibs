'use strict';

const mock = require('egg-mock');

describe('test/restful.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/restful-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, restful')
      .expect(200);
  });
});
