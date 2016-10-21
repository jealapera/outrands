import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import "./login.html";

Template.Login.events({
    "submit form": function(event) {
        event.preventDefault();
        
        var emailAddress = $("#login-email").val();
        var password = $("#login-password").val();

        Meteor.loginWithPassword(emailAddress, password, function(error) {
            if (error) {
            	document.getElementById("error-msg").innerHTML = error.reason;
            } else {
                FlowRouter.go("/dashboard");
            }
        });
    }
});
