using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResourcePlanner.Services.Models;
using ResourcePlanner.Core.Utilities;
using ResourcePlanner.Services.Mapper;
using System.Data;
using System.Data.SqlClient;

namespace ResourcePlanner.Services.DataAccess
{
    public class MockDataAccess
    {
        private static List<Resource> _resources;
        private static List<string> _timePeriods;

        static MockDataAccess()
        {
            Init();
        }
        
        public static void Init()
        {
            _timePeriods = new List<string>();
            _resources = new List<Resource>();

            var rand = new Random();

            var timePeriodCount = rand.Next(3, 10); //cant be greater than 20.
            var resourceCount = rand.Next(0, 400);

            while (_timePeriods.Count < timePeriodCount)
            {
                var timePeriod = LoremIpsumGenerator.LoremIpsum(1, 1, rand);

                if (!_timePeriods.Contains(timePeriod))
                {
                    _timePeriods.Add(timePeriod);
                }
            }

            for (int i = 0; i < resourceCount; i++)
            {
                var resource = new Resource()
                {
                    Id = i,
                    FirstName = LoremIpsumGenerator.LoremIpsum(1, 1, rand),
                    LastName = LoremIpsumGenerator.LoremIpsum(1, 1, rand),
                    City = LoremIpsumGenerator.LoremIpsum(1, 2, rand),
                    Position = LoremIpsumGenerator.LoremIpsum(2, 4, rand),
                    Assignments = new List<Assignment>()
                };
                
                for (int j = 0; j < _timePeriods.Count; j++)
                {
                    var assignment = new Assignment();
                    assignment.TimePeriod = _timePeriods[j];

                    assignment.ForecastHours = rand.Next() % 2 == 0 ? 0 : rand.NextDouble() * 40;
                    assignment.ActualHours   = rand.Next() % 2 == 0 ? 0 : rand.NextDouble() * 40;
                    
                    resource.Assignments.Add(assignment);
                }

                _resources.Add(resource);
            }
        }

        public ResourcePage GetResourcePage(ResourceQuery pageParams)
        {
            var pagedResources = _resources
                .Skip(pageParams.PageSize * pageParams.PageNum)
                .Take(pageParams.PageSize)
                .ToList();

            var resourcePage = new ResourcePage()
            {
                Resources = pagedResources,
                TotalResourceCount = _resources.Count,
                TimePeriods = _timePeriods
            };

            return resourcePage;
        }

        public DetailPage GetResourceDetail(int ResourceId, DateTime StartDate, DateTime EndDate)
        {
            var rand = new Random();
            var detailPage = new DetailPage()
            {
                Projects = new List<Project>(),
                TimePeriods = new List<string>()
            };
            var resourceInfo = new ResourceInfo();

            resourceInfo.FirstName = LoremIpsumGenerator.LoremIpsum(1, 1, rand);
            resourceInfo.LastName = LoremIpsumGenerator.LoremIpsum(1, 1, rand);
            resourceInfo.Practice = LoremIpsumGenerator.LoremIpsum(1, 3, rand);
            resourceInfo.OrgUnit = LoremIpsumGenerator.LoremIpsum(1, 2, rand);
            resourceInfo.Market = LoremIpsumGenerator.LoremIpsum(1, 2, rand);
            resourceInfo.City = LoremIpsumGenerator.LoremIpsum(1, 2, rand);
            resourceInfo.Position = LoremIpsumGenerator.LoremIpsum(2, 4, rand);
            resourceInfo.ManagerFirstName = LoremIpsumGenerator.LoremIpsum(1, 1, rand);
            resourceInfo.ManagerLastName = LoremIpsumGenerator.LoremIpsum(1, 1, rand);

            int numProjects = rand.Next(5, 10);
            for (int i = 0; i < numProjects; i++)
            {
                var project = new Project()
                {

                    ProjectName = LoremIpsumGenerator.LoremIpsum(2, 4, rand),
                    WBSElement = new Guid().ToString(),
                    Customer = LoremIpsumGenerator.LoremIpsum(2, 4, rand),
                    Description = LoremIpsumGenerator.LoremIpsum(4, 6, rand),
                    OpportunityOwnerFirstName = LoremIpsumGenerator.LoremIpsum(1, 1, rand),
                    OpportunityOwnerLastName = LoremIpsumGenerator.LoremIpsum(1, 1, rand),
                    ProjectManagerFirstName = LoremIpsumGenerator.LoremIpsum(1, 1, rand),
                    ProjectManagerLastName = LoremIpsumGenerator.LoremIpsum(1, 1, rand),
                    Assignments = new List<Assignment>()
                };

                int assignCount = rand.Next(5, 10);
                for (int j = 0; j < assignCount; j++)
                {
                    var timeperiod = LoremIpsumGenerator.LoremIpsum(1, 1, rand);
                    if (!detailPage.TimePeriods.Contains(timeperiod))
                    {
                        detailPage.TimePeriods.Add(timeperiod);
                    }
                    var assignment = new Assignment();

                    assignment.TimePeriod = timeperiod;
                    assignment.ForecastHours = rand.NextDouble() * 40;
                    assignment.ActualHours = rand.NextDouble() * 40;

                    project.Assignments.Add(assignment);
                }

                detailPage.Projects.Add(project);
            }

            return detailPage;
        }

    }
}