import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

ErrandPosts = new Mongo.Collection("errandPosts");

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish("errandPosts", function(options) {
		// Meteor._sleepForMs(2000);
		var errandPosts = ErrandPosts.find({}, options);

		return errandPosts;
	});

	Meteor.publish("errandView", function(postId) {
		var errandPosts = ErrandPosts.find({ postId: postId });

		return errandPosts;
	});

	Meteor.publish("searchByTitle", function(title, options) {
		var foundPosts = ErrandPosts.find({
			title: {
				$regex: ".*" + title + ".*",
				$options: "i"
			}
		}, options);

		return foundPosts;
	});
}

Meteor.methods({
	"errandPosts.insert": function({title, description, items, dueDate, serviceFee, category, postType, postId}){
		// Make sure the user is logged in before creating an errand
		if (! this.userId) {
			throw new Meteor.Error("not-authorize");
		} else {
			ErrandPosts.insert({
				title: title,
				description: description,
				checklist: items,
				dueDate: dueDate,
				serviceFee: serviceFee,
				category: category,
				status: "open",
				postType: postType,
				postDate: new Date(),
				postId: postId,
				userId: this.userId,
				expired: false
			});
		}
	},
	"errandPosts.update": function({ postId, title, description, items, dueDate, serviceFee, category }){
		ErrandPosts.update({ postId: postId }, { 
			$set: {
				title: title,
				description: description,
				checklist: items,
				dueDate: dueDate,
				serviceFee: serviceFee,
				category: category,
			}
		});
	},
	// Updating the errand post's status upon accepting an errand runner
	"errandPosts.accept": function(postId) {
		ErrandPosts.update({ postId: postId }, { $set: { status: "running" } });
	},
	// Completed errand
	"errandPosts.completed": function(postId) {
		ErrandPosts.update({ postId: postId }, { $set: { status: "completed" } });
	},
	// Canceling the running errand
	"errandPosts.cancel": function(postId) {
		ErrandPosts.update({ postId: postId }, { $set: { status: "cancelled" } });
	},
	// Repost cancelled errand
	"errandPosts.repost": function({ postId, dueDate }) {
		ErrandPosts.update({ postId: postId }, { $set: { dueDate: dueDate, status: "open" , postDate: new Date() } });
	},
	"errandPosts.expired": function(postId) {
		ErrandPosts.update({ postId: postId, status: "open" }, { $set: { status: "expired", expired: true } });
	},
	// Repost expired errand
	"errandPosts.repostExpired": function({ postId, dueDate }) {
		ErrandPosts.update({ postId: postId, status: "expired" }, { $set: { dueDate: dueDate, status: "open", expired: false, postDate: new Date() } });
	},
	// Delete errand post
	"errandPosts.delete": function(postId) {
		ErrandPosts.remove({ postId });
	}
});