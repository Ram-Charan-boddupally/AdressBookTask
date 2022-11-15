import { Employee, EmployeeList } from "./models.js";
import {displayErrorMsg} from "./validation.js";
import {EmployeeInformation} from './employee'
// views
class FormView{
    model:EmployeeList;
    details:any;
    fieldValidationStatus: Boolean = false;

    constructor(model:EmployeeList){
        this.model = model;
        this.details = {};
        this.bindValidationListners();
    }

    public fillForm(employee:Employee):void{
        
        (document.querySelector(".contact-form") as HTMLElement).id = employee.id; 

        (document.querySelector("#name") as HTMLInputElement).value = employee.name;
        (document.querySelector("#email") as HTMLInputElement).value = employee.email;
        (document.querySelector("#mobileNumber") as HTMLInputElement).value = employee.contactInformation[0];
        (document.querySelector("#contactInformation") as HTMLInputElement).value = <string>employee.contactInformation[1];
        (document.querySelector("#website") as HTMLInputElement).value = employee.website;
        (document.querySelector("#address") as HTMLElement).textContent = employee.address;
    }
    
    public bindValidationListners():void{
        let gblStatus:boolean[] = [false,false,false,false];
        let obj:FormView = this;

        let inputElements = document.querySelectorAll('input');
        
        inputElements.forEach((element:HTMLElement)=>{
            element.addEventListener('input', function(event:Event){

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
       })
    }

    public checkEmptyField():boolean{
        let field: any;

        let inputElements = document.querySelectorAll('input');
        
        inputElements.forEach((element:HTMLInputElement)=>{
            if(element.id != 'contactInformation' && element.value == ""){
                if(!field) field = element;
                if(!element.nextSibling){
                    let ele = document.createElement('p');
                    ele.classList.add("error");
                    ele.textContent = element.id +" can't be empty";
                }

                element.focus();
            }else if(element.id != 'contactInformation' && element.value != ""){
                if(element.nextSibling)
                    element.nextSibling.remove();
            }
        })

        if(field){
            console.log(field.focus())
            return false;
        }

        return true;
    }

    public bindSubmitForm(handler:any,edit:boolean,empId?:string):void{
        let obj = this;
        document.querySelector("button[type='submit']")?.addEventListener('click',function(){
            obj.details.contactInformation = [];

            if(edit){
                let status:boolean[] = [true,true,true,true];
                status[0] = displayErrorMsg("#name", /^[a-zA-Z ]+$/);;
                status[1] = displayErrorMsg("#email",/^[a-zA-Z]+([a-zA-Z0-9]|[_\.-])+@[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+/); 
                status[2] = displayErrorMsg("#mobileNumber", /^(91)[6-9][0-9]{9}$/);
                status[3] = displayErrorMsg("#website", /^(https|http):\/\/[a-zA-Z]+([a-zA-Z0-9]|[.:_\/\-%])+/);
            
                obj.fieldValidationStatus = status.every(field => field == true);
            }

            let isFieldEmpty:boolean = obj.checkEmptyField();
            if( isFieldEmpty == true && obj.fieldValidationStatus){
                obj.details.name = (document.querySelector("#name") as HTMLInputElement).value;
                obj.details.email = (document.querySelector("#email") as HTMLInputElement).value;
                obj.details.contactInformation.push((document.querySelector("#mobileNumber") as HTMLInputElement).value);
                obj.details.contactInformation.push((document.querySelector("#contactInformation") as HTMLInputElement).value);
                obj.details.website = (document.querySelector("#website") as HTMLInputElement).value;
                obj.details.address = (document.querySelector("#address") as HTMLInputElement).value;
                obj.details.address.replace("\n", "<br>");

                if(edit && empId) obj.model.employeeList.editEmployee(empId,obj.details)
                else obj.model.employeeList.addEmployee(obj.details);
    
                handler.displayContacts(obj.model.employeeList);
    
                obj.bindResetForm();
                window.sessionStorage.setItem("employeeList",JSON.stringify(obj.model));
                window.alert("contact Succesfully submited");
                window.location.href = '../html/home.html';
            
            }else if(isFieldEmpty == true && obj.fieldValidationStatus == false){
                window.alert("invalid input")
                let field:any;
                if(!displayErrorMsg("#name", /^[a-zA-Z ]+$/)){
                    if(!field) field = (document.querySelector("#name") as HTMLInputElement).focus();
                }
                if(!displayErrorMsg("#email",/^[a-zA-Z]+([a-zA-Z0-9]|[_\.-])+@[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+/)){
                    if(!field) field = (document.querySelector("#email") as HTMLInputElement).focus();
                }; 
                if(!displayErrorMsg("#mobileNumber", /^(91)[6-9][0-9]{9}$/)){
                    if(!field) field = (document.querySelector("#mobileNumber") as HTMLInputElement).focus();
                };
                if(!displayErrorMsg("#website", /^(https|http):\/\/[a-zA-Z]+([a-zA-Z0-9]|[.:_\/\-%])+/)){
                    if(!field) field = (document.querySelector("#website") as HTMLInputElement).focus();
                };

                if(field){
                    field.focus()
                }
            }else if(!isFieldEmpty){
                alert("please fill the required fields");
            } 

        })
    }
    
    public bindResetForm():void{

        document.querySelector("button[type='reset']")?.addEventListener('click',function(){
                (document.querySelector('.input-block p.error') as HTMLElement).remove();
                (document.querySelector('.input-block input') as HTMLInputElement).value = "";
                (document.querySelector('.input-block textarea') as HTMLElement).textContent = "";
        });
    }

    public bindCancelEditForm():void{
        document.querySelector("button[type='reset']")?.addEventListener('click',function(){
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

    private createContact(contactObject:any):HTMLElement{
        let self = this;
        // creating p tags for employee information and list for empoloyee details
        let canditNode = document.createElement('li');
        canditNode.id = contactObject.id;
        canditNode.classList.add("candit-details");

        let canditName = document.createElement('p')
        canditName.className = 'candit-name';
        canditName.innerText = contactObject['name'];

        let canditEmail = document.createElement('p')
        canditEmail.className = 'candit-email';
        canditEmail.innerText = contactObject['email'];

        let canditContact = document.createElement('p')
        canditContact.className = 'candit-contact';
        canditContact.innerText = contactObject['contactInformation'][0];

        canditNode.append(canditName,canditEmail,canditContact);
        
        canditNode.addEventListener('click',function(this){
            let url = window.location.pathname.split("/html")[1];
            if(url.startsWith('/detailsPage.html')){
                document.querySelector('.candit-details.selected')?.classList.remove("selected")
                
                let url:any = window.location;
                url = new URL(url);
                url.searchParams.set('employee', this.id);
                window.history.pushState({},'',url)
                console.log(self.model.employeeList.getEmployee(this.id))
                self.detailsView?.fillData(self.model.employeeList.getEmployee(this.id));

                this.classList.add('selected');
            }else
                location.href = '../html/detailsPage.html?'+'employee='+this.id;
        })

        return canditNode;
    }

    public displayContacts():void{
        // removing the existing child elements of ul
        (document.querySelector(".contacts-list") as HTMLElement).innerHTML = "";

        // appending child elements to the list
        if(this.model.employeeList.getListLength() ==  0){
            (document.querySelector(".contacts-list") as HTMLElement).innerHTML = "<p>No contacts Available</p>";
        }else{
            this.model.employeeList.forEach((employee:any) => {
                let empInfo = this.createContact(employee);
                (document.querySelector(".contacts-list") as HTMLElement).appendChild(empInfo);
            });
        }
    }
}

class DetailsView{
    model:EmployeeList;

    constructor(employeeModel:EmployeeList, empId:string){
        this.model = employeeModel;

        (document.querySelector(".details-block") as HTMLElement).id = empId;
        let employee:Employee = this.model.employeeList.getEmployee(empId);

        this.fillData(employee);

        this.bindEditInformation();
        this.bindDeleteInformation(empId);
    }

    public fillData(employee:Employee){
        if(employee){
            (document.querySelector(".user-name") as HTMLElement).textContent = employee.name;
            (document.querySelector(".email-address span") as HTMLElement).textContent = employee.email;
            (document.querySelector(".mobile-number span") as HTMLElement).textContent = employee.contactInformation[0];
            (document.querySelector(".land-line span") as HTMLElement).textContent = employee.contactInformation[1] != "" ? <string>employee.contactInformation[1] : "NA";
            (document.querySelector(".website span") as HTMLElement).textContent = employee.website;
            (document.querySelector(".address span") as HTMLElement).innerHTML = employee.address != "" ? employee.address.replace("\n","<br>") : "NA";

        }else{
            (document.querySelector(".details-block") as HTMLElement).innerHTML = "<h1>NO CONTACT EXISTS</h1>";
        }
    }
        
    public bindEditInformation(){
        document.querySelector(".edit-option")?.addEventListener('click', function(){
            location.href = "../html/contactForm.html?edit=true&employee="+document.querySelector(".details-block")!.id;
        })
    }

    public bindDeleteInformation(empId:string){
        let obj:DetailsView = this;
        document.querySelector(".delete-option")?.addEventListener('click',function(){
            obj.model.employeeList.deleteEmployee(empId);
            sessionStorage.setItem("employeeList", JSON.stringify(obj.model));
            location.href = '../html/home.html';
        })
    }
}

export {FormView,ContactsListView,DetailsView};
