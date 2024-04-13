import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './service/employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Color } from './types';
import { basicTailwindColors } from './constants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // Datas
  public employees: Employee[] = [];
  dataSubject: Employee[] = [];
  getEmployee!: Employee;

  showModal: boolean = false;
  // selectedId: number = 0;
  optionDesc: string = '';
  companies: string[] = [];
  dropdownId: string = 'company';

  selectedCompanies: string[] = [];
  selectedType: string = 'All';

  jobTypes = [
    {
      name: "All",
      color: "gray"
    },
    {
      name: "Full Time",
      color: "green"
    },
    {
      name: "Part Time",
      color: "blue"
    },
    {
      name: "Contract",
      color: "orange"
    },
    {
      name: "Freelance",
      color: "purple"
    },
    {
      name: "Internship",
      color: "red"
    },
    {
      name: "Apprenticeship",
      color: "purple"
    }
  ];

  // Front configs
  sidebarCollapsed: boolean = false;
  enableConfig: boolean = true;
  isDarkMode: boolean = false;
  isAbsolute: boolean = false;
  tabType: string = 'line';
  colors: Color[] = basicTailwindColors;
  currentColor: string = '';

  /**
   * This constructor injects an instance of EmployeeService.
   * The private modifier ensures that this instance is only accessible within the class.
   * This is a recommended practice to encapsulate the behavior of the class and prevent
   * direct access to the service.
   * @param employeeService - An instance of EmployeeService.
   */
  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getEmployees();
  }

  // CRUD Operations
  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        this.dataSubject = response;
        this.companies = Array.from(new Set(this.employees.map(employee => employee.companyName)));
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public saveEmployee(addForm: NgForm): void {
    // Returns the JSON representation of the form values
    // console.log(addForm.value);
    // document.getElementById("emp-submit")?.click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    this.closeModal();
  }

  public editEmployee(form?: NgForm): void {    
    this.employeeService.updateEmployee(form?.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    this.closeModal(form);
  }

  public deleteEmployee(): void {
    this.employeeService.deleteEmployee(this.getEmployee.id).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    this.closeModal();
  }

  public filterEmployees(event: Event): void {
    // console.log((event.target as HTMLInputElement).value);
    const filterValue = (event.target as HTMLInputElement).value;
    this.employees = this.dataSubject.filter(employee => employee.name.toLowerCase().includes(filterValue.toLowerCase()));
    

    if(!filterValue) {
      this.getEmployees();
    }
  }

  public filterEmployeesByCompany(event: Event): void {
    if(this.selectedCompanies.find(company => company === (event.target as HTMLInputElement).value)) {
      this.selectedCompanies = this.selectedCompanies.filter(company => company !== (event.target as HTMLInputElement).value);
    } else {
      this.selectedCompanies.push((event.target as HTMLInputElement).value);
      const uniqueCompanies = new Set(this.selectedCompanies.map(company => company).filter(company => company !== ''));
      this.selectedCompanies = Array.from(uniqueCompanies);
    }

    if(this.selectedCompanies.length) {
      // get all the employees that match the selected companies
      this.employees = this.dataSubject.filter(employee => this.selectedCompanies.some(company => company === employee.companyName));
    } else {
      this.getEmployees();
    }
  }

  filterByType(type: string) {
    this.selectedType = type;

    if(this.selectedType !== 'All') {
      this.employees = this.dataSubject.filter(employee => employee.workType === this.selectedType);
      
    } else {
      this.employees = this.dataSubject;
    }
  }

  public getJobs(): string[] {
    const uniqueJobs = new Set(this.employees.map(employee => employee.jobTitle));
    return Array.from(uniqueJobs);
  }




  getInitials(name: string) {
    return name
      ?.split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  // toggleSelected(id: number, employee: Employee) {
  //   this.updateEmployee = employee;
  //   this.selectedId = id;
  // }

  // closeSelected() {
  //   this.selectedId = 0;
  // }

  // toggleModal can accept args optionnally
  toggleModal(option?: string, employee?: Employee) {
    this.getEmployee = employee!;
    if(option) {
      this.optionDesc = option;
    }

    this.showModal = true;
  }

  closeModal(form?: NgForm) {
    form?.reset();
    this.showModal = false;
    this.optionDesc = '';
    // this.closeSelected();
  }

  toggleDropdown(id: string) {
    if (this.dropdownId === id) {
      this.dropdownId = '';
    } else {
      this.dropdownId = id;
    }
  }

  // Front end only
  collapseSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  showConfig(): void {
    this.enableConfig = !this.enableConfig;
  }

  switchTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }

  switchPosition(): void {
    this.isAbsolute = !this.isAbsolute;
  }

  changeTabType(type: string) {
    if(type === 'line') {
      this.tabType = 'line';
    } else {
      this.tabType = 'shadow';
    }
  }

  changeColor(color?: string): void {
    this.currentColor = color ? color : '';    
  }
}
