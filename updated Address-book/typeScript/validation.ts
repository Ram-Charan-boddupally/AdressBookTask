export function displayErrorMsg(tag:string, pattern:RegExp):boolean{
    let status = true;
    let data:any = $(tag).val();

    if(data.replace(" ","").search(pattern) == -1){
        if($(tag).next().length == 0)
            $(tag).parent().append($("<p class='error'></p>").text(tag.replace("#","")+" is Invalid"));
        
        status =  false;
    }else{
        if($(tag).next().length != 0)
            $(tag).next().remove();

        status = true;
    }
    return status;
}
