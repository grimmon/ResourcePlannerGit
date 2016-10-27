using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResourcePlanner.Services.Models;
using ResourcePlanner.Core.Utilities;
using ResourcePlanner.Services.Mapper;
using System.Data;
using System.Data.SqlClient;
using static ResourcePlanner.Services.Enums.Enums;

namespace ResourcePlanner.Services.DataAccess
{
    public class MockDataAccess
    {
        private static List<DateTime> _timePeriods = new List<DateTime>();
        private static List<Resource> _resources = new List<Resource>();
        private static List<Project> _projects = new List<Project>();

        private static Dictionary<int, ResourceInfo> _resourceInfos = new Dictionary<int, ResourceInfo>();
        private static Dictionary<int, List<Project>> _projectsByResource = new Dictionary<int, List<Project>>();

        private static Random _rand = new Random();

        private static List<DropdownValue> _practices = new List<DropdownValue>();
        private static List<DropdownValue> _positions = new List<DropdownValue>();
        private static List<DropdownValue> _orgUnits  = new List<DropdownValue>();
        private static List<DropdownValue> _regions   = new List<DropdownValue>();
        private static List<DropdownValue> _markets   = new List<DropdownValue>();
        private static List<DropdownValue> _cities    = new List<DropdownValue>();
        
        static MockDataAccess()
        {
            Init();
        }
        
        public static void Init()
        {
            var timePeriodCount = 100;// _rand.Next(3,  10);
            var resourceCount   = _rand.Next(0, 400);
            var projectCount    = _rand.Next(3,  12);
            
            InitDropdownLists();
            InitTimePeriods(timePeriodCount);
            InitResources(resourceCount);
            InitProjects(projectCount);
            AssignProjectsToResources();
        }

        public static void InitDropdownLists()
        {
            var dropdownDataAccess = new MockDropdownDataAccess();
            var dropdownValues = dropdownDataAccess.GetDropdownValues();

            _practices.AddRange(dropdownValues.Where(dropdownValue => dropdownValue.Category == "Practice"));
            _positions.AddRange(dropdownValues.Where(dropdownValue => dropdownValue.Category == "Position"));
            _orgUnits.AddRange (dropdownValues.Where(dropdownValue => dropdownValue.Category == "OrgUnit" ));
            _regions.AddRange  (dropdownValues.Where(dropdownValue => dropdownValue.Category == "Region"  ));
            _markets.AddRange  (dropdownValues.Where(dropdownValue => dropdownValue.Category == "Market"  ));
            _cities.AddRange   (dropdownValues.Where(dropdownValue => dropdownValue.Category == "City"    ));
        }

        public static void InitTimePeriods(int timePeriodCount)
        {
            var timePeriod = new DateTime(2016, 10, 1);

            while (_timePeriods.Count < timePeriodCount)
            {
                _timePeriods.Add(timePeriod);

                timePeriod = timePeriod.AddDays(1);
            }
        }
        
        public static void InitResources(int resourceInfoCount)
        {
            for (int i = 0; i < resourceInfoCount; i++)
            {
                var resourceInfo = new ResourceInfo();
                var resource = new Resource();

                PopulateResourceInfo(resourceInfo);
                PopulateResource(resourceInfo, resource);

                _resourceInfos[resourceInfo.ResourceId] = resourceInfo;
                _resources.Add(resource);
            }
        }

        public static void InitProjects(int projectCount)
        {
            for (int i = 0; i < projectCount; i++)
            {
                var project = new Project();

                PopulateProject(project);

                _projects.Add(project);
            }
        }

        public static void AssignProjectsToResources()
        {
            foreach (var resource in _resources)
            {
                resource.Assignments = new List<Assignment>();
                var randomProjects = GetRandomProjects();
                var assignedProjects = new List<Project>();
                var assignments = new List<Assignment>();
                
                foreach (var project in randomProjects)
                {
                    var copiedProject = new Project()
                    {
                        Assignments = new List<Assignment>()
                    };

                    CopyProject(project, copiedProject);
                    
                    var projectAssignments = GetRandomAssignments();
                    projectAssignments.ForEach(assignment => assignment.ProjectName = project.ProjectName);

                    assignedProjects.Add(copiedProject);

                    assignments.AddRange(projectAssignments);
                }
                
                foreach (var timePeriod in _timePeriods)
                {
                    var timePeriodAssignments = assignments.Where(assignment =>
                    {
                        var assignmentTimePeriod = DateTime.Parse(assignment.TimePeriod);

                        return assignmentTimePeriod == timePeriod;
                    });

                    var totalActualHours     = timePeriodAssignments.Sum(assignment => assignment.ActualHours);
                    var totalForecastedHours = timePeriodAssignments.Sum(assignment => assignment.ForecastHours);
                    
                    if (totalActualHours > 0 || totalForecastedHours > 0)
                    {
                        var resourceAssignment = new Assignment();

                        resourceAssignment.ActualHours   = totalActualHours;
                        resourceAssignment.ForecastHours = totalForecastedHours;
                        resourceAssignment.TimePeriod    = timePeriod.ToString();

                        resource.Assignments.Add(resourceAssignment);
                    }
                }
                
                _projectsByResource[resource.ResourceId] = assignedProjects;
            }
        }
        
        public static List<Assignment> GetRandomAssignments()
        {
            var result = new List<Assignment>();

            foreach (var i in Enumerable.Range(0, _timePeriods.Count))
            {
                if (_rand.Next() % 2 == 0)
                {
                    var assignment = new Assignment();

                    assignment.TimePeriod = _timePeriods[i].ToString();

                    assignment.ForecastHours = _rand.Next() % 2 == 0 ? 0 : Math.Round(_rand.NextDouble() * 8, 2);
                    assignment.ActualHours   = _rand.Next() % 2 == 0 ? 0 : Math.Round(_rand.NextDouble() * 8, 2);

                    if (assignment.ForecastHours > 0 || assignment.ActualHours > 0)
                    {
                        result.Add(assignment);
                    }
                }
            }

            return result;
        }

        public static List<Project> GetRandomProjects()
        {
            var projects = new List<Project>(_projects);

            var removeAttemptCount = _rand.Next(projects.Count);

            for (int i = 0; i < removeAttemptCount; i++)
            {
                projects.RemoveAt(_rand.Next(projects.Count));
            }

            return projects;
        }
        
        public List<ResourceInfo> FilterResourceInfo(ResourceQuery pageParams)
        {
            var resourceInfos = new List<ResourceInfo>(_resourceInfos.Values);

            if (pageParams.City.HasValue)
            {
                resourceInfos = resourceInfos.Where(resourceInfo => resourceInfo.CityId == pageParams.City.Value).ToList();
            }

            if (pageParams.Market.HasValue)
            {
                resourceInfos = resourceInfos.Where(resourceInfo => resourceInfo.MarketId == pageParams.Market.Value).ToList();
            }

            if (pageParams.OrgUnit.HasValue)
            {
                resourceInfos = resourceInfos.Where(resourceInfo => resourceInfo.OrgUnitId == pageParams.OrgUnit.Value).ToList();
            }

            //position is a string? position skipped for now

            if (pageParams.Practice.HasValue)
            {
                resourceInfos = resourceInfos.Where(resourceInfo => resourceInfo.PracticeId == pageParams.Practice.Value).ToList();
            }

            if (pageParams.Region.HasValue)
            {
                resourceInfos = resourceInfos.Where(resourceInfo => resourceInfo.RegionId == pageParams.Region.Value).ToList();
            }

            return resourceInfos;
        }

        public ResourcePage GetResourcePage(ResourceQuery pageParams)
        {
            var result = new ResourcePage()
            {
                Resources = new List<Resource>()
            };
            
            var filteredResourceInfos = FilterResourceInfo(pageParams);

            //Page the results.
            var resourceIds = filteredResourceInfos
                .Skip(pageParams.PageSize * pageParams.PageNum)
                .Take(pageParams.PageSize)
                .Select(resourceInfo => resourceInfo.ResourceId)
                .ToList();
            
            //Filter out assignments outside of the date range.
            foreach (var resource in _resources.Where(resource => resourceIds.Contains(resource.ResourceId)))
            {
                var copiedResource = new Resource();

                CopyResource(resource, copiedResource);

                copiedResource.Assignments = resource.Assignments.Where(assignment =>
                {
                    var assignmentTime = DateTime.Parse(assignment.TimePeriod);

                    //Start Date inclusive, End date Exclusive
                    return assignmentTime >= pageParams.StartDate && assignmentTime < pageParams.EndDate;
                }).ToList();

                result.Resources.Add(copiedResource);
            }

            //aggregate assignments by time period
            if (pageParams.Aggregation == TimeAggregation.Weekly)
            {
                foreach (var resource in result.Resources)
                {
                    var weekAssignments = new List<Assignment>();

                    var firstTimePeriod = resource.Assignments.Min(assignment => DateTime.Parse(assignment.TimePeriod));
                    var lastTimePeriod  = resource.Assignments.Max(assignment => DateTime.Parse(assignment.TimePeriod));

                    var startOfWeek = firstTimePeriod.AddDays(-1 * (int) firstTimePeriod.DayOfWeek);
                    var endOfWeek = startOfWeek.AddDays(7);

                    while (startOfWeek < lastTimePeriod)
                    {
                        var assignmentsWithinWeek = resource.Assignments.Where(assignment =>
                        {
                            var assignmentTimePeriod = DateTime.Parse(assignment.TimePeriod);

                            return assignmentTimePeriod >= startOfWeek && assignmentTimePeriod < endOfWeek;
                        }).ToList();

                        var weekAssignment = new Assignment();

                        weekAssignment.TimePeriod = startOfWeek.ToString();
                        weekAssignment.ActualHours = assignmentsWithinWeek.Sum(assignment => assignment.ActualHours);
                        weekAssignment.ForecastHours = assignmentsWithinWeek.Sum(assignment => assignment.ForecastHours);

                        weekAssignments.Add(weekAssignment);

                        startOfWeek = startOfWeek.AddDays(7);
                        endOfWeek = endOfWeek.AddDays(7);
                    }
                }
            }
            else if (pageParams.Aggregation == TimeAggregation.Monthly)
            {
                foreach (var resource in result.Resources)
                {
                    var monthAssignments = new List<Assignment>();

                    var firstTimePeriod = resource.Assignments.Min(assignment => DateTime.Parse(assignment.TimePeriod));
                    var lastTimePeriod  = resource.Assignments.Max(assignment => DateTime.Parse(assignment.TimePeriod));

                    var startOfMonth = new DateTime(firstTimePeriod.Year, firstTimePeriod.Month, 1);
                    var endOfMonth = startOfMonth.AddMonths(1);

                    while (startOfMonth < lastTimePeriod)
                    {
                        var assignmentsWithinMonth = GetAssignmentsWithinDateRange(resource.Assignments, startOfMonth, endOfMonth);
                        var monthAssignment = AggregateAssignments(assignmentsWithinMonth);
                        monthAssignment.TimePeriod = startOfMonth.ToString();
                        monthAssignments.Add(monthAssignment);
                        
                        startOfMonth = startOfMonth.AddMonths(1);
                        endOfMonth = endOfMonth.AddMonths(1);
                    }
                }
            }
            else if (pageParams.Aggregation == TimeAggregation.Quarterly)
            {
                foreach (var resource in result.Resources)
                {
                    var quarterAssignments = new List<Assignment>();

                    var firstTimePeriod = resource.Assignments.Min(assignment => DateTime.Parse(assignment.TimePeriod));
                    var lastTimePeriod  = resource.Assignments.Max(assignment => DateTime.Parse(assignment.TimePeriod));

                    var start = new DateTime(2016, 1, 1);
                    
                    var startOfQuarter = new DateTime(firstTimePeriod.Year, (firstTimePeriod.Month - 1) / 3 * 3 + 1, 1);
                    var endOfQuarter = startOfQuarter.AddMonths(3);

                    while (startOfQuarter < lastTimePeriod)
                    {
                        var assignmentsWithinQuarter = GetAssignmentsWithinDateRange(resource.Assignments, startOfQuarter, endOfQuarter);
                        var quarterAssignment = AggregateAssignments(assignmentsWithinQuarter);
                        quarterAssignment.TimePeriod = startOfQuarter.ToString();
                        quarterAssignments.Add(quarterAssignment);
                        
                        startOfQuarter = startOfQuarter.AddMonths(3);
                        endOfQuarter = endOfQuarter.AddMonths(3);
                    }
                }
            }
            
            result.TotalRowCount = filteredResourceInfos.Count;
            
            //Filter out time periods based on start and end date.
            result.TimePeriods = _timePeriods
                .Where(timePeriod => timePeriod >= pageParams.StartDate && timePeriod < pageParams.EndDate)
                .Select(timePeriod => timePeriod.ToString()).ToList();

            return result;
        }
        
        public static List<Assignment> GetAssignmentsWithinDateRange(List<Assignment> assignments, DateTime startTime, DateTime endTime)
        {
            return assignments.Where(assignment =>
            {
                var assignmentTimePeriod = DateTime.Parse(assignment.TimePeriod);

                return assignmentTimePeriod >= startTime && assignmentTimePeriod < endTime;
            }).ToList();
        }

        public static Assignment AggregateAssignments(List<Assignment> assignments)
        {
            var result = new Assignment();

            result.ActualHours = assignments.Sum(assignment => assignment.ActualHours);
            result.ForecastHours = assignments.Sum(assignment => assignment.ForecastHours);

            return result;
        }

        public DetailPage GetResourceDetail(int resourceId, TimeAggregation Aggregation, DateTime StartDate, DateTime EndDate)
        {
            var result = new DetailPage()
            {
                Projects = new List<Project>()
            };

            var resourceProjects = _projectsByResource[resourceId];

            foreach (var project in resourceProjects)
            {
                var copiedProject = new Project()
                {
                    Assignments = new List<Assignment>()
                };

                CopyProject(project, copiedProject);

                copiedProject.Assignments = project.Assignments.Where(assignment =>
                {
                    var assignmentTime = DateTime.Parse(assignment.TimePeriod);

                    return assignmentTime >= StartDate && assignmentTime < EndDate;
                }).ToList();

                result.Projects.Add(copiedProject);
            }

            result.TimePeriods = _timePeriods
                .Where(timePeriod => timePeriod >= StartDate && timePeriod < EndDate)
                .Select(timePeriod => timePeriod.ToString()).ToList();

            result.ResourceInfo = _resourceInfos[resourceId];
            result.TotalRowCount = result.Projects.Count;

            return result;
        }
        
        public static DropdownValue GetRandomDropdown(List<DropdownValue> list)
        {
            if (list != null && list.Count > 0)
            {
                return list[_rand.Next(list.Count)];
            }

            return new DropdownValue
            {
                Category = LoremIpsumGenerator.LoremIpsum(1, 1, _rand),
                Id = _rand.Next(),
                Name = LoremIpsumGenerator.LoremIpsum(1, 1, _rand)
            };
        }
        
        public static void PopulateResourceInfo(ResourceInfo resourceInfo)
        {
            resourceInfo.ResourceId  = _rand.Next();

            var city     = GetRandomDropdown(_cities);
            var market   = GetRandomDropdown(_markets);
            var orgUnit  = GetRandomDropdown(_orgUnits);
            var practice = GetRandomDropdown(_practices);
            var position = GetRandomDropdown(_positions);
            var region   = GetRandomDropdown(_regions);

            resourceInfo.City       = city.Name;
            resourceInfo.CityId     = city.Id;
            resourceInfo.Market     = market.Name;
            resourceInfo.MarketId   = market.Id;
            resourceInfo.OrgUnit    = orgUnit.Name;
            resourceInfo.OrgUnitId  = orgUnit.Id;
            resourceInfo.Practice   = practice.Name;
            resourceInfo.PracticeId = practice.Id;
            resourceInfo.Position   = position.Name;
            resourceInfo.PositionId = position.Id; 

            resourceInfo.FirstName        = LoremIpsumGenerator.LoremIpsum(1, 1, _rand);
            resourceInfo.LastName         = LoremIpsumGenerator.LoremIpsum(1, 1, _rand);
            resourceInfo.ManagerFirstName = LoremIpsumGenerator.LoremIpsum(1, 1, _rand);
            resourceInfo.ManagerLastName  = LoremIpsumGenerator.LoremIpsum(1, 1, _rand);
        }

        public static void PopulateResource(ResourceInfo resourceInfo, Resource resource)
        {
            resource.ResourceId = resourceInfo.ResourceId;
            resource.FirstName  = resourceInfo.FirstName;
            resource.LastName   = resourceInfo.LastName;
            resource.City       = resourceInfo.City;
            resource.Position   = resourceInfo.Position;
        }
        
        public static void PopulateProject(Project project)
        {
            project.ProjectName               = LoremIpsumGenerator.LoremIpsum(2, 4, _rand);
            project.WBSElement                = new Guid().ToString();
            project.Customer                  = LoremIpsumGenerator.LoremIpsum(2, 4, _rand);
            project.Description               = LoremIpsumGenerator.LoremIpsum(4, 6, _rand);
            project.OpportunityOwnerFirstName = LoremIpsumGenerator.LoremIpsum(1, 1, _rand);
            project.OpportunityOwnerLastName  = LoremIpsumGenerator.LoremIpsum(1, 1, _rand);
            project.ProjectManagerFirstName   = LoremIpsumGenerator.LoremIpsum(1, 1, _rand);
            project.ProjectManagerLastName    = LoremIpsumGenerator.LoremIpsum(1, 1, _rand);
        } 

        public static void CopyProject(Project source, Project target)
        {
            target.ProjectName               = source.ProjectName;              
            target.WBSElement                = source.WBSElement;               
            target.Customer                  = source.Customer;              
            target.Description               = source.Description;              
            target.OpportunityOwnerFirstName = source.OpportunityOwnerFirstName;
            target.OpportunityOwnerLastName  = source.OpportunityOwnerLastName; 
            target.ProjectManagerFirstName   = source.ProjectManagerFirstName;  
            target.ProjectManagerLastName    = source.ProjectManagerLastName;
        }

        public static void CopyResource(Resource source, Resource target)
        {
            target.City       = source.City;
            target.FirstName  = source.FirstName;
            target.LastName   = source.LastName;
            target.Position   = source.Position;
            target.ResourceId = source.ResourceId;
        }
    }
}