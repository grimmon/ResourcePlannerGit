using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static ResourcePlanner.Services.Enums.Enums;

namespace ResourcePlanner.Services.Models
{
    public class DetailPage
    {
        public TimeAggregation TimeScale { get; set; }
        public List<string> TimePeriods { get; set; }
        public ResourceInfo ResourceInfo { get; set; }
        public List<ProjectDetail> Projects { get; set; }
        public int PageSize { get; set; }
        public int PageNum { get; set; }
        public int TotalRowCount { get; set; }
    }

    public class ResourceInfo
    {
        public int ResourceId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string SubPractice { get; set; }
        public int SubPracticeId { get; set; }
        public string Practice { get; set; }
        public int PracticeId { get; set; }
        public string Position { get; set; }
        public int PositionId { get; set; }
        public string OrgUnit { get; set; }
        public int OrgUnitId { get; set; }
        public string Region { get; set; }
        public int RegionId { get; set; }
        public string Market { get; set; }
        public int MarketId { get; set; }
        public string City { get; set; }
        public int CityId { get; set; }
        public string ManagerFirstName { get; set; }
        public string ManagerLastName { get; set; }
    }

    public class ProjectDetail
    {
        public string ProjectName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string WBSElement { get; set; }
        public string Customer { get; set; }
        public string Description { get; set; }
        public string OpportunityOwnerFirstName { get; set; }
        public string OpportunityOwnerLastName { get; set; }
        public string ProjectManagerFirstName { get; set; }
        public string ProjectManagerLastName { get; set; }
        public List<Assignment> Assignments { get; set; }

    }
}