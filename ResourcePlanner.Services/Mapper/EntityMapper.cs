using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResourcePlanner.Core.Extensions;
using ResourcePlanner.Services.Models;
using System.Data.SqlClient;

namespace ResourcePlanner.Services.Mapper
{
    public static class EntityMapper
    {
        public static ResourcePage MapToResourcePage(SqlDataReader reader)
        {

            var resources = new Dictionary<int, Resource>();
            

            int curr = 0;
            int prev = 0;

            while (reader.Read())
            {
                var assignment = new Assignment();
                curr = reader.GetInt32("ResourceId");
                if (curr != prev)
                {
                    var newResource = new Resource()
                    {
                        FirstName = reader.GetNullableString("FirstName"),
                        LastName = reader.GetNullableString("LastName"),
                        City = reader.GetNullableString("City"),
                        Position = reader.GetNullableString("Position"),
                        Assignments = new List<Assignment>()
                    };
                    resources.Add(curr, newResource);
                }
                prev = curr;

                assignment.TimePeriod = reader.GetString("TimePeriod");
                assignment.ForecastHours = reader.GetDouble("ForecastHours");
                assignment.ActualHours = reader.GetDouble("ActualHours");

                resources[curr].Assignments.Add(assignment);


            }

            var resourcePage = new ResourcePage()
            {
                Resources = resources.Values.ToList()
            };

            return resourcePage;
        }


        public static DetailPage MapToResourceDetail(SqlDataReader reader)
        {
            var resourceInfo = new ResourceInfo();
            var projects = new Dictionary<int, Project>();

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
            int curr = 0;
            int prev = 0;

            while (reader.Read())
            {
                var assignment = new Assignment();
                curr = reader.GetInt32("ProjectId");
                if (curr != prev)
                {
                    var newResource = new Project()
                    {
                        ProjectName                = reader.GetNullableString("ProjectName"),
                        WBSElement                 = reader.GetNullableString("WBSElement"),
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
                prev = curr;

                assignment.TimePeriod = reader.GetString("TimePeriod");
                assignment.ForecastHours = reader.GetDouble("ForecastHours");
                assignment.ActualHours = reader.GetDouble("ActualHours");

               projects[curr].Assignments.Add(assignment);


            }

            var detailPage = new DetailPage()
            {
                ResourceInfo = resourceInfo,
                Projects = projects.Values.ToList()
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