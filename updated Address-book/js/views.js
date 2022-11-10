// views
class FormView{
    constructor(model,edit){
        this.contactForm = document.querySelector("#contactForm");
        this.contactInformation = []

        this.name = this.contactForm.querySelector("#name");
        this.email = this.contactForm.querySelector("#email");
        this.contactInformation.push(this.contactForm.querySelector("#mobileNumber"));
        this.contactInformation.push(this.contactForm.querySelector("#contactInformation"));
        this.website = this.contactForm.querySelector("#website");
        this.address = this.contactForm.querySelector("#address");
        this.details = {}

        this.model = model;
        this.edit = edit;
    }

    fillForm(employee){
        this.name.value = employee.name;
        this.email.value = employee.email;        
        this.contactInformation[0].value = employee.contactInformation[0];
        this.contactInformation[1].value = employee.contactInformation[1];
        this.website.value = employee.website;
        this.address.innerHTML = employee.address;
    }

    checkForm(){
        let status = true;
        if(this.name.value == ""){
            this.name.value = "fill the name block";
            status = false;
        }
        if(this.email.value == ""){
            this.email.value = "fill the email block";
            status = false;
        }
        if(this.contactInformation[0].value == ""){
            this.contactInformation[0].value = "fill the contactInformation[0] block";
            status = false;
        }
        if(this.contactInformation[1].value == ""){
            this.contactInformation[1].value = "fill the contactInformation[1] block";
            status = false;
        }
        if(this.website.value == ""){
            this.website.value = "fill the website block";
            status = false;
        }
        if(this.address.value == ""){
            this.address.value = "fill the address block";
            status = false;
        }
        
        return status;
    }

    bindSubmitForm(handler,empId){
        this.contactForm.querySelector("button[type='submit']").addEventListener('click',()=>{

            if(this.checkForm()){
                this.details.contactInformation = [];
                this.details.name = this.name.value;
                this.details.email = this.email.value;
                this.details.contactInformation.push(this.contactInformation[0].value);
                this.details.contactInformation.push(this.contactInformation[1].value);
                this.details.website = this.website.value;
                this.details.address = this.address.value.replace("\n", "<br>");
                
                if(this.edit) this.model.editEmployee(empId,this.details);
                else this.model.addEmployee(this.details);

                if(handler) handler.displayContacts(this.model.employeeList);

                this.bindResetForm();
                sessionStorage.setItem("employeeList",JSON.stringify(this.model.employeeList));
                alert("contact submited")
                location.href = '../html/home.html';
            }
            else alert("fill the form");
        });
    }

    bindResetForm(){
        this.contactForm.querySelector("button[type='reset']").addEventListener('click',()=>{
                                   
            let inputTags = this.contactForm.querySelectorAll("input");
                for(const tag of inputTags)   tag.value = "";

                this.contactForm.querySelector("textarea").value = "";
            });
    }
}

class InfoView{
    constructor(model){
        this.contactsList = document.querySelector(".contacts-list");
        this.model = model;

        this.displayContacts();
    }

    createContact(object){
        // creating list for empoloyee details
        let listElement = document.createElement("li");
        listElement.setAttribute('id','emp'+object.id);
        listElement.classList.add('candit-details');

        // creating p tags for employee information
        let nameElement = document.createElement("p");
        nameElement.classList.add("candit-name");
        nameElement.innerText = object['name'];

        let emailElement = document.createElement("p");
        emailElement.classList.add("candit-email");
        emailElement.innerText = object['email'];

        let contactElement = document.createElement("p");
        contactElement.classList.add("candit-contact");
        contactElement.innerText = object['contactInformation'][0];

        listElement.append(nameElement,emailElement,contactElement);

        return listElement;
    }

    displayContacts(){
        while(this.contactsList.firstChild){
            this.contactsList.removeChild(this.contactsList.firstChild);
        }

        if(this.model.getListLength() ==  0){
            let element = document.createElement("p");
            element.textContent = "No contacts Available";
            this.contactsList.append(element);
        }else{            
            this.model.employeeList.forEach((employee) => {
                let empInfo = this.createContact(employee);
                this.contactsList.append(empInfo);
                
                this.bindDisplayDetails();
            });
        }
    }

    bindDisplayDetails(){
        this.contactsList.querySelectorAll("li.candit-details").forEach((element)=>{
            element.addEventListener('click',(event)=>{
                let listElement = event.target.tagName == 'P' ? event.target.parentNode : event.target;
                location.href = '../html/info.html?'+'employee='+listElement.id;
            });
        })
    }
}

class DetailsView{
    constructor(data){
        this.empId = this.getEmpId();
        this.detailsBlock = document.querySelector(".details-block");
        this.detailsBlock.setAttribute("id",'emp'+this.empId);

        this.empName = this.detailsBlock.querySelector(".user-name");
        this.empEmail = this.detailsBlock.querySelector(".email-address span");
        this.empMobile = this.detailsBlock.querySelector(".mobile-number span");
        this.empLandline = this.detailsBlock.querySelector(".land-line span");
        this.empWebsite = this.detailsBlock.querySelector(".website span");
        this.empAddress = this.detailsBlock.querySelector(".address span");

        this.getInforamtion(data);
    }

    getInforamtion(employeeList){
        for(const emp of employeeList){
            if(emp.id == this.empId){
                this.empName.textContent = emp.name;
                this.empEmail.textContent = emp.email;
                this.empMobile.textContent = emp.contactInformation[0];
                this.empLandline.textContent = emp.contactInformation[1];
                this.empWebsite.textContent = emp.website;
                this.empAddress.innerHTML = emp.address;
            }
        }
    }

    getEmpId(){
        let params = new URLSearchParams(location.search);
        return params.get("employee").split('emp')[1];
    }

    bindEditInformation(){
        this.detailsBlock.querySelector(".edit-option").addEventListener("click",()=>{
            location.href = "../html/contactForm.html?edit=true&employee="+this.detailsBlock.getAttribute("id");
        })
    }

    bindDeleteInformation(employeeList){
        this.detailsBlock.querySelector(".delete-option").addEventListener("click",()=>{          
            employeeList = employeeList.filter(emp => emp.id != this.detailsBlock.getAttribute("id").split('emp')[1]);
            sessionStorage.setItem("employeeList", JSON.stringify(employeeList));
            location.href = '../html/home.html';
        })
    }
}


export {FormView,InfoView,DetailsView};