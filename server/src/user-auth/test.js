import jwtAuth from './jwtauth.js';

let user = {
    username: 'Chris',
    email: 'email@gmail.com'
};

let date = Date.now();

let expDate = date + (1000 * 600);

let token = jwtAuth.jwtGenerate(user, expDate, date, 'password');

console.log(token);

let verify = jwtAuth.jwtVerify(token, 'password2');
console.log(verify);
// jwtGenerate(user, expDate, date, 'password');