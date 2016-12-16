using ResourcePlanner.Services.Auth;
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
using static ResourcePlanner.Services.Enums.Enums;

namespace ResourcePlanner.Services.Controllers
{
    [RoutePrefix("api/Assignment")]
    public class AddAssignmentController : ApiController
    {
        [Authorize]
        [HttpPost]
        //[AuthorizationAttribute(new Permission[] { Permission.AssignResources })]
        [Route("add")]
        public async Task<IHttpActionResult> Add(string resourceIds, int projectMasterId, double hoursPerDay, DateTime startdate, DateTime enddate, string daysOfWeek)
        {
#if Mock
            return Ok();
#endif
            //var authAccess = new AuthDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
            //                                    Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            //var CurrentUser = User.Identity as ClaimsIdentity;
            //var EmailClaim = CurrentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Upn);
            //if (EmailClaim == null)
            //{
            //    return Unauthorized();
            //}
            //if (!authAccess.CheckAuth(EmailClaim.Value,"RM"))
            //{
            //    return Unauthorized();
            //}
             
            var access = new AddAssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));

            int days = 0;

            var daysOfWeekEnum = daysOfWeek.Split(',').Select(Int32.Parse).Select(i => (Enums.Enums.DayOfWeek)i).ToArray();

            if (daysOfWeekEnum.Length > 0)
            {
                days = getDaysAsInt(daysOfWeekEnum);
            }


            var daysOfWeekIds = daysOfWeek.Split(',').Select(Int32.Parse).Select(i => (Enums.Enums.DayOfWeek) i).ToArray();
           

            foreach(var id in daysOfWeekIds)
            {

            }
            

            var asgn = new AddAssignments()
            {
                ResourceIds = resourceIds.Split(',').Select(Int32.Parse).ToArray(),
                ProjectMasterId = projectMasterId,
                Hours = hoursPerDay,
                StartDate = startdate,
                EndDate = enddate,
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
        [Authorize]
        [HttpPost]
        //[AuthorizationAttribute(new Permission[] { Permission.AssignResources })]
        [Route("update")]
        public async Task<IHttpActionResult> Update(int resourceId, int projectMasterId, double hoursPerDay, DateTime startdate, DateTime enddate, string daysOfWeek)
        {
#if Mock
            return Ok();
#endif

            var access = new AddAssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));

            int days = 0;

            var daysOfWeekEnum = daysOfWeek.Split(',').Select(Int32.Parse).Select(i => (Enums.Enums.DayOfWeek)i).ToArray();

            if (daysOfWeekEnum.Length > 0)
            {
                days = getDaysAsInt(daysOfWeekEnum);
            }


            var asgn = new UpdateAssignment()
            {
                ResourceId = resourceId,
                ProjectMasterId = projectMasterId,
                Hours = hoursPerDay,
                StartDate = startdate,
                EndDate = enddate,
                DaysOfWeek = days
            };

            try
            {
                access.UpdateAssignment(asgn);
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
