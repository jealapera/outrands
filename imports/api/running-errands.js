import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

RunningErrands = new Mongo.Collection("runningErrands");

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish("runningErrands", function(options) {
		var errands = RunningErrands.find({}, options);

		return errands;
	});

	Meteor.publish("runningErrands", function(postId) {
		var errands = RunningErrands.find({ postId: postId });

		return errands;
	});

	Meteor.publish("runningErrands", function(userId) {
		var bossIds = RunningErrands.find({ bossId: userId });

		return bossIds;
	});

	Meteor.publish("runningErrands", function(userId) {
		var runnerIds = RunningErrands.find({ runnerId: userId });

		return runnerIds;
	});
}

Meteor.methods({
	// Keeping these running errands for the interaction between the errand bosses and runners
	"runningErrands.insert": function({ postId, bossId, runnerId }) {
		RunningErrands.insert({
			postId: postId,
			bossId: bossId,
			runnerId: runnerId,
			bossRate: 0,
			commentForBoss: "",
			runnerRate: 0,
			commentForRunner: "",
			date: new Date(),
			status: "running",
			reasonForCancellation: "",
      favoriteRunner: false,
			removedRunner: false
		});
	},
	"runningErrands.cancel": function({ postId, reason }) {
	    RunningErrands.update({ postId: postId }, { 
	    	$set: { status: "cancelled", reasonForCancellation: reason } 
	    });
  	},
  	"runningErrands.update": function({ postId, runnerId }) {
  		RunningErrands.update({ postId: postId }, { 
  			$set: { runnerId: runnerId, status: "running" } 
  		});
  	},
  	"runningErrands.bossRateCancel": function({ postId, bossRate, comment }) {
  		RunningErrands.update({ postId: postId, status: "cancelled"}, { 
  			$set: { bossRate: bossRate, commentForBoss: comment } 
  		});
  	},
  	"runningErrands.bossRate": function({ postId, bossRate, comment }) {
  		RunningErrands.update({ postId: postId, status: "completed"}, { 
  			$set: { bossRate: bossRate, commentForBoss: comment } 
  		});
  	},
  	"runningErrands.runnerRate": function({ postId, runnerRate, comment }) {
  		RunningErrands.update({ postId: postId, status: "running"}, { 
  			$set: { runnerRate: runnerRate, commentForRunner: comment } 
  		});
  	},
  	"runningErrands.runnerRateCancel": function({ postId, runnerRate, comment }) {
  		RunningErrands.update({ postId: postId, status: "cancelled"}, { 
  			$set: { runnerRate: runnerRate, commentForRunner: comment } 
  		});
  	},
  	"runningErrands.completed": function(postId) {
  		RunningErrands.update({ postId: postId, status: "running" }, { 
  			$set: { status: "completed" } 
  		});
  	},
    "runningErrands.favoriteRunner": function(runnerId) {
        RunningErrands.update({ runnerId: runnerId }, {
            $set: { favoriteRunner: true }
        });
    },
    "runningErrands.removedFavorite": function(runnerId) {
        RunningErrands.update({ runnerId: runnerId }, {
            $set: { favoriteRunner: false }
        });
    },
  	"runningErrands.removedRunner": function(userId) {
  		RunningErrands.update({ runnerId: userId }, { 
            $set: { removedRunner: true } },
  		  	{ multi: true }
  		);
  	},
  	"runningErrands.onRepost": function(postId) {
  		RunningErrands.remove({ postId: postId, status: "cancelled" });
  	}
});
