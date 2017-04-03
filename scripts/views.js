function showHideNavigationLinks() {
    if(sessionStorage.getItem('authtoken') == null) {
        // no logged in user
        $('#navigation .anonymous').show();
        $('#navigation .user-only').hide();
        $('#spanLoggedInUser').text('');
    } else {
        // we have logged in user
        $('#navigation .anonymous').hide();
        $('#navigation .user-only').show();
        $('#spanLoggedInUser').text('Welcome, ' + sessionStorage.getItem('username') + '!');
    }
}

function showCorrectHomeView() {
    if (sessionStorage.getItem('username')) {
        showUserHomeView();
    } else {
        showAppHomeView();
    }
}

function showUserHomeView() {
    $('#viewUserHome h1').text('Welcome, ' + sessionStorage.getItem('username') + '!');
    showView('viewUserHome');
}

function showAppHomeView() {
    showView('viewAppHome');
}

function showView(viewName) {
    // hide all views and show the selected view only
    $('#container > section').hide();
    $('#' + viewName).show();
}

function showLoginView() {
    showView('viewLogin');
    $('#loginForm').trigger('reset');
}

function showRegisterView() {
    $('#registerForm').trigger('reset');
    showView('viewRegister');
}