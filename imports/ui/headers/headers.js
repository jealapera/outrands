import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import "./headers.html";

Template.HeaderUser.onCreated(function() {
    var instance = this;

    instance.state = new ReactiveDict();
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(4);

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
                    n.color = "#ffffff";
                }
            });

            return joined;
        }
    }

    instance.unReadNotif = function() {
        var userId = Meteor.userId();
        var notifications = Notifications.find({ notifFor: userId, read: false });

        return notifications;
    }

    instance.userId = function() {
        var userId = FlowRouter.getParam("_id");
        var profile = UsersProfile.findOne({ userId: userId });

        if (profile) {
            var profileId = profile.userId;

            return profileId;
        }
    }
});

Template.HeaderUser.helpers({
    notifications: function() {
        return Template.instance().notifications();
    },
    noNotifications: function() {
        return Template.instance().notifications().length === 0;
    },
    unReadNotif: function() {
        return Template.instance().unReadNotif().count() === 0;
    },
    userId: function() {
        return Template.instance().userId();
    }
})

Template.HeaderUser.events({
    "click #notif":function() {
        var _self = $(event.target);
        var parent = _self.closest(".dropdown__menu-item");
        var notifId = parent.find("#notif").data("notif-id");

        Meteor.call("notifications.read", notifId);
    },
    "click #edit-profile": function() {
        Modal.show("ProfileEdit");
    },
    "click #change-password": function() {
        Modal.show("ChangePassword");
    },
    "click #logout": function() {
        Meteor.logout(function(error) {
	        if (error) {
	            throw new Meteor.Error("Log out failed!");
	        } else {
	        	FlowRouter.go("/login");
	        }
    	});
    },
    "click .header__hamburger": function() {
		$(".sidebar-o").addClass("open");
    },
    "click .logo.logo--admin": function() {
        $(".sidebar-o").removeClass("open");
    },
    "click .header__icons": function() {
        $(".sidebar-o").removeClass("open");
    }
});

Template.ProfileEdit.onCreated(function() {
    var instance = this;

    instance.state = new ReactiveDict();

    instance.autorun(function() {
        var subscription = instance.subscribe("usersProfile");
    });

    instance.userProfile = function() {
        var _self = $(event.target);
        var parent = _self.closest(".dropdown__menu-item");
        var userId = parent.find(".dropdown__menu-link").data("profile-id");

        var profile = UsersProfile.findOne({ userId: userId });

        return profile;
    }
});

Template.ProfileEdit.helpers({
    userProfile: function() {
        return Template.instance().userProfile();
    }
});

Template.ProfileEdit.events({
    "click #save-profile": function(event) {
        var _self = $(event.target);
        var parent = _self.closest(".modal-footer");
        var userId = parent.find(".button").data("profile-id");

        var fullName = $("#full-name").val();

        Meteor.call("usersProfile.updateInfo", { userId, fullName });

        Modal.hide("ProfileEdit");
    },
});

Template.ChangePassword.onCreated(function() {
    var instance = this;

    instance.state = new ReactiveDict();

    instance.autorun(function() {
        var subscription = instance.subscribe("users");
    });

    instance.userId = function() {
        var _self = $(event.target);
        var parent = _self.closest(".dropdown__menu-item");
        var userId = parent.find(".dropdown__menu-link").data("profile-id");

        var user = Meteor.users.findOne({ userId: userId });

        if (user) {
            var userId = user._id;

            return userId;
        }
    }
});

Template.ChangePassword.helpers({
    userId: function() {
        return Template.instance().userId();
    }
});

Template.ChangePassword.events({
    "click #save-password": function(event) {
        var _self = $(event.target);
        var parent = _self.closest(".modal-footer");
        var userId = parent.find(".button").data("password-id");
        var currentPassword = $("#current-password").val();
        var newPassword = $("#new-password").val();
        var confirmNewPassword = $("#confirm-new-password").val();

        Accounts.changePassword(currentPassword, newPassword, function(error) {
            if (error) {
                document.getElementById("error-msg").innerHTML = "Incorrect current password!";
            } else if (newPassword !== confirmNewPassword) {
                document.getElementById("error-msg").innerHTML = "New Passwords don't match.";
            } else {
                if ($.trim(newPassword).length < 8) {
                    document.getElementById("error-msg").innerHTML = "Must be at least 8 characters.";
                } else {
                    document.getElementById("error-msg").innerHTML = "";
                    document.getElementById("msg-alert").innerHTML = "Password sucessfully changed!";
                    $("#current-password").val();
                    $("#new-password").val();
                    $("#confirm-new-password").val();
                }
            }
        });    
    }
});
