CREATE TABLE dbConfig (version INTEGER NOT NULL DEFAULT 1);
CREATE TABLE User (email TEXT NOT NULL);
CREATE TABLE SiteConfig (email TEXT NOT NULL);
INSERT INTO dbConfig (version) VALUES (1);


CREATE TABLE `SchemaChangeLog` (
	`ID`	[int] IDENTITY ( 1 , 1 ) NOT NULL,
	`MajorReleaseNumber`	[varchar] ( 2 ) NOT NULL,
	`MinorReleaseNumber`	[varchar] ( 2 ) NOT NULL,
	`PointReleaseNumber`	[varchar] ( 4 ) NOT NULL,
	`ScriptName`	[varchar] ( 50 ) NOT NULL,
	`DateApplied`	[datetime] NOT NULL,
	CONSTRAINT `PK_SchemaChangeLog` PRIMARY KEY(`MajorReleaseNumber`,`MinorReleaseNumber`,`PointReleaseNumber`)
);

INSERT INTO [SchemaChangeLog]
       ([MajorReleaseNumber]
       ,[MinorReleaseNumber]
       ,[PointReleaseNumber]
       ,[ScriptName]
       ,[DateApplied])
VALUES
       ('01'
       ,'00'
       ,'0000'
       ,'initial install'
       ,GETDATE());