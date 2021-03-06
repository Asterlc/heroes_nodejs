const BaseRoute = require('./base/baseRoute');
const Joi = require('joi');
const Boom = require('@hapi/boom');

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown();


class HeroRoutes extends BaseRoute {
    constructor(db) {
        super(); //chamar classe pai primeiro
        this.db = db;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                notes:"Listar cadastros da base",
                description: 'Listar cadastros da base',
                validate: {
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    headers,
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }),
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query;
                    let query = nome ? { $regex: `.*${nome}*.` } : {}

                    return this.db.read(query, parseInt(skip), parseInt(limit));
                } catch (error) {
                    console.log('Error heroRoutes:>>', error);
                    return Boom.internal();
                }
            }
        }
    };

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                tags: ['api'],
                notes:"Nome e poder",
                description: 'Cadastrar um herói',
                validate: {
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    headers,
                    payload: Joi.object({
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(3).max(20),
                    })
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder });
                    return {
                        message: 'Heroi cadastrado com sucesso!',
                        _id: result._id
                    }
                } catch (error) {
                    console.log('error post:>>', error);
                }
            }
        }
    };

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH', //atualização parcial
            config: {
                tags: ['api'],
                notes:"Atualizar um herói",
                description: 'Encontrar e atualizar',
                validate: {
                    failAction: (request, headers, error) => {
                        throw error;
                    },
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(20)
                    })
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    const { payload } = request;
                    // const dataString = JSON.stringify(payload);
                    // const data = JSON.parse(dataString);
                    const data = JSON.parse(JSON.stringify(payload));
                    const result = await this.db.update(id, data);

                    if (result.modifiedCount != 1 || !result) return { message: 'Não foi possível atualizar' };
                    return {
                        message: 'Heroi atualizado com sucesso!',
                        _id: id
                    }

                } catch (error) {
                    console.log('error put:>>', error)
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                // failAction: (request, headers, error) => {
                //     throw error;
                // },
                tags: ['api'],
                notes:"Deletar um herói",
                description: 'Encontrar e deletar',
                validate: {
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    const result = await this.db.delete(id);
                    if (result === false) return { message: "Falha na operação delete" };
                    return {
                        message: `Heroi removido com sucesso!`,
                        _id: `${id}`
                    };
                } catch (error) {
                    console.log('delete error:>>', error);
                }
            }
        };
    }
}

module.exports = HeroRoutes