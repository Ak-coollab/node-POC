const cron = require("node-cron");
let nodemailer = require("nodemailer");
const db = require('../models/index');
const models = require('../models');
const BooksIssued = models.Books_Issued;
const User = models.Users;
const Books = models.Books;


// create mail transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ashok@askpundit.com",
    pass: "welcome123"
  }
});

// sending emails at periodic intervals
cron.schedule("*/5 * * * *", function(){
    console.log("---------------------");
    console.log("Running Cron Job");

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
	}).then(books => {
        console.log("books",books.length)
		if (books.length == 0) {
            console.log("No Books bue!")		
		} else {
            // console.log("books", books);
            books.forEach(element => {
                console.log(element.user.email);
                let mailOptions = { 
                    from: "ashok@askpundit.com",
                    to: element.user.email,
                    subject: `Not a GDPR update ;)`,
                    text: `Hi there, this email was automatically sent by us`
                  };
                  transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                      throw error;
                    } else {
                      console.log("Email successfully sent!");
                    }
                  });
            });
		}
	}).catch(err => {
		console.log("err", err)
		res.status(500).send("Fail! Error -> " + err);
	});



  });