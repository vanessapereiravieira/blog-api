import fastify from "fastify";
import { rotasPost } from "./routes/posts.js";

const app = fastify({
    logger:{
        transport: {
        target: 'pino-pretty', // indica que quer usar o pino-pretty
        }
    }
})

app.register(rotasPost)

app.listen({
    host: "0.0.0.0",
    port: 3333
})