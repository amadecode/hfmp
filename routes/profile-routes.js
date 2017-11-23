const router = require('express').Router();

const authCheck = (req, res, next)=>{
	if(!req.user){
		//if user is not logged in
		res.redirect('/auth/login');
	}else{
		next();
	}
};

router.get('/',authCheck, (req, res)=>{
	// res.send('you are logged in. this is your profile - ' + req.user.username);

	let t = '';
	const thumbnailURL = req.user.thumbnail.split("/");
	for(let i=0;i<7;i++)t+=thumbnailURL[i]+'/';
	t += 'photo.jpg?sz=150';

	res.render('profile', {user: req.user, thumbnail150: t});
});

module.exports = router;