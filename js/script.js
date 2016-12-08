//Select all the student ListItems to be able to operate on them individually
var fullStudentsList = document.getElementsByClassName("student-item");

/**
 * Will use to save a constant version of the student list from which I will take individual elements, 
 * and remove them and append them. All accordingly to the search resutls. 
 * This way I can have only one pagination.  * 
 * **/
const allStudents = $(fullStudentsList).clone();
//Select the first container to append the paginationDiv later on
var container = document.querySelector("div[class=page");

//Returns number of pagination listItems
var defineNumberOfPages = function (arr) {
    return Math.ceil(fullStudentsList.length / 10);
}


//create the li inside  div.pagination > ul
var createAppendPagLi = function (i, parentElement) {

    var li = document.createElement("li");
    var a = document.createElement("a");
    a.innerText = i;
    //Making the first page active
    if (i == 1) {
        a.classList.add("active");
    }

    li.appendChild(a);
    parentElement.appendChild(li);
    console.log(li);
    console.log(a.innerText);

}

var appendCreatePagination = function (int, parentElement) {
    var paginationDiv = document.createElement("div");
    paginationDiv.className = "pagination";

    var paginationUl = document.createElement("ul");
    for (var i = 1; i <= int; i++) {
        createAppendPagLi(i, paginationUl);
        console.log("pageNumberAdded");
    }

    paginationDiv.appendChild(paginationUl);
    parentElement.appendChild(paginationDiv);


}

//Create the pagination div with first page as active showing the 10 students by default
appendCreatePagination(defineNumberOfPages(fullStudentsList), container);

//gets the index of the active page listItem
var currentPageIndex = function () {
    //Getting the index of the "li" in relation with its siblings, any workaround to get the index of the "a"?
    var index = $("a.active").parent().index();
    return index + 1; //i.e. 1 means student 1 to 10.
}

var showSelectedStudents = function (intPageIndex) {
    //select all students hide them
    $(fullStudentsList).hide();
    //range of students to show
    var maxInclusiveInt = intPageIndex * 10 - 1; //we substract one to be able to use the same index 
    var minInclusiveInt = maxInclusiveInt - 9;

    //Shows 10 students
    for (minInclusiveInt; minInclusiveInt <= maxInclusiveInt; minInclusiveInt++) {
        $(fullStudentsList[minInclusiveInt]).show();
    }

}

//display first round of students
showSelectedStudents(currentPageIndex());

//using jquery to manipulate the pagination classes
$(".pagination").on("click", "a", function () {
    //remove "active" class from all the li
    $(this).parent().siblings().removeClass("active");
    //remove "active" class from all a inside the pagination
    $(this).parent().siblings().children().removeClass("active");
    //toggle the "active" class on the a and its parent
    $(this).addClass("active");
    $(this).parent().addClass("active");
    //display a new round of students
    showSelectedStudents(currentPageIndex());

});


var createSearchBar = function () {
    //create the student search elements
    var $studentSearchDiv = $("<div class='student-search'></div>");
    var $searchInput = $("<input id='search-input' placeholder='Search for Students...'>");
    var $buttonStudentSearch = $("<button>Search</button>)");

    //Append the elements accordingly
    $studentSearchDiv.append($searchInput);
    $studentSearchDiv.append($buttonStudentSearch);

    console.log("search bar created and appended");
    return $studentSearchDiv;

}

//Append the searchbar at the end of the first child of the parentElement;
$(".page-header").append(createSearchBar());

//Attaching the event handler to the search button;
$(".student-search").on("click", "button", function () {
    console.log("button clicked");
    var $searchInput = $("div.student-search input");
    searchStudents($searchInput); //add more function

});


//global variable to store the string to search
var sanitizedSearch;
//array of results
var resultsIndex = [];
//no results message
var $noResultsMessage = $("<span class='no-results'></span>");


//sanitizing the search value
var searchStudents = function (inputElement) {
    if (!(inputElement.val()) || $.trim(inputElement.val()) == "") {
        console.log("Search is invalid - reloading original pages");
        $noResultsMessage.text("Enter a name to search");
        $(".page-header").append($noResultsMessage);
        $noResultsMessage.show().delay(4000).fadeOut();
        resultsIndex = [];
        $("div.pagination").show();
        showSelectedStudents(currentPageIndex());
    } else {
        sanitizedSearch = $.trim(inputElement.val()).toLowerCase();
        console.log(sanitizedSearch)

        //search on every student by name and email
        $.each(fullStudentsList, function (indexInArray, element) {
            var name = $(element).find("div.student-details h3").text();
            var email = $(element).find("div.student-details span.email").text();
            console.log("searching");
            //if we got a match we put the correponding index to the global variable resultsIndex
            if (name.includes(sanitizedSearch) || (email.includes(sanitizedSearch))) {
                resultsIndex.push(indexInArray);

            }
        });
        displayStudentsSearch();
    }

}


var displayStudentsSearch = function () {

    //if there are results
    if (resultsIndex.length > 0) {
        //hide pagination
        $("div.pagination").hide();
        //hide all students
        $(fullStudentsList).hide();
        //show the selected students
        $.each(resultsIndex, function (indexInArray, valueOfElement) {
            $(fullStudentsList[valueOfElement]).show();
        });
        resultsIndex = [];
    } else {
        $noResultsMessage.text("Sorry no results, try again!");
        $(".page-header").append($noResultsMessage);
        $noResultsMessage.show().delay(4000).fadeOut();
    }

}