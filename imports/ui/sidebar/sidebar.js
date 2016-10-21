import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";

import "./sidebar.html";

Template.SideBar.onCreated(function sidebarOnCreated() {
	var instance = this;

	instance.state = new ReactiveDict();

	instance.autorun(function() {
		var subscription = instance.subscribe("usersProfile");
		var subscription2 = instance.subscribe("notifications");
	});

	instance.notifications = function() {
		var userId = Meteor.userId();
		var notifications = Notifications.find({ notifFor: userId, read: false });

		return notifications;
	}
});

Template.SideBar.helpers({
	usersProfile: function() {
		var userInfo;
		var userId = Meteor.userId();

		if (Meteor.user()) {
			userInfo = UsersProfile.findOne({userId: userId});

			if (userInfo) {
				var name = userInfo.fullName;
				var split = name.split(" ");
				var initials = "";
 				
 				if (split.length > 0) {
                	initials += split[0].charAt(0);
                	
                	if(split.length > 1) {
                		initials += split[1].charAt(0);
                	}

                	userInfo.initials = initials;
            	}
			}     
		}

		return userInfo;
	},
	activeIfTemplateIs: function (template) {
		var currentRoute = FlowRouter.getRouteName();
		return currentRoute && template === currentRoute ? "active" : "";
	},
	notifications: function() {
		return Template.instance().notifications();
	}
});

Template.SideBar.events({
	"click .sidebar-o": function() {
		$(".sidebar-o").removeClass("open");
	}
});
