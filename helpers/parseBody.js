const qs = require('querystring');

function parseBody(req, res, callback){
    var chunks = [];

    req.on('data', function(data){
        chunks .push(data);
    });

    req.on('error', function(err){
        console.log(err);
        res.statusCode = 500;
        res.end("Server error");
    });
    
    req.on('end', function(){
        /* Combines array objects as binary objects. */
        var buffer = Buffer.join(chunks); 

        /* Determine the content type of the post request. */
        /* Content-Type = text/plain;...optional stuff... */
        /* split will return mime type (see above format). */
        var type = req.headers['content-type'].split(';')[0]; 

        switch(type){
            
            case "multipart/form-data":
                /* 1. Extract boundary */
                var match = /boundary=(.+);?/.exec(req.headers['content-type']);
                /* 2. parse the body */
                parseMultipartBody(buffer, match[1]);
                callback(req, res);
                return;

            case "application/x-www-form-urlencoded":
                req.body = qs.parse(buffer.toString());
                callback(req, res);
                return;

            case "application/json":
                req.body = JSON.parse(buffer.toString());
                callback(req, res);
                return;

            case "text/plain":
                req.body = buffer.toString();
                callback(req, res);
                return;

            default:
                res.statusCode = 400;
                res.end("Bad request.");
        }
    });
}

function parseMultipartBody(buffer, boundary){
    
}