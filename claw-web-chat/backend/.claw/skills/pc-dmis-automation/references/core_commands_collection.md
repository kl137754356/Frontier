# PC-DMIS Reference: Core Commands Collection

## Commands

# Commands Object

# Description

# Object Model

# Remarks

# Example

# See Also

Commands Members

The ****Comma**nds** object contains all the Command objects in a measurement routine.

Use ****Comma**nds** **( in*d*ex ) where index is the index number to return a single Command object.

For an example, see the example in GetReferencedFeature .

| Commands Object |

# Commands Object Members

# Public Methods

# Public Properties

# See Also

Returns aC****omman**do**bject representing the current PC-DMIS command. Note that if you use the Commands.Add method prior to this property, the current command returned will be the last added command from the Add method. Read-onlyCommandobject.

Returns aC****omman**do**bject representing the last command in the measurement routine. Read-onlyCommandobject.

Commands Object

_Item Add This method adds a Com****mand.** A**ddByCreationGuid Adds a new command to the command collection AddCmdOfName Adds a new command to the command collection passing a name AddConstPointWithValues Adds a new Constructed Point to the command collection with values for actual X,Y,Z AddDimensionWithValues Adds a new Dimension to the command collection with values for actual X,Y,Z AddMultiConstPoints Adds a multiple Constructed Points to the command collection with values for actual X,Y,Z ClearAllBreakpoints Clears all the breakpoints on all Com**mand obj**ects in the collection. You should use this method if you don’t want to step through the execution of a measurement routine. ClearMarked Clears all marked Command objects in the collection. ClearMarked always returns TRUE. FindByUniqueID Finds a command identified by the HiPart and LoPart parameters. InsertionPointAfter Sets the insertion point after a specified command. Item Returns a specific Command object from a Com****mands **co**llection. MarkAll Marks all the commands in a Commands collection. RemoveCommandRange Deletes a range of commands SetCurrentCommand Set Current Command

Application Read Only: Returns the Application Object Count Represents the number of Co********m**ma**nd** o**bjects in the parent Pa****rtProgram **o**bject. CurrentAlignment Read Only: Returns the current alignment CurrentCommand Returns a Command object representing the current PC-DMIS command. Note that if you use the Commands.Add method prior to this property, the current command returned will be the last added command from the Add method. Read-only Command object. LastCommand Returns a Command object representing the last command in the measurement routine. Read-only Command object. Parent Returns the parent PartProgram object. Read-only.

| Commands ObjectMembers |

| _Item | Add | This method adds a Command. |
| AddByCreationGuid | Adds a new command to the command collection |
| AddCmdOfName | Adds a new command to the command collection passing a name |
| AddConstPointWithValues | Adds a new Constructed Point to the command collection with values for actual X,Y,Z |
| AddDimensionWithValues | Adds a new Dimension to the command collection with values for actual X,Y,Z |
| AddMultiConstPoints | Adds a multiple Constructed Points to the command collection with values for actual X,Y,Z |
| ClearAllBreakpoints | Clears all the breakpoints on allCommandobjects in the collection. You should use this method if you don’t want to step through the execution of a measurement routine. |
| ClearMarked | Clears all markedCommandobjects in the collection. ClearMarked always returns TRUE. |
| FindByUniqueID | Finds a command identified by the HiPart and LoPart parameters. |
| InsertionPointAfter | Sets the insertion point after a specified command. |
| Item | Returns a specificCommandobject from aCommandscollection. |
| MarkAll | Marks all the commands in aCommandscollection. |
| RemoveCommandRange | Deletes a range of commands |
| SetCurrentCommand | Set Current Command |

| Application | Read Only:  Returns the Application Object |
| Count | Represents the number of Command objects in the parentPartProgramobject. |
| CurrentAlignment | Read Only: Returns the current alignment |
| CurrentCommand | Returns aCommandobject representing the current PC-DMIS command. Note that if you use the Commands.Add method prior to this property, the current command returned will be the last added command from the Add method. Read-onlyCommandobject. |
| LastCommand | Returns aCommandobject representing the last command in the measurement routine. Read-onlyCommandobject. |
| Parent | Returns the parentPartProgramobject. Read-only. |

### Add

RequiredB**ooleant**hat determines what should happen when the newCom**mandobj**ect is being inserted in an inappropriate place in the measurement routine.

### AddByCreationGuid

Adds a new command to the command collection

### AddCmdOfName

Adds a new command to the command collection passing a name

### AddConstPointWithValues

Adds a new Constructed Point to the command collection with values for actual X,Y,Z

### AddDimensionWithValues

Adds a new Dimension to the command collection with values for actual X,Y,Z

### AddMultiConstPoints

Adds a multiple Constructed Points to the command collection with values for actual X,Y,Z

### Application

Read Only: Returns the Application Object

### ClearAllBreakpoints

Clears all the breakpoints on all **Command** objects in the collection. You should use this method if you don’t want to step through the execution of a measurement routine.

### ClearMarked

Clears all marked **Command** objects in the collection. ClearMarked always returns TRUE.

### Count

Represents the number of Command objects in the parent **PartProgram** object.

### CurrentAlignment

Read Only: Returns the current alignment

### CurrentCommand

Returns aC****omman**do**bject representing the current PC-DMIS command. Note that if you use the Commands.Add method prior to this property, the current command returned will be the last added command from the Add method. Read-onlyCommandobject.

### FindByUniqueID

Finds a command identified by the HiPart and LoPart parameters.

### InsertionPointAfter

Sets the insertion point after a specified command.

### Item

Returns a specific **Command **object from a **Commands** collection.

### LastCommand

Returns aC****omman**do**bject representing the last command in the measurement routine. Read-onlyCommandobject.

### MarkAll

Marks all the commands in a **Commands** collection.

### Parent

Returns the parent **PartProgram **object. Read-only.

### RemoveCommandRange

Deletes a range of commands

### SetCurrentCommand

Set Current Command

### _Item

Visual Basic Public Function _Item( _ ByVal Na*meorNum A*s Variant _ ) As Command


---

## ExecutedCommands

# ExecutedCommands Object

# Description

# Object Model

# See Also

ExecutedCommands Members

The **Executed****Comm**an**ds** object acts much like the Commands object except that it only contains a collection of the *executed* commands from the last measurement routine execution, while the Commands object contains all the commands in the measurement routine.

| ExecutedCommands Object |

# ExecutedCommands Object Members

# Public Methods

# Public Properties

# See Also

Finds a command by a unique ID usingH*ighParta*ndLoP*artpara*meters.

The Count property returns a number indicating how many commands were executed.

ExecutedCommands Object

_Item FindByUniqueID Finds a command by a unique ID using Hig*hPart an*d LoP*art par*ameters. Item The Item method returns the executed command specified by the provided index number in Num* .*

Application The Application property returns the application object. Count The Count property returns a number indicating how many commands were executed. Parent The Parent property returns the parent P**artProgram **object.

| ExecutedCommands ObjectMembers |

| _Item | FindByUniqueID | Finds a command by a unique ID usingHighPartandLoPartparameters. |
| Item | The Item method returns the executed command specified by the provided index number inNum. |

| Application | The Application property returns the application object. |
| Count | The Count property returns a number indicating how many commands were executed. |
| Parent | The Parent property returns the parentPartProgramobject. |

### Application

ExecutedCommands Object|ExecutedCommands Members

### Count

The Count property returns a number indicating how many commands were executed.

### FindByUniqueID

Finds a command by a unique ID usingH*ighParta*ndLoP*artpara*meters.

### Item

ExecutedCommands Object|ExecutedCommands Members

### Parent

ExecutedCommands Object|ExecutedCommands Members

### _Item

ExecutedCommands Object|ExecutedCommands Members


---

## PartPrograms

# PartPrograms Object

# Description

# Object Model

# Remarks

# See Also

TheP**artProgramso**bject contains all the openmeasurement routines in PC-DMIS.

Use Add to create a fresh new measurement routine and add it to theP**artProgramsc**ollection.

Use PartPrograms(**inde*x*) whereindexis the part name or index number to access an individual measurement routine.

PartPrograms Members

The **PartPrograms** object contains all the open measurement routines in PC-DMIS.

Use Add to create a fresh new measurement routine and add it to the **PartPrograms** collection. Use PartPrograms(** ind*e*x ) where index is the part name or index number to access an individual measurement routine.

| PartPrograms Object |

# PartPrograms Object Members

# Public Methods

# Public Properties

# See Also

PartPrograms Object

_Item Add The Add function creates a new measurement routine and activates it in PC-DMIS. If a measurement routine named Fil**eName e*x*ists, it is loaded and the Uni*ts pa*rameter is ignored. CloseAll Closes and deactivates all active measurement routines in PC-DMIS. CreateInspectionPlan Creates a new inspection plan with different CAD file name and adds it to the Par******tProgram**s** co**llection CreateInspectionPlanFromPlanXml Creates a new inspection plan with different CAD file name from a PlanXml file and adds it to the PartPrograms collection CreateRoutine Creates a new measurement routine with different CAD file name and adds it to the PartPrograms collection CreateRoutineFromInspectionPlan Creates a measurement routine from an inspection plan and then adds the routine as part of a PartPrograms collection. Item Returns a specific PartProgram object from the collection in the PartPrograms object. Open The Open function activates the measurement routine stored in the file FileName . If the file does not exist, nothing happens. OpenInspectionPlan Opens an inspection plan with different CAD file name and adds it to the PartPrograms collection OpenRoutine Opens an existing measurement routine with different CAD file name and adds it to the PartPrograms collection Remove The Remove function saves, closes, and deactivates the indicated measurement routine. That measurement routine is no longer active in PC-DMIS.

Ap**plication R**epresents the read-only PC-DMIS application. The A**pplication o**bject includes properties and methods that return top-level objects. For example, the A**ctiveP**artProgra**m **property returns a PartProgram object. Count Returns the number of measurement routines active in PC-DMIS. Parent Returns the parent object, in this case the Application object.

| PartPrograms ObjectMembers |

| _Item | Add | The Add function creates a new measurement routine and activates it in PC-DMIS. If a measurement routine namedFileNameexists, it is loaded and theUnitsparameter is ignored. |
| CloseAll | Closes and deactivates all active measurement routines in PC-DMIS. |
| CreateInspectionPlan | Creates a new inspection plan with different CAD file name and adds it to the PartPrograms collection |
| CreateInspectionPlanFromPlanXml | Creates a new inspection plan with different CAD file name from a PlanXml file and adds it to the PartPrograms collection |
| CreateRoutine | Creates a new measurement routine with different CAD file name and adds it to the PartPrograms collection |
| CreateRoutineFromInspectionPlan | Creates a measurement routine from an inspection plan and then adds the routine as part of aPartProgramscollection. |
| Item | Returns a specificPartProgramobject from the collection in thePartProgramsobject. |
| Open | The Open function activates the measurement routine stored in the fileFileName. If the file does not exist, nothing happens. |
| OpenInspectionPlan | Opens an inspection plan with different CAD file name and adds it to the PartPrograms collection |
| OpenRoutine | Opens an existing measurement routine with different CAD file name and adds it to the PartPrograms collection |
| Remove | The Remove function saves, closes, and deactivates the indicated measurement routine. That measurement routine is no longer active in PC-DMIS. |

| Application | Represents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects. For example, theActivePartProgramproperty returns aPartProgramobject. |
| Count | Returns the number of measurement routines active in PC-DMIS. |
| Parent | Returns the parent object, in this case theApplicationobject. |

### Add

The Add function creates a new measurement routine and activates it in PC-DMIS. If a measurement routine named *FileName* exists, it is loaded and the *Units* parameter is ignored.

### Application

Represents the read-only PC-DMIS application. The **Application** object includes properties and methods that return top-level objects. For example, the **Active**PartProgr**am** property returns a PartProgram object.

### CloseAll

Closes and deactivates all active measurement routines in PC-DMIS.

### Count

Returns the number of measurement routines active in PC-DMIS.

### CreateInspectionPlan

Creates a new inspection plan with different CAD file name and adds it to the PartPrograms collection

### CreateInspectionPlanFromPlanXml

Creates a new inspection plan with different CAD file name from a PlanXml file and adds it to the PartPrograms collection

### CreateRoutine

Creates a new measurement routine with different CAD file name and adds it to the PartPrograms collection

### CreateRoutineFromInspectionPlan

This is the file name to give the created measurement routine.

### Item

Returns a specific **PartProgram** object from the collection in the **PartPrograms** object.

### Open

The Open function activates the measurement routine stored in the file *FileName* . If the file does not exist, nothing happens.

### OpenInspectionPlan

Opens an inspection plan with different CAD file name and adds it to the PartPrograms collection

### OpenRoutine

Opens an existing measurement routine with different CAD file name and adds it to the PartPrograms collection

### Parent

Returns the parent object, in this case the **Application **object.

### Remove

The Remove function saves, closes, and deactivates the indicated measurement routine. That measurement routine is no longer active in PC-DMIS.

### _Item

Visual Basic Public Function _Item( _ ByVal Na*meorNum A*s Variant _ ) As PartProgram

