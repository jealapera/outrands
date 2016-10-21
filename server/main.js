import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

import "../imports/api/users-profile.js";
import "../imports/api/errand-posts.js";
import "../imports/api/errand-bidders.js";
import "../imports/api/running-errands.js";
import "../imports/api/favorite-runners.js";
import "../imports/api/messages.js";
import "../imports/api/notifications.js";
import "../imports/api/reports-feedback.js";

Meteor.publish("users", function() {
	return Meteor.users.find({});
});

Meteor.startup(() => {
	// code to run on server at startup
});