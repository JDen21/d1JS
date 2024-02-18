## dg1JS
Just another node rest framework.<br />

install <br />
point app folder to serve function<br />
provide server data<br />
quickly turn function to route<br />

clone repo <br />
cd to sampleApp <br />
npm i dg1 <br />
npm i <br />
npm start <br />

```
./index.js
const serve = require('dg1');
const path = require('path');
serve(path.join(__dirname, './testApp'));
```
added promise support and sending of js objects as in res.send function. <br />
promisified function will work just as a normal function route. <br />
async or normal promise both should still work (untested). <br />
added feature resolvers, which will automatically resolve <br />
a server for the module provided if no __D1__SERVER__ is provided.
res.sendFile, auto infer content type for html, css, csv and xml. Otherwise use res.setContentType or it will throw error<br />
added resolveResponse which tries will try to get a response from a <br />
function route by testing for res.send call first and then the return value, will send error if nothing is found. <br />
dynamic path resolution <br />

sampleApp in repo <br />
npm install; npm install dg1; npm start;<br />
will start the server<br />
server should run at http://localhost:3000, running this path will show all valid routes.
