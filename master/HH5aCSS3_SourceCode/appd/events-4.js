function click_handler(event) {
    var el = event.target;
    switch (el.nodeName) {
        case "DIV":
            window.alert('Div');
            break;
        case "H1":
            window.alert('Heading');
            break;
        case "P":
            window.alert('Paragraph');
            break;
    }
}
function go() {
    document.addEventListener('click', click_handler);
}
window.addEventListener('load', go);