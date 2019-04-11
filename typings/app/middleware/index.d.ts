// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportRestful = require('../../../app/middleware/restful');

declare module 'egg' {
  interface IMiddleware {
    restful: typeof ExportRestful;
  }
}
