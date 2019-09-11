
'use strict';

const express = require('express');
const crypto = require('crypto');

const app = express();
app.enable('trust proxy');

const {Datastore} = require('@google-cloud/datastore');

// Instantiate a datastore client
const datastore = new Datastore();


const insertRecord = record => {
  return datastore.save({
    key: datastore.key('customers_info'),
    data: record,
  });
};


const getRecords = (id) => {
	id = id || ""
  const query = datastore
    .createQuery('customers_info')
    .order('id', {descending: false});
	if (id != ""){
	query.filter('id', '=', id)
	}
  return datastore.runQuery(query);
};

app.get('/add_customer', async (req, res, next) => {
  // Create records to be stored in the database
  const record1 = {
	id: "01",
	name: "John"
  };
  
  const record2 = {
	id: "02",
	name: "Bob"
  };
  
  const record3 = {
	id: "03",
	name: "Alice"
  };
  
  const record4 = {
	id: "04",
	name: "Harry"
  };

  try {
    await insertRecord(record1);
	await insertRecord(record2);
	await insertRecord(record3);
	await insertRecord(record4);
	return "";
  } catch (error) {
    next(error);
  }
});


app.get('/get_all_customers', async (req, res, next) => {
  // get all customers

  try {
	const id =req.query.id
    const [entities] = await getRecords(id);
    res
      .status(200)
      .set('Content-Type', 'application/json')
	  .json(entities)
	  .end()
  } catch (error) {
    next(error);
  }
});


app.get('/get_customer_by_id', async (req, res, next) => {
  // get record by id

  try {
	const id =req.query.id
    const [entities] = await getRecords(id);
	res
      .status(200)
      .set('Content-Type', 'application/json')
	  .json(entities)
	  .end()
  } catch (error) {
    next(error);
  }
});
	
const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`running on port ${PORT}`);
});

module.exports = app;
