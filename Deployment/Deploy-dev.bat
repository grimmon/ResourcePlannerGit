@ECHO OFF
REM A convenient wrapper for running the common resource group to the *Development* environment
@ECHO ON
powershell.exe -ExecutionPolicy bypass -file "deploy.ps1" -subscriptionId "eaf749d7-3ee4-4615-b4c1-865ee8928d05" -resourceGroupName "ResourcePlanner_Dev" -deploymentName "DevDeployment" -templateFilePath "template.json" -parametersFilePath "DEVparameters.json" -Verbose



 