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
        //[Authorize]
        public async Task<IHttpActionResult> Get(int ResourceId, DateTime StartDate, DateTime EndDate, double hours, int UserId = 0)
        {
            var access = new EmailDataAccess(ConfigurationManager.ConnectionStrings["RPDBConnectionString"].ConnectionString,
                                               Int32.Parse(ConfigurationManager.AppSettings["DBTimeout"]));
            EmailRequestInfo info = new EmailRequestInfo();
            var emailMessage = new SendGridMessage();
            try
            {
                info = access.GetResourceManagerByResourceId(ResourceId, UserId);
                info.Hours = hours;
                emailMessage = GenerateEmail(info);
                var username = System.Environment.GetEnvironmentVariable("SENDGRID_USERNAME");
                var pswd = System.Environment.GetEnvironmentVariable("SENDGRID_PASSWORD");

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

                var UserNameClaim = CurrentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
                info.UserName = "<Unknown>";
                if (UserNameClaim == null)
                {
                    info.UserName = UserNameClaim.Value;
                }
            }
            // Add the message properties.
            myMessage.From = new MailAddress(info.UserEmail);

            // Add multiple addresses to the To field.
            List<String> recipients = new List<String>
            {
                info.ResourceManagerEmail
            };

            myMessage.AddTo(recipients);

            myMessage.Subject = "Requesting Resource: " + info.ResourceName;

            //Add the HTML and Text bodies
            myMessage.Html = "<p>Hello " + info.ResourceManagerFirstName + ",</p>"
                            +"<p> You are receiving this message because " + info.UserName + " has requested to schedule resource"
                            +info.ResourceName + " (" + info.ResourceEmail + ") for " + info.Hours + " hours between "
                            +info.StartDate.ToString("MMM dd yyyy") + " and " + info.EndDate.ToString("MMM dd yyyy") +".</p>"
                            +"<p> Please be in correspondence with requestor " + info.UserName + " via email at " 
                            + info.UserEmail + ".</p> <p> Thanks and have a great day! </p>";

            return myMessage;
        }
    }
}
