import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

Notifications = new Mongo.Collection("notifications");

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish("notifications", function(options) {
		var notifications = Notifications.find({}, options);
		
		return notifications;
	});
}

Meteor.methods({
	"notifications.insert": function({ notifId, postId, postOwnerId, notif, notifOn, notifFor, notifFrom }) {
		Notifications.insert({
			notifId: notifId,
			postId: postId,
			postOwnerId: postOwnerId,
			notif: notif,
			notifOn: notifOn,
			notifFor: notifFor,
			notifFrom: notifFrom,
			date: new Date(),
			read: false 
		});
	},
	"notifications.read": function(notifId) {
		Notifications.update({ notifId: notifId }, {
			$set: { read: true }
		});
	}
});