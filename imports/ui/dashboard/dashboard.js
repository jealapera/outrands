import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";

import "./dashboard.html";

var query = "title";

Template.Dashboard.onRendered(function() {
	var instance = this;

	instance.date = new ReactiveVar(new Date());

	instance.subscribe("errandPosts", function() {
		instance.autorun(function() {
			var posts = ErrandPosts.find({ status: "open" }).fetch();
			var date = instance.date.get();

			posts.forEach(function(post) {

				if (date > post.dueDate) {
					post.result = true;

					var posttId = post.postId;

					Meteor.call("errandPosts.expired", posttId);
				}
			});
		});
	});
});

Template.Dashboard.onCreated(function dashboardOnCreated() {	
	// 1. Initialization
	var instance = this;

	// Initialize the reactive variables
	instance.loaded = new ReactiveVar(0);
	instance.limit = new ReactiveVar(12);

	instance.searchQuery = new ReactiveVar();
	instance.searching = new ReactiveVar(false);
	instance.location = new ReactiveVar(0);
	instance.address = new ReactiveVar("");

	// 2. Autorun
	instance.autorun(function() {
		instance.location.set(Geolocation.latLng());
		
		var currentLocation = instance.location.get();

		if (GoogleMaps.loaded()) {
			var geocoder = new google.maps.Geocoder();

			geocoder.geocode({ location: currentLocation }, function(r, s) {
				if (r && r.length && r[0].formatted_address) {
					instance.address.set(r[0].formatted_address);
				}
			});

			var address = instance.address.get();

			// Update user's current location
			if (currentLocation && address) {
				var userId = Meteor.userId();

				Meteor.call("usersProfile.update", { userId, currentLocation, address });
			}
		}

	    // Get the limit
	    var limit = instance.limit.get();

	    // Subscribe to the posts publication
	    var subscription = instance.subscribe("errandPosts", {
	    	limit: limit, 
	    	sort: { postDate: -1 }
	    });

	    // If subscription is ready, set limit to newLimit
	    if (subscription.ready()) {
			instance.loaded.set(limit);
	    }

	    var subscription2 = instance.subscribe("searchByTitle", instance.searchQuery.get(), () => {
	    	setTimeout( () => {
	    		instance.searching.set(false);
	    	}, 100);
	    });

	    // If subscription2 is ready, set limit to newLimit
	    if (subscription2.ready()) {
			instance.loaded.set(limit);
	    }

	    var subscription3 = instance.subscribe("searchByLocation", instance.searchQuery.get(), () => {
	    	setTimeout( () => {
	    		instance.searching.set(false);
	    	}, 100);
	    });

	    // If subscription2 is ready, set limit to newLimit
	    if (subscription3.ready()) {
			instance.loaded.set(limit);
	    }
  	});

  	// 3. Cursor
  	instance.errandPosts = function() { 
    	var posts = ErrandPosts.find({ expired: false }, { limit: instance.loaded.get(), sort: { postDate: -1 } }).fetch();

    	if (posts) {
    		var userIds = posts.map(function(p) { return p.userId; });
    		var postOwnersInfo = UsersProfile.find({ userId: { $in: userIds } }).fetch();

    		var joined = _.map(posts, function(p) {
    			return _.extend(p, _.findWhere(postOwnersInfo, { userId: p.userId }));
    		});

    		joined.forEach(function(post) {
    			if (post.status === "open") {
					post.class = "card__status--green";
				} else if (post.status === "running") {
					post.class = "card__status--red";
				} else if (post.status === "cancelled"){
					post.class = "card__status--blue";
				} else {
					//$(".card__status").css("color", "#384d68");
				}

				var name = post.fullName;
				var split = name.split(" ");
				var initials = "";
 				
 				if (split.length > 0) {
                	initials += split[0].charAt(0);
                	
                	if(split.length > 1) {
                		initials += split[1].charAt(0);
                	}

                	post.initials = initials;
            	}
    		}); 

    		return joined;
    	}
  	}

  	// Found Posts By Title
  	instance.foundPosts = function() {
  		var foundPosts;

  		if (query === "title") {
	  		var title = $("#search").val();

	  		foundPosts = ErrandPosts.find({
				title: {
					$regex: ".*" + title + ".*",
					$options: "i"
				},
			}, {limit: instance.loaded.get(), sort: { postDate: -1 }}).fetch();
	  	} else {
	  		var location = $("#search").val();

	  		var foundPosts = UsersProfile.find({
				address: {
					$regex: ".*" + location + ".*",
					$options: "i"
				}
			}, {limit: instance.loaded.get(), sort: { postDate: -1 }}).fetch();
	  	}

	  	if (foundPosts) {
			var userIds = foundPosts.map(function(fp) { return fp.userId });
			var posts = ErrandPosts.find({ userId: { $in: userIds }, expired: false }, { limit: instance.loaded.get(), sort: { postDate: -1 } }).fetch();
	    	var foundPostOwnersInfo = UsersProfile.find({ userId: { $in: userIds } }).fetch();
			
			var joined = _.map(posts, function(fp) {
				return _.extend(fp, _.findWhere(foundPostOwnersInfo, { userId: fp.userId }));
			});

			joined.forEach(function(post) {
    			if (post.status === "open") {
					post.class = "card__status--green";
				} else if (post.status === "running") {
					post.class = "card__status--red";
				} else if (post.status === "cancelled"){
					post.class = "card__status--blue";
				} else {
					//$(".card__status").css("color", "#384d68");
				}
    		}); 

			return joined;
		}
  	}
});

Template.Dashboard.helpers({
	// Posts Cursor
  	errandPosts: function() {
    	return Template.instance().errandPosts();
  	},
  	// Are there more posts to show?
  	hasMorePosts: function() {
    	return Template.instance().errandPosts().length >= Template.instance().limit.get();
  	},
  	// Searching Errand Posts
  	searching: function() {
  		return Template.instance().searching.get();
  	},
  	// Query to search from errand posts
  	query: function() {
  		return Template.instance().searchQuery.get();
  	},
  	// Nothing found for query
  	nothingFound: function() {
  		return Template.instance().foundPosts().length == 0;
  	},
  	// Found Posts
  	foundPosts: function() {
  		return Template.instance().foundPosts();
  	},
  	// Are there more found posts to show?
  	hasMoreFoundPosts: function() {
  		return Template.instance().foundPosts().length >= Template.instance().limit.get();
  	}
});

Template.Dashboard.events({
	"click #show-more": function(event, instance) {
		event.preventDefault();

    	// get current value for limit, i.e. how many posts are currently displayed
    	var limit = instance.limit.get();

    	// increase limit by 3 and update it
    	limit += 3;
    	instance.limit.set(limit);
	},
	"click #search-title": function(event, instance) {
		event.preventDefault();

		$(event.target).addClass("active");
		$("#search-location").removeClass("active");

		query = "title";
	},
	"click #search-location": function(event) {
		$(event.target).addClass("active");
		$("#search-title").removeClass("active");
		
		query = "location";
	},
	"keyup #search": function(event, instance) {

		var code = event.which;

    	if (code == 13) {
    		event.preventDefault();
    	} else if (query === "title") {
        	var title = $(event.target).val();

			instance.searchQuery.set(title);
			instance.searching.set(true);
    	} else {
    		var location = $(event.target).val();

    		instance.searchQuery.set(location);
    		instance.searching.set(true);
    	}
	}
});

Template.ErrandPost.onRendered(function() {
	function shorten(text, maxLength) {
		if (text.length > maxLength) {
			text = text.substr(0, maxLength - 3) + '...';
		}
		return text;
	}

	// content shorten
	var content = this.$(".card__content");
	var contentText = content.text();
	var contentShortened = shorten(contentText, 140);
	content.text(contentShortened);

	// title shorten
	var title = this.$(".card__title");
	var titleText = title.text();
	var titleShortened = shorten(titleText, 56);
	title.text(titleShortened);	
});