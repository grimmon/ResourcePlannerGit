using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResourcePlanner.Core.Extensions;
using ResourcePlanner.Services.Models;
using ResourcePlanner.Services.Enums;
using System.Data.SqlClient;
using System.Configuration;
using System.Text;

namespace ResourcePlanner.Services.Mapper
{
    public static class EntityMapper
    {
        public static ResourcePage MapToResourcePage(SqlDataReader reader, ResourceQuery param)
        {

            var resources = new Dictionary<int, Resource>();

            var dailyAvailHours = Int32.Parse(ConfigurationManager.AppSettings["DailyAvailableHours"]);
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
                        HomeCity = reader.GetNullableString("HomeCity"),
                        Position = reader.GetNullableString("Position"),
                        Practice = reader.GetNullableString("Practice"),
                        SubPractice = reader.GetNullableString("SubPractice"),
                        ResourceManagerFirstName = reader.GetNullableString("ResourceManagerFirstName"),
                        ResourceManagerLastName = reader.GetNullableString("ResourceManagerLastName"),
                        Assignments = new List<Assignment>()
                    };

                    resources.Add(curr, newResource);

                }

                assignment.TimePeriod = reader.GetString("PeriodName");

                if (param.Availability)
                {
                    int WeekWorkHours = reader.GetInt32("WorkDays") * dailyAvailHours;
                    assignment.ForecastHours = WeekWorkHours - reader.GetDouble("ForecastHours");
                    assignment.ActualHours = WeekWorkHours - reader.GetDouble("ActualHours");
                    assignment.ResourceHours = WeekWorkHours - reader.GetDouble("ResourceHours");
                    assignment.SoftResourceHours = WeekWorkHours - reader.GetDouble("SoftResourceHours");
                }
                else
                {
                    assignment.ForecastHours = reader.GetDouble("ForecastHours");
                    assignment.ActualHours = reader.GetDouble("ActualHours");
                    assignment.ResourceHours = reader.GetDouble("ResourceHours");
                    assignment.SoftResourceHours = reader.GetDouble("SoftResourceHours");
                }
                resources[curr].Assignments.Add(assignment);


            } 
                
               

            var resourcePage = new ResourcePage()
            {
                Resources = SortPage(resources.Values.ToList(), param.Sort, param.SortDirection),
                TotalRowCount = totalRowCount
            };

            return resourcePage;
        }

        internal static ProjectPage MapToProjectPage(SqlDataReader reader)
        {
            var projectInfo = new ProjectInfo();
            var resources = new Dictionary<int, ProjectResource>();
            var timePeriods = new List<string>();

            reader.Read();

            projectInfo.ProjectName = reader.GetNullableString("ProjectName");
            projectInfo.ProjectNumber = reader.GetNullableString("ProjectNumber");
            projectInfo.Description = reader.GetNullableString("Description");
            projectInfo.Offering = reader.GetNullableString("Offering");
            projectInfo.WBSCode = reader.GetNullableString("WbsCode");
            projectInfo.Customer = reader.GetNullableString("Customer");
            projectInfo.StartDate = reader.GetDateTime("StartDate");
            projectInfo.EndDate = reader.GetDateTime("EndDate");
            projectInfo.ProjectManagerFirstName = reader.GetNullableString("ProjectManagerFirstName");
            projectInfo.ProjectManagerLastName = reader.GetNullableString("ProjectManagerLastName");

            reader.NextResult();

            while (reader.Read())
            {
                timePeriods.Add(reader.GetString("TimePeriod"));
            }

            reader.NextResult();


            int curr = 0;
            while (reader.Read())
            {
                var assignment = new Assignment();
                curr = reader.GetInt32("ResourceId");
                if (!resources.ContainsKey(curr))
                {
                    var newResource = new ProjectResource()
                    {
                        FirstName = reader.GetNullableString("FirstName"),
                        LastName = reader.GetNullableString("LastName"),
                        Position = reader.GetNullableString("Position"),
                        CostRate = reader.GetNullableDouble("CostRate") ?? 0,
                        TotalForecastHours = reader.GetDouble("TotalForecastHours"),
                        TotalResourceHours = reader.GetDouble("TotalResourceHours"),
                        Assignments = new List<Assignment>()
                    };
                    resources.Add(curr, newResource);
                }

                assignment.TimePeriod = reader.GetString("TimePeriod");
                assignment.ForecastHours = reader.GetDouble("ForecastHours");
                assignment.ActualHours = reader.GetDouble("ActualHours");
                assignment.ResourceHours = reader.GetDouble("ResourceHours");

                resources[curr].Assignments.Add(assignment);


            }

            var resultResources = resources.Values.ToList();

            var projectPage = new ProjectPage()
            {
                ProjectInfo = projectInfo,
                ProjectResource = resultResources,
                TotalRowCount = resultResources.Count,
                TimePeriods = timePeriods
            };

            return projectPage;
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
            var projects = new Dictionary<int, ProjectDetail>();

            reader.Read();

            resourceInfo.FirstName         = reader.GetNullableString("FirstName");
            resourceInfo.LastName          = reader.GetNullableString("LastName");
            resourceInfo.Practice          = reader.GetNullableString("Practice");
            resourceInfo.SubPractice       = reader.GetNullableString("SubPractice");
            resourceInfo.OrgUnit           = reader.GetNullableString("OrgUnit");
            resourceInfo.Market            = reader.GetNullableString("Market");
            resourceInfo.City              = reader.GetNullableString("City");
            resourceInfo.Position          = reader.GetNullableString("Position");
            resourceInfo.ManagerFirstName  = reader.GetNullableString("ManagerFirstName");
            resourceInfo.ManagerLastName   = reader.GetNullableString("ManagerLastName");

            reader.NextResult();

            int curr = 0;
            while (reader.Read())
            {
                var assignment = new Assignment();
                curr = reader.GetInt32("ProjectMasterId");
                if (!projects.ContainsKey(curr))
                {
                    var newResource = new ProjectDetail()
                    {
                        
                        ProjectMasterId            = curr,
                        ProjectName                = reader.GetNullableString("ProjectName"),
                        WBSElement                 = reader.GetNullableString("WBSCode"),
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

                assignment.TimePeriod = reader.GetString("PeriodName");
                assignment.ForecastHours = reader.GetDouble("ForecastHours");
                assignment.ActualHours = reader.GetDouble("ActualHours");
                assignment.ResourceHours = reader.GetDouble("ResourceHours");

                projects[curr].Assignments.Add(assignment);


            }

            var resultProjects = projects.Values.ToList();

            var detailPage = new DetailPage()
            {
                ResourceInfo = resourceInfo,
                Projects = resultProjects,
                TotalRowCount = resultProjects.Count
            };

            return detailPage;
        }

        public static ResourceBreakdown MapToResourceBreakdown(SqlDataReader reader)
        {
            

            reader.Read();

            var totalHours = reader.GetDouble("TotalHours");
            var projectHours = reader.GetDouble("ProjectHours");
            var ptoHours = reader.GetDouble("PtoHours");
            var trainingHours = reader.GetDouble("TrainingHours");
            var internalProjectHours = reader.GetDouble("InternalSupportHours");
            var otherHours = reader.GetDouble("OtherHours");

           

            var breakdown = new ResourceBreakdown()
            {
                TotalHours = totalHours, 
                ProjectHours = projectHours,
                PtoHours = ptoHours,
                TrainingHours = trainingHours,
                InternalProjectHours = internalProjectHours,
                OtherHours = otherHours
            };

            return breakdown;
        }

        public static List<IdNameGeneric> MapToIdNameGeneric(SqlDataReader reader, string sourceId, string sourceName, string sourceKey = "")
        {
            var values = new List<IdNameGeneric>();
            while (reader.Read())
            {
                var value = new IdNameGeneric
                {
                    Id = reader.GetInt32(sourceId),
                    Name = reader.GetString(sourceName),
                };

                if (sourceKey != "")
                {
                    value.Name += " (" + reader.GetNullableString(sourceKey) + ")";
                }

                    values.Add(value);
            }
            return values;
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

        public static EmailRequestInfo MapToResourceManagerInfo(SqlDataReader reader, int UserId)
        {
            var returnVal = new EmailRequestInfo();

            reader.Read();
            returnVal.ResourceName = reader.GetString("ResourceFirstName") + " " + reader.GetString("ResourceLastName");
            returnVal.ResourceEmail = reader.GetString("ResourceEmailAddress");
            returnVal.ResourceManagerFirstName = reader.GetString("ResourceManagerFirstName");
            returnVal.ResourceManagerLastName = reader.GetString("ResourceManagerLastName");
            returnVal.ResourceManagerEmail = reader.GetString("ResourceManagerEmailAddress");

            if (UserId != 0)
            {
                reader.NextResult();
                reader.Read();
                returnVal.UserName = reader.GetString("FirstName") + " " + reader.GetString("LastName");
                returnVal.UserEmail = reader.GetString("EmailAddress");

            }
            return returnVal;

        }

        public static bool CheckAuth(SqlDataReader reader)
        {

            reader.Read();

            if (reader.HasRows)
            {
                return true;
            }
            return false;
        }

        public static List<Enums.Enums.Permission> MapToPermissions(SqlDataReader reader)
        {
            var perms = new List<Enums.Enums.Permission>();

            while (reader.Read())
            {
                perms.Add((Enums.Enums.Permission)reader.GetInt32("PermissionId"));
            }

            
            return perms;
        }


    }
}