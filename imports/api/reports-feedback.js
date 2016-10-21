import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

var Schemas = {};

Schemas.Reports = new SimpleSchema({
	name: {
		type: String
	},
	emailAddress: {
		type: String
	},
	question: {
		type: String
	},
	message: {
		type: String
	},
	date: {
		type: Date
	}
});

Reports = new Mongo.Collection("reports");

Reports.attachSchema(Schemas.Reports);

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish("reports", function(options) {
		var reports = Reports.find({}, options);

		return reports;
	});
}

Meteor.methods({
	"reports.insert": function({ name, emailAddress, question, message }) {
		Reports.insert({
			name: name,
			emailAddress: emailAddress,
			question: question,
			message: message,
			date: new Date()
		});
	}
});