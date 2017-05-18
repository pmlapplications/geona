import express from 'express'; // Default import since express() is a function
import * as http from 'http';
import * as path from 'path';
import * as sharedExample from '../common/shared_example';
import { printVariable, incVariable } from './example';

let app = express();

app.use(express.static(path.join(__dirname, '../../html')));

let server = http.createServer(app);

server.listen(1337, function() {
  console.log('Server running at http://127.0.0.1:1337/');
});

let string = 'Testing the common module on the back end!';
sharedExample.consoleLog(string);
sharedExample.reverseLog(string);

printVariable();
incVariable();
printVariable();
