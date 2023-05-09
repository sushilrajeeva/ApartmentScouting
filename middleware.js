/*add.use(myMiddleWare()). you can also just define them in the app.js if you like as seen in lecture 10's lecture code example. 
If you choose to write them in the app.js, you do not have to use this file. */

const middlewareMethods = {
    description: 'This is my helper function for lab-6',
    checkAuthentication: (req, res, next) => {
        
        if (!req.session.user) {
          
          return res.redirect('/homepage');
        } else {
          if (req.session.user.role.toLowerCase() === 'primary user') {
            return res.redirect('/primaryuser');
          } else if (req.session.user.role.toLowerCase() === 'scout user') {
            return res.redirect('/scoutuser');
          }
        }
        next();
      },
      homepageAuthentication: (req, res, next) => {
        
        if (!req.session.user) {
          
          next();
        } else {
          if (req.session.user.role.toLowerCase() === 'primary user') {
            return res.redirect('/primaryuser');
          } else if (req.session.user.role.toLowerCase() === 'scout user') {
            return res.redirect('/scoutuser');
          }
        }
      },

      loginMiddleware: (req, res, next)=>{
        if(!req.session.user){
            //not authenticated so i am allowing it to reach the login route
            next();
        }else{
            if(req.session.user.role.toLowerCase() === 'primary user'){
                return res.redirect('/primaryuser')
            }else if(req.session.user.role.toLowerCase() === 'scout user'){
                return res.redirect('/scoutuser')
            }
        }
      },
      registerMiddleware: (req, res, next)=>{
        if(!req.session.user){
            //user is not authenticated so i am letting it reach the register route
            next();
        }else{
            //doing the same logic as above
            if(req.session.user.role.toLowerCase() === 'primary user'){
                return res.redirect('/primaryuser')
            }else if(req.session.user.role.toLowerCase() === 'scout user'){
                return res.redirect('/scoutuser')
            }
        }
      },
      commonMiddleware: (req, res, next)=>{
        if(!req.session.user){
            //hitting GET/login since user is not authenticated
            return res.redirect('/login');
        }else{
            //letting it fall through if authenticated user, as mentioned in the ruberics
            next();
        }
      },
      
      primaryMiddleware: (req, res, next)=>{
        if(!req.session.user){
            return res.redirect('/login');
        }else if(req.session.user.role.toLowerCase() !== 'primary user'){
            let msg = `${req.session.user.firstName}, You do not have permission to view this page. only primary user can view this, your current role is scout user!`
            return res.status(403).render('error', {title: "error", error: `<div id="error" class="error" > ${msg}</div>`});
        }else{
            next();
        }
      },
      scoutMiddleware: (req, res, next)=>{
        if(!req.session.user){
            return res.redirect('/login');
        }else if(req.session.user.role.toLowerCase() !== 'scout user'){
            let msg = `${req.session.user.firstName}, You do not have permission to view this page. only scout user can view this, your current role is primary user`
            return res.status(403).render('error', {title: "error", error: `<div id="error" class="error" > ${msg}</div>`});
        }else{
            next();
        }
      },
      logoutMiddleware: (req, res, next)=>{
        if(!req.session.user){
            return res.redirect('/login')
        }else{
            next();
        }
      },
      loggingMiddleware: (req, res, next)=>{

        const curentTime = new Date().toUTCString();
        const requestMethod = req.method;
        const requestRoute = req.originalUrl;
        const userAuthentication = req.session.user ? "Authenticated User" : "Non-Authenticated User";

        //[Sun, 14 Apr 2019 23:56:06 GMT]: GET / (Non-Authenticated User)
        console.log(`[${curentTime}]: ${requestMethod} ${requestRoute} (${userAuthentication})`);
        next();

      }
}

export default middlewareMethods;

