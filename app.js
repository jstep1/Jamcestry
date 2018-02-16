var discogsURL = "https://api.discogs.com/database/search?q=Eminem&key=hbrLdVvWBgVAqaAOpKos&secret=TlXBKlwWFLoTNJHYyBEIhzNIaZoVpHnV&secret=secret=TlXBKlwWFLoTNJHYyBEIhzNIaZoVpHnV";

var lastfmURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=Eminem&api_key=229233f9c10fcdec813ab2191288db9f&format=json";

var napsterURL = "http://api.napster.com/v2.2/search?apikey=ZDRkYzMyYmEtMmVjMy00YmUwLThmNDQtOTc3Y2UzMGEzNTNm&query=blink-182&type=artist&limit=1";

$.ajax({
          url: discogsURL,
          method: "GET"
        }).then(function(response) {

        	var id = response.results[0].resource_url;
        	console.log(id);

        	$.ajax({
        		url: id,
        		method: "GET"
        	}).then(function(info) {

        		var person = ["Name: " + info.name,
        			"Bio: " + info.profile,
        			"Real Name: " + info.realname,
        			"Webpage: " + info.urls[0]];

        		console.log(person);

        	for(var i=0; i<person.length; i++) {
        		var artist = $("<div>")
        		artist.text(person[i])
        		$("#input").append(artist);
        	}
        });

	});



$.ajax({
          url: lastfmURL,
          method: "GET"
        }).then(function(response) {

            var imageSrc = response.artist.image[response.artist.image.length - 1];

            var imageElement = imageSrc[Object.keys(imageSrc)[0]];
        	
        	var image = $("<img src='" + imageElement + "' style='height: 200px; width: 200px'>");

        	$("#pic").html(image);
        });

$.ajax({
          url: napsterURL,
          method: "GET"
        }).then(function(response) {

          // $("#input").append(response.search.data.artists[0].links.influences.ids);

        });