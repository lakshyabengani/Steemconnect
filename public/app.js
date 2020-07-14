const steemconnect = require('steemconnect');

// init steemconnect
let client = new steemconnect.Client({
    app: 'titandlt',
    callbackURL: 'http://localhost:3000',
});
// get login URL
let link = client.getLoginURL();

// acquire access_token and username after authorization
let access_token = new URLSearchParams(document.location.search).get(
    'access_token'
);
console.log(access_token);
let username = new URLSearchParams(document.location.search).get('username');
console.log(username);

let lt = '',
    ut = '',
    lo = '',
    jt = '',
    tr = '',
    t = '',
    n = ''
if (access_token) {
    // set access token after login
    client.setAccessToken(access_token);
    console.log('access token set')
    // Logout button
    lt = `<a href="#" onclick='logOut()'>Log Out</a>`;
    // User name after successfull login
    ut = `<p>User: <b>${username}</b></p>`;
    // Get user details button
    lo = `<a href="#" onclick='getUserDetails()'>Get User details</a>`;
    // User details JSON output
    jt = `<pre id="userDetailsJSON"></pre>`;
    //Transfer button
    tr = `<a href="#" onclick='transfer()'>Transfer Money</a>`;
    //trtansfer Details
    dt = `<pre id="transferDetail"></pre>`
    t = lt + ut + lo + jt + tr + dt;
} else {
    tr =`<a href="#" onclick='transfer()'>Transfer Money</a>`;
    //trtansfer Details
    dt = `<pre id="transferDetail"></pre>`
    // Login button
    n = `<a href=${link}>Log In</a>`;
    t = tr + dt + n
}

// set template
document.getElementById('content').innerHTML = t;

//LogIn function , set access token
// window.logIn = () =>{
//     var params = {};

//     // The "username" parameter is required prior to log in for "Steem Keychain" users.
//     if (steemconnect.useSteemKeychain) {
//         params = { username: 'titandlt' };
//     }

//     client.login(params, function(err, token) {
//         console.log(err, token);
//         client.setAccessToken(token);
//     });    
// }

// Logout function, revoke access token
window.logOut = () => {
    client.revokeToken(function(err, res) {
        if (res && res.success) {
            access_token = null;
            document.location.href = '/';
        }
    });
    return false;
};

// Get User details function, returns user data via Steemconnect API
window.getUserDetails = () => {
    client.me(function(err, res) {
        if (res) {
            const user = JSON.stringify(res, undefined, 2);
            document.getElementById('userDetailsJSON').innerHTML = user+access_token;
        }
    });
};

//transfer amounts.
window.transfer=()=>{
    const ops = [['transfer', {
        from: username,
        to: 'thewall4095',
        amount: '0.001 STEEM',
        memo: 'Transfer with SteemConnect demo'
      }]];
    client.broadcast(ops,function(err, result) {
        console.log('Transfer result', err, result);
        if (result)
        document.getElementById('transferDetail').innerHTML = result.id || result.result.id
        if (err) 
        document.getElementById('transferDetail').innerHTML = err
    });
};