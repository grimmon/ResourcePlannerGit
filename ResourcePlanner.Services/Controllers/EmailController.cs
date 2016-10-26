using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Web.Http;
using System.Threading.Tasks;
using SendGrid;
using ResourcePlanner.Services.Models;
using ResourcePlanner.Services.DataAccess;
using System.Configuration;
using System.Security.Principal;
using System.Security.Claims;

namespace ResourcePlanner.Services.Controllers
{
    public class EmailController : ApiController
    {
        [HttpGet]
        //[Authorize]
        public async Task<IHttpActionResult> Get(int ResourceId, string Project, DateTime StartDate, DateTime EndDate, double hours, int UserId = 0)
       
        {
            var access = new EmailDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                               Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            EmailRequestInfo info = new EmailRequestInfo();
            var emailMessage = new SendGridMessage();
            try
            {
                info = access.GetResourceManagerByResourceId(ResourceId, UserId);
                info.Project = Project;
                info.Hours = hours;
                info.StartDate = StartDate;
                info.EndDate = EndDate;
                emailMessage = GenerateEmail(info);
                var username = ConfigurationManager.AppSettings["SENDGRID_USERNAME"];
                var pswd = ConfigurationManager.AppSettings["SENDGRID_PASSWORD"];

                var credentials = new NetworkCredential(username, pswd);
                var transportWeb = new Web(credentials);
                await transportWeb.DeliverAsync(emailMessage);
            }
            catch (Exception ex)
            {
                throw;
            }


            

            return Ok();
        }

        private SendGridMessage GenerateEmail(EmailRequestInfo info)
        {
            var myMessage = new SendGridMessage();

            var CurrentUser = User.Identity as ClaimsIdentity;

            if (String.IsNullOrEmpty(info.UserEmail))
            {
                var EmailClaim = CurrentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Upn);
                if (EmailClaim == null)
                {
                    throw new Exception("No email for current user.");
                }
                info.UserEmail = EmailClaim.Value;

                var UserNameClaim = CurrentUser.Claims.FirstOrDefault(c => c.Type == "name");
                info.UserName = UserNameClaim.Value;
                if (String.IsNullOrEmpty(info.UserName))
                {
                    info.UserName = "<Unknown>";
                }
            }
            // Add the message properties.
            myMessage.From = new MailAddress("Do_Not_Reply_Resource_Request@insight.com");

            // Add multiple addresses to the To field.
            List<String> recipients = new List<String>
            {
                info.ResourceManagerEmail
            };

            myMessage.AddTo(recipients);

            myMessage.Subject = "Requesting Resource: " + info.ResourceName;

            //Add the HTML and Text bodies
            myMessage.Html =  "<p>Hello " + info.ResourceManagerFirstName + ",</p>"
                            + "<p> You are receiving this message because the user " + info.UserName 
                            + " has requested to assign a resource to a project via the <b>Insight Resource Planner</b>. Please review this request: </p>"
                            + "<p></p><p><b>   Resource</b>: " + info.ResourceName + " (" + info.ResourceEmail + ") </p>"
                            + "<p><b>   Project</b>: " + info.Project + "</p>"
                            + "<p><b>   Start Date</b>: " + info.StartDate.ToString("MMMM dd yyyy") + "</p>"
                            + "<p><b>   End Date</b>: " + info.EndDate.ToString("MMMM dd yyyy") + "</p>"
                            + "<p><b>   Hours</b>: " + info.Hours + "</p>"
                            +"<p></p><p>Please be in correspondence with the requestor " + info.UserName + " via email at " 
                            + info.UserEmail + ".</p> <p> Thanks and have a great day! </p>";

            return myMessage;
        }
    }
}
