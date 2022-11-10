import { Employee, EmployeeList } from "./models.js";
import {displayErrorMsg} from "./validation.js";

// views
class FormView{
    model:any;
    details:any;
    fieldValidationStatus: Boolean = false;

    constructor(model:any){
        this.model = model;
        this.details = {};
        this.bindValidationListners();
    }

    fillForm(employee:any){
        $("contact-form").attr("id",employee.id);
        $("#name").val(employee.name);
        $("#email").val(employee.email);
        $("#mobileNumber").val(employee.contactInformation[0]);
        $("#contactInformation").val(employee.contactInformation[1]);
        $("#website").val(employee.website);
        $("#address").html(employee.address);
    }
    
    bindValidationListners(){
        let gblStatus:boolean[] = [false,false,false,false];
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
        let field: any;
        $('input').each(function(){
            if(this.id != 'contactInformation' && (this as HTMLInputElement).value == ""){
                if(!field) field = this;
                if($(this).next().length == 0)
                    $(this).parent().append($("<p class='error'></p>").text((this as HTMLInputElement).id+" can't be empty"))
                $(this).trigger('focus')
            }else if(this.id != 'contactInformation' && (this as HTMLInputElement).value != ""){
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

    bindSubmitForm(handler:any,edit:boolean,empId?:string){
        let obj = this;
        $("button[type='submit']").on('click',function(){
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
            if( isFieldEmpty == true && obj.fieldValidationStatus){
                obj.details.name = $("#name").val();
                obj.details.email = $("#email").val();
                obj.details.contactInformation.push($("#mobileNumber").val());
                obj.details.contactInformation.push($("#contactInformation").val());
                obj.details.website = $("#website").val();
                obj.details.address = $("#address").val()!;
                obj.details.address.replace("\n", "<br>");

                if(edit) obj.model.editEmployee(empId,obj.details);
                else obj.model.addEmployee(obj.details);
    
                handler.displayContacts(obj.model.employeeList);
    
                obj.bindResetForm();
                window.sessionStorage.setItem("employeeList",JSON.stringify(obj.model));
                window.alert("contact Succesfully submited");
                window.location.href = '../html/home.html';
            }else if(isFieldEmpty == true && obj.fieldValidationStatus == false){
                window.alert("invalid input")
                let field:any;
                if(!displayErrorMsg("#name", /^[a-zA-Z ]+$/)){
                    if(!field) field = $("#name").trigger('focus');
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
    
    bindResetForm():void{
        $("button[type='reset']").click(function(){
            $('.input-block p.error').remove();
            $('.input-block input').val("");
            $('.input-block textarea').text("");
        });
    }

    bindCancelEditForm():void{
        $("button[type='reset']").click(function(){
            location.href="../html/home.html";
        })
    }
}

class ContactsListView{
    model:EmployeeList;
    detailsView?:DetailsView;

    constructor(model:EmployeeList,detailsView?:DetailsView){
        this.model = model;
        this.displayContacts();
        if(detailsView) this.detailsView = detailsView;
    }

    createContact(object:any):JQuery<HTMLElement>{
        let self = this;
        // creating p tags for employee information and list for empoloyee details
        let listElement = $("<li></li>").attr({ "id":object.id, "class": "candit-details"})
                                        .append(
                                            $("<p class='candit-name'></p>").text(object['name']),
                                            $("<p class='candit-email'></p>").text(object['email']),
                                            $("<p class='candit-contact'></p>").text(object['contactInformation'][0]))
                                        .on('click',function(){
                                            let url = location.pathname.split("/html")[1];
                                            if(url.startsWith('/detailsPage.html')){
                                                $('.candit-details.selected').removeClass("selected")
                                                
                                                let url:any = window.location;
                                                url = new URL(url);
                                                url.searchParams.set('employee', $(this).attr("id"));
                                                window.history.pushState({},'',url)
                                                console.log(self.model.getEmployee($(this).attr("id") as string))
                                                self.detailsView?.fillData(self.model.getEmployee( $(this).attr("id") as string));

                                                $("#"+$(this).attr("id")).addClass('selected');
                                            }else
                                                location.href = '../html/detailsPage.html?'+'employee='+$(this).attr("id");
                                        });

        return listElement;
    }

    displayContacts():void{
        // removing the existing child elements of ul
        $(".contacts-list").empty();

        // appending child elements to the list
        if(this.model.getListLength() ==  0){
            $(".contacts-list").html("<p>No contacts Available</p>");
        }else{
            this.model.employeeList.forEach((employee:any) => {
                let empInfo = this.createContact(employee);
                $(".contacts-list").append(empInfo);
            });
        }
    }
}

class DetailsView{
    model:EmployeeList;

    constructor(employeeModel:EmployeeList, empId:string){
        this.model = employeeModel;

        $(".details-block").attr("id",empId);
        let employee:Employee = this.model.getEmployee(empId);

        this.fillData(employee);

        this.bindEditInformation();
        this.bindDeleteInformation(empId);
    }

    fillData(employee:Employee):void{
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
        
    bindEditInformation():void{
        $(".edit-option").on('click', function(){
            location.href = "../html/contactForm.html?edit=true&employee="+$(".details-block").attr("id");
        })
    }

    bindDeleteInformation(empId:string):void{
        let obj:DetailsView = this;
        $(".delete-option").on('click', function(){
            obj.model.deleteEmployee(empId);
            sessionStorage.setItem("employeeList", JSON.stringify(obj.model));
            location.href = '../html/home.html';
        })
    }
}

export {FormView,ContactsListView,DetailsView};
