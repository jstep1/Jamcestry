// Global variables and functions defined

var player = "";

var treeOneButtons = $("<div class='tr1'>");

// var treeOne = true;

var expand = false;

var userSearchDone = false;

entryMod = function () {
    $("#invalid").fadeIn(200);
};

showMod = function () {
    $("#exampleModal").fadeIn(200);
};

hideMod = function () {
    $("#exampleModal").fadeOut(200);
    $("#invalid").fadeOut(200);
};

embedYoutube = function (input) {
    $("#player").html(
        "<iframe id='ytplayer' type='text/html' width='480' height='270' src='https://www.youtube.com/embed?listType=search&list=" +
        input + "' frameborder='0'></iframe>");
};


// Function created to retrieve and display all relevant information about specified artist

cardCreation = function (enter) {

    var lastfmURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + enter +
        "&autocorrect=1&api_key=229233f9c10fcdec813ab2191288db9f&format=json";

    var napsterURL =
        "http://api.napster.com/v2.2/search?apikey=ZDRkYzMyYmEtMmVjMy00YmUwLThmNDQtOTc3Y2UzMGEzNTNm&query=" +
        enter + "&type=artist&limit=1";


    $.ajax({
        url: lastfmURL,
        method: "GET"
    }).then(function (response) {

        var artistName = response.artist.name;

        var imageSrc = response.artist.image[response.artist.image.length - 1];

        var imageElement = imageSrc[Object.keys(imageSrc)[0]];

        var personGenre = [];

        var personGenreString = response.artist.tags.tag;

        var similarArtists = [];

        var similarArtistsString = response.artist.similar.artist;

        var image = $("<img src='" + imageElement +
            "' style='height: 200px; width: 200px; float: left; margin-right: 10px'>");

        $("#artist-name").html("<h2>" + artistName + "<h2>");

        $("#pic").html(image);

        for (var i = 0; i < personGenreString.length; i++) {

            if (i <= 0) {
                personGenre.push(personGenreString[i].name);
            } else {
                personGenre.push(" " + personGenreString[i].name);
            }
        }

        for (var i = 0; i < similarArtistsString.length; i++) {

            if (i <= 0) {
                similarArtists.push("<a href='https://en.wikipedia.org/wiki/" +
                    similarArtistsString[i].name + "' target='_blank'>" + similarArtistsString[
                        i].name + "</a>");
            } else {
                similarArtists.push(" " + "<a href='https://en.wikipedia.org/wiki/" +
                    similarArtistsString[i].name + "' target='_blank'>" + similarArtistsString[
                        i].name + "</a>");
            }
        };

        var person = ["<div class='bio' id='bio'><b>Bio: </b>" + response.artist.bio.content,
            "<button type='button' class='btn btn-light bio' style='float: right'><span id='see'>See More...</span></button>",
            "<b>Genre: </b>" + personGenre,
            "<b>Find Similar Artists: </b>" + similarArtists
        ];


        if (person[0] === "<div class='bio' id='bio'><b>Bio: </b>" || person[2] ===
            "<b>Genre: </b>") {

            showMod();

        };

        var personDiv = $("<div>");

        for (var i = 0; i < person.length; i++) {
            var artist = $("<div>");
            artist.html(person[i]);
            personDiv.append(artist);
            personDiv.append("<br>");
        }
        $("#pic").append(personDiv);

    });


    $.ajax({
        url: napsterURL,
        method: "GET"
    }).then(function (response) {

        var influencesIDs = [];

        var followersIDs = [];

        var infButtons = $("<div>");

        var folButtons = $("<div>");

        var artistRef = response.search.data.artists[0].links;

        if (artistRef.influences !== undefined) {
            var ids = artistRef.influences.ids;
            for (var i = 0; i < ids.length; i++) {
                influencesIDs.push(artistRef.influences.ids[i]);
            }
        }

        if (artistRef.followers !== undefined) {
            var ids = artistRef.followers.ids;
            for (var i = 0; i < ids.length; i++) {
                followersIDs.push(artistRef.followers.ids[i]);
            }
        }

        influencesIDs.splice(4);

        followersIDs.splice(4);

        for (var i = 0; i < influencesIDs.length; i++) {

            var napsterInfluencesURL = "https://api.napster.com/v2.2/artists/" + influencesIDs[i] +
                "?apikey=ZDRkYzMyYmEtMmVjMy00YmUwLThmNDQtOTc3Y2UzMGEzNTNm";

            $.ajax({
                url: napsterInfluencesURL,
                method: "GET"
            }).then(function (info) {
                infButtons.append($("<button id='infl' class='btn btn-outline-primary'>").html(
                    info.artists[0].name));
            });

        };

        for (var i = 0; i < followersIDs.length; i++) {

            var napsterFollowersURL = "https://api.napster.com/v2.2/artists/" + followersIDs[i] +
                "?apikey=ZDRkYzMyYmEtMmVjMy00YmUwLThmNDQtOTc3Y2UzMGEzNTNm";

            $.ajax({
                url: napsterFollowersURL,
                method: "GET"
            }).then(function (info) {
                folButtons.append($("<button id='fol' class='btn btn-outline-primary'>").html(
                    info.artists[0].name));
            });
        };

        $("#influences").html(infButtons);

        $("#followers").html(folButtons);

    });

};

// End card creation function

// Change to secondary display

$(".card").hide();
$("#searchBar").hide();
$("#page-header").hide();
$(".footer").hide();


// Assign keypress to Enter key

$(document).bind('keypress', function (e) {
    if (e.keyCode == 13 && !userSearchDone) {
        $('#addArtistOpener').trigger('click');
    } else if (e.keyCode == 13 && userSearchDone) {
        $('#addArtist').trigger('click');

    }
});

// Opening screen search function

$("#addArtistOpener").on("click", function () {
    event.preventDefault();
    userSearchDone = true;
    var userInputOpener = $("#artistFormOpener").val();
    userInputOpener = userInputOpener.replace("+", " ");
    cardCreation(userInputOpener);
    $("#artistFormOpener").val("");
    $(".icons").fadeOut(500);
    $("#searchBarOpener").fadeOut(500);
    $(treeOneButtons).html("<hr>" + userInputOpener + "<hr>");
    $("#tree1").append(treeOneButtons);
    $(".icons").promise().done(function () {
        $(".footer").fadeIn(2000);
        $("#page-header").fadeIn(500);
        $("#searchBar").fadeIn(500);
        $(".card").fadeIn(1000);
        $("#background-blur").fadeOut(500);
        $("#background-clean").fadeIn(500);
        $("#wat").hide()
    });
});
    
    // Submit artist selection and begin the function to generate their information
        
    $("#addArtist").on("click", function () {
        if ($("#artistForm").val() !== "") {
            event.preventDefault();
            var userInput = $("#artistForm").val();
            treeOneButtons.append("<hr>" + userInput + "<hr>");
            $("#tree1").append(treeOneButtons);
            userInput = userInput.replace(" ", "+");
            embedYoutube(userInput);
            cardCreation(userInput);
            $("#artistForm").val("");
            $("#tree1").append(treeOneButtons);
        }
         
        else {
            entryMod();
        }

    });
    
    // Generation function runs once a "influencers" button is clicked
        
    $(document).on("click", "#infl", function () {
        var userInput = $(this).text();
        embedYoutube(userInput);
        cardCreation(userInput);
        treeOneButtons.append($("<button id='inflTree' class='btn inflTreeIcon' width='100%'>").html("<span><img src='images/seedIconWhite.png' class='seedWhite' width='30' heigh='25'>" + userInput + "</span>"));
        $("#tree1").append(treeOneButtons);

    });

    // Create card from tree

    $(document).on("click", ".inflTreeIcon", function () {
        var userInput = $(this).text()
        cardCreation(userInput);
    });
    
    // Generation function runs once a "followers" button is clicked
        
    $(document).on("click", "#fol", function () {
        var userInput = $(this).text();
        embedYoutube(userInput);
        cardCreation(userInput);
        treeOneButtons.append($("<button id='folTree' class='btn folTreeIcon' width='100%'>").html("<span><img src='images/treeIconWhite.png' class='treeWhite' width='30' height='30' style='display: inline; vertical-align: middle'>" + userInput + "</span>"));
        $("#tree1").append(treeOneButtons);

    });

    // Generate card from tree

    $(document).on("click", ".folTreeIcon", function () {
        var userInput = $(this).text()
        cardCreation(userInput);
    });

    // Clear tree

    $(document).on("click", "#clear1", function () {
        $(".tr1").empty();
    });

    // Expand or shorten bio section

    $(document).on("click", ".bio", function () {
        if (!expand) {
            $(".bio").removeAttr("id", "bio");
            $("#see").text("See Less...");
            expand = true;
        } else {
            $(".bio").attr("id", "bio");
            $("#see").text("See More...");
            expand = false;
        }
    });

    // Closes modals

    $(document).on("click", ".close", hideMod);
