const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
	projectId: 'YOUR_PROJECT_ID',
	keyFilename: 'YOUR_DATASTORE_CREDENTIAL_FILE_NAME.json'
});
const kindName = 'user-log';

exports.savelog = (req, res) => {
	let uid = req.query.uid || req.body.uid || 0;
	let log = req.query.log || req.body.log || '';

	datastore
		.save({
			key: datastore.key(kindName),
			data: {
				log: log,
				uid: datastore.int(uid),
				time_create: datastore.int(Math.floor(new Date().getTime()/1000))
			}
		})
		.catch(err => {
		    console.error('ERROR:', err);
		    res.status(200).send(err);
		    return;
		});

	res.status(200).send(log);
};