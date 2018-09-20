
var listOfCategories = [];
var listOfSubCategories = [];
var entry = [];
var pastData = [];
var entryTable = [];
var table;
var indexes = [];

function setup() {
	getPast();
	pastData = JSON.parse(pastData);
	pastData = pastData.map(function (val) {
		return val.slice(1);
	});
	for (var i = 0; i < pastData.length; i++) {
		temp = pastData[i][3].split(" ");
		pastData[i][3] = temp[0];
	}
	createTable();
	getCategories();
	listOfCategories = JSON.parse(listOfCategories);
	getSubCategories();
	listOfSubCategories = JSON.parse(listOfSubCategories);
	createCategoryButtons();
}

function createCategoryButtons() {
	for (var i = 0; i < listOfCategories.length; i++) {
		$('#Buttons').append('<button id="Category' + listOfCategories[i][0] + '" class="btn btn-default btn-lg centered" onclick="clickedCat(this.id)">' + listOfCategories[i][1] + '</button>')
	}
}

function clickedCat(id) {
	$("#Buttons").empty();
	id = id.replace(/^\D+/g, '');
	var newListOfSubCategories = getSubCategoriesFromCategory(id);
	setSubCategoryButtons(newListOfSubCategories);
	entry.push([id]);
	for (var i = 0; i < listOfCategories.length; i++) {
		if (listOfCategories[i][0] === id) {
			entryTable.push([listOfCategories[i][1]]);
			break;
		}
	}
}

function clickedSubCat(id) {
	$("#Buttons").empty();
	id = id.replace(/^\D+/g, '');
	createCategoryButtons();
	entry[entry.length - 1].push(id);
	for (var i = 0; i < listOfSubCategories.length; i++) {
		if (listOfSubCategories[i][0] === id) {
			entryTable[entryTable.length - 1].push(listOfSubCategories[i][1]);
			break;
		}
	}
	if (indexes.length === 0) {
		indexes.push(0);
	}
	else {
		indexes.push(indexes[indexes.length - 1] + 1);
	}
	addAmount();
	addDate();
	addRemove();
	var temp = storeData(entryTable.length - 1);
	var storeAmount = temp[0];
	var storeDate = temp[1];
	populateEntryTable();
	returnStoredDate(storeAmount, storeDate);
}

function storeData(theLength) {
	var storeAmount = [];
	var storeDate = []
	if (entryTable.length > 1) {
		for (var i = 0; i < theLength; i++) {
			tempAmount = document.getElementById("amount" + indexes[i]).value;
			tempDate = document.getElementById("datepicker" + indexes[i]).value;
			if (tempAmount !== "") {
				storeAmount.push([indexes[i], tempAmount]);
			}
			if (tempDate !== "") {
				storeDate.push([indexes[i], tempDate]);
			}
		}
	}
	return [storeAmount, storeDate];
}

function returnStoredDate(storeAmount, storeDate) {
	var temp;
	for (var i = 0; i < storeAmount.length; i++) {
		temp = document.getElementById("amount" + storeAmount[i][0]);
		if (temp !== null) {
			temp.value = storeAmount[i][1];
		}
	}
	for (var j = 0; j < storeDate.length; j++) {
		temp = document.getElementById("datepicker" + storeDate[j][0]);
		if (temp !== null) {
			temp.value = storeDate[j][1];
		}
	}
}

function addAmount() {
	var amount = '<input class="form-control" type="text" id="amount' + (indexes[indexes.length - 1]) + '" />'
	entryTable[entryTable.length - 1].push(amount);
}

function addDate() {
	var date = '<input class="form-control datepicker_recurring_start" type="text" id="datepicker' + (indexes[indexes.length - 1]) + '">'
	entryTable[entryTable.length - 1].push(date);
}

function addRemove() {
	var remove = '<button id="remove' + (indexes[indexes.length - 1]) + '" class="btn btn-danger" onClick="remove(this.id)">X</button>'
	entryTable[entryTable.length - 1].unshift(remove);
}

function remove(id) {
	id = parseInt(id.replace(/^\D+/g, ''));
	var temp = storeData(entryTable.length);
	var storeAmount = temp[0];
	var storeDate = temp[1];
	console.log(temp);
	console.log(indexes);
	index = indexes.indexOf(id);
	entryTable.splice(index, 1);
	entry.splice(index, 1);
	indexes.splice(index, 1);
	populateEntryTable();
	returnStoredDate(storeAmount, storeDate);
}

$('body').on('focus', ".datepicker_recurring_start", function () {
	$(this).datepicker();
});

function submit() {
	for (var i = 0; i < entryTable.length; i++) {
		if (document.getElementById("amount" + i).value === "") {
			alert("Enter an amount for row: " + (i + 1));
			return;
		}
		if (document.getElementById("datepicker" + i).value === "") {
			alert("Enter a date for row: " + (i + 1));
			return;
		}
	}
	for (var i = 0; i < entryTable.length; i++) {
		entry[i].push(document.getElementById("amount" + i).value);
		entry[i].push(document.getElementById("datepicker" + i).value);
	}
	for (var j = 0; j < entry.length; j++) {
		sendData(entry[j]);
	}
	reset();
}

function reset() {
	entry = [];
	indexes = [];
	entryTable = [];
	$("#EntryTable").DataTable().clear().draw();
	$("#Buttons").empty();
	createCategoryButtons();
	populatePastTable();
}

function setSubCategoryButtons(newListOfSubCategories) {
	for (var i = 0; i < newListOfSubCategories.length; i++) {
		$('#Buttons').append('<button id="SubCategory' + newListOfSubCategories[i][0] + '" class="btn btn-default btn-lg centered" onclick="clickedSubCat(this.id)">' + newListOfSubCategories[i][1] + '</button>')
	}
}

function getSubCategoriesFromCategory(id) {
	var newListOfSubCategories = [];
	for (var i = 0; i < listOfSubCategories.length; i++) {
		if (listOfSubCategories[i][2] === id) {
			newListOfSubCategories.push(listOfSubCategories[i]);
		}
	}
	return newListOfSubCategories;
}

function getClass(id) {
	var str = document.getElementById(id).className.split(" ");
	return str[str.length - 1];
}

function setButtonClass(id, theClass) {
	var str = "btn btn-default btn-lg centered " + theClass;
	document.getElementById(id).setAttribute("class", str);
}

function createTable() {
	table = $('#PastTable').DataTable({
		"dom": '<"top">rt<"bottom"ilp><"clear">',
		"paging": true,
		"lengthChange": false,
		"searching": true,
		"ordering": false,
		"info": true,
		"autoWidth": true,
		"data": pastData,
		"columns": [
			{ title: "Category" },
			{ title: "SubCategory" },
			{ title: "Amount" },
			{ title: "Spent Date" }
		]
	});
	table1 = $('#EntryTable').DataTable({
		"dom": '',
		"paging": true,
		"lengthChange": false,
		"searching": true,
		"ordering": false,
		"info": true,
		"autoWidth": true,
		"data": '',
		"columns": [
			{ title: "", "width": "13%"  },
			{ title: "Category" },
			{ title: "SubCategory" },
			{ title: "Amount" },
			{ title: "Spent Date", "width": "24%" }
		]
	});
}

function populatePastTable() {
	getPast();
	pastData = JSON.parse(pastData);
	pastData = pastData.map(function (val) {
		return val.slice(1);
	});
	table.clear();
	for (var i = 0; i < pastData.length; i++) {
		temp = pastData[i][3].split(" ");
		pastData[i][3] = temp[0];
	}
	for (var i = 0; i < pastData.length; i++) {
		table.row.add(pastData[i]).draw(false);
	}
}

function populateEntryTable() {
	$("#EntryTable").DataTable().clear().draw();
	for (var i = 0; i < entryTable.length; i++) {
		table1.row.add(entryTable[i]).draw(false);
	}
}

setup();

/*
var hi = []
hio();
hi = JSON.parse(hi);
console.log(hi);

for (var i = 0; i < hi.length; i++) {
	sendData(hi[i]);
}*/

function getPast() {
	$.ajax({
		type: 'GET',
		url: '../Past/GetPast',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		success: function (result) {
			pastData = result;
		}
	});
}

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

function sendData(data) {
	var myJson = JSON.stringify(data);

	$.ajax({
		type: 'POST',
		url: '../Entry/SendData',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		data: { 'data': myJson },
		success: function (result) {
		}
	});
}

function hio() {
	$.ajax({
		type: 'GET',
		url: '../Entry/hi',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		success: function (result) {
			hi = result;
		}
	});
}