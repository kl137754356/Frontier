# PC-DMIS Reference: Machine

## BundledStation

# BundledStation Object

# Object Model

# See Also

BundledStation Members

| BundledStation Object |

# BundledStation Object Members

# Public Methods

# Public Properties

# See Also

BundledStation Object

SetActive Set the station as current active station

_ID Application Read Only: returns the Application Object ID Read Only: Returns the identifier of the Station IndexID Read Only: Returns the index of the Station IsActive Read Only: returns Active status Locked Read/Write: Returns/Sets the Locked flag Matrix Read/Write: Returns/Sets a DmisMatrix object representing station matrix Oriented Read/Write: Returns/Sets the Oriented flag Parent Read Only: returns the parent BundeldStations object

| BundledStation ObjectMembers |

| SetActive | Set the station as current active station |

| _ID | Application | Read Only: returns the Application Object |
| ID | Read Only: Returns the identifier of the Station |
| IndexID | Read Only: Returns the index of the Station |
| IsActive | Read Only: returns Active status |
| Locked | Read/Write: Returns/Sets the Locked flag |
| Matrix | Read/Write: Returns/Sets a DmisMatrix object representing station matrix |
| Oriented | Read/Write: Returns/Sets the Oriented flag |
| Parent | Read Only: returns the parent BundeldStations object |

### Application

BundledStation Object|BundledStation Members

### ID

BundledStation Object|BundledStation Members

### IndexID

BundledStation Object|BundledStation Members

### IsActive

BundledStation Object|BundledStation Members

### Locked

BundledStation Object|BundledStation Members

### Matrix

BundledStation Object|BundledStation Members

### Oriented

BundledStation Object|BundledStation Members

### Parent

BundledStation Object|BundledStation Members

### SetActive

BundledStation Object|BundledStation Members

### _ID

BundledStation Object|BundledStation Members


---

## BundledStations

# BundledStations Object

# Object Model

# See Also

BundledStations Members

| BundledStations Object |

# BundledStations Object Members

# Public Methods

# Public Properties

# See Also

BundledStations Object

_Item Add Adds a new Station Item Selects a Station by ID string or Index number Remove Removes a Station by ID string or Index number

ActiveStation Read/Write: Returns/Sets the active Station Application Read Only: Returns the Application Object Count Read Only: Returns the number of stations Parent Read Only: Returns the parent measurement routine

| BundledStations ObjectMembers |

| _Item | Add | Adds a new Station |
| Item | Selects a Station by ID string or Index number |
| Remove | Removes a Station by ID string or Index number |

| ActiveStation | Read/Write: Returns/Sets the active Station |
| Application | Read Only:  Returns the Application Object |
| Count | Read Only:  Returns the number of stations |
| Parent | Read Only:  Returns the parent measurement routine |

### ActiveStation

BundledStations Object|BundledStations Members

### Add

BundledStations Object|BundledStations Members

### Application

BundledStations Object|BundledStations Members

### Count

BundledStations Object|BundledStations Members

### Item

BundledStations Object|BundledStations Members

### Parent

BundledStations Object|BundledStations Members

### Remove

BundledStations Object|BundledStations Members

### _Item

BundledStations Object|BundledStations Members


---

## Machine

# Machine Object

# Description

# Object Model

# Example

# See Also

TheM****achin**eo**bject represents a CMM, or a virtual off-line "machine". TheMachineobjects are contained in theMachi**nescolle**ction.

TheM**achineo**bject is primarily an event source.

Machine Members|ReadoutWindow Object

The ******Mac**hi**ne** object represents a CMM, or a virtual off-line "machine". The Machine objects are contained in the **Machines** collection. The Machine object is primarily an event source.

Examples are provided in some of the methods below.

Machine Members | ReadoutWindow Object

| Machine Object |

# Machine Object Members

# Public Methods

# Public Properties

# Events

# See Also

This removes the last hit from the hit buffer as if you had pressed ALT and - (minus) on the keyboard in PC-DMIS.

This inserts a move point as if you had pressed theP**rintb**utton on your jog box or pressed CTRL + M keys in PC-DMIS.

This acts as if you had pressed theD**ONEbu**tton on the jog box.

Returns the name of the Machine object.

Returns the read-onlyM**achinesc**ollection object to which the machine belongs.

This event is called when a command button is pressed on the CMM controller. TheC*odec*an be used to determine which button was pressed.

Machine Object|ReadoutWindow Object

DeletePoint This removes the last hit from the hit buffer as if you had pressed ALT and - (minus) on the keyboard in PC-DMIS. ExecuteCustomCommand This command lets you execute special operations in the Leitz interface. GetArray This returns an array of values from the machine. InsertMovePoint This inserts a move point as if you had pressed the Print bu**tton **on your jog box or pressed CTRL + M keys in PC-DMIS. PressDone This acts as if you had pressed the DONE button **on th**e jog box.

_Name Appl**ication Rep**resents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. For example, the ActivePar**tProgram pr**operty returns a PartProgram object. ConnectionStatus This read-only propery displays the current connection status of the machine. DriverVersion This read-only property returns the driver version for your measurement machine. It returns version information from the machine interface call driver_get_version. FPanel Returns the read-only FPanel object if your controller is indeed an FPanel controller. IsFPanel Determines whether or not the controller is an FPanel controller. ManAutoSelector Read Only: Returns the MAN/AUTO selector position (-1=Undefined 0=MAN, 1=AUTO) Name Returns the name of the Machine object. Parent Returns the read-only Machi**nes coll**ection object to which the machine belongs. ProbePosition Read Only: Returns the position of the probe in machine coordinates

Command This event is called when a command button is pressed on the CMM controller. The C*ode *can be used to determine which button was pressed. DistanceToClosestCAD Event fired when a DistanceToClosestCAD is received from the machine controller DistanceToTarget Event fired when a DistanceToTarget is received from the machine controller ErrorMsg This event is called when an error occurs on the CMM. The ErrorText variable contains the error message, and the ErrorType variable contains the type of error (missed hit, unexpected hit). ExecuteHit This event will be called in your application when a hit is taken in PC-DMIS in execute mode. The values of X, Y, Z and I, J, K are the location of the hit and the vector of the hit in machine coordinates. ExecuteManualScanHit Event fired when scan hit is taken by machine in execute mode FeatureID Event fired when a FeatureID is received from the machine controller FeatureType Event fired when a FeatureType is received from the machine controller LearnHit This event will be called in your application when a hit is taken in PC-DMIS in learn mode. The values of X, Y, Z and I, J, K are the location of the hit and the vector of the hit in machine coordinates. Readout Event fired when a readout is received from the machine controller ReadoutExt Event fired when a readout is received from the machine controller - matches XYZ display RMS Event fired when a RMS is received from the machine controller

Machine Object | ReadoutWindow Object

| Machine ObjectMembers |

| DeletePoint | This removes the last hit from the hit buffer as if you had pressed ALT and - (minus) on the keyboard in PC-DMIS. |
| ExecuteCustomCommand | This command lets you execute special operations in the Leitz interface. |
| GetArray | This returns an array of values from the machine. |
| InsertMovePoint | This inserts a move point as if you had pressed thePrintbutton on your jog box or pressed CTRL + M keys in PC-DMIS. |
| PressDone | This acts as if you had pressed theDONEbutton on the jog box. |

| _Name | Application | Represents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects. For example, the ActivePartProgram property returns aPartProgramobject. |
| ConnectionStatus | This read-only propery displays the current connection status of the machine. |
| DriverVersion | This read-only property returns the driver version for your measurement machine. It returns version information from the machine interface call driver_get_version. |
| FPanel | Returns the read-only FPanel object if your controller is indeed an FPanel controller. |
| IsFPanel | Determines whether or not the controller is an FPanel controller. |
| ManAutoSelector | Read Only:  Returns the MAN/AUTO selector position (-1=Undefined 0=MAN, 1=AUTO) |
| Name | Returns the name of the Machine object. |
| Parent | Returns the read-onlyMachinescollection object to which the machine belongs. |
| ProbePosition | Read Only:  Returns the position of the probe in machine coordinates |

| Command | This event is called when a command button is pressed on the CMM controller. TheCodecan be used to determine which button was pressed. |
| DistanceToClosestCAD | Event fired when a DistanceToClosestCAD is received from the machine controller |
| DistanceToTarget | Event fired when a DistanceToTarget is received from the machine controller |
| ErrorMsg | This event is called when an error occurs on the CMM. The ErrorText variable contains the error message, and the ErrorType variable contains the type of error (missed hit, unexpected hit). |
| ExecuteHit | This event will be called in your application when a hit is taken in PC-DMIS in executemode. The values of X, Y, Z and I, J, K are the location of the hit and the vector of the hit in machine coordinates. |
| ExecuteManualScanHit | Event fired when scan hit is taken by machine in execute mode |
| FeatureID | Event fired when a FeatureID is received from the machine controller |
| FeatureType | Event fired when a FeatureType is received from the machine controller |
| LearnHit | This event will be called in your application when a hit is taken in PC-DMIS in learn mode. The values of X, Y, Z and I, J, K are the location of the hit and the vector of the hit in machine coordinates. |
| Readout | Event fired when a readout is received from the machine controller |
| ReadoutExt | Event fired when a readout is received from the machine controller - matches XYZ display |
| RMS | Event fired when a RMS is received from the machine controller |

### Application

Represents the read-only PC-DMIS application. The **Application** object includes properties and methods that return top-level objects. For example, the Active**PartProgram** property returns a PartProgram object.

### Command_EV

This event is called when a command button is pressed on the CMM controller. TheC*odec*an be used to determine which button was pressed.

### ConnectionStatus

This read-only propery displays the current connection status of the machine.

### DeletePoint

This removes the last hit from the hit buffer as if you had pressed ALT and - (minus) on the keyboard in PC-DMIS.

### DistanceToClosestCAD_EV

Event fired when a DistanceToClosestCAD is received from the machine controller

### DistanceToTarget_EV

Event fired when a DistanceToTarget is received from the machine controller

### DriverVersion

Here are three examples for different machine interfaces:

### ErrorMsg_EV

This event is called when an error occurs on the CMM. The ErrorText variable contains the error message, and the ErrorType variable contains the type of error (missed hit, unexpected hit).

### ExecuteCustomCommand

The command to execute. Each command may require a number of input and output values, these value can be integer or double.

### ExecuteHit_EV

This event will be called in your application when a hit is taken in PC-DMIS in execute mode. The values of X, Y, Z and I, J, K are the location of the hit and the vector of the hit in machine coordinates.

### ExecuteManualScanHit_EV

Event fired when scan hit is taken by machine in execute mode

### FPanel

Returns the read-only FPanel object if your controller is indeed an FPanel controller.

### FeatureID_EV

Event fired when a FeatureID is received from the machine controller

### FeatureType_EV

Event fired when a FeatureType is received from the machine controller

### GetArray

This returns an array of values from the machine.

### InsertMovePoint

This inserts a move point as if you had pressed theP**rintb**utton on your jog box or pressed CTRL + M keys in PC-DMIS.

### IsFPanel

Determines whether or not the controller is an FPanel controller.

### LearnHit_EV

This event will be called in your application when a hit is taken in PC-DMIS in learn mode. The values of X, Y, Z and I, J, K are the location of the hit and the vector of the hit in machine coordinates.

### ManAutoSelector

Read Only: Returns the MAN/AUTO selector position (-1=Undefined 0=MAN, 1=AUTO)

### Name

Returns the name of the Machine object.

### Parent

Returns the read-onlyM**achinesc**ollection object to which the machine belongs.

### PressDone

This acts as if you had pressed theD**ONEbu**tton on the jog box.

### ProbePosition

Read Only: Returns the position of the probe in machine coordinates

### RMS_EV

Event fired when a RMS is received from the machine controller

### ReadoutExt_EV

Event fired when a readout is received from the machine controller - matches XYZ display

### Readout_EV

Event fired when a readout is received from the machine controller

### _Name

Visual Basic Public Property _Name As String


---

## Machines

# Machines Object

# Description

# Object Model

# Remarks

# See Also

Machines Members

The ********Ma**c**hin**e**s object is the collection of all Machine objects currently available in PC-DMIS. Each Machine object is bound to exactly one **PartProgram** object, and *vice versa* . Use Machines** ( i*n*dex ) where index is the index number or on-line machine’s name to return a single Machine object.

There may be multiple machines named "OFFLINE", one for each open off-line measurement routine. To distinguish between them, use the index number, or use the machine’s Parent member.

| Machines Object |

# Machines Object Members

# Public Methods

# Public Properties

# See Also

Represents the number of Machine objects currently active in PC-DMIS.

Machines Object

_Item Item This returns a specific Mac**hine obj**ect from a list of machines.

Ap****plication** R**epresents the read-only PC-DMIS Application. The Application object includes properties and methods that return top-level objects. For example, the ActiveP****artProgra**m **property returns a PartProgram object. Count Represents the number of Machine objects currently active in PC-DMIS. Parent Represents the read-only PC-DMIS Application . The Application object includes properties and methods that return top-level objects. For example, the ActivePartProgram property returns a PartProgram object.

| Machines ObjectMembers |

| _Item | Item | This returns a specificMachineobject from a list of machines. |

| Application | Represents the read-only PC-DMIS Application. TheApplicationobject includes properties and methods that return top-level objects. For example, the ActivePartProgram property returns aPartProgramobject. |
| Count | Represents the number of Machine objects currently active in PC-DMIS. |
| Parent | Represents the read-only PC-DMISApplication. The Application object includes properties and methods that return top-level objects. For example, the ActivePartProgram property returns aPartProgramobject. |

### Application

Represents the read-only PC-DMIS **Application**. The Application object includes properties and methods that return top-level objects. For example, the Active**PartProgram** property returns a PartProgram object.

### Count

Represents the number of Machine objects currently active in PC-DMIS.

### Item

There may be several machines named "OFFLINE". To avoid possible confusion with off-line machines, use the index number with these machines. Since the Item method is the default, the function name can be omitted.

### Parent

Represents the read-only PC-DMIS **Application** . The Application object includes properties and methods that return top-level objects. For example, the Activ**ePartProgra**m property returns a PartProgram object.

### _Item

Visual Basic Public Function _Item( _ ByVal Na*meorNum A*s Variant _ ) As Machine


---

## MasterSlaveDlg

# MasterSlaveDlg Object

# Description

# Object Model

# See Also

MasterSlaveDlg Members

The **MasterSlaveDlg** object gets called when the PartProgram.MasterSlaveDlg method is used.

| MasterSlaveDlg Object |

# MasterSlaveDlg Object Members

# Public Methods

# Public Properties

# See Also

This read-only object returns theA**pplicationob**ject.

Gets or sets whether the Master / Slave calibration is a manual (0) or DCC (1) calibration.

Gets or sets which arm or arms measure the calibration sphere.

This read-only object returns the parentA**pplicationob**ject.

MasterSlaveDlg Object

Calibrate Runs the Master/Slave calibration process.

Application This read-only object returns the A****pplication** o**bject. DCC Gets or sets whether the Master / Slave calibration is a manual (0) or DCC (1) calibration. MasterProbe Gets or sets which probe is used on the Master machine. The names are taken from the owning Pa**rtProgram o**bject's Probes collection. MasterTip Gets or sets which tip is used on the Master machine. The names are taken from the owning PartProgram object's Probes collection. MeasuringArm Gets or sets which arm or arms measure the calibration sphere. Parent This read-only object returns the parent Application object. Position Gets or sets the first (or only) sphere position. SlaveProbe Gets or sets which probe is used on the Slave machine. The names are taken from the owning PartProgram object's Probes collection. SlaveTip Gets or sets which tip is used on the Slave machine. The names are taken from the owning PartProgram object's Probes collection. tool Gets or sets which calibration tool is being measured during the calibration process. The names are taken from the owning PartProgram object's To**ols c**ollection. Visible Determines whether or not the Master / Slave dialog box is visible.

| MasterSlaveDlg ObjectMembers |

| Calibrate | Runs the Master/Slave calibration process. |

| Application | This read-only object returns theApplicationobject. |
| DCC | Gets or sets whether the Master / Slave calibration is a manual (0) or DCC (1) calibration. |
| MasterProbe | Gets or sets which probe is used on the Master machine. The names are taken from the owning PartProgram object's Probes collection. |
| MasterTip | Gets or sets which tip is used on the Master machine. The names are taken from the owning PartProgram object's Probes collection. |
| MeasuringArm | Gets or sets which arm or arms measure the calibration sphere. |
| Parent | This read-only object returns the parentApplicationobject. |
| Position | Gets or sets the first (or only) sphere position. |
| SlaveProbe | Gets or sets which probe is used on the Slave machine. The names are taken from the owning PartProgram object's Probes collection. |
| SlaveTip | Gets or sets which tip is used on the Slave machine. The names are taken from the owning PartProgram object's Probes collection. |
| tool | Gets or sets which calibration tool is being measured during the calibration process. The names are taken from the owningPartProgramobject'sToolscollection. |
| Visible | Determines whether or not the Master / Slave dialog box is visible. |

### Application

This read-only object returns theA**pplicationob**ject.

### Calibrate

Using this method is the same as clicking theC**alibratebu**tton on the Master / Slave Calibration dialog box inside the application itself.

### DCC

Gets or sets whether the Master / Slave calibration is a manual (0) or DCC (1) calibration.

### MasterProbe

MasterSlaveDlg Object|MasterSlaveDlg Members

### MasterTip

MasterSlaveDlg Object|MasterSlaveDlg Members

### MeasuringArm

Gets or sets which arm or arms measure the calibration sphere.

### Parent

This read-only object returns the parentA**pplicationob**ject.

### Position

MasterSlaveDlg Object|MasterSlaveDlg Members

### SlaveProbe

MasterSlaveDlg Object|MasterSlaveDlg Members

### SlaveTip

MasterSlaveDlg Object|MasterSlaveDlg Members

### Visible

MasterSlaveDlg Object|MasterSlaveDlg Members

### tool

MasterSlaveDlg Object|MasterSlaveDlg Members|Tools Property|Probes Property

