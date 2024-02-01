## d1JS
Just another node rest framework.

install <br />
point app folder to serve function<br />
provide server data<br />
quickly turn function to route<br />

sample usage in /testApp

```
./index.js
const serve = require('d1/core');
const path = require('path');
serve(path.join(__dirname, './app'));
```