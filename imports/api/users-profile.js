import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

UsersProfile = new Mongo.Collection("usersProfile");

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish("usersProfile", function() {
		return UsersProfile.find({});
	});

	Meteor.publish("searchByLocation", function(location, options) {
		var results = UsersProfile.find({
			address: {
				$regex: ".*" + location + ".*",
				$options: "i"
			}
		}, options);

		return results;
	});
}

Meteor.methods({
	"usersProfile.insert": function({ fullName }){
		UsersProfile.insert({
			fullName: fullName,
			location: 0.0,
			address: "",
			createdAt: new Date(),
			userId: this.userId,
			bossRating: 0,
			runnerRating: 0,
			runnerIncome: 0
		});
	},
	"usersProfile.update": function({ userId, currentLocation, address }) {
		UsersProfile.update({ userId: userId }, {
			$set: {
				location: currentLocation,
				address: address
			} 
		});
	},
	"usersProfile.updateInfo": function({ userId, fullName }) {
		UsersProfile.update({ userId: userId }, {
			$set: {
				fullName: fullName
			} 
		});
	},
	"usersProfile.updateBossRate": function({ userId, bossRating }) {
		UsersProfile.update({ userId: userId }, {
			$set: {
				bossRating: bossRating
			} 
		});
	},
	"usersProfile.updateRunnerRate": function({ userId, runnerRating }) {
		UsersProfile.update({ userId: userId }, {
			$set: {
				runnerRating: runnerRating
			} 
		});
	},
	"usersProfile.updateIncome": function({ userId, income }) {
		UsersProfile.update({ userId: userId }, {
			$set: {
				runnerIncome: income
			}
		})
	}
});