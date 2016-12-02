using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ResourcePlanner.Services.Models
{
    public class Assignment
    {
        public string ProjectName { get; set; }
        public string TimePeriod { get; set; }
        public double ForecastHours { get; set; }
        public double ActualHours { get; set; }
        public double ResourceHours { get; set; }
    }
    public class AddAssignments
    {
        public int[] ResourceIds { get; set; }
        public int ProjectId { get; set; }
        public double Hours { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int DaysOfWeek { get; set; }
    }
}