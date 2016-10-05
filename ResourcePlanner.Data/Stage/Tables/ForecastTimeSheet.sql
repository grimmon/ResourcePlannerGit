CREATE TABLE [Stage].[ForecastTimesheet](
	[ForecastTimesheet_Key] [int] NOT NULL,
	[Customer_Key] [int] NOT NULL,
	[Employee_Key] [int] NULL,
	[Employee_History_Key] [int] NULL,
	[Date_Key] [int] NOT NULL,
	[Project_Key] [int] NOT NULL,
	[Billable_Hours] [decimal](6, 2) NOT NULL,
	[Non_Billable_Hours] [decimal](6, 2) NOT NULL,
	[OT_Billable_Hours] [decimal](6, 2) NOT NULL,
	[Utilization_Target] [decimal](5, 2) NOT NULL,
	[Insert_Date] [datetime] NOT NULL,
	[Update_Date] [datetime] NOT NULL
) ON [PRIMARY]