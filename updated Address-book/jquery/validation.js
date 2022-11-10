export function displayErrorMsg(tag, pattern){

    let status = true;

    if($(tag).val().replace(" ","").search(pattern) == -1){
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
