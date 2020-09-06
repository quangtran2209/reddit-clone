"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = require("./entities/Post");
const constants_1 = require("./constants");
exports.default = {
    dbName: 'reddit-clone',
    user: 'postgres',
    password: 'example',
    type: 'postgresql',
    entities: [Post_1.Post],
    debug: !constants_1.__prod__
};
//# sourceMappingURL=mikro-orm.config.js.map