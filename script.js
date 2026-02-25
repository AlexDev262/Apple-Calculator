const buttons = document.querySelectorAll("button");
const display = document.querySelector(".display");
const mainString = document.querySelector(".main");
const secondaryString = document.querySelector(".secondary");
const operators = ["/", "*", "-", "+"];
let buttonInnerText, secondaryStringText="";
let a="0", b="0", state = 1, mainStringText="0", operator="", string = 1, sum = 0;
const operatorsMap = {
    "+":"+",
    "-":"-",
    "*":"x",
    "/":"÷",
    "":""
}
mainString.innerHTML = `<p>${mainStringText}</p>`;

//Button input
buttons.forEach((key) => {
    key.addEventListener("click",  () => buttonClicked(key.dataset.math));
});

//Key input
document.addEventListener ("keydown", (pressed) => {
    buttonClicked(pressed.key);
})

//add commas on the display
const addCommas = (mainStringText) => {
    let noMinus = 0;
    if (mainStringText[0] === "-") {
        mainStringText = mainStringText.slice(1);
        noMinus = 1;
    }
    let tempString = mainStringText.split(".");

    for (let i = tempString[0].length-3; i > 0; i-=3) {
        tempString[0] = `${tempString[0].slice(0, i)},${tempString[0].slice(i)}`;
    }
    if (tempString.length === 1) {
        mainStringText = tempString[0];
    } else {
        mainStringText = `${tempString[0]}.${tempString[1]}`;
    }
    
    if (noMinus) {
        mainStringText = "-" + mainStringText;
    }

    return mainStringText;
}

//Delete a character when display is clicked
display.addEventListener ("click", () => {
    if ((mainStringText !== "0" && state !== 2 && state !== 4)) {
        deleteACharacter();
    }
})



//Action when input detected
const buttonClicked = (button) => {
    if (symbolcheck(button)) {             
        //check for an operator input       
        if (operators.includes(button)){


            //if the numbers have just been evaluated
            if (sum === 1) {
                b = "0";
                operator = "";
                state = 2;
                sum = 0;
                secondaryString.innerHTML = `<p>${secondaryStringText}</p>`;
            }

            //check if deviding by 0    
            if (b == "0" && operator == "/" && state !== 2 && state !== 3) {
                mainString.innerHTML = "<p>Deviding by 0? Have you not taken 3rd grade math?</p>";
                a = "0";
                b = "0";
                operator = "";
                mainStringText = "0";
                secondaryStringText = "";
                

            //Operator when a has been set 
            } else if (state === 1) {
                operator = button;
                state = 2;
                secondaryStringText = a + " " + operatorsMap[operator];
                

            //Operator after a has been set
            } else if (state === 2) {
                if (operator === "") {
                    secondaryStringText = mainStringText + " " + operatorsMap[button]; 
                } else {
                    secondaryStringText = secondaryStringText.slice(0, -1);
                    secondaryStringText += operatorsMap[button];
                }
                operator = button;

            //Operator when a and b have been set
            } else if (state === 3) {
                if ((button === "*" || button == "/") && (operator === "+" || operator === "-")) {
                    state = 4;   
                    if (operator === "-") {
                        b = "-" + b;
                    }
                } else {
                    operate (a, b , operator);
                    state = 2;     
                    a = mainStringText; 
                    
                }     
                operator = button; 
                if (b[0] === "-") {
                    secondaryStringText += " " + b.slice(1) + " " + operatorsMap[operator];
                } else {
                    secondaryStringText += " " + b + " " + operatorsMap[operator];
                }
                mainString.innerHTML = `<p>${addCommas(Number(mainStringText).toPrecision(11).replace(/(\.\d*?[1-9])0+($|e)/, "$1$2").replace(/\.0+($|e)/, "$1"))}</p>`;  
            }

            //PEMDAS -> When operator * or / clicked after the previous operator was +/-
            else if (state === 4) {
                operator = button;
                secondaryStringText = secondaryStringText.slice(0, -1);
                secondaryStringText += operatorsMap[operator];

            //PEMDAS -> When operator clicked after both b and mainStringText are inuputed
            } else if (state === 5) {
                secondaryStringText += " " + mainStringText + " ";
                operate (b, mainStringText, operator);
                b = mainStringText;
                operator = button;
                secondaryStringText += operatorsMap[operator];
                
                if (button === "+" || button === "-") {
                    operate (a, b, "+");
                    a = mainStringText;
                    state = 2;
                } else {
                    state = 4;
                }
                mainString.innerHTML = `<p>${addCommas(Number(mainStringText).toPrecision(11).replace(/(\.\d*?[1-9])0+($|e)/, "$1$2").replace(/\.0+($|e)/, "$1"))}</p>`;    
            }    
            secondaryString.innerHTML = `<p>${secondaryStringText}</p>`;                 
            

            
            
        
            

        } else {
            //if the numbers have just been evaluated
            if (sum === 1) {
                a="0";
                b="0";
                operator="";
                state = 1;
                sum = 0;
                mainStringText = "0";
                mainString.innerHTML = `<p>${mainStringText}</p>`;
                secondaryStringText = "";
                secondaryString.innerHTML = `<p>${secondaryStringText}</p>`;
            }

            //NUMBER INPUT 
            
            if (mainStringText.length < 12 || state === 2 || state === 4) {
                if (state === 1) {
                    if (a === "0") {
                    mainStringText = button;
                    a = button;
                    
                    } else {
                        a += button; 
                        mainStringText += button;
                    } 
                }
                else if (state === 2) {
                    b = button; 
                    mainStringText = b;  
                    
                    state = 3; 
                }
                else if (state === 3){  
                    if (b === "0") {
                        mainStringText = button;
                        b = button;
                        
                    } else {
                        b += button; 
                        mainStringText += button;
                    }
                    
                } else if (state === 4){ 
                    mainStringText = button;
                    state = 5;
                    
                } else if (state === 5) {
                    if (mainStringText === "0") {
                        mainStringText = button;
                        
                    } else {
                        mainStringText += button;
                    }
                    
                }
            }
            
            mainString.innerHTML = `<p>${addCommas(mainStringText)}</p>`; 
              
            
            
        }
    }
}




const symbolcheck = (button) => {   
    
    if (button === "Backspace") {
        if (mainStringText !== "0" && state !== 2 && state !== 4) {
        deleteACharacter();
        }
    } else if (button === "AC" || button === "Delete" ) {
        mainStringText = "0";
        secondaryStringText = "";
        mainString.innerHTML = `<p>${mainStringText}</p>`;
        secondaryString.innerHTML = mainStringText;
        state = 1;
        a = "0";
        b = "0";
        operator = "";
        
    } else if (button === "+/-") {
        plusMinus();
    } else if (button === "%") {
        percent (a);
        mainString.innerHTML = `<p>${addCommas(mainStringText)}</p>`;
        a = mainStringText;

    //dot button pressed
    } else if (button === ".") {
        if (mainStringText.split(".").length - 1 < 1) {
            if (state === 1) {
                mainStringText += ".";
                a = mainStringText;
                mainString.innerHTML = `<p>${mainString.innerText}.</p>`;
            } else if (state === 3) {
                mainStringText += ".";
                b = mainStringText;
                mainString.innerHTML = `<p>${mainString.innerText}.</p>`;
            } else if (state === 5) {
                mainStringText += ".";
                mainString.innerHTML = `<p>${mainString.innerText}.</p>`;
            }
        }
            
    
    //input "="
    } else if (button === "=" || button === "Enter") {
        //dividing by 0
        if (mainStringText == "0" && operator == "/") {
            mainString.innerHTML = "<p>Deviding by 0? Have you not taken 3rd grade math?</p>";
            a = "0";
            operator = "";
            mainStringText = "0";
            secondaryStringText = "";
        
        //operating
        } else {

            if (b === "0") {
                b = a;
            }

            if (operator === "") {
                secondaryStringText = a + " " + "=";
            } else if (sum === 1){
                secondaryStringText = a + " " + operatorsMap[operator] + " " + b + " " + "=";
            } else {
                secondaryStringText += " " + mainStringText + " " + "=";
            }

            if (state < 4) {
                operate (a, b , operator);
            } else {
                operate (b, mainStringText, operator);
                let b2 = mainStringText;
                operate (a, mainStringText, "+");
                
                b = b2;
                if (String(b[0]) === "-") {
                    operator = "-";
                    b = b.slice(1);
                } else {
                    operator = "+";
                    
                }
                 
            }    
            if (sum === 1 && operator !== "") {
                secondaryStringText = a + " " + operatorsMap[operator] + " " + b + " " + "=";  
            }
            a = mainStringText;
            sum = 1;
            state = 2;

            mainString.innerHTML = `<p>${addCommas(Number(mainStringText).toPrecision(11).replace(/(\.\d*?[1-9])0+($|e)/, "$1$2").replace(/\.0+($|e)/, "$1"))}</p>`;
        }
        secondaryString.innerHTML = `<p>${secondaryStringText}</p>`;
        
        
         
    }  else if (/[\d\/*+-]/.test(button)) {
        return 1;
    }
     
}

//Toggle between Positive and Negative numbers
const plusMinus = () => {
    if (state === 1) {

        if (mainStringText[0] === "-") {
            a = a.slice(1);
        }
        else if (Math.sign(a) === 1) {
            a = "-" + a;
        }
        mainStringText = a;
    } else if (state === 3) {

        if (Math.sign(b) === -1) {
            b = b.slice(1);
        }
        else if (Math.sign(b) === 1) {
            b = "-" + b;
        }
        mainStringText = b;
    } else if (state === 5) {
        if (mainStringText[0] === "-" ) {
            mainStringText = mainStringText.slice(1);
        } else {
            mainStringText = "-" + mainStringText;
        }
    }
        mainString.innerHTML = `<p>${addCommas(mainStringText)}</p>`;
}

const operate = (a, b, operator) => {
    switch (operator) {
            case "+": 
            add (Number(a),Number(b));
            break;

            case "-": 
            subtract (Number(a),Number(b));
            break;

            case "*": 
            multiply (Number(a),Number(b));
            break;

            case "/": 
            divide (Number(a),Number(b));
            break;

            case "%": 
            percent (Number(a));
            break;
        }
};


const add = (num1, num2) => mainStringText = String((num1 + num2));
const subtract = (num1, num2) => mainStringText = String((num1 - num2));
const multiply = (num1, num2) => mainStringText = String((num1 * num2));
const divide = (num1, num2) => mainStringText = String((num1 / num2));
const percent = (num1) => mainStringText = String((num1 / 100));

const deleteACharacter = () => {
    mainStringText = mainStringText.slice(0, -1);
    if (mainStringText[mainStringText.length-1] === ".") {
        mainStringText = mainStringText.slice(0, -1);
    }
    if (mainStringText === "") {
        if (state === 1 || state === 2) {
            a = "0";
            
        }
        else if (state === 3) {
            b = "0";
            
        } 
        mainStringText = "0";

    } else if (state === 1) {
        a = a.slice(0, -1);
    } else if (state < 4) {
        b = b.slice(0, -1);
    }
    mainString.innerHTML = `<p>${addCommas(mainStringText)}</p>`;
  

    
   
}
