import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";

import "./post-errand.html";

Template.PostErrand.onRendered(function() {
	var s = Template.instance().$("#errand-category");
	s.select2();

	var s2 = Template.instance().$("#post-type");
	s2.select2();
});

Template.PostErrand.onCreated(function() {
	var instance = this;

	instance.state = new ReactiveDict();

	instance.autorun(function() {
		var subscription = instance.subscribe("favoriteRunners");
	});

	instance.hasFavoriteRunners = function() {
		var userId = Meteor.userId();
		var runners = FavoriteRunners.find({ userId: userId });

		return runners;
	}
});

Template.PostErrand.helpers({
	hasFavoriteRunners: function() {
		return Template.instance().hasFavoriteRunners().count() > 0;
	}
});

Template.PostErrand.events({
	"focus #due-date": function(e, template) {
		var f = Template.instance().$("#due-date");
		var date = new Date();
		var max = moment(date).add(2, "d").toDate();

		f.bootstrapMaterialDatePicker({ format: "MMMM D, YYYY h:mm A", minDate: date, maxDate: max });
	},
	"click #add-item": function(event) {
		event.preventDefault();

		var item = $("#item").val();

		if(item !== ""){
			var newItem = $(document.createElement("li")).attr("class", "errand-form__list-item");

	 		newItem.after().html("<i class='fa fa-caret-right errand-form__check-ic'></i>"
			+ item + "<i class='fa fa-close errand-form__delete-ic' data-></i>");

			newItem.appendTo("#list");
			
	 		$("#item").val("");
	 	}
	},
	"click .errand-form__delete-ic": function(event) {
		$(event.target).closest(".errand-form__list-item").remove();
	},
	"submit form": function(event){
		event.preventDefault();

		var items = [];

		$(".errand-form__list-item").each(function(index) {
			//console.log( index + ": " + $(this).text());
			items.push($(this).text());
		});

      	var title = $("#title").val();
      	var description = $("#description").val();
      	var dueDate = $("#due-date").val();
      	
      	dueDate = new Date(dueDate);

      	var serviceFee = parseFloat($("#service-fee").val());
      	var category = $("#errand-category").val();
      	var postType = $("#post-type").val();

      	var postId = Math.random().toString(36).substr(2, 8);

		Meteor.call("errandPosts.insert", { title, description, items, dueDate, serviceFee, category, postType, postId });
		
		FlowRouter.go("view-profile", { _id: Meteor.userId() });
	}
});