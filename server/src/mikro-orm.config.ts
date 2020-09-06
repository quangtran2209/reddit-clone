import { Post } from "./entities/Post";
import { __prod__ } from "./constants";

export default {
    dbName: 'reddit-clone',
    user: 'postgres',
    password: 'example',
    type: 'postgresql',
    entities: [Post],
    debug: !__prod__
} as const;
