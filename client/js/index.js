//server base domain url 
const domainUrl = "http://localhost:3000";  // if local test, pls use this 

//==================================index.html==================================//

var debug = true;
var authenticated = false;


$(document).ready(function () {
	
/**
----------------------Event handler to process login request----------------------
**/
   
	$('#loginButton').click(function () {

		localStorage.removeItem("inputData");

		$("#loginForm").submit();

		if (localStorage.inputData != null) {

			var inputData = JSON.parse(localStorage.getItem("inputData"));

			$.post(domainUrl + "/verifyUser", inputData,  function(data, status){
				
				if (data.length > 0) {
					alert("Login success");
					authenticated = true;
					localStorage.setItem("userInfo", JSON.stringify(data[0]));	
					$.mobile.changePage("#homePage");
				} 
				else {
					alert("Login failed");
				}

				$("#loginForm").trigger('reset');	
			})
		}
		
	})


	$("#loginForm").validate({ // JQuery validation plugin
		focusInvalid: false,  
		onkeyup: false,
		submitHandler: function (form) {   
			authenticated = false;
			
			var formData =$(form).serializeArray();
			var inputData = {};
			formData.forEach(function(data){
				inputData[data.name] = data.value;
			})

			localStorage.setItem("inputData", JSON.stringify(inputData));		

		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				rangelength: [3, 10]
			}
		},
		/* Validation message */
		messages: {
			email: {
				required: "please enter your email",
				email: "The email format is incorrect  "
			},
			password: {
				required: "It cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")

			}
		},
	});
	
	/**
	--------------------------end--------------------------
	**/	
	
	/**
	--------------------Event handler to respond to signUp Button----------------------
	**/
	
	$('#signUpButton').click(function () {

		localStorage.removeItem("signUpData");

		// Serialize form data automatically as an array of name-value pairs
		var formArray = $("#signUpForm").serializeArray();

		// Convert the array into an object for easy handling
		var formData = {};
		var haveValues = true;
		
		$.each(formArray, function (i, field) {
			if (field.value.trim() == "") { // If any value is not empty
				haveValues = false;
			formData[field.name] = field.value;
			}
		});

		// Store form data into localStorage for later use
		localStorage.setItem("signUpData", JSON.stringify(formData));
		console.log(localStorage.signUpData);

		if (haveValues) {
			
			var signUpData = JSON.parse(localStorage.getItem("signUpData"));

			$.post(domainUrl + "/addUser", signUpData,  function(data, status){
				if (status) {
					alert("Signup success");
					$.mobile.changePage("#loginPage");
				} 
				else {
					alert("Signup failed");
				}

				$("#signUpForm").trigger('reset');	
			})
			
			$.mobile.changePage("#loginPage");
		}//end if statement
		else
			alert("Signup failed");
	});
	
	/**
	--------------------------end--------------------------
	**/	
	
	/**
	--------------------Signup form JQuery validation plugin----------------------
	**/
	
	$("#signUpForm").validate({
		focusInvalid: false,  
		onkeyup: false,
		submitHandler: function (form) {   
			
			var formData =$(form).serializeArray();
			var signUpData = {};
			formData.forEach(function(data){
				signUpData[data.name] = data.value;
			})

			localStorage.setItem("signUpData", JSON.stringify(signUpData));		
		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				rangelength: [3, 10]
			},
			firstName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			lastName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			phoneNumber: {
				required: true,
				mobiletxt: true
			},
			address: {
				required: true,
				rangelength: [1, 25]
			},
			postcode: {
				required: true,
				posttxt: true
			},
		},
		/* Validation message */
		messages: {
			email: {
				required: "Please enter your email",
				email: "The email format is incorrect"
			},
			password: {
				required: "Password cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")

			},
			firstName: {
				required: "Please enter your firstname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),

			},
			lastName: {
				required: "Please enter your lastname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			phoneNumber: {
				required: "Phone number required",
			},
			address: {
				required: "Delivery address required",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			postcode: {
				required: "Postcode required",

			},
		},
	});
	
	/**
	--------------------------end--------------------------
	**/
	
	/**
	--------------------Event handler to process order submission----------------------
	**/

	$('#confirmOrderButton').on('click', function () {
		
		localStorage.removeItem("inputData");

		$("#orderForm").submit();

		
		
			var orderInfo = JSON.parse(localStorage.getItem("inputData"));

			orderInfo.itemName = localStorage.getItem("itemName");
			orderInfo.itemPrice = localStorage.getItem("itemPrice");
			orderInfo.itemImage = localStorage.getItem("itemImage");
			
			var userInfo = JSON.parse(localStorage.getItem("userInfo"));

			orderInfo.customerEmail = userInfo.email;

			orderInfo.orderNo = Math.trunc(Math.random()*900000 + 100000);

			localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
			

			$.post(domainUrl + "/postOrderData", orderInfo, function(data, status){
			
				//clear form data 
				$("#orderForm").trigger('reset');
				
				$.mobile.changePage("#orderConfirmationPage");
	
			});		
		

	})


	$("#orderForm").validate({  // JQuery validation plugin
		focusInvalid: false, 
		onkeyup: false,
		submitHandler: function (form) {   
			
			var formData =$(form).serializeArray();
			var inputData = {};

			formData.forEach(function(data){
				inputData[data.name] = data.value;
			});

			localStorage.setItem("inputData", JSON.stringify(inputData));
					
		},
		
		/* validation rules */
		
		rules: {
			firstName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			lastName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			phoneNumber: {
				required: true,
				mobiletxt: true
			},
			address: {
				required: true,
				rangelength: [1, 25]
			},
			postcode: {
				required: true,
				posttxt: true
			},/*
			oDate: {
				required: true,
				datetime: true
			},*/
		},
		/* Validation Message */

		messages: {
			firstName: {
				required: "Please enter your firstname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),

			},
			lastName: {
				required: "Please enter your lastname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			phoneNumber: {
				required: "Phone number required",
			},
			address: {
				required: "Delivery address required",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			postcode: {
				required: "Postcode required",

			},/*
			date2: {
				required: "required",
			},*/
		}
	});

	/**
	--------------------------end--------------------------
	**/


	/**
	--------------------Event handler to perform initialisation before the Login page is displayed--------------------
	**/

	$(document).on("pagebeforeshow", "#loginPage", function() {
	
		localStorage.removeItem("userInfo");
		
		authenticated = false;
	
	});  
	
	/**
	--------------------------end--------------------------
	**/	


	/**
	--------------------Event handler to populate the Fill Order page before it is displayed---------------------
	**/

	
	$(document).on("pagecreate", "#fillOrderPage", function() {
		
		$("#itemSelected").html(localStorage.getItem("itemName"));
		$("#priceSelected").html(localStorage.getItem("itemPrice"));
		$("#imageSelected").attr('src', localStorage.getItem("itemImage"));
	
	});  
	
	/**
	--------------------------end--------------------------
	**/	

	/**
	--------------------Event handler to populate the Order Confirmation page before it is displayed---------------------
	**/
	 
	$(document).on("pagebeforeshow", "#orderConfirmationPage", function() {
		
		$('#orderInfo').html("");

		if (localStorage.orderInfo != null) {
	
			var orderInfo = JSON.parse(localStorage.getItem("orderInfo"));
	
			$('#orderInfo').append(`<br><table><tbody>`);
			$('#orderInfo').append(`<tr><td>Order no: </td><td><span class=\"fcolor\"> ${orderInfo.orderNo} </span></td></tr>`);	
			$('#orderInfo').append(`<tr><td>Customer: </td><td><span class=\"fcolor\"> ${orderInfo.customerEmail} </span></td></tr>`);	
			$('#orderInfo').append(`<tr><td>Item: </td><td><span class=\"fcolor\"> ${orderInfo.itemName}  </span></td></tr>`);	
			$('#orderInfo').append(`<tr><td>Price: </td><td><span class=\"fcolor\"> ${orderInfo.itemPrice} </span></td></tr>`);
			$('#orderInfo').append(`<tr><td>Recipient: </td><td><span class=\"fcolor\"> ${orderInfo.firstName} ${orderInfo.lastName}</span></td></tr>`);
			$('#orderInfo').append(`<tr><td>Phone number: </td><td><span class=\"fcolor\"> ${orderInfo.phoneNumber} </span></td></tr>`);
			$('#orderInfo').append(`<tr><td>Address: </td><td><span class=\"fcolor\"> ${orderInfo.address} ${orderInfo.postcode} </span></td></tr>`);
			$('#orderInfo').append(`<tr><td>Dispatch date: </td><td><span class=\"fcolor\"> ${orderInfo.date} </span></td></tr>`);
			$('#orderInfo').append(`</tbody></table><br>`);
		}
		else {
			$('#orderInfo').append('<h3>There is no order to display<h3>');
		}
	});  

	/**
	--------------------------end--------------------------
	**/	
	
	/**
	--------------------Event handler to display the user past Orders in DeletePage---------------------
	**/

	$(document).on("pagebeforeshow", "#deleteOrders",function displayOrders() {
		
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		
		$.get(domainUrl + "/getPastOrders", { email: userInfo.email }, function(data, status) {
			
			// Clear the existing content to avoid duplicates
			deleteOrdersList.innerHTML = '';
            if(data.length === 0) {
				$('#deleteOrdersList').append('<h4 style="text-align: center;">There are no orders to display<h4>');
			}
            
			else {
				
				// Iterate through userOrders and create HTML elements
				$('#deleteOrdersList').append('<br><table><tbody>');
				data.forEach(userOrder => {
					$('#deleteOrdersList').append('<tr><td>Order no: </td><td><span class=\"fcolor\">' + userOrder.orderNo + '</span></td></tr>');	
					$('#deleteOrdersList').append('<tr><td>Customer: </td><td><span class=\"fcolor\">' + userOrder.customerEmail + '</span></td></tr>');	
					$('#deleteOrdersList').append('<tr><td>Item: </td><td><span class=\"fcolor\">' + userOrder.itemName + '</span></td></tr>');	
					$('#deleteOrdersList').append('<tr><td>Price: </td><td><span class=\"fcolor\">' + userOrder.itemPrice + '</span></td></tr>');
					$('#deleteOrdersList').append('<tr><td>Recipient: </td><td><span class=\"fcolor\">' + userOrder.firstName + ' ' + userOrder.lastName + '</span></td></tr>');
					$('#deleteOrdersList').append('<tr><td>Phone number: </td><td><span class=\"fcolor\">' + userOrder.phoneNumber + '</span></td></tr>');
					$('#deleteOrdersList').append('<tr><td>Address: </td><td><span class=\"fcolor\">' + userOrder.address + ' ' + userOrder.postcode + '</span></td></tr>');
					$('#deleteOrdersList').append('<tr><td>Dispatch date: </td><td><span class=\"fcolor\">' + userOrder.date + '</span></td></tr>');
					$('#deleteOrdersList').append('<tr><td>Tick this box to delete </td><td><input type="checkbox" class="delete-checkbox" data-order-no="'+userOrder.orderNo+'"></td></tr>');
					$('#deleteOrdersList').append('<br><br>');
				});
				$('#deleteOrdersList').append('</tbody></table><br>');
				
			}
			
		});

    });
	
	
	$('#deleteButton').click(function() {
		
		
		let selectedOrders = [];

		// Loop through each checked checkbox and collect the orderNo
		$('.delete-checkbox:checked').each(function() {
			const orderNo = $(this).data('order-no');
			selectedOrders.push(orderNo); // Collect the order numbers of the selected checkboxes
		});
		
		console.log("selectedOrders: "+JSON.stringify(selectedOrders));
		
		// Store the selected orders in localStorage
		if (selectedOrders.length === 0) {
			$.mobile.changePage("#deleteOrders");
			alert("No orders selected for deletion.");
		}
		else {
			
			$.post(domainUrl + "/deleteUserOrders",  { orderNo: selectedOrders },  function(data, status){
								
				localStorage.setItem("deleteCountMsg", data.msg);
				
				if (status) {		
					const message = document.getElementById('message');
						
					// Clear the existing content to avoid duplicates
					message.innerHTML = '';
					$('#message').append(data.msg);
				}
				
			})
			
			$.mobile.changePage("#orderConfirmationPage");
		}
	
	});
	
	
	/**
	--------------------Event handler to display the user past Orders---------------------
	**/

	$(document).on("pagebeforeshow", "#pastOrders",function displayOrders() {
		
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		
		$.get(domainUrl + "/getPastOrders", { email: userInfo.email }, function(data, status) {
			
			// Clear the existing content to avoid duplicates
			ordersList.innerHTML = '';
            if(data.length === 0) {
				$('#ordersList').append('<h4 style="text-align: center;">There are no orders to display<h4>');
			}
            
			else {
				
				// Iterate through userOrders and create HTML elements
				$('#ordersList').append('<br><table><tbody>');
				data.forEach(userOrder => {
					$('#ordersList').append('<tr><td>Order no: </td><td><span class=\"fcolor\">' + userOrder.orderNo + '</span></td></tr>');	
					$('#ordersList').append('<tr><td>Customer: </td><td><span class=\"fcolor\">' + userOrder.customerEmail + '</span></td></tr>');	
					$('#ordersList').append('<tr><td>Item: </td><td><span class=\"fcolor\">' + userOrder.itemName + '</span></td></tr>');	
					$('#ordersList').append('<tr><td>Price: </td><td><span class=\"fcolor\">' + userOrder.itemPrice + '</span></td></tr>');
					$('#ordersList').append('<tr><td>Recipient: </td><td><span class=\"fcolor\">' + userOrder.firstName + ' ' + userOrder.lastName + '</span></td></tr>');
					$('#ordersList').append('<tr><td>Phone number: </td><td><span class=\"fcolor\">' + userOrder.phoneNumber + '</span></td></tr>');
					$('#ordersList').append('<tr><td>Address: </td><td><span class=\"fcolor\">' + userOrder.address + ' ' + userOrder.postcode + '</span></td></tr>');
					$('#ordersList').append('<tr><td>Dispatch date: </td><td><span class=\"fcolor\">' + userOrder.date + '</span></td></tr>');
					$('#ordersList').append('<br><br>');
				});
				$('#ordersList').append('</tbody></table><br>');
				
			}
			
		});

    });
		
	
	/**
	--------------------------end--------------------------
	**/	
	
	/**
	--------------------Event handler to delete the user past Orders---------------------
	**/

	$(document).on("pagebeforeshow", "#deleteConfirmation",function deleteOrders() {
		
		const deleteCountMsg = localStorage.getItem("deleteCountMsg");	
		const message = document.getElementById('message');
		
		// Clear the existing content to avoid duplicates
		message.innerHTML = '';
		$('#message').append(deleteCountMsg);
		localStorage.removeItem("deleteCountMsg");
    });
	
	/**
	--------------------------end--------------------------
	**/	

});



