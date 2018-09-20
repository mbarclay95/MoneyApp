var pastData = [];
var tempPastData = [];
var editData = [];
var table;
var listOfCategories = [];
var listOfSubCategories = [];
var toggle = 'category';
var inTable = [];
var flag = 0;

function setup() {
	getPast();
	pastData = JSON.parse(pastData);
	addButtons();
	createTable();
	getCategories();
	listOfCategories = JSON.parse(listOfCategories);
	getSubCategories();
	listOfSubCategories = JSON.parse(listOfSubCategories);
}

function createTable() {
	table = $('#PastTable').DataTable({
		"dom": '<"top"f>rt<"bottom"ilp><"clear">',
		"paging": true,
		"lengthChange": false,
		"searching": true,
		"ordering": false,
		"info": true,
		"autoWidth": true,
		"data": tempPastData,
		"columns": [
			{ title: "", "width": "11%" },
			{ title: "Category" },
			{ title: "SubCategory" },
			{ title: "Amount" },
			{ title: "Spent Date" }
		]
	});
}

function addButtons() {
	tempPastData = pastData.map(function (val) {
		return val.slice(1);
	});
	var button;
	var temp;
	for (var i = 0; i < pastData.length; i++) {
		button = '<button id="remove' + pastData[i][0] + '" class="btn btn-danger" onClick="remove(this.id)">X</button>&nbsp;&nbsp;<button id="edit' + pastData[i][0] + '"class="btn btn-primary" onClick="edit(this.id)">Edit</button>';
		tempPastData[i].unshift(button);
		tempPastData[i][3] = "$" + tempPastData[i][3];
		temp = tempPastData[i][4].split(" ");
		tempPastData[i][4] = temp[0];
	}
}

function edit(id) {
	id = id.replace(/^\D+/g, '');
	EditModal.style.display = "block";
	var index = getIndex(id);
	document.getElementById("editDate").value = pastData[index][4].split(" ")[0];
	document.getElementById("editAmount").value = pastData[index][3];
	editData.push(id);
}

function editApply() {
	var date = document.getElementById("editDate").value;
	if (date === "") {
		alert("Enter a date");
		return;
	}
	var amount = document.getElementById("editAmount").value;
	if (amount === "") {
		alert("Enter an amount");
		return;
	}
	editData.push(amount);
	editData.push(date);
	EditEntry(editData);
	populateTable();
	closing2();
}

function populateTable() {
	getPast();
	pastData = JSON.parse(pastData);
	addButtons();
	table.clear();
	if (tempPastData.length === 0) {
		table.draw();
	}
	else {
		for (var i = 0; i < tempPastData.length; i++) {
			table.row.add(tempPastData[i]).draw(true);
		}
	}
}

function getIndex(id) {
	var index = 0;
	for (var i = 0; i < pastData.length; i++) {
		if (id === pastData[i][0]) {
			index = i;
			break;
		}
	}
	return index;
}

function remove(id) {
	if (confirm("Are you sure you want to remove this?")) {
		id = id.replace(/^\D+/g, '');
		RemoveEntry(id);
		populateTable();
	}
}

function closing2() {
	editData = [];
	EditModal.style.display = "none";
}

function closing1() {
	$('#theTable tr').remove();
	ViewModal.style.display = "none";
	$('#buttonContainer').empty();
	$('#topButtons').empty();
	$("#pick").empty();
	toggle = "category";
}

$(function () {
	$('#editDate').datepicker();
});

function openView() {
	ViewModal.style.display = "block";
	$('#pick').hide();
	populateCategories();
	addModalButtons();
	$('#category').button('toggle');
	flag = 0;
	populateDropDown();
}

function populateDropDown() {
	var select = document.getElementById("pick");
	for (var i = 0; i < listOfCategories.length; i++) {
		var option = document.createElement('option');
		option.setAttribute('value', listOfCategories[i][0]);
		option.appendChild(document.createTextNode(listOfCategories[i][1]));
		select.appendChild(option);
	}
}

function editInputs() {
	for (var i = 0; i < inTable.length; i++) {
		$('#' + toggle + inTable[i]).prop("readonly", false);
	}
	$('#buttonContainer').empty();
	$('#buttonContainer').append('<button id="save" class="btn btn-default btn-lg verticalSettings" onclick="save()">Save</button>');
	$('#category').prop('disabled', true);
	$('#subCategory').prop('disabled', true);
}

function save() {
	var temp = [];
	var row = []
	for (var i = 0; i < inTable.length; i++) {
		row = [];
		row.push(inTable[i]);
		row.push($('#' + toggle + inTable[i]).val());
		if (toggle === 'category') {
			row.push("0");
		}
		else {
			row.push("1");
		}
		temp.push(row);
	}
	for (var j = 0; j < temp.length; j++) {
		EditCatOrSubCat(temp[j]);
	}
	for (var i = 0; i < inTable.length; i++) {
		$('#' + toggle + inTable[i]).prop("readonly", true);
	}
	reset($('#pick option:selected').val());
	populateTable();
}

function addModalButtons() {
	$('#buttonContainer').append('<button id="edit" class="btn btn-default btn-lg verticalSettings" onclick="editInputs()">Edit</button>');
	$('#buttonContainer').append('<button id="add" class="btn btn-default btn-lg verticalSettings" onclick="addInputs()">Add</button>');
	$('#buttonContainer').append('<button id="add" class="btn btn-default btn-lg" onclick="removeInputs()">Remove</button>');
	$('#topButtons').append('<button class="btn btn-primary btn-default" id="category" onclick="toggleCat(this.id)">Category</button>');
	$('#topButtons').append('<button class="btn btn-primary btn-default" id="subCategory" onclick="toggleSubCat(this.id)">SubCategory</button>');
}

function addInputs() {
	$('#theTable').append('<tr><td><input id="new" class="form-control ModalFormSettings" value=""></input></td></tr>');
	$('#buttonContainer').empty();
	$('#buttonContainer').append('<button id="save" class="btn btn-default btn-lg verticalSettings" onclick="saveNew()">Save</button>');
	$('#category').prop('disabled', true);
	$('#subCategory').prop('disabled', true);
}

function removeInputs() {
	$('#buttonContainer').empty();
	$('#buttonContainer').append('<button id="cancel" class="btn btn-default btn-lg verticalSettings" onclick="cancel()">Cancel</button>');
	$('#category').prop('disabled', true);
	$('#subCategory').prop('disabled', true);
	var element;
	for (var i = 0; i < inTable.length; i++) {
		element = document.getElementById(toggle + inTable[i]);
		$(element).addClass("remove");
		$(element).on('click', { id: inTable[i] }, confirmRemove);
	}
}

function cancel() {
	reset();
}

function confirmRemove(event) {
	var temp = [];
	var message;
	var count = 0;
	if (toggle === 'category') {
		for (var i = 0; i < pastData.length; i++) {
			if (pastData[i][1] === document.getElementById(toggle + event.data.id).value) {
				count += 1;
			}
		}
		message = count + " entries will be removed with this Category and all SubCategories contained in this Category. Are you sure you want to remove it?";
	}
	else {
		for (var i = 0; i < pastData.length; i++) {
			if (pastData[i][2] === document.getElementById(toggle + event.data.id).value) {
				count += 1;
			}
		}
		message = count + " entries will be removed with this SubCategory. Are you sure you want to remove it?";
	}
	if (confirm(message)) {
		temp.push(event.data.id);
		if (toggle === 'category') {
			temp.push("0");
		}
		else {
			temp.push("1");
		}
		RemoveCatOrSubCat(temp)
		reset($('#pick option:selected').val());
		populateTable();
	}
	return false;
}

function saveNew() {
	var temp = []
	temp.push(document.getElementById("new").value);
	if (temp[0] === "") {
		alert("Enter text into box");
		return;
	}
	if (toggle === 'category') {
		temp.push("0");
	}
	else {
		temp.push($('#pick option:selected').val());
	}
	AddCatOrSubCat(temp);
	reset(temp[1]);
}

function reset(categoryid) {
	getCategories();
	listOfCategories = JSON.parse(listOfCategories);
	getSubCategories();
	listOfSubCategories = JSON.parse(listOfSubCategories);
	$('#buttonContainer').empty();
	$('#topButtons').empty();
	$('#pick').empty();
	$('#theTable').empty();
	populateDropDown()
	addModalButtons();
	if (toggle === 'category') {
		$('#category').button('toggle');
		populateCategories();
	}
	else {
		$('#subCategory').button('toggle');
		$("#pick").val(categoryid).change();
		populateSubCategories(categoryid);
	}
	flag = 0;
}

function toggleCat(id) {
	if (toggle !== id) {
		if (flag === 0) {
			$('#subCategory').button('toggle');
			flag = 1;
		}
		$('#theTable').empty();
		inTable = [];
		toggle = 'category';
		$('#pick').hide("slow");
		populateCategories()
	}
}

function toggleSubCat(id) {
	if (toggle !== id) {
		if (flag === 0) {
			$('#category').button('toggle');
			flag = 1;
		}
		$('#theTable').empty();
		inTable = [];
		toggle = 'subCategory';
		$('#pick').show("slow");
		populateSubCategories($('#pick option:selected').val());
	}
}

function populateCategories() {
	var theCategories = [];
	for (var i = 0; i < listOfCategories.length; i++) {
		theCategories.push('<tr><td><input id ="category' + listOfCategories[i][0] + '" class="form-control ModalFormSettings" value="' + listOfCategories[i][1] + '" readonly></input></td></tr>');
		inTable.push(listOfCategories[i][0]);
	}
	$('#theTable').append(theCategories);
}

function pickCategory() {
	$('#theTable').empty();
	inTable = []
	populateSubCategories($('#pick option:selected').val());
}

function populateSubCategories(thecategory) {
	var theCategories = [];
	var newListOfSubCategories = []
	for (var i = 0; i < listOfSubCategories.length; i++) {
		if (listOfSubCategories[i][2] === thecategory) {
			newListOfSubCategories.push(listOfSubCategories[i]);
		}
	}
	for (var i = 0; i < newListOfSubCategories.length; i++) {
		theCategories.push('<tr><td><input id ="subCategory' + newListOfSubCategories[i][0] + '" class="form-control ModalFormSettings" value="' + newListOfSubCategories[i][1] + '" readonly></input></td></tr>');
		inTable.push(newListOfSubCategories[i][0]);
	}
	$('#theTable').append(theCategories);
}

setup();

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

function EditEntry(data) {
	var myJson = JSON.stringify(data);
	$.ajax({
		type: 'POST',
		url: '../Past/EditEntry',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		data: { 'data': myJson },
		success: function (result) {
		}
	});
}

function AddCatOrSubCat(data) {
	var myJson = JSON.stringify(data);
	$.ajax({
		type: 'POST',
		url: '../Past/AddCatOrSubCat',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		data: { 'data': myJson },
		success: function (result) {
		}
	});
}

function EditCatOrSubCat(data) {
	var myJson = JSON.stringify(data);
	$.ajax({
		type: 'POST',
		url: '../Past/EditCatOrSubCat',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		data: { 'data': myJson },
		success: function (result) {
		}
	});
}

function RemoveCatOrSubCat(data) {
	var myJson = JSON.stringify(data);
	$.ajax({
		type: 'POST',
		url: '../Past/RemoveCatOrSubCat',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		data: { 'data': myJson },
		success: function (result) {
		}
	});
}

function RemoveEntry(data) {
	var myJson = JSON.stringify(data);
	$.ajax({
		type: 'POST',
		url: '../Past/RemoveEntry',
		dataType: 'json',
		async: false,
		JsonRequestBehavior: 'AllowGet',
		data: { 'data': myJson },
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