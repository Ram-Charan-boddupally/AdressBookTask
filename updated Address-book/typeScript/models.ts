import {EmployeeInformation} from './employee'
class Employee implements EmployeeInformation{
    id:any;
    name:string;
    email:string;
    contactInformation: [string,string?];
    website: string;
    address: string;

    constructor(object:any){
        this.id = object.id;
        this.name = object.name != null ? object.name : "";
        this.email = object.email != null ? object.email : "";
        this.contactInformation = object.contactInformation != null ? object.contactInformation : [];
        this.website = object.website != null ? object.website : "";
        this.address = object.address != null ? object.address : "";
        this.contactInformation[1] = object.contactInformation[1] != null ? object.contactInformation[1] : "";
    }

    editInformation(object:any):Employee{
        this.name = object.name != null ? object.name : this.name;
        this.email = object.email != null ? object.email : this.email;
        this.contactInformation[0] = object.contactInformation[0] != null ? object.contactInformation[0] : this.contactInformation[0];
        this.contactInformation[1] = object.contactInformation[1] != null ? object.contactInformation[1] : this.contactInformation[0];

        this.website = object.webiste != null ? object.webiste : this.website;
        this.address = object.address != null ? object.address : this.address;

        return object
    }
}

class EmployeeList{
    employeeList: any;

    constructor(employeeDetailsList:EmployeeInformation[]){
        this.employeeList = []
        // if employee list is not null append details
        if(employeeDetailsList){
            for(const emp of employeeDetailsList){
                if(!emp.id) emp.id = this.getEmpId(emp.id);
                let empObj = new Employee(emp);
                this.employeeList.push(empObj);
            }
        }
    }

    private getEmpId(empId:string|undefined):string{
        empId = 'emp';
        if(this.getListLength() > 0) empId += parseInt(this.employeeList[this.getListLength()-1].id.split("emp")[1])+1;
        else empId += 0;

        return empId;
    }

    private addEmployee(employeeDetails:any):Employee{
        employeeDetails.id = this.getEmpId(employeeDetails.id);

        let emp = new Employee(employeeDetails);
        this.employeeList.push(emp)
        return emp;
    }

    private editEmployee(id:string, employeeDetails:any):Employee|null{
        console.log(this.employeeList)
        for(const emp of this.employeeList){
            if(emp.id == id){
                emp.editInformation(employeeDetails);
                return employeeDetails;
            }
        }
        return null;
    }
    
    private deleteEmployee(empId: string):boolean{
        let status = false;
        let actualLength = this.employeeList.getListLength()

        this.employeeList = this.employeeList.filter((employee:any) => employee.id != empId);
        if(actualLength > this.employeeList.getListLength){
            status = true;
        }

        return status;
    }

    private getListLength():number{
        return this.employeeList.length;
    }
    
    private getEmployee(empId:string):Employee{
        return this.employeeList.filter((employee:Employee) => employee.id == empId)[0]
    }

    private toJSON():any{
        return this.employeeList;
    }
    
    public static fromJSON(json:any){
        let obj = new EmployeeList(json);
        return obj;
    }
}

export {Employee,EmployeeList};