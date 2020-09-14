const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function(app) {

    const controller = require('../controller/controller.js');
 
	app.post('/api/auth/signup', [verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], controller.signup);
	
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

	//Admin API Ends


	//Student API starts

	app.post('/api/student/borrow', [authJwt.verifyToken, authJwt.isStudent], controller.borrowBooks);

	app.get('/api/student/search', [authJwt.verifyToken, authJwt.isStudent], controller.searchBook);

	app.get('/api/student/books', [authJwt.verifyToken, authJwt.isStudent], controller.bookDue);

	//Student API ends

	

	
}