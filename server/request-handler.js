/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept,X-Parse-REST-API-Key, X-Parse-Javascript-Key, X-Parse-Application-Id, X-Parse-Client-Version, X-Parse-Session-Token, X-Requested-With, X-Parse-Revocable-Session, Content-Type',
  'access-control-max-age': 10 // Seconds.
};

var storage = [];
var knownURL = ['/classes/messages'];

var requestHandler = (request, response) => {
  
  console.log('typeof request: ', typeof request);
  console.log('typeof response: ', typeof response);
  
  // Initializing constants and variables
  
  var statusCode;
  const { method, url } = request;
  var headers = defaultCorsHeaders;
  var isMethodIncluded = defaultCorsHeaders['access-control-allow-methods'].includes(method);
  var isURLknown = knownURL.includes(url);
  
  ////////////////////////////////////////
  console.log('\n');
  console.log('Serving request type ' + method + ' for url ' + url);

  console.log('is ' + method + ' included: ' + defaultCorsHeaders['access-control-allow-methods'].includes(method));
  console.log('is ' + decodeURI(url) + ' known: ' + knownURL.includes(url));
 
   /*******************************************/
  /* Another way of implementing request-handler */  
  /*******************************************/
  
  if(isMethodIncluded && isURLknown) {
       
    let body = [];
    
  if (method === 'OPTIONS') {

    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();
    
  } else if(method === 'POST') {
    
    request.on('data', (chunk) => {
      
      body.push(chunk); 
      
    }).on('end', () => {
        
      body = Buffer.concat(body).toString();

      console.log('body : ', body);
      
      statusCode = 201; 
      var storedBody = JSON.parse(body);
      body.objectId = Date.now();
      storage.push(storedBody);   
       
                      
      console.log('storage: ', storage);
      
      headers['Content-Type'] = 'application/json';

      // .writeHead() writes to the request line and headers of the response,
      // which includes the status and all headers.
      response.writeHead(statusCode, headers);
      
      var responseBody = {};
      var results = [];     
      
      for (var i = 0; i < storage.length; i++) {
        results.push(storage[i]);
      }
      
      responseBody.results = results;  
      //console.log(response);   
      response.end(JSON.stringify(responseBody));
      
    });
     
  } else if (method === 'GET') {
    
    statusCode = 200; 
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    var responseBody = {};
    var results = [];     
    
    for (var i = 0; i < storage.length; i++) {
      results.push(storage[i]);
    }
    
    responseBody.results = results;  
    console.log(responseBody);   
    response.end(JSON.stringify(responseBody));
      
  }
  } else {
    
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  }
  
 /*********************************************************************/
 
  /*******************************************************/
  /* Using nodejs guide of implementing request-handler */  
  /*******************************************************/
  
  
  // if (isMethodIncluded && isURLknown) {
    
  //   let body = [];
  //   request.on('error', (err) => {
  //     // This prints the error message and stack trace to `stderr`.
  //     console.error(err.stack);
  //   }).on('data', (chunk) => {
  //     body.push(chunk);
  //   }).on('end', () => { // When message is fully received
      
  //     body = Buffer.concat(body).toString();
  //     response.on('error', (err) => {
  //       console.error(err);
  //     });

  //     console.log('body : ', body);
      
  //     if (method === 'POST') {
  //       statusCode = 201; 
  //       storage.push(JSON.parse(body));   
  //     } else {
  //       statusCode = 200;             
  //     }
                      
  //     console.log('storage: ', storage);
      
  //     headers['Content-Type'] = 'application/json';

  //     // .writeHead() writes to the request line and headers of the response,
  //     // which includes the status and all headers.
  //     response.writeHead(statusCode, headers);
      
  //     var responseBody = {};
  //     var results = [];     
      
  //     for (var i = 0; i < storage.length; i++) {
  //       results.push(storage[i]);
  //     }
      
  //     responseBody.results = results;  
  //     //console.log(response);   
  //     response.end(JSON.stringify(responseBody));
      
  //   });
  // } else {
  //   // Error : method not found
    
  //   response.statusCode = 404;
  //   response.end();
     
  // }

/**************************************************/

};



  
module.exports = requestHandler;
//exports.defaultCorsHeaders = defaultCorsHeaders;
