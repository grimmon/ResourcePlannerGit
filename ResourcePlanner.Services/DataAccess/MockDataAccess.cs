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
        private static List<string> _timePeriods = new List<string>();
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
            var timePeriodCount = _rand.Next(3,  10); //cant be greater than 20.
            var resourceCount   = _rand.Next(0, 400);
            var projectCount    = _rand.Next(0,  12);
            
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
            while (_timePeriods.Count < timePeriodCount)
            {
                var timePeriod = LoremIpsumGenerator.LoremIpsum(1, 1, _rand);

                if (!_timePeriods.Contains(timePeriod))
                {
                    _timePeriods.Add(timePeriod);
                }
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

                foreach (var project in randomProjects)
                {
                    var newProject = new Project()
                    {
                        Assignments = new List<Assignment>()
                    };

                    CopyProject(project, newProject);

                    var assignmentCount = _rand.Next(_timePeriods.Count);

                    for (var i = 0; i < assignmentCount; i++)
                    {
                        PopulateAssignments(resource, newProject);
                    }

                    if (newProject.Assignments.Count > 0)
                    {
                        assignedProjects.Add(newProject);
                    }
                }

                _projectsByResource[resource.ResourceId] = assignedProjects;
            }
        }

        public static void PopulateAssignments(Resource resource, Project project)
        {
            for (int j = 0; j < _timePeriods.Count; j++)
            {
                var assignment = new Assignment();
                assignment.TimePeriod = _timePeriods[j];
                assignment.ProjectName = project.ProjectName;

                assignment.ForecastHours = _rand.Next() % 2 == 0 ? 0 : _rand.NextDouble() * 40;
                assignment.ActualHours   = _rand.Next() % 2 == 0 ? 0 : _rand.NextDouble() * 40;

                resource.Assignments.Add(assignment);
                project.Assignments.Add(assignment);
            }

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
            var result = new ResourcePage();
            
            var filteredResourceInfos = FilterResourceInfo(pageParams);

            var resourceIds = filteredResourceInfos
                .Skip(pageParams.PageSize * pageParams.PageNum)
                .Take(pageParams.PageSize)
                .Select(resourceInfo => resourceInfo.ResourceId)
                .ToList();

            var resources = _resources
                .Where(resource => resourceIds.Contains(resource.ResourceId))
                .ToList();
            
            result.Resources = resources;
            result.TotalRowCount = filteredResourceInfos.Count;
            result.TimePeriods = _timePeriods;

            return result;
        }

        public DetailPage GetResourceDetail(int resourceId, TimeAggregation Aggregation, DateTime StartDate, DateTime EndDate)
        {
            var result = new DetailPage();

            result.Projects = _projectsByResource[resourceId];
            result.ResourceInfo = _resourceInfos[resourceId];
            result.TimePeriods = _timePeriods;
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
    }
}