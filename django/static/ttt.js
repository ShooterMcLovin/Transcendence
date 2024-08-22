// Function called whenever user tab on any box 
function myfunc() { 

	// Setting DOM to all boxes or input field 
	var b1, b2, b3, b4, b5, b6, b7, b8, b9; 
	b1 = document.getElementById("b1").value; 
	b2 = document.getElementById("b2").value; 
	b3 = document.getElementById("b3").value; 
	b4 = document.getElementById("b4").value; 
	b5 = document.getElementById("b5").value; 
	b6 = document.getElementById("b6").value; 
	b7 = document.getElementById("b7").value; 
	b8 = document.getElementById("b8").value; 
	b9 = document.getElementById("b9").value; 

	var b1btn, b2btn, b3btn, b4btn, b5btn, 
		b6btn, b7btn, b8btn, b9btn; 
		
	b1btn = document.getElementById("b1"); 
	b2btn = document.getElementById("b2"); 
	b3btn = document.getElementById("b3"); 
	b4btn = document.getElementById("b4"); 
	b5btn = document.getElementById("b5"); 
	b6btn = document.getElementById("b6"); 
	b7btn = document.getElementById("b7"); 
	b8btn = document.getElementById("b8"); 
	b9btn = document.getElementById("b9"); 

	// Checking if Player X won or not and after 
	// that disabled all the other fields 
	if ((b1 == 'x' || b1 == 'X') && (b2 == 'x' || 
		b2 == 'X') && (b3 == 'x' || b3 == 'X')) { 
		document.getElementById('print') 
			.innerHTML = "Player X won"; 
		b4btn.disabled = true; 
		b5btn.disabled = true; 
		b6btn.disabled = true; 
		b7btn.disabled = true; 
		b8btn.disabled = true; 
		b9btn.disabled = true; 

		b1btn.style.color = "red"; 
		b2btn.style.color = "red"; 
		b3btn.style.color = "red"; 
	} 
	else if ((b1 == 'x' || b1 == 'X') && (b4 == 'x' || 
		b4 == 'X') && (b7 == 'x' || b7 == 'X')) { 
		document.getElementById('print') 
			.innerHTML = "Player X won"; 
		b2btn.disabled = true; 
		b3btn.disabled = true; 
		b5btn.disabled = true; 
		b6btn.disabled = true; 
		b8btn.disabled = true; 
		b9btn.disabled = true; 

		b1btn.style.color = "red"; 
		b4btn.style.color = "red"; 
		b7btn.style.color = "red"; 
	} 
	else if ((b7 == 'x' || b7 == 'X') && (b8 == 'x' || 
		b8 == 'X') && (b9 == 'x' || b9 == 'X')) { 
		document.getElementById('print') 
			.innerHTML = "Player X won"; 

		b1btn.disabled = true; 
		b2btn.disabled = true; 
		b3btn.disabled = true; 
		b4btn.disabled = true; 
		b5btn.disabled = true; 
		b6btn.disabled = true; 

		b7btn.style.color = "red"; 
		b8btn.style.color = "red"; 
		b9btn.style.color = "red"; 
	} 
	else if ((b3 == 'x' || b3 == 'X') && (b6 == 'x' || 
		b6 == 'X') && (b9 == 'x' || b9 == 'X')) { 
		document.getElementById('print') 
			.innerHTML = "Player X won"; 

		b1btn.disabled = true; 
		b2btn.disabled = true; 
		b4btn.disabled = true; 
		b5btn.disabled = true; 
		b7btn.disabled = true; 
		b8btn.disabled = true; 

		b3btn.style.color = "red"; 
		b6btn.style.color = "red"; 
		b9btn.style.color = "red"; 
	} 
	else if ((b1 == 'x' || b1 == 'X') && (b5 == 'x' || 
		b5 == 'X') && (b9 == 'x' || b9 == 'X')) { 
		document.getElementById('print') 
			.innerHTML = "Player X won"; 
		b2btn.disabled = true; 
		b3btn.disabled = true; 
		b4btn.disabled = true; 
		b6btn.disabled = true; 
		b7btn.disabled = true; 
		b8btn.disabled = true; 

		b1btn.style.color = "red"; 
		b5btn.style.color = "red"; 
		b9btn.style.color = "red"; 
	} 
	else if ((b3 == 'x' || b3 == 'X') && (b5 == 'x' || 
		b5 == 'X') && (b7 == 'x' || b7 == 'X')) { 
		document.getElementById('print') 
			.innerHTML = "Player X won"; 
		b1btn.disabled = true; 
		b2btn.disabled = true; 
		b4btn.disabled = true; 
		b6btn.disabled = true; 
		b8btn.disabled = true; 
		b9btn.disabled = true; 

		b3btn.style.color = "red"; 
		b5btn.style.color = "red"; 
		b7btn.style.color = "red"; 
	} 
	else if ((b2 == 'x' || b2 == 'X') && (b5 == 'x' || 
		b5 == 'X') && (b8 == 'x' || b8 == 'X')) { 
		document.getElementById('print') 
			.innerHTML = "Player X won"; 
		b1btn.disabled = true; 
		b2btn.disabled = true; 
		b4btn.disabled = true; 
		b6btn.disabled = true; 
		b7btn.disabled = true; 
		b9btn.disabled = true; 

		b2btn.style.color = "red"; 
		b5btn.style.color = "red"; 
		b8btn.style.color = "red"; 
	} 
	else if ((b4 == 'x' || b4 == 'X') && (b5 == 'x' || 
		b5 == 'X') && (b6 == 'x' || b6 == 'X')) { 
		document.getElementById('print') 
			.innerHTML = "Player X won"; 
		b1btn.disabled = true; 
		b2btn.disabled = true; 
		b3btn.disabled = true; 
		b7btn.disabled = true; 
		b8btn.disabled = true; 
		b9btn.disabled = true; 

		b4btn.style.color = "red"; 
		b5btn.style.color = "red"; 
		b6btn.style.color = "red"; 
	} 

	// Checking of Player X finish 
	// Checking for Player O starts, Is player O won or 
	// not and after that disabled all the other fields 
	else if ((b1 == 'O' || b1 == 'O') && (b2 == 'O' || 
		b2 == 'O') && (b3 == 'O' || b3 == 'O')) { 
		document.getElementById('print') 
			.innerHTML = "Player O won"; 
		b4btn.disabled = true; 
		b5btn.disabled = true; 
		b6btn.disabled = true; 
		b7btn.disabled = true; 
		b8btn.disabled = true; 
		b9btn.disabled = true; 

		b1btn.style.color = "red"; 
		b2btn.style.color = "red"; 
		b3btn.style.color = "red"; 
	} 
	else if ((b1 == 'O' || b1 == 'O') && (b4 == 'O' || 
		b4 == 'O') && (b7 == 'O' || b7 == 'O')) { 
		document.getElementById('print') 
			.innerHTML = "Player O won"; 
		b2btn.disabled = true; 
		b3btn.disabled = true; 
		b5btn.disabled = true; 
		b6btn.disabled = true; 
		b8btn.disabled = true; 
		b9btn.disabled = true; 

		b1btn.style.color = "red"; 
		b4btn.style.color = "red"; 
		b7btn.style.color = "red"; 
	} 
	else if ((b7 == 'O' || b7 == 'O') && (b8 == 'O' || 
		b8 == 'O') && (b9 == 'O' || b9 == 'O')) { 
		document.getElementById('print') 
			.innerHTML = "Player O won"; 
		b1btn.disabled = true; 
		b2btn.disabled = true; 
		b3btn.disabled = true; 
		b4btn.disabled = true; 
		b5btn.disabled = true; 
		b6btn.disabled = true; 

		b7btn.style.color = "red"; 
		b8btn.style.color = "red"; 
		b9btn.style.color = "red"; 
	} 
	else if ((b3 == 'O' || b3 == 'O') && (b6 == 'O' || 
		b6 == 'O') && (b9 == 'O' || b9 == 'O')) { 
		document.getElementById('print') 
			.innerHTML = "Player O won"; 
		b1btn.disabled = true; 
		b2btn.disabled = true; 
		b4btn.disabled = true; 
		b5btn.disabled = true; 
		b7btn.disabled = true; 
		b8btn.disabled = true; 
		b3btn.style.color = "red"; 
		b6btn.style.color = "red"; 
		b9btn.style.color = "red"; 
	} 
	else if ((b1 == 'O' || b1 == 'O') && (b5 == 'O' || 
		b5 == 'O') && (b9 == 'O' || b9 == 'O')) { 
		document.getElementById('print') 
			.innerHTML = "Player O won"; 
		b2btn.disabled = true; 
		b3btn.disabled = true; 
		b4btn.disabled = true; 
		b6btn.disabled = true; 
		b7btn.disabled = true; 
		b8btn.disabled = true; 

		b1btn.style.color = "red"; 
		b5btn.style.color = "red"; 
		b9btn.style.color = "red"; 
	} 
	else if ((b3 == 'O' || b3 == 'O') && (b5 == 'O' || 
		b5 == 'O') && (b7 == 'O' || b7 == 'O')) { 
		document.getElementById('print') 
			.innerHTML = "Player O won"; 
		b1btn.disabled = true; 
		b2btn.disabled = true; 
		b4btn.disabled = true; 
		b6btn.disabled = true; 
		b8btn.disabled = true; 
		b9btn.disabled = true; 

		b3btn.style.color = "red"; 
		b5btn.style.color = "red"; 
		b7btn.style.color = "red"; 
	} 
	else if ((b2 == 'O' || b2 == 'O') && (b5 == 'O' || 
		b5 == 'O') && (b8 == 'O' || b8 == 'O')) { 
		document.getElementById('print') 
			.innerHTML = "Player O won"; 
		b1btn.disabled = true; 
		b3btn.disabled = true; 
		b4btn.disabled = true; 
		b6btn.disabled = true; 
		b7btn.disabled = true; 
		b9btn.disabled = true; 

		b2btn.style.color = "red"; 
		b5btn.style.color = "red"; 
		b8btn.style.color = "red"; 
	} 
	else if ((b4 == 'O' || b4 == 'O') && (b5 == 'O' || 
		b5 == 'O') && (b6 == 'O' || b6 == 'O')) { 
		document.getElementById('print') 
			.innerHTML = "Player O won"; 
		b1btn.disabled = true; 
		b2btn.disabled = true; 
		b3btn.disabled = true; 
		b7btn.disabled = true; 
		b8btn.disabled = true; 
		b9btn.disabled = true; 

		b4btn.style.color = "red"; 
		b5btn.style.color = "red"; 
		b6btn.style.color = "red"; 
	} 

	// Checking of Player O finish 
	// Here, Checking about Tie 
	else if ((b1 == 'X' || b1 == 'O') && (b2 == 'X'
		|| b2 == 'O') && (b3 == 'X' || b3 == 'O') && 
		(b4 == 'X' || b4 == 'O') && (b5 == 'X' || 
			b5 == 'O') && (b6 == 'X' || b6 == 'O') && 
		(b7 == 'X' || b7 == 'O') && (b8 == 'X' || 
			b8 == 'O') && (b9 == 'X' || b9 == 'O')) { 
		document.getElementById('print') 
			.innerHTML = "Match Tie"; 
	} 
	else { 

		// Here, Printing Result 
		if (flag == 1) { 
			document.getElementById('print') 
				.innerHTML = "X's Turn"; 
		} 
		else { 
			document.getElementById('print') 
				.innerHTML = "O's Turn"; 
		} 
	} 
} 

// Function to reset game 
function myfunc_2() { 
	location.reload(); 
	b1 = b2 = b3 = b4 = b5 = b6 = b7 = b8 = b9 = ''; 
} 

// Here onwards, functions check turn of the player 
// and put accordingly value X or 0 
flag = 1; 
function myfunc_3() { 
	if (flag == 1) { 
		document.getElementById("b1").value = "X"; 
		document.getElementById("b1").disabled = true; 
		flag = 0; 
	} 
	else { 
		document.getElementById("b1").value = "O"; 
		document.getElementById("b1").disabled = true; 
		flag = 1; 
	} 
} 

function myfunc_4() { 
	if (flag == 1) { 
		document.getElementById("b2").value = "X"; 
		document.getElementById("b2").disabled = true; 
		flag = 0; 
	} 
	else { 
		document.getElementById("b2").value = "O"; 
		document.getElementById("b2").disabled = true; 
		flag = 1; 
	} 
} 

function myfunc_5() { 
	if (flag == 1) { 
		document.getElementById("b3").value = "X"; 
		document.getElementById("b3").disabled = true; 
		flag = 0; 
	} 
	else { 
		document.getElementById("b3").value = "O"; 
		document.getElementById("b3").disabled = true; 
		flag = 1; 
	} 
} 

function myfunc_6() { 
	if (flag == 1) { 
		document.getElementById("b4").value = "X"; 
		document.getElementById("b4").disabled = true; 
		flag = 0; 
	} 
	else { 
		document.getElementById("b4").value = "O"; 
		document.getElementById("b4").disabled = true; 
		flag = 1; 
	} 
} 

function myfunc_7() { 
	if (flag == 1) { 
		document.getElementById("b5").value = "X"; 
		document.getElementById("b5").disabled = true; 
		flag = 0; 
	} 
	else { 
		document.getElementById("b5").value = "O"; 
		document.getElementById("b5").disabled = true; 
		flag = 1; 
	} 
} 

function myfunc_8() { 
	if (flag == 1) { 
		document.getElementById("b6").value = "X"; 
		document.getElementById("b6").disabled = true; 
		flag = 0; 
	} 
	else { 
		document.getElementById("b6").value = "O"; 
		document.getElementById("b6").disabled = true; 
		flag = 1; 
	} 
} 

function myfunc_9() { 
	if (flag == 1) { 
		document.getElementById("b7").value = "X"; 
		document.getElementById("b7").disabled = true; 
		flag = 0; 
	} 
	else { 
		document.getElementById("b7").value = "O"; 
		document.getElementById("b7").disabled = true; 
		flag = 1; 
	} 
} 

function myfunc_10() { 
	if (flag == 1) { 
		document.getElementById("b8").value = "X"; 
		document.getElementById("b8").disabled = true; 
		flag = 0; 
	} 
	else { 
		document.getElementById("b8").value = "O"; 
		document.getElementById("b8").disabled = true; 
		flag = 1; 
	} 
} 

function myfunc_11() { 
	if (flag == 1) { 
		document.getElementById("b9").value = "X"; 
		document.getElementById("b9").disabled = true; 
		flag = 0; 
	} 
	else { 
		document.getElementById("b9").value = "O"; 
		document.getElementById("b9").disabled = true; 
		flag = 1; 
	} 
} 
