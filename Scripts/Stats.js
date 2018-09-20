var d = new Date();
var statsData = [];
var listOfCategories = [];
var listOfSubCategories = [];
var Category = "1";
var theMonth = d.getMonth();
var theYear = d.getFullYear() + "";
var viewChoice = "Monthly";
var startDate = "";
var endDate = "";
var dataWithinDates = [];
const monthNames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];
var dataMonths = [];
var years = [];
var chart;


function setup() {
	getPast();
	statsData = JSON.parse(statsData);
	getCategories();
	listOfCategories = JSON.parse(listOfCategories);
	getSubCategories();
	listOfSubCategories = JSON.parse(listOfSubCategories);
	splitByMonth();
    addCategoryButtons()
    populateChooseDropDown();
    $('#category' + Category).button('toggle');
    setupMonthly()
}

//splits the data into an array based on the month
function splitByMonth() {
    for (var i = 0; i < statsData.length; i++) {
        var temp = statsData[i][3].split(" ");
        statsData[i][3] = temp[0];
        temp = statsData[i][3].split("/");
        statsData[i][3] = temp[0];
        years.push(temp[2]);
        statsData[i].push(temp[2]);
        statsData[i].push(temp[1]);
    }
    for (var i = 0; i < 12; i++) {
        dataMonths.push([]);
    }
    for (var i = 0; i < statsData.length; i++) {
        dataMonths[parseInt(statsData[i][3]) - 1].push(statsData[i]);
    }
}

//adds the category buttons 
function addCategoryButtons() {
    for (var i = 0; i < listOfCategories.length; i++) {
        $("#CategoryButtons").append('<button class="btn btn-default verticalStats" onClick="clickedCategory(this.id)" id="category' + listOfCategories[i][0] + '">' + listOfCategories[i][1] + '</button>');
    }
    $("#CategoryButtons").append('<br/ >');
    $("#CategoryButtons").append('<p>__________________________________</p>');
    $("#CategoryButtons").append('<p style="font-size:130%;">Total Income:</p>');
    $("#CategoryButtons").append('<p style="font-size:130%;">- Total Spent:</p>');
    $("#CategoryButtons").append('<p style="font-size:130%;">Profit:</p>');
}

//populates the drop down at the top that lets you choose your view
function populateChooseDropDown() {
    choose = ["Monthly", "Average", "Yearly", "Custom"];
    var select = document.getElementById("choose");
    for (var i = 0; i < choose.length; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', i);
        option.appendChild(document.createTextNode(choose[i]));
        select.appendChild(option);
    }
    $("#choose").val(0).change();
}

//selects function to run when choose drop down is changed
function chooseType() {
    if (viewChoice === choose[$('#choose option:selected').val()]) {
        return;
    }
    viewChoice = choose[$('#choose option:selected').val()];
    if (viewChoice === "Monthly") {
        setupMonthly();
    }
    else if (viewChoice === "Yearly") {
        setupYearly();
    }
    else if (viewChoice === "Average") {
        setupAverage();
    }
    else {
        setupCustom();
    }
}

//setup when the Monthly view is chosen
function setupMonthly() {
    $('#category' + Category).button('toggle');
    $("#DateButtons").empty();
    addMonthButtons();
    addYearDropDown();
    populateYearDropDown();
    clickCurrentMonth();
}

//Add Monthly buttons for monthly view
function addMonthButtons() {
    for (var i = 0; i < 12; i++) {
        $("#DateButtons").append('<button class="btn btn-default" onClick="clickedMonth(this.id)" id="month' + i + '">' + monthNames[i] + '</button>');
    }
}

//Add the year dropdown to choose a year. Used for both monthly view and yearly view
function addYearDropDown() {
    $('#DateButtons').append('<select id="year" class="form-control ModalForm" style="width: 80px;" onclick="pickYear()"></select>');
}

//Populates the year dropdown with only the unique years that the user has data with
function populateYearDropDown() {
    years = years.unique();
    var select = document.getElementById("year");
    for (var i = 0; i < years.length; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', i);
        option.appendChild(document.createTextNode(years[i]));
        select.appendChild(option);
    }
    var index = years.indexOf(theYear);
    $("#year").val(index).change();
}


//helper function
Array.prototype.contains = function(v) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === v) return true;
    }
    return false;
};

//helper function
Array.prototype.unique = function() {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        if (!arr.includes(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

//if a category is clicked it clears subcategory data, changes the title and then sets new data for subcategories of the new category
function clickedCategory(id) {
    $("#SubCategoryAmounts").empty();
    $("#SubCategory").empty();
    id = id.replace(/^\D+/g, '');
    if (viewChoice === "Monthly") {
        document.getElementById("title").innerHTML = monthNames[theMonth] + " " + theYear + " - " + listOfCategories[id - 1][1];
        var data = getCategoryAmountData(dataMonths[theMonth], id);
    }
    else if (viewChoice === "Yearly") {
        document.getElementById("title").innerHTML = theYear + " - " + listOfCategories[id - 1][1];
		var data = [];
        var data = getCategoryAmountData(statsData, id);
    }
    else if (viewChoice === "Average" || viewChoice === "Custom") {
        document.getElementById("title").innerHTML = listOfCategories[parseInt(id) - 1][1];
        var data = dataWithinDates;
    }
    $('#category' + Category).button('toggle');
    Category = id;
    $('#category' + Category).button('toggle');
    getSubCatsAndAmounts(id, data);

}

//function that clicks the selected month
function clickCurrentMonth() {
	document.getElementById('month' + theMonth).click();
	$('#month' + theMonth).button('toggle');
	$('#category' + Category).button('toggle');
}

//when you click a month it clears category and subcategory amounts, changes title and then gets new data for category and subcategory of clicked month. Also changes totals at the bottom
function clickedMonth(id) {
    $("#SubCategoryAmounts").empty();
    $("#CategoryAmounts").empty();
    $("#SubCategory").empty();
    id = parseInt(id.replace(/^\D+/g, ''));
    document.getElementById("title").innerHTML = monthNames[id] + " " + theYear + " - " + listOfCategories[parseInt(Category) - 1][1];
    $('#month' + theMonth).button('toggle');
    theMonth = id
    $('#month' + theMonth).button('toggle');
    setCategoryAmounts(dataMonths[id]);
    var data = getCategoryAmountData(dataMonths[id], Category);
    getSubCatsAndAmounts(Category, data);
    changeTotals(dataMonths[id]);
}

//receives a month worth of data and splits it into totals for each category
function setCategoryAmounts(data) {
    var tempData = [];
    var tempAmount = 0.0;
    for (var i = 0; i < listOfCategories.length; i++) {
        tempAmount = 0.0;
        tempData = getCategoryAmountData(data, listOfCategories[i][0]);
        for (var j = 0; j < tempData.length; j++) {
            tempAmount += parseFloat(tempData[j][2]);
        }
        $("#CategoryAmounts").append('<p id="categoryAmount' + listOfCategories[i][0] + '" style="font-size:130%;">$' + tempAmount.toFixed(2) + '</p>');
    }
}

//receives a month worth of data and a category and returns an array of new data with only that category and the selected year
function getCategoryAmountData(data, cat) {
	var newData = [];
    for (var i = 0; i < data.length; i++) {
        if (viewChoice === "Average" || viewChoice === "Custom") {
            if (data[i][0] === cat) {
                newData.push(data[i])
            }
        }
        else {
            if (data[i][0] === cat && data[i][4] === theYear) {
                newData.push(data[i])
            }
        }
	}
	return newData;
}

//receives a category and a months worth of data that only contains that category. Then creates 2 arrays, 
//one is the list of subcategories for that category and the other is the total amounts spent on each of those subcategories.
function getSubCatsAndAmounts(cat, data) {
    var tempSubCat = [];
    for (var i = 0; i < listOfSubCategories.length; i++) {
        if (listOfSubCategories[i][2] === cat) {
            tempSubCat.push(listOfSubCategories[i][0]);
        }
    }
    var tempAmount = [];
    for (var i = 0; i < tempSubCat.length; i++) {
        tempAmount.push(0.0);
        for (var j = 0; j < data.length; j++) {
            if (data[j][1] === tempSubCat[i]) {
                tempAmount[i] += parseFloat(data[j][2]);
            }
        }
    }
	setSubCategoriesAmounts(tempSubCat, tempAmount);
}

//Receives a list of subcategories and amounts and sets those for a certain category
function setSubCategoriesAmounts(subCats, amountData) {
    for (var i = 0; i < listOfSubCategories.length; i++) {
        if (listOfSubCategories[i][2] === Category) {
            index = subCats.indexOf(listOfSubCategories[i][0]);
            $("#SubCategory").append('<p id="subCategory' + listOfSubCategories[i][0] + '" style="font-size:130%;"><b>' + listOfSubCategories[i][1] + ':</b></p>');
            if (viewChoice === "Monthly" || viewChoice === "Yearly" || viewChoice === "Custom") {
                $("#SubCategoryAmounts").append('<p id="subCategoryAmount' + listOfSubCategories[i][0] + '" style="font-size:130%;">$' + amountData[index].toFixed(2) + '</p>');
            }
            else if (viewChoice === "Average") {
                $("#SubCategoryAmounts").append('<p id="subCategoryAmount' + listOfSubCategories[i][0] + '" style="font-size:130%;">$' + (amountData[index] / diff_months(endDate, startDate)).toFixed(2) + '</p>');
            } 
        }
    }
}

//Changes totals, takes into account Money made is positive and everything else is negative.
function changeTotals(data) {
    if (viewChoice === "Average") {
        var diffMon = diff_months(endDate, startDate);
    }
    else {
        var diffMon = 1;
    }
    var index = 0;
    for (var i = 0; i < listOfCategories.length; i++) {
        if (listOfCategories[i][1] === "Money Made") {
            index = i;
        }
    }
    var tempTotal = 0.0;
    var tempSpent = 0.0;
    var tempData = [];
    for (var i = 0; i < listOfCategories.length; i++) {
        if (i === index) {
            tempData = getCategoryAmountData(data, "" + (index + 1));
            for (var j = 0; j < tempData.length; j++) {
                tempTotal += parseFloat(tempData[j][2]);
            }
            $("#CategoryAmounts").append('<br/ >');
            $("#CategoryAmounts").append('<br/ >');
            $("#CategoryAmounts").append('<p id="total" style="font-size:130%;">$' + (tempTotal / diffMon).toFixed(2) + '</p>');
        }
        else {
            tempData = getCategoryAmountData(data, "" + (i + 1));
            for (var j = 0; j < tempData.length; j++) {
                tempSpent += parseFloat(tempData[j][2]);
            }
        }
    }
    $("#CategoryAmounts").append('<p id="spent" style="font-size:130%;">$' + (tempSpent / diffMon).toFixed(2) + '</p>');
    var profit = tempTotal - tempSpent;
    $("#CategoryAmounts").append('<p id="spent" style="font-size:130%;">$' + (profit / diffMon).toFixed(2) + '</p>');
}

//setup for the Yearly view
function setupYearly() {
    $("#DateButtons").empty();
    addYearDropDown();
    populateYearDropDown();
    $('#category' + Category).button('toggle');
    clickCurrentYear();
}

//Changes the data based on which year is selected
function pickYear() {
	if (theYear === years[$('#year option:selected').val()]) {
		return;
	}
	$('#month' + theMonth).button('toggle');
	$('#category' + Category).button('toggle');
    theYear = years[$('#year option:selected').val()];
    if (viewChoice === "Monthly") {
        clickCurrentMonth();
    }
    else if (viewChoice === "Yearly") {
        clickCurrentYear();
    }
}

//Function for yearly view. changes data when different year is selected
function clickCurrentYear() {
    $('#category' + Category).button('toggle');
    $("#SubCategoryAmounts").empty();
    $("#CategoryAmounts").empty();
    $("#SubCategory").empty();
    document.getElementById("title").innerHTML = theYear + " - " + listOfCategories[parseInt(Category) - 1][1];
    setCategoryAmounts(statsData);
    getSubCatsAndAmounts(Category, getCategoryAmountData(statsData, Category));
    changeTotals(statsData);
}

//setup average view
function setupAverage() {
    $("#DateButtons").empty();
    $("#SubCategoryAmounts").empty();
    $("#CategoryAmounts").empty();
    $("#SubCategory").empty();
    document.getElementById("title").innerHTML = listOfCategories[parseInt(Category) - 1][1];
    addStartEndDates();
    populateStartEndDates();
    getDataBetweenDates();
    getAndSetAverageCategoryData(dataWithinDates);
    getSubCatsAndAmounts(Category, dataWithinDates);
    changeTotals(dataWithinDates);
}

//adds a start and and end date
function addStartEndDates() {
    $("#DateButtons").append('<p style="display:inline">Start:&emsp;</p><input class="form-control datepicker_recurring_start" style="display:inline; width:120px;" type="text" id="startDate">')
    $("#DateButtons").append('<p style="display:inline">&emsp;&emsp;&emsp;End:&emsp;</p><input class="form-control datepicker_recurring_start" style="display:inline; width:120px;" type="text" id="endDate">')
    $("#DateButtons").append('&emsp;&emsp;&emsp;&emsp;<button class="btn btn-default" onClick="changeDate()" id="submit">Submit</button>');
}

//datepicker function
$('body').on('focus', ".datepicker_recurring_start", function() {
    $(this).datepicker();
});

//sets the start date and end date
function populateStartEndDates() {
	document.getElementById("startDate").value = "09/01/2017";
	var lastMonth = d.getMonth();
	if (viewChoice === 'Average') {
		var lastYear = 0;
		if (lastMonth === 0) {
			lastMonth = 12;
			lastYear = d.getFullYear() - 1;
		}
		else {
			lastYear = d.getFullYear();
		}
		document.getElementById("endDate").value = lastMonth + "/" + new Date(lastYear, lastMonth, 0).getDate() + "/" + lastYear;
	}
	else {
		document.getElementById("endDate").value = (lastMonth + 1) + "/" + d.getDate() + "/" + d.getFullYear();
	}
    startDate = new Date(document.getElementById("startDate").value);
    endDate = new Date(document.getElementById("endDate").value);
}

//calculates the averages for the data and sets it
function getAndSetAverageCategoryData(dataWithinDates) {
    var tempAmount = 0.0;
    var tempNum = diff_months(endDate, startDate);
    for (var j = 0; j < listOfCategories.length; j++) {
        tempAmount = 0.0;
        for (var k = 0; k < dataWithinDates.length; k++) {
            if (dataWithinDates[k][0] === listOfCategories[j][0]) {
                tempAmount += parseFloat(dataWithinDates[k][2]);
			}
        }
        $("#CategoryAmounts").append('<p id="categoryAmount' + listOfCategories[j][0] + '" style="font-size:130%;">$' + (tempAmount/tempNum).toFixed(2) + '</p>');
    }
}

//gets data between the start date and end date
function getDataBetweenDates() {
    dataWithinDates = []
    for (var i = 0; i < statsData.length; i++) {
        if (inBetweenStartAndEndDate(statsData[i][3], parseInt(statsData[i][5]), statsData[i][4])) {
            dataWithinDates.push(statsData[i]);
        }
    }
}

//returns the number of months between 2 dates
function diff_months(dt2, dt1) {
    var months = (dt2.getFullYear() - dt1.getFullYear()) * 12;
    months += (dt2.getMonth() - dt1.getMonth() + 1);
    return months;
}

//returns true if if a date is between the start and end date
function inBetweenStartAndEndDate(month, day, year) {
    var inputDate = new Date(year, month - 1, day);
    if (inputDate >= startDate) {
        if (inputDate <= endDate) {
            return true;
        }
    }
    return false;
}

//when the submit button is clicked it changes the start and end dates
function changeDate() {
    startDate = new Date(document.getElementById("startDate").value);
    endDate = new Date(document.getElementById("endDate").value);
    $("#SubCategoryAmounts").empty();
    $("#CategoryAmounts").empty();
    $("#SubCategory").empty();
	getDataBetweenDates();
	if (viewChoice === "Average") {
		getAndSetAverageCategoryData(dataWithinDates);
		getSubCatsAndAmounts(Category, dataWithinDates);
	}
	else if (viewChoice === "Custom") {
		setCategoryAmounts(dataWithinDates);
		getSubCatsAndAmounts(Category, getCategoryAmountData(dataWithinDates, Category));
	}
    changeTotals(dataWithinDates);
}

//Sets up the custom date view
function setupCustom() {
	$("#DateButtons").empty();
	$("#SubCategoryAmounts").empty();
	$("#CategoryAmounts").empty();
	$("#SubCategory").empty();
	document.getElementById("title").innerHTML = listOfCategories[parseInt(Category) - 1][1];
	addStartEndDates();
	populateStartEndDates();
	getDataBetweenDates();
	setCategoryAmounts(dataWithinDates);
	getSubCatsAndAmounts(Category, dataWithinDates);
	changeTotals(dataWithinDates);
}

function createChart() {
	chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,
		data: [{
			type: "doughnut",
			startAngle: 60,
			//innerRadius: 60,
			indexLabelFontSize: 17,
			indexLabel: "{label}",
			toolTipContent: "<b>{label}:</b> {y} (#percent%)",
			dataPoints: [
				{ y: 67, label: "Inbox" },
				{ y: 28, label: "Archives" },
				{ y: 10, label: "Labels" },
				{ y: 7, label: "Drafts" },
				{ y: 15, label: "Trash" },
				{ y: 6, label: "Spam" }
			]
		}]
	});
	chart.render();
}

setup();
createChart();

function getCategories() {
	$.ajax({
		type: 'GET',
		url: '../Entry/GetCategories',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		success: function (result) {
			listOfCategories = result;
		}
	});
}

function getSubCategories() {
	$.ajax({
		type: 'GET',
		url: '../Entry/GetSubCategories',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		success: function (result) {
			listOfSubCategories = result;
		}
	});
}

function getPast() {
	$.ajax({
		type: 'GET',
		url: '../Stats/GetStats',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		success: function (result) {
			statsData = result;
		}
	});
}