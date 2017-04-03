const kinveyBaseUrl = 'https://baas.kinvey.com/';
const kinveyAppKey = 'kid_rkTWoZY2e';
const kinveyAppSecret = '8c7b22a18e02478ab63c215b7787200b';
const kinveyAppAuthHeaders = 'Basic ' + btoa(kinveyAppKey + ':' + kinveyAppSecret);

// function getKinveyUserAuthHeaders() {
//     return {
//         'Authorization': 'Basic ' + sessionStorage.getItem('authtoken')
//     }
// }

function saveAuthInSession(userInfo) {
    let userAuth = userInfo._kmd.authtoken;
    sessionStorage.setItem('authToken', userAuth);
    let userId = userInfo._id;
    sessionStorage.setItem('userId', userId);
    let username = userInfo.username;
    $('#spanMenuLoggedInUser').text('Welcome, ' + username + '!');
    $('#viewUserHomeHeading').text('Welcome, ' + username + '!');
}

function register() {
    let userData = {
        username: $('#registerForm input[name=username]').val(),
        password: $('#registerForm input[name=password]').val(),
        name: $('#registerForm input[name=name]').val()
    };
    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
        headers: kinveyAppAuthHeaders,
        data: userData,
        success: registerSuccessful
    });

    function registerSuccessful(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        showUserHomeView();
        showInfo('User registration successful.');
    }
}

function login() {
    let userData = {
        username: $('#loginForm input[name=username]').val(),
        password: $('#loginForm input[name=password]').val()
    };
    $.ajax({
        method: 'POST',
        url: kinveyBaseUrl + 'user/' + kinveyAppKey + '/login',
        headers: kinveyAppAuthHeaders,
        data: userData,
        success: loginSuccessful
    });

    function loginSuccessful(userInfo) {
        saveAuthInSession(userInfo);
        showHideNavigationLinks();
        showUserHomeView();
        showInfo('Login successful');
    }
}

function logout() {

}