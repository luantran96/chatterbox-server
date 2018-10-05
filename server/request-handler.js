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

  //const { method, url } = request;

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
  
  // Initializing constants and variables
  
  var statusCode;
  const { method, url } = request;
  var headers = defaultCorsHeaders;
  
  ////////////////////////////////////////
  
  console.log('Serving request type ' + method + ' for url ' + url);

  console.log('is ' + method + ' included: ' + defaultCorsHeaders['access-control-allow-methods'].includes(method));
  console.log('is ' + url + ' known: ' + knownURL.includes(url));
  
  if(defaultCorsHeaders['access-control-allow-methods'].includes(method) && knownURL.includes(url)) {
    
     
    let body = [];
    request.on('error', (err) => {
      // This prints the error message and stack trace to `stderr`.
      console.error(err.stack);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => { // When message is fully received
      
      body = Buffer.concat(body).toString();
      response.on('error', (err) => {
        console.error(err);
      });

      console.log('body : ', body);
      
         if (method === 'POST') {
          statusCode = 201; 
          storage.push(JSON.parse(body));   
          } else {
            // The outgoing status.
          statusCode = 200;             
          }
          
          
      
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
  } else {
    // Error : method not found
    
    response.statusCode = 404;
    response.end();
    
    
  }
  
};



  
module.exports = requestHandler;
//exports.defaultCorsHeaders = defaultCorsHeaders;
