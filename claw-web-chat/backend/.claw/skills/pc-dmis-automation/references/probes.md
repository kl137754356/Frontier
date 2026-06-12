# PC-DMIS Reference: Probes

## ActiveTip

# ActiveTip Object

# Description

# Object Model

# See Also

ActiveTip Members

The **ActiveTip **object gives access to the properties of the PC-DMIS Set Active Tip command.

| ActiveTip Object |

# ActiveTip Object Members

# Public Methods

# Public Properties

# See Also

**String**value representing the ID of the tip to be made active.

ActiveTip Object

GenCalSphereHits Generate sphere hit points for calibration genHitsInfo Generate calibration hits and return hit count GetHits Get hit points buffer GetShankVector Gets the shank vector of the tip SetCalCircleVector Set M&H vector calibration circle vector SetCalData Set M&H vector calibration information SetCalSphereData Set M&H vector calibration qualified sphere data SetShankVector Sets the shank vector of the tip

Angle D**ouble **value representing the rotation angle of the tip transformation matrix. TipID S**tring **value representing the ID of the tip to be made active.

| ActiveTip ObjectMembers |

| GenCalSphereHits | Generate sphere hit points for calibration |
| genHitsInfo | Generate calibration hits and return hit count |
| GetHits | Get hit points buffer |
| GetShankVector | Gets the shank vector of the tip |
| SetCalCircleVector | Set M&H vector calibration circle vector |
| SetCalData | Set M&H vector calibration information |
| SetCalSphereData | Set M&H vector calibration qualified sphere data |
| SetShankVector | Sets the shank vector of the tip |

| Angle | Doublevalue representing the rotation angle of the tip transformation matrix. |
| TipID | Stringvalue representing the ID of the tip to be made active. |

### Angle

**Double** value representing the rotation angle of the tip transformation matrix.

### GenCalSphereHits

Generate sphere hit points for calibration

### GetHits

Get hit points buffer

### GetShankVector

Gets the shank vector of the tip

### SetCalCircleVector

Set M&H vector calibration circle vector

### SetCalData

Set M&H vector calibration information

### SetCalSphereData

Set M&H vector calibration qualified sphere data

### SetShankVector

Sets the shank vector of the tip

### TipID

**String**value representing the ID of the tip to be made active.

### genHitsInfo

Generate calibration hits and return hit count


---

## Calibration

# Calibration Object

# Description

# See Also

Calibration Members

The **Calibration** object allows for tip calibration during measurement routine execution. This object is placed into a measurement routine through the Add method of the ****Comma**nds** object and obtained from the Command object via the CalibrationCommand property.

| Calibration Object |

# Calibration Object Members

# Public Properties

# See Also

Determines whether or not the sphere used as the calibration tool has moved since the last tip calibration.

This returns or sets the ID of a sphere command that occurs prior to the calibration command. The sphere should have identical characteristics with the tool identified by ToolID.

Calibration Object

Moved Determines whether or not the sphere used as the calibration tool has moved since the last tip calibration. SphereID This returns or sets the ID of a sphere command that occurs prior to the calibration command. The sphere should have identical characteristics with the tool identified by ToolID. ToolID Returns or sets the ID of a previously defined calibration tool that is similar to the sphere identified by SphereID. The tool data is used in the tip calibration or reset depending on the value of the moved data member.

| Calibration ObjectMembers |

| Moved | Determines whether or not the sphere used as the calibration tool has moved since the last tip calibration. |
| SphereID | This returns or sets the ID of a sphere command that occurs prior to the calibration command. The sphere should have identical characteristics with the tool identified by ToolID. |
| ToolID | Returns or sets the ID of a previously defined calibration tool that is similar to the sphere identified by SphereID. The tool data is used in the tip calibration or reset depending on the value of the moved data member. |

### Moved

Determines whether or not the sphere used as the calibration tool has moved since the last tip calibration.

### SphereID

This returns or sets the ID of a sphere command that occurs prior to the calibration command. The sphere should have identical characteristics with the tool identified by ToolID.

### ToolID

Returns or sets the ID of a previously defined calibration tool that is similar to the sphere identified by SphereID. The tool data is used in the tip calibration or reset depending on the value of the moved data member.


---

## Probes

# Probes Object

# Description

# Object Model

# Remarks

# See Also

Probes Members

The **Probes** object is the collection of all Probe objects currently available to a measurement routine.

Use Probes (** ind*e*x ) where index is the index number or name of the requested probe file.

| Probes Object |

# Probes Object Members

# Public Methods

# Public Properties

# See Also

The Add function sets the probe name toF*ileName.* This allows the user to start creating a new probe.

TheC**ancelChangesf**unction cancels changes made to a probes collection and then closes the probes collection.

Represents the number of Machine objects currently active in PC-DMIS.

Gets or sets the current visible state of theP**robeso**bject. You can use this property to show or hide the current probe inside the Graphics Display window of PC-DMIS.

Probes Object

_Item Add The Add function sets the probe name to Fil*eName . *This allows the user to start creating a new probe. Can**celChanges Th**e CancelChanges function cancels changes made to a probes collection and then closes the probes collection. Item Returns the specified Pr**obe ob**ject from the collection of Probes. SaveChanges Save Changes made to the probes collection and closes the probes collection

Ap**plication R**epresents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. Count Represents the number of Machine objects currently active in PC-DMIS. Parent Returns the parent PartProgram of this object. Visible Gets or sets the current visible state of the Pr**obes o**bject. You can use this property to show or hide the current probe inside the Graphics Display window of PC-DMIS.

| Probes ObjectMembers |

| _Item | Add | The Add function sets the probe name toFileName. This allows the user to start creating a new probe. |
| CancelChanges | TheCancelChangesfunction cancels changes made to a probes collection and then closes the probes collection. |
| Item | Returns the specifiedProbeobject from the collection of Probes. |
| SaveChanges | Save Changes made to the probes collection and closes the probes collection |

| Application | Represents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects. |
| Count | Represents the number of Machine objects currently active in PC-DMIS. |
| Parent | Returns the parent PartProgram of this object. |
| Visible | Gets or sets the current visible state of theProbesobject. You can use this property to show or hide the current probe inside the Graphics Display window of PC-DMIS. |

### Add

The Add function sets the probe name toF*ileName.* This allows the user to start creating a new probe.

### Application

Represents the read-only PC-DMIS application. The **Application** object includes properties and methods that return top-level objects.

### CancelChanges

TheC**ancelChangesf**unction cancels changes made to a probes collection and then closes the probes collection.

### Count

Represents the number of Machine objects currently active in PC-DMIS.

### Item

Returns the specified **Probe **object from the collection of Probes.

### Parent

Returns the parent PartProgram of this object.

### SaveChanges

Save Changes made to the probes collection and closes the probes collection

### Visible

Gets or sets the current visible state of theP**robeso**bject. You can use this property to show or hide the current probe inside the Graphics Display window of PC-DMIS.

### _Item

Visual Basic Public Function _Item( _ ByVal Na*meorNum A*s Variant _ ) As probe


---

## QualificationSettings

# QualificationSettings Object

# Description

# Object Model

# See Also

QualificationSettings Members

The **QualificationSettings** object specifies how to calibrate your probe. The calibration process tells PC-DMIS the location and diameter of the probe tip. For more information on calibrating the probe, see the "Defining Probes" topic in the PC-DMIS help file .

| QualificationSettings Object |

# QualificationSettings Object Members

# Public Methods

# Public Properties

# See Also

This determines whether or not a map should be created or replaced. Read/Write.

This determines the ending A angle to use during qualification.

This determines the End Angle to use on the qualification tool.

This determines the angle increment to use for the A angle during qualification.

This determines the angle increment to for the B angle during qualification.

This determines the Calibration Mode. Either DCC or Manual.

This determines the number of hits to take around the calibration tool.

This determines the number of levels that to use in the calibration process. PC-DMIS divides the number of hits by the number of levels to determine how many hits will be taken on each level of the qualification tool.

This indicates whether angle A or B for a PHS system receives priority during the calibration process. TRUE means Angle A gets priority. FALSE means Angle B gets priority.

For PHS systems, this determines the PHS tolerance value.

This determines the Prehit distance to use during calibration.

This determines whether or not you'll calibrate the shank of the probe as well.

This determines the number of hits used to measure the shank.

This determines the starting A angle to use during qualification.

This determines the Start Angle to use on the qualification tool.

This indicates whether a tool has moved or not or if the user should be asked.

This indicates whether or not the tool is located on a rotary table.

This determines whether End Angle, Start Angle, and NumLevels are used in the calibration process, or if they're ignored.

This determines whether or not the calibration order is user defined.

QualificationSettings Object

GetTool This method returns a t**ool o**bject. SetTool Required expression that evaluates to a Q**ualificationSettings **object.

CreateReplaceMap This determines whether or not a map should be created or replaced. Read/Write. EndA This determines the ending A angle to use during qualification. EndAngle This determines the End Angle to use on the qualification tool. EndB This determines the ending B angle to use during qualification. EndC C Angle End Value ExecuteMode This determines the type of calibration action to take. IncrementA This determines the angle increment to use for the A angle during qualification. IncrementB This determines the angle increment to for the B angle during qualification. IncrementC C Angle Increment Value Mode This determines the Calibration Mode. Either DCC or Manual. MoveSpeed This determines the speed the probe moves during calibration. NumHits This determines the number of hits to take around the calibration tool. NumLevels This determines the number of levels that to use in the calibration process. PC-DMIS divides the number of hits by the number of levels to determine how many hits will be taken on each level of the qualification tool. PHSAPriority This indicates whether angle A or B for a PHS system receives priority during the calibration process. TRUE means Angle A gets priority. FALSE means Angle B gets priority. PHSTol For PHS systems, this determines the PHS tolerance value. PreHit This determines the Prehit distance to use during calibration. ShankCheck This determines whether or not you'll calibrate the shank of the probe as well. ShankHits This determines the number of hits used to measure the shank. ShankOffset Shank Offset for calibration StartA This determines the starting A angle to use during qualification. StartAngle This determines the Start Angle to use on the qualification tool. StartB This determines the starting B angle to use during qualification. StartC C Angle Start Value ToolMoved This indicates whether a tool has moved or not or if the user should be asked. ToolOnRotaryTable This indicates whether or not the tool is located on a rotary table. ToolOverideI This determines the I value for the Tool Override's IJK vector. ToolOverideJ This determines the J value for the Tool Override's IJK vector. ToolOverideK This determines the K value for the Tool Override's IJK vector. Touchspeed This determines the Touch Speed to use during calibration. UserDefinedCalibrationMode This determines whether End Angle, Start Angle, and NumLevels are used in the calibration process, or if they're ignored. UserDefinedCalibrationOrder This determines whether or not the calibration order is user defined.

| QualificationSettings ObjectMembers |

| GetTool | This method returns atoolobject. |
| SetTool | Required expression that evaluates to aQualificationSettingsobject. |

| CreateReplaceMap | This determines whether or not a map should be created or replaced. Read/Write. |
| EndA | This determines the ending A angle to use during qualification. |
| EndAngle | This determines the End Angle to use on the qualification tool. |
| EndB | This determines the ending B angle to use during qualification. |
| EndC | C Angle End Value |
| ExecuteMode | This determines the type of calibration action to take. |
| IncrementA | This determines the angle increment to use for the A angle during qualification. |
| IncrementB | This determines the angle increment to for the B angle during qualification. |
| IncrementC | C Angle Increment Value |
| Mode | This determines the Calibration Mode. Either DCC or Manual. |
| MoveSpeed | This determines the speed the probe moves during calibration. |
| NumHits | This determines the number of hits to take around the calibration tool. |
| NumLevels | This determines the number of levels that to use in the calibration process. PC-DMIS divides the number of hits by the number of levels to determine how many hits will be taken on each level of the qualification tool. |
| PHSAPriority | This indicates whether angle A or B for a PHS system receives priority during the calibration process. TRUE means Angle A gets priority. FALSE means Angle B gets priority. |
| PHSTol | For PHS systems, this determines the PHS tolerance value. |
| PreHit | This determines the Prehit distance to use during calibration. |
| ShankCheck | This determines whether or not you'll calibrate the shank of the probe as well. |
| ShankHits | This determines the number of hits used to measure the shank. |
| ShankOffset | Shank Offset for calibration |
| StartA | This determines the starting A angle to use during qualification. |
| StartAngle | This determines the Start Angle to use on the qualification tool. |
| StartB | This determines the starting B angle to use during qualification. |
| StartC | C Angle Start Value |
| ToolMoved | This indicates whether a tool has moved or not or if the user should be asked. |
| ToolOnRotaryTable | This indicates whether or not the tool is located on a rotary table. |
| ToolOverideI | This determines the I value for the Tool Override's IJK vector. |
| ToolOverideJ | This determines the J value for the Tool Override's IJK vector. |
| ToolOverideK | This determines the K value for the Tool Override's IJK vector. |
| Touchspeed | This determines the Touch Speed to use during calibration. |
| UserDefinedCalibrationMode | This determines whether End Angle, Start Angle, and NumLevels are used in the calibration process, or if they're ignored. |
| UserDefinedCalibrationOrder | This determines whether or not the calibration order is user defined. |

### CreateReplaceMap

This determines whether or not a map should be created or replaced. Read/Write.

### EndA

This determines the ending A angle to use during qualification.

### EndAngle

This determines the End Angle to use on the qualification tool.

### EndB

QualificationSettings Object|QualificationSettings Members

### EndC

QualificationSettings Object|QualificationSettings Members

### ExecuteMode

QualificationSettings Object|QualificationSettings Members

### GetTool

QualificationSettings Object|QualificationSettings Members

### IncrementA

This determines the angle increment to use for the A angle during qualification.

### IncrementB

This determines the angle increment to for the B angle during qualification.

### IncrementC

QualificationSettings Object|QualificationSettings Members

### Mode

This determines the Calibration Mode. Either DCC or Manual.

### MoveSpeed

QualificationSettings Object|QualificationSettings Members

### NumHits

This determines the number of hits to take around the calibration tool.

### NumLevels

This determines the number of levels that to use in the calibration process. PC-DMIS divides the number of hits by the number of levels to determine how many hits will be taken on each level of the qualification tool.

### PHSAPriority

This indicates whether angle A or B for a PHS system receives priority during the calibration process. TRUE means Angle A gets priority. FALSE means Angle B gets priority.

### PHSTol

For PHS systems, this determines the PHS tolerance value.

### PreHit

This determines the Prehit distance to use during calibration.

### SetTool

QualificationSettings Object|QualificationSettings Members

### ShankCheck

This determines whether or not you'll calibrate the shank of the probe as well.

### ShankHits

This determines the number of hits used to measure the shank.

### ShankOffset

QualificationSettings Object|QualificationSettings Members

### StartA

This determines the starting A angle to use during qualification.

### StartAngle

This determines the Start Angle to use on the qualification tool.

### StartB

QualificationSettings Object|QualificationSettings Members

### StartC

QualificationSettings Object|QualificationSettings Members

### ToolMoved

This indicates whether a tool has moved or not or if the user should be asked.

### ToolOnRotaryTable

This indicates whether or not the tool is located on a rotary table.

### ToolOverideI

QualificationSettings Object|QualificationSettings Members

### ToolOverideJ

QualificationSettings Object|QualificationSettings Members

### ToolOverideK

QualificationSettings Object|QualificationSettings Members

### Touchspeed

QualificationSettings Object|QualificationSettings Members

### UserDefinedCalibrationMode

This determines whether End Angle, Start Angle, and NumLevels are used in the calibration process, or if they're ignored.

### UserDefinedCalibrationOrder

This determines whether or not the calibration order is user defined.


---

## Tip

# Tip Object

# Description

# Object Model

# See Also

Tip Members

The **Tip** object describes a single tip of a probe. All of its properties are read-only.

| Tip Object |

> **TIP: Tip**
>
> DescriptionTheTipobject describes a single tip of a probe. All of its properties are read-only.Object ModelSee AlsoTip Members

> **TIP: Tip**
>
> DescriptionTheTipobject describes a single tip of a probe. All of its properties are read-only.Object ModelSee AlsoTip Members

> **TIP: Tip**
>
> TheTipobject describes a single tip of a probe. All of its properties are read-only.

# Tip Object Members

# Public Methods

# Public Properties

# See Also

Returns the A angle of the tip.

Returns the B angle of the tip.

Returns the PC-DMIS representation of the most recent calibration time of the tip.

Tip Object

ResetMeasToTheo Resets measured tip data back to theo values

a Returns the A angle of the tip. b Returns the B angle of the tip. C Read Only: Returns the C angle of the tip Date Returns the PC-DMIS representation of the most recent calibration date of the tip. diam Returns the diameter of the tip. DMISLabel Read/Write: Gets/Sets the tip's DMIS Label ID Returns the ID string of the tip. IJK A Poi**ntData ob**ject that returns the vector along which the tip lies. Read-only. MeasDiam Read/Write: Gets/Sets the measured diameter of the tip MeasThickness Read Only: Returns the measured thickness of the the tip MeasXYZ Read/Write: Gets/Sets the measured XYZ data of the tip Nickname Read/Write: Gets/Sets the tip's nickname Parent Returns the Tips c**olle**ction object that contains this tip. PrbRdv Read Only: Returns the PRBRDV value for an analog probe calibration Selected Determines whether tip is selected for qualification. StandardDeviation Read Only: Returns the standard deviation of the measured sphere after tip qualification Thickness Returns the nominal thickness of the tip. Time Returns the PC-DMIS representation of the most recent calibration time of the tip. TipNum Returns the tip number in the list of tips. TipType Returns the type of the tip. WristOffset Returns the wrist offset of the tip. WristTipIJK Returns the wrist tip vector of the tip. XYZ Returns the location of the tip.

| Tip ObjectMembers |

| ResetMeasToTheo | Resets measured tip data back to theo values |

| a | Returns the A angle of the tip. |
| b | Returns the B angle of the tip. |
| C | Read Only:  Returns the C angle of the tip |
| Date | Returns the PC-DMIS representation of the most recent calibration date of the tip. |
| diam | Returns the diameter of the tip. |
| DMISLabel | Read/Write: Gets/Sets the tip's DMIS Label |
| ID | Returns the ID string of the tip. |
| IJK | APointDataobject that returns the vector along which the tip lies. Read-only. |
| MeasDiam | Read/Write:  Gets/Sets the measured diameter of the tip |
| MeasThickness | Read Only:  Returns the measured thickness of the the tip |
| MeasXYZ | Read/Write:  Gets/Sets the measured XYZ data of the tip |
| Nickname | Read/Write: Gets/Sets the tip's nickname |
| Parent | Returns theTipscollection object that contains this tip. |
| PrbRdv | Read Only:  Returns the PRBRDV value for an analog probe calibration |
| Selected | Determines whether tip is selected for qualification. |
| StandardDeviation | Read Only:  Returns the standard deviation of the measured sphere after tip qualification |
| Thickness | Returns the nominal thickness of the tip. |
| Time | Returns the PC-DMIS representation of the most recent calibration time of the tip. |
| TipNum | Returns the tip number in the list of tips. |
| TipType | Returns the type of the tip. |
| WristOffset | Returns the wrist offset of the tip. |
| WristTipIJK | Returns the wrist tip vector of the tip. |
| XYZ | Returns the location of the tip. |

### C

Read Only: Returns the C angle of the tip

### DMISLabel

Read/Write: Gets/Sets the tip's DMIS Label

### Date

Returns the PC-DMIS representation of the most recent calibration date of the tip.

### ID

Returns the ID string of the tip.

### IJK

A **PointData** object that returns the vector along which the tip lies. Read-only.

### MeasDiam

Read/Write: Gets/Sets the measured diameter of the tip

### MeasThickness

Read Only: Returns the measured thickness of the the tip

### MeasXYZ

Read/Write: Gets/Sets the measured XYZ data of the tip

### Nickname

Read/Write: Gets/Sets the tip's nickname

### Parent

Returns the **Tips** collection object that contains this tip.

### PrbRdv

Read Only: Returns the PRBRDV value for an analog probe calibration

### ResetMeasToTheo

Resets measured tip data back to theo values

### Selected

Determines whether tip is selected for qualification.

### StandardDeviation

Read Only: Returns the standard deviation of the measured sphere after tip qualification

### Thickness

Returns the nominal thickness of the tip.

### Time

Returns the PC-DMIS representation of the most recent calibration time of the tip.

### TipNum

This is PC-DMIS’s internal representation of tip number. It may be different from the number passed to Tips.Itemto retrieve the tip.

### TipType

The following tip types are defined. They can be combined via bitwise operations.

### WristOffset

Returns the wrist offset of the tip.

### WristTipIJK

Returns the wrist tip vector of the tip.

### XYZ

Returns the location of the tip.

### a

Returns the A angle of the tip.

### b

Returns the B angle of the tip.

### diam

Returns the diameter of the tip.


---

## Tips

# Tips Object

# Description

# Object Model

# See Also

Tips Members

The ************T**ips** object is the collection of all Tip objects for a ****Pro**be **object. The Probe object that the Tips store Tip objects for is contained in the Parent property.

| Tips Object |

# Tips Object Members

# Public Methods

# Public Properties

# See Also

This function adds a new tip position to this collection. The new tip is unqualified.

Returns a specificT**ipob**ject from theTip**sobje**ct.

This function removes the indicatedT**ipo**bject from this collection.

Tips Object

_Item Add This function adds a new tip position to this collection. The new tip is unqualified. Item Returns a specific Tip**** o**b**ject from the Tip**s obj**ect. Remove This function removes the indicated Tip object from this collection.

Ap**plication R**epresents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. Count Represents the number of Tip objects in the parent P**robe **object. Parent Returns the parent Probe object.

| Tips ObjectMembers |

| _Item | Add | This function adds a new tip position to this collection. The new tip is unqualified. |
| Item | Returns a specificTipobject from theTipsobject. |
| Remove | This function removes the indicatedTipobject from this collection. |

| Application | Represents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects. |
| Count | Represents the number of Tip objects in the parent Probe object. |
| Parent | Returns the parentProbeobject. |

> **TIP: Tip**
>
> Public Methods_ItemAddThis function adds a new tip position to this collection. The new tip is unqualified.ItemReturns a specificTipobject from theTipsobject.RemoveThis function removes the indicatedTipobject from this collection.Public PropertiesApplicationRepresents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects.CountRepresents the number of Tip objects in the parent Probe object.ParentReturns the parentProbeobject.See AlsoTips Object

> **TIP: Tip**
>
> Public Methods_ItemAddThis function adds a new tip position to this collection. The new tip is unqualified.ItemReturns a specificTipobject from theTipsobject.RemoveThis function removes the indicatedTipobject from this collection.Public PropertiesApplicationRepresents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects.CountRepresents the number of Tip objects in the parent Probe object.ParentReturns the parentProbeobject.See AlsoTips Object

> **TIP: Tip**
>
> _ItemAddThis function adds a new tip position to this collection. The new tip is unqualified.ItemReturns a specificTipobject from theTipsobject.RemoveThis function removes the indicatedTipobject from this collection.

> **TIP: Tip**
>
> Returns a specificTipobject from theTipsobject.

> **TIP: Tip**
>
> This function removes the indicatedTipobject from this collection.

### Add

This function adds a new tip position to this collection. The new tip is unqualified.

### Application

Represents the read-only PC-DMIS application. The **Application** object includes properties and methods that return top-level objects.

### Count

Represents the number of Tip objects in the parent Probe object.

### Item

Returns a specificT**ipob**ject from theTip**sobje**ct.

### Parent

Returns the parent **Probe** object.

### Remove

This function removes the indicatedT**ipo**bject from this collection.

### _Item

Visual Basic Public Function _Item( _ ByVal Na*meorNum A*s Variant _ ) As Tip


---

## Tools

# Tools Object

# Description

# Object Model

# Remarks

# See Also

Tools Members

The **Tools** collection object contains the tools available to the parent **PartProgram** object.

Use ****To**ols** **( in*d*ex ) where index is the index number or tool name to return a single Tool object.

| Tools Object |

# Tools Object Members

# Public Methods

# Public Properties

# See Also

Tools Object

_Item Add This function adds a new tool to this collection. The new tool is unqualified. Item Returns the tool object with the specified ID Remove This function removes the indicated Too**l ob**ject from this collection.

Ap**plication R**epresents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. Count Represents the number of T**ool **objects in the parent P****artProgram** **object. Parent Returns the parent PartProgram object.

| Tools ObjectMembers |

| _Item | Add | This function adds a new tool to this collection. The new tool is unqualified. |
| Item | Returns the tool object with the specified ID |
| Remove | This function removes the indicatedToolobject from this collection. |

| Application | Represents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects. |
| Count | Represents the number ofToolobjects in the parentPartProgramobject. |
| Parent | Returns the parentPartProgramobject. |

### Add

This function adds a new tool to this collection. The new tool is unqualified.

### Application

Represents the read-only PC-DMIS application. The **Application** object includes properties and methods that return top-level objects.

### Count

Represents the number of **Tool** objects in the parent **PartProgram** object.

### Item

Returns the tool object with the specified ID

### Parent

Returns the parent **PartProgram **object.

### Remove

This function removes the indicated **Tool** object from this collection.

### _Item

Visual Basic Public Function _Item( _ ByVal ID* A*s Variant _ ) As tool


---

## probe

# probe Object

# Description

# Object Model

# See Also

probe Members

The ****Pro**be** object provides information about a given probe description file. It also allows you to manipulate the Probe dialog in PC-DMIS.

| probe Object |

# probe Object Members

# Public Methods

# Public Properties

# See Also

Clears all tips selected for qualification. Use the "Probe.SelectAllTips" functionto select all tips. Use the "Tip.Selected" property of the tip objectto select or deselect individual tips for probe qualification.

Opens the PC-DMISP**robe Utilitiesdi**alog box.

Qualifies all of the probe's tips.

Selects all tips in tip list for qualification.

Represents the highlighted probe connection in PC-DMIS’s Probe dialog’s connection drop-down list.

Returns the number of components in the component list box. There is always at least one, even when it appears that there are no entries. In that case, the one entry is invisible, but it can still be made active.

Returns the full name of the file containing this probe’s information.

Returns the name of the file containing this probe’s information.

Returns the path to the file containing this probe’s information.

Returns the Qualify Settings object that can be modified and passed into the Qualify2 method. It supports these parameters:

StartA - Returns the starting A angle of the probeEndA - Returns the ending A angle of the probeIncrementA - Returns the increment value for automatically generated A angles between the starting A angle of the probe and the ending A angle of the probe.StartB - Returns the starting B angle of the probeEndB - Returns the ending B angle of the probeIncrementB - Returns the increment value for automatically generated B angles between the starting B angle of the probe and the ending B angle of the probe.

Determines whether or not a wrist map is used.

probe Object

ClearAllTips Clears all tips selected for qualification. Use the "Probe.SelectAllTips" function to select all tips. Use the "Tip.Selected" property of the tip object to select or deselect individual tips for probe qualification. ComponentDescription This function returns a string which is the nth component description of the component list box as determined by the I**tem* *parameter. ConnectionDescription Returns the Item number string in the connection drop down list. Dialog Opens the PC-DMIS P**robe Utilities d**ialog box. Qualify Qualifies all of the probe's tips. Qualify2 Calibrates the probe tips using settings passed in via the Q**ualificationSettings **object. ResetMeasToTheoForTips Resets measured tip data for all tips back to theo values SelectAllTips Selects all tips in tip list for qualification.

ActiveComponent Represents the highlighted probe component in PC-DMIS’s P**robe **dialog box. ActiveConnection Represents the highlighted probe connection in PC-DMIS’s Probe dialog’s connection drop-down list. Appl**ication Rep**resents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. For example, the ActivePar**tProgram pr**operty returns a PartProgram object. ComponentCount Returns the number of components in the component list box. There is always at least one, even when it appears that there are no entries. In that case, the one entry is invisible, but it can still be made active. ConnectionCount Returns the number of connections in the connection drop-down list. The contents of this list depend on which component is active. FullName Returns the full name of the file containing this probe’s information. Name Returns the name of the file containing this probe’s information. Parent Returns the Probes** colle**ction object to which this object belongs. Path Returns the path to the file containing this probe’s information. QualificationSettings Returns the Qualify Settings object that can be modified and passed into the Qualify2 method. It supports these parameters: StartA - Returns the starting A angle of the probe EndA - Returns the ending A angle of the probe IncrementA - Returns the increment value for automatically generated A angles between the starting A angle of the probe and the ending A angle of the probe. StartB - Returns the starting B angle of the probe EndB - Returns the ending B angle of the probe IncrementB - Returns the increment value for automatically generated B angles between the starting B angle of the probe and the ending B angle of the probe. Tip**s Re**turns the Tips object associated with this Probe object. UseWristMap Determines whether or not a wrist map is used.

| probe ObjectMembers |

| ClearAllTips | Clears all tips selected for qualification. Use the "Probe.SelectAllTips" functionto select all tips. Use the "Tip.Selected" property of the tip objectto select or deselect individual tips for probe qualification. |
| ComponentDescription | This function returns a string which is the nth component description of the component list box as determined by theItemparameter. |
| ConnectionDescription | Returns theItemnumber string in the connection drop down list. |
| Dialog | Opens the PC-DMISProbe Utilitiesdialog box. |
| Qualify | Qualifies all of the probe's tips. |
| Qualify2 | Calibrates the probe tips using settings passed in via theQualificationSettingsobject. |
| ResetMeasToTheoForTips | Resets measured tip data for all tips back to theo values |
| SelectAllTips | Selects all tips in tip list for qualification. |

| ActiveComponent | Represents the highlighted probe component in PC-DMIS’s Probe dialog box. |
| ActiveConnection | Represents the highlighted probe connection in PC-DMIS’s Probe dialog’s connection drop-down list. |
| Application | Represents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects. For example, the ActivePartProgram property returns aPartProgramobject. |
| ComponentCount | Returns the number of components in the component list box. There is always at least one, even when it appears that there are no entries. In that case, the one entry is invisible, but it can still be made active. |
| ConnectionCount | Returns the number of connections in the connection drop-down list. The contents of this list depend on which component is active. |
| FullName | Returns the full name of the file containing this probe’s information. |
| Name | Returns the name of the file containing this probe’s information. |
| Parent | Returns theProbescollection object to which this object belongs. |
| Path | Returns the path to the file containing this probe’s information. |
| QualificationSettings | Returns the Qualify Settings object that can be modified and passed into the Qualify2 method. It supports these parameters:StartA - Returns the starting A angle of the probeEndA - Returns the ending A angle of the probeIncrementA - Returns the increment value for automatically generated A angles between the starting A angle of the probe and the ending A angle of the probe.StartB - Returns the starting B angle of the probeEndB - Returns the ending B angle of the probeIncrementB - Returns the increment value for automatically generated B angles between the starting B angle of the probe and the ending B angle of the probe. |
| Tips | Returns theTipsobject associated with thisProbeobject. |
| UseWristMap | Determines whether or not a wrist map is used. |

### ActiveComponent

The following VB code illustrates how to create a probe containing a PH9, a TP2, and a 5 mm tip, from scratch in the active measurement routine.

### ActiveConnection

Represents the highlighted probe connection in PC-DMIS’s Probe dialog’s connection drop-down list.

### Application

Represents the read-only PC-DMIS application. The **Application** object includes properties and methods that return top-level objects. For example, the Active**PartProgram** property returns a PartProgram object.

### ClearAllTips

Clears all tips selected for qualification. Use the "Probe.SelectAllTips" functionto select all tips. Use the "Tip.Selected" property of the tip objectto select or deselect individual tips for probe qualification.

### ComponentCount

Returns the number of components in the component list box. There is always at least one, even when it appears that there are no entries. In that case, the one entry is invisible, but it can still be made active.

### ComponentDescription

This function returns a string which is the nth component description of the component list box as determined by the *Item* parameter.

### ConnectionCount

Returns the number of connections in the connection drop-down list. The contents of this list depend on which component is active.

### ConnectionDescription

Returns the *Item* number string in the connection drop down list.

### Dialog

Opens the PC-DMISP**robe Utilitiesdi**alog box.

### FullName

Returns the full name of the file containing this probe’s information.

### Name

Returns the name of the file containing this probe’s information.

### Parent

Returns the **Probes** collection object to which this object belongs.

### Path

Returns the path to the file containing this probe’s information.

### QualificationSettings

Returns the Qualify Settings object that can be modified and passed into the Qualify2 method. It supports these parameters:

### Qualify

Qualifies all of the probe's tips.

### Qualify2

Calibrates the probe tips using settings passed in via the **QualificationSettings** object.

### ResetMeasToTheoForTips

Resets measured tip data for all tips back to theo values

### SelectAllTips

Selects all tips in tip list for qualification.

### Tips

Returns the **Tips** object associated with this **Probe** object.

### UseWristMap

Determines whether or not a wrist map is used.


---

## tool

# tool Object

# Description

# Object Model

# Remarks

# See Also

tool Members

The **Tool** object represents a single probe calibration tool.

Use ****To**ols** **( in*d*ex ) where index is the index number or tool name to return a single Tool object.

| tool Object |

# tool Object Members

# Public Properties

# See Also

Returns the diameter of the tip.

Returns the width of the tool.

tool Object

_ID Appl**ication Rep**resents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. DatumDepthEnd Read/Write: Specifies the maximum depth into the bore where the bore cylinder is the datum. Vision tool only DatumDepthStart Read/Write: Specifies the minimum depth into the bore where the bore cylinder is the datum. Vision tool only diam Returns the diameter of the tip. FocusOffset Read/Write: Specifies the distance in Z from the top surface to the bore circle focus height. Vision tool only ID Returns the ID string of the tip. Parent Returns the parent Tools o**bject.** ShankIJK Returns the shank vector of the tool as a PointDa**ta . Tool**Type Returns the type of the tool. Width Returns the width of the tool. XYZ Returns the location of the tool.

| tool ObjectMembers |

| _ID | Application | Represents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects. |
| DatumDepthEnd | Read/Write:  Specifies the maximum depth into the bore where the bore cylinder is the datum. Vision tool only |
| DatumDepthStart | Read/Write:  Specifies the minimum depth into the bore where the bore cylinder is the datum. Vision tool only |
| diam | Returns the diameter of the tip. |
| FocusOffset | Read/Write:  Specifies the distance in Z from the top surface to the bore circle focus height. Vision tool only |
| ID | Returns the ID string of the tip. |
| Parent | Returns the parentToolsobject. |
| ShankIJK | Returns the shank vector of the tool as aPointData. |
| ToolType | Returns the type of the tool. |
| Width | Returns the width of the tool. |
| XYZ | Returns the location of the tool. |

### Application

Represents the read-only PC-DMIS application. The **Application** object includes properties and methods that return top-level objects.

### DatumDepthEnd

Read/Write: Specifies the maximum depth into the bore where the bore cylinder is the datum. Vision tool only

### DatumDepthStart

Read/Write: Specifies the minimum depth into the bore where the bore cylinder is the datum. Vision tool only

### FocusOffset

Read/Write: Specifies the distance in Z from the top surface to the bore circle focus height. Vision tool only

### ID

Returns the ID string of the tip.

### Parent

Returns the parent **Tools **object.

### ShankIJK

Returns the shank vector of the tool as a **PointData** .

### ToolType

Returns the type of the tool.

### Width

Returns the width of the tool.

### XYZ

Returns the location of the tool.

### _ID

Visual Basic Public Property _ID As String

### diam

Returns the diameter of the tip.

