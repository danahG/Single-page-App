function startApp() {

    sessionStorage.clear();
    showHideNavigationLinks();
    showCorrectHomeView();

    // bind the navigation links anonymous
    $('#homeAppNavigationLink').click(showAppHomeView);
    $('#loginNavigationLink').click(showLoginView);
    $('#registerNavigationLink').click(showRegisterView);

    // TODO bind the navigation links user only


    // TODO bind the form submit buttons
    $("#loginForm").submit(login);
    $("#registerForm").submit(register);
    $("form").submit(function(event) {
        event.preventDefault();
    });



















}