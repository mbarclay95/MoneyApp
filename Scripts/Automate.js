var automateData = [];
var tempAutomateData = [];
var listOfCategories = [];
var listOfSubCategories = [];
var Category = "1";
var addRow = [];
var table;
var editRow = [];

function setup() {
	RunAutomate();
	getAutomate();
	automateData = JSON.parse(automateData);
	getCategories();
	listOfCategories = JSON.parse(listOfCategories);
	getSubCategories();
	listOfSubCategories = JSON.parse(listOfSubCategories);
	addButtons();
	createTable();
}

function addButtons() {
	tempAutomateData = automateData.map(function (val) {
		return val.slice(1);
	});
	var button;
	for (var i = 0; i < automateData.length; i++) {
		button = '<button id="remove' + automateData[i][0] + '" class="btn btn-danger" onClick="remove(this.id)">X</button>&nbsp;&nbsp;<button id="edit' + automateData[i][0] + '" class="btn btn-primary" onClick="edit(this.id)">Edit</button>';
		tempAutomateData[i].unshift(button);
		tempAutomateData[i][3] = "$" + tempAutomateData[i][3];
		var temp = tempAutomateData[i][4].split(" ");
		tempAutomateData[i][4] = temp[0];
		temp = tempAutomateData[i][5].split(" ");
		tempAutomateData[i][5] = temp[0];
	}
}

function createTable() {
	table = $('#AutomateTable').DataTable({
		"dom": '<"top"f>rt<"bottom"ilp><"clear">',
		"paging": false,
		"lengthChange": false,
		"searching": true,
		"ordering": false,
		"info": true,
		"autoWidth": true,
		"data": tempAutomateData,
		"columns": [
			{ title: "", "width": "11%" },
			{ title: "Category" },
			{ title: "SubCategory" },
			{ title: "Amount" },
			{ title: "Next Due Date" },
			{ title: "Last Ran" }
		]
	});
}

function populateTable() {
	getAutomate();
	automateData = JSON.parse(automateData);
	addButtons();
	table.clear();
	if (tempAutomateData.length === 0) {
		table.draw();
	}
	else {
		for (var i = 0; i < tempAutomateData.length; i++) {
			table.row.add(tempAutomateData[i]).draw(true);
		}
	}
}

function edit(id) {
	EditModal.style.display = "block";
	id = id.replace(/^\D+/g, '');
	editRow.push(id);
	index = 0
	for (var i = 0; i < automateData.length; i++) {
		if (automateData[i][0] === id) {
			index = i;
		}
	}
	document.getElementById("editDay").value = automateData[index][4].split("/")[1];
	document.getElementById("editAmount").value = automateData[index][3];
}

function editApply() {
	var d = new Date();
	var day = document.getElementById("editDay").value;
	if (day === "") {
		alert("Enter a day of the month");
		return;
	}
	if (day < 1 || day > 31) {
		alert("Enter correct day of the month");
		return;
	}
	var amount = document.getElementById("editAmount").value;
	if (amount === "") {
		alert("Enter an amount");
		return;
	}
	editRow.push(day);
	editRow.push(amount);
	editRow.push(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + day);
	EditAutomate(editRow);
	populateTable();
	closing2();
}

function remove(id) {
	if (confirm("Are you sure you want to remove this?")) {
		id = id.replace(/^\D+/g, '');
		RemoveAutomate(id);
		populateTable();
	}
}

function add() {
	AddModal.style.display = "block";
	var select = document.getElementById("category");
	for (var i = 0; i < listOfCategories.length; i++) {
		var option = document.createElement('option');
		option.setAttribute('value', listOfCategories[i][0]);
		option.appendChild(document.createTextNode(listOfCategories[i][1]));
		select.appendChild(option);
	}
	populateSubCategories(Category);
}

function pickedCategory() {
	var index = $("#category option:selected").val();
	if (index !== Category) {
		Category = index;
		$("#subCategory").empty();
		populateSubCategories(index);
	}
}

function populateSubCategories(index) {
	var newListOfSubCategories = [];
	for (var i = 0; i < listOfSubCategories.length; i++) {
		if (listOfSubCategories[i][2] === index) {
			newListOfSubCategories.push(listOfSubCategories[i]);
		}
	}
	var select = document.getElementById("subCategory");
	for (var i = 0; i < newListOfSubCategories.length; i++) {
		var option = document.createElement('option');
		option.setAttribute('value', newListOfSubCategories[i][0]);
		option.appendChild(document.createTextNode(newListOfSubCategories[i][1]));
		select.appendChild(option);
	}
}

function closing1() {
	$("#category").empty();
	$("#subCategory").empty();
	AddModal.style.display = "none";
}

function closing2() {
	editRow = [];
	EditModal.style.display = "none";
}

function applyAdd() {
	var d = new Date();
	addRow = [];
	addRow.push(Category);
	addRow.push($("#subCategory option:selected").val());
	var day = document.getElementById("day").value;
	if (day === "") {
		alert("Enter a day of the month");
		return;
	}
	if (day < 1 || day > 31) {
		alert("Enter correct day of the month");
		return;
	}
	var amount = document.getElementById("amount").value;
	if (amount === "") {
		alert("Enter an amount");
		return;
	}
	addRow.push(day);
	addRow.push(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + day);
	addRow.push(amount);
	AddAutomate(addRow);
	document.getElementById("day").value = "";
	document.getElementById("amount").value = "";
	closing1();
	populateTable();
}

setup();

function getAutomate() {
	$.ajax({
		type: 'GET',
		url: '../Automate/GetAutomations',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		success: function (result) {
			automateData = result;
		}
	});
}

function AddAutomate(data) {
	var myJson = JSON.stringify(data);
	$.ajax({
		type: 'POST',
		url: '../Automate/AddAutomate',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		data: { 'data': myJson },
		success: function (result) {
		}
	});
}

function RemoveAutomate(data) {
	var myJson = JSON.stringify(data);
	$.ajax({
		type: 'POST',
		url: '../Automate/RemoveAutomate',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		data: { 'data': myJson },
		success: function (result) {
		}
	});
}

function EditAutomate(data) {
	var myJson = JSON.stringify(data);
	$.ajax({
		type: 'POST',
		url: '../Automate/EditAutomate',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		data: { 'data': myJson },
		success: function (result) {
		}
	});
}

function RunAutomate() {
	$.ajax({
		type: 'POST',
		url: '../Automate/RunAutomate',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		success: function (result) {
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