import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

ErrandBidders = new Mongo.Collection("errandBidders");

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish("errandBidders", function() {
		var bidders = ErrandBidders.find({});
		
		return bidders;
	});
	
	Meteor.publish("errandBidders", function(postId, options) {
		var bidders = ErrandBidders.find({ postId: postId }, options);
		
		return bidders;
	});
}

Meteor.methods({
	"errandBidders.insert": function({ postId, toComplete, price, userId }) {
		// Make sure the user is logged in before bidding an errand
		if (! this.userId) {
			throw new Meteor.Error("not-authorize");
		} else {
			ErrandBidders.insert({
				postId: postId,
				toComplete: toComplete,
				price: price,
				date: new Date(),
				userId: userId
			});
		}
	},
	"errandBidders.clear": function(postId) {
		ErrandBidders.remove({ postId });
	}
});