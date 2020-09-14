const { Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('books_issued', {
        issue_date : {
            type: Sequelize.DATE
        },
        due_date: {
            type: Sequelize.DATE,
        },
        fine_amount : {
            type : Sequelize.BIGINT
        }
    });
	
	return User;
}