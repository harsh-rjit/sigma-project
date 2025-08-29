const User = require("../models/user.js");
const Listing = require("../models/listing")


module.exports.Rendersignupform = (req,res)=>{
    res.render("users/signup.ejs");
}

// module.exports.signup = async(req,res)=>{
//     try{
//         let{username,email,password} = req.body;
//     const NewUser= new User({email,username});
//     const registeredUser = await User.register(NewUser,password);
//     console.log(registeredUser);
//     req.login(registeredUser,(err)=>{
//         if(err){
//             return next();
//         }
//         req.flash("success","Welcome to the Wanderlust");
//         res.redirect("/listings");
//     })

//     }
//     catch(e){
//         console.log('Registration error:', e); // log the error
//         req.flash("error",e.message);
//         res.redirect("/signup")
//     }
 

    
// }

// module.exports.signup = async (req, res, next) => {
//     try {
//         console.log("Inside signup route");  // ✅ Debug log
//         console.log("Req.body: ", req.body); // ✅ See if body is parsed
//         let { username, email, password } = req.body;
//         const newUser = new User({ email, username });
//         console.log("Signup data received:", req.body);
//         const registeredUser = await User.register(newUser, password);

//         req.login(registeredUser, (err) => {
//             if (err) return next(err);
//             req.flash("success", "Welcome to Wanderlust");
//             res.redirect("/listings");
//         });
//     } catch (e) {
//         console.log('Registration error:', e);
//         req.flash("error", e.message);
//         res.redirect("/signup");
//     }
// };

module.exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Welcome to Wanderer')
        return res.redirect('/listings');
    })

}

module.exports.renderloginform = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req,res)=>{ //Passport provides an authenticate() function, which is used as route middleware to authenticate requests.
    req.flash("success","Welcome back to Wanderlust! you are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    }

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out")
        res.redirect("/listings");
    })
    
    }