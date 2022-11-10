export function displayErrorMsg(tag:string, pattern:RegExp):boolean{
    let status = true;
    let element:HTMLInputElement = (document.querySelector(tag) as HTMLInputElement);

    if(element.value.replace(" ","").search(pattern) == -1){
        if(element.nextElementSibling === null){
            let ele: HTMLElement = document.createElement('p');
            ele.classList.add("error");
            ele.innerText = tag.replace("#","")+" is Invalid";
            (element.parentElement as HTMLElement).appendChild(ele); 
        }
        
        status =  false;
    }else{
        if(element.nextElementSibling !== null)
            element.nextElementSibling.remove();

        status = true;
    }
    return status;
}
