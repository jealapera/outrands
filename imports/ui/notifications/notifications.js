import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";

import "./notifications.html";

Template.Notifications.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();
	instance.loaded = new ReactiveVar(0);
	instance.limit = new ReactiveVar(8);

	instance.autorun(function() {
		var limit = instance.limit.get();

		var subscription = instance.subscribe("notifications", {
			limit: limit, 
	    	sort: { date: -1 }
		});

		if (subscription.ready()) {
			instance.loaded.set(limit);
	    }

	    var subscription2 = instance.subscribe("usersProfile");
	});

	instance.notifications = function() {
		var userId = Meteor.userId();
		var notifications = Notifications.find({ notifFor: userId }, { limit: instance.loaded.get(), sort: { date: -1 } }).fetch();

		if (notifications) {
    		var userIds = notifications.map(function(n) { return n.notifFrom; });
    		var usersInfo = UsersProfile.find({ userId: { $in: userIds } }).fetch();

    		var joined = _.map(notifications, function(n) {
    			return _.extend(n, _.findWhere(usersInfo, { userId: n.notifFrom }));
    		});

    		joined.forEach(function(n) {
    			if (n.notifOn === "errand activity") {
    				n.link = "/errand-tracking/" + n.postId;
    			} else {
    				n.link = "/view-errand/" + n.postId;
    			}

    			if (n.read == false) {
                    n.color = "#f16362";
                } else {
                    n.color = "#384d68";
                }
    		});

    		return joined;
    	}
	}
});

Template.Notifications.helpers({
	notifications: function() {
		return Template.instance().notifications();
	},
  	hasMoreNotifications: function() {
    	return Template.instance().notifications().length >= Template.instance().limit.get();
  	},
  	noNotifications: function() {
    	return Template.instance().notifications().length === 0;
  	}
});

Template.Notifications.events({
	"click #notif": function() {
		var _self = $(event.target);
		var parent = _self.closest(".profile-errand");
		var notifId = parent.find("#notif").data("notif-id");

		Meteor.call("notifications.read", notifId);
	},
	"click #view": function() {
		var _self = $(event.target);
		var parent = _self.closest(".profile-errand");
		var notifId = parent.find("#view").data("notif-id");

		Meteor.call("notifications.read", notifId);
	},
	"click #show-more-notif": function(event, instance) {
		event.preventDefault();

    	var limit = instance.limit.get();

    	limit += 3;
    	instance.limit.set(limit);
	}
});