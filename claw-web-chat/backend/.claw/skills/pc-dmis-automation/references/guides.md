# PC-DMIS Automation Guides


---

## Accessing Event Subroutines

# Accessing Event Subroutines

## Example Script Showing Event Handling

The easiest way to access an object’s event subroutines is by following this procedure.

The example script below contains code that calls subroutines when certain PC-DMIS events are executed. Inside a blank Excel worksheet, access the Visual Basic Editor and type in the following code. When finished, save the program, then place the cursor inside the Start() subroutine and press F8 to step through the code line by line to see what's happening. Notice that the code within a specific event subroutine is executed when Excel detects that event occurring within PC-DMIS.

```vbscript
Dim PCDApp As PCDLRN.Application
Dim WithEvents AppEvents As PCDLRN.ApplicationObjectEvents
```

```vbscript
Set PCDApp = CreateObject("PCDLRN.Application")
Set AppEvents = PCDApp.ApplicationEvents
```

```vbscript
' These are global variable declarations
Dim PCDApp As PCDLRN.Application
Dim WithEvents AppEvents As PCDLRN.ApplicationObjectEvents
 
Sub Start()
' This is the subroutine to run to start the script
    HideExcel
End Sub
 
Private Sub HideExcel()
    Dim intAnswer As Integer
    intAnswer = MsgBox("Do you want to make Excel invisible? For this test, you should click Yes. It will become visible when you open a measurement routine.", vbYesNo, "Hide Excel?")
   
    If intAnswer = vbYes Then
        Application.Visible = False
    Else
        Application.Visible = True
    End If
   
    LaunchPCDMIS
End Sub
 
Sub LaunchPCDMIS()
    Set PCDApp = CreateObject("PCDLRN.Application")
    Set AppEvents = PCDApp.ApplicationEvents
    PCDApp.Visible = True
End Sub
 
Private Sub AppEvents_OnOpenPartProgram(ByVal PartProg As PCDLRN.IPartProgram)
    ' Event subroutine. This activates when you OPEN a measurement routine.
    Set PartProg = PCDApp.ActivePartProgram
    Application.Visible = True
    MsgBox "Measurement routine " & PartProg.Name & " opened. Excel should also be visible."
End Sub
 
Private Sub AppEvents_OnStartExecution(ByVal PartProg As PCDLRN.IPartProgram)
    ' Event subroutine. This activates when you START EXECUTION of the measurement routine.
    MsgBox "STARTING EXECUTION OF " & PartProg.Name & ". Click OK to continue."
End Sub
 
Private Sub AppEvents_OnEndExecution(ByVal PartProg As PCDLRN.IPartProgram, ByVal TerminationType As Long)
    ' Event subroutine. This activates when you END EXECUTION of the measurement routine.
    MsgBox "ENDING EXECUTION OF " & PartProg.Name & ". Click OK to continue."
End Sub
```

| Accessing Event Subroutines |

| Event Handling Example |
| ' These are global variable declarationsDimPCDAppAsPCDLRN.ApplicationDimWithEventsAppEventsAsPCDLRN.ApplicationObjectEventsSubStart()' This is the subroutine to run to start the scriptHideExcelEnd SubPrivateSubHideExcel()DimintAnswerAsIntegerintAnswer =MsgBox("Do you want to make Excel invisible? For this test, you should click Yes. It will become visible when you open a measurement routine.", vbYesNo,"Hide Excel?")IfintAnswer = vbYesThenApplication.Visible =FalseElseApplication.Visible =TrueEndIfLaunchPCDMISEnd SubSubLaunchPCDMIS()SetPCDApp =CreateObject("PCDLRN.Application")SetAppEvents = PCDApp.ApplicationEvents
    PCDApp.Visible =TrueEnd SubPrivateSubAppEvents_OnOpenPartProgram(ByValPartProgAsPCDLRN.IPartProgram)' Event subroutine. This activates when you OPEN a measurement routine.SetPartProg = PCDApp.ActivePartProgram
    Application.Visible =TrueMsgBox"Measurement routine "& PartProg.Name &" opened. Excel should also be visible."End SubPrivateSubAppEvents_OnStartExecution(ByValPartProgAsPCDLRN.IPartProgram)' Event subroutine. This activates when you START EXECUTION of the measurement routine.MsgBox"STARTING EXECUTION OF "& PartProg.Name &". Click OK to continue."End SubPrivateSubAppEvents_OnEndExecution(ByValPartProgAsPCDLRN.IPartProgram,ByValTerminationTypeAsLong)' Event subroutine. This activates when you END EXECUTION of the measurement routine.MsgBox"ENDING EXECUTION OF "& PartProg.Name &". Click OK to continue."End Sub |

1. Access a readily available and robust Visual BASIC editor (such as one that ships with Microsoft’s Word or Excel products).
2. Select (General) from the  Object  list in the code window.      This allows you to make global variable declarations.
3. Declare a global variable for your PC-DMIS application as well as your PC-DMIS events. For events, you should use the WithEvents keyword and specify an object that has events. For example these two lines are necessary to define as global variables:    
 Dim PCDApp As PCDLRN.Application
Dim WithEvents AppEvents As PCDLRN.ApplicationObjectEvents  This code would enable the AppEvents variable in the Object list.
4. Select your declared variable from the  Object  list in the code window.      This enables you to select specific event subroutines from the  Procedure  list.
5. From the code window, select an event subroutine from the  Procedure  list.      The new subroutine appears in the code window.
6. Make modifications to the event’s subroutine code as needed. When PC-DMIS meets the specified condition, the event subroutine gets ran along with any code you added.
7. In your script, be sure to "set" the AppEvents object variable sometime after you "set" the Pcdlrn.Application object. For example, you will need to have these two lines of code somewhere in your script:   
 Set PCDApp = CreateObject("PCDLRN.Application")
Set AppEvents = PCDApp.ApplicationEvents

---

## Accessing Methods and Properties

# Accessing Methods and Properties

There are two ways to get to an object's methods and properties.

Whether you're creating an object or calling an object from an existing object, you'll need to first create and then set a pointer to the appropriate object.

**Step 1:**Declare the pointer variable name for the application by using the "DIM" statement. For example:

**Step 2:**Set the pointer variable to the PCDLRN Application using CreateObject. For example:

**Step 3:**Declare and set additional pointer variable names for any needed sub objects found within the Application object. For example if you wanted to access commands available for the active measurement routine, you're code would look something like this:

To access events, see "Accessing Event Subroutines".

```vbscript
Dim App As Object
```

```vbscript
Set App = CreateObject("PCDLRN.Application")
```

```vbscript
Dim Part As Object
Set Part = App.ActivePartProgram
Dim Cmds As Object
Set Cmds = Part.Commands
Dim Cmd As Object
Set Cmd = Cmds.Add(SET_COMMENT, True)
```

| Accessing Methods and Properties |

1. Create objects by their ID
2. Call the object from an existing object

---

## Accessing an Object s Properties Methods and Events

# Accessing an Object's Properties, Methods, and Events

# See Also

Objects are external classes that contain methods, properties and events.

**M****ethods:M**ethods are functions that usually perform actions. This usually return a boolean value to determine whether or not the function succeeded. Methods are analogous to verbs in languages.

**Properties:P**roperties allow you to read or sometime write certain characteristics or attributes of an object or control. Properties are analogous to adjectives in languages.

**Events:**Events are routines that get called when certain conditions are met. Events differ from methods and properties in that PC-DMIS is the source of the action, instead of the destination. To take advantage of events, the automation controller application must support events. Visual BASIC, for example supports events. Handling events involves declaring an object of the correct type and then adding handling functions for the different events. Currently events are found in only these objects:

Accessing Methods and Properties Accessing Event Subroutines Using the Object Browser in Other Editors Using the Object Hierarchy Chart

| Accessing an Object's Properties, Methods, and Events |

---

## Getting Started

# Getting Started

To get started using PC-DMIS automation, consider using this information:

| Getting Started |

- Accessing an Object's Properties, Methods, and Events
- Using the Object Hierarchy Chart
- Accessing Event Subroutines
- Using the Object Browser in Other Editors
- Sample Automation Scripts
- Object Overview
- Windows 7 Automation Notes

---

## Introduction

# Introduction

# See Also

**Known Issue for Offline Help and Firefox**

On a Firefox browser with the offline Help, you may experience a problem where you cannot get a topic's contents to appear when you click on a topic from theT**able of Contents.**

If this happens, load this Help in a different browser; or right-click on the TOC item and clickO**pen Link in New Tab.**

We have not seen this issue in the online Help.

PC-DMIS's Automation gives you the ability to automate repetitive tasks within PC-DMIS or even to use elements of PC-DMIS functionality, within a custom built application.

PC-DMIS Automation contains these benefits:

This Automation section contains a detailed list of methods and properties for each PC-DMIS Automation Object. The various objects are listed in alphabetical order. A bold item indicates a default property or method for the object.

To get started with Automation, see the information on the "Getting Started" to get a feel for what's needed. For questions beyond the scope of this section, consult a Visual BASIC book on automation.

Getting Started

| Introduction |

|  | Known Issue for Offline Help and FirefoxOn a Firefox browser with the offline Help, you may experience a problem where you cannot get a topic's contents to appear when you click on a topic from theTable of Contents.If this happens, load this Help in a different browser; or right-click on the TOC item and clickOpen Link in New Tab.We have not seen this issue in the online Help. |

- PC-DMIS Automation is computer independent . You can have a process on one computer automating a process on another computer.
- PC-DMIS Automation is location independent . You can run automation scripts within PC-DMIS itself, using the BASIC Script Editor or you can run automation scripts in external Visual Basic Editors. In addition, you can run automation scripts across a network.
- PC-DMIS Automation is Language independent : If you don't know BASIC but are familiar with another programming language, you can configure that programming language to use PC-DMIS's library (the examples and descriptions in this help file, however, are written using the BASIC programming language).

---

## PCDLRN P

# Project Overview

# Description

# Classes

# Public Enumerations

This object allows you to work with a specified Analysis object in a template, custom report, or in the Report window.

TheA**pplicationo**bject represents the PC-DMIS application.

TheA**utotriggerob**ject automatically takes hits when the probe enters a specified zone.

TheC****adWindo**wso**bject is an object containing a collection ofCadWindowobjects currently available to a measurement routine.

TheC****olo**rso**bject allows you to work with collections ofColorobjects. These are used to automate color settings used in PC-DMIS's report templates.

TheC**ommando**bject represents a single command in PC-DMIS.

TheD**imDatao**bject is similar to a type defined in the Example below. You can use it to pass dimension information in automation functions that accept that type.

TheD**misDialogo**bject represents a PC-DMIS modeless dialog box. You can use it to work with most PC-DMIS dialog boxes. This object wraps the PC-DMIS dialog box and implements the IDialog interface.

TheE**ditWindowo**bject represents the Edit window associated with a measurement routine. It is always present, although sometimes it is invisible. When in Command mode, the Edit window lists all the commands in the measurement routine.

The **Execution**Window object contains methods and properties to control theExecutiondialog box in PC-DMIS.

If you execute a measurement routine with collision detection, theC**ollision Detectiond**ialog box controls the execution. It adds some additional buttons beyond what theExe**cutiondia**log box has.

TheF**eatDatao**bject is similar to a type as defined in the Example below.

It is be used to pass feature data in automation functions that accept this type

TheF**ileIOo**bject is used to access the PC-DMIS File I/O object.

This object is the specified pointinfo object contained within the parentH**OBPointInfoListc**ollection object.

This object holds a collection of hyperview objects (HOB) as pointinfo objects.

TheLabelTemplatesobject contains all open label templates in PC-DMIS's Label Template editor.

TheL**eapfrogo**bject contains three leapfrog properties that will allow you to define how to use PC-DMIS's Leapfrog option (available in PC-DMIS Versions 3.0 and above) to translate along a part as well as the numbers of hits to use for each feature.

**For information on Leapfrog, see the "Performing a LeapFrog Operation” topic in thePC-DMIS Help File.

TheL**IVWindowo**bject gives access to the live image view (sometimes call the Live Window or Live View) that is used in PC-DMIS Vi**sion. **In PC-DMIS, this view appears in aVisiontab in the Graphics Display window. The additional tab shows a real-time view from the camera on a vision probe. Other applications can use the Live View to support the display and execution of Vision measurement routines.

TheM****achin**eo**bject represents a CMM, or a virtual off-line "machine". TheMachineobjects are contained in theMachi**nescolle**ction.

TheM**achineo**bject is primarily an event source.

These PC-DMIS OldBasic functions were made available in previous version of PC-DMIS basic and are provided here, listed in alphabetical order, for backwards compatibility.

TheO**ptimizePatho**bject contains the functions to perform path optimizations on measurement routines. You can return a pointer to this object by using theOptimizePathproperty in thePartP**rogramobjec**t.

TheP**artProgramso**bject contains all the openmeasurement routines in PC-DMIS.

This object lets you work with PC-DMIS's Probe Readout window.

TheR**eportControlso**bject gives you access to a variety of controls such as buttons, text boxes, and other items that you can add to, remove, and otherwise manipulate on a particular section of a report template.

TheR**eportDatao**bject lets you access data sent to reports during theEve**ntReportDataeve**nt.

TheReportTemplatesobject contains all open report templates in PC-DMIS's Report Template editor.

TheSectionsobject contains a collection of all existing Section tabs for a given report template in PC-DMIS's Report Template editor.

You can access the Strategies object through thestrategiesproperty in theCommandobject.

TheT**empCompo**bject gives access to the properties of the PC-DMIS Temperature Compensation command. For additional information about Temperature Compensation, see "Compensating for Temperature" in the "Setting Your Preferences"sectionof thePC-DMIS Help File.

The Object Type, or OBTYPE, is a special member of the Application (or PCDLRN) object. It contains several constant values tied to enumerations. You can use these values when working with the Commands.Add method and the Command.Type property.

The following list shows the available OBTYPE constants and their equivalent enumerations. These enumerated values are of type LONG:

PC-DMIS 2020 R1 Object Library

****Class****** **Module Description Activ********e**Ti**p Th**e ActiveTi**p object gives access to the properties of the PC-DMIS Set Active Tip command**. AlignCm****nd AlignCm**nd objects are created from more gener************************************i**c **Co**mm**and objects to pass alignment information back and forth. AnalysisWindow This object allows you to work with a specified Analysis object in a template, custom report, or in the Report window**. Applicati**on The Application object represents the PC-DMIS applicatio**n. ApplicationObjectEve**nts The ApplicationObjectEvents object provides you with a series of events that get called when the PC-DMIS application meets certain conditio**ns. ApplicationSett**ings The ApplicationSettings object is a class that contains various properties and methods that allow you to work with PC-DMIS settings. ArrayInde**x The Array**Index object is used to set up multi-dimensional feature arrays in PC-DMIS. Methods are provided to add, remove, or edit array upper and lower bounds for array ind**ices. **Attach The Attach object attaches measurement routines to the current measurement routine. The current measurement routine can then access objects from the attached measurement rou**tines. AutomationS**ettings The AutomationSettings object controls how to handle PC-DMIS automated behaviors. This includes, but is not limited to, automatic-generated messages in PC-DMIS. Autotrigg**er The Autot**rigger object automatically takes hits when the probe enters a specified** zone**. **Ba**sicScan BasicScan objects are created from more generic Command objects to pass information specific to the scan command back and forth. At present only DCC basic scans are user-accessible. BundledStation BundledStations CadHa**ndle Cad**Model The CadModel object allows you to work with the imported CAD model in PC-DMIS' Graphics Display window. CadPointOnSurface CadPointOnSurface Object CadPointsOnSurface Object for the collection of polylines on surface CadPolyLineOnSurface CadPolyLineOnSurface Object CadPolyLinesOnSurface Object for the collection of polylines o****n surfa**ce** CadWindow The CadWindow object is the one and only cad window for a measuremen**t routine.** CadWindows The CadWindows object is an object containing a collection of CadWindow objects currently available to a measurement** routine. C**alibration The Calibration object allows for tip calibration during measurement routine execution. This object is placed into a measurement routine through the Add met********ho**d **of** t**he Commands object and obtained from the Command object via the CalibrationCommand** prop**erty**. Colo**r The Color object is used to automate color settings used in PC-DMIS's report** templ**ates. Colors The Colors object allows you to work with collections of Color objects. These are used to automate color settings used in PC-DMIS's report templates. Command The Command object represents a single command in PC-DMIS. Commands The Commands object contains all the Command objects in a measurem**ent rou**tine. Comment The Comment object gives access to the properties of the PC-DMIS Comment command. CommentInputDialog This objects lets you** work with th**e Input Comment dialog box that appears during execution when PC-DMIS executes a COMMENT/**INPUT comman**d. ControlPoint With the ControlPoint object you can insert control point locations. These locations interrupt the normal scan and alter scan speed, point density or both for defined portio**ns of th**e scan. DataType The DataType object allows you to return objects of information about a particular dat**a type or** field. DataTypes The DataTypes object allows you to return objects of varying data types. DefaultDimensionColors This object exposes methods and properties that allow access to most of the dimension color value**s contained in the E**dit Dimension Color dial**og box **in PC-DMIS. DimData The DimData object is similar to a type defined in the Example below. You can use it to pass dimension information in automation functions tha**t accept tha**t type. DimensionCmd DimensionCmd objects are created from more generic Command objects to pass information specific to the dimension com**mand back** and forth. DimFormat The DimFormat object gives access to the properties of the PC-DMIS Dimension Format command. For additional information on dimensions, see the topic "Dimension Options" in the P**C-DMIS **documentation. DimInfo The DimInfo object gives access to the properties and methods of the PC-DMIS Dimension Information command. See "DIMINFO Command" in the PC-DMIS documentation for a**dditional in**formation. DispMetaFile The DispMetaFile object gives access to the comment properties of the PC-DMIS Di**splay Meta**file command. DmisDialog The DmisDialog object represents a PC-DMIS modeless dialog box. You can use it to work with most PC-DMIS dialog boxes. This object wraps the PC-DMIS dialog box and implements **the IDialo**g interface. DmisMatrix The DmisMatrix object is a four by three array of doubles modeled after the transformation matrices used in PC-DMIS. The first set of three doubles represents the matrix offset. The second set of three doubles represents the X axis. The third set of three doubles represents the Y axis. The fourth set of three doubles** represent**s the Z axis. EditWindow The EditWindow object represents the Edit window associated with a measurement routine. It is always present, although sometimes it is invisible. When in Command mode, the Edit window lists all the commands in th**e measurement ro**utine. ExecutedCommands The ExecutedCommands object acts much like the Commands object except that it only conta*ins a co*llection of the executed commands from the last measurement routine execution, while the Commands object contains all the commands in t****he meas**ur**ement routine. ExecutionWindow The ExecutionWindow object contains methods and properties to control the Execution dialog box in PC-DMIS. If you execute a measurement routine with **collision detection**, the Collision Detection dialog box controls the execution. It adds some additional buttons beyond what the E**xecution dialog** box has. ExternalCommand The ExternalCommand object causes PC-DMIS to launch an external program during measurement routine execution. This object has one property: The command property. This property consists of a string value used to execute the exte**rnal co**mmand. FCFCommand FeatCmd FeatCmd are created from more generic Command objects to pass information specific to the featur**e comman**d back and forth. FeatData The FeatData object is similar to a type as defined in the Example below. It is be used to pass feature data in automation funct**ions t**hat accept this type FileIO The FileIO object is used to access th**e PC-DMIS File** I/O object. FlowControlCmd FlowControlCmd objects are created from more generic Command objects to pass information specific to the flow cont**rol co**mmand back and forth. FPanel The FPanel object contains properties that allow you to work with an F-Panel controller and interface. HOBPointInfo This object is the specified pointinfo object **contained within** the parent HOBPointInfoList collection object. HOBPointInfoList This object holds a collection of hyperview objects (HOB) as pointinfo objects. LabelControls The LabelControls object gives you access to a variety of controls such as buttons, text boxes, and other items that you can add to, remove, and otherwise manipulate on a label template. LabelTemplate The LabelTemplate object allows you to get or set various settings for a label template. LabelTemplates The LabelTemplates object contains all open label templates in PC-DMIS's Label Te**mplate e**ditor. LEAPFROG The Leapfrog object contains three leapfrog properties that will allow you to define how to use PC-DMIS's Leapfrog option (available in PC-DMIS Versions 3.0 and above) to translate along a part as well as the numbers of hits to use for each feature. For information on Leapfrog, see the "Performing a LeapFrog Operation” topic** in the P**C-DMIS Help File . LIVWindow The LIVWindow object gives access to the live image view (sometimes call the Live Window or Live V**iew) t**hat is used in PC-DMIS Vision. In PC-DMIS, this view appears in a Vision tab in the Graphics Display window. The additional tab shows a real-time view from the camera on a vision probe. Other applications can use the Live View to support the display and execution of Vision measurement routines. **LmsL**************i**ce**ns**e **Lms License Object LoadMachine The LoadMachine object gives access to the machine name property of the** PC-********D**MI**S **Load Mac**hine c**ommand. LoadProbe The LoadProbe object gives access to the filename property of the PC-DMIS Load Probe command. Machine The Machine object represents a CMM, or a virtual off-line "machine". The Mach******ine **ob**je**cts are contained in the Machines collection. The Machine object is primarily an event source. Machines The Machines object is the collection of all Machine objects currently available in PC-DMIS. Each Machin********e obj**ec**t **is** bound to exa*ctly one P*artProgram obje**ct, *a*nd vice versa . Use Machines ( index ) where index is the index number or on-line machine’s nam**e to return a **single Machine object. MasterSlaveDlg The MasterSlaveDlg object gets called when the PartProgram.MasterSlaveDlg method is used. MiniroutineSettings MiniroutineTimeInfo MiniroutineTimeInfoList ModalCmd Objects of type AlignCmnd are created from more generic Command objects to pass information specific t**o the m**odal command back and forth. MoveCmd Objects of type MoveCmd are created from more generic Command objects to pass information specific to the move command back and forth. OldBasic These PC-DMIS OldBasic functions were made available in previous version of PC-DMIS basic and are provided here, listed in alphabetica**l order, for** backwards compatibility. OptimizePath The OptimizePath object contains the functions to perform path optimizations on measurement routines. You can return a pointer to this object by using the OptimizePa**th property** in the PartProgram object. OPTIONPROBE The OPTIONPROBE object provides **support f**or the Optional Probe command. OptMotion The OptMotion command object is used to change optional motion settings for **the **PC-DMIS probe motion command object. Page This object contains information about a specific page in the Report window. Pages This object contains a collection of the Page objects that appear in the Report window. PartProgram The PartProgram object represents a measurement routine currently available in PC-DMIS. This is the main obje**ct used to m**anipulate measurement routines. PartPrograms The PartPrograms object contains a**ll the open measure**ment routines in PC-DMIS. PartProgramSettings The PartProgramSettings object allows you to get or set various measurement routine settings. PCDMessageBox This object lets you work with PC-DMIS message boxes. PictureData Picture Data Object PointData PortLock Port Lock Object probe The Probe object provides information about a given probe description file. It also allow**s you **to manipulate the Probe dialog in PC-DMIS. Probes The Probes object is the collection of all Probe objects c**urre**ntly available to a measurement routine. ProbeToolBoxPage ProbeToolBoxPages PropertySheetDialog This object lets you wo**rk with property shee**ts dialog boxes in PC-DMIS. QualificationSettings The QualificationSettings object specifies how to calibrate your probe. The calibration process tells PC-DMIS the location and diameter of the probe tip. For more information on calibrating the probe, see the "Defining Probes" topic in the PC-DMIS help file . QuickFeatureSelection QuickFeatureSelection Object QuickStart QuickStartAddedCommands QuickStartStep QuickStartSteps QuickStartTask ReadoutWindow This object lets you work with PC-DMIS's Probe Readout window. RegistrySetting RegistrySettings ReportControl This lets you get or s**et properties **for a specific Reporting object. ReportControls The ReportControls object gives you access to a variety of controls such as buttons, text boxes, and other items that you can add to, remove, and otherwise manipulate **on a parti**cular section of a report template. ReportData The ReportData object l**ets you access **data sent to reports during the EventReportData event. ReportTemplate The ReportTemplate object allows you to get or set various settings for a report template. ReportTemplates The ReportTemplates object contains all open report templates in PC-DMIS's Report Template editor. ReportWindow The ReportWindow object allows you to get or set various settings for the Report window. RoutineExecutionTimeManager Scan Scan objects are created from more generic Command objects to pass information specific to the scan command back and forth. At present** only D**CC and Manual scans are user accessible. Section The Section object lets you manipulate a par**ticular sec**tion from the collection of available Selections used by a report template. Sections The Sections object contains a collection of all existing Section tabs for a given report template in** PC-DMIS's** Report Template editor. STATISTICS The Statistics object gives access to the properties an**d data mem**bers **of the PC-D**MIS Statistics command. Strategies This Strategies object contains a collection of the PC-DMIS measurement strategies. You can access the Strategies object throu**gh the s**trategies property in the Command object. Strategy This Strategy object lets you manipulate a specific strategy contained within the Strategies collection. StringArray This object holds an array of strings. It is creat**ed with **the GetStringArray method. Target Targets TempComp The TempComp object gives access to the properties of the PC-DMIS Temperature Compensation command. For additional information about Temperature Compensation, see "Compensating for Temperature" in the "Setting Your Preferences" section of the PC-DMIS Help File . Tip The Tip object describes a single ****ti**p **of a probe. All of its properties are read-only. Tips The Tips object is the collection of all Tip objects for a Probe object. The Probe object that the Tips store Tip objects for is contained in the Parent property. tool The Tool object represents a single probe calibration tool. ToolkitInter**nalCo**mmands Toolkit Internal Commands Collection Object Tools The Tools collection object contains the tools a**vailable t**o the parent PartProgram object. TRACEFIELD The Tracefield object gives access to the name and value properties of the PC-DMIS Tracefield command. For additional information on this command see "Using Trace Field" in the "Tracking Statistical Data" section of the PC-DMIS documentation . tutorhit Variable PC-Dmis Variable Object VariableArray

Enumeration Description AUTOVECTORTYPES BringToZPositionMode This enuermated list defines the possible values you can use to set the Z order for a dialog box or window. BSBOUNDCOND_ENUM BSCANHIT_ENUM BSCANMETH_ENUM BSCANNMODE_ENUM BSCANOPMODE_ENUM BSCTRLPT_ENUM BSF_ENUM CATCHTYPE CREATEIDTYPE DATA_TYPE_TYPES DCCMODE DialogTypes Only dialog boxes that fire Open and Close events are in this enumeration. DIMAXISTYPE DIMFORMATFLAG DIMFORMATTYPE EDGE_MEASURE_TYPES ENUM_ALIGN_WORKPLANE ENUM_AXIS_TYPE ENUM_BEST_FIT_MATH_TYPES ENUM_BITMAP_LAYOUT ENUM_BUTTON_TYPE ENUM_CAD_COLLECTIONS ENUM_CAD_GEOMETRY_FILTER_FLAGS ENUM_CAD_LINE_INTERSECT_FLAGS ENUM_CAD_RESULT ENUM_CAD_SURFACE_BOUNDARY_OPTION ENUM_CAD_VECTOR_OPTION ENUM_CADPRINTOPTIONS ENUM_CALIBRATION_EXECUTE_MODE ENUM_COLOR_SECTION ENUM_COMMANDNUMBER ENUM_DIM_AXISTYPE ENUM_DIM_OUTPUTTYPE ENUM_DIM_PERP_PARALLEL ENUM_DIM_PROF_TYPE ENUM_DIM_RADIUS_TYPE ENUM_DIM_TP_MATERIAL_CONDITION ENUM_DIM_TP_MODIFIER ENUM_DIM_TP_USE_AXIS ENUM_DINFO_FIELD_TYPES ENUM_DINFO_LOC_AXES ENUM_DINFO_TP_AXES ENUM_DMIS_OUTPUT_THEOS ENUM_DMIS_OVERWRITE ENUM_DTYPE_GETDBTYPE ENUM_DTYPE_GETVARIABLETYPE ENUM_ERROR_MODES ENUM_ERROR_TYPES ENUM_FEATREF_TYPES ENUM_FEATURE_TYPES ENUM_FIELD_DATA_TYPES ENUM_FIELD_TYPES ENUM_FILE_IO_TYPES ENUM_FILE_OPEN_TYPES ENUM_FILTER_TYPES ENUM_GENERIC_ALIGN ENUM_GENERIC_DISPLAY ENUM_GENERIC_TYPES ENUM_HATCH_STYLE Enum_Language_Type ENUM_MARK_NEW_ALIGNMENT_MODE ENUM_MASTERSLAVEDIALOG_MEASUREARM ENUM_MASTERSLAVEDIALOG_MEASUREDCC ENUM_PAGE_FORMAT ENUM_PAGE_ORIENTATION ENUM_PCD_COMMENT_TYPES ENUM_PCD_ON_OFF ENUM_PCD_STAT_TYPES ENUM_PCDMSG_RETVALS ENUM_PCDMSG_TYPES ENUM_PLANE_TYPE ENUM_POINT_INFO_TYPES ENUM_PRESS_BUTTON_RESULTS ENUM_QUAL_CREATE_REPLACE ENUM_RELEASE_TYPE ENUM_REPORT_TEMPLATE_OBJECTS ENUM_RMEAS_MODE ENUM_RMEAS_MODE_NEW ENUM_SCAN_INOUT_TYPES ENUM_STAT_NAME_TYPES ENUM_TIPTYPES ENUM_TOOL_MOVED ENUM_TRANSFORMATION_TYPES ENUM_VISION_TARGET_EDGE_SELECTION ENUM_VISION_TARGET_FOCUS_RANGE ENUM_VISION_TARGET_POINT_DENSITY ENUM_VISION_TARGET_TYPE ERRORMODES ERRORTYPES EVALUATION_TYPES FDATA_COORDSYS FDATA_DATASET FDATA_TYPES FHITDATA_TYPES FPOINT_TYPES FVECTOR_TYPES GETIDTYPE GUESSTYPE HIGH_POINT_SEARCH_MODES IJKTYPES ITERATEFLAGS MachineConnectionStatus This enumerated list shows the possible values for the ConnectionStatus property. MOVEDIRECTION MOVETYPE OBTYPE The Object Type, or OBTYPE, is a special member of the Application (or PCDLRN) object. It contains several constant values tied to enumerations. You can use these values when working with the Commands.Add method and the Command.Type property. The following list shows the available OBTYPE constants and their equivalent enumerations. These enumerated values are of type LONG: PAXISTYPE PCDBAUD PCDCOMMENT PCDDATABITS PCDDIMTYPES PCDFILEPRINTFORMAT PCDGETPOINTSTYPES PCDHANDSHAKE PCDMEASTHEO PCDONOFF PCDPARITY PCDPRINTFILEMODE PCDPRINTLOC PCDREPORTSETTINGS PCDSCANDIR1 PCDSCANDIR2 PCDSCANHITFLAG PCDSCANHITTYPE PCDSCANTECHNIQUE PCDSCANVECTOR PCDSCANVECTORSURF PCDSTARTDIMFLAGS PCDSTARTFEATFLAGS PCDSTARTFEATTYPES PCDSTARTSCANFLAGS PCDSTARTSCANTYPES PCDSTATSFLAGS PCDSTOPBITS PCDYESNO Probe_Tool_Page PropertySheetTypes QdasOutputFileToggleType QUALIFICATION_SETTINGS_MODE RPROGOPTIONSTYPE RPROGVALUESTYPE RPT_MIRROR_OPT RS_ACCESS RS_GROUP ScreenColorGradientType TOOLTYPES TraceDataSourceEnum TraceValueTypeEnum UNITTYPE VARIABLE_TYPE_TYPES WAXISTYPE WPLANETYPE WPROGOPTIONSTYPE WPROGVALUESTYPE XMLImport_StatusCode XYZTYPES

| Project Overview |

| Class Module | Description |
| ActiveTip | TheActiveTipobject gives access to the properties of the PC-DMIS Set Active Tip command. |
| AlignCmnd | AlignCmndobjects are created from more genericCommandobjects to pass alignment information back and forth. |
| AnalysisWindow | This object allows you to work with a specified Analysis object in a template, custom report, or in the Report window. |
| Application | TheApplicationobject represents the PC-DMIS application. |
| ApplicationObjectEvents | TheApplicationObjectEventsobject provides you with a series of events that get called when the PC-DMIS application meets certain conditions. |
| ApplicationSettings | TheApplicationSettingsobject is a class that contains various properties and methods that allow you to work with PC-DMIS settings. |
| ArrayIndex | TheArrayIndexobject is used to set up multi-dimensional feature arrays in PC-DMIS. Methods are provided to add, remove, or edit array upper and lower bounds for array indices. |
| Attach | TheAttachobject attaches measurement routines to the current measurement routine. The current measurement routine can then access objects from the attached measurement routines. |
| AutomationSettings | TheAutomationSettingsobject controls how to handle PC-DMIS automated behaviors. This includes, but is not limited to, automatic-generated messages in PC-DMIS. |
| Autotrigger | TheAutotriggerobject automatically takes hits when the probe enters a specified zone. |
| BasicScan | BasicScanobjects are created from more genericCommandobjects to pass information specific to the scan command back and forth. At present only DCC basic scans are user-accessible. |
| BundledStation | BundledStations | CadHandle | CadModel | TheCadModelobject allows you to work with the imported CAD model in PC-DMIS' Graphics Display window. |
| CadPointOnSurface | CadPointOnSurface Object |
| CadPointsOnSurface | Object for the collection of polylines on surface |
| CadPolyLineOnSurface | CadPolyLineOnSurface Object |
| CadPolyLinesOnSurface | Object for the collection of polylines on surface |
| CadWindow | TheCadWindowobject is the one and only cad window for a measurement routine. |
| CadWindows | TheCadWindowsobject is an object containing a collection ofCadWindowobjects currently available to a measurement routine. |
| Calibration | TheCalibrationobject allows for tip calibration during measurement routine execution. This object is placed into a measurement routine through the Add method of theCommandsobject and obtained from theCommandobject via the CalibrationCommand property. |
| Color | TheColorobject is used to automate color settings used in PC-DMIS's report templates. |
| Colors | TheColorsobject allows you to work with collections ofColorobjects. These are used to automate color settings used in PC-DMIS's report templates. |
| Command | TheCommandobject represents a single command in PC-DMIS. |
| Commands | TheCommandsobject contains all theCommandobjects in a measurement routine. |
| Comment | TheCommentobject gives access to the properties of the PC-DMIS Comment command. |
| CommentInputDialog | This objects lets you work with theInput Commentdialog box that appears during execution when PC-DMIS executes a COMMENT/INPUT command. |
| ControlPoint | With theControlPointobject you can insert control point locations. These locations interrupt the normal scan and alter scan speed, point density or both for defined portions of the scan. |
| DataType | TheDataTypeobject allows you to return objects of information about a particular data type or field. |
| DataTypes | TheDataTypesobject allows you to return objects of varying data types. |
| DefaultDimensionColors | This object exposes methods and properties that allow access to most of the dimension color values contained in theEdit Dimension Colordialog box in PC-DMIS. |
| DimData | TheDimDataobject is similar to a type defined in the Example below. You can use it to pass dimension information in automation functions that accept that type. |
| DimensionCmd | DimensionCmdobjects are created from more genericCommandobjects to pass information specific to the dimension command back and forth. |
| DimFormat | TheDimFormatobject gives access to the properties of the PC-DMIS Dimension Format command. For additional information on dimensions, see the topic "Dimension Options" in the PC-DMIS documentation. |
| DimInfo | TheDimInfoobject gives access to the properties and methods of the PC-DMIS Dimension Information command. See "DIMINFO Command" in the PC-DMIS documentation for additional information. |
| DispMetaFile | TheDispMetaFileobject gives access to the comment properties of the PC-DMIS Display Metafile command. |
| DmisDialog | TheDmisDialogobject represents a PC-DMIS modeless dialog box. You can use it to work with most PC-DMIS dialog boxes. This object wraps the PC-DMIS dialog box and implements the IDialog interface. |
| DmisMatrix | TheDmisMatrixobject is a four by three array of doubles modeled after the transformation matrices used in PC-DMIS. The first set of three doubles represents the matrix offset. The second set of three doubles represents the X axis. The third set of three doubles represents the Y axis. The fourth set of three doubles represents the Z axis. |
| EditWindow | TheEditWindowobject represents the Edit window associated with a measurement routine. It is always present, although sometimes it is invisible. When in Command mode, the Edit window lists all the commands in the measurement routine. |
| ExecutedCommands | TheExecutedCommandsobject acts much like theCommandsobject except that it only contains a collection of theexecutedcommands from the last measurement routine execution, while theCommandsobject contains all the commands in the measurement routine. |
| ExecutionWindow | The ExecutionWindow object contains methods and properties to control theExecutiondialog box in PC-DMIS.If you execute a measurement routine with collision detection, theCollision Detectiondialog box controls the execution. It adds some additional buttons beyond what theExecutiondialog box has. |
| ExternalCommand | TheExternalCommandobject causes PC-DMIS to launch an external program during measurement routine execution. This object has one property: The command property. This property consists of a string value used to execute the external command. |
| FCFCommand | FeatCmd | FeatCmdare created from more genericCommandobjects to pass information specific to the feature command back and forth. |
| FeatData | TheFeatDataobject is similar to a type as defined in the Example below.It is be used to pass feature data in automation functions that accept this type |
| FileIO | TheFileIOobject is used to access the PC-DMIS File I/O object. |
| FlowControlCmd | FlowControlCmdobjects are created from more genericCommandobjects to pass information specific to the flow control command back and forth. |
| FPanel | TheFPanelobject contains properties that allow you to work with an F-Panel controller and interface. |
| HOBPointInfo | This object is the specified pointinfo object contained within the parentHOBPointInfoListcollection object. |
| HOBPointInfoList | This object holds a collection of hyperview objects (HOB) as pointinfo objects. |
| LabelControls | TheLabelControlsobject gives you access to a variety of controls such as buttons, text boxes, and other items that you can add to, remove, and otherwise manipulate on a label template. |
| LabelTemplate | TheLabelTemplateobject allows you to get or set various settings for a label template. |
| LabelTemplates | TheLabelTemplatesobject contains all open label templates in PC-DMIS's Label Template editor. |
| LEAPFROG | TheLeapfrogobject contains three leapfrog properties that will allow you to define how to use PC-DMIS's Leapfrog option (available in PC-DMIS Versions 3.0 and above) to translate along a part as well as the numbers of hits to use for each feature.For information on Leapfrog, see the "Performing a LeapFrog Operation” topic in thePC-DMIS Help File. |
| LIVWindow | TheLIVWindowobject gives access to the live image view (sometimes call the Live Window or Live View) that is used in PC-DMIS Vision. In PC-DMIS, this view appears in aVisiontab in the Graphics Display window. The additional tab shows a real-time view from the camera on a vision probe. Other applications can use the Live View to support the display and execution of Vision measurement routines. |
| LmsLicense | Lms License Object |
| LoadMachine | TheLoadMachineobject gives access to the machine name property of the PC-DMIS Load Machine command. |
| LoadProbe | TheLoadProbeobject gives access to the filename property of the PC-DMIS Load Probe command. |
| Machine | TheMachineobject represents a CMM, or a virtual off-line "machine". TheMachineobjects are contained in theMachinescollection.TheMachineobject is primarily an event source. |
| Machines | TheMachinesobject is the collection of all Machine objects currently available in PC-DMIS. EachMachineobject is bound to exactly onePartProgramobject, andvice versa. UseMachines(index) whereindexis the index number or on-line machine’s name to return a singleMachineobject. |
| MasterSlaveDlg | TheMasterSlaveDlgobject gets called when the PartProgram.MasterSlaveDlg method is used. |
| MiniroutineSettings | MiniroutineTimeInfo | MiniroutineTimeInfoList | ModalCmd | Objects of typeAlignCmndare created from more genericCommandobjects to pass information specific to the modal command back and forth. |
| MoveCmd | Objects of typeMoveCmdare created from more genericCommandobjects to pass information specific to the move command back and forth. |
| OldBasic | These PC-DMIS OldBasic functions were made available in previous version of PC-DMIS basic and are provided here, listed in alphabetical order, for backwards compatibility. |
| OptimizePath | TheOptimizePathobject contains the functions to perform path optimizations on measurement routines. You can return a pointer to this object by using theOptimizePathproperty in thePartProgramobject. |
| OPTIONPROBE | TheOPTIONPROBEobject provides support for the Optional Probe command. |
| OptMotion | TheOptMotioncommand object is used to change optional motion settings for the PC-DMIS probe motion command object. |
| Page | This object contains information about a specific page in the Report window. |
| Pages | This object contains a collection of thePageobjects that appear in the Report window. |
| PartProgram | ThePartProgramobject represents a measurement routine currently available in PC-DMIS. This is the main object used to manipulate measurement routines. |
| PartPrograms | ThePartProgramsobject contains all the openmeasurement routines in PC-DMIS. |
| PartProgramSettings | ThePartProgramSettingsobject allows you to get or set various measurement routine settings. |
| PCDMessageBox | This object lets you work with PC-DMIS message boxes. |
| PictureData | Picture Data Object |
| PointData | PortLock | Port Lock Object |
| probe | TheProbeobject provides information about a given probe description file. It also allows you to manipulate theProbedialog in PC-DMIS. |
| Probes | TheProbesobject is the collection of all Probe objects currently available to a measurement routine. |
| ProbeToolBoxPage | ProbeToolBoxPages | PropertySheetDialog | This object lets you work with property sheets dialog boxes in PC-DMIS. |
| QualificationSettings | TheQualificationSettingsobject specifies how to calibrate your probe. The calibration process tells PC-DMIS the location and diameter of the probe tip. For more information on calibrating the probe, see the "Defining Probes" topic in the PC-DMIShelp file. |
| QuickFeatureSelection | QuickFeatureSelection Object |
| QuickStart | QuickStartAddedCommands | QuickStartStep | QuickStartSteps | QuickStartTask | ReadoutWindow | This object lets you work with PC-DMIS's Probe Readout window. |
| RegistrySetting | RegistrySettings | ReportControl | This lets you get or set properties for a specific Reporting object. |
| ReportControls | TheReportControlsobject gives you access to a variety of controls such as buttons, text boxes, and other items that you can add to, remove, and otherwise manipulate on a particular section of a report template. |
| ReportData | TheReportDataobject lets you access data sent to reports during theEventReportDataevent. |
| ReportTemplate | TheReportTemplateobject allows you to get or set various settings for a report template. |
| ReportTemplates | TheReportTemplatesobject contains all open report templates in PC-DMIS's Report Template editor. |
| ReportWindow | TheReportWindowobject allows you to get or set various settings for the Report window. |
| RoutineExecutionTimeManager | Scan | Scanobjects are created from more genericCommandobjects to pass information specific to the scan command back and forth. At present only DCC and Manual scans are user accessible. |
| Section | TheSectionobject lets you manipulate a particular section from the collection of availableSelectionsusedby areport template. |
| Sections | TheSectionsobject contains a collection of all existing Section tabs for a given report template in PC-DMIS's Report Template editor. |
| STATISTICS | TheStatisticsobject gives access to the properties and data members of the PC-DMIS Statistics command. |
| Strategies | ThisStrategiesobject contains a collection of the PC-DMIS measurement strategies.You can access the Strategies object through thestrategiesproperty in theCommandobject. |
| Strategy | ThisStrategyobject lets you manipulate a specific strategy contained within theStrategiescollection. |
| StringArray | This object holds an array of strings. It is created with the GetStringArray method. |
| Target | Targets | TempComp | TheTempCompobject gives access to the properties of the PC-DMIS Temperature Compensation command. For additional information about Temperature Compensation, see "Compensating for Temperature" in the "Setting Your Preferences"sectionof thePC-DMIS Help File. |
| Tip | TheTipobject describes a single tip of a probe. All of its properties are read-only. |
| Tips | TheTipsobject is the collection of allTipobjects for aProbeobject. TheProbeobject that theTipsstoreTipobjects for is contained in the Parent property. |
| tool | TheToolobject represents a single probe calibration tool. |
| ToolkitInternalCommands | Toolkit Internal Commands Collection Object |
| Tools | TheToolscollection object contains the tools available to the parentPartProgramobject. |
| TRACEFIELD | TheTracefieldobject gives access to the name and value properties of the PC-DMIS Tracefield command. For additional information on this command see "Using Trace Field" in the "Tracking Statistical Data"sectionof thePC-DMIS documentation. |
| tutorhit | Variable | PC-Dmis Variable Object |
| VariableArray | Enumeration | Description |
| AUTOVECTORTYPES | BringToZPositionMode | This enuermated list defines the possible values you can use to set the Z order for a dialog box or window. |
| BSBOUNDCOND_ENUM | BSCANHIT_ENUM | BSCANMETH_ENUM | BSCANNMODE_ENUM | BSCANOPMODE_ENUM | BSCTRLPT_ENUM | BSF_ENUM | CATCHTYPE | CREATEIDTYPE | DATA_TYPE_TYPES | DCCMODE | DialogTypes | Only dialog boxes that fire Open and Close events are in this enumeration. |
| DIMAXISTYPE | DIMFORMATFLAG | DIMFORMATTYPE | EDGE_MEASURE_TYPES | ENUM_ALIGN_WORKPLANE | ENUM_AXIS_TYPE | ENUM_BEST_FIT_MATH_TYPES | ENUM_BITMAP_LAYOUT | ENUM_BUTTON_TYPE | ENUM_CAD_COLLECTIONS | ENUM_CAD_GEOMETRY_FILTER_FLAGS | ENUM_CAD_LINE_INTERSECT_FLAGS | ENUM_CAD_RESULT | ENUM_CAD_SURFACE_BOUNDARY_OPTION | ENUM_CAD_VECTOR_OPTION | ENUM_CADPRINTOPTIONS | ENUM_CALIBRATION_EXECUTE_MODE | ENUM_COLOR_SECTION | ENUM_COMMANDNUMBER | ENUM_DIM_AXISTYPE | ENUM_DIM_OUTPUTTYPE | ENUM_DIM_PERP_PARALLEL | ENUM_DIM_PROF_TYPE | ENUM_DIM_RADIUS_TYPE | ENUM_DIM_TP_MATERIAL_CONDITION | ENUM_DIM_TP_MODIFIER | ENUM_DIM_TP_USE_AXIS | ENUM_DINFO_FIELD_TYPES | ENUM_DINFO_LOC_AXES | ENUM_DINFO_TP_AXES | ENUM_DMIS_OUTPUT_THEOS | ENUM_DMIS_OVERWRITE | ENUM_DTYPE_GETDBTYPE | ENUM_DTYPE_GETVARIABLETYPE | ENUM_ERROR_MODES | ENUM_ERROR_TYPES | ENUM_FEATREF_TYPES | ENUM_FEATURE_TYPES | ENUM_FIELD_DATA_TYPES | ENUM_FIELD_TYPES | ENUM_FILE_IO_TYPES | ENUM_FILE_OPEN_TYPES | ENUM_FILTER_TYPES | ENUM_GENERIC_ALIGN | ENUM_GENERIC_DISPLAY | ENUM_GENERIC_TYPES | ENUM_HATCH_STYLE | Enum_Language_Type | ENUM_MARK_NEW_ALIGNMENT_MODE | ENUM_MASTERSLAVEDIALOG_MEASUREARM | ENUM_MASTERSLAVEDIALOG_MEASUREDCC | ENUM_PAGE_FORMAT | ENUM_PAGE_ORIENTATION | ENUM_PCD_COMMENT_TYPES | ENUM_PCD_ON_OFF | ENUM_PCD_STAT_TYPES | ENUM_PCDMSG_RETVALS | ENUM_PCDMSG_TYPES | ENUM_PLANE_TYPE | ENUM_POINT_INFO_TYPES | ENUM_PRESS_BUTTON_RESULTS | ENUM_QUAL_CREATE_REPLACE | ENUM_RELEASE_TYPE | ENUM_REPORT_TEMPLATE_OBJECTS | ENUM_RMEAS_MODE | ENUM_RMEAS_MODE_NEW | ENUM_SCAN_INOUT_TYPES | ENUM_STAT_NAME_TYPES | ENUM_TIPTYPES | ENUM_TOOL_MOVED | ENUM_TRANSFORMATION_TYPES | ENUM_VISION_TARGET_EDGE_SELECTION | ENUM_VISION_TARGET_FOCUS_RANGE | ENUM_VISION_TARGET_POINT_DENSITY | ENUM_VISION_TARGET_TYPE | ERRORMODES | ERRORTYPES | EVALUATION_TYPES | FDATA_COORDSYS | FDATA_DATASET | FDATA_TYPES | FHITDATA_TYPES | FPOINT_TYPES | FVECTOR_TYPES | GETIDTYPE | GUESSTYPE | HIGH_POINT_SEARCH_MODES | IJKTYPES | ITERATEFLAGS | MachineConnectionStatus | This enumerated list shows the possible values for theConnectionStatusproperty. |
| MOVEDIRECTION | MOVETYPE | OBTYPE | The Object Type, or OBTYPE, is a special member of the Application (or PCDLRN) object. It contains several constant values tied to enumerations. You can use these values when working with the Commands.Add method and the Command.Type property.The following list shows the available OBTYPE constants and their equivalent enumerations. These enumerated values are of type LONG: |
| PAXISTYPE | PCDBAUD | PCDCOMMENT | PCDDATABITS | PCDDIMTYPES | PCDFILEPRINTFORMAT | PCDGETPOINTSTYPES | PCDHANDSHAKE | PCDMEASTHEO | PCDONOFF | PCDPARITY | PCDPRINTFILEMODE | PCDPRINTLOC | PCDREPORTSETTINGS | PCDSCANDIR1 | PCDSCANDIR2 | PCDSCANHITFLAG | PCDSCANHITTYPE | PCDSCANTECHNIQUE | PCDSCANVECTOR | PCDSCANVECTORSURF | PCDSTARTDIMFLAGS | PCDSTARTFEATFLAGS | PCDSTARTFEATTYPES | PCDSTARTSCANFLAGS | PCDSTARTSCANTYPES | PCDSTATSFLAGS | PCDSTOPBITS | PCDYESNO | Probe_Tool_Page | PropertySheetTypes | QdasOutputFileToggleType | QUALIFICATION_SETTINGS_MODE | RPROGOPTIONSTYPE | RPROGVALUESTYPE | RPT_MIRROR_OPT | RS_ACCESS | RS_GROUP | ScreenColorGradientType | TOOLTYPES | TraceDataSourceEnum | TraceValueTypeEnum | UNITTYPE | VARIABLE_TYPE_TYPES | WAXISTYPE | WPLANETYPE | WPROGOPTIONSTYPE | WPROGVALUESTYPE | XMLImport_StatusCode | XYZTYPES

---

## PCDLRN gettingstarted

# Getting Started - PC-DMIS 2020 R1 Object Library

To get started using PC-DMIS automation, consider using this information:

Accessing an Object's Properties, Methods and Events

Using the Object Browser in Other Editors

Sample Automation Scripts

Object Hierarchy Chart

| Getting Started |

---

## PCDLRN introduction

# Getting Started - PC-DMIS 2020 R1 Object Library

PC-DMIS's Automation gives you the ability to automate repetitive tasks within PC-DMIS or even to use elements of PC-DMIS functionality, within a custom built application.

PC-DMIS Automation contains these benefits:

This Automation section contains a detailed list of methods and properties for each PC-DMIS Automation Object. The various objects are listed in alphabetical order. A bold item indicates a default property or method for the object.

To get started with Automation, see the information on the "Getting Started Page" to get a feel for what's needed. For questions beyond the scope of this section, consult a Visual BASIC book on automation.

Overview of Object Library

| Introduction |

---

## PCDLRN references

# References

| References |

---

## Using the Object Heirarchy Chart

# Using the Object Hierarchy Chart

# See Also

You often need to know where an object is within the overal structure of objects in order to access that object's properties and methods. You can use theObject Hierarchy Chartto see this hierarchal structure.

In addition, anObject Browseris available in many VBA editors (such as Micrsoft Excel). That browser may also help you understand object hierarchy.

You can access the Object Hierarchy chart from the "See Object Hierarchy Chart" link at the top of each topic.

The Object Hierarchy Chart shows the hierarchal relationship of all the objects in PC-DMIS's type library from left to right. The left-most item is PCDLRN.

Object Hierarchy Chart Using the Object Browser in Other Editors

| Using the Object Hierarchy Chart |

---

## Using the Object Browser in Other Editors

# Using the Object Browser in Other Editors

While the PC-DMIS Basic Script Editor has its uses, it doesn’t have a lot of the visual syntax and other programming aids that are available in other common programs that also support automation.

The Object Browser, available in standard Visual Basic Editors, is essential to getting the proper help when writing automation scripts. It contains all the different objects for any library you have chosen to use in your automation project.

Example Object Browser

To set up the object browser with the appropriate libraries, do the following:

Open Visual Basic (or you can open the VB editor that ships with MS Word or MS Excel)

In Visual Basic, select theR**eferencesm**enu item. In VB5 this isPro**ject | References. (**In Excel or Word’s VB Editor, selectTool**s | References).**

TheR**eferencesd**ialog box appears. Items that are checked are libraries already included currently.

Scroll down to PC-DMIS X.X Object Library (where X.X is your library version type that matches the version of PC-DMIS you want to automate, and select the check box.

ClickO**K.**

Access the Object Browser (press F2 within the VB Editor). In the list at the top it should say <All Libraries>. From the list, select theP**CDLRNl**ibrary.

You can now browse through all the objects and view their properties, methods, and events. Most of the objects have properties and methods in the PC-DMIS object library. Only a few objects have events.

Additionally, when writing code, your Visual Basic Editor will now contain the visual syntax aids for the various PC-DMIS objects and commands.

| Using the Object Browser in Other Editors |

1. Open Visual Basic (or you can open the VB editor that ships with MS Word or MS Excel)
2. In Visual Basic, select the References menu item. In VB5 this is Project | References. (In Excel or Word’s VB Editor, select Tools | References).
3. The References dialog box appears. Items that are checked are libraries already included currently.
4. Scroll down to PC-DMIS X.X Object Library (where X.X is your library version type that matches the version of PC-DMIS you want to automate, and select the check box.
5. Click OK.
6. Access the Object Browser (press F2 within the VB Editor). In the list at the top it should say <All Libraries>. From the list, select the PCDLRN library.

---

## Windows 7 Automation Notes

# Windows 7 Automation Notes

A restriction in Windows 7 may prevent an automation application running at a lesser privilege level to run another application at a higher level. Noteably this occurs when using C# as the automation language.

For example, if you ran PC-DMIS manually using the "Run as Administrator" option, your computer remembers this in a manifest. If you then attempt to run PC-DMIS via your custom automation application, but that application uses a lesser privilege level, it will fail to automate PC-DMIS.

If this occurs, either run PC-DMIS as a standard user or run the custom automation application using the higher privilege level expected by PC-DMIS.

Other things to try:

1. Run your program as administrator to make sure the problem is not caused by Win7 UAC.

2. Do NOT use "new PCDLRN.Application" to create PCDLRN.Application object, since it could cause PC-DMIS version problems. Try to use CreateInstance(type) as shown in the example below to create the application object instead.

3. When you add pcdlrn reference into your project, it is better to add interoperation library (normally named Interop.PCDLRN.dll) instead of directly adding the PCDLRN COM registered in your system. If not, your custom application won't do anything when you uninstall PC-DMIS, or if you've installed PC-DMIS but have not yet ran it as an administrator for the first time.4. If you are distributing the custom application onto other computers, ensure that when PC-DMIS is installed on those computers, it is started as an administrator at least once so PC-DMIS will register itself.

```vbscript
    private void StartPcdmis() 
    {
      FormMain main = (FormMain)this.MdiParent;
      Type comType = null;
      object comObj = null;
      try
      {
        //Get type of Application through ProgID of PC-DMIS Application.
        comType = Type.GetTypeFromProgID("PCDLRN.Application");
        //Create instance of PC-DMIS through application type
        comObj = Activator.CreateInstance(comType);
      }
      catch (System.Exception em)
      {
        MessageBox.Show(em.Message);
      }
      main.pcdApplication = comObj as PCDLRN.Application;
      main.pcdApplication.Visible = false;
    }
```

| Windows 7 Automation Notes |

---

## object hierarchy chart

# Object Hierarchy Chart

#### Object 
 Hierarchy Chart

#### Textual 
	 Object Hierarchy

The chart below shows the hierarchal relationship (starting 
 with PCDLRN and moving from left to right) of all the objects in PC-DMIS's 
 type library. You will find this chart useful when coding your scripts.

Additionally, under the chart you will see aTextual 
 Object Heirarchyif you want to search for an item using the find 
 functionality in your browser:

PCDLRN

(Back 
				 to Object Hierarchy Chart)

| PCDLRNApplicationActivePartProgram 
						 (PartProgram)ApplicationEvents 
						 (ApplicationObjectEvents)ApplicationSettingsAutomationSettingsAutoTriggerGetRegistryPoint 
						 (PointData)GetRegistrySettings 
						 (RegistrySettings)RegistrySettingLabelTemplatesLabelTemplateLabelControlsMachinesMachineFPanelPointDataVariableArrayPartProgramsPartProgramActiveMachine 
								 (Machine)BundledStationsBundledStationCadModelCadPolyLinesOnSurfaceCadPolyLineOnSurfaceCadPointsOnSurfaceCadPointOnSurfaceGetEmptyCadHandle 
									 (CadHandle)CadWindowsCadWindowCommandsCommandActiveTipAlignCmndDmisMatrixPointDataArrayIndexAttachBasicScanPointDataCalibrationCommentDataTypesDataTypeDimensionCmdDimFormatDimInfoDispMetafileExternalCommandFeatCmdPointDataTargetsTargetFileIOFlowControlCmdLEAPFROGLoadMachineLoadProbeModalCmdMoveCmdPointDataOPTIONPROBEOptMotionScanControlPointPointDataSTATISTICSTempCompTRACEFIELDVariablePointDataDefaultDimensionColorsDmisMatrixPointDataEditWindowExecutedCommandsItem 
									 (Command)orFindByUniqueID 
									 (Command)ExecutionWindowLIVWindowMasterSlaveDlgPointDataOldBasicOptimizePathPartProgramSettingsDefaultDimensionColors 
									 (DefaultDimensionColors)ProbesProbeTipsTipPointDataQualificationSettingsGetTool 
											 (Tool)ReadoutWindowReportWindowPagesPageReportControlsReportControlToolsToolPointDataQuickStartQuickStartTaskQuickStartStepsQuickStartStepStrategiesStrategyVariablePointDataCommandValue 
										 (Command)PortLockReportTemplatesReportTemplateColorsColorSectionsSectionReportControlsReportControlCommandAnalysisWindowHOBPointInfoListHOBPointInfoSpawnNewInstance 
						 (Application)(Back 
				 to Object Hierarchy Chart) |

- Application
  - ActivePartProgram 
						 (PartProgram)
  - ApplicationEvents 
						 (ApplicationObjectEvents)
  - ApplicationSettings
  - AutomationSettings
  - AutoTrigger
  - GetRegistryPoint 
						 (PointData)
  - GetRegistrySettings 
						 (RegistrySettings)
    - RegistrySetting
  - LabelTemplates
    - LabelTemplate
      - LabelControls
  - Machines
    - Machine
      - FPanel
      - PointData
      - VariableArray
  - PartPrograms
    - PartProgram
      - ActiveMachine 
								 (Machine)
      - BundledStations
        - BundledStation
      - CadModel
        - CadPolyLinesOnSurface
          - CadPolyLineOnSurface
            - CadPointsOnSurface
              - CadPointOnSurface
        - GetEmptyCadHandle 
									 (CadHandle)
      - CadWindows
        - CadWindow
      - Commands
        - Command
          - ActiveTip
          - AlignCmnd
            - DmisMatrix
            - PointData
          - ArrayIndex
          - Attach
          - BasicScan
            - PointData
          - Calibration
          - Comment
          - DataTypes
            - DataType
          - DimensionCmd
          - DimFormat
          - DimInfo
          - DispMetafile
          - ExternalCommand
          - FeatCmd
            - PointData
            - Targets
              - Target
          - FileIO
          - FlowControlCmd
          - LEAPFROG
          - LoadMachine
          - LoadProbe
          - ModalCmd
          - MoveCmd
            - PointData
          - OPTIONPROBE
          - OptMotion
          - Scan
            - ControlPoint
            - PointData
          - STATISTICS
          - TempComp
          - TRACEFIELD
          - Variable
            - PointData
      - DefaultDimensionColors
      - DmisMatrix
        - PointData
      - EditWindow
      - ExecutedCommands
        - Item 
									 (Command) or FindByUniqueID 
									 (Command)
      - ExecutionWindow
      - LIVWindow
      - MasterSlaveDlg
        - PointData
      - OldBasic
      - OptimizePath
      - PartProgramSettings
      - 
        - DefaultDimensionColors 
									 (DefaultDimensionColors)
      - Probes
        - Probe
          - Tips
            - Tip
              - PointData
          - QualificationSettings
            - GetTool 
											 (Tool)
      - ReadoutWindow
      - ReportWindow
        - Pages
          - Page
            - ReportControls
              - ReportControl
      - Tools
        - Tool
          - PointData
      - QuickStart
        - QuickStartTask
          - QuickStartSteps
            - QuickStartStep
      - Strategies
      - Variable
        - PointData
          - CommandValue 
										 (Command)
  - PortLock
  - ReportTemplates
    - ReportTemplate
      - Colors
        - Color
      - Sections
        - Section
          - ReportControls
            - ReportControl
              - Command
              - AnalysisWindow
                - HOBPointInfoList
                  - HOBPointInfo
  - SpawnNewInstance 
						 (Application)
