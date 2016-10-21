import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

import "./footers.html";

Template.FooterUser.events({
	"click .footer.footer--admin": function() {
		$(".sidebar-o").removeClass("open");
    }
});