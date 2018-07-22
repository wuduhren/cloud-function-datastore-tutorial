# Overview
By Cloud Function, we can save a log (or anything) to our Datastore without a server. A server-less log system!

Cloud Function is a light-weight solution to deploy your service, especially when your need is to simply handle HTTP/HTTPS requests. Datastore can handle large amount of flow, charge relatively less price. And both of them have an user-friendly web console.

Since Google Cloud Platform hasn't release the Cloud function's implementation on datastore, I decided to write a tutorial.

# Steps
* Setup Cloud Datastore
	* Create a Google Cloud Platform Project
	* Setup Cloud Datastore
	* Setup example code
* Setup Cloud Function
	* Enable cloud function API
	* Install Cloud SDK
	* Install Cloud Function SDK
	* Deploy
* Save a log
	* Cloud Function
	* Send a request to Cloud Function
    * HTTP/HTTPS request from browser
	* Check the log on Datastore
* OS & APIs versions

# Setup Cloud Datastore
## Create a Google Cloud Platform Project
1. Go to <https://console.cloud.google.com/projectcreate>.
    ```
    If you don't have an account yet, you need to sign up.
    You might need your credit card info.
    But no worry, we are far from getting pass the free-tier limit.
    ```

2. Enter a project name, such as `cloud-function-datastore-tutorial`, create.

    <img src="https://imgur.com/Gc8GVxu.png" width="600px"/>
3. Remember you project id, it should be like: `cloud-function-datastore-tutorial` or `cloud-function-datastore-tutorial-123`.
3. Wait until the project is created. It would take about a minutes.

## Setup Cloud Datastore
1. Go to the datasotre web console.

	<img src="https://imgur.com/GvdbsvI.png" width="600px"/>
	
	<img src="https://imgur.com/DC5I3qu.png" width="600px"/>

2. Create entity.

    <img src="https://imgur.com/5eSSR5m.png" width="600px"/>
3. Select a region. For example: `asia-northeast-1`.
4. Keep `Namespace`, `Key identifier` as default. `Kind` enter `user-log`.

5. Add property. 
    ```
    Name: uid
    Type: Integer
    Value: 0
    Check the "Index this property".
    ```
    Click Done.

6. Add property.
    ```
    Name: log
    Type: Text
    Value: "My very first log on datastore!"
    ```
    Click Done.

7. Add property.
    ```
    Name: time_create
    Type: Integer
    Value: 0
    Check the "Index this property".
    ```
    Click Done. Click Create.

    <img src="https://imgur.com/233X99s.png" width="600px"/>

    Then, You will see the very first log you just created.
        <img src="https://imgur.com/nkI4xHN.png" width="600px"/>

## Setup example code
1. Obtain datastore credential, this credential can let your code access datastore.

    <img src="https://imgur.com/LGOSar2.png" width="600px"/>
    
    * Click the bar on the top left Navigation menu on the [GCP console](https://console.cloud.google.com/datastore)
    * Click `Credentials` in the `APIs & Services` section.
    * Click `Create credentials`, `Service account key`
    * Set a `Service account`. `Service account name` enter `datastoreuser`. `Role` select `Datastore`->`Cloud Datastore User`.
    * Select JSON. Create. Download to your desktop. **Do not share it on the internet**

    The credential looks like
    ```
    {
      "type": "service_account",
      "project_id": "cloud-function-datastore-tutorial",
      "private_key_id": "xxxxx",
      "private_key": "xxxxx",
      "client_email": "xxxxx",
      "client_id": "xxxxx",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "xxxxx"
    }
    ```

2. Download [cloud-function-datastore-tutorial](https://github.com/wuhduhren/cloud-function-datastore-tutorial/archive/master.zip), you will see.
    * `index.js`, which is the function we will later on deploy on cloud function.
    * `datastore-credential.json`, replace this file with the credential you obtained.
    * `README.md`
    * `package.json`, within it, the cloud datastore nodeJS library, which is installed in the file already.
    * Others are the cloud datastore nodeJS library.

3. Replace `datastore-credential.json` with the credential you obtained.
4. Change the variable in index.js. 
    If you forget your project id, click the project name on the top off the navigation bar.
    You will see a list of Name and ID.
    ```
    const datastore = new Datastore({
        projectId: 'YOUR_PROJECT_ID',
        keyFilename: 'YOUR_DATASTORE_CREDENTIAL_FILE_NAME.json'
    });
    
    // change it to something like
    const datastore = new Datastore({
        projectId: 'cloud-function-datastore-tutorial-123',
        keyFilename: 'cloud-function-datastore-tutorial-44b44d44b4bb.json'
    });
    ```

## Note
1. Check out the [Datastore official guide](https://cloud.google.com/datastore/docs/quickstart).
2. If you need to query by single names (column), for example, uid, you can simply index the uid.
3. But if you need to query or order by multiple names (column), you will need to setup `composite indexes`.
    Its a bit complecated, I will leave it to the next tutorial.
    Or check out the [official doc](https://cloud.google.com/datastore/docs/concepts/indexes).
4. If you want to delete the whole KIND (table), you need to remove all entities (rows).

# Setup Cloud Function
## Enable Cloud Function API
1. Click the bar on the top left Navigation menu on the [GCP console](https://console.cloud.google.com/datastore)
2. Find `Cloud Functions` in the `COMPUTE` section.
3. Enable billing acount. You might need to setup the payment information. Don't worry, we are far from getting pass the free-tier limit.
4. Enable API.
5. Next, instead of creating cloud function on the web console, our code is a bit complicated, so we need to deploy our code by Cloud SDK.

## Install Cloud SDK
Check out the [cloud SDK guide](https://cloud.google.com/sdk/docs/) if needed.

```
$ python -V
# Python 2.7.10
```

Download the sdk file on [the offical guide](https://cloud.google.com/sdk/docs/).
Place it on the directory you want to install. For example: `home/directory/`

```
$ cd google-cloud-sdk
$ bash install.sh
# enter n
# enter y
# enter ENTER
$ sudo bin/gcloud init
```
The browser will show a login window. Login. Allow.

```
You are logged in as: [your.gmail@gmail.com].
```
Choose the project.

By the way, if you need to change the project
```
$ gcloud config set project <project-id>
# for example
$ gcloud config set project rpg-log-test
```


## Install Cloud Function SDK
First, make sure the cloud SDK is installed.
```
$ gcloud components update && gcloud components install beta
```
Check out the offical [cloud function sdk guide](https://cloud.google.com/functions/docs/quickstart) if needed.


## Deploy
```
# go to the example code directory
$ cd cloud-function-datastore-tutorial
$ gcloud beta functions deploy savelog --trigger-http --region asia-northeast1
```

You should see
```
Deploying function (may take a while - up to 2 minutes)...done.                
availableMemoryMb: 256
entryPoint: rpglog
httpsTrigger:
  url: https://asia-northeast1-cloud-function-datastore-tutorial.cloudfunctions.net/savelog
labels:
  deployment-tool: cli-gcloud
name: projects/cloud-function-datastore-tutorial/locations/asia-northeast1/functions/savelog
runtime: nodejs6
serviceAccountEmail: cloud-function-datastore-tutorial@appspot.gserviceaccount.com
sourceUploadUrl: https://storage.googleapis.com/gcf-upload-asia-northeast1-7158586f-ae4b-4f57-8e10-f1627de6d371/67772a3d-9745-439d-8b29-76f18a3252ff.zip?GoogleAccessId=service-858392701215@gcf-admin-robot.iam.gserviceaccount.com&Expires=1531637449&Signature=tIpithyM7%2BNzFYDGZ%2Bey8Awntg3%2BPyoitpVtfA%2Fszm4FZg49sfBCCkBHtjKVWNI7XZP2VLOGSp3wBfY4p82MhY7mwZ%2FgA4rPpAy2KTIC1KqHikI%2BYe3aPkXhZC9oUjtFDFaROC2pJnRCNTHafRNN%2F7lKZ1Sj8d4mvgEqSTBPeyUCK%2Fu%2FvgH4h3P39SYuoFUO%2BCTdUtlg5fonrZ3A83oyWgFcvOLriTjIM7W0LKdSmBtII5jnSKepmI84lJMb82q0CFLYpAfe04cHFtdS7%2BwnVslX%2FmRS%2B0HFZEJX%2FcJLKjcN8jbyADud64TGDeXUVpXu59pH4L5ihR5UXfosiXgR6g%3D%3D
status: ACTIVE
timeout: 60s
updateTime: '2018-07-15T06:21:40Z'
versionId: '1'
```

You can deploy again if you change something.
For more info about [deploy](<https://cloud.google.com/sdk/gcloud/reference/beta/functions/deploy>).

Go to the cloud function web console, you should see the function `savelog` with a green check.

<img src="https://imgur.com/Fjrnjqz.png" width="300px"/>

## Note
If you plan to use cloud function on your product, definitely worth a looks at its [best practice](https://cloud.google.com/functions/docs/bestpractices/tips).

# Save a log
## Cloud Function
The  Cloud function will look for index.js then execute the function `savelog`.
```
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
```
This function took two parameters. `uid` and `log`.

## Send a request to Cloud Function
Send an HTTP request to from browser. This request will go to the index.js and send back an response.
```
https://asia-northeast1-cloud-function-datastore-tutorial.cloudfunctions.net/savelog?log=i_funcking_did_it&uid=1
```

<img src="https://imgur.com/Yw3cKcl.png" width="600px"/>

### HTTP/HTTPS request from browser:
1. `https://asia-northeast1-cloud-function-datastore-tutorial.cloudfunctions.net/savelog` is the url endpoint of the cloud function. You can find the URL when you click the function, then Trigger.

<img src="https://imgur.com/zzRuLmK.png" width="300px"/>
<img src="https://imgur.com/vcGtPm2.png" width="300px"/>

2. Use `?` to seperate the endpoint URL and parameters. Use `=` to asign values to parameters. And use `&` to seperate each parameters and value pairs.

3. For example, if you want to save `log`: `i_funcking_did_it` with an `uid` of `1`
    ```
    First, you need the endpoint.
    https://asia-northeast1-cloud-function-datastore-tutorial.cloudfunctions.net/savelog
    Use ? to seperate parameters and URL endpoint.
    Asign i_funcking_did_it to log, log=i_funcking_did_it
    Use & to seperate parameters and value pairs.
    Asign 1 to uid, uid=1
    Then you get https://asia-northeast1-cloud-function-datastore-tutorial.cloudfunctions.net/savelog?log=i_funcking_did_it&uid=1
    ```

## Check the log on Datastore

<img src="https://imgur.com/AFsNHZW.png" width="400px"/>

There you have it! We save a log to Datastore without a server! Most of all, the log can be sent from anywhere in the world, browsers, mobiles, servers...

#OS & APIs versions
```
Cloud Function:  v1 (still in Beta)
Cloud Datasotre: v1
Cloud Datasotre NodeJS Library: 1.4.1
MacOS High Sierra 10.13.3
Google Cloud SDK 208.0.2
Google Cloud SDK beta 2018.06.22
```