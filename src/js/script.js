if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/service-worker.js', {scope: '/'}).then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

$(document).ready(function () {
    $(document).on('click', '.hamburger', function (e) {
        e.preventDefault();
        $('header').toggleClass('active');
        return false;
    });
});