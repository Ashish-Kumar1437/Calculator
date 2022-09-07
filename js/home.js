const header_name = document.getElementById('name');
const expand = document.getElementById('expand-btn');
const res = document.getElementById('Result');
const hidden_row = document.getElementById('hidden-row');
const btn = document.querySelectorAll('input[type="button"]');
const hidden_col = document.getElementById('hidden-col');
const equal_btn = document.querySelector('input[value="="]');
const present_theme = document.getElementById('theme');
const theme_icon = document.getElementById('theme-icon');
const dark_mode = '/css/dark.css';
const light_mode = '/css/light.css';
let paranthesis = 0;

function DisplayHidden() {

    if (expand.getAttribute('value') === "< >") {
        hidden_row.style.height = 'auto';
        hidden_row.style.overflow = 'visible';
        hidden_col.style.width = 'min-content';
        hidden_col.style.overflow = 'visible';

        for (let i = 0; i < btn.length; i++) {
            btn[i].style.fontSize = '1rem';
            btn[i].style.width = '67px';
        }

        equal_btn.style.height = '120px';
        expand.style.width = '67px';
        expand.style.color = 'red';
        expand.setAttribute('value', '> <');
    } else {
        hidden_row.style.height = '0';
        hidden_row.style.overflow = 'hidden';
        hidden_col.style.width = '0';
        hidden_col.style.overflow = 'hidden';

        for (let i = 0; i < btn.length; i++) {
            btn[i].style.fontSize = '1.5rem';
            btn[i].style.width = '85px';
        }

        equal_btn.style.height = '60px';
        expand.style.width = '85px';
        expand.style.color = 'var(--color_black)';
        expand.setAttribute('value', '< >');
    }
}


function changeTheme() {

    const theme = document.getElementById('theme-icon');

    if (header_name.getAttribute('value') === 'Dark') {
        setTimeout(() => {
            header_name.innerHTML = 'Calculator';
        }, 800);
        header_name.innerHTML = 'Light Mode';
        present_theme.setAttribute('href', light_mode);
        theme_icon.setAttribute('src', '/img/MoonIcon.svg');
        header_name.setAttribute('value', 'light');
    } else {
        setTimeout(() => {
            header_name.innerHTML = 'Calculator';
        }, 800);
        header_name.innerHTML = 'Dark Mode';
        present_theme.setAttribute('href', dark_mode);
        theme_icon.setAttribute('src', '/img/SunIcon.svg');
        header_name.setAttribute('value', 'Dark');
    }
}
//flag 0 -> 1-9 number, . , 00 
// flag 1-> / * - + 

function display(val, flag) {
    if ((res.value.length === 1 && res.value === '0' && flag === 0) || (res.value.length === 2 && res.value === '00' && flag === 0)) {
        res.value = val;
        return;
    } else if (res.value.length === 0 && flag === 1 && val !== '-') return;
    else if (isoperator(res.value[res.value.length - 1]) && isoperator(val)) {
        backspace();
    } else if (isoperator(res.value[res.value.length - 2]) && res.value[res.value.length - 1] == '0') {
        backspace();
    }
    // else if (val === '(' && res.value.length >= 1 && !isoperator(res.value[res.value.length - 1])) {
    //     res.value = res.value + '*';
    //     paranthesis++;
    // } else if (paranthesis && res.value[res.value.length - 1] === ')' && !isoperator(val)) {
    //     res.value = res.value + '*';
    // } 
    else if (val === ')') {
        if (!paranthesis) {
            val = '';
            paranthesis++;
        }
        paranthesis--;
    } else if (val === '(') {
        paranthesis++;
    }
    res.value = res.value + val;
}

function backspace() {
    if (res.value[res.value.length - 1] == '(') {
        paranthesis--;
    } else if (res.value[res.value.length - 1] == ')') paranthesis++;
    res.value = res.value.substring(0, res.value.length - 1);
}

function allClear() {
    res.value = "";
    paranthesis = 0;
}


function cal() {
    if (res.value.length > 0)
        res.value = findResult();
}

function findResult() {
    const stack = [];
    const postOrder = [];

    const expression = modify();
    let lastindex = 0;

    for (let i = 0; i < expression.length; i++) {
        const x = expression[i];
        if (isoperator(x)) {
            const str = expression.substring(lastindex, i);
            if (str != '')
                postOrder.push(str);
            lastindex = i + 1;
            if (stack.length > 0)
                while (precesion(stack[stack.length - 1]) >= precesion(x))
                    postOrder.push(stack.pop());
            stack.push(x);
        } else if (expression[i] === '(') {
            stack.push('(');
            lastindex = i + 1;
        } else if (expression[i] === ')') {
            const str = expression.substring(lastindex, i);
            if (str != '')
                postOrder.push(str);
            lastindex = i + 1;
            while (stack[stack.length - 1] != '(') {
                postOrder.push(stack.pop());
            }
            stack.pop();
        }
    }

    const str = expression.substring(lastindex, expression.length);
    if (str != '')
        postOrder.push(str);

    while (stack.length > 0) {
        postOrder.push(stack.pop())
    }
    for (let i = 0; i < postOrder.length; i++) {
        console.log(postOrder[i]);
    }
    while (postOrder.length != 0) {
        const val = postOrder[0];
        postOrder.shift();
        if (isoperator(val)) {
            const b = parseFloat(stack.pop());
            const a = parseFloat(stack.pop());
            switch (val) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    stack.push(a / b);
                    break;
                case '^':
                    stack.push(Math.pow(a, b));
                    break;
            }
        } else {
            stack.push(val);
        }
    }
    if (stack)
        return stack.pop();
    else {
        return 'ERROR'
    }

}

function modify() {
    str = deFormat(res.value);
    let expression = str[0];
    for (let i = 1; i < str.length; i++) {
        if (str[i] === '(' && !isoperator(expression[expression.length - 1])) {
            expression = expression + '*' + str[i];
        } else if (str[i] === ')' && i + 1 < str.length && !isoperator(str[i + 1])) {
            expression = expression + str[i] + '*';
        } else {
            expression = expression + str[i];
        }
    }
    return expression;
}

function precesion(x) {
    if (x === '*' || x === '/') return 2;
    else if (x === '+' || x === '-') return 1;
    else if (x === '^') return 3;
    else return -1;
}

function angle(str) {
    if (str === 'sin')
        res.value = Math.sin(findResult() * Math.PI / 180).toFixed(2);
    else if (str === 'cos')
        res.value = Math.cos(findResult() * Math.PI / 180).toFixed(2);
    else
        res.value = Math.tan(findResult() * Math.PI / 180).toFixed(2);
}

function squRoot() {
    res.value = Math.sqrt(findResult());
}

function factorial() {
    const n = findResult();
    let ans = 1;
    for (let i = 1; i <= n; i++) {
        ans *= i;
    }
    res.value = ans;
}

function onedivided() {
    res.value = 1 / findResult();
}

function isoperator(val) {
    if (val === '*' || val === '×' || val === '÷' || val === '/' || val === '+' || val === '-' || val === '^') {
        return true;
    }
    return false;
}

function format(val) {
    val = val.replace(/\*/g, '×');
    val = val.replace(/\//g, '÷');
    return val;
}

function deFormat(val) {
    val = val.replace(/\×/g, '*');
    val = val.replace(/\÷/g, '/');
    return val;
}

document.addEventListener('keypress', keypressed);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') backspace();
});

function keypressed(v) {
    v.preventDefault();
    // display(v.key,0);
    switch (v.key) {
        case '1':
            display('1', 0);
            break;
        case '2':
            display('2', 0);
            break;
        case '3':
            display('3', 0);
            break;
        case '4':
            display('4', 0);
            break;
        case '5':
            display('5', 0);
            break;
        case '6':
            display('6', 0);
            break;
        case '7':
            display('7', 0);
            break;
        case '8':
            display('8', 0);
            break;
        case '9':
            display('9', 0);
            break;
        case '0':
            display('0', 0);
            break;
        case '(':
            display('(', 2);
            break;
        case ')':
            display(')', 2);
            break;
        case '+':
            display('+', 1);
            break;
        case '-':
            display('-', 1);
            break;
        case '*':
            display('×', 1);
            break;
        case '/':
            display('÷', 1);
            break;
        case '^':
            display('^', 1);
            break;
        case 'Enter':
            cal();
            break;
    }
}