import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './errand-activities.html';

Template.ErrandActivities.onCreated(function() {
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

		var subscription2 = instance.subscribe("errandPosts");
	});

  	instance.errandActivities = function() {
		var userId = Meteor.userId();
    	var errands = RunningErrands.find({ $or: [ { bossId: userId }, { runnerId: userId } ], status: { $ne: "open" } }, { limit: instance.loaded.get(), sort: { date: -1 } }).fetch();

    	if (errands) {
    		var postIds = errands.map(function(e) { return e.postId; });
    		var postsInfo = ErrandPosts.find({ postId: { $in: postIds } }).fetch();

    		var joined = _.map(errands, function(e) {
    			return _.extend(e, _.findWhere(postsInfo, { postId: e.postId }));
    		});

    		var uniqueArray = [];

    		_.each(_.uniq(_.pluck(joined, "postId")), function(postId) {
			    uniqueArray.push(_.findWhere(joined, { postId: postId }));
			});

			uniqueArray.forEach(function(errand) {
				if (errand.status === "running") {
					errand.color = "#f16362";
				} else if (errand.status === "cancelled"){
					errand.color = "#448aff";
				} else {
					errand.color = "#384d68";
				}
			}); 

    		return uniqueArray;
    	}
  	}
});

Template.ErrandActivities.helpers({
	errandActivities: function() {
		return Template.instance().errandActivities();
	},
  	hasMoreErrandActivities: function() {
    	return Template.instance().errandActivities().length >= Template.instance().limit.get();
  	},
  	noErrandActivities: function() {
    	return Template.instance().errandActivities().length === 0;
  	}
});