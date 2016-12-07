using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;

namespace ResourcePlanner.Services.Enums
{
    public class Enums
    {
        public enum TimeAggregation
        {
            [Description("Daily")]
            Daily = 0,
            [Description("Weekly")]
            Weekly = 1,
            [Description("Monthly")]
            Monthly = 2,
            [Description("Quarterly")]
            Quarterly = 3
        }
        public enum SortOrder
        {
            [Description("None")]
            None,
            [Description("FirstName")]
            FirstName,
            [Description("LastName")]
            LastName,
            [Description("City")]
            City,
            [Description("Position")]
            Position,
            [Description("Practice")]
            Practice,
            [Description("SubPractice")]
            SubPractice,
        }

        public enum SortDirection
        {
            Asc,
            Desc
        }

        public enum DayOfWeek
        {
            None = 0,
            Sunday = 1,
            Monday = 2,
            Tuesday = 3,
            Wednesday = 4,
            Thursday = 5,
            Friday = 6,
            Saturday = 7
        }

        public enum Permission
        {
            AssignResources = 1000,
            ViewAllResources = 1001,
            ViewOwnedProjectResources = 1002,
            Administrator = 1003
        }
    }
    
}