using System;
using Microsoft.Azure.WebJobs;
using ResourcePlanner.Core.Utilities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;

namespace ResourcePlanner.WebJob
{
    class Program
    {
        static void Main(string[] args)
        {
            //   JobHost host = new JobHost();
            //   host.RunAndBlock();
            Run();
            Trace.WriteLine("Done!");
        }

        static void Run()
        {

            string srcConnString = ConfigurationManager.ConnectionStrings["InsightLEDB"].ConnectionString;
            //string srcConnString = ConfigurationManager.ConnectionStrings["LocalDB"].ConnectionString;
            string destConnString = ConfigurationManager.ConnectionStrings["ResourcePlanner"].ConnectionString;
            int timeout = Int32.Parse(ConfigurationManager.AppSettings["timeout"]);

            FillStageTables(srcConnString, destConnString, timeout);
            AddReferenceSets(destConnString, timeout);
            UpsertDB(destConnString, timeout);

            
        }

        public static void FillStageTables(string srcConnString, string destConnString, int timeout = 30)
        {
            FillStageTable(srcConnString, destConnString, ConfigurationManager.AppSettings["srcCustomer"], "stg.Customer", timeout);
            FillStageTable(srcConnString, destConnString, ConfigurationManager.AppSettings["srcTask"], "stg.Task", timeout);
            FillStageTable(srcConnString, destConnString, ConfigurationManager.AppSettings["srcEmployee"], "stg.Employee", timeout);
            FillStageTable(srcConnString, destConnString, ConfigurationManager.AppSettings["srcProject"], "stg.Project", timeout);
            FillStageTable(srcConnString, destConnString, ConfigurationManager.AppSettings["srcForeCastTimesheet"], "stg.ForeCastTimesheet", timeout, "where Date_Key > 20160101");
            FillStageTable(srcConnString, destConnString, ConfigurationManager.AppSettings["srcActualTimesheet"], "stg.ActualTimesheet", timeout, "where Date_Key > 20160101");
        }



        public static void FillStageTable(string srcConnString, string destConnString, string srcName, string destName, int timeout, string condition = "")
        {
            Stopwatch stopwatch = new Stopwatch();
 
            Trace.WriteLine("Pulling source table: " + srcName + "...");
            stopwatch.Start();
            DataTable source = AdoUtility.PullData(srcConnString, srcName, condition);
            Trace.WriteLine(srcName + " table successfully pulled from source (" + stopwatch.ElapsedMilliseconds + " ms).");
            stopwatch.Reset();

            Trace.WriteLine("Truncating stage table: " + destName + "...");
            stopwatch.Start();
            AdoUtility.ExecuteQuery(null, destConnString, 
                "TRUNCATE TABLE " + destName, 
                CommandType.Text, timeout, new SqlParameter[0]);
            Trace.WriteLine(destName + " successfully truncated (" + stopwatch.ElapsedMilliseconds + " ms).");
            stopwatch.Reset();

            Trace.WriteLine("Inserting source data into " + destName + "...");
            stopwatch.Start();
            AdoUtility.ExecuteBulkInsert(destConnString, source, destName, timeout);
            Trace.WriteLine("Successfully inserted data from " + srcName + " into staging table " + destName + "(" + stopwatch.ElapsedMilliseconds + " ms).");
            stopwatch.Reset();


        }


        public static void AddReferenceSets(string connString, int timeout)
        {

            RunSproc(connString, timeout, "rpdb.AddBillable", "Reference Code Set (Billable)");


            RunSproc(connString, timeout, "rpdb.AddCities", "Reference Code Set (Cities)");

            RunSproc(connString, timeout, "rpdb.AddCustomers", "Reference Code Set (Customers)");

            RunSproc(connString, timeout, "rpdb.AddMarkets", "Reference Code Set (Markets)");

            RunSproc(connString, timeout, "rpdb.AddOrgUnits", "Reference Code Set (Org Units)");

            RunSproc(connString, timeout, "rpdb.AddPositions", "Reference Code Set (Positions)");

            RunSproc(connString, timeout, "rpdb.AddPractices", "Reference Code Set (Practices)");

            RunSproc(connString, timeout, "rpdb.AddRegions", "Reference Code Set (Regions)");

        }


        public static void UpsertDB(string connString, int timeout)
        {
            
            RunSproc(connString, timeout, "rpdb.ResourceTransform", "Resource");
           
            RunSproc(connString, timeout, "rpdb.ProjectTransform", "Project");

            RunSproc(connString, timeout, "rpdb.BillableAssignmentTransform", "Assignments (Billable Forecast)");
           
            RunSproc(connString, timeout, "rpdb.NonBillableAssignmentTransform", "Assignments (Non-Billable Forecast)");
            
            RunSproc(connString, timeout, "rpdb.OTAssignmentTransform", "Assignments (OT Forecast)");
           
            RunSproc(connString, timeout, "rpdb.ActualAssignmentTransform", "Assignments (Actual)");
            
        }


        public static void RunSproc(string connString, int timeout, string sprocName, string objectName)
        {
            Stopwatch stopwatch = new Stopwatch();
            Trace.WriteLine("Upserting \"" + objectName +"\" Object.");
            stopwatch.Start();
            AdoUtility.ExecuteQuery(null, connString,
                sprocName,
                CommandType.StoredProcedure, timeout, new SqlParameter[0]);
            Trace.WriteLine("\"" + objectName + "\" object successfully upserted (" + stopwatch.ElapsedMilliseconds + " ms).");
            stopwatch.Reset();

        }


    }
}
