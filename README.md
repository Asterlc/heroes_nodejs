# 07-refactor

Refatoração da pasta 06-multidb

Utilização da biblioteca mocha e assert nativo

O código refatorado apresenta melhor dinamicidade para outros modelos de dados para testes.


npm i para todas as dependencias e versões do código fonte.
necessário criar pasta access com as credenciais do banco e suas respectivas bases.

Access: Criar objeto com propriedades pwd(senha) e user(usuário).

ICrud(Interface): classe abstrata para correção de métodos ainda não implementados

Context(Base): Classe responsável por gerenciar o 'contexto' de qual banco escolher

Postgres/Mongodb(Classe respectiva): Respectivas classes com seus métodos e bibliotecas específicas(Sequelize/Mongoose) para persistência dos dados.


Nota utiização do docker para utilização de imagens localmente e linhas de comando para gerenciar criação de usuários.



