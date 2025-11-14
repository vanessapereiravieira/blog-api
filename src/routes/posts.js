import { autenticacao } from "../middleware/autenticacao.js";

const posts = [];

export function rotasPost(app) {
    // Rota GET /posts
    app.get('/posts', { onRequest: [autenticacao] }, (request, reply) => {
        return reply.status(200).send(posts);
    });

    // Rota POST /posts - criar novo post
    app.post('/posts', { onRequest: [autenticacao] }, (request, reply) => {
        const { usuario, titulo, contexto } = request.body;

        const post = {
            id: posts.length + 1,
            owner: usuario,
            title: titulo,
            content: contexto,
            date: new Date().toISOString(),
            comment: [], 
            likes: []    
        };

        posts.push(post); // adiciona ao array
        return reply.status(201).send(post); // retorna o post criado
    });

    // Rota POST /posts/:id/comment - adicionar comentário a um post
    app.post('/posts/:id/comment', { onRequest: [autenticacao] }, (request, reply) => {
        const { id } = request.params;
        const postIndex = posts.findIndex(post => post.id === +id); // busca pelo id do post

        if (postIndex === -1) {
            return reply.status(404).send({ message: "Post não encontrado" });
        }

        const { usuario, contexto } = request.body;

        const comment = {
            owner: usuario,
            content: contexto,
            date: new Date().toISOString()
        };

        posts[postIndex].comment.push(comment); // adiciona comentário ao post

        return reply.status(201).send(posts[postIndex]); // retorna post atualizado
    });

    // Rota PATCH /posts/:id/like - adicionar ou remover like a um post
    app.patch('/posts/:id/like', { onRequest: [autenticacao] }, (request, reply) => {
        const { id } = request.params;
        const postIndex = posts.findIndex(post => post.id === +id); // busca pelo id do post

        if (postIndex === -1) {
            return reply.status(404).send({ message: "Post não encontrado" });
        }

        const { usuario } = request.body;

        // verifica se usuário já curtiu
        const likesIndex = posts[postIndex].likes.findIndex(like => like === usuario);

        if (likesIndex >= 0) {
            posts[postIndex].likes.splice(likesIndex, 1); // remove like existente
            return reply.status(200).send(posts[postIndex]); // retorna post atualizado
        }

        posts[postIndex].likes.push(usuario); // adiciona like ao post
        return reply.status(201).send(posts[postIndex]); // retorna post atualizado
    });

    // Rota DELETE /posts/:id - deletar um post
    app.delete('/posts/:id', { onRequest: [autenticacao] }, (request, reply) => {
        const { id } = request.params;
        const postIndex = posts.findIndex(post => post.id === +id); // busca pelo id do post

        if (postIndex === -1) {
            return reply.status(404).send({ message: "Post não encontrado" });
        }

        const {usuario} = request.body;

        if(usuario != post[postIndex].owner){
            return reply.status(400).send({menssage: 'Você não é dono do post, para poder apagar o mesmo'});
        }

        posts.splice(postIndex, 1)

        return reply.status(204).send(); // retorna post atualizado
    });

    }
