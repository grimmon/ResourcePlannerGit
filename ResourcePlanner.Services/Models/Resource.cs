﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static ResourcePlanner.Services.Enums.Enums;

namespace ResourcePlanner.Services.Models
{
    public class ResourcePage
    {
        public TimeAggregation TimeScale { get; set; }
        public List<string> TimePeriods { get; set; }
        public List<Resource> Resources{ get; set; }
        public int PageSize { get; set; }
        public int PageNum { get; set; }
        public int TotalRowCount { get; set; }
    }

    
    public class ResourcePageExcelData
    {
        public string FirstName { get; set; } 
        public string LastName { get; set; }
        public string City { get; set; }
        public string Position { get; set; }
        public string Practice { get; set; }
        public string SubPractice { get; set; }
        public string TimePeriod { get; set; }
        public string ForecastHours { get; set; }
        public string ActualHours { get; set; }
        public string ResourceHours { get; set; }
    }
    public class Resource
    {
        public int ResourceId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Position { get; set; }
        public string City { get; set; }
        public string Practice { get; set; }
        public string SubPractice { get; set; }
        public string ResourceManagerFirstName { get; set; }
        public string ResourceManagerLastName { get; set; }
        public List<Assignment> Assignments { get; set; }
    }

    public class ResourceQuery
    {
        public string Login { get; set; }
        public TimeAggregation Aggregation { get; set; }
        public SortOrder Sort { get; set; }
        public SortDirection SortDirection { get; set; }
        public int PageSize { get; set; }
        public int PageNum { get; set; }
        public int? City { get; set; }
        public int? OrgUnit { get; set; }
        public int? Region { get; set; }
        public int? Market { get; set; }
        public int? Practice { get; set; }
        public int? SubPractice { get; set; }
        public int? ResourceManager { get; set; }
        public int[] Positions { get; set; }
        public string SearchTerm1 { get; set; }
        public string SearchTerm2 { get; set; }
        public string SearchTerm3 { get; set; }
        public string SearchTerm4 { get; set; }
        public string SearchTerm5 { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool Availability { get; set; }
        public bool Excel { get; set; }

    }

    public class EmailRequestInfo
    {
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string ResourceName { get; set; }
        public string ResourceEmail { get; set; }
        public string ResourceManagerFirstName { get; set; }
        public string ResourceManagerLastName { get; set; }
        public string ResourceManagerEmail { get; set; }
        public double Hours { get; set;}
        public string Project { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

    }

}