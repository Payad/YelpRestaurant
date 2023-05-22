
module.exports.isLoggedIn = (req, res, next) => {
// console.log('REQ.USER...', req.user)
if(!req.isAuthenticated()) {
//store the url they are requesting
req.session.returnTo = req.originalUrl;
console.log(req.path, req.originalUrl)
    req.flash('error', 'You must be signed in');
    return res.redirect('/login');
}
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    // const origUrl = req.session.returnTo = req.originalUrl;
if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
}
    // res.redirect(origUrl || '/restaurants');
    next();
}