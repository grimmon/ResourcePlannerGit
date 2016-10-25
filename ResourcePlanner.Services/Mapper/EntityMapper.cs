using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResourcePlanner.Core.Extensions;
using ResourcePlanner.Services.Models;
using ResourcePlanner.Services.Enums;
using System.Data.SqlClient;

namespace ResourcePlanner.Services.Mapper
{
    public static class EntityMapper
    {
        public static ResourcePage MapToResourcePage(SqlDataReader reader, Enums.Enums.SortOrder order, Enums.Enums.SortDirection direction)
        {

            var resources = new Dictionary<int, Resource>();

            var first = true;
            var totalRowCount = 0;
            int curr = 0;

            while (reader.Read())
            {
                if (first)
                {
                    totalRowCount = reader.GetInt32("TotalRowCount");
                }
                var assignment = new Assignment();
                curr = reader.GetInt32("ResourceId");
                if (!resources.ContainsKey(curr))
                {
                    var newResource = new Resource()
                    {
                        ResourceId = curr,
                        FirstName = reader.GetNullableString("FirstName"),
                        LastName = reader.GetNullableString("LastName"),
                        City = reader.GetNullableString("City"),
                        Position = reader.GetNullableString("Position"),
                        Assignments = new List<Assignment>()
                    };

                    resources.Add(curr, newResource);

                }

                assignment.TimePeriod = reader.GetString("TimePeriod");
                assignment.ForecastHours = reader.GetDouble("ForecastHours");
                assignment.ActualHours = reader.GetDouble("ActualHours");

                resources[curr].Assignments.Add(assignment);


            } 
                
               

            var resourcePage = new ResourcePage()
            {
                Resources = SortPage(resources.Values.ToList(), order, direction),
                TotalRowCount = totalRowCount
            };

            return resourcePage;
        }

        private static List<Resource> SortPage(List<Resource> input, Enums.Enums.SortOrder order, Enums.Enums.SortDirection direction)
        {
            switch (order)
            {
                case Enums.Enums.SortOrder.FirstName:
                    if(direction == Enums.Enums.SortDirection.Desc)
                    {
                        return input.OrderByDescending(r => r.FirstName).ToList();
                    }
                    else
                    {
                        return input.OrderBy(r => r.FirstName).ToList();
                    }
                    break;
                case Enums.Enums.SortOrder.City:
                    if (direction == Enums.Enums.SortDirection.Desc)
                    {
                        return input.OrderByDescending(r => r.City).ToList();
                    }
                    else
                    {
                        return input.OrderBy(r => r.City).ToList();
                    }
                    break;
                case Enums.Enums.SortOrder.Position:
                    if (direction == Enums.Enums.SortDirection.Desc)
                    {
                        return input.OrderByDescending(r => r.Position).ToList();
                    }
                    else
                    {
                        return input.OrderBy(r => r.Position).ToList();
                    }
                    break;
                default:
                    if (direction == Enums.Enums.SortDirection.Desc)
                    {
                        return input.OrderByDescending(r => r.LastName).ToList();
                    }
                    else
                    {
                        return input.OrderBy(r => r.LastName).ToList();
                    }
                    break;
            }
        }


        public static DetailPage MapToResourceDetail(SqlDataReader reader)
        {
            var resourceInfo = new ResourceInfo();
            var projects = new Dictionary<string, Project>();
            var timePeriods = new List<string>();

            reader.Read();

            resourceInfo.FirstName         = reader.GetNullableString("FirstName");
            resourceInfo.LastName          = reader.GetNullableString("LastName");
            resourceInfo.Practice          = reader.GetNullableString("Practice");
            resourceInfo.OrgUnit           = reader.GetNullableString("OrgUnit");
            resourceInfo.Market            = reader.GetNullableString("Market");
            resourceInfo.City              = reader.GetNullableString("City");
            resourceInfo.Position          = reader.GetNullableString("Position");
            resourceInfo.ManagerFirstName  = reader.GetNullableString("ManagerFirstName");
            resourceInfo.ManagerLastName   = reader.GetNullableString("ManagerLastName");

            reader.NextResult();
          
            while (reader.Read())
            {
                timePeriods.Add(reader.GetString("TimePeriod"));
            }

            reader.NextResult();


            string curr = "";
            while (reader.Read())
            {
                var assignment = new Assignment();
                curr = reader.GetNullableString("WBSElement");
                if (!projects.ContainsKey(curr))
                {
                    var newResource = new Project()
                    {
                        ProjectName                = reader.GetNullableString("ProjectName"),
                        WBSElement                 = curr,
                        Customer                   = reader.GetNullableString("Customer"),
                        Description                = reader.GetNullableString("Description"),
                        OpportunityOwnerFirstName  = reader.GetNullableString("OpportunityOwnerFirstName"),
                        OpportunityOwnerLastName   = reader.GetNullableString("OpportunityOwnerLastName"),
                        ProjectManagerFirstName    = reader.GetNullableString("ProjectManagerFirstName"),
                        ProjectManagerLastName     = reader.GetNullableString("ProjectManagerLastName"),
                        Assignments = new List<Assignment>()
                    };
                    projects.Add(curr, newResource);
                }

                assignment.TimePeriod = reader.GetString("TimePeriod");
                assignment.ForecastHours = reader.GetDouble("ForecastHours");
                assignment.ActualHours = reader.GetDouble("ActualHours");

               projects[curr].Assignments.Add(assignment);


            }

            var resultProjects = projects.Values.ToList();

            var detailPage = new DetailPage()
            {
                ResourceInfo = resourceInfo,
                Projects = resultProjects,
                TotalRowCount = resultProjects.Count,
                TimePeriods = timePeriods
            };

            return detailPage;
        }

        public static List<DropdownValue> MapToDropdown(SqlDataReader reader)
        {
            var dropdownValues = new List<DropdownValue>();
            while (reader.Read())
            {
                var value = new DropdownValue
                {
                    Id = reader.GetInt32("ReferenceId"),
                    Name = reader.GetString("LabelText"),
                    Category = reader.GetString("CodeType")
                };

                dropdownValues.Add(value);
            }
            return dropdownValues;
        }
    }
}