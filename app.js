'use strict';
const express = require('express');
const crypto = require('crypto');
const app = express();
app.enable('trust proxy');
const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

const getCustomers = (id) => {
    id = id || ""
    const query = datastore
        .createQuery('customers_info')
        .order('id', {
            descending: false
        });
    if (id != "") {
        query.filter('id', '=', id)
    }
    return datastore.runQuery(query);
};

app.get('/getCustomers', async (req, res, next) => {
    try {
        const [entities] = await getCustomers("");
        res.json(entities)
    } catch (error) {
        next(error);
    }
});

app.get('/getCustomer', async (req, res, next) => {
    try {
        const id = req.query.id
        const entities = await getCustomers(id);
        res.json(entities[0][0])
    } catch (error) {
        next(error);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
    console.log(`running on port ${PORT}`);
});

module.exports = app;