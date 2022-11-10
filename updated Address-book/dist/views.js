import { displayErrorMsg } from "./validation.js";
// views
class FormView {
    constructor(model) {
        this.fieldValidationStatus = false;
        this.model = model;
        this.details = {};
        this.bindValidationListners();
    }
    fillForm(employee) {
        document.querySelector(".contact-form").id = employee.id;
        document.querySelector("#name").value = employee.name;
        document.querySelector("#email").value = employee.email;
        document.querySelector("#mobileNumber").value = employee.contactInformation[0];
        document.querySelector("#contactInformation").value = employee.contactInformation[1];
        document.querySelector("#website").value = employee.website;
        document.querySelector("#address").textContent = employee.address;
    }
    bindValidationListners() {
        let gblStatus = [false, false, false, false];
        let obj = this;
        let inputElements = document.querySelectorAll('input');
        inputElements.forEach((element) => {
            element.addEventListener('input', function (event) {
                switch (this.id) {
                    case 'name':
                        gblStatus[0] = displayErrorMsg("#name", /^[a-zA-Z ]+$/);
                        break;
                    case 'email':
                        gblStatus[1] = displayErrorMsg("#email", /^[a-zA-Z]+([a-zA-Z0-9]|[_\.-])+@[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+/);
                        break;
                    case 'mobileNumber':
                        gblStatus[2] = displayErrorMsg("#mobileNumber", /^(91)[6-9][0-9]{9}$/);
                        break;
                    case 'website':
                        gblStatus[3] = displayErrorMsg("#website", /^(https|http):\/\/[a-zA-Z]+([a-zA-Z0-9]|[.:_\/\-%])+/);
                        break;
                    case 'contactInformation':
                        gblStatus[0] = displayErrorMsg("#name", /^[a-zA-Z ]+$/);
                        ;
                        gblStatus[1] = displayErrorMsg("#email", /^[a-zA-Z]+([a-zA-Z0-9]|[_\.-])+@[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+/);
                        gblStatus[2] = displayErrorMsg("#mobileNumber", /^(91)[6-9][0-9]{9}$/);
                        gblStatus[3] = displayErrorMsg("#website", /^(https|http):\/\/[a-zA-Z]+([a-zA-Z0-9]|[.:_\/\-%])+/);
                        break;
                }
                obj.fieldValidationStatus = gblStatus.every(bool => bool === true);
                // console.log(obj.fieldValidationStatus,gblStatus)
            });
        });
    }
    checkEmptyField() {
        let field;
        let inputElements = document.querySelectorAll('input');
        inputElements.forEach((element) => {
            if (element.id != 'contactInformation' && element.value == "") {
                if (!field)
                    field = element;
                if (!element.nextSibling) {
                    let ele = document.createElement('p');
                    ele.classList.add("error");
                    ele.textContent = element.id + " can't be empty";
                }
                element.focus();
            }
            else if (element.id != 'contactInformation' && element.value != "") {
                if (element.nextSibling)
                    element.nextSibling.remove();
            }
        });
        if (field) {
            console.log(field.focus());
            return false;
        }
        return true;
    }
    bindSubmitForm(handler, edit, empId) {
        var _a;
        let obj = this;
        (_a = document.querySelector("button[type='submit']")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            obj.details.contactInformation = [];
            if (edit) {
                let status = [true, true, true, true];
                status[0] = displayErrorMsg("#name", /^[a-zA-Z ]+$/);
                ;
                status[1] = displayErrorMsg("#email", /^[a-zA-Z]+([a-zA-Z0-9]|[_\.-])+@[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+/);
                status[2] = displayErrorMsg("#mobileNumber", /^(91)[6-9][0-9]{9}$/);
                status[3] = displayErrorMsg("#website", /^(https|http):\/\/[a-zA-Z]+([a-zA-Z0-9]|[.:_\/\-%])+/);
                obj.fieldValidationStatus = status.every(field => field == true);
            }
            let isFieldEmpty = obj.checkEmptyField();
            if (isFieldEmpty == true && obj.fieldValidationStatus) {
                obj.details.name = document.querySelector("#name").value;
                obj.details.email = document.querySelector("#email").value;
                obj.details.contactInformation.push(document.querySelector("#mobileNumber").value);
                obj.details.contactInformation.push(document.querySelector("#contactInformation").value);
                obj.details.website = document.querySelector("#website").value;
                obj.details.address = document.querySelector("#address").value;
                obj.details.address.replace("\n", "<br>");
                if (edit && empId)
                    obj.model.editEmployee(empId, obj.details);
                else
                    obj.model.addEmployee(obj.details);
                handler.displayContacts(obj.model.employeeList);
                obj.bindResetForm();
                window.sessionStorage.setItem("employeeList", JSON.stringify(obj.model));
                window.alert("contact Succesfully submited");
                window.location.href = '../html/home.html';
            }
            else if (isFieldEmpty == true && obj.fieldValidationStatus == false) {
                window.alert("invalid input");
                let field;
                if (!displayErrorMsg("#name", /^[a-zA-Z ]+$/)) {
                    if (!field)
                        field = document.querySelector("#name").focus();
                }
                if (!displayErrorMsg("#email", /^[a-zA-Z]+([a-zA-Z0-9]|[_\.-])+@[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+/)) {
                    if (!field)
                        field = document.querySelector("#email").focus();
                }
                ;
                if (!displayErrorMsg("#mobileNumber", /^(91)[6-9][0-9]{9}$/)) {
                    if (!field)
                        field = document.querySelector("#mobileNumber").focus();
                }
                ;
                if (!displayErrorMsg("#website", /^(https|http):\/\/[a-zA-Z]+([a-zA-Z0-9]|[.:_\/\-%])+/)) {
                    if (!field)
                        field = document.querySelector("#website").focus();
                }
                ;
                if (field) {
                    field.focus();
                }
            }
            else if (!isFieldEmpty) {
                alert("please fill the required fields");
            }
        });
    }
    bindResetForm() {
        var _a;
        (_a = document.querySelector("button[type='reset']")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            document.querySelector('.input-block p.error').remove();
            document.querySelector('.input-block input').value = "";
            document.querySelector('.input-block textarea').textContent = "";
        });
    }
    bindCancelEditForm() {
        var _a;
        (_a = document.querySelector("button[type='reset']")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            location.href = "../html/home.html";
        });
    }
}
class ContactsListView {
    constructor(model, detailsView) {
        this.model = model;
        this.displayContacts();
        if (detailsView)
            this.detailsView = detailsView;
    }
    createContact(contactObject) {
        let self = this;
        // creating p tags for employee information and list for empoloyee details
        let canditNode = document.createElement('li');
        canditNode.id = contactObject.id;
        canditNode.classList.add("candit-details");
        let canditName = document.createElement('p');
        canditName.className = 'candit-name';
        canditName.innerText = contactObject['name'];
        let canditEmail = document.createElement('p');
        canditEmail.className = 'candit-email';
        canditEmail.innerText = contactObject['email'];
        let canditContact = document.createElement('p');
        canditContact.className = 'candit-contact';
        canditContact.innerText = contactObject['contactInformation'][0];
        canditNode.append(canditName, canditEmail, canditContact);
        canditNode.addEventListener('click', function () {
            var _a, _b;
            let url = window.location.pathname.split("/html")[1];
            if (url.startsWith('/detailsPage.html')) {
                (_a = document.querySelector('.candit-details.selected')) === null || _a === void 0 ? void 0 : _a.classList.remove("selected");
                let url = window.location;
                url = new URL(url);
                url.searchParams.set('employee', this.id);
                window.history.pushState({}, '', url);
                console.log(self.model.getEmployee(this.id));
                (_b = self.detailsView) === null || _b === void 0 ? void 0 : _b.fillData(self.model.getEmployee(this.id));
                this.classList.add('selected');
            }
            else
                location.href = '../html/detailsPage.html?' + 'employee=' + this.id;
        });
        return canditNode;
    }
    displayContacts() {
        // removing the existing child elements of ul
        document.querySelector(".contacts-list").innerHTML = "";
        // appending child elements to the list
        if (this.model.getListLength() == 0) {
            document.querySelector(".contacts-list").innerHTML = "<p>No contacts Available</p>";
        }
        else {
            this.model.employeeList.forEach((employee) => {
                let empInfo = this.createContact(employee);
                document.querySelector(".contacts-list").appendChild(empInfo);
            });
        }
    }
}
class DetailsView {
    constructor(employeeModel, empId) {
        this.model = employeeModel;
        document.querySelector(".details-block").id = empId;
        let employee = this.model.getEmployee(empId);
        this.fillData(employee);
        this.bindEditInformation();
        this.bindDeleteInformation(empId);
    }
    fillData(employee) {
        if (employee) {
            document.querySelector(".user-name").textContent = employee.name;
            document.querySelector(".email-address span").textContent = employee.email;
            document.querySelector(".mobile-number span").textContent = employee.contactInformation[0];
            document.querySelector(".land-line span").textContent = employee.contactInformation[1] != "" ? employee.contactInformation[1] : "NA";
            document.querySelector(".website span").textContent = employee.website;
            document.querySelector(".address span").innerHTML = employee.address != "" ? employee.address.replace("\n", "<br>") : "NA";
        }
        else {
            document.querySelector(".details-block").innerHTML = "<h1>NO CONTACT EXISTS</h1>";
        }
    }
    bindEditInformation() {
        var _a;
        (_a = document.querySelector(".edit-option")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            location.href = "../html/contactForm.html?edit=true&employee=" + document.querySelector(".details-block").id;
        });
    }
    bindDeleteInformation(empId) {
        var _a;
        let obj = this;
        (_a = document.querySelector(".delete-option")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            obj.model.deleteEmployee(empId);
            sessionStorage.setItem("employeeList", JSON.stringify(obj.model));
            location.href = '../html/home.html';
        });
    }
}
export { FormView, ContactsListView, DetailsView };
