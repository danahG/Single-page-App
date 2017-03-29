function startApp() {

    sessionStorage.clear();
    showHideNavigationLinks();
    showCorrectHomeView();

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

    // bind the navigation links anonymous
    $('#homeAppNavigationLink').click(showAppHomeView);
    $('#loginNavigationLink').click(showLoginView);
    $('#registerNavigationLink').click(showRegisterView);

    // TODO bind the navigation links user only


    // TODO bind the form submit buttons
    $("#formLogin").submit(loginUser);
    $("#registerForm").submit(registerUser);
    $("form").submit(function(event) { event.preventDefault() });

    // Attach a global AJAX handler
    // $(document).ajaxError(handleAjaxError);

    const kinveyBaseUrl = 'https://baas.kinvey.com/';
    const kinveyAppKey = 'kid_rkTWoZY2e';
    const kinveyAppSecret = '8c7b22a18e02478ab63c215b7787200b';
    const kinveyAppAuthHeaders = {
        'Authorization': 'Basic' + btoa(kinveyAppKey + ':' + kinveyAppSecret)
    };

    function getKinveyUserAuthHeaders() {
        return {
            'Authorization': "Kinvey " + sessionStorage.getItem('authtoken'),
        };
    }

    function loginUser() {
        let userData = {
            username: $('#loginForm input[name=username]').val(),
            password: $('#loginForm inpu[name=password]').val()
        };

        $.ajax({
            method: 'POST',
            url: kinveyBaseUrl + 'user/' + kinveyAppKey + '/login',
            headers: kinveyAppAuthHeaders,
            data: userData,
            success: loginSuccess
        });

        function loginSuccessful(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            showUserHomeView();
            showInfo('Login successful.');
        }
    }


    function showRegisterView() {
        $('#registerForm').trigger('reset');
        showView('viewRegister');
    }

    function registerUser() {
        let userData = {
            username: $('#registerForm input[name=username]').val(),
            password: $('#registerForm input[name=passwd]').val(),
            // name: $('#formRegister input[name=name]').val()
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
}