'use strict';

let operationQueue = [];
let memoryQueue = [];
let operatorsList = ['+', '-', '*', '/', '%', 'mod'];
let otherFunctionList = ['sin', 'cos', 'tan', 'exp', 'sqrt', 'log'];
const pi = 3.14159265359;
let answer = 0;

//Push values in array and return string to calculate
let pushInQueue = (newValue, isOperator) => {
	if (!stringIsNullOrEmpty(newValue)) {
		//for math functions
		if (isOperator && otherFunctionList.includes(newValue) && operationQueue.length > 0) {
			//update value based on operator type
            newValue = calculateTrigonometricFunction(newValue);
            operationQueue.push(newValue);
		}
		//for pi
		else if (newValue == 'pi') {
			newValue = pi;
			operationQueue.push(newValue);
		}
		//for square
		else if (operationQueue.length > 0 && newValue == 'square') {
			operationQueue.push('*');
			operationQueue.push(operationQueue[0]);
		}
		//for all other operator
		else {
			operationQueue.push(newValue);
		}
	}

   return getFromOperatorQueue();
}

//Pust data for history
let pushInMemory = (value) => {
    if(!stringIsNullOrEmpty(value)){
        memoryQueue.push(value);
    }
}

//Get from queue and generate a string
let getFromOperatorQueue = () => {
    let concatedString = operationQueue.join('').trim();
    displayAnswer(concatedString);
    return concatedString;
}

//Push number in array
let numericBtn = (numbericValue) => {
    if(answer === 0 && operationQueue.length == 0){
        //Empty the memory and fresh start as a new number 
        pushInQueue(numbericValue, false);
        memoryQueue = [];
    }
    else if(answer !== 0){
        //Eliminate previous answer, empty memory and fresh start 
        //operationQueue = [];
        //memoryQueue = [];
        pushInMemory(answer);
        
        answer = 0;
        pushInQueue(numbericValue, false);
    }
    else{
        //No previos history
        pushInQueue(numbericValue, false);
    }
    displayHistory();
}

//Push operator in array
let operatorBtn = (operatorType) => {
    if(operationQueue.length == 0 && answer !== 0){
        //push last answer as a new value
        pushInQueue(answer, false);
    }
    
    //Eliminate duplicate operators by comparing with previos one
    if (operationQueue.length > 0 && operatorsList.includes(operationQueue[operationQueue.length - 1]) || otherFunctionList.includes(operationQueue[operationQueue.length - 1])) {
        operationQueue.pop();
    }
    //if otherFunctionList is pressed then take default 0
    else if(otherFunctionList.includes(operatorType)){
        operationQueue.length == 0 ? pushInQueue("0", false) : pushInQueue("", false);
    }
    if (operationQueue.length > 0){
		pushInQueue(operatorType, true);
    }
    //answer = 0;
}

//Push brackets in array
let bracketBtn = (value) => {
	//Eliminate duplicate operators by comparing with previos one
	if (operationQueue.length > 0 && operationQueue[operationQueue.length - 1] == value)
		operationQueue.pop();
	else
		pushInQueue(value, false);
}

//Change sign
let changeSign = () => {
    let {actualValue, maxPosition} = seperateDigitTocalculate();
 
    // splice(position, numberOfItemsToRemove, item)
    if(maxPosition == -1){
        operationQueue.splice(0, 0, "-");
    } 
    else{
        operationQueue.splice(maxPosition+1, 0, "-");
        pushInQueue(actualValue, false);
    }
    
    let lastValue = getFromOperatorQueue();
    
	if (lastValue.substring(0, 1) == "-") {
		lastValue = lastValue.substring(1, lastValue.length);
		
	} else{
		lastValue = "-" + lastValue;
    }
}

//Calculate equation and show output
let calculate = () => {
	let expression = getFromOperatorQueue();
    if(!stringIsNullOrEmpty(expression.trim())){
        try{
            answer = eval(expression);   
            operationQueue = [];

            memoryQueue = [];
            pushInMemory(expression);
            pushInMemory('=');
            displayAnswer(answer);
        }     
        catch(error){
            console.log("Error: "+ error);
            displayAnswer('Result is undefined');
        }
    }
    else{
        displayAnswer('0');
        memoryQueue = [];
    }
    displayHistory();
}

//To calculate triginometric function
let calculateTrigonometricFunction = (triginoFunction) => {
    let {actualValue, maxPosition} = seperateDigitTocalculate();
    //Create a string for math oprtaions and manage dispay and history
    let trigonoSyntax = triginoFunction + '(' + actualValue + ')';
    let expression = 'Math.' + trigonoSyntax;
    //if function pressed independently, Calculate value and display it
    if(maxPosition == -1){
        answer = eval(expression);
        memoryQueue = [];
        pushInMemory(trigonoSyntax);
        displayHistory();
        operationQueue = [];
        return answer;
    }
    else{
        //if merged with other operator, return expression
        return expression;
    }
}
//
let seperateDigitTocalculate = () => {
    let oprString = operationQueue.join('').trim();
    //Operator index queue to find last operator
    let tempQueue = [];
    let maxPosition = -1;
    let actualValue = '';
    
    //Find operator position in string
    operationQueue.forEach((opr,index) =>{
        if(operatorsList.includes(opr) || otherFunctionList.includes(opr)){
            tempQueue.push(operationQueue.indexOf(opr, index-1));
        }
    });
    
    //find max operator position 
    if(tempQueue.length > 0)  maxPosition = Math.max(...tempQueue);
    
    //take last numbers only after last operator
    if(maxPosition != -1){
        //Pop last operaors from array
        let arrLength = operationQueue.length;
        for(let i = maxPosition + 1; i < arrLength; i++){
            actualValue += operationQueue[i];
        }
        for(let i = maxPosition + 1; i < arrLength; i++){
            operationQueue.pop();
        }
    }

    //To put last numbers in string
    actualValue = (maxPosition != -1 && actualValue.trim() != '') ? actualValue.trim() : oprString;
    return {actualValue, maxPosition};   
}

//Clear expressions
let clearExpression = (clearType) => {
	if (clearType == "ac") {
        operationQueue = [];
        memoryQueue = [];
        answer = 0;
		displayAnswer('0');
        displayHistory();
	} else {
		displayAnswer(operationQueue.join('').trim());
		operationQueue.pop();
	}
}

//To diplay result
let displayAnswer = (displayAnswer) => {
    //answer = displayAnswer;
    document.getElementById("answer").value = displayAnswer.toString().replace(/Math./g, '');
}

//To diplay history
let displayHistory = () => {
    let memory = memoryQueue.join('').trim();
    document.getElementById("history").value = memory.toString().replace(/Math./g, '');
}

//To check string is null or empty
let stringIsNullOrEmpty = (theString) => {
	return theString == null || theString == "undefined" || theString == '';// || theString.trim().length < 1; || typeof theString != "string"
}