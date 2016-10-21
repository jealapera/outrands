import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Messages = new Mongo.Collection("messages");

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish("messages", function(postId, options) {
		var messages = Messages.find({ postId: postId }, options);
		
		return messages;
	});
}

Meteor.methods({
	// Messages between the errand bosses and runners
	"messages.insert": function({ name, message, userId, userType, postId }) {
		Messages.insert({
			name: name,
			message: message,
			date: new Date(),
			userId: userId,
			userType: userType,
			postId: postId
		});
	},
});