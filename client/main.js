import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import "./main.html";
import "../imports/ui/landing-page.html";
import "../imports/ui/headers/headers.html";
import "../imports/ui/footers/footers.html";
import "../imports/ui/forms/register.html";
import "../imports/ui/forms/login.html";
import "../imports/ui/sidebar/sidebar.html";
import "../imports/ui/users-profile/users-profile.html";
import "../imports/ui/dashboard/dashboard.html";
import "../imports/ui/post-errand/post-errand.html";
import "../imports/ui/errand-view/errand-view.html";
import "../imports/ui/errand-tracking/errand-tracking.html";
import "../imports/ui/errand-activities/errand-activities.html";
import "../imports/ui/favorite-runners/favorite-runners.html";
import "../imports/ui/my-runners/my-runners.html";
import "../imports/ui/notifications/notifications.html";
import "../imports/ui/help/help.html";
import "../imports/ui/terms-and-privacy.html";

import "../imports/ui/headers/headers.js";
import "../imports/ui/footers/footers.js";
import "../imports/ui/forms/register.js";
import "../imports/ui/forms/login.js";
import "../imports/ui/sidebar/sidebar.js";
import "../imports/ui/users-profile/users-profile.js";
import "../imports/ui/dashboard/dashboard.js";
import "../imports/ui/post-errand/post-errand.js";
import "../imports/ui/errand-view/errand-view.js";
import "../imports/ui/errand-tracking/errand-tracking.js";
import "../imports/ui/errand-activities/errand-activities.js";
import "../imports/ui/favorite-runners/favorite-runners.js";
import "../imports/ui/my-runners/my-runners.js";
import "../imports/ui/notifications/notifications.js";
import "../imports/ui/help/help.js";

Template.registerHelper("formatDate", function(date) {
	return moment(date).format("MMMM D, YYYY h:mm A");
});

Template.registerHelper("formatTime", function(date) {
	return moment(date).format("h:mm A");
});

Template.registerHelper("dateTimeAgo", function(date) {
	return moment(date).fromNow();
});

Template.registerHelper("formatNumber", function(number) {
	return parseFloat(number).toFixed(2);
});

Template.registerHelper("formatRate", function(rate) {
	return parseFloat(rate).toFixed(1);
});

Template.UserMainLayout.onCreated(function userMainLayout() {
 	GoogleMaps.load({key: "AIzaSyBq7jJ2mTqwOEVbDunUt-yrc3jMLBwfB-o"});
});

Template.UserMainLayout.events({
	"click .main-content": function() {
		$(".sidebar-o").removeClass("open");
	}
});