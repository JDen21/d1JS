## d1JS
Just another node rest framework.

install <br />
point app folder to serve function<br />
provide server data<br />
quickly turn function to route<br />

|
|_/testApp/ see sample in repos
|_index.js
```
./index.js
const serve = require('dg1/core');
const path = require('path');
serve(path.join(__dirname, './testApp'));
```