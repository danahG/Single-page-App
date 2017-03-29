function startApp() {

    sessionStorage.clear();
    showHideNavigationLinks();



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
}