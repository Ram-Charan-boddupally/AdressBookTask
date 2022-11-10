import { EmployeeList } from "../js/models.js";
import {DetailsView,InfoView} from '../js/views.js';


document.addEventListener('load',init());

function init(){
    let params = new URLSearchParams(location.search);
    params = params.get("employee").split('emp')[1];
    
    let employeeList = JSON.parse(sessionStorage.getItem("employeeList"));

    let model = new EmployeeList(employeeList);
    let employeesView = new InfoView(model);
    let detailsBlock = new DetailsView(model.employeeList);
    detailsBlock.bindEditInformation();
    detailsBlock.bindDeleteInformation(employeeList);
}

