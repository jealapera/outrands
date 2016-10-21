import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './favorite-runners.html';

Template.MyFavoriteRunners.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();
	instance.loaded = new ReactiveVar(0);
	instance.limit = new ReactiveVar(8);

	instance.autorun(function() {
		var limit = instance.limit.get();

		var subscription = instance.subscribe("favoriteRunners", {
	    	limit: limit, 
	    	sort: { date: -1 }
	    });

	    if (subscription.ready()) {
			instance.loaded.set(limit);
	    }

		var subscription2 = instance.subscribe("usersProfile");
	});

  	instance.favoriteRunners = function() {
  		var userId = Meteor.userId();
  		var runners = FavoriteRunners.find({ userId: userId }, { limit: instance.loaded.get(), sort: { date: -1 } }).fetch();
		
		if (runners) {
			var runnerIds = runners.map(function(r) { return r.runnerId });
			var runnersInfo = UsersProfile.find({ userId: { $in: runnerIds } }).fetch();

			var joined = _.map(runners, function(r) {
    			return _.extend(r, _.findWhere(runnersInfo, { userId: r.runnerId }));
    		});

    		var uniqueArray = [];

    		_.each(_.uniq(_.pluck(joined, "runnerId")), function(runnerId) {
			    uniqueArray.push(_.findWhere(joined, { runnerId: runnerId }));
			});

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

Template.MyFavoriteRunners.helpers({
	favoriteRunners: function() {
		return Template.instance().favoriteRunners();
	},
	hasMoreRunners: function() {
		return Template.instance().favoriteRunners().length >= Template.instance().limit.get();
	},
	noRunners: function() {
		return Template.instance().favoriteRunners().length === 0;
	}
});

Template.FavoriteRunner.events({
	"click #remove-favorite": function() {
		Modal.show("RemoveFavorite");
	}
});

Template.RemoveFavorite.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();

	var _self = $(event.target);
	var parent = _self.closest(".profile-errand__actions");
	var runnerId = parent.find(".button#remove-favorite").data("runner-id");
	
	instance.autorun(function() {
		var subscription = instance.subscribe("favoriteRunners", runnerId);
	});

	instance.removedFavorite = function() {
		var runner = FavoriteRunners.findOne({ runnerId: runnerId });

		return runner;
	}
});

Template.RemoveFavorite.helpers({
	removedFavorite: function() {
		return Template.instance().removedFavorite();
	}
});

Template.RemoveFavorite.events({
	"click #yes": function(event) {
		event.preventDefault();

      	var _self = $(event.target);
		var parent = _self.closest(".modal-footer");
		var runnerId = parent.find(".btn").data("runner-id");
		
		Meteor.call("favoriteRunners.removedFavorite", runnerId);
		Meteor.call("runningErrands.removedFavorite", runnerId)

		Modal.hide("RemoveFavorite");
	},
	"click #no": function() {
		Modal.hide("RemoveFavorite");
	}
});