import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";

import "./help.html";

Template.Help.onCreated(function sidebarOnCreated() {
	var instance = this;

	instance.state = new ReactiveDict();

	instance.autorun(function() {
		var subscription = instance.subscribe("usersProfile");
	});
});

Template.Help.helpers({
	usersName: function() {
		var result;
		var userId = Meteor.userId();

		if (Meteor.user()) {
			user = UsersProfile.findOne({userId: userId});
		}

		if (user) {
			var user = user.fullName;
			var name = user.split(" ");

			return name[0];
		}
	}
});

Template.Help.events({
	"submit form": function(event) {
		event.preventDefault();

      	var name = $("#name").val();
      	var emailAddress = $("#email-address").val();
      	var question = $("#question").val();
      	var message = $("#message").val();
      	var regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      	if (!emailAddress.match(regEx)) {
			document.getElementById("error-msg").innerHTML = "Invalid email address format.";
      	} else {
      		name = name.trim().replace(/\s\s+/g, ' ');

      		Meteor.call("reports.insert", { name, emailAddress, question, message });

      		Modal.show("SubmitAlert");

	      	$("#name").val("");
	      	$("#email-address").val("");
	      	$("#question").val("");
	      	$("#message").val("");
	    }
	},
	"click #outrands": function() {
		Modal.hide("SubmitAlert");
	}
});