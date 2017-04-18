function startApp() {
    // Show correct navigation links and view (anonymous ot user-only)
    showCorrectNavigationLinks();
    showCorrectHomeView();

    // Bind the navigation links
    $('#homeAppNavigationLink').click(showAppHomeView);
    $('#loginNavigationLink').click(showLoginView);
    $('#registerNavigationLink').click(showRegisterView);

    $('#logoutLink').click(logout);

    // Bind user home links

    // Bind form submit buttons
    $('#loginForm').submit(loginUser);
    $('#registerForm').submit(registerUser);
    $("form").submit(function(event) {
        event.preventDefault();
    });

    // Bind info/error boxes
    $('#infoBox, #errorBox').click(function () {
        $(this).fadeOut();
    });

    // Attach AJAX loading event listener
    $(document).on({
        ajaxStart: function() {
            $('#loadingBox').show()
        },
        ajaxStop: function () {
            $('#loadingBox').hide();
        }
    });

    // Attach a global AJAX error handler
    $(document).ajaxError(handleAjaxError);

    // Authorization credentials
    const kinveyBaseUrl = 'https://baas.kinvey.com/';
    const kinveyAppKey = 'kid_rkTWoZY2e';
    const kinveyAppSecret = '8c7b22a18e02478ab63c215b7787200b';
    const kinveyAppAuthHeaders = {
        'Authorization': 'Basic ' + btoa(kinveyAppKey + ':' + kinveyAppSecret)
    };

    function getKinveyAuthHeaders() {
        return {
            'Authorization': 'Kinvey ' + sessionStorage.getItem('authtoken')
        };
    }

    function showView(viewName) {
        //Hide all views and show the selected only
        $('#container > section').hide();
        $('#' + viewName).show();
    }

    function showCorrectNavigationLinks() {
        if (sessionStorage.getItem('authtoken') === null) {
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

    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function () {
            $('#infoBox').fadeOut();
        }, 10000);
    }

    function showError(errorMessage) {
        $('#errorBox').text('Error: ' + errorMessage);
        $('#errorBox').show();
    }

    function handleAjaxError(event, response) {
        let errorMessage = JSON.stringify(response);
        if(response.readyState === 0) {
            errorMessage = 'Cannot connect due to network error.';
        }
        if(response.responseJSON && response.responseJSON.description) {
            errorMessage = response.responseJSON.description;
        }
        showError(errorMessage);
    }

    function showCorrectHomeView() {
        if(sessionStorage.getItem('username')) {
            showUserHomeView();
        } else {
            showAppHomeView();
        }
    }

    function showAppHomeView() {
        showView('viewAppHome');
    }

    function showLoginView() {
        showView('viewLogin');
        $('#loginForm').trigger('reset');
    }

    function loginUser() {
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
            showCorrectNavigationLinks();
            showUserHomeView();
            showInfo('Login successful.')
        }
    }

    function saveAuthInSession(userInfo) {
        sessionStorage.setItem('username', userInfo.username);
        sessionStorage.setItem('name', userInfo.name);
        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
    }

    function showRegisterView() {
        $('#registerForm').trigger('reset');
        showView('viewRegister');
    }

    function registerUser() {
        let userData = {
            username: $('#registerForm input[name=username]').val(),
            password: $('#registerForm input[name=password]').val(),
            name: $('#registerForm input[name=name]').val()
        };
        $.ajax({
            method: 'POST',
            url: kinveyBaseUrl + 'user/' + kinveyAppKey + '/',
            headers: kinveyAppAuthHeaders,
            data: userData,
            success: registerSuccessful
        });

        function registerSuccessful(userInfo) {
            saveAuthInSession(userInfo);
            showCorrectNavigationLinks();
            showUserHomeView();
            showInfo('User registration successful.');
        }
    }

    function showUserHomeView() {
        $('#viewUserHome h1').text('Welcome, ' +
            sessionStorage.getItem('username') + '!');
        showView('viewUserHome');
    }




















    function logout() {
        $.ajax({
            method: 'POST',
            url: kinveyBaseUrl + 'user/' + kinveyAppKey + '/_logout',
            headers: getKinveyAuthHeaders()
        });
        sessionStorage.clear();
        showCorrectNavigationLinks();
        showAppHomeView();
        showInfo('Logout successful.');
    }
}