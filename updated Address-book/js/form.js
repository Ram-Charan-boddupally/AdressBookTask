import { EmployeeList } from "../js/models.js";
import { FormView } from './views.js';

document.addEventListener("load",init());

function init(){
    let employeeList = JSON.parse(sessionStorage.getItem("employeeList"));
    let model = new EmployeeList(employeeList);
    
    let paras = new URLSearchParams(location.search);
    let edit = paras.get('edit') == 'true';
    let form = new FormView(model,edit);

    if(edit){
        let empId = paras.get('employee').split('emp')[1];
        var employee = employeeList.filter((emp)=>emp.id == empId)[0];
        form.fillForm(employee);
    }
    console.log(employee);
    form.bindSubmitForm(false,employee.id);
    form.bindResetForm();
}