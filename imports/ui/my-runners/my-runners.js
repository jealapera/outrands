import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './my-runners.html';

Template.MyRunners.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();
	instance.loaded = new ReactiveVar(0);
	instance.limit = new ReactiveVar(8);

	instance.autorun(function() {
		var limit = instance.limit.get();

		var subscription = instance.subscribe("runningErrands", {
	    	limit: limit, 
	    	sort: { postDate: -1 }
	    });

	    if (subscription.ready()) {
			instance.loaded.set(limit);
	    }

		var subscription2 = instance.subscribe("usersProfile");
	});

  	instance.runners = function() {
		var userId = Meteor.userId();
    	var errands = RunningErrands.find({ bossId: userId, removedRunner: false }, { limit: instance.loaded.get(), sort: { date: -1 } }).fetch();

    	if (errands) {
    		var runnerIds = errands.map(function(e) { return e.runnerId; });
    		var runnersInfo = UsersProfile.find({ userId: { $in: runnerIds } }).fetch();

    		var joined = _.map(errands, function(e) {
    			return _.extend(e, _.findWhere(runnersInfo, { userId: e.runnerId }));
    		});

    		var uniqueArray = [];

    		_.each(_.uniq(_.pluck(joined, "runnerId")), function(runnerId) {
			    uniqueArray.push(_.findWhere(joined, { runnerId: runnerId }));
			});
    		
    		// var data = _.countBy(joined, function(obj) {
    		// 	return obj;
    		// });

			uniqueArray.forEach(function(runner) {
				var rate = runner.runnerRating;

				if (rate === 0) {
					runner.star1 = "fa-star-o";
					runner.star2 = "fa-star-o";
					runner.star3 = "fa-star-o";
					runner.star4 = "fa-star-o";
					runner.star5 = "fa-star-o";
					runner.star6 = "fa-star-o";
					runner.star7 = "fa-star-o";
					runner.star8 = "fa-star-o";
					runner.star9 = "fa-star-o";
					runner.star10 = "fa-star-o";
				} else if (rate > 0 && rate < 1) {
					runner.star1 = "fa-star-half-o";
					runner.star2 = "fa-star-o";
					runner.star3 = "fa-star-o";
					runner.star4 = "fa-star-o";
					runner.star5 = "fa-star-o";
					runner.star6 = "fa-star-o";
					runner.star7 = "fa-star-o";
					runner.star8 = "fa-star-o";
					runner.star9 = "fa-star-o";
					runner.star10 = "fa-star-o";
				} else if (rate === 1) {
					runner.star1 = "fa-star";
					runner.star2 = "fa-star-o";
					runner.star3 = "fa-star-o";
					runner.star4 = "fa-star-o";
					runner.star5 = "fa-star-o";
					runner.star6 = "fa-star-o";
					runner.star7 = "fa-star-o";
					runner.star8 = "fa-star-o";
					runner.star9 = "fa-star-o";
					runner.star10 = "fa-star-o";
				} else if (rate > 1 && rate < 2) {
					runner.star1 = "fa-star";
					runner.star2 = "fa-star-half-o";
					runner.star3 = "fa-star-o";
					runner.star4 = "fa-star-o";
					runner.star5 = "fa-star-o";
					runner.star6 = "fa-star-o";
					runner.star7 = "fa-star-o";
					runner.star8 = "fa-star-o";
					runner.star9 = "fa-star-o";
					runner.star10 = "fa-star-o";
				} else if (rate === 2) {
					runner.star1 = "fa-star";
					runner.star2 = "fa-star";
					runner.star3 = "fa-star-o";
					runner.star4 = "fa-star-o";
					runner.star5 = "fa-star-o";
					runner.star6 = "fa-star-o";
					runner.star7 = "fa-star-o";
					runner.star8 = "fa-star-o";
					runner.star9 = "fa-star-o";
					runner.star10 = "fa-star-o";
				} else if (rate > 2 && rate < 3) {
					runner.star1 = "fa-star";
					runner.star2 = "fa-star";
					runner.star3 = "fa-star-half-o";
					runner.star4 = "fa-star-o";
					runner.star5 = "fa-star-o";
					runner.star6 = "fa-star-o";
					runner.star7 = "fa-star-o";
					runner.star8 = "fa-star-o";
					runner.star9 = "fa-star-o";
					runner.star10 = "fa-star-o";
				} else if (rate === 3) {
					runner.star1 = "fa-star";
					runner.star2 = "fa-star";
					runner.star3 = "fa-star";
					runner.star4 = "fa-star-o";
					runner.star5 = "fa-star-o";
					runner.star6 = "fa-star-o";
					runner.star7 = "fa-star-o";
					runner.star8 = "fa-star-o";
					runner.star9 = "fa-star-o";
					runner.star10 = "fa-star-o";
				} else if (rate > 3 && rate < 4) {
					runner.star1 = "fa-star";
					runner.star2 = "fa-star";
					runner.star3 = "fa-star";
					runner.star4 = "fa-star-half-o";
					runner.star5 = "fa-star-o";
					runner.star6 = "fa-star-o";
					runner.star7 = "fa-star-o";
					runner.star8 = "fa-star-o";
					runner.star9 = "fa-star-o";
					runner.star10 = "fa-star-o";
				} else if (rate === 4) {
					runner.star1 = "fa-star";
					runner.star2 = "fa-star";
					runner.star3 = "fa-star";
					runner.star4 = "fa-star";
					runner.star5 = "fa-star-o";
					runner.star6 = "fa-star-o";
					runner.star7 = "fa-star-o";
					runner.star8 = "fa-star-o";
					runner.star9 = "fa-star-o";
					runner.star10 = "fa-star-o";
				} else if (rate > 4 && rate < 5) {
					runner.star1 = "fa-star";
					runner.star2 = "fa-star";
					runner.star3 = "fa-star";
					runner.star4 = "fa-star";
					runner.star5 = "fa-star-half-o";
					runner.star6 = "fa-star-o";
					runner.star7 = "fa-star-o";
					runner.star8 = "fa-star-o";
					runner.star9 = "fa-star-o";
					runner.star10 = "fa-star-o";
				} else if (rate === 5) {
					runner.star1 = "fa-star";
					runner.star2 = "fa-star";
					runner.star3 = "fa-star";
					runner.star4 = "fa-star";
					runner.star5 = "fa-star";
					runner.star6 = "fa-star-o";
					runner.star7 = "fa-star-o";
					runner.star8 = "fa-star-o";
					runner.star9 = "fa-star-o";
					runner.star10 = "fa-star-o";
				} 

				var name = runner.fullName;
				var split = name.split(" ");
				var initials = "";
					
					if (split.length > 0) {
	            	initials += split[0].charAt(0);
	            	
	            	if(split.length > 1) {
	            		initials += split[1].charAt(0);
	            	}

	            	runner.initials = initials;
	        	}  
			});

    		return uniqueArray;
    	}
	}
});

Template.MyRunners.helpers({
	runners: function() {
		return Template.instance().runners();
	},
	hasMoreRunners: function() {
		return Template.instance().runners().length >= Template.instance().limit.get();
	},
	noRunners: function() {
		return Template.instance().runners().length === 0;
	}
});

Template.Runner.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();

	instance.favorite = function() {
		return Template.instance().data.favoriteRunner == true;
	}
});

Template.Runner.helpers({
	favorite: function() {
		return Template.instance().favorite();
	}
});

Template.Runner.events({
	"click .button": function(event) {
		var _self = $(event.target);
		var parent = _self.closest(".profile-errand__actions");
		
		_self.closest("a.button").css("color", "yellow");
		var userId = Meteor.userId();
		var runnerId = parent.find("a.button").data("runner-id");

		Meteor.call("runningErrands.favoriteRunner", runnerId);
		Meteor.call("favoriteRunners.insert", { userId, runnerId });
	},
	"click #remove": function() {
		Modal.show("RemoveConfirmation");
	}
});

Template.RemoveConfirmation.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();

	var _self = $(event.target);
	var parent = _self.closest(".profile-errand__actions");
	var runnerId = parent.find(".button#remove").data("runner-id");
	
	instance.autorun(function() {
		var subscription = instance.subscribe("runningErrands", runnerId);
	});

	instance.removedRunner = function() {
		var errand = RunningErrands.findOne({ runnerId: runnerId });

		return errand;
	}
});

Template.RemoveConfirmation.helpers({
	removedRunner: function() {
		return Template.instance().removedRunner();
	}
});

Template.RemoveConfirmation.events({
	"click #yes": function(event) {
		event.preventDefault();

      	var _self = $(event.target);
		var parent = _self.closest(".modal-footer");
		var runnerId = parent.find(".btn").data("runner-id");
		
		Meteor.call("runningErrands.removedRunner", runnerId);

		Modal.hide("RemoveConfirmation");
	},
	"click #no": function() {
		Modal.hide("RemoveConfirmation");
	}
});