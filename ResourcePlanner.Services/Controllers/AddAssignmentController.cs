using ResourcePlanner.Services.DataAccess;
using ResourcePlanner.Services.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;

namespace ResourcePlanner.Services.Controllers
{
    public class AddAssignmentController : ApiController
    {
        public async Task<IHttpActionResult> Post(int ResourceId, int ProjectId, double Hours, DateTime StartDate, DateTime EndDate, Enums.Enums.DayOfWeek[] daysOfWeek)
        {

            var authAccess = new AuthDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            var CurrentUser = User.Identity as ClaimsIdentity;
            var EmailClaim = CurrentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Upn);
            if (EmailClaim == null)
            {
                return Unauthorized();
            }
            if (!authAccess.CheckAuth(EmailClaim.Value,"RM"))
            {
                return Unauthorized();
            }
             
            var access = new AssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));

            int days = 0;

            if (daysOfWeek.Length > 0)
            {
                days = getDaysAsInt(daysOfWeek);
            }



            var asgn = new AddAssignment()
            {
                ResourceId = ResourceId,
                ProjectId = ProjectId,
                Hours = Hours,
                StartDate = StartDate,
                EndDate = EndDate,
                DaysOfWeek = days
            };

            try
            {
                access.AddAssignment(asgn);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok();
        }

        private int getDaysAsInt(Enums.Enums.DayOfWeek[] days)
        {
            int result = 0;
            if (days.Contains(Enums.Enums.DayOfWeek.Sunday))
            {
                result += 1;
            }
            if (days.Contains(Enums.Enums.DayOfWeek.Monday))
            {
                result += 2;
            }
            if (days.Contains(Enums.Enums.DayOfWeek.Tuesday))
            {
                result += 4;
            }
            if (days.Contains(Enums.Enums.DayOfWeek.Wednesday))
            {
                result += 8;
            }
            if (days.Contains(Enums.Enums.DayOfWeek.Thursday))
            {
                result += 16;
            }
            if (days.Contains(Enums.Enums.DayOfWeek.Friday))
            {
                result += 32;
            }
            if (days.Contains(Enums.Enums.DayOfWeek.Saturday))
            {
                result += 64;
            }
            return result;
        } 
    }
}
