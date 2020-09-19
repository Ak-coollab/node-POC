const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');
const validator = require('express-joi-validation').createValidator({ passError: true });
const schema = require('../validations/validation')
const utils = require('../helpers/utils.js')


module.exports = function(app) {

    const controller = require('../controller/controller.js');
 
	app.post('/api/auth/signup', [validator.body(schema.studentRegisterationSchema), verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], controller.signup);

	app.post('/api/auth/admin/signup', [validator.body(schema.adminRegisterationSchema), verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], controller.adminSignUp);
	
	app.post('/api/auth/signin', controller.signin);
	
	app.get('/api/test/user', [authJwt.verifyToken], controller.userContent);

	app.get('/api/test/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

	//Admin API starts

	app.post('/api/books', [authJwt.verifyToken, authJwt.isAdmin], controller.addBooks);

	app.get('/api/books', [authJwt.verifyToken, authJwt.isAdmin], controller.getBooksList);

	app.get('/api/books/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.getBook);

	app.put('/api/books/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.updateBook);
	
	app.delete('/api/books/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.deleteBook);
	
	app.get('/api/students/books', [authJwt.verifyToken, authJwt.isAdmin], controller.studentsBooks);

	app.get('/api/student/allTakenBooks', [authJwt.verifyToken, authJwt.isAdmin], controller.studentBooks);

	app.get('/api/admin/search', [authJwt.verifyToken, authJwt.isAdmin], controller.searchBook);

	app.get('/api/admin/books/delay', [authJwt.verifyToken, authJwt.isAdmin], controller.bookDueAdmin);
	//Admin API Ends


	//Student API starts

	app.post('/api/student/borrow', [authJwt.verifyToken, authJwt.isStudent], controller.borrowBooks);

	app.get('/api/student/search', [authJwt.verifyToken, authJwt.isStudent], controller.searchBook);

	app.get('/api/student/books', [authJwt.verifyToken, authJwt.isStudent], controller.bookDue);

	app.post('/api/uploads', [authJwt.verifyToken, authJwt.isStudent, utils.uploads], controller.upload);

	//Student API ends
	app.use((err, req, res, next) => {
	if (err && err.error && err.error.isJoi) {
		// we had a joi error, let's return a custom 400 json response
		// console.log("err.error",err.error.details.map(x => x.message));
		res.status(400).json({
		type: err.type, // will be "query" here, but could be "headers", "body", or "params"
		message: err.error.details.map(x => x.message)
		});
	} else {
		// pass on to another error handler
		next(err);
	}
	});
	

	
}