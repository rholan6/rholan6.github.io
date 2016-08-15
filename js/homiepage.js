$(document).ready(function() {
    //get id
    var uuid;
    //user child
    var user;
    //category child
    var feline;
    //database root
    var homepageDB = new Firebase("https://homiepages.firebaseio.com/");
    //get and handle the button for submitting user id
    var idButton = document.querySelector("#idButton");
    idButton.addEventListener("click", idFunc, false);
    function idFunc() {
        //grab the user's id
        uuid = document.querySelector("#idBox").value;
        homepageDB.once("value", function(snapshot) {
            //check and see if this user exists
            var found = false;
            var loops = 0;
            snapshot.forEach(function(childSS) {
                if(childSS.key() === uuid) {
                    found = true;
                }
                loops++;
            })
            //if this is a new user, add them in
            if(found === false && loops > 0) {
                homepageDB.child(uuid).set("");
            }
            //set the 'user' variable for easy access to its children and move on to the next step
            user = homepageDB.child(uuid);
            formFiller(user);
        })
    }
    //set a variable for quick access to the 'form' div
    var formZone = document.querySelector("#form");
    function formFiller(userPage) {
        //clear the id input div, we're done with that
        document.querySelector("#id").innerHTML = "";
        formZone.innerHTML += "<!-- Bush did 9/11 -->";
        //tell the user about existing categories
        formZone.innerHTML += "<div class = 'col-sm-12'><h3>Existing categories:</h3></div>";
        user.once("value", function(snapshot) {
            snapshot.forEach(function(childSS) {
                formZone.innerHTML += "<div class = 'col-sm-4'><h4>" + childSS.key() + "</h4></div>";
            });
        //});
            //have the user enter a category
            formZone.innerHTML += "<div class = 'col-sm-11'><label for='cat1' >Enter a category: </label><input type='text' class='form-control' id='cat1' placeholder='Type one from the list above to modify its contents or enter a new one to add a new category'/></div><div class = 'col-sm-1'><br/><button type = 'button' id = 'catButt' class = 'btn btn-default'> Submit <span class = 'glyphicon glyphicon-refresh'></span></button></div>";
            //get the category when they hit the submit button
            var catButt = document.querySelector("#catButt");
            catButt.addEventListener("click", catButtPressed, false);
        });
    }
    function catButtPressed() {
        console.log("category button pressed");
        //make a variable for this category
        var kittyGory = document.querySelector("#cat1").value;
        console.log(kittyGory);
        //make a header so the user remembers what category they're dealing with
        formZone.innerHTML = "<h1>" + kittyGory + "</h1>";
        user.once("value", function(snapshot) {
            //check to see if this category exists yet
            var found = false;
            snapshot.forEach(function(childSS) {
                if(childSS.key() === kittyGory) {
                    found = true;
                }
            })
            //if it doesn't exist yet, add it
            if(found === false) {
                user.child(kittyGory).set("");
            }
        })
        //Tell the user what sites they already have
        formZone.innerHTML += "<div class = 'col-sm-12'><h3>Existing sites for this category:</h3></div>";
        feline = user.child(kittyGory);
        feline.once("value", function(snapshot) {
            snapshot.forEach(function(childSS) {
                console.log(childSS.val());
                if(childSS.val() === "") {
                    feline.child(childSS.key()).remove;
                }
                else {
                formZone.innerHTML += "<div class = 'col-sm-4 link'><a href = '" + childSS.val() + "'><h4>" + childSS.key() + "</h4></a></div>";
                }
            })
            //Tell the user to enter sites
            formZone.innerHTML += "<div class = 'col-sm-12'><h4><label for='site1' >Enter the names and urls for a few sites in this category: </label></h4></div>";
            //loop to make the text boxes
            for(var i = 1; i <= 3; i++) {
                formZone.innerHTML += "<div class = 'col-sm-6'><input type='text' class='form-control' id='site" + i +"' placeholder='Site name'/></div><div class = 'col-sm-6'><input type='text' class='form-control' id='link" + i + "' placeholder = 'url'/></div>"
            }
            //make the submit button
            formZone.innerHTML += "<div class = 'col-sm-12'><button type = 'button' id = 'addSites' class = 'btn btn-default'>Add Sites <span class = 'glyphicon glyphicon-floppy-disk'></span></button></div>"
            addSites.addEventListener("click", addSite, false);
        })
    }
    //take in "form" info
    function addSite() {
        var currentSite;
        var currentUrl;
        for(var i = 1; i <= 3; i++) {
            if(document.querySelector("#site" + i).value !== "") {
                currentSite = document.querySelector("#site" + i).value;
                currentUrl = document.querySelector("#link" + i).value;
                feline.child(currentSite).set(currentUrl);
            }
        }
        //serve the page
        formZone.innerHTML = "";
        var siteZone = document.querySelector("#result");
        user.once("value", function(snapshot) {
            var catnum = 1;
            var catdiv;
            //loop through the categories, making a div for each one
            snapshot.forEach(function(childSS) {
                siteZone.innerHTML += "<div class = 'col-sm-3 catcol' id = 'category" + catnum + "'></div>";
                catdiv = document.querySelector("#category" + catnum);
                catdiv.innerHTML += "<h3>" + childSS.key() + "</h3>";
                catdiv.innerHTML += "<ul id = 'catlist" + catnum + "'></ul>"
                var listdiv = document.querySelector("#catlist" + catnum);
                //loop through the sites in each category, listing them in that category's div
                childSS.forEach(function(grandchild) {
                    listdiv.innerHTML += "<li class = 'linkedList'><a href = '" + grandchild.val() + "'>" + grandchild.key() + "</a></li>";
                });
                catnum++;
            });
        });
        //change the page title
        var title = document.querySelector("title");
        title.innerHTML = uuid + "'s Awesome Homepage";
    }

})