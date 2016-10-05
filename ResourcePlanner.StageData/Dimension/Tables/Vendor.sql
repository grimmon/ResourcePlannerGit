CREATE TABLE [Dimension].[Vendor] (
    [Vendor_Key]    INT           NOT NULL,
    [Vendor_Code]   VARCHAR (20)  NOT NULL,
    [Vendor_Name]   VARCHAR (50)  NOT NULL,
    [Resource_Name] VARCHAR (100) NOT NULL,
    [Insert_Date]   DATETIME      NOT NULL,
    [Update_Date]   DATETIME      NULL,
    [PO_LineNumber] INT           NOT NULL
);

