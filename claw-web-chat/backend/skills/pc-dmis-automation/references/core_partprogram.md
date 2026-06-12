# PC-DMIS Reference: Core Partprogram

## PartProgram

# PartProgram Object

# Description

# Object Model

# See Also

PartProgram Members

The **PartProgram** object represents a measurement routine currently available in PC-DMIS. This is the main object used to manipulate measurement routines.

| PartProgram Object |

# PartProgram Object Members

# Public Methods

# Public Properties

# Events

# See Also

This subroutine saves, closes, and deactivates the measurement routine.

This function exports CAD or part data from the measurement routine to the indicated file. The export format is determined by the file name extension ofN*ame.*

This exports the measurement routine as an XML file.

This returns a list of either schema numbers or version names available to theSaveAs3method.

This function imports CAD or part data from the indicated file to the measurement routine. The file format is determined by the file name extension ofN*ame.*

A .planxml file contains a measurement plan created from the Planner application. This is an xml file. You can import measurement plans into the measurement routine using this method.

This imports a measurement routine in an XML format into the current measurement routine.

Returns TRUE if the current loaded probe in a measurement routine is an analog probe; it returns FALSE otherwise. If you have multiple probe types defined for a measurement routine, the return value will depend, of course, on the location of the insertion point in the measurement routine.

This function uses the PC-DMIS message box function. It includes all functionality including cancelling of execution tied to the Cancel button.

This subroutine closes and deactivates the measurement routine without saving.

This executes the measurement routine using point data collected from a journal file.

This subroutine saves the measurement routine. If the measurement routine hasn<u>otb</u>een saved before, it opens aSav*e As Dialog boxwhi*ch requires that you name the file.

This lets you save the measurement routine with a new name or in a new file location.

This method lets you save the measurement routine with a new name or in a new file location. It differs from theSaveAsmethod by letting you save the CAD file as a reference.

This method lets you save the measurement routine with a new name or in a new file location. It differs from theSaveAsmethod by letting you specify the version name or schema number and by saving the CAD file as a reference.

This method waits until the specifiedC*ommando*bject executes, or until Timeout seconds pass.

Returns TRUE if the measurement routine is on the master computer but is running as the slave measurement routine. Returns FALSE otherwise.

Returns a single string containing all the text of the entire Edit window as seen in the Edit window's command mode. Read only.

Returns TRUE if, during measurement routine execution, the execution is cancelled. Otherwise it returns FALSE. The default value is FALSE.

Returns the measurement routine’s full file path and name.

Returns the measurement routine’s file name.

Returns this measurement routine’sO**ldBasico**bject. The OldBasic object contains all of the methods from the old basic command set used in previous versions of PC-DMIS.

When you generate a saved output file using automatic indexing with the Edit window PRINT/AUTO command, PC-DMIS uses an index value as a base. It then it increments the index if there's a duplicate file name in the same directory so that you end up with a unique file name.

This property lets you get or set the index value stored in the part program.

When you generate a saved output file with the Edit window PRINT Command, PC-DMIS stores that file in a directory of your choice.

This property returns a string of the file name used by the part program.

Returns the measurement routine’s file path.

Represents the measurement routine’s visibility status.

This event gets launched when the specifiedC*ommandg*ets added to the measurement routine.

This event gets launched when PC-DMIS finishes executing the measurement routine. PC-DMIS determines it has finished execution based on the terminationt*ype.*

This event gets launched when theE**xecution Mode Optionsdi**alog box displaysErr*orMsg.*

This event gets launched when theE**xecution Mode Optionsdi**alog box displaysSta*tusMsg.*

This event gets launched immediately before the specifiedC*ommandg*ets executed.

This event gets launched immediately before the specifiedC*ommandg*ets executed on a specifiedArm*of *a multiple arm system.

This event gets launched immediately after the specifiedC*ommandg*ets executed.

This event gets launched immediately after the specifiedC*ommandg*ets executed on a specifiedArm*of *a multiple arm system.

For information, see theOnReportPrintStartevent from theApplicationObjectEventsobject. It's the same.

This event is also provided here as a convenience.

For information, see theOnReportPrintStartevent from theApplicationObjectEventsobject. It's the same.

This event is also provided here as a convenience.

PartProgram Object

**Activate Makes measurement routine the active measurement routine AsyncExecute This function starts execution of the measurement routine and then returns immediately, allowing for asynchronous execution. AutoCreateGroupsForBMWMessPrograms Converts BMWMess programs into groups CalcAdjustTransform Calculates part adjustment transformation in machine coordinates ClearAllTADs Clears the persistent User Assigned Properties data for all reports ClearExecutionBlock This clears the start and end commands set by the SetExecutionBlock method. ClearExecutionMarkedSet Clears the User Marked Set for execution set by SetExecutionMarkedSet ClearTADs Clears the persistent User Assigned Properties data for the current report ClearVerifyFeaturesFlag Clear the VerifyFeatures Flag Close This subroutine saves, closes, and deactivates the measurement routine. CopyAutoFeatureInspectionPlannerSettingsIntoRegistryDefaultSettings This method accesses the .ipd file that is specified in the P**arameters File **registry entry under the P**lanner s**ection of the PC-DMIS Settings Editor. It then copies any inspection planner settings for auto features contained in that file and sets the equivalent PC-DMIS default registry entries to those settings. CreateGuessWithDimension Tries to guess what command was measured and applies the appropriate dimension to it DmisOut This function outputs DMIS results to a file. DmisOut2 Outputs DMIS results to a file; option for output last instance only DoAutoInsertMoves This method can take two parameters, a start command and an end command. These define a range of commands. The method then adds MOVE/POINT commands between each feature command within this range. If you don't specify a start or end command then the range includes all the features in the measurement routine. DoCollisionDetectPath This method can take two parameters, a start command and an end command. These define a range of commands. The method then performs a collision detection check for all features within this range. If you don't specify a start or end command then the range includes all the features in the measurement routine. DoMappedImport Import And Mapping DoStandardImportAndResetSensorMapping Do Standard Import and reset SensorMapping EditReferredCo*mmandsW*arningMessage Edit Warning Message for Features To be Deleted EditRulesFile Edits basic script rules file for default parameter managment (Inspection Planner) EXECUTE This function executes the measurement routine. ExecuteMiniRoutineByNa**me *T*his method executes a mini routine based on the mini routine's name. ExecuteMiniRoutineByNameArray This method executes multiple mini routines contained within an array of strings. Each item in the array is a mini routine name. ExecuteMiniRoutineByUID This method executes a mini routine based on the mini routine's UID (unique ID). ExecuteMiniRoutineByUIDArray This method executes multiple mini routines contained within an array of strings. Each item in the array is a UID (unique ID). Export This function exports CAD or part data from the measurement routine to the indicated file. The export format is determined by the file name extension of Name . ExportDataToXML Exports complete data dictionary to an XML file ExportToXML This exports the measurement routine as an XML file. ExternalCommandEvent ExternalCommandEvent GetAvailableSchemasForSaveAs This returns a list of either schema numbers or version names available to the SaveAs3 method. GetExecutionMarkedSetIndex Returns the current User Marked Set Index for execution set by SetExecutionMarkedSet. -1 means No Marked Set GetExecutionWindow Returns object pointer to the Execution Window for the specified arm if available GetMarkedSetName Retrieve the Name of the User Marked Set identified by the index. Returns FALSE if the marked set is not <u>def</u>ined GetMarkedSetNumbers Returns the max munber of allowed marked set and the number of marked set currently defined GetReadoutWindow Read Only: Returns object pointer to Readout Window GetStringArray Creates an array of strings. GetVariableValue *This *method returns a variable object specified by the string in VarNa*me . Gu*ess Tries to guess what command has just been measured IgnoreLearnModeHits IgnoreLearnModeHits Import This function imports CAD or part data from the indicated file to the measurement routine. The file format is determined by the file name extension of Name . Import2 Imports from another format into the measurement routine. The parameter indicates if the input should be merged ImportPlanxml A .planxml file contains a measurement plan created from the Planner application. This is an xml file. You can import measurement plans into the measurement routine using this method. ImportPlanxmlIntoExisting Import Planxml into existing command in Part Program ImportQuickFeaturesDefaults Import Quick Features Defaults From ConfigServer To PcDmis Registry ImportUGDCI ImportUGDCI ImportUGDCI2 ImportUGDCI2. The parameter indicates if the input should be merged ImportXML This imports a measurement routine in an XML format into the current measurement routine. InjectRepositoryInfo Inject Repository Info IsProbeAnalog Returns TRUE if the current loaded probe in a measurement routine is an analog probe; it returns FALSE otherwise. If you have multiple probe types defined for a measurement routine, the return value will depend, of course, on the location of the insertion point in the measurement routine. LoadLayout The LoadLayout method loads a customized PC-DMIS user-interface layout as if it were selected from the Windo**ws Layout toolb**ar inside PC-DMIS. Also, if a layout has been created and moved to a different directory, you can access it by specifying the absolute or relative file name. For information on using this toolbar, see the "Using Toolbars" section inside your PC-DMIS Help File. MessageBox This function uses the PC-DMIS message box function. It includes all functionality including cancelling of execution tied to the Cancel button. OverrideExecuteSpeed Overrides the current execution speed Quit This subroutine closes and deactivates the measurement routine without saving. ReadMSEXml Read MSE Xml RefreshPart Refreshes the display of the Part in the Edit window and in the CAD window. RemoveLastLearnHit Removes the last learn-mode hit RunJournalFile This executes the measurement routine using point data collected from a journal file. Save This subroutine saves the measurement routine. If the measurement routine has not been saved before, it opens a Save *As Dialog box whic*h requires that you name the file. SaveAs This lets you save the measurement routine with a new name or in a new file location. SaveAs2 This method lets you save the measurement routine with a new name or in a new file location. It differs from the SaveAs method by letting you save the CAD file as a reference. SaveAs3 This method lets you save the measurement routine with a new name or in a new file location. It differs from the SaveAs method by letting you specify the version name or schema number and by saving the CAD file as a reference. SetCadEqualPart Set Cad equals Part SetExecutionBlock This method defines a block of commands to execute. Calls are made to the Execute or AsyncExecute functions until the execution block is cleared with the ClearExecutionBlock method. SetExecutionMarkedSet Sets the User Marked Set for execution, calls to Execute or AsyncExecute will used until cleared. Returns false if requested marked set does not exist SetIPPlanVersion Set IP Plan Version SetupFeatureBasedMeasurement This method calls a text file as a string. The XML content in the text file defines the features or dimensions you want to use for feature based measurement. Based on the contents of the XML, PC-DMIS can marks those commands, and any dependent commands. SetVariableValue This method sets the value defined in Value for the variable specified by the string in VarName. *SetVerify*FeaturesFlag Set the VerifyFeatures Flag ToggleMasterSlaveMode Enters/Exits Master-Slave Mode WaitUntilExecuted This method waits until the specified Command object executes, or until Timeout seconds pass.

_Name ActiveMach**ine Ret**urns the Machine object associated with this measurement routine. Appl**ication Rep**resents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. For example, the ActivePar**tProgram pr**operty returns a PartProgram object. BundledStations Read Only: Returns object pointer Bundled Station collection CadModel Read Only: Returns Cad Model Object CadWin**dows Retur**ns the CadWindows object associated with this measurement routine. Comman**ds Retur**ns the Commands collection object of this measurement routine. ConnectedInDriveMode Read Only: Returns true when computer connected as driving computer ConnectedInRelayMode Read Only: Returns true when computer connected as relay computer ConnectedToMaster Returns TRUE if the measurement routine is on the master computer but is running as the slave measurement routine. Returns FALSE otherwise. ConnectedToSlave Returns TRUE if the measurement routine is on the slave computer but is running as the master measurement routine. Returns FALSE otherwise. CurrentArm This read/write property returns or sets the active arm when using PC-DMIS in multiple arm mode. CurrentProbeName Read: Returns the Name of current probe file EditWindow Returns the Editwin**dow object** associated with this measurement routine. EditWindowTextAll Returns a single string containing all the text of the entire Edit window as seen in the Edit window's command mode. Read only. ExcelFileIndex Read/Write: Get/Set the current excel output file index ExcelFileMethod Read/Write: Get/Set the current excel output file method ExcelFileName Read/Write: Get/Set the current excel output file name ExecOptContinueButtonVisible Read/Write: Property indicating if Continue button is set visible on new Execution Options Dialogs ExecOptJumpButtonVisible Read/Write: Property indicating if Jump button is set visible on new Execution Options Dialogs ExecOptSkipButtonVisible Read/Write: Property indicating if Skip button is set visible on new Execution Options Dialogs ExecOptStopButtonVisible Read/Write: Property indicating if Stop button is set visible on new Execution Options Dialogs Executed**Commands The Exe**cutedCommands property returns the ExecutedCommands object. This object contains a collection class of those commands last executed for the current measurement routine. ExecuteDialogVisible Read/Write: Gives status / makes execute dialog visible or hidden ExecutionWasCancelled Returns TRUE if, during measurement routine execution, the execution is cancelled. Otherwise it returns FALSE. The default value is FALSE. FullName Returns the measurement routine’s full file path and name. IsModified Read Only: Returns the information as the part program / measurement routine has been modified LaserSequentialExecution Read/Write: Returns/Sets laser only sequential part program execution mode LIVWindow Read Only: Returns object pointer of type LIVWindow MarkChildMode This enables or disables the Child Mode for Edit window Markings. If enabled and something is marked, any children commands related to the parent command is also marked. MarkNewAlignmentMode This property enables or disables the New Alignment Mode menu option in PC-DMIS and by doing so it determines whether or not the alignment associated with marked feature or dimensions is also marked for execution. MarkParentMode This enables or disables the Parent Mode for Edit window Markings. If enabled and something is marked, any parent commands related to the child command is also marked. MasterSlaveDlg This returns a read-only pointer to the Multiple** Arm Calibration dialog **box, opening the dialog box if necessary. Name Returns the measurement routine’s file name. NoActiveProbesObj****ect **Re**ad: Property indicating no Probes object are instantiated OldBasic **Returns **this measurement routine’s OldBasic object. The OldBasic object contains all of the methods from the old basic command set used in previous versions of PC-DMIS. OptimizePath Once you have the pointer you can use properties and methods from that object to perform path optimizations. OutputFileIndex When you generate a saved output file using automatic indexing with the Edit window PRINT/AUTO command, PC-DMIS uses an index value as a base. It then it increments the index if there's a duplicate file name in the same directory so that you end up with a unique file name. This property lets you get or set the index value stored in the part program. OutputFileName When you generate a saved output file with the Edit window PRINT Command, PC-DMIS stores that file in a directory of your choice. This property returns a string of the file name used by the part program. Parent Returns the PartProg**rams collect**ion object to which this measurement routine belongs. PartGuid Returns a string with the part's GUID (Globally Unique Identifier). PartName Represents the part name of the measurement routine. PartProgramSettings Read Only: Returns object pointer to PartProgramSettings Object Path Returns the measurement routine’s file path. Probes The Probes property returns this measurement routine’s Probes collection object. ProbeToolBoxPages Read Only: Returns the IProbeToolBoxPages Object ProgramVersionName Read Only: Property indicating the version name the measurement routine has been saved to ProgramVersionSchema Read Only: Property indicating the schema number the measurement routine has been saved to QuickStart Read Only: Returns object pointer to QuickStart Object ReadoutEnabled Read/Write: Property indicating whether to send or not readout events ReportWindow Read Only: Returns object pointer of type ReportWindow RevisionNumber Represents the measurement routine’s revision number. RoutineExecutionTimeManager Read Only: Returns the RoutineExecutionTimeManager Object SerialNumber Represents the measurement routine’s serial number. ShowAllIDs Read/Write: Property indicating whether to show all IDs in the CAD Window Speed Read Only: Returns Execution speed (0 if not executing) StatsCount Returns or sets the stats count for the current measurement routine. Read/Write Long . Tools Th**e To**ols** prop**erty returns this measurement routine’s Tools collection object. Units Returns the measurement unit type used in the measurement routine. Either inches or millimeters. Visible Represents the measurement routine’s visibility status.

OnAddCollisionDetected Event fired when collision detected OnAddObject This event gets launched when the specified C*****omm*a*n*d* *gets added to the measurement routine. OnEndCollisionDetect Event fired when collision detect ends OnEndExecution This event gets launched when PC-DMIS finishes executing the measurement routine. PC-DMIS determines it has finished execution based on the termination t*ype. *OnExecuteDialogEr*rorMsg T*his event gets launched when the E****xecution Mode Options** d**ialog box displays ErrorMsg . OnExecuteDialogSt*atusMsg T*his event gets launched when the Execution Mode Options dialog box displays StatusMsg . OnGuess Event fired when PC-DMIS guesses the feature being measured OnObjectAboutToExecute This event gets launched immediately before the specified Command gets executed. OnObjectAboutToExecute2 This event gets launched immediately before the specified Command gets executed on a specified A**rm* *of a multiple arm system. OnObjectExecuted This event gets launched immediately after the specified Command gets executed. OnObjectExecuted2 This event gets launched immediately after the specified Command gets executed on a specified Arm of a multiple arm system. OnReportPrintEnd For information, see the OnReportPrintStart event from the ApplicationObjectEvents object. It's the same. This event is also provided here as a convenience. OnReportPrintStart For information, see the OnReportPrintStart event from the ApplicationObjectEvents object. It's the same. This event is also provided here as a convenience. OnStartCollisionDetect Event fired when collision detect begins OnStartExecution Event fired when measurement routine execution begins

| PartProgram ObjectMembers |

| Activate | Makes measurement routine the active measurement routine |
| AsyncExecute | This function starts execution of the measurement routine and then returns immediately, allowing for asynchronous execution. |
| AutoCreateGroupsForBMWMessPrograms | Converts BMWMess programs into groups |
| CalcAdjustTransform | Calculates part adjustment transformation in machine coordinates |
| ClearAllTADs | Clears the persistent User Assigned Properties data for all reports |
| ClearExecutionBlock | This clears the start and end commands set by the SetExecutionBlock method. |
| ClearExecutionMarkedSet | Clears the User Marked Set for execution set by SetExecutionMarkedSet |
| ClearTADs | Clears the persistent User Assigned Properties data for the current report |
| ClearVerifyFeaturesFlag | Clear the VerifyFeatures Flag |
| Close | This subroutine saves, closes, and deactivates the measurement routine. |
| CopyAutoFeatureInspectionPlannerSettingsIntoRegistryDefaultSettings | This method accesses the .ipd file that is specified in theParameters Fileregistry entry under thePlannersection of the PC-DMIS Settings Editor. It then copies any inspection planner settings for auto features contained in that file and sets the equivalent PC-DMIS default registry entries to those settings. |
| CreateGuessWithDimension | Tries to guess what command was measured and applies the appropriate dimension to it |
| DmisOut | This function outputs DMIS results to a file. |
| DmisOut2 | Outputs DMIS results to a file; option for output last instance only |
| DoAutoInsertMoves | This method can take two parameters, a start command and an end command. These define a range of commands. The method then adds MOVE/POINT commands between each feature command within this range. If you don't specify a start or end command then the range includes all the features in the measurement routine. |
| DoCollisionDetectPath | This method can take two parameters, a start command and an end command. These define a range of commands. The method then performs a collision detection check for all features within this range. If you don't specify a start or end command then the range includes all the features in the measurement routine. |
| DoMappedImport | Import And Mapping |
| DoStandardImportAndResetSensorMapping | Do Standard Import and reset SensorMapping |
| EditReferredCommandsWarningMessage | Edit Warning Message for Features To be Deleted |
| EditRulesFile | Edits basic script rules file for default parameter managment (Inspection Planner) |
| EXECUTE | This function executes the measurement routine. |
| ExecuteMiniRoutineByName | This method executes a mini routine based on the mini routine's name. |
| ExecuteMiniRoutineByNameArray | This method executes multiple mini routines contained within an array of strings. Each item in the array is a mini routine name. |
| ExecuteMiniRoutineByUID | This method executes a mini routine based on the mini routine's UID (unique ID). |
| ExecuteMiniRoutineByUIDArray | This method executes multiple mini routines contained within an array of strings. Each item in the array is a UID (unique ID). |
| Export | This function exports CAD or part data from the measurement routine to the indicated file. The export format is determined by the file name extension ofName. |
| ExportDataToXML | Exports complete data dictionary to an XML file |
| ExportToXML | This exports the measurement routine as an XML file. |
| ExternalCommandEvent | ExternalCommandEvent |
| GetAvailableSchemasForSaveAs | This returns a list of either schema numbers or version names available to theSaveAs3method. |
| GetExecutionMarkedSetIndex | Returns the current User Marked Set Index for execution set by SetExecutionMarkedSet. -1 means No Marked Set |
| GetExecutionWindow | Returns object pointer to the Execution Window for the specified arm if available |
| GetMarkedSetName | Retrieve the Name of the User Marked Set identified by the index. Returns FALSE if the marked set is not defined |
| GetMarkedSetNumbers | Returns the max munber of allowed marked set and the number of marked set currently defined |
| GetReadoutWindow | Read Only:  Returns object pointer to Readout Window |
| GetStringArray | Creates an array of strings. |
| GetVariableValue | This method returns a variable object specified by the string inVarName. |
| Guess | Tries to guess what command has just been measured |
| IgnoreLearnModeHits | IgnoreLearnModeHits |
| Import | This function imports CAD or part data from the indicated file to the measurement routine. The file format is determined by the file name extension ofName. |
| Import2 | Imports from another format into the measurement routine. The parameterindicates if the input should be merged |
| ImportPlanxml | A .planxml file contains a measurement plan created from the Planner application. This is an xml file. You can import measurement plans into the measurement routine using this method. |
| ImportPlanxmlIntoExisting | Import Planxml into existing command in Part Program |
| ImportQuickFeaturesDefaults | Import Quick Features Defaults From ConfigServer To PcDmis Registry |
| ImportUGDCI | ImportUGDCI |
| ImportUGDCI2 | ImportUGDCI2. The parameterindicates if the input should be merged |
| ImportXML | This imports a measurement routine in an XML format into the current measurement routine. |
| InjectRepositoryInfo | Inject Repository Info |
| IsProbeAnalog | Returns TRUE if the current loaded probe in a measurement routine is an analog probe; it returns FALSE otherwise. If you have multiple probe types defined for a measurement routine, the return value will depend, of course, on the location of the insertion point in the measurement routine. |
| LoadLayout | The LoadLayout method loads a customized PC-DMIS user-interface layout as if it were selected from theWindows Layouttoolbar inside PC-DMIS. Also, if a layout has been created and moved to a different directory, you can access it by specifying the absolute or relative file name. For information on using this toolbar, see the "Using Toolbars"sectioninside yourPC-DMIS Help File. |
| MessageBox | This function uses the PC-DMIS message box function. It includes all functionality including cancelling of execution tied to the Cancel button. |
| OverrideExecuteSpeed | Overrides the current execution speed |
| Quit | This subroutine closes and deactivates the measurement routine without saving. |
| ReadMSEXml | Read MSE Xml |
| RefreshPart | Refreshes the display of the Part in the Edit window and in the CAD window. |
| RemoveLastLearnHit | Removes the last learn-mode hit |
| RunJournalFile | This executes the measurement routine using point data collected from a journal file. |
| Save | This subroutine saves the measurement routine. If the measurement routine hasnotbeen saved before, it opens aSave As Dialog boxwhich requires that you name the file. |
| SaveAs | This lets you save the measurement routine with a new name or in a new file location. |
| SaveAs2 | This method lets you save the measurement routine with a new name or in a new file location. It differs from theSaveAsmethod by letting you save the CAD file as a reference. |
| SaveAs3 | This method lets you save the measurement routine with a new name or in a new file location. It differs from theSaveAsmethod by letting you specify the version name or schema number and by saving the CAD file as a reference. |
| SetCadEqualPart | Set Cad equals Part |
| SetExecutionBlock | This method defines a block of commands to execute. Calls are made to the Execute or AsyncExecute functions until the execution block is cleared with the ClearExecutionBlock method. |
| SetExecutionMarkedSet | Sets the User Marked Set for execution, calls to Execute or AsyncExecute will used until cleared. Returns false if requested marked set does not exist |
| SetIPPlanVersion | Set IP Plan Version |
| SetupFeatureBasedMeasurement | This method calls a text file as a string. The XML content in the text file defines the features or dimensions you want to use for feature based measurement. Based on the contents of the XML, PC-DMIS can marks those commands, and any dependent commands. |
| SetVariableValue | This method sets the value defined inValuefor the variable specified by the string inVarName. |
| SetVerifyFeaturesFlag | Set the VerifyFeatures Flag |
| ToggleMasterSlaveMode | Enters/Exits Master-Slave Mode |
| WaitUntilExecuted | This method waits until the specifiedCommandobject executes, or until Timeout seconds pass. |

| _Name | ActiveMachine | Returns theMachineobject associated with this measurement routine. |
| Application | Represents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects. For example, the ActivePartProgram property returns aPartProgramobject. |
| BundledStations | Read Only:  Returns object pointer Bundled Station collection |
| CadModel | Read Only:  Returns Cad Model Object |
| CadWindows | Returns theCadWindowsobject associated with this measurement routine. |
| Commands | Returns theCommandscollection object of this measurement routine. |
| ConnectedInDriveMode | Read Only:  Returns true when computer connected as driving computer |
| ConnectedInRelayMode | Read Only:  Returns true when computer connected as relay computer |
| ConnectedToMaster | Returns TRUE if the measurement routine is on the master computer but is running as the slave measurement routine. Returns FALSE otherwise. |
| ConnectedToSlave | Returns TRUE if the measurement routine is on the slave computer but is running as the master measurement routine. Returns FALSE otherwise. |
| CurrentArm | This read/write property returns or sets the active arm when using PC-DMIS in multiple arm mode. |
| CurrentProbeName | Read: Returns the Name of current probe file |
| EditWindow | Returns theEditwindowobject associated with this measurement routine. |
| EditWindowTextAll | Returns a single string containing all the text of the entire Edit window as seen in the Edit window's command mode. Read only. |
| ExcelFileIndex | Read/Write: Get/Set the current excel output file index |
| ExcelFileMethod | Read/Write: Get/Set the current excel output file method |
| ExcelFileName | Read/Write: Get/Set the current excel output file name |
| ExecOptContinueButtonVisible | Read/Write: Property indicating if Continue button is set visible on new Execution Options Dialogs |
| ExecOptJumpButtonVisible | Read/Write: Property indicating if Jump button is set visible on new Execution Options Dialogs |
| ExecOptSkipButtonVisible | Read/Write: Property indicating if Skip button is set visible on new Execution Options Dialogs |
| ExecOptStopButtonVisible | Read/Write: Property indicating if Stop button is set visible on new Execution Options Dialogs |
| ExecutedCommands | The ExecutedCommands property returns theExecutedCommandsobject. This object contains a collection class of those commands last executed for the current measurement routine. |
| ExecuteDialogVisible | Read/Write: Gives status / makes execute dialog visible or hidden |
| ExecutionWasCancelled | Returns TRUE if, during measurement routine execution, the execution is cancelled. Otherwise it returns FALSE. The default value is FALSE. |
| FullName | Returns the measurement routine’s full file path and name. |
| IsModified | Read Only: Returns the information as the part program / measurement routine has been modified |
| LaserSequentialExecution | Read/Write: Returns/Sets laser only sequential part program execution mode |
| LIVWindow | Read Only:  Returns object pointer of type LIVWindow |
| MarkChildMode | This enables or disables the Child Mode for Edit window Markings. If enabled and something is marked, any children commands related to the parent command is also marked. |
| MarkNewAlignmentMode | This property enables or disables the New Alignment Mode menu option in PC-DMIS and by doing so it determines whether or not the alignment associated with marked feature or dimensions is also marked for execution. |
| MarkParentMode | This enables or disables the Parent Mode for Edit window Markings. If enabled and something is marked, any parent commands related to the child command is also marked. |
| MasterSlaveDlg | This returns a read-only pointer to theMultiple Arm Calibrationdialog box, opening the dialog box if necessary. |
| Name | Returns the measurement routine’s file name. |
| NoActiveProbesObject | Read: Property indicating no Probes object are instantiated |
| OldBasic | Returns this measurement routine’sOldBasicobject. The OldBasic object contains all of the methods from the old basic command set used in previous versions of PC-DMIS. |
| OptimizePath | Once you have the pointer you can use properties and methods from that object to perform path optimizations. |
| OutputFileIndex | When you generate a saved output file using automatic indexing with the Edit window PRINT/AUTO command, PC-DMIS uses an index value as a base. It then it increments the index if there's a duplicate file name in the same directory so that you end up with a unique file name.This property lets you get or set the index value stored in the part program. |
| OutputFileName | When you generate a saved output file with the Edit window PRINT Command, PC-DMIS stores that file in a directory of your choice.This property returns a string of the file name used by the part program. |
| Parent | Returns thePartProgramscollection object to which this measurement routine belongs. |
| PartGuid | Returns a string with the part's GUID (Globally Unique Identifier). |
| PartName | Represents the part name of the measurement routine. |
| PartProgramSettings | Read Only:  Returns object pointer to PartProgramSettings Object |
| Path | Returns the measurement routine’s file path. |
| Probes | TheProbesproperty returns this measurement routine’sProbescollection object. |
| ProbeToolBoxPages | Read Only:  Returns the IProbeToolBoxPages Object |
| ProgramVersionName | Read Only: Property indicating the version name the measurement routine has been saved to |
| ProgramVersionSchema | Read Only: Property indicating the schema number the measurement routine has been saved to |
| QuickStart | Read Only:  Returns object pointer to QuickStart Object |
| ReadoutEnabled | Read/Write: Property indicating whether to send or not readout events |
| ReportWindow | Read Only:  Returns object pointer of type ReportWindow |
| RevisionNumber | Represents the measurement routine’s revision number. |
| RoutineExecutionTimeManager | Read Only:  Returns the RoutineExecutionTimeManager Object |
| SerialNumber | Represents the measurement routine’s serial number. |
| ShowAllIDs | Read/Write: Property indicating whether to show all IDs in the CAD Window |
| Speed | Read Only:  Returns Execution speed (0 if not executing) |
| StatsCount | Returns or sets the stats count for the current measurement routine. Read/WriteLong. |
| Tools | The Tools property returns this measurement routine’sToolscollection object. |
| Units | Returns the measurement unit type used in the measurement routine. Either inches or millimeters. |
| Visible | Represents the measurement routine’s visibility status. |

| OnAddCollisionDetected | Event fired when collision detected |
| OnAddObject | This event gets launched when the specifiedCommandgets added to the measurement routine. |
| OnEndCollisionDetect | Event fired when collision detect ends |
| OnEndExecution | This event gets launched when PC-DMIS finishes executing the measurement routine. PC-DMIS determines it has finished execution based on the terminationtype. |
| OnExecuteDialogErrorMsg | This event gets launched when theExecution Mode Optionsdialog box displaysErrorMsg. |
| OnExecuteDialogStatusMsg | This event gets launched when theExecution Mode Optionsdialog box displaysStatusMsg. |
| OnGuess | Event fired when PC-DMIS guesses the feature being measured |
| OnObjectAboutToExecute | This event gets launched immediately before the specifiedCommandgets executed. |
| OnObjectAboutToExecute2 | This event gets launched immediately before the specifiedCommandgets executed on a specifiedArmof a multiple arm system. |
| OnObjectExecuted | This event gets launched immediately after the specifiedCommandgets executed. |
| OnObjectExecuted2 | This event gets launched immediately after the specifiedCommandgets executed on a specifiedArmof a multiple arm system. |
| OnReportPrintEnd | For information, see theOnReportPrintStartevent from theApplicationObjectEventsobject. It's the same.This event is also provided here as a convenience. |
| OnReportPrintStart | For information, see theOnReportPrintStartevent from theApplicationObjectEventsobject. It's the same.This event is also provided here as a convenience. |
| OnStartCollisionDetect | Event fired when collision detect begins |
| OnStartExecution | Event fired when measurement routine execution begins |

### Activate

Makes measurement routine the active measurement routine

### ActiveMachine

Returns the **Machine** object associated with this measurement routine.

### Application

Represents the read-only PC-DMIS application. The **Application** object includes properties and methods that return top-level objects. For example, the Active**PartProgram** property returns a PartProgram object.

### AsyncExecute

Dim ExecDlg As PCDLRN.ExecutionDialog

### AutoCreateGroupsForBMWMessPrograms

Converts BMWMess programs into groups

### BundledStations

Read Only: Returns object pointer Bundled Station collection

### CadModel

Read Only: Returns Cad Model Object

### CadWindows

Returns the **CadWindows** object associated with this measurement routine.

### CalcAdjustTransform

Calculates part adjustment transformation in machine coordinates

### ClearAllTADs

Clears the persistent User Assigned Properties data for all reports

### ClearExecutionBlock

This clears the start and end commands set by the SetExecutionBlock method.

### ClearExecutionMarkedSet

Clears the User Marked Set for execution set by SetExecutionMarkedSet

### ClearTADs

Clears the persistent User Assigned Properties data for the current report

### ClearVerifyFeaturesFlag

Clear the VerifyFeatures Flag

### Close

This subroutine saves, closes, and deactivates the measurement routine.

### Commands

Returns the **Commands** collection object of this measurement routine.

### ConnectedInDriveMode

Read Only: Returns true when computer connected as driving computer

### ConnectedInRelayMode

Read Only: Returns true when computer connected as relay computer

### ConnectedToMaster

Returns TRUE if the measurement routine is on the master computer but is running as the slave measurement routine. Returns FALSE otherwise.

### ConnectedToSlave

Returns TRUE if the measurement routine is on the slave computer but is running as the master measurement routine. Returns FALSE otherwise.

### CopyAutoFeatureInspectionPlannerSettingsIntoRegistryDefaultSettings

This method accesses the .ipd file that is specified in the **Parameters File** registry entry under the **Planner **section of the PC-DMIS Settings Editor. It then copies any inspection planner settings for auto features contained in that file and sets the equivalent PC-DMIS default registry entries to those settings.

### CreateGuessWithDimension

Tries to guess what command was measured and applies the appropriate dimension to it

### CurrentArm

' This script queries the system for the

### CurrentProbeName

Read: Returns the Name of current probe file

### DmisOut

This function outputs DMIS results to a file.

### DmisOut2

Outputs DMIS results to a file; option for output last instance only

### DoAutoInsertMoves

This method can take two parameters, a start command and an end command. These define a range of commands. The method then adds MOVE/POINT commands between each feature command within this range. If you don't specify a start or end command then the range includes all the features in the measurement routine.

### DoCollisionDetectPath

Returns True if it does not detect collisions.

### DoMappedImport

Import And Mapping

### DoStandardImportAndResetSensorMapping

Do Standard Import and reset SensorMapping

### EXECUTE

This function executes the measurement routine.

### EditReferredCommandsWarningMessage

Edit Warning Message for Features To be Deleted

### EditRulesFile

Edits basic script rules file for default parameter managment (Inspection Planner)

### EditWindow

Returns the **Editwindow** object associated with this measurement routine.

### EditWindowTextAll

Returns a single string containing all the text of the entire Edit window as seen in the Edit window's command mode. Read only.

### ExcelFileIndex

Read/Write: Get/Set the current excel output file index

### ExcelFileMethod

Read/Write: Get/Set the current excel output file method

### ExcelFileName

Read/Write: Get/Set the current excel output file name

### ExecOptContinueButtonVisible

Read/Write: Property indicating if Continue button is set visible on new Execution Options Dialogs

### ExecOptJumpButtonVisible

Read/Write: Property indicating if Jump button is set visible on new Execution Options Dialogs

### ExecOptSkipButtonVisible

Read/Write: Property indicating if Skip button is set visible on new Execution Options Dialogs

### ExecOptStopButtonVisible

Read/Write: Property indicating if Stop button is set visible on new Execution Options Dialogs

### ExecuteDialogVisible

Read/Write: Gives status / makes execute dialog visible or hidden

### ExecuteMiniRoutineByName

This method executes a mini routine based on the mini routine's name.

### ExecuteMiniRoutineByNameArray

This method executes multiple mini routines contained within an array of strings. Each item in the array is a mini routine name.

### ExecuteMiniRoutineByUID

This method executes a mini routine based on the mini routine's UID (unique ID).

### ExecuteMiniRoutineByUIDArray

This method executes multiple mini routines contained within an array of strings. Each item in the array is a UID (unique ID).

### ExecutedCommands

The **ExecutedCommands** property returns the ExecutedCommands object. This object contains a collection class of those commands last executed for the current measurement routine.

### ExecutionWasCancelled

Returns TRUE if, during measurement routine execution, the execution is cancelled. Otherwise it returns FALSE. The default value is FALSE.

### Export

This function exports CAD or part data from the measurement routine to the indicated file. The export format is determined by the file name extension ofN*ame.*

### ExportDataToXML

Exports complete data dictionary to an XML file

### ExportToXML

This exports the measurement routine as an XML file.

### ExternalCommandEvent

ExternalCommandEvent

### FullName

Returns the measurement routine’s full file path and name.

### GetAvailableSchemasForSaveAs

If set to True, this returns the list of schema numbers.

### GetExecutionMarkedSetIndex

Returns the current User Marked Set Index for execution set by SetExecutionMarkedSet. -1 means No Marked Set

### GetExecutionWindow

Returns object pointer to the Execution Window for the specified arm if available

### GetMarkedSetName

Retrieve the Name of the User Marked Set identified by the index. Returns FALSE if the marked set is not defined

### GetMarkedSetNumbers

Returns the max munber of allowed marked set and the number of marked set currently defined

### GetReadoutWindow

Read Only: Returns object pointer to Readout Window

### GetStringArray

Creates an array of strings.

### GetVariableValue

This method returns a variable object specified by the string in *VarName* .

### Guess

Tries to guess what command has just been measured

### IgnoreLearnModeHits

IgnoreLearnModeHits

### Import

This function imports CAD or part data from the indicated file to the measurement routine. The file format is determined by the file name extension ofN*ame.*

### Import2

Imports from another format into the measurement routine. The parameter indicates if the input should be merged

### ImportPlanxml

A .planxml file contains a measurement plan created from the Planner application. This is an xml file. You can import measurement plans into the measurement routine using this method.

### ImportPlanxmlIntoExisting

Import Planxml into existing command in Part Program

### ImportQuickFeaturesDefaults

Import Quick Features Defaults From ConfigServer To PcDmis Registry

### ImportUGDCI

Visual Basic Public Function ImportUGDCI( _ ByVal Na*me A*s String _ ) As Boolean

### ImportUGDCI2

ImportUGDCI2. The parameter indicates if the input should be merged

### ImportXML

This imports a measurement routine in an XML format into the current measurement routine.

### InjectRepositoryInfo

Inject Repository Info

### IsModified

Read Only: Returns the information as the part program / measurement routine has been modified

### IsProbeAnalog

Returns TRUE if the current loaded probe in a measurement routine is an analog probe; it returns FALSE otherwise. If you have multiple probe types defined for a measurement routine, the return value will depend, of course, on the location of the insertion point in the measurement routine.

### LIVWindow

Read Only: Returns object pointer of type LIVWindow

### LaserSequentialExecution

Read/Write: Returns/Sets laser only sequential part program execution mode

### LoadLayout

Dim Part As PCDLRN.PartProgram

### MarkChildMode

This enables or disables the Child Mode for Edit window Markings. If enabled and something is marked, any children commands related to the parent command is also marked.

### MarkNewAlignmentMode

Long value of either 0 or 1:

### MarkParentMode

This enables or disables the Parent Mode for Edit window Markings. If enabled and something is marked, any parent commands related to the child command is also marked.

### MasterSlaveDlg

This returns a read-only pointer to the **Multiple Arm Calibration** dialog box, opening the dialog box if necessary.

### MessageBox

This function uses the PC-DMIS message box function. It includes all functionality including cancelling of execution tied to the Cancel button.

### Name

Returns the measurement routine’s file name.

### NoActiveProbesObject

Read: Property indicating no Probes object are instantiated

### OldBasic

Returns this measurement routine’sO**ldBasico**bject. The OldBasic object contains all of the methods from the old basic command set used in previous versions of PC-DMIS.

### OnAddCollisionDetected_EV

Event fired when collision detected

### OnAddObject_EV

This event gets launched when the specifiedC*ommandg*ets added to the measurement routine.

### OnEndCollisionDetect_EV

Event fired when collision detect ends

### OnEndExecution_EV

This event gets launched when PC-DMIS finishes executing the measurement routine. PC-DMIS determines it has finished execution based on the terminationt*ype.*

### OnExecuteDialogErrorMsg_EV

This event gets launched when theE**xecution Mode Optionsdi**alog box displaysErr*orMsg.*

### OnExecuteDialogStatusMsg_EV

This event gets launched when theE**xecution Mode Optionsdi**alog box displaysSta*tusMsg.*

### OnGuess_EV

Event fired when PC-DMIS guesses the feature being measured

### OnObjectAboutToExecute2_EV

This event gets launched immediately before the specifiedC*ommandg*ets executed on a specifiedArm*of *a multiple arm system.

### OnObjectAboutToExecute_EV

This event gets launched immediately before the specifiedC*ommandg*ets executed.

### OnObjectExecuted2_EV

This event gets launched immediately after the specifiedC*ommandg*ets executed on a specifiedArm*of *a multiple arm system.

### OnObjectExecuted_EV

This event gets launched immediately after the specifiedC*ommandg*ets executed.

### OnReportPrintEnd_EV

For information, see theOnReportPrintStartevent from theApplicationObjectEventsobject. It's the same.

### OnReportPrintStart_EV

For information, see theOnReportPrintStartevent from theApplicationObjectEventsobject. It's the same.

### OnStartCollisionDetect_EV

Event fired when collision detect begins

### OnStartExecution_EV

Event fired when measurement routine execution begins

### OptimizePath

Once you have the pointer you can use properties and methods from that object to perform path optimizations.

### OutputFileIndex

When you generate a saved output file using automatic indexing with the Edit window PRINT/AUTO command, PC-DMIS uses an index value as a base. It then it increments the index if there's a duplicate file name in the same directory so that you end up with a unique file name.

### OutputFileName

When you generate a saved output file with the Edit window PRINT Command, PC-DMIS stores that file in a directory of your choice.

### OverrideExecuteSpeed

Overrides the current execution speed

### Parent

Returns the **PartPrograms** collection object to which this measurement routine belongs.

### PartGuid

Returns a string with the part's GUID (Globally Unique Identifier).

### PartName

The part name is not the same as the file name. You can view and set the part name in the Properties of the file containing the measurement routine, as well as at the top of the edit window within PC-DMIS.

### PartProgramSettings

Read Only: Returns object pointer to PartProgramSettings Object

### Path

Returns the measurement routine’s file path.

### ProbeToolBoxPages

Read Only: Returns the IProbeToolBoxPages Object

### Probes

The ****Prob**es** property returns this measurement routine’s Probes collection object.

### ProgramVersionName

Read Only: Property indicating the version name the measurement routine has been saved to

### ProgramVersionSchema

Long value showing the schema number used when the part was last saved.

### QuickStart

Read Only: Returns object pointer to QuickStart Object

### Quit

This subroutine closes and deactivates the measurement routine without saving.

### ReadMSEXml

Visual Basic Public Sub ReadMSEXml( _ ByVal pa*thFileXml A*s String, _ ByVal nameF*ileXml As S*tring _ )

### ReadoutEnabled

Read/Write: Property indicating whether to send or not readout events

### RefreshPart

Refreshes the display of the Part in the Edit window and in the CAD window.

### RemoveLastLearnHit

Removes the last learn-mode hit

### ReportWindow

Read Only: Returns object pointer of type ReportWindow

### RevisionNumber

You can view and set the revision number in the Properties of the file containing the measurement routine, as well as at the top of the edit window within PC-DMIS.

### RoutineExecutionTimeManager

Read Only: Returns the RoutineExecutionTimeManager Object

### RunJournalFile

This executes the measurement routine using point data collected from a journal file.

### Save

This subroutine saves the measurement routine. If the measurement routine hasn<u>otb</u>een saved before, it opens aSav*e As Dialog boxwhi*ch requires that you name the file.

### SaveAs

**Stringv**alue containing the full pathway and file name to which to save.

### SaveAs2

**Stringv**alue containing the full pathway and file name to which to save.

### SaveAs3

**String**value containing the full pathway and file name to which to save.

### SerialNumber

You can view and set the serial number in the Properties of the file containing the measurement routine, as well as at the top of the edit window within PC-DMIS.

### SetCadEqualPart

Set Cad equals Part

### SetExecutionBlock

This method defines a block of commands to execute. Calls are made to the Execute or AsyncExecute functions until the execution block is cleared with the ClearExecutionBlock method.

### SetExecutionMarkedSet

Sets the User Marked Set for execution, calls to Execute or AsyncExecute will used until cleared. Returns false if requested marked set does not exist

### SetIPPlanVersion

Set IP Plan Version

### SetVariableValue

This method sets the value defined in *Value* for the variable specified by the string in *VarName.*

### SetVerifyFeaturesFlag

Set the VerifyFeatures Flag

### SetupFeatureBasedMeasurement

Suppose you a text file named ImportFBM.txt,  the text file resides in side of your in a d:\temp\ folder, and it contains this XML content:

### ShowAllIDs

Read/Write: Property indicating whether to show all IDs in the CAD Window

### Speed

Read Only: Returns Execution speed (0 if not executing)

### StatsCount

You can view and set the stats count number in the Properties of the file containing the measurement routine, as well as at the top of the edit window within PC-DMIS.

### ToggleMasterSlaveMode

Enters/Exits Master-Slave Mode

### Tools

The **Tools** property returns this measurement routine’s Tools collection object.

### Units

Returns the measurement unit type used in the measurement routine. Either inches or millimeters.

### Visible

Represents the measurement routine’s visibility status.

### WaitUntilExecuted

This method waits until the specifiedC*ommando*bject executes, or until Timeout seconds pass.

### _Name

Visual Basic Public Property _Name As String

