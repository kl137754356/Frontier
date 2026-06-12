# PC-DMIS Reference: Misc

## Attach

# Attach Object

# Description

# See Also

Attach Members

The **Attach** object attaches measurement routines to the current measurement routine. The current measurement routine can then access objects from the attached measurement routines.

| Attach Object |

# Attach Object Members

# Public Properties

# See Also

This returns or sets a BOOLEAN value that determines whether or not the attached measurement routine should be executed when PC-DMIS encounters the attached routine.

ID associated with the attached measurement routine. This ID identifies items in the attached measurement routine. For example, if the ID for the attach statement is "PART2", then feature "F1" in the attached routine can be referred to as "F1:PART2".

File name of the attached measurement routine.

Attach Object

AttachedAlign ID associated with an alignment in the attached program that corresponds with an alignment in the attaching routine. EXECUTE This returns or sets a BOOLEAN value that determines whether or not the attached measurement routine should be executed when PC-DMIS encounters the attached routine. ID ID associated with the attached measurement routine. This ID identifies items in the attached measurement routine. For example, if the ID for the attach statement is "PART2", then feature "F1" in the attached routine can be referred to as "F1:PART2". LocalAlign ID associated with an alignment in the attaching program that corresponds to an alignment in the attached routine. PartName File name of the attached measurement routine.

| Attach ObjectMembers |

| AttachedAlign | ID associated with an alignment in the attached program that corresponds with an alignment in the attaching routine. |
| EXECUTE | This returns or sets a BOOLEAN value that determines whether or not the attached measurement routine should be executed when PC-DMIS encounters the attached routine. |
| ID | ID associated with the attached measurement routine. This ID identifies items in the attached measurement routine. For example, if the ID for the attach statement is "PART2", then feature "F1" in the attached routine can be referred to as "F1:PART2". |
| LocalAlign | ID associated with an alignment in the attaching program that corresponds to an alignment in the attached routine. |
| PartName | File name of the attached measurement routine. |

### AttachedAlign

ID associated with an alignment in the attached program that corresponds with an alignment in the attaching routine.

### EXECUTE

This returns or sets a BOOLEAN value that determines whether or not the attached measurement routine should be executed when PC-DMIS encounters the attached routine.

### ID

ID associated with the attached measurement routine. This ID identifies items in the attached measurement routine. For example, if the ID for the attach statement is "PART2", then feature "F1" in the attached routine can be referred to as "F1:PART2".

### LocalAlign

ID associated with an alignment in the attaching program that corresponds to an alignment in the attached routine.

### PartName

File name of the attached measurement routine.


---

## Autotrigger

# Autotrigger Object

# Description

# Example

# See Also

TheA**utotriggerob**ject automatically takes hits when the probe enters a specified zone.

Autotrigger Members

The Au**totrigger ob**ject automatically takes hits when the probe enters a specified zone.

Copy Code Dim AutoTrigger As PCDLRN.AutoTrigger If (AutoTrigger.autotriggeron = True ) Then MsgBox "Autotrigger is enabled." End If If (AutoTrigger.beepingon = True ) Then MsgBox "Autotrigger Beeping is enabled." End If Dim radius as Double Set radius = AutoTrigger.Radius MsgBox "The Autotrigger radius is: " & radius

```vbscript
Dim AutoTrigger As PCDLRN.AutoTrigger
If(AutoTrigger.autotriggeron = True) Then
 MsgBox "Autotrigger is enabled."
End If
If(AutoTrigger.beepingon = True) Then
 MsgBox "Autotrigger Beeping is enabled."
End If
Dim radius as Double
Set radius = AutoTrigger.Radius
MsgBox "The Autotrigger radius is: " & radius
```

| Autotrigger Object |

| DimAutoTriggerAsPCDLRN.AutoTriggerIf(AutoTrigger.autotriggeron =True)ThenMsgBox"Autotrigger is enabled."EndIfIf(AutoTrigger.beepingon =True)ThenMsgBox"Autotrigger Beeping is enabled."EndIfDimradiusasDoubleSetradius = AutoTrigger.RadiusMsgBox"The Autotrigger radius is: "& radius |

# Autotrigger Object Members

# Public Properties

# See Also

Autotrigger Object

autotriggeron Determines whether or not the Autotrigger feature is used when measuring. beepingon Determines whether or not the Beeping feature is used when the probe approaches the target. The closer you get to your target the more frequently you will hear the beeps. Radius Determines the size of the radius, or tolerance zone that surrounds the original hit location. When the probe enters this tolerance zone it will automatically take a hit.

| Autotrigger ObjectMembers |

| autotriggeron | Determines whether or not the Autotrigger feature is used when measuring. |
| beepingon | Determines whether or not the Beeping feature is used when the probe approaches the target. The closer you get to your target the more frequently you will hear the beeps. |
| Radius | Determines the size of the radius, or tolerance zone that surrounds the original hit location. When the probe enters this tolerance zone it will automatically take a hit. |

### Radius

Determines the size of the radius, or tolerance zone that surrounds the original hit location. When the probe enters this tolerance zone it will automatically take a hit.

### autotriggeron

Determines whether or not the Autotrigger feature is used when measuring.

### beepingon

Determines whether or not the Beeping feature is used when the probe approaches the target. The closer you get to your target the more frequently you will hear the beeps.


---

## Color

# Color Object

# Description

# Object Model

# See Also

Color Members

The **Color **object is used to automate color settings used in PC-DMIS's report templates.

| Color Object |

# Color Object Members

# Public Methods

# Public Properties

# See Also

All changes made to the Color object are done inside a temporary structure. This copies the changes made inside this temporary structure to the master structure, essentially saving your changes, making them permanent.

Color Object

DiscardChanges All changes made to the C**olor **object are done inside a temporary structure. To restore the saved values and overwrite any changes you made in the temporary structure, use this method. GetType Returns the Command Type or Color Section to which the color is associated. Remove Removes the current Color object from the C**olors c**ollection. SaveChanges All changes made to the Color object are done inside a temporary structure. This copies the changes made inside this temporary structure to the master structure, essentially saving your changes, making them permanent.

_Standard Appl**ication Rep**resents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. ColorParentType Returns the parent Command Type or Color Section ID. Debug Returns the Deb**ug col**or. Marked Returns the Marked color. MarkedBackground Returns the Marked background color OutTol Returns the out-of-tolerance color. Parent Returns the parent Col**ors col**lection. STANDARD Returns the working Standard color. StandardBackground Returns the working Standard background color.

| Color ObjectMembers |

| DiscardChanges | All changes made to the Color object are done inside a temporary structure. To restore the saved values and overwrite any changes you made in the temporary structure, use this method. |
| GetType | Returns the Command Type or Color Section to which the color is associated. |
| Remove | Removes the currentColorobject from theColorscollection. |
| SaveChanges | All changes made to the Color object are done inside a temporary structure. This copies the changes made inside this temporary structure to the master structure, essentially saving your changes, making them permanent. |

| _Standard | Application | Represents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects. |
| ColorParentType | Returns the parent Command Type or Color Section ID. |
| Debug | Returns theDebugcolor. |
| Marked | Returns the Marked color. |
| MarkedBackground | Returns the Marked background color |
| OutTol | Returns the out-of-tolerance color. |
| Parent | Returns the parentColorscollection. |
| STANDARD | Returns the working Standard color. |
| StandardBackground | Returns the working Standard background color. |

### Application

Represents the read-only PC-DMIS application. The **Application** object includes properties and methods that return top-level objects.

### ColorParentType

Returns the parent Command Type or Color Section ID.

### Debug

**Note on Colors:**Colors are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as a Long value:

### DiscardChanges

All changes made to the Color object are done inside a temporary structure. To restore the saved values and overwrite any changes you made in the temporary structure, use this method.

### GetType

**Longv**alue specifying the Command Type ID or Color Section ID.

### Marked

**Note on Colors:**Colors are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as a Long value:

### MarkedBackground

**Note on Colors:**Colors are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as a Long value:

### OutTol

**Note on Colors:**Colors are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as a Long value:

### Parent

Returns the parent **Colors **collection.

### Remove

Removes the current **Color** object from the **Colors **collection.

### STANDARD

**Note on Colors:**Colors are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as a Long value:

### SaveChanges

All changes made to the Color object are done inside a temporary structure. This copies the changes made inside this temporary structure to the master structure, essentially saving your changes, making them permanent.

### StandardBackground

**Note on Colors:**Colors are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as a Long value:

### _Standard

Visual Basic Public Property _Standard As Long


---

## Colors

# Colors Collection

# Description

# Object Model

# Remarks

# See Also

TheC****olo**rso**bject allows you to work with collections ofColorobjects. These are used to automate color settings used in PC-DMIS's report templates.

Use Colors.Add to create a new Color object and add it to the Colors collection.

Use Colors(*item*) whereitemis the command type or color section used to access an individual Color object.

Colors Members

The ****Col**ors** object allows you to work with collections of Color objects. These are used to automate color settings used in PC-DMIS's report templates.

Use Colors.Add to create a new Color object and add it to the Colors collection. Use Colors(* ite*m ) where item is the command type or color section used to access an individual Color object.

| Colors Collection |

# Colors Collection Members

# Public Methods

# Public Properties

# See Also

This method creates a new color node associated with the specified Command Type ID or Color Section ID, returning a Color object for the added node. Once you add a node, you can then define the colors used for the Standard, Marked, Debug, and OutTol.

This checks whether or not the specified Command Type or Color Section ID is valid in the current PC-DMIS configuration. If it is valid, it returns TRUE.

All changes made to the Colors collection are done inside a temporary structure. This copies the changes made inside this temporary structure to the master colors structure, essentially saving your changes, making them permanent.

This returns the color currently associated with the defined Command Type ID or Color Section ID. If a color is not defined for a feature type, the parent color is recursively searched until the default color is reached.

Colors Collection

Add This method creates a new color node associated with the specified Command Type ID or Color Section ID, returning a Color object for the added node. Once you add a node, you can then define the colors used for the Standard, Marked, Debug, and OutTol. BuildColortable Rebuild Color Table using the current colors. retuns the DiscardChanges All changes made to the Colors collection are done inside a temporary structure. To restore the saved values and overwrite any changes you made in the temporary structure, use this method. GetColorTableColor Returns the color specified by the col*orIndex pa*rameter from the template's color table. IsAllowed This checks whether or not the specified Command Type or Color Section ID is valid in the current PC-DMIS configuration. If it is valid, it returns TRUE. Item This method returns a specified color object from the color table based on the UID1 and UID2 parameters entered. SaveChanges All changes made to the Colors collection are done inside a temporary structure. This copies the changes made inside this temporary structure to the master colors structure, essentially saving your changes, making them permanent. UsedColor This returns the color currently associated with the defined Command Type ID or Color Section ID. If a color is not defined for a feature type, the parent color is recursively searched until the default color is reached.

Ap**plication T**his property represents the read-only PC-DMIS A**pplication o**bject. The Application object includes properties and methods that return top-level objects. Background This property returns or sets the Background color for the report template's color tree. Count This property returns the number of color nodes (Color objects) defined in the Colors collection (or color tree). DimensionBackground This property returns or sets the dimension background color for the template's color tree. HighLightBackground This property returns or sets the highlight background color for the template's color tree. Modified This property returns or sets the report template's "modified" tag for its color tree. NumTableColors This property returns the number of colors defined in the report template's color table. Parent This returns this object's parent object. In this case, this is the R**eportTemplate o**bject.

| Colors CollectionMembers |

| Add | This method creates a new color node associated with the specified Command Type ID or Color Section ID, returning a Color object for the added node. Once you add a node, you can then define the colors used for the Standard, Marked, Debug, and OutTol. |
| BuildColortable | Rebuild Color Table using the current colors. retuns the |
| DiscardChanges | All changes made to the Colors collection are done inside a temporary structure. To restore the saved values and overwrite any changes you made in the temporary structure, use this method. |
| GetColorTableColor | Returns the color specified by thecolorIndexparameter from the template's color table. |
| IsAllowed | This checks whether or not the specified Command Type or Color Section ID is valid in the current PC-DMIS configuration. If it is valid, it returns TRUE. |
| Item | This method returns a specified color object from the color table based on the UID1 and UID2 parameters entered. |
| SaveChanges | All changes made to the Colors collection are done inside a temporary structure. This copies the changes made inside this temporary structure to the master colors structure, essentially saving your changes, making them permanent. |
| UsedColor | This returns the color currently associated with the defined Command Type ID or Color Section ID. If a color is not defined for a feature type, the parent color is recursively searched until the default color is reached. |

| Application | This property represents the read-only PC-DMISApplicationobject. TheApplicationobject includes properties and methods that return top-level objects. |
| Background | This property returns or sets the Background color for the report template's color tree. |
| Count | This property returns the number of color nodes (Color objects) defined in the Colors collection (or color tree). |
| DimensionBackground | This property returns or sets the dimension background color for the template's color tree. |
| HighLightBackground | This property returns or sets the highlight background color for the template's color tree. |
| Modified | This property returns or sets the report template's "modified" tag for its color tree. |
| NumTableColors | This property returns the number of colors defined in the report template's color table. |
| Parent | This returns this object's parent object. In this case, this is theReportTemplateobject. |

### Add

**Longv**alue specifying the Command Type ID or Color Section ID.

### Application

Colors Collection|Colors Members

### Background

**Note on Colors:**Colors are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as aLo**ngva**lue:

### BuildColortable

Colors Collection|Colors Members

### Count

Colors Collection|Colors Members

### DimensionBackground

**Note on Colors:**Colors are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as a Long value:

### DiscardChanges

Colors Collection|Colors Members

### GetColorTableColor

Colors Collection|Colors Members

### HighLightBackground

**Note on Colors:**Colors are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as a Long value:

### IsAllowed

**Longv**alue specifying the Command Type ID or Color Section ID.

### Item

**Longv**alue specifying the Command Type ID or Color Section ID.

### Modified

**Note on Colors:**Colors are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as a Long value:

### NumTableColors

Colors Collection|Colors Members

### Parent

Colors Collection|Colors Members

### SaveChanges

All changes made to the Colors collection are done inside a temporary structure. This copies the changes made inside this temporary structure to the master colors structure, essentially saving your changes, making them permanent.

### UsedColor

**Longv**alue specifying the Command Type ID or Color Section ID.


---

## DmisMatrix

# DmisMatrix Object

# Description

# Object Model

# See Also

DmisMatrix Members

The **DmisMatrix** object is a four by three array of doubles modeled after the transformation matrices used in PC-DMIS. The first set of three doubles represents the matrix offset. The second set of three doubles represents the X axis. The third set of three doubles represents the Y axis. The fourth set of three doubles represents the Z axis.

| DmisMatrix Object |

# DmisMatrix Object Members

# Public Methods

# Public Properties

# See Also

Rotates the matrix by the specified angle relative to the workplane.

Rotates the matrix by the calculated angle relative to the workplane.

Rotates the primary axis (as determined by the workplane parameter) to the specified vector.

Initializes the matrix using the vector and workplane to set the matrix orientation and the point to set the matrix offset.

DmisMatrix Object

Item Returns the data item of the matrix. Multiply Multiplies two matrices and returns the result as a D**misMatrix o**bject. Normalize Normalizes the matrix. Reset Resets the matrix to the identity matrix. RotateByAngle Rotates the matrix by the specified angle relative to the workplane. RotateToPoint Rotates the matrix by the calculated angle relative to the workplane. RotateToVector Rotates the primary axis (as determined by the workplane parameter) to the specified vector. SetMatrix Initializes the matrix using the vector and workplane to set the matrix orientation and the point to set the matrix offset. TransformDataBack Multiplies the supplied data by the matrix TransformDataForward Multiplies the supplied data by the inverse of the matrix

_Copy Copy Returns a copy of the matrix. Inverse Returns an inverse matrix of the current matrix. IsIdentity Determines whether or not the matrix is the identity matrix. Offset The first set of three doubles in the matrix representing the translation offset of the matrix. PrimaryAxis The second set of three doubles in the matrix representing the matrix's primary axis. SecondaryAxis The third set of three doubles in the matrix representing the matrix's secondary axis. TertiaryAxis The fourth set of three doubles in the matrix representing the matrix's tertiary axis.

| DmisMatrix ObjectMembers |

| Item | Returns the data item of the matrix. |
| Multiply | Multiplies two matrices and returns the result as aDmisMatrixobject. |
| Normalize | Normalizes the matrix. |
| Reset | Resets the matrix to the identity matrix. |
| RotateByAngle | Rotates the matrix by the specified angle relative to the workplane. |
| RotateToPoint | Rotates the matrix by the calculated angle relative to the workplane. |
| RotateToVector | Rotates the primary axis (as determined by the workplane parameter) to the specified vector. |
| SetMatrix | Initializes the matrix using the vector and workplane to set the matrix orientation and the point to set the matrix offset. |
| TransformDataBack | Multiplies the supplied data by the matrix |
| TransformDataForward | Multiplies the supplied data by the inverse of the matrix |

| _Copy | Copy | Returns a copy of the matrix. |
| Inverse | Returns an inverse matrix of the current matrix. |
| IsIdentity | Determines whether or not the matrix is the identity matrix. |
| Offset | The first set of three doubles in the matrix representing the translation offset of the matrix. |
| PrimaryAxis | The second set of three doubles in the matrix representing the matrix's primary axis. |
| SecondaryAxis | The third set of three doubles in the matrix representing the matrix's secondary axis. |
| TertiaryAxis | The fourth set of three doubles in the matrix representing the matrix's tertiary axis. |

### Copy

Returns a copy of the matrix.

### Inverse

Returns an inverse matrix of the current matrix.

### IsIdentity

Determines whether or not the matrix is the identity matrix.

### Item

Returns the data item of the matrix.

### Multiply

Multiplies two matrices and returns the result as a **DmisMatrix **object.

### Normalize

Normalizes the matrix.

### Offset

The first set of three doubles in the matrix representing the translation offset of the matrix.

### PrimaryAxis

The second set of three doubles in the matrix representing the matrix's primary axis.

### Reset

Resets the matrix to the identity matrix.

### RotateByAngle

Rotates the matrix by the specified angle relative to the workplane.

### RotateToPoint

Rotates the matrix by the calculated angle relative to the workplane.

### RotateToVector

Rotates the primary axis (as determined by the workplane parameter) to the specified vector.

### SecondaryAxis

The third set of three doubles in the matrix representing the matrix's secondary axis.

### SetMatrix

Initializes the matrix using the vector and workplane to set the matrix orientation and the point to set the matrix offset.

### TertiaryAxis

The fourth set of three doubles in the matrix representing the matrix's tertiary axis.

### TransformDataBack

Optional parameter with theE**NUM_PLANE_TYPEe**numeration used to define which axis to rotate about.

### TransformDataForward

This parameter is used when the MAJOR_MINOR_THIRD_ROT_AND_TRANS parameter or the MAJOR_MINOR_THIRD_ROTATE_ONLY transformation type parameter is used.

### _Copy

Visual Basic Public Property _Copy As DmisMatrix


---

## Enum_Language_Type

# Enum_Language_Type Enumeration

# Members

Member Value Description Chn 63007 Cze 63011 Eng 63000 Frn 63002 Grm 63003 Hng 63015 Ita 63001 Jpn 63006 Kor 63008 Nld 63016 Pol 63009 Prt 63005 Rus 63010 Spn 63004 Swe 63012 Trk 63014 Twn 63013

| Enum_Language_Type Enumeration |

| Member | Value | Description |
| --- | Chn | 63007 | Cze | 63011 | Eng | 63000 | Frn | 63002 | Grm | 63003 | Hng | 63015 | Ita | 63001 | Jpn | 63006 | Kor | 63008 | Nld | 63016 | Pol | 63009 | Prt | 63005 | Rus | 63010 | Spn | 63004 | Swe | 63012 | Trk | 63014 | Twn | 63013


---

## ExternalCommand

# ExternalCommand Object

# Description

# See Also

ExternalCommand Members

The **ExternalCommand** object causes PC-DMIS to launch an external program during measurement routine execution. This object has one property: The command property. This property consists of a string value used to execute the external command.

| ExternalCommand Object |

# ExternalCommand Object Members

# Public Properties

# See Also

This property returns or sets the string value of the command to be executed.

ExternalCommand Object

Command This property returns or sets the string value of the command to be executed.

| ExternalCommand ObjectMembers |

| Command | This property returns or sets the string value of the command to be executed. |

### Command

This property returns or sets the string value of the command to be executed.


---

## FCFCommand

# FCFCommand Object

# Object Model

# See Also

FCFCommand Members

| FCFCommand Object |

# FCFCommand Object Members

# Public Properties

# See Also

FCFCommand Object

Application Read Only: Returns the Application Object HasProfileDimension Read Only: Returns the information that FCF contains a profile Dimension ID Read/Write: Dimension ID Parent Read Only: Returns the parent command ProfileDimension Read Only: Returns the FCF internal Profile Dimension if any

| FCFCommand ObjectMembers |

| Application | Read Only:  Returns the Application Object |
| HasProfileDimension | Read Only:  Returns the information that FCF contains a profile Dimension |
| ID | Read/Write: Dimension ID |
| Parent | Read Only:  Returns the parent command |
| ProfileDimension | Read Only:  Returns the FCF internal Profile Dimension if any |

### Application

Read Only: Returns the Application Object

### HasProfileDimension

Read Only: Returns the information that FCF contains a profile Dimension

### ID

Read/Write: Dimension ID

### Parent

Read Only: Returns the parent command

### ProfileDimension

Read Only: Returns the FCF internal Profile Dimension if any


---

## FPanel

# FPanel Object

# Description

# Object Model

# See Also

FPanel Members

The **FPanel** object contains properties that allow you to work with an F-Panel controller and interface.

| FPanel Object |

# FPanel Object Members

# Public Properties

# See Also

This write-only property allows you to set whether the F-Panel is in automatic or manual mode.

FPanel Object

PanelSelector This write-only property allows you to set whether the F-Panel is in automatic or manual mode. Parent This read-only property returns the parent Machine object from which the FPanel object was created.

| FPanel ObjectMembers |

| PanelSelector | This write-only property allows you to set whether the F-Panel is in automatic or manual mode. |
| Parent | This read-only property returns the parent Machine object from which the FPanel object was created. |

### PanelSelector

This write-only property allows you to set whether the F-Panel is in automatic or manual mode.

### Parent

This read-only property returns the parent Machine object from which the FPanel object was created.


---

## HOBPointInfo

# HOBPointInfo Object

# Description

# Object Model

# See Also

This object is the specified pointinfo object contained within the parentH**OBPointInfoListc**ollection object.

HOBPointInfo Members

This object is the specified pointinfo object contained within the parent HO**BPointInfoList c**ollection object.

| HOBPointInfo Object |

# HOBPointInfo Object Members

# Public Methods

# Public Properties

# See Also

This method gets the display state of the leader line for the specified HOBPointInfo object.

This method returns the display state or sets the display state of the specified HOBPointInfo object. If this is set to 1 it shows the object. If it is set to 0 it hides the object.

This method sets the display state of the leader line for the specified HOBPointInfo object.

This represents the read-only PC-DMIS Application.

This read-only property returns the number of HOBPointInfo objects in this master HOBPointInfo list as an Integer.

This returns the parent HOBPointInfoList object.

HOBPointInfo Object

GetHideLeader This method gets the display state of the leader line for the specified HOBPointInfo object. IsVisible This method returns the display state or sets the display state of the specified HOBPointInfo object. If this is set to 1 it shows the object. If it is set to 0 it hides the object. SetHideLeader This method sets the display state of the leader line for the specified HOBPointInfo object.

Application This represents the read-only PC-DMIS Application. Count This read-only property returns the number of HOBPointInfo objects in this master HOBPointInfo list as an Integer. Parent This returns the parent HOBPointInfoList object.

| HOBPointInfo ObjectMembers |

| GetHideLeader | This method gets the display state of the leader line for the specified HOBPointInfo object. |
| IsVisible | This method returns the display state or sets the display state of the specified HOBPointInfo object. If this is set to 1 it shows the object. If it is set to 0 it hides the object. |
| SetHideLeader | This method sets the display state of the leader line for the specified HOBPointInfo object. |

| Application | This represents the read-only PC-DMIS Application. |
| Count | This read-only property returns the number of HOBPointInfo objects in this master HOBPointInfo list as an Integer. |
| Parent | This returns the parent HOBPointInfoList object. |

### Application

This represents the read-only PC-DMIS Application.

### Count

This read-only property returns the number of HOBPointInfo objects in this master HOBPointInfo list as an Integer.

### GetHideLeader

This method gets the display state of the leader line for the specified HOBPointInfo object.

### IsVisible

This method returns the display state or sets the display state of the specified HOBPointInfo object. If this is set to 1 it shows the object. If it is set to 0 it hides the object.

### Parent

This returns the parent HOBPointInfoList object.

### SetHideLeader

This method sets the display state of the leader line for the specified HOBPointInfo object.


---

## HOBPointInfoList

# HOBPointInfoList Collection

# Description

# Object Model

# See Also

This object holds a collection of hyperview objects (HOB) as pointinfo objects.

HOBPointInfoList Members

This object holds a collection of hyperview objects (HOB) as pointinfo objects.

| HOBPointInfoList Collection |

# HOBPointInfoList Collection Members

# Public Methods

# Public Properties

# See Also

This method returns the dimension command name used for the pointinfo as a string value for the specifiedH**OBPointInfoo**bject.

This method returns the specifiedH**OBPointInfoo**bject out of the collection of pointinfo objects. If it cannot do so, it returnsNot**hing.**

This represents the read-only PC-DMIS Application.

This counts the number of pointinfo objects contained in the HOBPointInfoList collection.

This returns the parentA**nalysisWindowo**bject.

HOBPointInfoList Collection

ID This method returns the dimension command name used for the pointinfo as a string value for the specified HOB****PointInfo **ob**ject. Item This method returns the specified HOBPointInfo object out of the collection of pointinfo objects. If it cannot do so, it returns Nothi**ng .**

Application This represents the read-only PC-DMIS Application. Count This counts the number of pointinfo objects contained in the HOBPointInfoList collection. Parent This returns the parent Analysi**sWindow object**.

| HOBPointInfoList CollectionMembers |

| ID | This method returns the dimension command name used for the pointinfo as a string value for the specifiedHOBPointInfoobject. |
| Item | This method returns the specifiedHOBPointInfoobject out of the collection of pointinfo objects. If it cannot do so, it returnsNothing. |

| Application | This represents the read-only PC-DMIS Application. |
| Count | This counts the number of pointinfo objects contained in the HOBPointInfoList collection. |
| Parent | This returns the parentAnalysisWindowobject. |

### Application

This represents the read-only PC-DMIS Application.

### Count

This counts the number of pointinfo objects contained in the HOBPointInfoList collection.

### ID

This method returns the dimension command name used for the pointinfo as a string value for the specifiedH**OBPointInfoo**bject.

### Item

This method returns the specifiedH**OBPointInfoo**bject out of the collection of pointinfo objects. If it cannot do so, it returnsNot**hing.**

### Parent

This returns the parentA**nalysisWindowo**bject.


---

## LEAPFROG

# LEAPFROG Object Members

# Public Properties

# See Also

Integer value that determines the number of hits used for the feature types described in the LeapFrogType property. The feature type determines if the number of hits are useful or not.

LEAPFROG Object

**full Determines whether or not the leapfrog will be full (1) or partial (0). For more information on this, see the "Creating and Using Alignments" topic in the PC-DMIS Help File . leapfrogtype Integer value that defines the type of feature used to translate the CMM along the part. NumHits Integer value that determines the number of hits used for the feature types described in the LeapFrogType property. The feature type determines if the number of hits are useful or not.

| LEAPFROG ObjectMembers |

| full | Determines whether or not the leapfrog will be full (1) or partial (0). For more information on this, see the "Creating and Using Alignments" topic in thePC-DMIS Help File. |
| leapfrogtype | Integer value that defines the type of feature used to translate the CMM along the part. |
| NumHits | Integer value that determines the number of hits used for the feature types described in the LeapFrogType property. The feature type determines if the number of hits are useful or not. |

### NumHits

Integer value that determines the number of hits used for the feature types described in the LeapFrogType property. The feature type determines if the number of hits are useful or not.

### full

**Determines whether or not the leapfrog will be full (1) or partial (0). For more information on this, see the "Creating and Using Alignments" topic in the PC-DMIS Help File .

### leapfrogtype

Read/writeI**nteger.**


---

## LmsLicense

# LmsLicense Object

# Description

# Object Model

# See Also

LmsLicense Members

Lms License Object

| LmsLicense Object |

# LmsLicense Object Members

# Public Properties

# See Also

LmsLicense Object

_ID LmsLicenseId Read Only: Returns Lms Entitlement IDs Parent Read Only: Returns Application Object UseLms Read Only: Returns Lms in use flag

| LmsLicense ObjectMembers |

| _ID | LmsLicenseId | Read Only:  Returns Lms Entitlement IDs |
| Parent | Read Only:  Returns Application Object |
| UseLms | Read Only:  Returns Lms in use flag |

### LmsLicenseId

Read Only: Returns Lms Entitlement IDs

### Parent

Read Only: Returns Application Object

### UseLms

Read Only: Returns Lms in use flag

### _ID

Visual Basic Public Property _ID As Integer


---

## LoadMachine

# LoadMachine Object

# Description

# See Also

LoadMachine Members

The **LoadMachine** object gives access to the machine name property of the PC-DMIS Load Machine command.

| LoadMachine Object |

# LoadMachine Object Members

# Public Properties

# See Also

Returns or sets the name of the machine to be loaded.

LoadMachine Object

MachineName Returns or sets the name of the machine to be loaded.

| LoadMachine ObjectMembers |

| MachineName | Returns or sets the name of the machine to be loaded. |

### MachineName

Returns or sets the name of the machine to be loaded.


---

## LoadProbe

# LoadProbe Object

# Description

# See Also

LoadProbe Members

The **LoadProbe** object gives access to the filename property of the PC-DMIS Load Probe command.

| LoadProbe Object |

# LoadProbe Object Members

# Public Properties

# See Also

Returns or sets the name of the probe file to be loaded.

LoadProbe Object

FileName Returns or sets the name of the probe file to be loaded.

| LoadProbe ObjectMembers |

| FileName | Returns or sets the name of the probe file to be loaded. |

### FileName

Returns or sets the name of the probe file to be loaded.


---

## MiniroutineSettings

# MiniroutineSettings Object

# Object Model

# See Also

MiniroutineSettings Members

| MiniroutineSettings Object |

# MiniroutineSettings Object Members

# Public Properties

# See Also

MiniroutineSettings Object

Application Read Only: Returns the Application Object FbmMarkingMode Read/Write: FBM marking mode ManualAlignFeaturesStatus Read/Write: Manual alignment features status Parent Read Only: Returns the Parent PartProgramSettings Object

| MiniroutineSettings ObjectMembers |

| Application | Read Only:  Returns the Application Object |
| FbmMarkingMode | Read/Write: FBM marking mode |
| ManualAlignFeaturesStatus | Read/Write: Manual alignment features status |
| Parent | Read Only:  Returns the Parent PartProgramSettings Object |

### Application

MiniroutineSettings Object|MiniroutineSettings Members

### FbmMarkingMode

MiniroutineSettings Object|MiniroutineSettings Members

### ManualAlignFeaturesStatus

MiniroutineSettings Object|MiniroutineSettings Members

### Parent

MiniroutineSettings Object|MiniroutineSettings Members


---

## MiniroutineTimeInfo

# MiniroutineTimeInfo Object

# Object Model

# See Also

MiniroutineTimeInfo Members

| MiniroutineTimeInfo Object |

# MiniroutineTimeInfo Object Members

# Public Properties

# See Also

MiniroutineTimeInfo Object

Application Read Only: Returns the Application Object DESCRIPTION Read Only: Miniroutine Name Parent Read Only: Returns the Parent Object Time Read Only: Miniroutine Execution Time UID Read Only: Miniroutine uid

| MiniroutineTimeInfo ObjectMembers |

| Application | Read Only:  Returns the Application Object |
| DESCRIPTION | Read Only:  Miniroutine Name |
| Parent | Read Only:  Returns the Parent Object |
| Time | Read Only:  Miniroutine Execution Time |
| UID | Read Only:  Miniroutine uid |

### Application

MiniroutineTimeInfo Object|MiniroutineTimeInfo Members

### DESCRIPTION

MiniroutineTimeInfo Object|MiniroutineTimeInfo Members

### Parent

MiniroutineTimeInfo Object|MiniroutineTimeInfo Members

### Time

MiniroutineTimeInfo Object|MiniroutineTimeInfo Members

### UID

MiniroutineTimeInfo Object|MiniroutineTimeInfo Members


---

## MiniroutineTimeInfoList

# MiniroutineTimeInfoList Object

# Object Model

# See Also

MiniroutineTimeInfoList Members

| MiniroutineTimeInfoList Object |

# MiniroutineTimeInfoList Object Members

# Public Methods

# Public Properties

# See Also

MiniroutineTimeInfoList Object

GetSize Get the count of MiniroutineTimeInfo objects Item Get the MiniroutineTimeInfo object per index

Application Read Only: Returns the Application Object Parent Read Only: Returns the Parent Object

| MiniroutineTimeInfoList ObjectMembers |

| GetSize | Get the count of MiniroutineTimeInfo objects |
| Item | Get the MiniroutineTimeInfo object per index |

| Application | Read Only:  Returns the Application Object |
| Parent | Read Only:  Returns the Parent Object |

### Application

MiniroutineTimeInfoList Object|MiniroutineTimeInfoList Members

### GetSize

MiniroutineTimeInfoList Object|MiniroutineTimeInfoList Members

### Item

MiniroutineTimeInfoList Object|MiniroutineTimeInfoList Members

### Parent

MiniroutineTimeInfoList Object|MiniroutineTimeInfoList Members


---

## ModalCmd

# ModalCmd Object

# Description

# Object Model

# See Also

ModalCmd Members|AlignCmnd Object|Command Object|ModalCommand Property

Objects of type **AlignCmnd** are created from more generic **Command** objects to pass information specific to the modal command back and forth.

ModalCmd Members | AlignCmnd Object | Command Object | ModalCommand Property

| ModalCmd Object |

# ModalCmd Object Members

# Public Properties

# See Also

ModalCmd Object|AlignCmnd Object|Command Object|ModalCommand Property

ClearPlane Represents the clearance plane of a CLEARANCE_PLANES type object. Digits Represents the number of digits of a DISPLAYPRECISION type object. DISTANCE Represents the distance to move for this object. Distance2 Read/Write: Distance 2 for Clearance Planes ManDCCMode Read/Write: Manual / DCC Mode Name Returns the name of this GET_PROBE_DATA object. On Represents the on/off state of this object. Parent Returns the parent Com**mand ob**ject. Read-only. PassPlane Represents the pass-through plane to move for this CLEARANCE_PLANES object. RMeasMode Represents the current relative measure (or RMEAS) mode. Speed Represents the speed for this object. Workplane Represents the workplane to move for this SET_WORKPLANE object.

ModalCmd Object | AlignCmnd Object | Command Object | ModalCommand Property

| ModalCmd ObjectMembers |

| ClearPlane | Represents the clearance plane of a CLEARANCE_PLANES type object. |
| Digits | Represents the number of digits of a DISPLAYPRECISION type object. |
| DISTANCE | Represents the distance to move for this object. |
| Distance2 | Read/Write:  Distance 2 for Clearance Planes |
| ManDCCMode | Read/Write:  Manual / DCC Mode |
| Name | Returns the name of this GET_PROBE_DATA object. |
| On | Represents the on/off state of this object. |
| Parent | Returns the parentCommandobject. Read-only. |
| PassPlane | Represents the pass-through plane to move for this CLEARANCE_PLANES object. |
| RMeasMode | Represents the current relative measure (or RMEAS) mode. |
| Speed | Represents the speed for this object. |
| Workplane | Represents the workplane to move for this SET_WORKPLANE object. |

### ClearPlane

This property is only useful for objects of type CLEARANCE_PLANES. For objects of other types, setting this property does nothing and getting it always returns PCD_ZPLUS.

### DISTANCE

This property is only useful for objects of type PREHIT, CLAMP, RETRACT, CHECK, and CLEARANCE_PLANES. For objects of other types, setting this property does nothing and getting it always returns zero.

### Digits

Represents the number of digits of a DISPLAYPRECISION type object.

### Distance2

Read/Write: Distance 2 for Clearance Planes

### ManDCCMode

Read/Write: Manual / DCC Mode

### Name

Returns the name of this GET_PROBE_DATA object.

### On

Represents the on/off state of this object.

### Parent

Returns the parent **Command** object. Read-only.

### PassPlane

This property is only useful for objects of type CLEARANCE_PLANES. For objects of other types, setting this property does nothing and getting it always returns PCD_ZPLUS.

### RMeasMode

These can be 0 for RMEAS_LEGACY (previously RMEAS_NORMAL) or 1 for RMEAS_DEFAULT (previously RMEAS_ABSOLUTE). The default value is RMEAS_DEFAULT.

### Speed

Represents the speed for this object.

### Workplane

This property is only useful for objects of type SET_WORKPLANE. For objects of other types, setting this property does nothing and getting it always returns PCD_ZPLUS.


---

## MoveCmd

# MoveCmd Object

# Description

# Object Model

# See Also

MoveCmd Members|MoveCommand Property

Objects of type **MoveCmd** are created from more generic **Command** objects to pass information specific to the move command back and forth.

MoveCmd Members | MoveCommand Property

| MoveCmd Object |

# MoveCmd Object Members

# Public Properties

# See Also

Represents the new tip position of this MOVE_PH9_OFFSET object.

Represents the new tip position of this MOVE_PH9_OFFSET object.

MoveCmd Object|MoveCommand Property

Angle Represents the rotation angle of this MOVE_ROTAB object. Direction Represents the rotation direction of this MOVE_ROTAB object. IJK A PointData object that represents the IJK vector to use. NewTip Represents the new tip position of this MOVE_PH9_OFFSET object. OldTip Represents the new tip position of this MOVE_PH9_OFFSET object. Parent Returns the parent Co**mmand o**bject. Read-only. XYZ A PointData object that represents the location to which to move, or in the case of MOVE_INCREMENT, the location offset. XYZEnd Read Only: Gets XYZ data via Point Data Object for Circular Move Command End Point XYZStart Read Only: Gets XYZ data via Point Data Object for Circular Move Command Start Point

MoveCmd Object | MoveCommand Property

| MoveCmd ObjectMembers |

| Angle | Represents the rotation angle of this MOVE_ROTAB object. |
| Direction | Represents the rotation direction of this MOVE_ROTAB object. |
| IJK | A PointData object that represents the IJK vector to use. |
| NewTip | Represents the new tip position of this MOVE_PH9_OFFSET object. |
| OldTip | Represents the new tip position of this MOVE_PH9_OFFSET object. |
| Parent | Returns the parentCommandobject. Read-only. |
| XYZ | A PointData object that represents the location to which to move, or in the case of MOVE_INCREMENT, the location offset. |
| XYZEnd | Read Only:   Gets XYZ data via Point Data Object for Circular Move Command End Point |
| XYZStart | Read Only:   Gets XYZ data via Point Data Object for Circular Move Command Start Point |

### Angle

Represents the rotation angle of this MOVE_ROTAB object.

### Direction

This property is only useful for objects of type MOVE_ROTAB. For objects of other types, setting this property does nothing and getting it always returns zero.

### IJK

A PointData object that represents the IJK vector to use.

### NewTip

Represents the new tip position of this MOVE_PH9_OFFSET object.

### OldTip

Represents the new tip position of this MOVE_PH9_OFFSET object.

### Parent

Returns the parent **Command** object. Read-only.

### XYZ

A PointData object that represents the location to which to move, or in the case of MOVE_INCREMENT, the location offset.

### XYZEnd

Read Only: Gets XYZ data via Point Data Object for Circular Move Command End Point

### XYZStart

Read Only: Gets XYZ data via Point Data Object for Circular Move Command Start Point


---

## OPTIONPROBE

# OPTIONPROBE Object Members

# Public Properties

# See Also

OPTIONPROBE Object

LowForce Double value used to set or get the probe low force setting. ManFineProbing Read/Write: Man Fine Probing MaxForce Double value used to set or get the probe max force setting. PositionalAccuracy Double value used to set or get the positional accuracy setting. ProbeAccuracy Double value used to set or get the probe accuracy setting. ProbingMode Read/Write: Probing Mode ReturnData Double value used to set or get the probe return data value. ReturnSpeed Double value used to set or get the probe return data value. ScanAcceleration Read/Write: Scan Acceleration ScanOffsetForce Read/Write: Scan Offset Force ScanPointDensity Double value used to set or get the probe scan point density setting. TriggerForce Double value used to set or get the probe scan point density setting. UpperForce Double value used to set or get the probe upper force setting.

| OPTIONPROBE ObjectMembers |

| LowForce | Double value used to set or get the probe low force setting. |
| ManFineProbing | Read/Write: Man Fine Probing |
| MaxForce | Double value used to set or get the probe max force setting. |
| PositionalAccuracy | Double value used to set or get the positional accuracy setting. |
| ProbeAccuracy | Double value used to set or get the probe accuracy setting. |
| ProbingMode | Read/Write: Probing Mode |
| ReturnData | Double value used to set or get the probe return data value. |
| ReturnSpeed | Double value used to set or get the probe return data value. |
| ScanAcceleration | Read/Write: Scan Acceleration |
| ScanOffsetForce | Read/Write: Scan Offset Force |
| ScanPointDensity | Double value used to set or get the probe scan point density setting. |
| TriggerForce | Double value used to set or get the probe scan point density setting. |
| UpperForce | Double value used to set or get the probe upper force setting. |

### LowForce

Double value used to set or get the probe low force setting.

### ManFineProbing

Read/Write: Man Fine Probing

### MaxForce

Double value used to set or get the probe max force setting.

### PositionalAccuracy

Double value used to set or get the positional accuracy setting.

### ProbeAccuracy

Double value used to set or get the probe accuracy setting.

### ProbingMode

Read/Write: Probing Mode

### ReturnData

Double value used to set or get the probe return data value.

### ReturnSpeed

Double value used to set or get the probe return data value.

### ScanAcceleration

Read/Write: Scan Acceleration

### ScanOffsetForce

Read/Write: Scan Offset Force

### ScanPointDensity

Double value used to set or get the probe scan point density setting.

### TriggerForce

Double value used to set or get the probe scan point density setting.

### UpperForce

Double value used to set or get the probe upper force setting.


---

## OldBasic

# OldBasic Object

# Description

# Object Model

# Remarks

# See Also

These PC-DMIS OldBasic functions were made available in previous version of PC-DMIS basic and are provided here, listed in alphabetical order, for backwards compatibility.

**Important Notes:**

**Miscellaneous Programming Notes:**

**Using Parentheses in BASIC Scripts:**For information on when to use or omit parentheses, please refer to your BASIC Language documentation; generally however, for methods and properties you should only use parentheses if you're receiving a value.

**Invalid Function Return Type:**Be aware that objects are not a valid return type for functions.

OldBasic Members

**Important Notes:** Functions that return type Object are invalid. Only OldBasic classes support optional parameters. Mi**scellaneous Programming Notes: U**sin**g Parentheses in BASIC Scripts: For** information on when to use or omit parentheses, please refer to your BASIC Language documentation; generally however, for methods and properties you should only use parentheses if you're receiving a value. Inval**id Function Return Type: Be a**ware that objects are not a valid return type for functions.

| OldBasic Object |

- Functions that return type Object are invalid.
- Only OldBasic classes support optional parameters.

- Using Parentheses in BASIC Scripts: For information on when to use or omit parentheses, please refer to your BASIC Language documentation; generally however, for methods and properties you should only use parentheses if you're receiving a value.
- Invalid Function Return Type: Be aware that objects are not a valid return type for functions.

# OldBasic Object Members

# Public Methods

# Public Properties

# See Also

This function is used in conjunction with the iteratealignment command.

This function is used in conjunction with the iterate alignment command.

Return the arc cosine of x in degrees.

Returns the arc sine of x in degrees.

This command is used only for location and true position dimensions. If present, the default dimension axes are created. Calls to SetNomswith other axes passed as the dtype parameter will have no effect if this command is used.

This command is used within a Startfeature - EndFeatureblock and is used to cause the hits specified in the hits parameter of the StartFeature command to be automatically generated.

This function must be called to end an alignment block.

EndDim takes no parameters, but must be called to finish off the dimension block.

This function ends a measured, constructed, or auto featureblock. It mustal<u>waysbe</u> present as thelast<u>func</u>tion call in a feature block.

Use this command to release the memory allocated for use by the StartGetFeatPointand GetFeatPointcommands.

Call this when all of the other scan functions needed have been called.

The scan object is inserted in the command list with a call to this function.

This function must only be calleda<u>ftera</u> call to BestFit2D,BestFit3D,or Iterate

Returns the number of features that are out of tolerance at the time that this command is executed.

Waits until all preceding commands have been executed. The basic script creates commands and places them on the execute list more rapidly than the commands are executed. In a script it is often useful to pop up a dialog box for input after a certain series of commands has been executed. The script commands may complete long before the actual commands have been executed. The Wait command is useful to prevent the dialog box from popping up prematurely.

OldBasic Object

AddBoundaryPoint This function is used to add the initial point, end point, and other boundary points in the case of patch scans. It should be called for each boundary point to be added. It should not be called more than num_bnd_pnts times (as specified in the call to StartScan ). AddFeature Adds a feature. This function is used for constructed features only. The parameters off1, off2, and off3 are only used in the case of offset points, planes, or lines. AddLevelFeat This function is used in conjunction with the iterate alignment command. AddOriginFeat This function is used in conjunction with the iterate alignment command. AddRotateFeat Adds a rotation feature. This function is used in conjunction with the iterate alignment command ArcCos Return the arc cosine of x in degrees. ArcSin Returns the arc sine of x in degrees. BestFit2D Creates a best fit 2d alignment BestFit3D Creates a best fit 3d alignment Calibrate Creates a probe calibration command CatchMotionError Turns On/Off Catching of CMM motion errors Check Creates a check distance object ClearPlane Creates a clearplane settings object CloseCommConnection Closes the port opened with the OpenCommConnection command. Column132 Turns on or off 132 column mode. Comment Creates a measurement routine comment object CreateID Generates and returns an Id based on measurement routine generation settings DefaultAxes This command is used only for location and true position dimensions. If present, the default dimension axes are created. Calls to SetNoms with other axes passed as the dtype parameter will have no effect if this command is used. DefaultHits This command is used within a Startfeature - EndFeature block and is used to cause the hits specified in the hits parameter of the StartFeature command to be automatically generated. DimFormat Creates a DimFormat command EndAlign This function must be called to end an alignment block. EndDim EndDim takes no parameters, but must be called to finish off the dimension block. EndFeature This function ends a measured, constructed, or auto feature block. It must <u>always</u> be present as the <u>last</u> function call in a feature block. EndGetFeatPoint Use this command to release the memory allocated for use by the StartGetFeatPoint and GetFeatPoint commands. EndScan Call this when all of the other scan functions needed have been called. The scan object is inserted in the command list with a call to this function. EquateAlign Creates Equate alignment object Feature This function must only be called <u>after</u> a call to BestFit2D, BestFit3D, or Iterate Flatness This function was added for the tutor translator, and should be used with caution. GapOnly Creates Gap Only Dimension Object GetDimData Get dimension data from dimension specified by ID GetDimOutTol Returns the number of features that are out of tolerance at the time that this command is executed. GetFeatData Gets feature data from command with specified ID GetFeatID Returns id of indexed feature GetFeatPoint This function is called after a call to StartGetFeatPoint to retrieve the actual points. GetFeature Returns feature type (ie. Circle, Line, Point...) GetPH9Status Returns 1 if a PH9 is available GetProbeOffsets Returns the current probe offsets GetProbeRadius Returns the current probe radius. GetProgramOption Returns the status of the application setting option GetProgramValue Returns the value of the application setting GetTopMachineSpeed Returns the top machine speed of the CMM. GetType Returns the type of the object. GetUnits The units of the current measurement routine. Hit Used in feature block to add a hit to an object IgnoreMotionError Sets recalculation of nominals mode Iterate Creates Iterative Alignment Command Level Creates Level Alignment Command LoadProbe Creates Load Probe Command MaxMinAve Returns maximum, minimum, or average information for command of specified id Mode Creates DCC / Manual Mode Command Move Creates Move (Probe or Rotary Table) Command MoveSpeed Creates Move Speed Command OpenCommConnection Opens a connection to the specified comm port. PreHit Creates Prehit Distance Command ProbeComp Creates Probe Compensation Command PutFeatData Puts feature data into the command specified by the ID ReadCommBlock Reads characters from the comm port specified. RecallEx Creates Recall Alignment Command for External Alignments RecallIn Creates Recall Alignment Command for Internal Alignments Retract Creates a Retract Distance Command RetroOnly Creates a Retrolinear Only Dimension Command Rotate Creates a Rotate Alignment Command RotateCircle Creates a Circular Rotation Alignment Command RotateOffset Creates a Rotational Offset Command Roundness Returns roundness information for command of specified ID RunOut Returns runout information for command of specified ID SaveAlign Creates a Save Alignment Command SetAutoParams Sets Auto Feature Parameters inside StartFeature Block SetAutoVector Sets Auto Vector Components (used inside StartFeature Block) SetNoms Set nominal values for dimension (used inside StartDimension Block) SetPrintOptions Sets application printing options SetProgramOption Sets application program option SetProgramValue Sets application program value SetReportOptions Sets application reporting settings SetRMeasMode Sets Relative Measure mode to Relative or Absolute SetScanHitParams Sets scan hit parameters (used in StartScan block) SetScanHitVectors Sets hit vector components of scan (used in StartScan block) SetScanParams Sets scan parameters (used in StartScan block) SetScanVectors Sets vector components of scan (used in StartScan block) SetSlaveMode Turns on/turns off slave mode (subsequent objects are slave object/master objects) SetTheos Sets theoretical values for feature (used in StartFeature block) ShowXYZWindow Shows or Hides the probe readouts window Sleep Pauses execution for the specified number of seconds after the previous feature has finished executing. StartAlign Starts Alignment block and sets alignment parameters StartDim Starts Dimension block and sets dimension parameters StartFeature Starts Feature block and sets feature parameters StartGetFeatPoint This function is used to retrieve the hit or input data from constructed, measured, and auto features, as well as the hit data for scans. To retrieve the actual points, subsequent calls to GetFeatPoint must be made. When all of the needed point values have been retrieved, a call to EndGetFeatPoint must be made to free the memory allocated for the points. StartScan Starts Scan block and sets sets scan parameters Stats Creates Stats On/Off command Straitness Returns straitness information for command of specified ID Tip The tip to load. Touchspeed Creates touch speed command Trace Creates trace field command Translate Creates translation alignment command TranslateOffset Creates a translation offset command Wait Waits until all preceding commands have been executed. The basic script creates commands and places them on the execute list more rapidly than the commands are executed. In a script it is often useful to pop up a dialog box for input after a certain series of commands has been executed. The script commands may complete long before the actual commands have been executed. The Wait command is useful to prevent the dialog box from popping up prematurely. Workplane Creates a workplane object or gets the current workplane WriteCommBlock Writes characters to the specified comm port.

Application Read Only: Returns Application object Parent Read Only: Returns the PartProgram object

| OldBasic ObjectMembers |

| AddBoundaryPoint | This function is used to add the initial point, end point, and other boundary points in the case of patch scans. It should be called for each boundary point to be added. It should not be called more than num_bnd_pnts times (as specified in the call to StartScan). |
| AddFeature | Adds a feature. This function is used for constructed features only. The parameters off1, off2, and off3 are only used in the case of offset points, planes, or lines. |
| AddLevelFeat | This function is used in conjunction with the iteratealignment command. |
| AddOriginFeat | This function is used in conjunction with the iterate alignment command. |
| AddRotateFeat | Adds a rotation feature. This function is used in conjunction with the iterate alignment command |
| ArcCos | Return the arc cosine of x in degrees. |
| ArcSin | Returns the arc sine of x in degrees. |
| BestFit2D | Creates a best fit 2d alignment |
| BestFit3D | Creates a best fit 3d alignment |
| Calibrate | Creates a probe calibration command |
| CatchMotionError | Turns On/Off Catching of CMM motion errors |
| Check | Creates a check distance object |
| ClearPlane | Creates a clearplane settings object |
| CloseCommConnection | Closes the port opened with the OpenCommConnection command. |
| Column132 | Turns on or off 132 column mode. |
| Comment | Creates a measurement routine comment object |
| CreateID | Generates and returns an Id based on measurement routine generation settings |
| DefaultAxes | This command is used only for location and true position dimensions. If present, the default dimension axes are created. Calls to SetNomswith other axes passed as the dtype parameter will have no effect if this command is used. |
| DefaultHits | This command is used within a Startfeature - EndFeatureblock and is used to cause the hits specified in the hits parameter of the StartFeature command to be automatically generated. |
| DimFormat | Creates a DimFormat command |
| EndAlign | This function must be called to end an alignment block. |
| EndDim | EndDim takes no parameters, but must be called to finish off the dimension block. |
| EndFeature | This function ends a measured, constructed, or auto featureblock. It mustalwaysbe present as thelastfunction call in a feature block. |
| EndGetFeatPoint | Use this command to release the memory allocated for use by the StartGetFeatPointand GetFeatPointcommands. |
| EndScan | Call this when all of the other scan functions needed have been called.The scan object is inserted in the command list with a call to this function. |
| EquateAlign | Creates Equate alignment object |
| Feature | This function must only be calledaftera call to BestFit2D,BestFit3D,or Iterate |
| Flatness | This function was added for the tutor translator, and should be used with caution. |
| GapOnly | Creates Gap Only Dimension Object |
| GetDimData | Get dimension data from dimension specified by ID |
| GetDimOutTol | Returns the number of features that are out of tolerance at the time that this command is executed. |
| GetFeatData | Gets feature data from command with specified ID |
| GetFeatID | Returns id of indexed feature |
| GetFeatPoint | This function is called after a call to StartGetFeatPointto retrieve the actual points. |
| GetFeature | Returns feature type (ie. Circle, Line, Point...) |
| GetPH9Status | Returns 1 if a PH9 is available |
| GetProbeOffsets | Returns the current probe offsets |
| GetProbeRadius | Returns the current probe radius. |
| GetProgramOption | Returns the status of the application setting option |
| GetProgramValue | Returns the value of the application setting |
| GetTopMachineSpeed | Returns the top machine speed of the CMM. |
| GetType | Returns the type of the object. |
| GetUnits | The units of the current measurement routine. |
| Hit | Used in feature block to add a hit to an object |
| IgnoreMotionError | Sets recalculation of nominals mode |
| Iterate | Creates Iterative Alignment Command |
| Level | Creates Level Alignment Command |
| LoadProbe | Creates Load Probe Command |
| MaxMinAve | Returns maximum, minimum, or average information for command of specified id |
| Mode | Creates DCC / Manual Mode Command |
| Move | Creates Move (Probe or Rotary Table) Command |
| MoveSpeed | Creates Move Speed Command |
| OpenCommConnection | Opens a connection to the specified comm port. |
| PreHit | Creates Prehit Distance Command |
| ProbeComp | Creates Probe Compensation Command |
| PutFeatData | Puts feature data into the command specified by the ID |
| ReadCommBlock | Reads characters from the comm port specified. |
| RecallEx | Creates Recall Alignment Command for External Alignments |
| RecallIn | Creates Recall Alignment Command for Internal Alignments |
| Retract | Creates a Retract Distance Command |
| RetroOnly | Creates a Retrolinear Only Dimension Command |
| Rotate | Creates a Rotate Alignment Command |
| RotateCircle | Creates a Circular Rotation Alignment Command |
| RotateOffset | Creates a Rotational Offset Command |
| Roundness | Returns roundness information for command of specified ID |
| RunOut | Returns runout information for command of specified ID |
| SaveAlign | Creates a Save Alignment Command |
| SetAutoParams | Sets Auto Feature Parameters inside StartFeature Block |
| SetAutoVector | Sets Auto Vector Components (used inside StartFeature Block) |
| SetNoms | Set nominal values for dimension (used inside StartDimension Block) |
| SetPrintOptions | Sets application printing options |
| SetProgramOption | Sets application program option |
| SetProgramValue | Sets application program value |
| SetReportOptions | Sets application reporting settings |
| SetRMeasMode | Sets Relative Measure mode to Relative or Absolute |
| SetScanHitParams | Sets scan hit parameters (used in StartScan block) |
| SetScanHitVectors | Sets hit vector components of scan (used in StartScan block) |
| SetScanParams | Sets scan parameters (used in StartScan block) |
| SetScanVectors | Sets vector components of scan (used in StartScan block) |
| SetSlaveMode | Turns on/turns off slave mode (subsequent objects are slave object/master objects) |
| SetTheos | Sets theoretical values for feature (used in StartFeature block) |
| ShowXYZWindow | Shows or Hides the probe readouts window |
| Sleep | Pauses execution for the specified number of seconds after the previous featurehas finished executing. |
| StartAlign | Starts Alignment block and sets alignment parameters |
| StartDim | Starts Dimension block and sets dimension parameters |
| StartFeature | Starts Feature block and sets feature parameters |
| StartGetFeatPoint | This function is used to retrieve the hit or input data from constructed, measured, and auto features, as well as the hit data for scans. To retrieve the actual points, subsequent calls to GetFeatPointmust be made. When all of the needed point values have been retrieved, a call to EndGetFeatPointmust be made to free the memory allocated for  the points. |
| StartScan | Starts Scan block and sets sets scan parameters |
| Stats | Creates Stats On/Off command |
| Straitness | Returns straitness information for command of specified ID |
| Tip | The tip to load. |
| Touchspeed | Creates touch speed command |
| Trace | Creates trace field command |
| Translate | Creates translation alignment command |
| TranslateOffset | Creates a translation offset command |
| Wait | Waits until all preceding commands have been executed. The basic script creates commands and places them on the execute list more rapidly than the commands are executed. In a script it is often useful to pop up a dialog box for input after a certain series of commands has been executed. The script commands may complete long before the actual commands have been executed. The Wait command is useful to prevent the dialog box from popping up prematurely. |
| Workplane | Creates a workplane object or gets the current workplane |
| WriteCommBlock | Writes characters to the specified comm port. |

| Application | Read Only:  Returns Application object |
| Parent | Read Only:  Returns the PartProgram object |

### AddBoundaryPoint

This function is used to add the initial point, end point, and other boundary points in the case of patch scans. It should be called for each boundary point to be added. It should not be called more than num_bnd_pnts times (as specified in the call to StartScan ).

### AddFeature

Adds a feature. This function is used for constructed features only. The parameters off1, off2, and off3 are only used in the case of offset points, planes, or lines.

### AddLevelFeat

This function is used in conjunction with the iteratealignment command.

### AddOriginFeat

This function is used in conjunction with the iterate alignment command.

### AddRotateFeat

Adds a rotation feature. This function is used in conjunction with the iterate alignment command

### Application

Read Only: Returns Application object

### ArcCos

Return the arc cosine of x in degrees.

### ArcSin

Returns the arc sine of x in degrees.

### BestFit2D

Creates a best fit 2d alignment

### BestFit3D

Creates a best fit 3d alignment

### Calibrate

Creates a probe calibration command

### CatchMotionError

Turns On/Off Catching of CMM motion errors

### Check

Creates a check distance object

### ClearPlane

Creates a clearplane settings object

### CloseCommConnection

Closes the port opened with the OpenCommConnection command.

### Column132

Turns on or off 132 column mode.

### Comment

Creates a measurement routine comment object

### CreateID

Generates and returns an Id based on measurement routine generation settings

### DefaultAxes

This command is used only for location and true position dimensions. If present, the default dimension axes are created. Calls to SetNomswith other axes passed as the dtype parameter will have no effect if this command is used.

### DefaultHits

This command is used within a Startfeature - EndFeatureblock and is used to cause the hits specified in the hits parameter of the StartFeature command to be automatically generated.

### DimFormat

Creates a DimFormat command

### EndAlign

This function must be called to end an alignment block.

### EndDim

EndDim takes no parameters, but must be called to finish off the dimension block.

### EndFeature

This function ends a measured, constructed, or auto featureblock. It mustal<u>waysbe</u> present as thelast<u>func</u>tion call in a feature block.

### EndGetFeatPoint

Use this command to release the memory allocated for use by the StartGetFeatPointand GetFeatPointcommands.

### EndScan

Call this when all of the other scan functions needed have been called.

### EquateAlign

Creates Equate alignment object

### Feature

This function must only be calleda<u>ftera</u> call to BestFit2D,BestFit3D,or Iterate

### Flatness

This function was added for the tutor translator, and should be used with caution.

### GapOnly

Creates Gap Only Dimension Object

### GetDimData

The type of data to retrieve for location or true position dimensions. Not needed for any other dimension type.

### GetDimOutTol

Returns the number of features that are out of tolerance at the time that this command is executed.

### GetFeatData

The definition of the FeatData record type is as follows:

### GetFeatID

Returns id of indexed feature

### GetFeatPoint

A record variable of type PointData in which to put the retrieved point.

### GetFeature

Returns feature type (ie. Circle, Line, Point...)

### GetPH9Status

Returns 1 if a PH9 is available

### GetProbeOffsets

Returns the current probe offsets

### GetProbeRadius

Returns the current probe radius.

### GetProgramOption

Returns the status of the application setting option

### GetProgramValue

The option’s value that is being retrieved.

### GetTopMachineSpeed

Returns the top machine speed of the CMM.

### GetType

This function was added for the tutor translator, and should be used with caution.

### GetUnits

The units of the current measurement routine.

### Hit

This function is used for measured features only. It may be omitted on measured circles, cones, cylinders, spheres and points as these features generate default hits. However, if circular moves are required between each hit, the hit function should be provided as a place holder. The parameters may be eliminated, in which case the default hit x, y, z and i, j, k are used.

### IgnoreMotionError

Sets recalculation of nominals mode

### Iterate

Creates Iterative Alignment Command

### Level

Creates Level Alignment Command

### LoadProbe

Creates Load Probe Command

### MaxMinAve

This function was added for the tutor translator, and should be used with caution.

### Mode

Creates DCC / Manual Mode Command

### Move

Creates Move (Probe or Rotary Table) Command

### MoveSpeed

Creates Move Speed Command

### OpenCommConnection

Opens a connection to the specified comm port.

### Parent

Read Only: Returns the PartProgram object

### PreHit

Creates Prehit Distance Command

### ProbeComp

Creates Probe Compensation Command

### PutFeatData

Parameters, allowed values, and limitations are identical to those of GetFeatData.The data currently in buffer is stored in the featureidentified by the ID string.

### ReadCommBlock

Reads characters from the comm port specified.

### RecallEx

This function does not need to be called within an alignment block.

### RecallIn

This function does not need to be called within an alignment block.

### Retract

Creates a Retract Distance Command

### RetroOnly

Creates a Retrolinear Only Dimension Command

### Rotate

Creates a Rotate Alignment Command

### RotateCircle

Creates a Circular Rotation Alignment Command

### RotateOffset

Creates a Rotational Offset Command

### Roundness

This function was added for the tutor translator, and should be used with caution.

### RunOut

Returns runout information for command of specified ID

### SaveAlign

Creates a Save Alignment Command

### SetAutoParams

Sets Auto Feature Parameters inside StartFeature Block

### SetAutoVector

Sets Auto Vector Components (used inside StartFeature Block)

### SetNoms

When the DefaultAxescommand is not used for dimensions of type location and true position, an axis corresponding to the dtype parameter is added for every call to SetNoms.

### SetPrintOptions

Sets application printing options

### SetProgramOption

Sets application program option

### SetProgramValue

Sets application program value

### SetRMeasMode

Sets Relative Measure mode to Relative or Absolute

### SetReportOptions

Sets application reporting settings

### SetScanHitParams

Sets scan hit parameters (used in StartScan block)

### SetScanHitVectors

Sets hit vector components of scan (used in StartScan block)

### SetScanParams

Sets scan parameters (used in StartScan block)

### SetScanVectors

Sets vector components of scan (used in StartScan block)

### SetSlaveMode

Turns on/turns off slave mode (subsequent objects are slave object/master objects)

### SetTheos

Sets theoretical values for feature (used in StartFeature block)

### ShowXYZWindow

Shows or Hides the probe readouts window

### Sleep

Pauses execution for the specified number of seconds after the previous feature has finished executing.

### StartAlign

Starts Alignment block and sets alignment parameters

### StartDim

The datum computation type comes first. For example, PCD_RFS_LMC specifies RFS for the datum and LMC for the feature.

### StartFeature

Starts Feature block and sets feature parameters

### StartGetFeatPoint

The StartGetFeatPoint function may not be called mid block.

### StartScan

Starts Scan block and sets sets scan parameters

### Stats

Creates Stats On/Off command

### Straitness

This function was added for the tutor translator, and should be used with caution.

### Tip

The tip to load.

### Touchspeed

Creates touch speed command

### Trace

Creates trace field command

### Translate

Creates translation alignment command

### TranslateOffset

Creates a translation offset command

### Wait

Waits until all preceding commands have been executed. The basic script creates commands and places them on the execute list more rapidly than the commands are executed. In a script it is often useful to pop up a dialog box for input after a certain series of commands has been executed. The script commands may complete long before the actual commands have been executed. The Wait command is useful to prevent the dialog box from popping up prematurely.

### Workplane

Options come from the WPLANETYPE emumeration. Optional. If not provided, the current workplane is returned but no new workplane is set.

### WriteCommBlock

Writes characters to the specified comm port.


---

## OptMotion

# OptMotion Object

# Description

# Remarks

# See Also

OptMotion Members

The **OptMotion** command object is used to change optional motion settings for the PC-DMIS probe motion command object.

**This section does not define the meaning of the different properties. Additional information on the properties can be found in the "Setting Your Preferences" section of the PC-DMIS Help File , under the title "Parameter Settings: Acceleration tab".

| OptMotion Object |

# OptMotion Object Members

# Public Properties

# See Also

OptMotion Object

MaxXAcceleration Double value used to set or get the maximum acceleration in X setting. MaxYAcceleration Double value used to set or get the maximum acceleration in Y setting. MaxZAcceleration Double value used to set or get the maximum acceleration in Z setting.

| OptMotion ObjectMembers |

| MaxXAcceleration | Double value used to set or get the maximum acceleration in X setting. |
| MaxYAcceleration | Double value used to set or get the maximum acceleration in Y setting. |
| MaxZAcceleration | Double value used to set or get the maximum acceleration in Z setting. |

### MaxXAcceleration

Double value used to set or get the maximum acceleration in X setting.

### MaxYAcceleration

Double value used to set or get the maximum acceleration in Y setting.

### MaxZAcceleration

Double value used to set or get the maximum acceleration in Z setting.


---

## OptimizePath

# OptimizePath Object

# Description

# Object Model

# Example

# See Also

TheO**ptimizePatho**bject contains the functions to perform path optimizations on measurement routines. You can return a pointer to this object by using theOptimizePathproperty in thePartP**rogramobjec**t.

OptimizePath Members

The **OptimizePath** object contains the functions to perform path optimizations on measurement routines. You can return a pointer to this object by using the OptimizePath property in the **PartProgram** object.

Creates an OptimizePath object called Optimizer and then runs the optimizer to optimize the path the probe travels during execution. Example (C#) Copy Code Dim DmisApp As Object Dim DmisPart As Object Dim EditWindow As Object Dim Optimizer As Object Sub Main Set DmisApp = CreateObject( "PCDLRN.Application" ) Set DmisPart = DmisApp.ActivePartProgram Set EditWindow = DmisPart.EditWindow Set Optimizer = DmisPart.OptimizePath If Not Optimizer Is Nothing Then Optimizer.SortAllFeatures True Optimizer.CreateOptimizePath Set Optimizer = Nothing End If Set EditWindow = Nothing Set DmisPart = Nothing Set DmisApp = Nothing End Sub

```vbscript
Dim DmisApp As Object
Dim DmisPart As Object
Dim EditWindow As Object
Dim Optimizer As Object
Sub Main
	Set DmisApp = CreateObject("PCDLRN.Application")
	Set DmisPart = DmisApp.ActivePartProgram
	Set EditWindow = DmisPart.EditWindow
	Set Optimizer = DmisPart.OptimizePath
	If Not Optimizer Is Nothing Then
		Optimizer.SortAllFeatures True
		Optimizer.CreateOptimizePath
		Set Optimizer = Nothing
	End If
	Set EditWindow = Nothing
	Set DmisPart = Nothing
	Set DmisApp = Nothing  
End Sub
```

| OptimizePath Object |

| Example (C#) |
| Dim DmisApp As Object
Dim DmisPart As Object
Dim EditWindow As Object
Dim Optimizer As Object
Sub Main
	Set DmisApp = CreateObject("PCDLRN.Application")
	Set DmisPart = DmisApp.ActivePartProgram
	Set EditWindow = DmisPart.EditWindow
	Set Optimizer = DmisPart.OptimizePath
	If Not Optimizer Is Nothing Then
		Optimizer.SortAllFeatures True
		Optimizer.CreateOptimizePath
		Set Optimizer = Nothing
	End If
	Set EditWindow = Nothing
	Set DmisPart = Nothing
	Set DmisApp = Nothing  
End Sub |

# OptimizePath Object Members

# Public Methods

# Public Properties

# See Also

If True, PC-DMIS only uses defined tips during the path optimization. If PC-DMIS can't find an appropriate tip for a feature, it assigns that feature to to T?A?B?. If False, PC-DMIS uses undefined tips.

If True, PC-DMIS insertes dimensions at the end of the optimized path. If False, it inserts them immediately after the feature.

The penatly value, in seconds, is an approximation of the time taken by a CMM to change tips this category of probes. The default pentalty mean that all features measured with a given tip are grouped together and sorted within that tip group. For example, if you set the penalty to zero, this allows the Optimize Path process to sort features based solely on the distance traveled between features while completely ignoring tip changes.

The Sort penalty has three values, one for each of these three components:

The values are stored in the X, Y, Z position of a pointdata object.

OptimizePath Object

CreateOptimizePath This optimizes the path the probe travels in the part program so that it move in the most efficient way.

AddTipChanges If True, then the software chooses the best probe tip to use to measure each feature considered for optimization. If False, the probe tip doesn't change. AssignArms In a dual arm measurement environement, if set to True, during the optimized path creation, the software automatically chooses the best arm to measure each feature when that feature falls within the overlap distance. If set to False, the primary arm is used. You can define a percantage of the overlap to consider with the PercentOverlap property. ConeHalfAngle This determines the conical angle tolerance for added tip changes. This allows PC-DMIS to uilize a tip that has a shank vector that is within tolerance of the optimal vector angle for a given feature. DefinedTipsOnly If True, PC-DMIS only uses defined tips during the path optimization. If PC-DMIS can't find an appropriate tip for a feature, it assigns that feature to to T?A?B?. If False, PC-DMIS uses undefined tips. EndFeatureCommand Determines the end feature when sorting features by a range of features. See also StartFeatureCommand Property . InsertDimensionsAtEnd If True, PC-DMIS insertes dimensions at the end of the optimized path. If False, it inserts them immediately after the feature. IsAborted This property returns True if the optimization process is aborted and False otherwise. IsRunning This property returns True if the optimization process is running and False otherwise. MinimizeNumberOfTips If True, PC-DMIS minimizes the number of tips it uses to measure features in the measurement routine. If True, PC-DMIS only changes the tip's angle when absolutely necessary. Parent Read Only: Returns the parent PartProgram Object PercentOverlap A dual arm machine can have both arms measure certain features. This region where both arms can measure features is called the overlap. This property value defines the percentage of overlap to consider. For example, if you have 100 mm of overlap, and you enter 50% for this property then the software only considers 50mm as overlap. If a feature falls within this range and AssignArms is set to True, it becomes a candidate for the software to choose the best arm to measure. SmallestSearchIncrement Sets the search increment in degrees when looking for a probe tip. For example, if you have a wrist that supports an angle incrment of .1 degrees and you set this value to 5, when it searches for a probe tip to use for a feature, it searches using a five-degree increment. SortAllFeatures Read/Write: Feature Range - Sort all features SortPenalties The penatly value, in seconds, is an approximation of the time taken by a CMM to change tips this category of probes. The default pentalty mean that all features measured with a given tip are grouped together and sorted within that tip group. For example, if you set the penalty to zero, this allows the Optimize Path process to sort features based solely on the distance traveled between features while completely ignoring tip changes. The Sort penalty has three values, one for each of these three components: MIP/MIH Wrist PHS Wrist The values are stored in the X, Y, Z position of a pointdata object. StartFeatureCommand Determines the first feature when sorting features by a range of features. See also EndFeatureCommand Property UseMinConicalAngle If True PC-DMIS moves the probe tip angle by a minimum offset angle when the probe approach would normally cause a hit that is coincident with the probe body. This helps to reduce stress placed on probe bodies from these types of hits. If False, PC-DMIS doens't use an offset angle.

| OptimizePath ObjectMembers |

| CreateOptimizePath | This optimizes the path the probe travels in the part program so that it move in the most efficient way. |

| AddTipChanges | If True, then the software chooses the best probe tip to use to measure each feature considered for optimization. If False, the probe tip doesn't change. |
| AssignArms | In a dual arm measurement environement, if set to True, during the optimized path creation, the software automatically chooses the best arm to measure each feature when that feature falls within the overlap distance. If set to False, the primary arm is used. You can define a percantage of the overlap to consider with thePercentOverlapproperty. |
| ConeHalfAngle | This determines the conical angle tolerance for added tip changes. This allows PC-DMIS to uilize a tip that has a shank vector that is within tolerance of the optimal vector angle for a given feature. |
| DefinedTipsOnly | If True, PC-DMIS only uses defined tips during the path optimization. If PC-DMIS can't find an appropriate tip for a feature, it assigns that feature to to T?A?B?. If False, PC-DMIS uses undefined tips. |
| EndFeatureCommand | Determines the end feature when sorting features by a range of features. See alsoStartFeatureCommand Property. |
| InsertDimensionsAtEnd | If True, PC-DMIS insertes dimensions at the end of the optimized path. If False, it inserts them immediately after the feature. |
| IsAborted | This property returns True if the optimization process is aborted and False otherwise. |
| IsRunning | This property returns True if the optimization process is running and False otherwise. |
| MinimizeNumberOfTips | If  True, PC-DMIS minimizes the number of tips it uses to measure features in the measurement routine. If True, PC-DMIS only changes the tip's angle when absolutely necessary. |
| Parent | Read Only: Returns the parent PartProgram Object |
| PercentOverlap | A dual arm machine can have both arms measure certain features. This region where both arms can measure features is called the overlap. This property value defines the percentage of overlap to consider. For example, if you have 100 mm of overlap, and you enter 50% for this property then the software only considers 50mm as overlap. If a feature falls within this range andAssignArmsis set to True, it becomes a candidate for the software to choose the best arm to measure. |
| SmallestSearchIncrement | Sets the search increment in degrees when looking for a probe tip. For example, if you have a wrist that supports an angle incrment of .1 degrees and you set this value to 5, when it searches for a probe tip to use for a feature, it searches using a five-degree increment. |
| SortAllFeatures | Read/Write: Feature Range - Sort all features |
| SortPenalties | The penatly value, in seconds, is an approximation of the time taken by a CMM to change tips this category of probes. The default pentalty mean that all features measured with a given tip are grouped together and sorted within that tip group. For example, if you set the penalty to zero, this allows the Optimize Path process to sort features based solely on the distance traveled between features while completely ignoring tip changes.The Sort penalty has three values, one for each of these three components:MIP/MIHWristPHS WristThe values are stored in the X, Y, Z position of a pointdata object. |
| StartFeatureCommand | Determines the first feature when sorting features by a range of features. See alsoEndFeatureCommand Property |
| UseMinConicalAngle | If True PC-DMIS moves the probe tip angle by a minimum offset angle when the probe approach would normally cause a hit that is coincident with the probe body. This helps to reduce stress placed on probe bodies from these types of hits. If False, PC-DMIS doens't use an offset angle. |

- MIP/MIH
- Wrist
- PHS Wrist

### AddTipChanges

If True, then the software chooses the best probe tip to use to measure each feature considered for optimization. If False, the probe tip doesn't change.

### AssignArms

In a dual arm measurement environement, if set to True, during the optimized path creation, the software automatically chooses the best arm to measure each feature when that feature falls within the overlap distance. If set to False, the primary arm is used. You can define a percantage of the overlap to consider with the PercentOverlap property.

### ConeHalfAngle

This determines the conical angle tolerance for added tip changes. This allows PC-DMIS to uilize a tip that has a shank vector that is within tolerance of the optimal vector angle for a given feature.

### CreateOptimizePath

This optimizes the path the probe travels in the part program so that it move in the most efficient way.

### DefinedTipsOnly

If True, PC-DMIS only uses defined tips during the path optimization. If PC-DMIS can't find an appropriate tip for a feature, it assigns that feature to to T?A?B?. If False, PC-DMIS uses undefined tips.

### EndFeatureCommand

Determines the end feature when sorting features by a range of features. See also StartFeatureCommand Property .

### InsertDimensionsAtEnd

If True, PC-DMIS insertes dimensions at the end of the optimized path. If False, it inserts them immediately after the feature.

### IsAborted

This property returns True if the optimization process is aborted and False otherwise.

### IsRunning

This property returns True if the optimization process is running and False otherwise.

### MinimizeNumberOfTips

If True, PC-DMIS minimizes the number of tips it uses to measure features in the measurement routine. If True, PC-DMIS only changes the tip's angle when absolutely necessary.

### Parent

Read Only: Returns the parent PartProgram Object

### PercentOverlap

A dual arm machine can have both arms measure certain features. This region where both arms can measure features is called the overlap. This property value defines the percentage of overlap to consider. For example, if you have 100 mm of overlap, and you enter 50% for this property then the software only considers 50mm as overlap. If a feature falls within this range and AssignArms is set to True, it becomes a candidate for the software to choose the best arm to measure.

### SmallestSearchIncrement

Sets the search increment in degrees when looking for a probe tip. For example, if you have a wrist that supports an angle incrment of .1 degrees and you set this value to 5, when it searches for a probe tip to use for a feature, it searches using a five-degree increment.

### SortAllFeatures

Read/Write: Feature Range - Sort all features

### SortPenalties

The penatly value, in seconds, is an approximation of the time taken by a CMM to change tips this category of probes. The default pentalty mean that all features measured with a given tip are grouped together and sorted within that tip group. For example, if you set the penalty to zero, this allows the Optimize Path process to sort features based solely on the distance traveled between features while completely ignoring tip changes.

### StartFeatureCommand

Determines the first feature when sorting features by a range of features. See also EndFeatureCommand Property

### UseMinConicalAngle

If True PC-DMIS moves the probe tip angle by a minimum offset angle when the probe approach would normally cause a hit that is coincident with the probe body. This helps to reduce stress placed on probe bodies from these types of hits. If False, PC-DMIS doens't use an offset angle.


---

## PartProgramSettings

# PartProgramSettings Object

# Description

# Object Model

# See Also

PartProgramSettings Members

The **PartProgramSettings** object allows you to get or set various measurement routine settings.

| PartProgramSettings Object |

# PartProgramSettings Object Members

# Public Properties

# See Also

This property controls how to display forms during measurement routine execution.

PartProgramSettings Object

AbsoluteSpeeds Read/Write: AutoAdjustPh9 Returns the check box value or sets the Au**tomatically Adjust Probe Head Wrist c**heck box from the Ge****neral **ta**b of the Se****tUp Options **di**alog box. AutoLabelPosition Returns the check box value or sets the Au**tomatic Label Positioning c**heck box from the General tab of the SetUp Options dialog box. Def**aultDimensionColors Th**is read-only property returns an instance of the DefaultDimensionColors object. LoopedAnalysisUsesCadAlignment Read/Write: MiniroutineSettings Read Only: Returns the MiniroutineSettings Object MinusTolerancesShowNegative Read/Write: PointOnlyMode Read/Write: Point Only Mode ResetGlobalsWhenBranching Read/Write: Controls when global settings are reset ShowFormViewsInPopUpWindowWhileExecuting This property controls how to display forms during measurement routine execution. SkippedItemsSentToStats Read/Write: WarnLoadProbe Returns the check box value or sets the Please** Load Probe = %s warnin**g check box found in the Warnin**gs Display Options dialo**g box.

| PartProgramSettings ObjectMembers |

| AbsoluteSpeeds | Read/Write: |
| AutoAdjustPh9 | Returns the check box value or sets theAutomatically Adjust Probe Head Wristcheck box from theGeneraltab of theSetUp Optionsdialog box. |
| AutoLabelPosition | Returns the check box value or sets theAutomatic Label Positioningcheck box from theGeneraltab of theSetUp Optionsdialog box. |
| DefaultDimensionColors | This read-only property returns an instance of theDefaultDimensionColorsobject. |
| LoopedAnalysisUsesCadAlignment | Read/Write: |
| MiniroutineSettings | Read Only:  Returns the MiniroutineSettings Object |
| MinusTolerancesShowNegative | Read/Write: |
| PointOnlyMode | Read/Write: Point Only Mode |
| ResetGlobalsWhenBranching | Read/Write: Controls when global settings are reset |
| ShowFormViewsInPopUpWindowWhileExecuting | This property controls how to display forms during measurement routine execution. |
| SkippedItemsSentToStats | Read/Write: |
| WarnLoadProbe | Returns the check box value or sets thePlease Load Probe = %swarning check box found in theWarnings Display Optionsdialog box. |

### AbsoluteSpeeds

PartProgramSettings Object|PartProgramSettings Members

### AutoAdjustPh9

If you set this property an*on-zero valueor*Tru**e, t**hen PC-DMIS selects this check box.

### AutoLabelPosition

If you set this property an*on-zero valueor*Tru**e, t**hen PC-DMIS selects this check box.

### DefaultDimensionColors

PartProgramSettings Object|PartProgramSettings Members

### LoopedAnalysisUsesCadAlignment

PartProgramSettings Object|PartProgramSettings Members

### MiniroutineSettings

PartProgramSettings Object|PartProgramSettings Members

### MinusTolerancesShowNegative

PartProgramSettings Object|PartProgramSettings Members

### PointOnlyMode

PartProgramSettings Object|PartProgramSettings Members

### ResetGlobalsWhenBranching

PartProgramSettings Object|PartProgramSettings Members

### ShowFormViewsInPopUpWindowWhileExecuting

This property controls how to display forms during measurement routine execution.

### SkippedItemsSentToStats

PartProgramSettings Object|PartProgramSettings Members

### WarnLoadProbe

If you set this property an*on-zero valueor*Tru**e, t**hen PC-DMIS selects this check box.


---

## PictureData

# PictureData Object

# Description

# See Also

PictureData Members

Picture Data Object

| PictureData Object |

# PictureData Object Members

# Public Methods

# See Also

PictureData Object

GetBitmapData Get the bitmap data GetBitmapDataSize Get the buffer size of the bitmap data

| PictureData ObjectMembers |

| GetBitmapData | Get the bitmap data |
| GetBitmapDataSize | Get the buffer size of the bitmap data |

### GetBitmapData

Get the bitmap data

### GetBitmapDataSize

Get the buffer size of the bitmap data


---

## PointData

# PointData Object

# Description

# Remarks

# Example

# See Also

The PointData object is similar to a type defined as follows:

Type PointData

X as DoubleY as DoubleZ as Double

End Type

It is be used to pass points and vectors in automation functions that accept this type

PointData Members

The PointData object is similar to a type defined as follows: Type PointData X as Double Y as Double Z as Double End Type It is be used to pass points and vectors in automation functions that accept this type

| PointData Object |

# PointData Object Members

# Public Methods

# Public Properties

# See Also

This property is exactly the same as the X property, but was included for semantic reasons when working with vectors.

This property is exactly the same as the Y property, but was included for semantic reasons when working with vectors.

This property is exactly the same as the Z property, but was included for semantic reasons when working with vectors.

Represents the X member of this object.

Represents the Y member of this object.

Represents the Z member of this object.

PointData Object

IJK Sets the I, J, K values as a triplet XYZ Sets the X, Y, Z values as a triplet

I This property is exactly the same as the X property, but was included for semantic reasons when working with vectors. J This property is exactly the same as the Y property, but was included for semantic reasons when working with vectors. K This property is exactly the same as the Z property, but was included for semantic reasons when working with vectors. X Represents the X member of this object. Y Represents the Y member of this object. Z Represents the Z member of this object.

| PointData ObjectMembers |

| IJK | Sets the I, J, K values as a triplet |
| XYZ | Sets the X, Y, Z values as a triplet |

| I | This property is exactly the same as the X property, but was included for semantic reasons when working with vectors. |
| J | This property is exactly the same as the Y property, but was included for semantic reasons when working with vectors. |
| K | This property is exactly the same as the Z property, but was included for semantic reasons when working with vectors. |
| X | Represents the X member of this object. |
| Y | Represents the Y member of this object. |
| Z | Represents the Z member of this object. |

### I

This property is exactly the same as the X property, but was included for semantic reasons when working with vectors.

### IJK

Sets the I, J, K values as a triplet

### J

This property is exactly the same as the Y property, but was included for semantic reasons when working with vectors.

### K

This property is exactly the same as the Z property, but was included for semantic reasons when working with vectors.

### X

Represents the X member of this object.

### XYZ

Sets the X, Y, Z values as a triplet

### Y

Represents the Y member of this object.

### Z

Represents the Z member of this object.


---

## PortLock

# PortLock Object

# Description

# Object Model

# See Also

PortLock Members

Port Lock Object

| PortLock Object |

# PortLock Object Members

# Public Properties

# See Also

PortLock Object

_ID LockID Read Only: Returns Port lock ID Parent Read Only: Returns Application Object

| PortLock ObjectMembers |

| _ID | LockID | Read Only:  Returns Port lock ID |
| Parent | Read Only:  Returns Application Object |

### LockID

Read Only: Returns Port lock ID

### Parent

Read Only: Returns Application Object

### _ID

Visual Basic Public Property _ID As Integer


---

## ProbeToolBoxPage

# ProbeToolBoxPage Object

# Object Model

# See Also

ProbeToolBoxPage Members

| ProbeToolBoxPage Object |

# ProbeToolBoxPage Object Members

# Public Methods

# Public Properties

# See Also

ProbeToolBoxPage Object

SetItemValue Set value to a control of the page

Application Read Only: Returns the Application Object PageType Read Only: Returns the trye of the Pages Parent Read Only: Returns the parent IProbeToolBoxPages Object Visible Read Only: Indicates whether page visible to the user or not

| ProbeToolBoxPage ObjectMembers |

| SetItemValue | Set value to a control of the page |

| Application | Read Only: Returns the Application Object |
| PageType | Read Only: Returns the trye of the Pages |
| Parent | Read Only: Returns the parent IProbeToolBoxPages Object |
| Visible | Read Only: Indicates whether page visible to the user or not |

### Application

ProbeToolBoxPage Object|ProbeToolBoxPage Members

### PageType

ProbeToolBoxPage Object|ProbeToolBoxPage Members

### Parent

ProbeToolBoxPage Object|ProbeToolBoxPage Members

### SetItemValue

ProbeToolBoxPage Object|ProbeToolBoxPage Members

### Visible

ProbeToolBoxPage Object|ProbeToolBoxPage Members


---

## ProbeToolBoxPages

# ProbeToolBoxPages Object

# Object Model

# See Also

ProbeToolBoxPages Members

| ProbeToolBoxPages Object |

# ProbeToolBoxPages Object Members

# Public Methods

# Public Properties

# See Also

ProbeToolBoxPages Object

First Returns the first registry setting Item Returns the probe Tool Box page specified by the pageType Next Returns the the next registry setting VisibleItemAtIndex Returns the visible probe Tool Box page specified by the index value

Application Read Only: Returns the Application Object Count Read Only: Returns the number of probe ToolBox pages supported by current PCDMIS version CountVisiblePages Read Only: Returns the number of visible probe ToolBox pages Parent Read Only: Returns the parent PartProgramm Object Visible Read/Write: Returns visibility status of probe tool box or shows or hides it.

| ProbeToolBoxPages ObjectMembers |

| First | Returns the first registry setting |
| Item | Returns the probe Tool Box page specified by the pageType |
| Next | Returns the the next registry setting |
| VisibleItemAtIndex | Returns the visible probe Tool Box page specified by the index value |

| Application | Read Only:  Returns the Application Object |
| Count | Read Only:  Returns the number of probe ToolBox pages supported by current PCDMIS version |
| CountVisiblePages | Read Only:  Returns the number of visible probe ToolBox pages |
| Parent | Read Only:  Returns the parent PartProgramm Object |
| Visible | Read/Write:  Returns visibility status of probe tool box or shows or hides it. |

### Application

ProbeToolBoxPages Object|ProbeToolBoxPages Members

### Count

ProbeToolBoxPages Object|ProbeToolBoxPages Members

### CountVisiblePages

ProbeToolBoxPages Object|ProbeToolBoxPages Members

### First

ProbeToolBoxPages Object|ProbeToolBoxPages Members

### Item

ProbeToolBoxPages Object|ProbeToolBoxPages Members

### Next

ProbeToolBoxPages Object|ProbeToolBoxPages Members

### Parent

ProbeToolBoxPages Object|ProbeToolBoxPages Members

### Visible

ProbeToolBoxPages Object|ProbeToolBoxPages Members

### VisibleItemAtIndex

ProbeToolBoxPages Object|ProbeToolBoxPages Members


---

## Probe_Tool_Page

# Probe_Tool_Page Enumeration

# Members

Member Value Description PTPA_ContactAutoMoveProperties 23 PTPA_ContactFindHoleProperties 24 PTPA_ContactPathProperties 21 PTPA_ContactSampleHitsProperties 22 PTPA_ContactTargets 5 PTPA_LaserClippingPropertyPage 18 PTPA_LaserFeatExtractPropertyPage 19 PTPA_LaserFilteringCmsProperties 16 PTPA_LaserFilteringProperties 15 PTPA_LaserMultipleCreationPage 20 PTPA_LaserPixelLocatorProperties 17 PTPA_LaserScanCmsProperties 13 PTPA_LaserScanProperties 12 PTPA_LaserScanTScanProperties 14 PTPA_LaserTargets 4 PTPA_Location 6 PTPA_MeasurementStrategies 1 PTPA_None -1 PTPA_Probe 0 PTPA_VisionBlobStrategy 2 PTPA_VisionDiagnostics 11 PTPA_VisionFocus 9 PTPA_VisionGage 10 PTPA_VisionIllumination 8 PTPA_VisionMagnification 7 PTPA_VisionTargets 3

| Probe_Tool_Page Enumeration |

| Member | Value | Description |
| --- | PTPA_ContactAutoMoveProperties | 23 | PTPA_ContactFindHoleProperties | 24 | PTPA_ContactPathProperties | 21 | PTPA_ContactSampleHitsProperties | 22 | PTPA_ContactTargets | 5 | PTPA_LaserClippingPropertyPage | 18 | PTPA_LaserFeatExtractPropertyPage | 19 | PTPA_LaserFilteringCmsProperties | 16 | PTPA_LaserFilteringProperties | 15 | PTPA_LaserMultipleCreationPage | 20 | PTPA_LaserPixelLocatorProperties | 17 | PTPA_LaserScanCmsProperties | 13 | PTPA_LaserScanProperties | 12 | PTPA_LaserScanTScanProperties | 14 | PTPA_LaserTargets | 4 | PTPA_Location | 6 | PTPA_MeasurementStrategies | 1 | PTPA_None | -1 | PTPA_Probe | 0 | PTPA_VisionBlobStrategy | 2 | PTPA_VisionDiagnostics | 11 | PTPA_VisionFocus | 9 | PTPA_VisionGage | 10 | PTPA_VisionIllumination | 8 | PTPA_VisionMagnification | 7 | PTPA_VisionTargets | 3


---

## QuickFeatureSelection

# QuickFeatureSelection Object

# Description

# Object Model

# See Also

QuickFeatureSelection Members

QuickFeatureSelection Object

| QuickFeatureSelection Object |

# QuickFeatureSelection Object Members

# Public Properties

# See Also

QuickFeatureSelection Object

Application Read Only: Returns object pointer of type Application Name Read Only: Name of the selected QuickFeature Parent Read Only: Returns object pointer to PartPrograms Object Type Read Only: Type of the selected QuickFeature

| QuickFeatureSelection ObjectMembers |

| Application | Read Only:  Returns object pointer of type Application |
| Name | Read Only:  Name of the selected QuickFeature |
| Parent | Read Only:  Returns object pointer to PartPrograms Object |
| Type | Read Only:  Type of the selected QuickFeature |

### Application

QuickFeatureSelection Object|QuickFeatureSelection Members

### Name

QuickFeatureSelection Object|QuickFeatureSelection Members

### Parent

QuickFeatureSelection Object|QuickFeatureSelection Members

### Type

QuickFeatureSelection Object|QuickFeatureSelection Members


---

## QuickStart

# QuickStart Object

# Object Model

# See Also

QuickStart Members

| QuickStart Object |

# QuickStart Object Members

# Public Methods

# Public Properties

# See Also

QuickStart Object

BeginTask Starts a new Quick Start task, returning that task if successful RemoveHit Erases the last hit taken

CurrentTask Read Only: Returns the current Task

| QuickStart ObjectMembers |

| BeginTask | Starts a new Quick Start task, returning that task if successful |
| RemoveHit | Erases the last hit taken |

| CurrentTask | Read Only:  Returns the current Task |

### BeginTask

Starts a new Quick Start task, returning that task if successful

### CurrentTask

Read Only: Returns the current Task

### RemoveHit

Erases the last hit taken


---

## QuickStartAddedCommands

# QuickStartAddedCommands Object

# Object Model

# See Also

QuickStartAddedCommands Members

| QuickStartAddedCommands Object |

# QuickStartAddedCommands Object Members

# Public Methods

# Public Properties

# See Also

QuickStartAddedCommands Object

_Item Item Returns command object from added commands collection by number

Count Read Only: Number of steps in the collection

| QuickStartAddedCommands ObjectMembers |

| _Item | Item | Returns command object from added commands collection by number |

| Count | Read Only:  Number of steps in the collection |

### Count

QuickStartAddedCommands Object|QuickStartAddedCommands Members

### Item

QuickStartAddedCommands Object|QuickStartAddedCommands Members

### _Item

QuickStartAddedCommands Object|QuickStartAddedCommands Members


---

## QuickStartStep

# QuickStartStep Object

# See Also

QuickStartStep Members

| QuickStartStep Object |

# QuickStartStep Object Members

# Public Methods

# Public Properties

# See Also

QuickStartStep Object

GetControlState Get a check box or radio button state by index GetControlText Get a check box text value by index GetEditText Get an edit box text value by index GetPrompt Get a prompt by index GetSelectionPrompt Get the combo box text SetControlState Set a check box or radio button state by index SetEditText Set an edit box text value by index

CanBeCompleted Read Only: The Step can be completed ExpectsHits Read Only: The step expects hits ExpectsUserInput Read Only: The step expects user input NumHits Read Only: The minimum number of hits required StepHint Read Only: The prompt to be displayed to the user

| QuickStartStep ObjectMembers |

| GetControlState | Get a check box or radio button state by index |
| GetControlText | Get a check box text value by index |
| GetEditText | Get an edit box text value by index |
| GetPrompt | Get a prompt by index |
| GetSelectionPrompt | Get the combo box text |
| SetControlState | Set a check box or radio button state by index |
| SetEditText | Set an edit box text value by index |

| CanBeCompleted | Read Only:  The Step can be completed |
| ExpectsHits | Read Only:  The step expects hits |
| ExpectsUserInput | Read Only:  The step expects user input |
| NumHits | Read Only:  The minimum number of hits required |
| StepHint | Read Only:  The prompt to be displayed to the user |

### CanBeCompleted

QuickStartStep Object|QuickStartStep Members

### ExpectsHits

QuickStartStep Object|QuickStartStep Members

### ExpectsUserInput

QuickStartStep Object|QuickStartStep Members

### GetControlState

QuickStartStep Object|QuickStartStep Members

### GetControlText

QuickStartStep Object|QuickStartStep Members

### GetEditText

QuickStartStep Object|QuickStartStep Members

### GetPrompt

QuickStartStep Object|QuickStartStep Members

### GetSelectionPrompt

QuickStartStep Object|QuickStartStep Members

### NumHits

QuickStartStep Object|QuickStartStep Members

### SetControlState

QuickStartStep Object|QuickStartStep Members

### SetEditText

QuickStartStep Object|QuickStartStep Members

### StepHint

QuickStartStep Object|QuickStartStep Members


---

## QuickStartSteps

# QuickStartSteps Object

# Object Model

# See Also

QuickStartSteps Members

| QuickStartSteps Object |

# QuickStartSteps Object Members

# Public Methods

# Public Properties

# See Also

QuickStartSteps Object

_Item Item Returns quick start step object from steps collection by number

Count Read Only: Number of steps in the collection

| QuickStartSteps ObjectMembers |

| _Item | Item | Returns quick start step object from steps collection by number |

| Count | Read Only:  Number of steps in the collection |

### Count

QuickStartSteps Object|QuickStartSteps Members

### Item

QuickStartSteps Object|QuickStartSteps Members

### _Item

QuickStartSteps Object|QuickStartSteps Members


---

## QuickStartTask

# QuickStartTask Object

# Object Model

# See Also

QuickStartTask Members

| QuickStartTask Object |

# QuickStartTask Object Members

# Public Methods

# Public Properties

# See Also

QuickStartTask Object

Finish Finishes the task NextStep Advances to the next step in the task PrevStep Goes back to the previous step in the task

NumSteps Read Only: Returns the number of steps in this task Steps Read Only: Returns a collection containing the steps in this task

| QuickStartTask ObjectMembers |

| Finish | Finishes the task |
| NextStep | Advances to the next step in the task |
| PrevStep | Goes back to the previous step in the task |

| NumSteps | Read Only:  Returns the number of steps in this task |
| Steps | Read Only:  Returns a collection containing the steps in this task |

### Finish

QuickStartTask Object|QuickStartTask Members

### NextStep

QuickStartTask Object|QuickStartTask Members

### NumSteps

QuickStartTask Object|QuickStartTask Members

### PrevStep

QuickStartTask Object|QuickStartTask Members

### Steps

QuickStartTask Object|QuickStartTask Members


---

## RegistrySetting

# RegistrySetting Object

# See Also

RegistrySetting Members

| RegistrySetting Object |

# RegistrySetting Object Members

# Public Methods

# Public Properties

# See Also

RegistrySetting Object

DeleteKey Deletes the key from use in the application IsWriteable Read Only: Setting can be modified

AccessLevel Read Only: Administrator or User Group Read Only: Machine or User KeyName Read Only: Section Name Type Read Only: Type Used Read Only: Used by the application Value Read/Write: Entry Value ValueName Read Only: Entry Name

| RegistrySetting ObjectMembers |

| DeleteKey | Deletes the key from use in the application |
| IsWriteable | Read Only:  Setting can be modified |

| AccessLevel | Read Only:  Administrator or User |
| Group | Read Only:  Machine or User |
| KeyName | Read Only:  Section Name |
| Type | Read Only:  Type |
| Used | Read Only:  Used by the application |
| Value | Read/Write:  Entry Value |
| ValueName | Read Only:  Entry Name |

### AccessLevel

RegistrySetting Object|RegistrySetting Members

### DeleteKey

RegistrySetting Object|RegistrySetting Members

### Group

RegistrySetting Object|RegistrySetting Members

### IsWriteable

RegistrySetting Object|RegistrySetting Members

### KeyName

RegistrySetting Object|RegistrySetting Members

### Type

RegistrySetting Object|RegistrySetting Members

### Used

RegistrySetting Object|RegistrySetting Members

### Value

RegistrySetting Object|RegistrySetting Members

### ValueName

RegistrySetting Object|RegistrySetting Members


---

## RegistrySettings

# RegistrySettings Object

# Object Model

# See Also

RegistrySettings Members

| RegistrySettings Object |

# RegistrySettings Object Members

# Public Methods

# Public Properties

# See Also

RegistrySettings Object

First Returns the first registry setting Item Returns the registry settings specified by composite name or number from the list of settings Next Returns the the next registry setting RemoveAll Removes all of the entries from the registry

Application Read Only: Returns the Application Object Count Read Only: Returns the number of registry settings for the application Parent Read Only: Returns the parent Application Object

| RegistrySettings ObjectMembers |

| First | Returns the first registry setting |
| Item | Returns the registry settings specified by composite name or number from the list of settings |
| Next | Returns the the next registry setting |
| RemoveAll | Removes all of the entries from the registry |

| Application | Read Only:  Returns the Application Object |
| Count | Read Only:  Returns the number of registry settings for the application |
| Parent | Read Only:  Returns the parent Application Object |

### Application

RegistrySettings Object|RegistrySettings Members

### Count

RegistrySettings Object|RegistrySettings Members

### First

RegistrySettings Object|RegistrySettings Members

### Item

RegistrySettings Object|RegistrySettings Members

### Next

RegistrySettings Object|RegistrySettings Members

### Parent

RegistrySettings Object|RegistrySettings Members

### RemoveAll

RegistrySettings Object|RegistrySettings Members


---

## RoutineExecutionTimeManager

# RoutineExecutionTimeManager Object

# Object Model

# See Also

RoutineExecutionTimeManager Members

| RoutineExecutionTimeManager Object |

# RoutineExecutionTimeManager Object Members

# Public Methods

# Public Properties

# See Also

RoutineExecutionTimeManager Object

GetEntireRoutineExecutionTime Get Entire Routine Execution Time GetMiniRoutineExecutionTime Get Mini Routine Execution Time

Application Read Only: Returns the Application Object Parent Read Only: Returns the Parent PartProgram Object

| RoutineExecutionTimeManager ObjectMembers |

| GetEntireRoutineExecutionTime | Get Entire Routine Execution Time |
| GetMiniRoutineExecutionTime | Get Mini Routine Execution Time |

| Application | Read Only:  Returns the Application Object |
| Parent | Read Only:  Returns the Parent PartProgram Object |

### Application

RoutineExecutionTimeManager Object|RoutineExecutionTimeManager Members

### GetEntireRoutineExecutionTime

RoutineExecutionTimeManager Object|RoutineExecutionTimeManager Members

### GetMiniRoutineExecutionTime

RoutineExecutionTimeManager Object|RoutineExecutionTimeManager Members

### Parent

RoutineExecutionTimeManager Object|RoutineExecutionTimeManager Members


---

## STATISTICS

# STATISTICS Object Members

# Public Methods

# Public Properties

# See Also

Determines whether the calculation mode inside of DataPage is turned off or on.

ENUM_STAT_NAME_TYPES enumeration value indicating whether the feature name or the dimension name should be sent to DataPage. If set to PCD_STAT_FEAT_NAME (1), the feature name is used. If set to PCD_STAT_DIM_NAME (0), the dimension name is used.

ENUM_PCD_STAT_TYPES enumeration value representing the mode or function of the statistics command.

STATISTICS Object

AddStatsDir Adds a directory to the list of statistics directory. GetStatsDir Returns the specified stats directory. RemoveStatsDir Removes a directory from list of stats directories. SetStatsDir Sets a specified stats directory.

CalcMode Determines whether the calculation mode inside of DataPage is turned off or on. MemoryPages Returns the number of memory pages to be used by DataPage. NameType ENUM_STAT_NAME_TYPES enumeration value indicating whether the feature name or the dimension name should be sent to DataPage. If set to PCD_STAT_FEAT_NAME (1), the feature name is used. If set to PCD_STAT_DIM_NAME (0), the dimension name is used. ReadLock L****on**g **value representing the number of seconds in timeout period that DataPage uses when trying to read the LMS license or portlock. StatMode ENUM_PCD_STAT_TYPES enumeration value representing the mode or function of the statistics command. TransferDir S**tring **value indicating the directory to which to move the stat file. WriteLock Long value representing number of seconds in timeout period that DataPage uses when trying to write to the LMS license or portlock.

| STATISTICS ObjectMembers |

| AddStatsDir | Adds a directory to the list of statistics directory. |
| GetStatsDir | Returns the specified stats directory. |
| RemoveStatsDir | Removes a directory from list of stats directories. |
| SetStatsDir | Sets a specified stats directory. |

| CalcMode | Determines whether the calculation mode inside of DataPage is turned off or on. |
| MemoryPages | Returns the number of memory pages to be used by DataPage. |
| NameType | ENUM_STAT_NAME_TYPES enumeration value indicating whether the feature name or the dimension name should be sent to DataPage. If set to PCD_STAT_FEAT_NAME (1), the feature name is used. If set to PCD_STAT_DIM_NAME (0), the dimension name is used. |
| ReadLock | Longvalue representing the number of seconds in timeout period that DataPage uses when trying to read the LMS license or portlock. |
| StatMode | ENUM_PCD_STAT_TYPES enumeration value representing the mode or function of the statistics command. |
| TransferDir | Stringvalue indicating the directory to which to move the stat file. |
| WriteLock | Longvalue representing number of seconds in timeout period that DataPage uses when trying to write to the LMS license or portlock. |

### AddStatsDir

Adds a directory to the list of statistics directory.

### CalcMode

Determines whether the calculation mode inside of DataPage is turned off or on.

### GetStatsDir

Returns the specified stats directory.

### MemoryPages

Returns the number of memory pages to be used by DataPage.

### NameType

ENUM_STAT_NAME_TYPES enumeration value indicating whether the feature name or the dimension name should be sent to DataPage. If set to PCD_STAT_FEAT_NAME (1), the feature name is used. If set to PCD_STAT_DIM_NAME (0), the dimension name is used.

### ReadLock

**Long** value representing the number of seconds in timeout period that DataPage uses when trying to read the LMS license or portlock.

### RemoveStatsDir

Removes a directory from list of stats directories.

### SetStatsDir

Sets a specified stats directory.

### StatMode

ENUM_PCD_STAT_TYPES enumeration value representing the mode or function of the statistics command.

### TransferDir

**String** value indicating the directory to which to move the stat file.

### WriteLock

**Long** value representing number of seconds in timeout period that DataPage uses when trying to write to the LMS license or portlock.


---

## Strategies

# Strategies Object

# Description

# Object Model

# Example

# See Also

You can access the Strategies object through thestrategiesproperty in theCommandobject.

Strategies Members

This **Strategies** object contains a collection of the PC-DMIS measurement strategies. You can access the Strategies object through the strategies property in the Command object.

Example (Visual Basic) Copy Code Private Sub SearchStrategiesForEachCommand_Click() Dim strategy As PCDLRN.strategy Dim index As Integer FoundStrategyList.Clear If cmds Is Nothing Then Exit Sub Set cmd = cmds.Item(FeatureID.Text) If cmd Is Nothing Then Exit Sub Set strategies = cmd.strategies If strategies Is Nothing Then Exit Sub FoundStrategyNumber.Text = CStr (strategies.Count) CurStrategyName.Text = strategies.CurrentStrategy.Name CurStrategyInternalIndex.Text = Str (strategies.CurrentStrategy.index) index = 0 For Each strategy In strategies FoundStrategyList.AddItem (strategy.Name + ": Index=" + Str (index) + "; Internal Index=" + Str (strategy.index)) If strategy.IsDefaultStrategy Then DefStrategyName.Text = strategy.Name DefStrategyIndex.Text = Str (index) DefStrategyInternalIndex.Text = Str (strategy.index) End If If strategy.Name = CurStrategyName.Text Then CurStrategyIndex.Text = Str (index) End If index = index + 1 Next End Sub

```vbscript
Private Sub SearchStrategiesForEachCommand_Click()
Dim strategy As PCDLRN.strategy
Dim index As Integer
FoundStrategyList.Clear
If cmds Is Nothing Then Exit Sub
Set cmd = cmds.Item(FeatureID.Text)
If cmd Is Nothing Then Exit Sub
Set strategies = cmd.strategies
If strategies Is Nothing Then Exit Sub
FoundStrategyNumber.Text = CStr(strategies.Count)
CurStrategyName.Text = strategies.CurrentStrategy.Name
CurStrategyInternalIndex.Text = Str(strategies.CurrentStrategy.index)

index = 0
For Each strategy In strategies
    FoundStrategyList.AddItem (strategy.Name + ": Index=" + Str(index) + "; Internal Index=" + Str(strategy.index))
    If strategy.IsDefaultStrategy Then
        DefStrategyName.Text = strategy.Name
        DefStrategyIndex.Text = Str(index)
        DefStrategyInternalIndex.Text = Str(strategy.index)
    End If
    If strategy.Name = CurStrategyName.Text Then
        CurStrategyIndex.Text = Str(index)
    End If
    index = index + 1
Next
 
End Sub
```

| Strategies Object |

| Example (Visual Basic) |
| PrivateSubSearchStrategiesForEachCommand_Click()DimstrategyAsPCDLRN.strategyDimindexAsIntegerFoundStrategyList.ClearIfcmdsIsNothingThenExit SubSetcmd = cmds.Item(FeatureID.Text)IfcmdIsNothingThenExit SubSetstrategies = cmd.strategiesIfstrategiesIsNothingThenExit SubFoundStrategyNumber.Text =CStr(strategies.Count)
CurStrategyName.Text = strategies.CurrentStrategy.Name
CurStrategyInternalIndex.Text =Str(strategies.CurrentStrategy.index)

index = 0ForEachstrategyInstrategies
    FoundStrategyList.AddItem (strategy.Name +": Index="+Str(index) +"; Internal Index="+Str(strategy.index))Ifstrategy.IsDefaultStrategyThenDefStrategyName.Text = strategy.Name
        DefStrategyIndex.Text =Str(index)
        DefStrategyInternalIndex.Text =Str(strategy.index)EndIfIfstrategy.Name = CurStrategyName.TextThenCurStrategyIndex.Text =Str(index)EndIfindex = index + 1NextEnd Sub |

# Strategies Object Members

# Public Methods

# Public Properties

# See Also

Strategies Object

Item Returns the Strategy specified by name or number from the list of strategies SetCurrentStrategy Sets the current Strategy for the command. Returns FALSE in case of failure

Application Read Only: Returns the Application Object Count Read Only: Returns the number of Strategies for the command CurrentStrategy Reads/Sets the current Strategy for the command Parent Read Only: Returns the parent Command Object

| Strategies ObjectMembers |

| Item | Returns the Strategy specified by name or number from the list of strategies |
| SetCurrentStrategy | Sets the current Strategy for the command. Returns FALSE in case of failure |

| Application | Read Only:  Returns the Application Object |
| Count | Read Only:  Returns the number of Strategies for the command |
| CurrentStrategy | Reads/Sets the current Strategy for the command |
| Parent | Read Only:  Returns the parent Command Object |

### Application

Read Only: Returns the Application Object

### Count

Read Only: Returns the number of Strategies for the command

### CurrentStrategy

Reads/Sets the current Strategy for the command

### Item

Returns the Strategy specified by name or number from the list of strategies

### Parent

Read Only: Returns the parent Command Object

### SetCurrentStrategy

Sets the current Strategy for the command. Returns FALSE in case of failure


---

## Strategy

# Strategy Object

# Description

# Object Model

# See Also

Strategy Members

This **Strategy** object lets you manipulate a specific strategy contained within the **Strategies **collection.

| Strategy Object |

# Strategy Object Members

# Public Properties

# See Also

Strategy Object

Application Read Only: Returns the Application Object index Read Only: Returns the internal index of strategy IsDefaultStrategy Read Only: Returns the information if the strategy is the default strategy Name Read Only: Returns the Strategy Name Parent Read Only: Returns the parent Stategies Collection Object

| Strategy ObjectMembers |

| Application | Read Only:  Returns the Application Object |
| index | Read Only:  Returns the internal index of strategy |
| IsDefaultStrategy | Read Only:  Returns the information if the strategy is the default strategy |
| Name | Read Only:  Returns the Strategy Name |
| Parent | Read Only:  Returns the parent Stategies Collection Object |

### Application

Read Only: Returns the Application Object

### IsDefaultStrategy

Read Only: Returns the information if the strategy is the default strategy

### Name

Read Only: Returns the Strategy Name

### Parent

Read Only: Returns the parent Stategies Collection Object

### index

Read Only: Returns the internal index of strategy


---

## TRACEFIELD

# TRACEFIELD Object Members

# Public Methods

# Public Properties

# See Also

**String**value representing the name of the tracefield.

**Stringv**alue representing the value for the tracefield.

TRACEFIELD Object

AddValueOption Add a value option for the tracefield ClearValueOptions Clear value options for the tracefield GetValueOptions Get value options for the tracefield SetValueOptionIndex Set index of value options for the tracefield

DataSource Read/Write: Data Source of the statisitcal tracefield DisplayDuringExecution Read/Write: Display trace during execution DisplayMessage Read/Write: DisplayMessage of the statisitcal tracefield DisplayOnReport Read/Write: Display trace on report Name S****tring** **value representing the name of the tracefield. UpperCaseOnly Read/Write: Value Property: ValueCase Value String value representing the value for the tracefield. ValueIsMandatory Read/Write: Value Property: ValueIsMandatory ValueMaxLength Read/Write: Value Property: ValueMaxLength ValueType Read/Write: Value Property: ValueType

| TRACEFIELD ObjectMembers |

| AddValueOption | Add a value option for the tracefield |
| ClearValueOptions | Clear value options for the tracefield |
| GetValueOptions | Get value options for the tracefield |
| SetValueOptionIndex | Set index of value options for the tracefield |

| DataSource | Read/Write: Data Source of the statisitcal tracefield |
| DisplayDuringExecution | Read/Write: Display trace during execution |
| DisplayMessage | Read/Write: DisplayMessage of the statisitcal tracefield |
| DisplayOnReport | Read/Write: Display trace on report |
| Name | Stringvalue representing the name of the tracefield. |
| UpperCaseOnly | Read/Write: Value Property: ValueCase |
| Value | Stringvalue representing the value for the tracefield. |
| ValueIsMandatory | Read/Write: Value Property: ValueIsMandatory |
| ValueMaxLength | Read/Write: Value Property: ValueMaxLength |
| ValueType | Read/Write: Value Property: ValueType |

### AddValueOption

Add a value option for the tracefield

### ClearValueOptions

Clear value options for the tracefield

### DataSource

Read/Write: Data Source of the statisitcal tracefield

### DisplayDuringExecution

Read/Write: Display trace during execution

### DisplayMessage

Read/Write: DisplayMessage of the statisitcal tracefield

### DisplayOnReport

Read/Write: Display trace on report

### GetValueOptions

Get value options for the tracefield

### Name

**String**value representing the name of the tracefield.

### SetValueOptionIndex

Set index of value options for the tracefield

### UpperCaseOnly

Read/Write: Value Property: ValueCase

### Value

**Stringv**alue representing the value for the tracefield.

### ValueIsMandatory

Read/Write: Value Property: ValueIsMandatory

### ValueMaxLength

Read/Write: Value Property: ValueMaxLength

### ValueType

Read/Write: Value Property: ValueType


---

## Target

# Target Object

# See Also

Target Members

| Target Object |

# Target Object Members

# Public Properties

# See Also

Target Object

CrossHairSize Read/Write: Returns target crosshair size EdgeScanDirection Read/Write: Returns target edge scan direction EdgeSelectionSpecifiedNum Read/Write: Returns target edge selection specified number EdgeSelectionType Read/Write: Returns target edge selection type Focus Read/Write: Returns target focus setting FocusDuration Read/Write: Returns target focus duration FocusHiAccuracy Read/Write: Returns target focus high accuracy setting FocusRange Read/Write: Returns target focus range OutlierFilter Read/Write: Returns target outlier filter setting OutlierFilterDistanceThreshold Read/Write: Returns target outlier filter diatance threshold OutlierFilterMinNeighbors Read/Write: Returns target outlier filter minimum neighbors OutlierFilterNeighborDistanceMultiplier Read/Write: Returns target outlier filter neighbor distance multiplier OutlierFilterStdDevThreshold Read/Write: Returns target outlier filter standard deviation threshold OutlierFilterUsingNeighbors Read/Write: Returns target outlier filter using neighbors setting PointDensityType Read/Write: Returns target point density type Strength Read/Write: Returns target edge strength

| Target ObjectMembers |

| CrossHairSize | Read/Write:  Returns target crosshair size |
| EdgeScanDirection | Read/Write:  Returns target edge scan direction |
| EdgeSelectionSpecifiedNum | Read/Write:  Returns target edge selection specified number |
| EdgeSelectionType | Read/Write:  Returns target edge selection type |
| Focus | Read/Write:  Returns target focus setting |
| FocusDuration | Read/Write:  Returns target focus duration |
| FocusHiAccuracy | Read/Write:  Returns target focus high accuracy setting |
| FocusRange | Read/Write:  Returns target focus range |
| OutlierFilter | Read/Write:  Returns target outlier filter setting |
| OutlierFilterDistanceThreshold | Read/Write:  Returns target outlier filter diatance threshold |
| OutlierFilterMinNeighbors | Read/Write:  Returns target outlier filter minimum neighbors |
| OutlierFilterNeighborDistanceMultiplier | Read/Write:  Returns target outlier filter neighbor distance multiplier |
| OutlierFilterStdDevThreshold | Read/Write:  Returns target outlier filter standard deviation threshold |
| OutlierFilterUsingNeighbors | Read/Write:  Returns target outlier filter using neighbors setting |
| PointDensityType | Read/Write:  Returns target point density type |
| Strength | Read/Write:  Returns target edge strength |

### CrossHairSize

Read/Write: Returns target crosshair size

### EdgeScanDirection

Read/Write: Returns target edge scan direction

### EdgeSelectionSpecifiedNum

Read/Write: Returns target edge selection specified number

### EdgeSelectionType

Read/Write: Returns target edge selection type

### Focus

Read/Write: Returns target focus setting

### FocusDuration

Read/Write: Returns target focus duration

### FocusHiAccuracy

Read/Write: Returns target focus high accuracy setting

### FocusRange

Read/Write: Returns target focus range

### OutlierFilter

Read/Write: Returns target outlier filter setting

### OutlierFilterDistanceThreshold

Read/Write: Returns target outlier filter diatance threshold

### OutlierFilterMinNeighbors

Read/Write: Returns target outlier filter minimum neighbors

### OutlierFilterNeighborDistanceMultiplier

Read/Write: Returns target outlier filter neighbor distance multiplier

### OutlierFilterStdDevThreshold

Read/Write: Returns target outlier filter standard deviation threshold

### OutlierFilterUsingNeighbors

Read/Write: Returns target outlier filter using neighbors setting

### PointDensityType

Read/Write: Returns target point density type

### Strength

Read/Write: Returns target edge strength


---

## Targets

# Targets Object

# Object Model

# See Also

Targets Members

| Targets Object |

# Targets Object Members

# Public Methods

# Public Properties

# See Also

Targets Object

_Item Add Adds the target object to the targets collection Item Returns the target object referenced by the Num parameter Remove Removes the taret object referenced by the Num parameter from the targets collection

Application Read Only: Returns the Application Object Count Read Only: Returns the current number of targets Parent Read Only: Returns the parent Feature Object

| Targets ObjectMembers |

| _Item | Add | Adds the target object to the targets collection |
| Item | Returns the target object referenced by the Num parameter |
| Remove | Removes the taret object referenced by the Num parameter from the targets collection |

| Application | Read Only:  Returns the Application Object |
| Count | Read Only:  Returns the current number of targets |
| Parent | Read Only:  Returns the parent Feature Object |

### Add

Adds the target object to the targets collection

### Application

Read Only: Returns the Application Object

### Count

Read Only: Returns the current number of targets

### Item

Returns the target object referenced by the Num parameter

### Parent

Read Only: Returns the parent Feature Object

### Remove

Removes the taret object referenced by the Num parameter from the targets collection

### _Item

Visual Basic Public Function _Item( _ ByVal Nu*m A*s Long _ ) As Target


---

## TempComp

# TempComp Object

# Description

# Remarks

# See Also

TheT**empCompo**bject gives access to the properties of the PC-DMIS Temperature Compensation command. For additional information about Temperature Compensation, see "Compensating for Temperature" in the "Setting Your Preferences"sectionof thePC-DMIS Help File.

In PC-DMIS, you can use four different WPF dialog boxes to control Temperature Compensation. The IDs you can access on each through automation are provided below:

**Compensation Setup**dialog box - Edit | Preferences | Temperature Compensation Setup

const int IDC_TEMP_COMP_CELSIUS = 2122;const int IDC_TEMP_COMP_ON = 1774;const int IDC_TEMP_SENS_NUM_X = 2091;const int IDC_TEMP_COEFF_X = 2092;const int IDC_TEMP_SENS_NUM_Y = 2093;const int IDC_TEMP_COEFF_Y = 681;const int IDC_TEMP_SENS_NUM_Z = 2094;const int IDC_TEMP_COEFF_Z = 682;const int IDC_TEMP_SENS_NUM_P = 2095;const int IDC_TEMP_COEFF_P = 683;

**Thermal Expansion Origin**dialog box - Insert | Parameter Change | Thermal Expansion Origin

const int IDC_TEMP_ORIGIN_X = 2100;const int IDC_TEMP_ORIGIN_Y = 696;const int IDC_TEMP_ORIGIN_Z = 697;

**Temperature Compensation Command**dialog box - Insert | Parameter Change | Temperature Compensation

const int IDC_TEMP_COMP_CELSIUS = 2122;const int IDC_TEMP_AUTOMATIC = 2101;const int IDC_TEMP_COEFF_X = 2092;const int IDC_TEMP_HI_X = 2098;const int IDC_TEMP_LO_X = 2099;const int IDC_TEMP_COEFF_Y = 681;const int IDC_TEMP_HI_Y = 690;const int IDC_TEMP_LO_Y = 693;const int IDC_TEMP_COEFF_Z = 682;const int IDC_TEMP_HI_Z = 691;const int IDC_TEMP_LO_Z = 694;const int IDC_TEMP_COEFF_P = 683;const int IDC_TEMP_HI_P = 692;const int IDC_TEMP_LO_P = 695;const int IDC_TEMP_COEFF_LIST = 14395;

**Temperature Compensation Command**dialog box (Execution) - Ensure that the TEMPCOMP command is set to the Manual method, then execute the routine.

const int IDC_TEMP_COMP_CELSIUS = 2122;const int IDC_TEMP_COMP_ON = 1774;const int IDC_TEMP_CURTEMP_X = 2096;const int IDC_TEMP_HI_X = 2098;const int IDC_TEMP_LO_X = 2099;const int IDC_TEMP_CURTEMP_Y = 684;const int IDC_TEMP_HI_Y = 690;const int IDC_TEMP_LO_Y = 693;const int IDC_TEMP_CURTEMP_Z = 685;const int IDC_TEMP_HI_Z = 691;const int IDC_TEMP_LO_Z = 694;const int IDC_TEMP_CURTEMP_P = 686;const int IDC_TEMP_HI_P = 692;const int IDC_TEMP_LO_P = 695;

With these WPF dialog boxes, it is not possible to access the control that visualizes the value. However, you can access the property that is bound to it. The supported property types are: boolean, integer, unsigned, and double. Because you can get only string, integer, and double values and you can only set integer and string values, the get / set values are converted according to the following rules:

Boolean property:a) Get boolean property value as integer value: The returned value is -1 for true or 0 for false.b) Get boolean property value as unsigned integer value: The returned value is (unsigned) -1 for true or 0 for false.c) Get boolean property value as double value: The returned value is -1 for true or 0 for false.d) Get boolean property value as string value: The returned value "true" or "false".e) Set boolean property value from integer value: The value != 0 is used to sets the property.f) Set boolean property value from unsigned integer value: The value != 0 is used to sets the property.g) Set boolean property value from double value: The value != 0 is used to sets the property.h) Set boolean property value from string value: First, it checks for the "true or "false" words. If found, the bool value is set accordingly; otherwise, it tries to convert the string value in a double value. If a double value is found, the value != 0 is used to set the property.

Integer property:a) Get integer property value as boolean value: The returned value is <property value != 0>.b) Get integer property value as unsigned integer value: The returned value is the property value cast to an unsigned integer.c) Get integer property value as double value: The returned value is the property value cast to a double.d) Get integer property value as string value: The returned value is the string representation of the integer value.e) Set integer property value from boolean value: The -1 (for true) and 0 (for false) values are used to set the property.f) Set integer property value from unsigned integer value: The unsigned value is casted to an int and used to set the property.g) Set integer property value from double value: The double value is casted to an int and used to sets the property.h) Set integer property value from string value: First, it tries to convert the string value in an int value to set the property. If the conversion fails, it tries to convert the string value into a double value, round it to an integer and set the property.

Unsigned integer property:a) Get unsigned integer property value as boolean value: The returned value is <property value != 0>.b) Get unsigned integer property value as integer value: The returned value is the property value cast to an integer.c) Get unsigned integer property value as double value: The returned value is the property value cast to a double.d) Get unsigned integer property value as string value: The returned value is the string representation of the unsigned integer value.e) Set unsigned integer property value from boolean value: The casted (unsigned) -1 (for true) and 0 (for false) values are used to set the property.f) Set unsigned integer property value from integer value: The integer value is cast to unsigned integer and is used to set the property.g) Set unsigned integer property value from double value: The double value is casted to unsigned integer and is used to set the property.h) Set unsigned integer property value from string value: First, it tries to convert the string value to an unsigned integer value to set the property.If the conversion fails, it tries to convert the string value to an integer value and set the property.If the conversion fails, it tries to convert the string value to a double value, round it to an integer, and set the property.

Double property:a) Get double property value as boolean value: The returned value is <property value != 0.0>.b) Get double property value as integer value: The returned value is the property value cast to an integer.c) Get double property value as unsigned integer value: The returned value is the property value cast to an unsigned integer.d) Get double property value as string value: The returned value is the string representation of the double value.e) Set double property value from boolean value: The -1.0 (for true) and 0.0 (for false) values are used to set the property.f) Set double property value from integer value: The integer value is cast to a double and is used to set the property.g) Set double property value from double value: The unsigned integer value is cast to a double double and is used to set the property.h) Set double property value from string value: This tries to convert the string value to a double value and set the property.

String property:a) Get string property value as boolean value: First, it checks the string property value for the "true or "false" words.If found, the boolean value is returned; otherwise, it tries to convert the string property value to a double value. The <double value != 0.0> boolean value is returned.b) Get string property value as integer value: First, it tries to convert the string property value to an integer and return that value. If the conversion fails, it tries to convert the string property value to a double value, and return the rounded value.c) Get string property value as unsigned integer value: First, it tries to convert the string property value into an unsigned integer value to return.If the conversion fails, it tries to convert the string property value to a double value, and return the rounded value cast to an unsigned integer.d) Get string property value as double value: First, it tries to convert the string property value to a double value. If the conversion fails, it returns 0.0.e) Set string property value from boolean value: The string representation of a boolean value is used to set the property.f) Set string property value from integer value: The string representation of an integer value is used to set the property.g) Set string property value from unsigned integer value: The string representation of an unsigned integer value is used to set the property.h) Set string property value from double value: The string representation of double value is used to set the property.

TempComp Members

The **TempComp** object gives access to the properties of the PC-DMIS Temperature Compensation command. For additional information about Temperature Compensation, see "Compensating for Temperature" in the "Setting Your Preferences" section of the PC-DMIS Help File .

In PC-DMIS, you can use four different WPF dialog boxes to control Temperature Compensation. The IDs you can access on each through automation are provided below: Com**pensation Setup di**alog box - Edit | Preferences | Temperature Compensation Setup const int IDC_TEMP_COMP_CELSIUS = 2122; const int IDC_TEMP_COMP_ON = 1774; const int IDC_TEMP_SENS_NUM_X = 2091; const int IDC_TEMP_COEFF_X = 2092; const int IDC_TEMP_SENS_NUM_Y = 2093; const int IDC_TEMP_COEFF_Y = 681; const int IDC_TEMP_SENS_NUM_Z = 2094; const int IDC_TEMP_COEFF_Z = 682; const int IDC_TEMP_SENS_NUM_P = 2095; const int IDC_TEMP_COEFF_P = 68**3; Thermal Expansion Ori**gin dialog box - Insert | Parameter Change | Thermal Expansion Origin const int IDC_TEMP_ORIGIN_X = 2100; const int IDC_TEMP_ORIGIN_Y = 696; const int IDC_TEMP_ORIGIN_Z = 697****; Temperature Compensation Com**ma**nd dialog box - Insert | Parameter Change | Temperature Compensation const int IDC_TEMP_COMP_CELSIUS = 2122; const int IDC_TEMP_AUTOMATIC = 2101; const int IDC_TEMP_COEFF_X = 2092; const int IDC_TEMP_HI_X = 2098; const int IDC_TEMP_LO_X = 2099; const int IDC_TEMP_COEFF_Y = 681; const int IDC_TEMP_HI_Y = 690; const int IDC_TEMP_LO_Y = 693; const int IDC_TEMP_COEFF_Z = 682; const int IDC_TEMP_HI_Z = 691; const int IDC_TEMP_LO_Z = 694; const int IDC_TEMP_COEFF_P = 683; const int IDC_TEMP_HI_P = 692; const int IDC_TEMP_LO_P = 695; const int IDC_TEMP_COEFF_LIST = 14395; Temperature Compensation Command dialog box (Execution) - Ensure that the TEMPCOMP command is set to the Manual method, then execute the routine. const int IDC_TEMP_COMP_CELSIUS = 2122; const int IDC_TEMP_COMP_ON = 1774; const int IDC_TEMP_CURTEMP_X = 2096; const int IDC_TEMP_HI_X = 2098; const int IDC_TEMP_LO_X = 2099; const int IDC_TEMP_CURTEMP_Y = 684; const int IDC_TEMP_HI_Y = 690; const int IDC_TEMP_LO_Y = 693; const int IDC_TEMP_CURTEMP_Z = 685; const int IDC_TEMP_HI_Z = 691; const int IDC_TEMP_LO_Z = 694; const int IDC_TEMP_CURTEMP_P = 686; const int IDC_TEMP_HI_P = 692; const int IDC_TEMP_LO_P = 695; With these WPF dialog boxes, it is not possible to access the control that visualizes the value. However, you can access the property that is bound to it. The supported property types are: boolean, integer, unsigned, and double. Because you can get only string, integer, and double values and you can only set integer and string values, the get / set values are converted according to the following rules: Boolean property: a) Get boolean property value as integer value: The returned value is -1 for true or 0 for false. b) Get boolean property value as unsigned integer value: The returned value is (unsigned) -1 for true or 0 for false. c) Get boolean property value as double value: The returned value is -1 for true or 0 for false. d) Get boolean property value as string value: The returned value "true" or "false". e) Set boolean property value from integer value: The value != 0 is used to sets the property. f) Set boolean property value from unsigned integer value: The value != 0 is used to sets the property. g) Set boolean property value from double value: The value != 0 is used to sets the property. h) Set boolean property value from string value: First, it checks for the "true or "false" words. If found, the bool value is set accordingly; otherwise, it tries to convert the string value in a double value. If a double value is found, the value != 0 is used to set the property. Integer property: a) Get integer property value as boolean value: The returned value is <property value != 0>. b) Get integer property value as unsigned integer value: The returned value is the property value cast to an unsigned integer. c) Get integer property value as double value: The returned value is the property value cast to a double. d) Get integer property value as string value: The returned value is the string representation of the integer value. e) Set integer property value from boolean value: The -1 (for true) and 0 (for false) values are used to set the property. f) Set integer property value from unsigned integer value: The unsigned value is casted to an int and used to set the property. g) Set integer property value from double value: The double value is casted to an int and used to sets the property. h) Set integer property value from string value: First, it tries to convert the string value in an int value to set the property. If the conversion fails, it tries to convert the string value into a double value, round it to an integer and set the property. Unsigned integer property: a) Get unsigned integer property value as boolean value: The returned value is <property value != 0>. b) Get unsigned integer property value as integer value: The returned value is the property value cast to an integer. c) Get unsigned integer property value as double value: The returned value is the property value cast to a double. d) Get unsigned integer property value as string value: The returned value is the string representation of the unsigned integer value. e) Set unsigned integer property value from boolean value: The casted (unsigned) -1 (for true) and 0 (for false) values are used to set the property. f) Set unsigned integer property value from integer value: The integer value is cast to unsigned integer and is used to set the property. g) Set unsigned integer property value from double value: The double value is casted to unsigned integer and is used to set the property. h) Set unsigned integer property value from string value: First, it tries to convert the string value to an unsigned integer value to set the property. If the conversion fails, it tries to convert the string value to an integer value and set the property. If the conversion fails, it tries to convert the string value to a double value, round it to an integer, and set the property. Double property: a) Get double property value as boolean value: The returned value is <property value != 0.0>. b) Get double property value as integer value: The returned value is the property value cast to an integer. c) Get double property value as unsigned integer value: The returned value is the property value cast to an unsigned integer. d) Get double property value as string value: The returned value is the string representation of the double value. e) Set double property value from boolean value: The -1.0 (for true) and 0.0 (for false) values are used to set the property. f) Set double property value from integer value: The integer value is cast to a double and is used to set the property. g) Set double property value from double value: The unsigned integer value is cast to a double double and is used to set the property. h) Set double property value from string value: This tries to convert the string value to a double value and set the property. String property: a) Get string property value as boolean value: First, it checks the string property value for the "true or "false" words. If found, the boolean value is returned; otherwise, it tries to convert the string property value to a double value. The <double value != 0.0> boolean value is returned. b) Get string property value as integer value: First, it tries to convert the string property value to an integer and return that value. If the conversion fails, it tries to convert the string property value to a double value, and return the rounded value. c) Get string property value as unsigned integer value: First, it tries to convert the string property value into an unsigned integer value to return. If the conversion fails, it tries to convert the string property value to a double value, and return the rounded value cast to an unsigned integer. d) Get string property value as double value: First, it tries to convert the string property value to a double value. If the conversion fails, it returns 0.0. e) Set string property value from boolean value: The string representation of a boolean value is used to set the property. f) Set string property value from integer value: The string representation of an integer value is used to set the property. g) Set string property value from unsigned integer value: The string representation of an unsigned integer value is used to set the property. h) Set string property value from double value: The string representation of double value is used to set the property.

| TempComp Object |

|  | With these WPF dialog boxes, it is not possible to access the control that visualizes the value. However, you can access the property that is bound to it. The supported property types are: boolean, integer, unsigned, and double. Because you can get only string, integer, and double values and you can only set integer and string values, the get / set values are converted according to the following rules:Boolean property:a) Get boolean property value as integer value: The returned value is -1 for true or 0 for false.b) Get boolean property value as unsigned integer value: The returned value is (unsigned) -1 for true or 0 for false.c) Get boolean property value as double value: The returned value is -1 for true or 0 for false.d) Get boolean property value as string value: The returned value "true" or "false".e) Set boolean property value from integer value: The value != 0 is used to sets the property.f) Set boolean property value from unsigned integer value: The value != 0 is used to sets the property.g) Set boolean property value from double value: The value != 0 is used to sets the property.h) Set boolean property value from string value: First, it checks for the "true or "false" words. If found, the bool value is set accordingly; otherwise, it tries to convert the string value in a double value. If a double value is found, the value != 0 is used to set the property.Integer property:a) Get integer property value as boolean value: The returned value is <property value != 0>.b) Get integer property value as unsigned integer value: The returned value is the property value cast to an unsigned integer.c) Get integer property value as double value: The returned value is the property value cast to a double.d) Get integer property value as string value: The returned value is the string representation of the integer value.e) Set integer property value from boolean value: The -1 (for true) and 0 (for false) values are used to set the property.f) Set integer property value from unsigned integer value: The unsigned value is casted to an int and used to set the property.g) Set integer property value from double value: The double value is casted to an int and used to sets the property.h) Set integer property value from string value: First, it tries to convert the string value in an int value to set the property. If the conversion fails, it tries to convert the string value into a double value, round it to an integer and set the property.Unsigned integer property:a) Get unsigned integer property value as boolean value: The returned value is <property value != 0>.b) Get unsigned integer property value as integer value: The returned value is the property value cast to an integer.c) Get unsigned integer property value as double value: The returned value is the property value cast to a double.d) Get unsigned integer property value as string value: The returned value is the string representation of the unsigned integer value.e) Set unsigned integer property value from boolean value: The casted (unsigned) -1 (for true) and 0 (for false) values are used to set the property.f) Set unsigned integer property value from integer value: The integer value is cast to unsigned integer and is used to set the property.g) Set unsigned integer property value from double value: The double value is casted to unsigned integer and is used to set the property.h) Set unsigned integer property value from string value: First, it tries to convert the string value to an unsigned integer value to set the property.If the conversion fails, it tries to convert the string value to an integer value and set the property.If the conversion fails, it tries to convert the string value to a double value, round it to an integer, and set the property.Double property:a) Get double property value as boolean value: The returned value is <property value != 0.0>.b) Get double property value as integer value: The returned value is the property value cast to an integer.c) Get double property value as unsigned integer value: The returned value is the property value cast to an unsigned integer.d) Get double property value as string value: The returned value is the string representation of the double value.e) Set double property value from boolean value: The -1.0 (for true) and 0.0 (for false) values are used to set the property.f) Set double property value from integer value: The integer value is cast to a double and is used to set the property.g) Set double property value from double value: The unsigned integer value is cast to a double double and is used to set the property.h) Set double property value from string value: This tries to convert the string value to a double value and set the property.String property:a) Get string property value as boolean value: First, it checks the string property value for the "true or "false" words.If found, the boolean value is returned; otherwise, it tries to convert the string property value to a double value. The <double value != 0.0> boolean value is returned.b) Get string property value as integer value: First, it tries to convert the string property value to an integer and return that value. If the conversion fails, it tries to convert the string property value to a double value, and return the rounded value.c) Get string property value as unsigned integer value: First, it tries to convert the string property value into an unsigned integer value to return.If the conversion fails, it tries to convert the string property value to a double value, and return the rounded value cast to an unsigned integer.d) Get string property value as double value: First, it tries to convert the string property value to a double value. If the conversion fails, it returns 0.0.e) Set string property value from boolean value: The string representation of a boolean value is used to set the property.f) Set string property value from integer value: The string representation of an integer value is used to set the property.g) Set string property value from unsigned integer value: The string representation of an unsigned integer value is used to set the property.h) Set string property value from double value: The string representation of double value is used to set the property. |

# TempComp Object Members

# Public Methods

# Public Properties

# See Also

**Doublev**alue representing the high temperature threshold.

**Doublev**alue representing the low temperature threshold.

**Doublev**alue indicating the material coefficient.

Double value representing the reference temperature.

**Stringv**alue representing the list ofsensors--bynumber--to be used for temperature compensation. The format of the list is a series of consecutive sensor numbers. The series are specified using the hyphen between the first number and the last number of the series. Each non-consecutive sensor or group of sensors is separated by the comma (or the typical separator for the given locale).

TempComp Object

GetOrigin Gets the reference origin SetOrigin Sets the reference origin

HighThreshold D******oub**le** v**alue representing the high temperature threshold. LowTheshold Double value representing the low temperature threshold. MaterialCoefficient Double value indicating the material coefficient. RefTemp Double value representing the reference temperature. Sensors S**tring v**alue representing the list of sensors--by number--to be used for temperature compensation. The format of the list is a series of consecutive sensor numbers. The series are specified using the hyphen between the first number and the last number of the series. Each non-consecutive sensor or group of sensors is separated by the comma (or the typical separator for the given locale).

| TempComp ObjectMembers |

| GetOrigin | Gets the reference origin |
| SetOrigin | Sets the reference origin |

| HighThreshold | Doublevalue representing the high temperature threshold. |
| LowTheshold | Doublevalue representing the low temperature threshold. |
| MaterialCoefficient | Doublevalue indicating the material coefficient. |
| RefTemp | Double value representing the reference temperature. |
| Sensors | Stringvalue representing the list ofsensors--bynumber--to be used for temperature compensation. The format of the list is a series of consecutive sensor numbers. The series are specified using the hyphen between the first number and the last number of the series. Each non-consecutive sensor or group of sensors is separated by the comma (or the typical separator for the given locale). |

### GetOrigin

Gets the reference origin

### HighThreshold

**Doublev**alue representing the high temperature threshold.

### LowTheshold

**Doublev**alue representing the low temperature threshold.

### MaterialCoefficient

**Doublev**alue indicating the material coefficient.

### RefTemp

Double value representing the reference temperature.

### Sensors

**Stringv**alue representing the list ofsensors--bynumber--to be used for temperature compensation. The format of the list is a series of consecutive sensor numbers. The series are specified using the hyphen between the first number and the last number of the series. Each non-consecutive sensor or group of sensors is separated by the comma (or the typical separator for the given locale).

### SetOrigin

Sets the reference origin


---

## ToolkitInternalCommands

# ToolkitInternalCommands Object

# Description

# Object Model

# See Also

ToolkitInternalCommands Members

Toolkit Internal Commands Collection Object

| ToolkitInternalCommands Object |

# ToolkitInternalCommands Object Members

# Public Methods

# Public Properties

# See Also

ToolkitInternalCommands Object

_Item Item Returns the command object specified by name or number from the toolkit internal commands collection

Application Read Only: Returns the Application Object Count Read Only: Returns the number of commands in the toolkit internal commands collection Parent Read Only: Returns the parent Toolkit Command Object

| ToolkitInternalCommands ObjectMembers |

| _Item | Item | Returns the command object specified by name or number from the toolkit internal commands collection |

| Application | Read Only:  Returns the Application Object |
| Count | Read Only:  Returns the number of commands in the toolkit internal commands collection |
| Parent | Read Only:  Returns the parent Toolkit Command Object |

### Application

ToolkitInternalCommands Object|ToolkitInternalCommands Members

### Count

ToolkitInternalCommands Object|ToolkitInternalCommands Members

### Item

ToolkitInternalCommands Object|ToolkitInternalCommands Members

### Parent

ToolkitInternalCommands Object|ToolkitInternalCommands Members

### _Item

ToolkitInternalCommands Object|ToolkitInternalCommands Members


---

## tutorhit

# tutorhit Object

# See Also

tutorhit Members

| tutorhit Object |

# tutorhit Object Members

# See Also

tutorhit Object

| tutorhit ObjectMembers |

