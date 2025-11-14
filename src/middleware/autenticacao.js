export function autenticacao(request, reply, done) {
  const { autorizacao } = request.headers;

  // Se não houver token ou for inválido
  if (!autorizacao || autorizacao !== "token") {
    reply.status(403).send({ message: "Não autorizado" });
    return; // importante: não chamar done() depois de enviar resposta
  }

  done(); // só chama se a autenticação for bem-sucedida
}
