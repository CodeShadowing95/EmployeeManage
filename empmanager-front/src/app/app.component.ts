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
  // *************** Datas ***************
  public employees: Employee[] = [];
  private dataSubject: Employee[] = [];
  dataLength: number = 0;
  getEmployee!: Employee;
  optionDesc: string = '';
  companies: string[] = [];
  tempCompanies: string[] = [];

  selectedCompanies: string[] = [];

  jobTypes = [
    { name: "Full Time", color: "green" },
    { name: "Part Time", color: "blue" },
    { name: "Contract", color: "orange" },
    { name: "Freelance", color: "purple" },
    { name: "Internship", color: "red" },
    { name: "Apprenticeship", color: "purple" },
    { name: "Remote", color: "cyan" },
    { name: "Temporary", color: "yellow" },
    { name: "Agency", color: "pink" },
    { name: "Consultant", color: "teal" },
    { name: "Visa Sponsor", color: "indigo" },
    { name: "Intern", color: "gray" }
  ];
  types = this.jobTypes;

  // Pagination
  currentPage: number = 1;
  numberOfPages: number = 1;


  // *************** Front configs ***************
  dropdownId: string = 'company';
  selectedType: string = 'All';
  showModal: boolean = false;
  // selectedId: number = 0;
  sidebarCollapsed: boolean = false;
  enableConfig: boolean = true;
  isDarkMode: boolean = false;
  isAbsolute: boolean = false;
  tabType: string = 'line';
  colors: Color[] = basicTailwindColors;
  currentColor: string = '';
  openDropdownFilter: boolean = false;
  currentFilter: string = 'company';
  openDropdownSort: boolean = false;
  sortTerm: { name: string, value: string } = { name: '', value: '' };
  sortOrder: { name: string, value: string }  = { name: '', value: '' };

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
    const startIndex = (this.currentPage - 1) * 12;
    const endIndex = startIndex + 12;

    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response.slice(startIndex, endIndex);
        this.numberOfPages = Math.ceil(response.length / 12);

        // this.dataSubject = response;
        this.dataSubject = response;
        this.dataLength = response.length;
        this.companies = Array.from(new Set(response.map(employee => employee.companyName)));
        this.tempCompanies = this.companies;
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
    this.employees = this.dataSubject.filter(employee => employee.name.toLowerCase().includes(filterValue.toLowerCase()) || employee.companyName.toLowerCase().includes(filterValue.toLowerCase()));
    

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

  public searchCompanies(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.companies = this.tempCompanies.filter(company => company.toLowerCase().includes(filterValue.toLowerCase()));
  }

  filterByType(type: string) {
    this.selectedType = type;

    if(this.selectedType !== 'All') {
      this.employees = this.dataSubject.filter(employee => employee.workType === this.selectedType);
      
    } else {
      this.employees = this.dataSubject;
    }
  }

  searchWorkType(event: Event) {
    const job = (event.target as HTMLInputElement).value;
    this.jobTypes = this.types.filter(type => type.name.toLowerCase().includes(job.toLowerCase()));
  }

  getJobs(): string[] {
    const uniqueJobs = new Set(this.employees.map(employee => employee.jobTitle));
    return Array.from(uniqueJobs);
  }

  previousPage() {
    if(this.currentPage > 1) {
      this.currentPage--;
      console.log(this.currentPage);
      
      this.getEmployees();
    }
  }

  nextPage() {
    if(this.currentPage < this.numberOfPages) {
      this.currentPage++;
      console.log(this.currentPage);
      this.getEmployees();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.getEmployees();
  }

  goToInputPage(pageInput: NgForm) {
    if(pageInput.value?.page < 1 || pageInput.value?.page > this.numberOfPages) {
      this.currentPage = 1;
    } else {
      this.currentPage = pageInput.value?.page;
    }
    this.getEmployees();
  }




  getInitials(name: string) {
    return name
      ?.split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++ Front end only +++++++++++++++++++++++++++++++++++++++++++++++++++++++
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

  toggleFilterDropdown() {
    this.openDropdownSort = false;
    this.openDropdownFilter = !this.openDropdownFilter;
  }

  changeFilter(filterName: string): void {
    this.currentFilter = filterName;
  }

  toggleSortDropdown() {
    this.openDropdownFilter = false;
    this.openDropdownSort = !this.openDropdownSort;
  }

  changeSortTerm(term: string): void {
    this.sortTerm.name = term;
    if(term === 'name') {
      this.sortTerm.value = 'Employee Name';
    } else if(term === 'companyName') {
      this.sortTerm.value = 'Company Name';
    } else if(term === 'jobTitle') {
      this.sortTerm.value = 'Job Title';
    }
  }

  changeSortOrder(order: string): void {
    this.sortOrder.name = order;
    if(order === 'asc') {
      this.sortOrder.value = 'A-Z';
    } else if(order === 'desc') {
      this.sortOrder.value = 'Z-A';
    }
  }

  applyFilters(): void {
    this.openDropdownSort = false;
    
    if(this.sortOrder.name === 'asc') {
      if(this.sortTerm.name === 'name') {
        this.employees.sort((a, b) => a.name?.localeCompare(b.name ?? '') ?? 0);
        return;
      }
      if(this.sortTerm.name === 'companyName') {
        this.employees.sort((a, b) => a.companyName?.localeCompare(b.companyName ?? '') ?? 0);
        return;
      }
      if(this.sortTerm.name === 'jobTitle') {
        this.employees.sort((a, b) => a.jobTitle?.localeCompare(b.jobTitle ?? '') ?? 0);
        return;
      }
    } else {
      if(this.sortTerm.name === 'name') {
        this.employees.sort((a, b) => b.name?.localeCompare(a.name ?? '') ?? 0);
        return;
      }
      if(this.sortTerm.name === 'companyName') {
        this.employees.sort((a, b) => b.companyName?.localeCompare(a.companyName ?? '') ?? 0);
        return;
      }
      if(this.sortTerm.name === 'jobTitle') {
        this.employees.sort((a, b) => b.jobTitle?.localeCompare(a.jobTitle ?? '') ?? 0);
        return;
      }
    }
  }

  closeDropdowns() {
    this.openDropdownFilter = false;
    this.openDropdownSort = false;
  }

  resetFilters(): void {
    this.getEmployees();
    this.sortTerm = { name: '', value: '' };
    this.sortOrder = { name: '', value: '' };
    this.openDropdownSort = false;
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++ Front end only +++++++++++++++++++++++++++++++++++++++++++++++++++++++
}
