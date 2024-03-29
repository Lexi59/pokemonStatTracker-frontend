function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false; }
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function (e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            /*close the list of autocompleted values,
            (or any other open lists of autocompleted values:*/
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      } else if (e.keyCode == 9) {
        if (currentFocus > 0 && x[currentFocus].classList.contains("autocomplete-active")) {
          inp.value = x[currentFocus].innerText
        }
        else if (x && x.length > 0) { inp.value = x[0].innerText; }
        closeAllLists();
      }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }


  
async function getAllPokemon() {
    var arr = [];
    await fetch('https://pogoapi.net/api/v1/pokemon_types.json'
    ).then(res => res.json())
      .then(async(result) => {
        var objectArr = Object.values(result);
        var set = new Set();
        for (var i = 0; i < objectArr.length; i++) {
          if (objectArr[i].form == "Normal" || objectArr[i].form == "Purified") {
            set.add(objectArr[i].pokemon_name);
          } else if (objectArr[i].form == "Alola") {
            set.add("Alolan " + objectArr[i].pokemon_name);
          } else if (objectArr[i].form == "Galarian") {
            set.add("Galarian " + objectArr[i].pokemon_name);
          } else if (objectArr[i].form == "Shadow") {
            set.add("Shadow " + objectArr[i].pokemon_name);
          } else if (objectArr[i].form == "Origin" || objectArr[i].form == "Altered"){
            var legs = objectArr[i].form == "Origin"?"(Flying)":"(Legs)";
            set.add(objectArr[i].pokemon_name + " " + objectArr[i].form + " " + legs);
          }
        }
        arr = Array.from(set);
        console.log(arr);
        await fetch('https://pogoapi.net/api/v1/shadow_pokemon.json'
        ).then(res => res.json())
          .then((result) => {
            var objectArr = Object.values(result);
            console.log(objectArr);
            for (var i = 0; i < objectArr.length; i++) {
              arr.push('Shadow '+ objectArr[i].name);
            }

          });
        const expiration = {
          value: arr.join(','),
          expiry: new Date().getTime() + 86400000,
        }
        window.localStorage.setItem('pokemon', JSON.stringify(expiration));
        await getAllShadowPokemon();
      });
  }

  async function getAllShadowPokemon() {
    
  }