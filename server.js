const http= require('http');
const url= require('url');
const string_decoder= require('string_decoder').StringDecoder;
const fileSystem= require('fs');
const path= require('path');

let parsed_request;
let protocol, port;
const filesList= [];

fileSystem.readdir(path.join(__dirname, "./src"), (err, files) => {
	files.forEach(file => {
		filesList.push(file);
	});
});

//http server-----------------------------------------------------------------------------------------------------
const http_server= http.createServer((request, response) => {
	parseRequestData(request, response);
});

http_server.listen(5000, function(err)
{
	if(err)
		console.log(err);
	else
		console.log('\x1b[32m%s\x1b[40m', "HTTP  server listening on port " + 5000);
});

//------------------------------------------------------------------------------------------------------------
const parseRequestData= function(request, response)
{
	let parsed_url= url.parse(request.url,true); 
	let trimmed_path= parsed_url.pathname.replace(/^\/+|\/+$/g, '');
	let quary_params= parsed_url.query;
	let headers= request.headers;
	let utf8_decoder= new string_decoder('utf-8');
	let buffer= "";
	let request_data= {};
	request.on('data',  function(data_stream){buffer= buffer + utf8_decoder.write(data_stream);});

	request.on('end', function()
	{
		buffer= buffer + utf8_decoder.end();
		request_data= 
		{
			'trimmed_path' : trimmed_path,
			'quary_params' : quary_params,
			'headers': headers,
			'request_method' : request.method.toUpperCase(), 
			'payload' : buffer,
			'raw' : request
		};

		serverHandler(request_data, response);
	});
};

const serverHandler= (request, response) => {console.log(request.trimmed_path)

	filesList.forEach(file => {
		if(file === request.trimmed_path.replace(/^\/+|\/+$/g, ''))
		{
			readFile("/src/" + file, (err, data) => {
				response.writeHeader(200, {"Content-Type": "text/javascript"});
				response.end(data);
				return;
			});
		}
	});

	if(request.trimmed_path.replace(/^\/+|\/+$/g, '') === "")
	{
		readFile("index.html", (err, data) => {
			response.writeHeader(200, {"Content-Type": "text/html"});
			response.end(data);
		});
	}
};

const readFile= (file_name, callback) => {
	//file of specified name and path will be read and data will be sent back
	fileSystem.readFile(path.join(__dirname, file_name), 'utf-8', function(err, data)
	{
		if(data == undefined) callback("");
		else callback(err, data);
	});
};

const remove_path_prefix= function(fullpath)//trims the path so that the router doesnt have to look at the entire path
{
	let prefix= fullpath.split('/');
	fullpath= "";
	for (let i = prefix.length - 1; i >= 1; i--) 
		fullpath= fullpath + prefix[i];
	return fullpath;
}


