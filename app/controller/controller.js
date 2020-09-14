const db = require('../config/db.config.js');
const config = require('../config/config.js');
const User = db.user;
const Role = db.role;
const Books = db.books;
const BooksIssued = db.books_issued;

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
	// Save User to Database
	console.log("Processing func -> SignUp");
	
	User.create({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8)
	}).then(user => {
		Role.findAll({
		  where: {
			name: {
			  [Op.or]: req.body.roles
			}
		  }
		}).then(roles => {
			user.setRoles(roles).then(() => {
				res.send("User registered successfully!");
            });
		}).catch(err => {
			res.status(500).send("Error -> " + err);
		});
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	})
}

exports.signin = (req, res) => {
	console.log("Sign-In");
	
	User.findOne({
		where: {
			username: req.body.username
		}
	}).then(user => {
		if (!user) {
			return res.status(404).send('User Not Found.');
		}

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) {
			return res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
		}
		
		var token = jwt.sign({ id: user.id }, config.secret, {
		  expiresIn: 86400 // expires in 24 hours
		});
		
		res.status(200).send({ auth: true, accessToken: token });
		
	}).catch(err => {
		res.status(500).send('Error -> ' + err);
	});
}

exports.userContent = (req, res) => {
	User.findOne({
		where: {id: req.userId},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			"description": "User Content Page",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access User Page",
			"error": err
		});
	})
}

exports.adminBoard = (req, res) => {
	User.findOne({
		where: {id: req.userId},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			"description": "Admin Board",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Admin Board",
			"error": err
		});
	})
}

exports.addBooks = (req, res) => {
	Books.create({
		book_name: req.body.book_name,
		author_name: req.body.author_name,
		book_description: req.body.book_description,
	}).then(books => {
		res.status(200).json({
			"description": "Book Created Successfully!",
			"book": books
		});
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	})
}

exports.getBooksList = (_req, res) => {
	Books.findAll().then(books => {
		res.status(200).json({
			"description": "Books List",
			"book": books
		});
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	})
}

exports.getBook = (req, res) => {
	let { params } = req;
	Books.findOne({ 
		where : {id : params.id} ,
		// attributes: ['book_name', 'author_name', 'book_description'],
	}).then(books => {
		if (books == null) {
			res.status(200).json({
				"description": "Book not found",
				"book": {}
			});			
		} else {
			res.status(200).json({
				"description": "Book Detail",
				"book": books
			});
		}
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	})
}

exports.updateBook = (req, res) => {
	let { params } = req;
	Books.update( {
		book_name: req.body.book_name,
		author_name: req.body.author_name,
		book_description: req.body.book_description,
	},
	{ 
		where : {id : params.id} ,
		// attributes: ['book_name', 'author_name', 'book_description'],
	}).then(books => {
		if (books == 0) {
			res.status(200).json({
				"description": "Book not found",
				"book": {}
			});			
		} else {
			Books.findOne({
				where : {id : params.id} ,
			}).then(books => {
				res.status(200).json({
					"description": "Book Detail Updated successfully",
					"book": books
				});
			});
		}
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	})
}

exports.deleteBook = (req, res) => {
	let { params } = req;
	Books.destroy({ 
		where : {id : params.id} ,
		// attributes: ['book_name', 'author_name', 'book_description'],
	}).then(books => {
		console.log("books", books);
		if (books == 0) {
			res.status(200).json({
				"message": "Book Detail not found",
			});
		} else {
			res.status(200).json({
				"message": "Book Detail deleted successfully",
			});
		}
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	})
}

exports.borrowBooks = (req, res) => {
	// console.log();
	let issueDate = new Date(req.body.issue_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
	let date = new Date(req.body.issue_date);
	date.setDate(date.getDate() + 3); 
	dueDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
	BooksIssued.create({
		bookId: req.body.bookId,
		userId: req.userId,
		issue_date: issueDate,
		due_date : dueDate
	}).then(books => {
		res.status(200).json({
			"description": "Book Subscribed Successfully!",
			"book": books
		});
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	});
}

exports.searchBook = (req, res) => {
	Books.findAll({ 
		where : {
			// id : params.id,
			[Op.or] : [
				{
					book_name: {
						[Op.like] : '%'+ req.query.Keyword +'%'
					}
				},
				{
					author_name: {
						[Op.like] : '%'+ req.query.Keyword +'%'
					}
				}
			]
		} ,
		// attributes: ['book_name', 'author_name', 'book_description'],
	}).then(books => {
		if (books == null) {
			res.status(200).json({
				"description": "Book not found",
				"book": {}
			});			
		} else {
			res.status(200).json({
				"description": "Book Detail",
				"book": books
			});
		}
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	})
}


//Fine amount is calculated using the date difference
exports.bookDue = (req, res) => {
	BooksIssued.findAll({ 
		where: {userId: req.userId},
		attributes: ["issue_date","due_date",[db.sequelize.literal('CASE WHEN DATEDIFF(issue_date ,due_date ) > 5 THEN DATEDIFF(issue_date ,due_date ) * 10 ELSE 0 END'), 'fine_amount']],
		include: [{
			model: Books,
			as: 'books',
			attributes: ['book_name', 'author_name'],
		},
	]
		// attributes: ['book_name', 'author_name', 'book_description'],
	}).then(books => {
		if (books == null) {
			res.status(200).json({
				"description": "Book not found",
				"book": {}
			});			
		} else {
			res.status(200).json({
				"description": "Book Detail",
				"book": books
			});
		}
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	})
}

exports.studentsBooks = (req, res) => {
	BooksIssued.findAll({ 
		attributes: ["id", "issue_date","due_date"],
		include: [
			{
				model: Books,
				as: 'books',
				attributes: ['book_name', 'author_name'],
			},
			{
			model: User,
			as: 'user',
			attributes: ['name', 'email'],
			},
	]
		// attributes: ['book_name', 'author_name', 'book_description'],
	}).then(books => {
		if (books == null) {
			res.status(200).json({
				"description": "Book not found",
				"book": {}
			});			
		} else {
			res.status(200).json({
				"description": "Book Detail",
				"book": books
			});
		}
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	})
}

exports.studentBooks = (req, res) => {
	User.findAll({ 
		where: {id: req.query.studentId},
		attributes: ["name", "username","email"],
		include: [{
			model: BooksIssued,
			as: 'borrowed_books',
			attributes: ['issue_date', 'due_date'],
			include: [ {
				model: Books,
				as: 'books',
				attributes: ['book_name', 'author_name'],
			}]
		},
	]
		// attributes: ['book_name', 'author_name', 'book_description'],
	}).then(books => {
		if (books == null) {
			res.status(200).json({
				"description": "Book not found",
				"book": {}
			});			
		} else {
			res.status(200).json({
				"description": "Book Detail",
				"book": books
			});
		}
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	})
}



