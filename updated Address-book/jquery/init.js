import {EmployeeList} from '../jquery/models.js';
import {FormView,ContactsListView,DetailsView} from '../jquery/views.js';


// employee list
let employeeData =  [{name:'Praveen Battula', email: 'praveen@technovert.com', contactInformation: ['91 923 345 2342','040 30 1231211'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'Chandermani Arora', email: 'chandermani@technovert.com', contactInformation: ['91 9292929292','040 30 1231211'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'Shashi Pagadala', email: 'vijay@technovert.com', contactInformation: ['91 9292929292','040 30 1231211'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'Vijay Yalamanchili', email: 'vijay@technovert.com', contactInformation: ['91 9292929292'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'Bhargavi', email: 'bhargavi@technovert.com', contactInformation: ['91 9292929292','040 30 1231211'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'Ram', email: 'ram@technovert.com', contactInformation: ['91 9292929292','040 30 1231211'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'charan', email: 'charan@technovert.com', contactInformation: ['91 9292929292','040 30 1231211'], website: 'http://www.technovert.com', address: '123 now here \n some street,\n madhapur Hyderabad 500033'},
        {name:'Vijay', email: 'vijay@technovert.com', contactInformation: ['91 9292929292'], website: 'http://www.technovert.com', address: ''},
        {name:'deepak', email: 'deepak@technovert.com', contactInformation: ['91 9292929292','040 30 1231211'], website: 'http://www.technovert.com', address: ''}
    ]

$(document).ready(function(){
    let url = location.pathname.split("/html")[1];
    let model;

    // inittialising the model data 
    if(sessionStorage.length > 1){
        model = EmployeeList.fromJSON(JSON.parse(sessionStorage.getItem("employeeList")));
    }else{
        model = new EmployeeList(employeeData);
        sessionStorage.setItem("employeeList",JSON.stringify(model));
    }

    // URL Navigation using the switch case
    let contactsList, detailsBlock, contactForm;
    switch(true){

        case (url.startsWith('/home.html')):
            contactsList = new ContactsListView(model);
            break;

        case (url.startsWith('/detailsPage.html')):
            let empId = new URLSearchParams(location.search).get("employee");
            
            detailsBlock = new DetailsView(model,empId);
            contactsList = new ContactsListView(model,detailsBlock);

            $(".contacts-list li#"+empId).addClass("selected");
            break;

        case (url.startsWith("/contactForm.html")):
                let edit = new URLSearchParams(location.search).get("edit");
        
                contactsList = new ContactsListView(model);
                contactForm = new FormView(model);
                
                if(edit == 'false'){
                    contactForm.bindSubmitForm(contactsList,false);
                    contactForm.bindResetForm();
                }else{
                    let empId = new URLSearchParams(location.search).get("employee");

                    contactForm.fillForm(model.getEmployee(empId));
                    $("button[type='submit']").text("Update");
                    contactForm.bindSubmitForm(contactsList,true,empId);
                    
                    $("button[type='reset']").text("Cancel");
                    contactForm.bindCancelEditForm();                    
                }
                break;
    }

});