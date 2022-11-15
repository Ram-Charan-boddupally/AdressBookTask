import {Employee, EmployeeList} from './models.js'
import {FormView,ContactsListView,DetailsView} from './views.js';
import {EmployeeInformation} from './employee'
// employee list
let employeeData:EmployeeInformation[] =  [{name:'Praveen Battula', email: 'praveen@technovert.com', contactInformation: ['91 923 345 2342','040 30 1231211'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'Chandermani Arora', email: 'chandermani@technovert.com', contactInformation: ['91 9292929292','040 30 1231211'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'Shashi Pagadala', email: 'vijay@technovert.com', contactInformation: ['91 9292929292','040 30 1231211'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'Vijay Yalamanchili', email: 'vijay@technovert.com', contactInformation: ['91 9292929292'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'Bhargavi', email: 'bhargavi@technovert.com', contactInformation: ['91 9292929292','040 30 1231211'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'Ram', email: 'ram@technovert.com', contactInformation: ['91 9292929292','040 30 1231211'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'charan', email: 'charan@technovert.com', contactInformation: ['91 9292929292','040 30 1231211'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'Vijay', email: 'vijay@technovert.com', contactInformation: ['91 9292929292'], website: 'http://www.technovert.com', address: ''},
        {name:'deepak', email: 'deepak@technovert.com', contactInformation: ['91 9292929292','040 30 1231211'], website: 'http://www.technovert.com', address: ''}
    ]


document.addEventListener('DOMContentLoaded',function(){
    let url:string = location.pathname.split("/html")[1];
    let model:EmployeeList;

    // inittialising the model data 
    if(sessionStorage.length > 1){
        model = EmployeeList.fromJSON(JSON.parse(sessionStorage.getItem("employeeList")!));
    }else{
        model = new EmployeeList(employeeData);
        sessionStorage.setItem("employeeList",JSON.stringify(model));
    }

    // URL Navigation using the switch case
    let contactsList:ContactsListView, detailsBlock:DetailsView, contactForm:FormView;
    switch(true){

        case (url.startsWith('/home.html')):
            contactsList = new ContactsListView(model);
            break;

        case (url.startsWith('/detailsPage.html')):
            let empId = new URLSearchParams(location.search).get("employee") as string;
            
            detailsBlock = new DetailsView(model,empId);
            contactsList = new ContactsListView(model,detailsBlock);

            (document.querySelector(".contacts-list li#"+empId) as HTMLElement).classList.add("selected");
            break;

        case (url.startsWith("/contactForm.html")):
                let edit = new URLSearchParams(location.search).get("edit");
        
                contactsList = new ContactsListView(model);
                contactForm = new FormView(model);
                
                if(edit == 'false'){
                    contactForm.bindSubmitForm(contactsList,false);
                    contactForm.bindResetForm();
                }else{
                    let empId:string = new URLSearchParams(location.search).get("employee") as string;
                    contactForm.fillForm(model.employeeList.getEmployee(empId));
                    (document.querySelector("button[type='submit']") as HTMLElement).textContent = "Update";
                    contactForm.bindSubmitForm(contactsList,true,empId);

                    (document.querySelector("button[type='reset']") as HTMLElement).textContent = "Cancel";
                    contactForm.bindCancelEditForm();                    
                }
                break;
    }

});