import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

FavoriteRunners = new Mongo.Collection("favoriteRunners");

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish("favoriteRunners", function(options) {
		var runners = FavoriteRunners.find({});
		
		return runners;
	});

	Meteor.publish("favoriteRunners", function(userId) {
		var runnerIds = FavoriteRunners.find({ runnerId: userId });

		return runnerIds;
	});
}

Meteor.methods({
	"favoriteRunners.insert": function({ userId, runnerId }) {
		FavoriteRunners.insert({
			userId: userId,
			runnerId: runnerId,
			date: new Date()
		});
	},
	"favoriteRunners.removedFavorite": function(runnerId) {
  		FavoriteRunners.remove({ runnerId });
  	}
});