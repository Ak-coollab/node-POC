module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('books', {
	  book_name: {
		  type: Sequelize.STRING
	  },
	  author_name: {
		  type: Sequelize.STRING
	  },
	  book_description: {
		  type: Sequelize.STRING
	  }
	});
	
	return User;
}