using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResourcePlanner.Services.Models
{
   
    public class AddProject
    {
        public string ProjectName { get; set; }
        public int? CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? OpportunityOwnerId { get; set; }
        public int? ProjectManagerId { get; set; }

    }

    public class ProjectInfo
    {
        public string ProjectName { get; set; }
        public string ProjectNumber { get; set; }
        public string Offering { get; set; }
        public string WBSCode { get; set; }
        public string Description { get; set; }
        public string URL { get; set; }
        public string ProjectManagerFirstName { get; set; }
        public string ProjectManagerLastName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class ProjectResource
    {
        public int ResourceId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Position { get; set; }
        public double CostRate { get; set; }
        public double TotalForecastHours { get; set; }
        public double TotalResourceHours { get; set; }
        public List<Assignment> Assignments { get; set; }
    }

    public class ProjectPage
    {
        public ProjectInfo ProjectInfo { get; set; }
        public List<string> TimePeriods { get; set; }
        public List<ProjectResource> ProjectResource { get; set; }
        public int PageSize { get; set; }
        public int PageNum { get; set; }
        public int TotalRowCount { get; set; }
    }
}