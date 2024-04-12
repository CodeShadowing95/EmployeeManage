package com.vastolorde.empmanager.service;

import com.vastolorde.empmanager.exception.UserNotFoundException;
import com.vastolorde.empmanager.model.Employee;
import com.vastolorde.empmanager.repo.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EmployeeService {
    private final EmployeeRepo employeeRepo;

    @Autowired
    public EmployeeService(EmployeeRepo employeeRepo) {
        this.employeeRepo = employeeRepo;
    }

    public Employee addEmployee(Employee employee) {
        employee.setCode(UUID.randomUUID().toString());
        return employeeRepo.save(employee);
    }

    public List<Employee> findAllEmployees() {
        return employeeRepo.findAll();
    }

    public Employee updateEmployee(Employee employee) {
        return employeeRepo.save(employee);
    }

    public Employee findEmployeeById(Long id) {
        return employeeRepo.findEmployeeById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " was not found"));
    }

    public void deleteEmployee(Long id) {
        employeeRepo.deleteById(id);
        // employeeRepo.deleteEmployeeById(id);
    }
}
