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
        public double SoftResourceHours { get; set; }
    }
    public class AddAssignments
    {
        public int[] ResourceIds { get; set; }
        public int ProjectMasterId { get; set; }
        public double? TotalHours { get; set; }
        public double? SundayHours { get; set; }
        public double? MondayHours { get; set; }
        public double? TuesdayHours { get; set; }
        public double? WednesdayHours { get; set; }
        public double? ThursdayHours { get; set; }
        public double? FridayHours { get; set; }
        public double? SaturdayHours { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class UpdateAssignment
    {
        public int ResourceId { get; set; }
        public int ProjectMasterId { get; set; }
        public double? TotalHours { get;  set;}
        public double? SundayHours { get; set; }
        public double? MondayHours { get; set; }
        public double? TuesdayHours { get; set; }
        public double? WednesdayHours { get; set; }
        public double? ThursdayHours { get; set; }
        public double? FridayHours { get; set; }
        public double? SaturdayHours { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class GetAssignment
    {
        public double? TotalHours { get; set; }
        public double? SundayHours { get; set; }
        public double? MondayHours { get; set; }
        public double? TuesdayHours { get; set; }
        public double? WednesdayHours { get; set; }
        public double? ThursdayHours { get; set; }
        public double? FridayHours { get; set; }
        public double? SaturdayHours { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string DateName { get; set; }
    }

    public class DeleteAssignment
    {
        public int ResourceId { get; set; }
        public int ProjectMasterId { get; set; }
    }
}