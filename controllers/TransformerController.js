module.exports = function (app) {
    var mongoose = require('mongoose');
    var Transformer = app.models.Transformer;
    
    Transformer.remove({}, function (err) {
        if (err) {
            throw err;
        } else {
            console.log('todas os transformadores foram removidos...');
            for ( var i=0; i<10; i++ ){
                var trans = new Transformer();
                trans.status = 'disconnected';
                trans.save(function (err, doc) {
                    if (err) {
                        throw err;
                    }
                    console.log('Transformador criado! _id: '+ doc._id);
                });
            }
        }
    });
    
    var TransformerController = {
        index: function (req, res) {
            var page = 0;

            if (req.query.page) {
                page = req.query.page == 1 ? 0 : req.query.page * 6 - 6;
            }

            Transformer.find({}, {}, { skip: page, limit: 6 }, function (err, docs) {
                if (err) {
                    res.json({
                        code: 500,
                        data: 'Opa, olha o erro: ' + err
                    });
                } else {
                    res.json({
                        code: 200,
                        data: docs
                    });
                }
            });
        },

        store: function (req, res) {

            if (req.body.status) {
                var trans = Transformer(req.body);

                trans.save(function (err, doc) {
                    if (err) {
                        res.json({
                            code: 500,
                            data: 'Opa, olha o erro: ' + err
                        });
                    } else {
                        res.json({
                            code: 200,
                            data: doc
                        });
                    }
                });
            } else {
                res.json({
                    code: 400,
                    data: {
                        'status': 'deve ser preenchida'
                    }
                });
            }
        },

        show: function (req, res) {

            Transformer.findById(req.params.id, function (err, doc) {
                if (err) {
                    res.json({
                        code: 500,
                        data: 'Opa, olha o erro: ' + err
                    });
                } else if (!doc) {
                    res.json({
                        code: 404,
                        data: 'Transformer não foi encontrado!'
                    });
                } else {
                    res.json({
                        code: 200,
                        data: doc
                    });
                }
            });
        },

        update: function (req, res) {

            Transformer.findById(req.params.id, function (err, doc) {
                if (err) {
                    res.json({
                        code: 500,
                        data: 'Opa, olha o erro: ' + err
                    });
                } else if (!doc) {
                    res.json({
                        code: 404,
                        data: 'Transformer não foi encontrado!'
                    });
                } else {

                    doc.status = req.body.status;
                    doc.save();

                    res.json({
                        code: 200,
                        data: doc
                    });
                }
            });
        },

        delete: function (req, res) {

            Transformer.findByIdAndRemove(req.params.id, function (err, doc) {
                if (err) {
                    res.json({
                        code: 500,
                        data: 'Opa, olha o erro: ' + err
                    });
                } else if (!doc) {
                    res.json({
                        code: 404,
                        data: 'Transformer não foi encontrado!'
                    });
                } else {
                    res.json({
                        code: 200,
                        data: {
                            message: 'removido com sucesso',
                            obj: doc
                        }
                    });
                }
            });
        },

        get_connected: function (req, res) {
            var query = {
                status: req.params.connection
            };
            
            if (query.status == 'connected' || query.status == 'disconnected') {
                Transformer.find(query, function (err, docs) {
                    if (err) {
                        res.json({
                            code: 500,
                            data: 'Opa, olha o erro: '+ err
                        });
                    } else if (!docs) {
                        res.json({
                            code: 404,
                            data: 'Nenhum transformador disponível...'
                        });
                    } else {
                        res.json({
                            code: 200,
                            data: docs
                        });
                    }
                });
            } else {
                res.json({
                    code: 500,
                    data: 'Esperava receber connected ou disconnected como parametro!!'
                });
            }
        }
    };

    return TransformerController;

}
