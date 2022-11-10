import {displayErrorMsg} from '../jquery/validation.js';

// views
class FormView{
    constructor(model){
        this.model = model;
        this.details = {};
        this.bindValidationListners();
    }

    fillForm(employee){
        $("contact-form").attr("id",employee.id);
        $("#name").val(employee.name);
        $("#email").val(employee.email);
        $("#mobileNumber").val(employee.contactInformation[0]);
        $("#contactInformation").val(employee.contactInformation[1]);
        $("#website").val(employee.website);
        $("#address").html(employee.address);
    }
    
    bindValidationListners(){
        let gblStatus = [false,false,false,false];
        let obj = this;
        $('input').on('input',function(event){

            switch(this.id){
                case 'name':
                    gblStatus[0] = displayErrorMsg("#name", /^[a-zA-Z ]+$/);
                    break;
                case 'email':
                    gblStatus[1] = displayErrorMsg("#email",/^[a-zA-Z]+([a-zA-Z0-9]|[_\.-])+@[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+/); 
                    break;
                case 'mobileNumber':
                    gblStatus[2] = displayErrorMsg("#mobileNumber", /^(91)[6-9][0-9]{9}$/);
                    break;
                case 'website':
                    gblStatus[3] = displayErrorMsg("#website", /^(https|http):\/\/[a-zA-Z]+([a-zA-Z0-9]|[.:_\/\-%])+/);
                    break;
                case 'contactInformation':
                    gblStatus[0] = displayErrorMsg("#name", /^[a-zA-Z ]+$/);;
                    gblStatus[1] = displayErrorMsg("#email",/^[a-zA-Z]+([a-zA-Z0-9]|[_\.-])+@[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+/); 
                    gblStatus[2] = displayErrorMsg("#mobileNumber", /^(91)[6-9][0-9]{9}$/);
                    gblStatus[3] = displayErrorMsg("#website", /^(https|http):\/\/[a-zA-Z]+([a-zA-Z0-9]|[.:_\/\-%])+/);
                    break
            }
            obj.fieldValidationStatus = gblStatus.every(bool => bool === true);
            // console.log(obj.fieldValidationStatus,gblStatus)
        });
    }

    checkEmptyField(){
        let field;
        $('input').each(function(){
            if(this.id != 'contactInformation' && this.value == ""){
                if(!field) field = this;
                if($(this).next().length == 0)
                    $(this).parent().append($("<p class='error'></p>").text(this.id+" can't be empty"))
                $(this).focus()
            }else if(this.id != 'contactInformation' && this.value != ""){
                if($(this).next().length > 0)
                    $(this).next().remove();
            }
        });

        if(field){
            console.log(field.focus())
            return false;
        }

        return true;
    }

    bindSubmitForm(handler,edit,empId){
        let obj = this;
        $("button[type='submit']").click(function(){
            obj.details.contactInformation = [];

            if(edit){
                let status = [true,true,true,true];
                status[0] = displayErrorMsg("#name", /^[a-zA-Z ]+$/);;
                status[1] = displayErrorMsg("#email",/^[a-zA-Z]+([a-zA-Z0-9]|[_\.-])+@[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+/); 
                status[2] = displayErrorMsg("#mobileNumber", /^(91)[6-9][0-9]{9}$/);
                status[3] = displayErrorMsg("#website", /^(https|http):\/\/[a-zA-Z]+([a-zA-Z0-9]|[.:_\/\-%])+/);
            
                obj.fieldValidationStatus = status.every(field => field == true);
            }
            let isFieldEmpty = obj.checkEmptyField();
            if( isFieldEmpty == true & obj.fieldValidationStatus){
                obj.details.name = $("#name").val();
                obj.details.email = $("#email").val();
                obj.details.contactInformation.push($("#mobileNumber").val());
                obj.details.contactInformation.push($("#contactInformation").val());
                obj.details.website = $("#website").val();
                obj.details.address = $("#address").val().replace("\n", "<br>");

                if(edit) obj.model.editEmployee(empId,obj.details);
                else obj.model.addEmployee(obj.details);
    
                handler.displayContacts(obj.model.employeeList);
    
                obj.bindResetForm();
                sessionStorage.setItem("employeeList",JSON.stringify(obj.model));
                alert("contact Succesfully submited");
                location.href = '../html/home.html';
            }else if(isFieldEmpty == true && obj.fieldValidationStatus == false){
                alert("invalid input")
                let field;
                if(!displayErrorMsg("#name", /^[a-zA-Z ]+$/)){
                    if(!field) field = $("#name").focus();
                }
                if(!displayErrorMsg("#email",/^[a-zA-Z]+([a-zA-Z0-9]|[_\.-])+@[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+/)){
                    if(!field) field = $("#email").focus();
                }; 
                if(!displayErrorMsg("#mobileNumber", /^(91)[6-9][0-9]{9}$/)){
                    if(!field) field = $("#mobileNumber").focus();
                };
                if(!displayErrorMsg("#website", /^(https|http):\/\/[a-zA-Z]+([a-zA-Z0-9]|[.:_\/\-%])+/)){
                    if(!field) field = $("#website").focus();
                };

                if(field){
                    field.focus()
                }
            }else if(!isFieldEmpty){
                alert("please fill the required fields");
            } 
        })
    }
    
    bindResetForm(){
        $("button[type='reset']").click(function(){
            $('.input-block p.error').remove();
            $('.input-block input').val("");
            $('.input-block textarea').text("");
        });
    }

    bindCancelEditForm(){
        $("button[type='reset']").click(function(){
            location.href="../html/home.html";
        })
    }
}

class ContactsListView{
    constructor(model,detailsView){
        this.model = model;
        this.displayContacts();
        this.detailsView = detailsView != null ? detailsView : null;
    }

    createContact(object){
        let self = this;
        // creating p tags for employee information and list for empoloyee details
        let listElement = $("<li></li>").attr({ "id":object.id, "class": "candit-details"})
                                        .append(
                                            $("<p class='candit-name'></p>").text(object['name']),
                                            $("<p class='candit-email'></p>").text(object['email']),
                                            $("<p class='candit-contact'></p>").text(object['contactInformation'][0]))
                                        .click(function(){
                                            let url = location.pathname.split("/html")[1];
                                            if(url.startsWith('/detailsPage.html')){
                                                $('.candit-details.selected').removeClass("selected")
                                                
                                                let url = new URL(window.location);
                                                url.searchParams.set('employee', $(this).attr("id"));
                                                window.history.pushState({},'',url)
                                                console.log(self.model.getEmployee( $(this).attr("id")))
                                                self.detailsView.fillData(self.model.getEmployee( $(this).attr("id")));

                                                $("#"+$(this).attr("id")).addClass('selected');
                                            }else
                                                location.href = '../html/detailsPage.html?'+'employee='+$(this).attr("id");
                                        });

        return listElement;
    }

    displayContacts(){
        // removing the existing child elements of ul
        $(".contacts-list").empty();

        // appending child elements to the list
        if(this.model.getListLength() ==  0){
            $(".contacts-list").html("<p>No contacts Available</p>");
        }else{
            this.model.employeeList.forEach((employee) => {
                let empInfo = this.createContact(employee);
                $(".contacts-list").append(empInfo);
            });
        }
    }
}

class DetailsView{
    constructor(employeeModel,empId){
        this.model = employeeModel;

        $(".details-block").attr("id",empId);
        let employee = this.model.getEmployee(empId);

        this.fillData(employee);

        this.bindEditInformation();
        this.bindDeleteInformation(empId);
    }

    fillData(employee){
        if(employee){

            $(".user-name").text(employee.name);
            $(".email-address span").text(employee.email);
            $(".mobile-number span").text(employee.contactInformation[0]);
            $(".land-line span").text(employee.contactInformation[1] != "" ? employee.contactInformation[1] : "NA");
            $(".website span").text(employee.website);
            $(".address span").html(employee.address != "" ? employee.address.replace("\n","<br>") : "NA");
        }else{
            $(".details-block").html("<h1>NO CONTACT EXISTS</h1>");
        }
    }
        
    bindEditInformation(){
        $(".edit-option").click(function(){
            location.href = "../html/contactForm.html?edit=true&employee="+$(".details-block").attr("id");
        })
    }

    bindDeleteInformation(empId){
        let obj = this;
        $(".delete-option").click(function(){
            obj.model.deleteEmployee(empId);
            sessionStorage.setItem("employeeList", JSON.stringify(obj.model));
            location.href = '../html/home.html';
        })
    }
}

export {FormView,ContactsListView,DetailsView};
