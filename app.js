// Function created to retrieve and display all relevant information about specified artist

var cardCreation = function(enter) {

// Create dynamic URL links based on user input (search or click)

    var discogsURL = "https://api.discogs.com/database/search?q=" + enter + "&key=hbrLdVvWBgVAqaAOpKos&secret=TlXBKlwWFLoTNJHYyBEIhzNIaZoVpHnV";
    
    var lastfmURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + enter + "&api_key=229233f9c10fcdec813ab2191288db9f&format=json";
    
    var napsterURL = "http://api.napster.com/v2.2/search?apikey=ZDRkYzMyYmEtMmVjMy00YmUwLThmNDQtOTc3Y2UzMGEzNTNm&query=" + enter + "&type=artist&limit=1";
    
// Begin AJAX calls for information from listed APIs    

    $.ajax({
              url: discogsURL,
              method: "GET"
            }).then(function(response) {
    
                var id = response.results[0].resource_url;

// Nested AJAX function to utilize link from original API call

                $.ajax({
                    url: id,
                    method: "GET"
                }).then(function(info) {

// Build artist profile and then display on webpage

                    var person = ["<b>Name: </b>" + info.name,
                        "<b>Bio: </b>" + info.profile,
                        "<b>Real Name: </b>" + info.realname,
                        "<b>Webpage: </b>" + info.urls[0]];
    
                    var personDiv = $("<div>");
    
                for(var i=0; i<person.length; i++) {
                    var artist = $("<div>");
                    artist.html(person[i]);
                    personDiv.append(artist);
                    personDiv.append("<br>");
                }
                $("#input").html(personDiv);
            });
    
        });
    
// Retreive artist image and display on webpage

    $.ajax({
              url: lastfmURL,
              method: "GET"
            }).then(function(response) {
    
                var imageSrc = response.artist.image[response.artist.image.length - 1];
    
                var imageElement = imageSrc[Object.keys(imageSrc)[0]];
                
                var image = $("<img src='" + imageElement + "' style='height: 200px; width: 200px'>");
    
                $("#pic").html(image);
            });

// Generate "influencers" and "followers" information from Napster for the artist    

    $.ajax({
              url: napsterURL,
              method: "GET"
            }).then(function(response) {
    
            var influencesIDs = [];
    
            var followersIDs = [];

     // Run check to see if both sets of data exists within the API
    
            if(response.search.data.artists[0].links.influences !== undefined) {
                var ids = response.search.data.artists[0].links.influences.ids;
                for(var i=0; i < ids.length; i++) {
                influencesIDs.push(response.search.data.artists[0].links.influences.ids[i]);
                }
            }
    
            if(response.search.data.artists[0].links.followers !== undefined) {
                var ids = response.search.data.artists[0].links.followers.ids;
                for(var i=0; i < ids.length; i++) {
                followersIDs.push(response.search.data.artists[0].links.followers.ids[i]);
                }
            }

    // Limit these categories to four artists to prevent overpopulation on page

            influencesIDs.splice(4);
            console.log(influencesIDs);
    
            followersIDs.splice(4);
            console.log(followersIDs);
    
            var infButtons = $("<div>");
    
            var folButtons = $("<div>");
    
    // Use for-loops to catch each element in the array

            for(var i=0; i < influencesIDs.length; i++){
    
                var napsterInfluencesURL = "https://api.napster.com/v2.2/artists/" + influencesIDs[i] + "?apikey=ZDRkYzMyYmEtMmVjMy00YmUwLThmNDQtOTc3Y2UzMGEzNTNm";
    
                $.ajax({
                    url: napsterInfluencesURL,
                    method: "GET"
                }).then(function(info) {
                    infButtons.append($("<button id='infl'>").html(info.artists[0].name));

            // Create a 2-by-2 grid of buttons

                        if(i % 2 !== 0) {
                        infButtons.append("<br>");
                            };
                        });
    
            };
    
            for(var i=0; i < followersIDs.length; i++){
    
                var napsterFollowersURL = "https://api.napster.com/v2.2/artists/" + followersIDs[i] + "?apikey=ZDRkYzMyYmEtMmVjMy00YmUwLThmNDQtOTc3Y2UzMGEzNTNm";
    
                $.ajax({
                    url: napsterFollowersURL,
                    method: "GET"
                }).then(function(info) {
                    folButtons.append($("<button id='fol'>").html(info.artists[0].name));
                        if(i % 2 !== 0) {
                        folButtons.append("<br>");
                            };
                        });
            };
    
    // Display buttons on webpage

            $("#influences").html(infButtons);
    
            $("#followers").html(folButtons);
    
            });
      
};

// Submit artist selection and begin the function to generate their information
    
$("#addArtist").on("click", function() {

    event.preventDefault();
    var userInput = $("#artistForm").val();
    userInput = userInput.replace(" ","+");
    cardCreation(userInput);
    $("#artistForm").val("");
    
});

// Generation function runs once a "influencers" button is clicked
    
$(document).on("click", "#infl", function() {

    var userInput = $(this).text()
    cardCreation(userInput);

});

// Generation function runs once a "followers" button is clicked
    
$(document).on("click", "#fol", function() {

    var userInput = $(this).text()
    cardCreation(userInput);

});