const User = require('../models/users');

module.exports.register = (req, res) => {
    res.render('users/register');
}

module.exports.createUser = async(req, res, next) => {
    try {
    const {username, email, password} = req.body;
    // res.send(req.body);
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    //req.login requires a callback function
    req.login(registeredUser, err => {
        if(err) return next();
    req.flash('success', 'Welcome to Yelp Restaurant')
    res.redirect('/restaurants');
})
    console.log(registeredUser)
    // req.flash('success', 'Welcome to YelpRestaurant')
    // res.redirect('/restaurants');
    // res.redirect('/register');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register')
}
        // console.log(e)
//     req.flash('success', 'Welcome to YelpRestaurant')
// res.redirect('/restaurants');

}

module.exports.renderFormLogin = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back!');
const redirectUrl = res.locals.returnTo || '/restaurants';
delete req.session.returnTo;
return res.redirect(redirectUrl);
    // res.redirect('/restaurants')
    
}

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "Goodbye!");
        console.log('logged out')
        return res.redirect('/restaurants');
        

    });
 
}