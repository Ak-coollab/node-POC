const db = require('../../models/index');
const config = require('../config/config.js');
const validator = require('../validations/validation.js');
const models = require('../../models');
const User = models.Users;
const Role = models.role;
const Books = models.Books;
const BooksIssued = models.Books_Issued;
const ClassSection = db.class_sections;
const Class = db.Class;
const Section = db.Section;
const fs = require('fs');
const utils = require('../helpers/utils.js')

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const { Buffer } = require('buffer');

exports.signup = async (req, res) =>  {
	// Save User to Database
	const t = await db.sequelize.transaction();
	await User.create({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8),
		image: req.body.image,
		base64Content : req.body.base64Content
	}, { transaction: t }).then(user => {
		Class.findOne({
			where : {
				id : req.body.classId
			}
		}).then(classes => {
			// console.log("hi");
			Section.findOne({
				where : {
					id : req.body.sectionId
				}
			}).then(section => {
				ClassSection.create({
					classId : classes.id,
					sectionId : section.id,
					studentId: user.id
				}, { transaction: t }).then(class_section => {
					Role.findAll({
						where: {
						  name: {
							[Op.or]: req.body.roles
						  }
						}
					  }).then(roles => {
						//   console.log(user);	
						user.setRoles(roles).then(() => {
							t.commit();
							  res.status(200).json({
								  "message": "User registered successfully!",
								  "user": user
							  });
						  });
							// t.commit();
					  }).catch(err => {
						t.rollback();
						  res.status(500).send("Error -> " + err);
					  });
				}).catch(err => {
					t.rollback();
					res.status(500).send("Section Error -> " + err);
				})
			}).catch(err => {
				t.rollback();
				res.status(500).send("Section Error -> Please Select a valid section");
			});
		}).catch(err => {
			t.rollback();
			res.status(500).send("Class Error -> " + err);
		});
		

	}).catch(err => {
		t.rollback();
		res.status(500).send("Fail! Error -> " + err);
	})
}

exports.adminSignUp = (req, res) => {
	// Save User to Database
	User.create({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8),
	}).then(user => {
		Role.findAll({
		  where: {
			name: {
			  [Op.or]: req.body.roles
			}
		  }
		}).then(roles => {
			user.setRoles(roles).then(() => {
				res.status(200).json({
					"message": "User registered successfully!",
					"user": user
				});
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
	});
}

exports.studentUpdate = (req, res) => {
	let { params } = req;
	User.update( {
		name: req.body.name,
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password, 8),
		email: req.body.email,
	},
	{ 
		where : {id : params.id} ,
		// attributes: ['book_name', 'author_name', 'book_description'],
	}).then(users => {
		if (users == 0) {
			res.status(200).json({
				"description": "User not found",
				"book": {}
			});			
		} else {
			User.findOne({
				where : {id : params.id} ,
			}).then(users => {
				res.status(200).json({
					"description": "User Detail Updated successfully",
					"book": users
				});
			});
		}
	}).catch(err => {
		res.status(500).send("Fail! Error -> " + err);
	});
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
	console.log("issueDate", req.body.issue_date);
	let issueDate = new Date(req.body.issue_date).toISOString().replace(/T/, ' ').replace(/\..+/, '');
	let date = new Date(req.body.issue_date);
	date.setDate(date.getDate() + 3); 
	dueDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
	BooksIssued.create({
		bookId: req.body.bookId,
		userId: req.userId,
		issue_date: req.body.issue_date,
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
						[Op.like] : '%'+ req.query.keyword +'%'
					}
				},
				{
					author_name: {
						[Op.like] : '%'+ req.query.keyword +'%'
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
exports.bookDueAdmin = (req, res) => {
	BooksIssued.findAll({
		where : db.sequelize.literal('due_date > CURDATE()'), 
		attributes: ["bookId","issue_date","due_date",[db.sequelize.literal('CASE WHEN DATEDIFF(due_date, issue_date) > 3 THEN DATEDIFF(due_date, issue_date) * 10 ELSE 0 END'), 'fine_amount']],
		include: [{
			model: Books,
			as: 'books',
			attributes: ['id','book_name', 'author_name'],
		},
		{
			model: User,
			as: 'user',
			attributes: ['id','name', 'email'],
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
		console.log("err", err)
		res.status(500).send("Fail! Error -> " + err);
	});
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


exports.upload = (req, res) => {
	console.log("hi", req.file.filename);
	if (!(!!req.file && !!req.file.filename)) {
		return res.notFound({ message: 'file not found' });
	}
	// console.log("hi", req.file.buffer.toString('base64'))
	const path = `public/uploads/files/${req.file.filename}`;
	var binaryData = fs.readFileSync(path);
	var base64String = new Buffer(binaryData).toString("base64");
	res.status(200).json({
		"description": "File uploaded Successfully",
		"filrURL": path,
		"base64String" :base64String
	});
}

exports.uploadUpdate = (req, res) => {
	// console.log("hi", req.params);
	if (!(!!req.file && !!req.file.filename)) {
		return res.notFound({ message: 'file not found' });
	}
	// console.log("hi", req.file.buffer.toString('base64'))
	// const path = `public/uploads/files/${req.file.filename}`;
	// var binaryData = fs.readFileSync(path);
	// var base64String = new Buffer(binaryData).toString("base64");

	// res.status(200).json({
	// 	"description": "File uploaded Successfully",
	// 	"filrURL": path,
	// 	"base64String" :base64String
	// });
}


