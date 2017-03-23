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
    public class AssignmentController : ApiController
    {
        [Authorize]
        [HttpPost]
        //[AuthorizationAttribute(new Permission[] { Permission.AssignResources })]
        [Route("add")]
        public async Task<IHttpActionResult> Add(
            string resourceIds, 
            int projectMasterId, 
            DateTime startdate, 
            DateTime enddate, 
            double? hoursPerWeek = null, 
            double? sundayHours = null,
            double? mondayHours = null,
            double? tuesdayHours = null,
            double? wednesdayHours = null,
            double? thursdayHours = null,
            double? fridayHours = null,
            double? saturdayHours = null)
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
             
            var access = new AssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));

            var asgn = new AddAssignments()
            {
                ResourceIds = resourceIds.Split(',').Select(Int32.Parse).ToArray(),
                ProjectMasterId = projectMasterId,
                StartDate = startdate,
                EndDate = enddate,
            };

            if (hoursPerWeek.HasValue)
            {
                asgn.TotalHours = hoursPerWeek.Value;
                asgn.SundayHours = null;
                asgn.MondayHours = null;
                asgn.TuesdayHours = null;
                asgn.WednesdayHours = null;
                asgn.ThursdayHours = null;
                asgn.FridayHours = null;
                asgn.SaturdayHours = null;
            }
            else
            {
                asgn.SundayHours = sundayHours;
                asgn.MondayHours = mondayHours;
                asgn.TuesdayHours = tuesdayHours;
                asgn.WednesdayHours = wednesdayHours;
                asgn.ThursdayHours = thursdayHours;
                asgn.FridayHours = fridayHours;
                asgn.SaturdayHours = saturdayHours;
            }

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
        public async Task<IHttpActionResult> Update(
            int resourceId, 
            int projectMasterId, 
            DateTime startdate,
            double? hoursPerWeek = null,
            double? sundayHours = null,
            double? mondayHours = null,
            double? tuesdayHours = null,
            double? wednesdayHours = null,
            double? thursdayHours = null,
            double? fridayHours = null,
            double? saturdayHours = null)
        {
#if Mock
            return Ok();
#endif

            var access = new AssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));

            var asgn = new UpdateAssignment()
            {
                ResourceId = resourceId,
                ProjectMasterId = projectMasterId,
                StartDate = startdate,
            };

            if (hoursPerWeek.HasValue)
            {
                asgn.TotalHours = hoursPerWeek.Value;
                asgn.SundayHours = null;
                asgn.MondayHours = null;
                asgn.TuesdayHours = null;
                asgn.WednesdayHours = null;
                asgn.ThursdayHours = null;
                asgn.FridayHours = null;
                asgn.SaturdayHours = null;
            }
            else
            {
                asgn.SundayHours = sundayHours;
                asgn.MondayHours = mondayHours;
                asgn.TuesdayHours = tuesdayHours;
                asgn.WednesdayHours = wednesdayHours;
                asgn.ThursdayHours = thursdayHours;
                asgn.FridayHours = fridayHours;
                asgn.SaturdayHours = saturdayHours;
            }
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

        [Authorize]
        [HttpGet]
        //[AuthorizationAttribute(new Permission[] { Permission.AssignResources })]
        [Route("get")]
        public async Task<IHttpActionResult> Get(
           int resourceId,
           int projectMasterId,
           DateTime date
        )
        {
#if Mock
            return Ok();
#endif

            var access = new AssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                                Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            var result = new GetAssignment();

            try
            {
                result = access.GetAssignment(resourceId, projectMasterId, date);
            }
            catch (Exception ex)
            {
                throw;
            }

            return Ok(result);
        }

        //[Authorize]
        [HttpDelete]
        [Route("delete")]
        public async Task<IHttpActionResult> Delete(
            int resourceId,
            int projectMasterId
        )
        {
#if Mock
            return Ok()
#endif
            var access = new AssignmentDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                              Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));

            var asgn = new DeleteAssignment()
            {
                ResourceId = resourceId,
                ProjectMasterId = projectMasterId
            };

            try
            {
                access.DeleteAssignment(asgn);
            }catch (Exception ex)
            {
                throw;
            }

            return Ok();
        }
    }
}
