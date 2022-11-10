export function displayErrorMsg(tag, pattern) {
    let status = true;
    let element = document.querySelector(tag);
    if (element.value.replace(" ", "").search(pattern) == -1) {
        if (element.nextElementSibling === null) {
            let ele = document.createElement('p');
            ele.classList.add("error");
            ele.innerText = tag.replace("#", "") + " is Invalid";
            element.parentElement.appendChild(ele);
        }
        status = false;
    }
    else {
        if (element.nextElementSibling !== null)
            element.nextElementSibling.remove();
        status = true;
    }
    return status;
}
