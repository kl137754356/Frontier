# PC-DMIS Reference: Scanning

## BasicScan

# BasicScan Object

# Description

# Object Model

# Remarks

# See Also

The tables below describes the different combination of Objects that can be used to create and executea Basic Scan. The Methods will only work with the combination of different of Objects selected from this table (i.e. if you decide to set a method type of BSCANMETH_CIRCLE, then you have to use a Filter type of BSF_DISTANCE etc).

**Table 1**

Method

Filters

BSCANMETH_LINEAR

BSF_DISTANCE

BSF_BODYAXISDISTANCE

BSF_VARIABLEDISTANCE

BSCANMETH_EDGE

BSF_DISTANCE

BSF_VARIABLEDISTANCE

BSCANMETH_CIRCLE

BSF_DISTANCE

BSCANMETH_CYLINDER

BSF_DISTANCE

BSCANMETH_STRAIGHTLINE

BSF_DISTANCE

BSCANMETH_CENTER

BSF_DISTANCE

**Table 2**

Method

NominalMode

BSCANMETH_LINEAR

BSCANNMODE_FINDCADNOMINAL  BSCANNMODE_MASTERDATA

BSCANMETH_EDGE

BSCANNMODE_FINDCADNOMINAL  BSCANNMODE_MASTERDATA

BSCANMETH_CIRCLE

BSCANNMODE_FINDCADNOMINAL  BSCANNMODE_MASTERDATA

BSCANMETH_CYLINDER

BSCANNMODE_FINDCADNOMINAL  BSCANNMODE_MASTERDATA

BSCANMETH_STRAIGHTLINE

BSCANNMODE_FINDCADNOMINAL  BSCANNMODE_MASTERDATA

BSCANMETH_CENTER

BSCANNMODE_FINDCADNOMINAL  BSCANNMODE_MASTERDATA

**Table 3**

Method

OperationMode

BSCANMETH_LINEAR

BSCANOPMODE_REGULARLEARN  BSCANOPMODE_DEFINEPATHFROMHITS

BSCANOPMODE_NORMALEXECUTION

BSCANMETH_EDGE

BSCANOPMODE_REGULARLEARN

BSCANOPMODE_NORMALEXECUTION

BSCANMETH_CIRCLE

BSCANOPMODE_HIGHSPEEDFEATUREBASED

BSCANOPMODE_NORMALEXECUTION

BSCANMETH_CYLINDER

BSCANOPMODE_HIGHSPEEDFEATUREBASED

BSCANOPMODE_NORMALEXECUTION

BSCANMETH_STRAIGHTLINE

BSCANOPMODE_HIGHSPEEDFEATUREBASED

BSCANOPMODE_NORMALEXECUTION

BSCANMETH_CENTER

BSCANOPMODE_REGULARLEARN

BSCANOPMODE_NORMALEXECUTION

**Table 4**

Method

HitType

BSCANMETH_LINEAR

BSCANHIT_VECTOR

BSCANHIT_SURFACE

BSCANMETH_EDGE

BSCANHIT_EDGE

BSCANMETH_CIRCLE

BSCANHIT_VECTOR

BSCANMETH_CYLINDER

BSCANHIT_VECTOR

BSCANMETH_STRAIGHTLINE

BSCANHIT_VECTOR

BSCANMETH_CENTER

BSCANHIT_VECTOR

**Table 5**

Method

BoundaryCondition

BSCANMETH_LINEAR

BSBOUNDCOND_SPHENTRY  BSBOUNDCOND_PLANECROSS  BSBOUNDCOND_CYLINDER

BSBOUNDCOND_CONE

BSCANMETH_EDGE

BSBOUNDCOND_SPHENTRY  BSBOUNDCOND_PLANECROSS  BSBOUNDCOND_CYLINDER

BSBOUNDCOND_CONE

BSCANMETH_CIRCLE

None

BSCANMETH_CYLINDER

None

BSCANMETH_STRAIGHTLINE

None

BSCANMETH_CENTER

None

BasicScan Members|BasicScanCommand Property

**BasicScan** objects are created from more generic **Command** objects to pass information specific to the scan command back and forth. At present only DCC basic scans are user-accessible.

************The tables below describes the different combination of Objects that can be used to create and execute a Basic Scan. The Methods will only work with the combination of different of Objects selected from this table (i.e. if you decide to set a method type of BSCANMETH_CIRCLE, then you have to use a Filter type of BSF_DISTANCE etc). Ta**ble 1 M**ethod Filters BSCANMETH_LINEAR BSF_DISTANCE BSF_BODYAXISDISTANCE BSF_VARIABLEDISTANCE BSCANMETH_EDGE BSF_DISTANCE BSF_VARIABLEDISTANCE BSCANMETH_CIRCLE BSF_DISTANCE BSCANMETH_CYLINDER BSF_DISTANCE BSCANMETH_STRAIGHTLINE BSF_DISTANCE BSCANMETH_CENTER BSF_DISTANCE Table 2 Method NominalMode BS**CANMETH**_LINEAR BSCANNMODE_FINDCADNOMINAL BSCANNMODE_MASTERDATA BSCANMETH_EDGE BSCANNMODE_FINDCADNOMINAL BSCANNMODE_MASTERDATA BSCANMETH_CIRCLE BSCANNMODE_FINDCADNOMINAL BSCANNMODE_MASTERDATA BSCANMETH_CYLINDER BSCANNMODE_FINDCADNOMINAL BSCANNMODE_MASTERDATA BSCANMETH_STRAIGHTLINE BSCANNMODE_FINDCADNOMINAL BSCANNMODE_MASTERDATA BSCANMETH_CENTER BSCANNMODE_FINDCADNOMINAL BSCANNMODE_MASTERDATA Table 3 Method OperationMode BSCANMETH_LINEAR BSCANOPMODE_REG**ULARLEA**RN BSCANOPMODE_DEFINEPATHFROMHITS BSCANOPMODE_NORMALEXECUTION BSCANMETH_EDGE BSCANOPMODE_REGULARLEARN BSCANOPMODE_NORMALEXECUTION BSCANMETH_CIRCLE BSCANOPMODE_HIGHSPEEDFEATUREBASED BSCANOPMODE_NORMALEXECUTION BSCANMETH_CYLINDER BSCANOPMODE_HIGHSPEEDFEATUREBASED BSCANOPMODE_NORMALEXECUTION BSCANMETH_STRAIGHTLINE BSCANOPMODE_HIGHSPEEDFEATUREBASED BSCANOPMODE_NORMALEXECUTION BSCANMETH_CENTER BSCANOPMODE_REGULARLEARN BSCANOPMODE_NORMALEXECUTION Table 4 Method HitType BSCANMETH_LINEAR BSCANHIT_VECTOR BSCANHIT_SURFACE BSCANMETH_EDGE BSCANHIT**_EDGE B**SCANMETH_CIRCLE BSCANHIT_VECTOR BSCANMETH_CYLINDER BSCANHIT_VECTOR BSCANMETH_STRAIGHTLINE BSCANHIT_VECTOR BSCANMETH_CENTER BSCANHIT_VECTOR Table 5 Method BoundaryCondition BSCANMETH_LINEAR BSBOUNDCOND_SPHENTRY BSBOUNDCOND_PLANECROSS BSBOUNDCOND_CYLINDER BSBOUND**COND_CO**NE BSCANMETH_EDGE BSBOUNDCOND_SPHENTRY BSBOUNDCOND_PLANECROSS BSBOUNDCOND_CYLINDER BSBOUNDCOND_CONE BSCANMETH_CIRCLE None BSCANMETH_CYLINDER None BSCANMETH_STRAIGHTLINE None BSCANMETH_CENTER None

BasicScan Members | BasicScanCommand Property

| BasicScan Object |

| Method | Filters |
| BSCANMETH_LINEAR | BSF_DISTANCEBSF_BODYAXISDISTANCEBSF_VARIABLEDISTANCE |
| BSCANMETH_EDGE | BSF_DISTANCEBSF_VARIABLEDISTANCE |
| BSCANMETH_CIRCLE | BSF_DISTANCE |
| BSCANMETH_CYLINDER | BSF_DISTANCE |
| BSCANMETH_STRAIGHTLINE | BSF_DISTANCE |
| BSCANMETH_CENTER | BSF_DISTANCE |

| Method | NominalMode |
| BSCANMETH_LINEAR | BSCANNMODE_FINDCADNOMINAL  BSCANNMODE_MASTERDATA |
| BSCANMETH_EDGE | BSCANNMODE_FINDCADNOMINAL  BSCANNMODE_MASTERDATA |
| BSCANMETH_CIRCLE | BSCANNMODE_FINDCADNOMINAL  BSCANNMODE_MASTERDATA |
| BSCANMETH_CYLINDER | BSCANNMODE_FINDCADNOMINAL  BSCANNMODE_MASTERDATA |
| BSCANMETH_STRAIGHTLINE | BSCANNMODE_FINDCADNOMINAL  BSCANNMODE_MASTERDATA |
| BSCANMETH_CENTER | BSCANNMODE_FINDCADNOMINAL  BSCANNMODE_MASTERDATA |

| Method | OperationMode |
| BSCANMETH_LINEAR | BSCANOPMODE_REGULARLEARN  BSCANOPMODE_DEFINEPATHFROMHITSBSCANOPMODE_NORMALEXECUTION |
| BSCANMETH_EDGE | BSCANOPMODE_REGULARLEARNBSCANOPMODE_NORMALEXECUTION |
| BSCANMETH_CIRCLE | BSCANOPMODE_HIGHSPEEDFEATUREBASEDBSCANOPMODE_NORMALEXECUTION |
| BSCANMETH_CYLINDER | BSCANOPMODE_HIGHSPEEDFEATUREBASEDBSCANOPMODE_NORMALEXECUTION |
| BSCANMETH_STRAIGHTLINE | BSCANOPMODE_HIGHSPEEDFEATUREBASEDBSCANOPMODE_NORMALEXECUTION |
| BSCANMETH_CENTER | BSCANOPMODE_REGULARLEARNBSCANOPMODE_NORMALEXECUTION |

| Method | HitType |
| BSCANMETH_LINEAR | BSCANHIT_VECTORBSCANHIT_SURFACE |
| BSCANMETH_EDGE | BSCANHIT_EDGE |
| BSCANMETH_CIRCLE | BSCANHIT_VECTOR |
| BSCANMETH_CYLINDER | BSCANHIT_VECTOR |
| BSCANMETH_STRAIGHTLINE | BSCANHIT_VECTOR |
| BSCANMETH_CENTER | BSCANHIT_VECTOR |

| Method | BoundaryCondition |
| BSCANMETH_LINEAR | BSBOUNDCOND_SPHENTRY  BSBOUNDCOND_PLANECROSS  BSBOUNDCOND_CYLINDERBSBOUNDCOND_CONE |
| BSCANMETH_EDGE | BSBOUNDCOND_SPHENTRY  BSBOUNDCOND_PLANECROSS  BSBOUNDCOND_CYLINDERBSBOUNDCOND_CONE |
| BSCANMETH_CIRCLE | None |
| BSCANMETH_CYLINDER | None |
| BSCANMETH_STRAIGHTLINE | None |
| BSCANMETH_CENTER | None |

# BasicScan Object Members

# Public Methods

# Public Properties

# See Also

Determines whether auto clearance planes mode is on or off.

Represents the boundary condition type.

Represents the boundary condition axis vector. This vector is used as the axis of the Cylindrical and Conical BoundaryConditions.

Represents the boundary condition center. This Point is used by all Boundary Conditions and is the location of the Boundary Condition.

Represents the boundary condition end approach vector. This vector is used by all Boundary Conditions and is the Approach Vector of the Probe as it crosses the Boundary condition.

Represents the boundary condition plane vector. This vector is the normal vector of the Plane used by the Plane and OldStyle Boundary Conditions.

Determines whether hits of the scan are displayed in the Edit window or not.

Represents the method’s cut plane vector.

Represents the scan’s end point.

Represents the method’s end touch vector.

Represents the method’s initial direction vector.

Represents the initial Surface Vector for the Edge method.

Represents the method’s initial touch vector.

Determines whether single point mode is on or off.

BasicScan Object|BasicScanCommand Property

AddControlPoint Adds a control point to a scan. CreateBasicScan This method creates a basic scan object. GenerateScan Generates the points for the scan GetBoundaryConditionParams Gets the boundary condition parameters GetBoundaryPoint Returns the boundary point specified by the index GetControlPoint Returns the control point specified by the index. GetFilterParams Gets parameters used in filtering of scan data GetHitParams Gets parameters for the hit type used in the scan GetHitTValue Returns T deviation values for specified scansion hit GetMethodParams Gets the scan method parameters GetMethodPointData This method is provided as a shortcut to getting these commonly used scan parameters all at once. GetNomsParams Gets the parameters used in finding of scan nominals GetParams This method is provided as a shortcut to getting commonly used scan parameters all at once. RemoveControlPoint Removes a control point. SetBoundaryConditionParams B**oolean v**alue. Boolean returns true if the function succeeds, false if it fails. SetBoundaryPoint Sets a boundary point. SetControlPoint Sets a control point at the specified index. SetFilterParams This method is provided as a shortcut to set these commonly used scan parameters all at once. SetHitParams This method is provided as a shortcut to set these commonly used scan parameters all at once. SetMethodParams This method is provided as a shortcut to set these commonly used scan parameters all at once. SetMethodPointData This method is provided as a shortcut to set these commonly used scan parameters all at once. SetNomsParams This method is provided as a shortcut to set these commonly used scan parameters all at once. SetParams This method is provided as a shortcut to set these commonly used scan parameters all at once.

AutoClearPlane Determines whether auto clearance planes mode is on or off. BoundaryCondition Represents the boundary condition type. BoundaryConditionAxisV Represents the boundary condition axis vector. This vector is used as the axis of the Cylindrical and Conical BoundaryConditions. BoundaryConditionCenter Represents the boundary condition center. This Point is used by all Boundary Conditions and is the location of the Boundary Condition. BoundaryConditionEndApproach Represents the boundary condition end approach vector. This vector is used by all Boundary Conditions and is the Approach Vector of the Probe as it crosses the Boundary condition. BoundaryConditionPlaneV Represents the boundary condition plane vector. This vector is the normal vector of the Plane used by the Plane and OldStyle Boundary Conditions. BoundaryPointCount Indicates the number of boundary points to used in a patch scan. DisplayHits Determines whether hits of the scan are displayed in the Edit window or not. Filter Represents the filter type. HitType Represents the type of hit to use. Method Represents the method type for this scan. MethodCutPlane Represents the method’s cut plane vector. MethodEnd Represents the scan’s end point. MethodEndTouch Represents the method’s end touch vector. MethodInitDir Represents the method’s initial direction vector. MethodInitTopSurf Represents the initial Surface Vector for the Edge method. MethodInitTouch Represents the method’s initial touch vector. MethodStart Represents the scan’s start point. NominalMode Represents how to determine the nominal values for this scan. OperationMode Represents mode of operation of the scan. SinglePoint Determines whether single point mode is on or off.

BasicScan Object | BasicScanCommand Property

| BasicScan ObjectMembers |

| AddControlPoint | Adds a control point to a scan. |
| CreateBasicScan | This method creates a basic scan object. |
| GenerateScan | Generates the points for the scan |
| GetBoundaryConditionParams | Gets the boundary condition parameters |
| GetBoundaryPoint | Returns the boundary point specified by the index |
| GetControlPoint | Returns the control point specified by the index. |
| GetFilterParams | Gets parameters used in filtering of scan data |
| GetHitParams | Gets parameters for the hit type used in the scan |
| GetHitTValue | Returns T deviation values for specified scansion hit |
| GetMethodParams | Gets the scan method parameters |
| GetMethodPointData | This method is provided as a shortcut to getting these commonly used scan parameters all at once. |
| GetNomsParams | Gets the parameters used in finding of scan nominals |
| GetParams | This method is provided as a shortcut to getting commonly used scan parameters all at once. |
| RemoveControlPoint | Removes a control point. |
| SetBoundaryConditionParams | Booleanvalue. Boolean returns true if the function succeeds, false if it fails. |
| SetBoundaryPoint | Sets a boundary point. |
| SetControlPoint | Sets a control point at the specified index. |
| SetFilterParams | This method is provided as a shortcut to set these commonly used scan parameters all at once. |
| SetHitParams | This method is provided as a shortcut to set these commonly used scan parameters all at once. |
| SetMethodParams | This method is provided as a shortcut to set these commonly used scan parameters all at once. |
| SetMethodPointData | This method is provided as a shortcut to set these commonly used scan parameters all at once. |
| SetNomsParams | This method is provided as a shortcut to set these commonly used scan parameters all at once. |
| SetParams | This method is provided as a shortcut to set these commonly used scan parameters all at once. |

| AutoClearPlane | Determines whether auto clearance planes mode is on or off. |
| BoundaryCondition | Represents the boundary condition type. |
| BoundaryConditionAxisV | Represents the boundary condition axis vector. This vector is used as the axis of the Cylindrical and Conical BoundaryConditions. |
| BoundaryConditionCenter | Represents the boundary condition center. This Point is used by all Boundary Conditions and is the location of the Boundary Condition. |
| BoundaryConditionEndApproach | Represents the boundary condition end approach vector. This vector is used by all Boundary Conditions and is the Approach Vector of the Probe as it crosses the Boundary condition. |
| BoundaryConditionPlaneV | Represents the boundary condition plane vector. This vector is the normal vector of the Plane used by the Plane and OldStyle Boundary Conditions. |
| BoundaryPointCount | Indicates the number of boundary points to used in a patch scan. |
| DisplayHits | Determines whether hits of the scan are displayed in the Edit window or not. |
| Filter | Represents the filter type. |
| HitType | Represents the type of hit to use. |
| Method | Represents the method type for this scan. |
| MethodCutPlane | Represents the method’s cut plane vector. |
| MethodEnd | Represents the scan’s end point. |
| MethodEndTouch | Represents the method’s end touch vector. |
| MethodInitDir | Represents the method’s initial direction vector. |
| MethodInitTopSurf | Represents the initial Surface Vector for the Edge method. |
| MethodInitTouch | Represents the method’s initial touch vector. |
| MethodStart | Represents the scan’s start point. |
| NominalMode | Represents how to determine the nominal values for this scan. |
| OperationMode | Represents mode of operation of the scan. |
| SinglePoint | Determines whether single point mode is on or off. |

### AddControlPoint

Adds a control point to a scan.

### AutoClearPlane

Determines whether auto clearance planes mode is on or off.

### BoundaryCondition

Represents the boundary condition type.

### BoundaryConditionAxisV

Represents the boundary condition axis vector. This vector is used as the axis of the Cylindrical and Conical BoundaryConditions.

### BoundaryConditionCenter

Represents the boundary condition center. This Point is used by all Boundary Conditions and is the location of the Boundary Condition.

### BoundaryConditionEndApproach

Represents the boundary condition end approach vector. This vector is used by all Boundary Conditions and is the Approach Vector of the Probe as it crosses the Boundary condition.

### BoundaryConditionPlaneV

Represents the boundary condition plane vector. This vector is the normal vector of the Plane used by the Plane and OldStyle Boundary Conditions.

### BoundaryPointCount

Individual boundary points can be set or retrieved via the "BasicScan.GetBoundaryPoint" and "BasicScan.SetBoundaryPoint" methods.

### CreateBasicScan

This method creates a basic scan object.

### DisplayHits

Determines whether hits of the scan are displayed in the Edit window or not.

### Filter

The allowable values are:

### GenerateScan

Generates the points for the scan

### GetBoundaryConditionParams

Boundary Condition

### GetBoundaryPoint

This function works with patch scans. Use theBoundaryPointCountproperty to determine how many boundary points are available.

### GetControlPoint

Returns the control point specified by the index.

### GetFilterParams

GetFilterParams (*dCutAxisLocation*,n*Axis,*dM*axIncrement,d*Mi*nIncrement,dM*ax*Angle,dMi*nA*ngle)*

### GetHitParams

Gets parameters for the hit type used in the scan

### GetHitTValue

Returns T deviation values for specified scansion hit

### GetMethodParams

GetMethodParams (*bIn*,b*CenteringType,*nC*enteringDirection,d*Di*ameter,dA*rc*Angle,dDe*pt*h,dPit*ch*)*

### GetMethodPointData

If scan is aB**asicScanCommando**bject, and MS, ME, MIT, MET, MID, and MCP are allDim**ens**ioned asObje**ct, th**e following are equivalent:

### GetNomsParams

Gets the parameters used in finding of scan nominals

### GetParams

If scan is aB**asicScanCommando**bject, and M, F, O, H, N,and B are allDim**ens**ioned asObje**ct, th**e following are equivalent:

### HitType

The allowable values are:

### Method

The Method type defines the geometry of the feature to be scanned and has parameters that need to be set properly before scanning. The parameters can be set using the SetMethodParams method.

### MethodCutPlane

Represents the method’s cut plane vector.

### MethodEnd

Represents the scan’s end point.

### MethodEndTouch

Represents the method’s end touch vector.

### MethodInitDir

Represents the method’s initial direction vector.

### MethodInitTopSurf

Represents the initial Surface Vector for the Edge method.

### MethodInitTouch

Represents the method’s initial touch vector.

### MethodStart

Not following table shows the supported scan methods:

### NominalMode

The allowable values are:

### OperationMode

The allowable values are:

### RemoveControlPoint

Removes a control point.

### SetBoundaryConditionParams

Boundary Condition

### SetBoundaryPoint

This function works with patch scans. Use theBoundaryPointCountproperty to set the number of boundary points.

### SetControlPoint

Sets a control point at the specified index.

### SetFilterParams

SetFilterParams (*dCutAxisLocation*,n*Axis,*dM*axIncrement,d*Mi*nIncrement,dM*ax*Angle,dMi*nA*ngle)*

### SetHitParams

This method is provided as a shortcut to set these commonly used scan parameters all at once.

### SetMethodParams

SetMethodParams (*bIn*,b*CenteringType,*nC*enteringDirection,d*Di*ameter,dA*rc*Angle,dDe*pt*h,dPit*ch*)*

### SetMethodPointData

If scan is aB**asicScanCommando**bject, and MS, ME, MIT, MET, MID,and MCP are allDim**ens**ioned asObje**ct, th**e following are equivalent:

### SetNomsParams

If scan is aB**asicScanCommando**bject, and M, F, O, H, N,and B are allDim**ens**ioned asObje**ct, th**e following are equivalent:

### SetParams

If scan is aB**asicScanCommando**bject, and M, F, O, H, N,and B are allDim**ens**ioned asObje**ct, th**e following are equivalent:

### SinglePoint

Determines whether single point mode is on or off.


---

## ControlPoint

# ControlPoint Object

# Description

# Remarks

# See Also

The ControlPoint object is used with only the following scans:

Additionally, the ControlPoint object only works on machines that use an analog probe that allows continuous contact scanning.

In the PC-DMIS documentation, the Control Points are called Interrupt Points. See "Interrupts" in the "Scanning Your Part"sectionof your PC-DMIS documentation.

ControlPoint Members

With the **ControlPoint** object you can insert control point locations. These locations interrupt the normal scan and alter scan speed, point density or both for defined portions of the scan.

The ControlPoint object is used with only the following scans: LinearOpen LinearClose Patch Section Line (Basic Scan) Additionally, the ControlPoint object only works on machines that use an analog probe that allows continuous contact scanning. In the PC-DMIS documentation, the Control Points are called Interrupt Points. See "Interrupts" in the "Scanning Your Part" section of your PC-DMIS documentation.

| ControlPoint Object |

- LinearOpen
- LinearClose
- Patch
- Section
- Line (Basic Scan)

# ControlPoint Object Members

# Public Properties

# See Also

This defines the number of time the scan crosses the specified boundary before the alterations defined by the crossing point take effect.

This specifies the I component of the interrupt location's IJK vector.

This specifies the J component of the interrupt location's IJK vector.

This specifies the K component of the interrupt location IJK vector.

This defines the density of points per millimeter the scan shoud take after it encounters the control point.

This defines the Radius of circular control point types (Cones, Spheres, Cylinders).

This specifies the X value of the interrupt XYZ location.

This specifies the Y component of the interrupt XYZ location.

This specifies the Z component of the interrupt XYZ location.

ControlPoint Object

Crossings This defines the number of time the scan crosses the specified boundary before the alterations defined by the crossing point take effect. I This specifies the I component of the interrupt location's IJK vector. J This specifies the J component of the interrupt location's IJK vector. K This specifies the K component of the interrupt location IJK vector. PointDensity This defines the density of points per millimeter the scan shoud take after it encounters the control point. PointDensity2 Read/Write: Number of Points per MM for control point. Can be less than 1 Radius This defines the Radius of circular control point types (Cones, Spheres, Cylinders). Speed Read/Write: Scan Speed Setting for control point Type This specifies the type of control point. X This specifies the X value of the interrupt XYZ location. Y This specifies the Y component of the interrupt XYZ location. Z This specifies the Z component of the interrupt XYZ location.

| ControlPoint ObjectMembers |

| Crossings | This defines the number of time the scan crosses the specified boundary before the alterations defined by the crossing point take effect. |
| I | This specifies the I component of the interrupt location's IJK vector. |
| J | This specifies the J component of the interrupt location's IJK vector. |
| K | This specifies the K component of the interrupt location IJK vector. |
| PointDensity | This defines the density of points per millimeter the scan shoud take after it encounters the control point. |
| PointDensity2 | Read/Write: Number of Points per MM for control point. Can be less than 1 |
| Radius | This defines the Radius of circular control point types (Cones, Spheres, Cylinders). |
| Speed | Read/Write: Scan Speed Setting for control point |
| Type | This specifies the type of control point. |
| X | This specifies the X value of the interrupt XYZ location. |
| Y | This specifies the Y component of the interrupt XYZ location. |
| Z | This specifies the Z component of the interrupt XYZ location. |

### Crossings

This defines the number of time the scan crosses the specified boundary before the alterations defined by the crossing point take effect.

### I

This specifies the I component of the interrupt location's IJK vector.

### J

This specifies the J component of the interrupt location's IJK vector.

### K

This specifies the K component of the interrupt location IJK vector.

### PointDensity

This defines the density of points per millimeter the scan shoud take after it encounters the control point.

### PointDensity2

Read/Write: Number of Points per MM for control point. Can be less than 1

### Radius

This defines the Radius of circular control point types (Cones, Spheres, Cylinders).

### Speed

Read/Write: Scan Speed Setting for control point

### Type

There are four types of control points:

### X

This specifies the X value of the interrupt XYZ location.

### Y

This specifies the Y component of the interrupt XYZ location.

### Z

This specifies the Z component of the interrupt XYZ location.


---

## Scan

# Scan Object

# Description

# Object Model

# See Also

Scan Members

**Scan** objects are created from more generic **Command** objects to pass information specific to the scan command back and forth. At present only DCC and Manual scans are user accessible.

| Scan Object |

# Scan Object Members

# Public Methods

# Public Properties

# See Also

This method has to be called after calling other Properties/Methods. This method creates the necessary BasicScans needed by DCC and Manual scans and inserts them into the measurement routine.

This method is provided as a shortcut to getting these commonly used properties all at once.

This method is provided as a shortcut to setting these commonly used properties all at once.

This property represents the boundary condition end approach vector.

Represents the type of hit to use.

This property represents the method’s cut plane vector.

This property represents the scan’s end point.

This property represents the method’s end touch vector.

This property represents the method’s initial direction vector.

This property represents the initial Surface Vector for the Edge method.

This represents the method’s initial touch vector.

Scan Object

AddControlPoint Adds a control point to the scan CreateBasicScan This method has to be called after calling other Properties/Methods. This method creates the necessary BasicScans needed by DCC and Manual scans and inserts them into the measurement routine. GenerateScan Generates the points for the scan GetBoundaryConditionParams Gets the boundary condition parameters GetBoundaryPoint Returns the boundary point specified by the index GetControlPoint Returns the control point specified by the index GetFilterParams Gets parameters used in filtering of scan data GetHitParams Gets parameters for the hit type used in the scan GetHitTValue Returns T deviation values for specified scansion hit GetMethodParams Gets the scan method parameters GetMethodPointData This method is provided as a shortcut to getting these commonly used properties all at once. GetNomsParams Gets the parameters used in finding of scan nominals GetParams This method is provided as a shortcut to getting these commonly used properties all at once. RemoveControlPoint Removes the control point at the specified index SetBoundaryConditionParams Sets the boundary condition parameters SetBoundaryPoint Sets the boundary point specified by the index paramter SetControlPoint Sets the control point at the specified index SetFilterParams Sets parameters for filtering scan data SetHitParams Sets parameters for the hit type used in the scan SetMethodParams Sets the scan method parameters SetMethodPointData This method is provided as a shortcut to setting these commonly used properties all at once. SetNomsParams Boolean value. Boolean returns true if the function succeeds, false if it fails. SetParams This method is provided as a shortcut to setting these commonly used properties all at once.

AutoClearPlane Read/Write: **B**oolean value indicating if auto clear planes should be used BoundaryCondition Represents the boundary condition type. BoundaryConditionAxisV This property represents the boundary condition axis vector. This vector is used as the axis of the Cylindrical and Conical BoundaryConditions. BoundaryConditionCenter This property represents the boundary condition center. BoundaryConditionEndApproach This property represents the boundary condition end approach vector. BoundaryConditionPlaneV This property represents the boundary condition plane vector. This vector is the normal vector of the plane used by the Plane and OldStyle Boundary Conditions. BoundaryPointCount Read/Write: Long value indicating the number of boundary points for patch scans DisplayHits Read/Write: Boolean value indicating whether hits should be displayed or not Filter This property represents the filter type. Read/write of enumeration BSF_ENUM. HitType Represents the type of hit to use. Method This property represents the method type for this scan. MethodCutPlane This property represents the method’s cut plane vector. MethodEnd This property represents the scan’s end point. MethodEndTouch This property represents the method’s end touch vector. MethodInitDir This property represents the method’s initial direction vector. MethodInitTopSurf This property represents the initial Surface Vector for the Edge method. MethodInitTouch This represents the method’s initial touch vector. MethodStart This property represents the scan’s start point. NominalMode This property represents how to determine the nominals for this scan. OperationMode This property represents mode of operation of the scan. SinglePoint Read/Write: Returns/Sets Single Point Mode Flag

| Scan ObjectMembers |

| AddControlPoint | Adds a control point to the scan |
| CreateBasicScan | This method has to be called after calling other Properties/Methods. This method creates the necessary BasicScans needed by DCC and Manual scans and inserts them into the measurement routine. |
| GenerateScan | Generates the points for the scan |
| GetBoundaryConditionParams | Gets the boundary condition parameters |
| GetBoundaryPoint | Returns the boundary point specified by the index |
| GetControlPoint | Returns the control point specified by the index |
| GetFilterParams | Gets parameters used in filtering of scan data |
| GetHitParams | Gets parameters for the hit type used in the scan |
| GetHitTValue | Returns T deviation values for specified scansion hit |
| GetMethodParams | Gets the scan method parameters |
| GetMethodPointData | This method is provided as a shortcut to getting these commonly used properties all at once. |
| GetNomsParams | Gets the parameters used in finding of scan nominals |
| GetParams | This method is provided as a shortcut to getting these commonly used properties all at once. |
| RemoveControlPoint | Removes the control point at the specified index |
| SetBoundaryConditionParams | Sets the boundary condition parameters |
| SetBoundaryPoint | Sets the boundary point specified by the index paramter |
| SetControlPoint | Sets the control point at the specified index |
| SetFilterParams | Sets parameters for filtering scan data |
| SetHitParams | Sets parameters for the hit type used in the scan |
| SetMethodParams | Sets the scan method parameters |
| SetMethodPointData | This method is provided as a shortcut to setting these commonly used properties all at once. |
| SetNomsParams | Boolean value. Boolean returns true if the function succeeds, false if it fails. |
| SetParams | This method is provided as a shortcut to setting these commonly used properties all at once. |

| AutoClearPlane | Read/Write:  Boolean value indicating if auto clear planes should be used |
| BoundaryCondition | Represents the boundary condition type. |
| BoundaryConditionAxisV | This property represents the boundary condition axis vector. This vector is used as the axis of the Cylindrical and Conical BoundaryConditions. |
| BoundaryConditionCenter | This property represents the boundary condition center. |
| BoundaryConditionEndApproach | This property represents the boundary condition end approach vector. |
| BoundaryConditionPlaneV | This property represents the boundary condition plane vector. This vector is the normal vector of the plane used by the Plane and OldStyle Boundary Conditions. |
| BoundaryPointCount | Read/Write:  Long value indicating the number of boundary points for patch scans |
| DisplayHits | Read/Write:  Boolean value indicating whether hits should be displayed or not |
| Filter | This property represents the filter type. Read/writeof enumeration BSF_ENUM. |
| HitType | Represents the type of hit to use. |
| Method | This property represents the method type for this scan. |
| MethodCutPlane | This property represents the method’s cut plane vector. |
| MethodEnd | This property represents the scan’s end point. |
| MethodEndTouch | This property represents the method’s end touch vector. |
| MethodInitDir | This property represents the method’s initial direction vector. |
| MethodInitTopSurf | This property represents the initial Surface Vector for the Edge method. |
| MethodInitTouch | This represents the method’s initial touch vector. |
| MethodStart | This property represents the scan’s start point. |
| NominalMode | This property represents how to determine the nominals for this scan. |
| OperationMode | This property represents mode of operation of the scan. |
| SinglePoint | Read/Write:  Returns/Sets Single Point Mode Flag |

### AddControlPoint

Adds a control point to the scan

### AutoClearPlane

Read/Write: Boolean value indicating if auto clear planes should be used

### BoundaryCondition

Represents the boundary condition type.

### BoundaryConditionAxisV

This property represents the boundary condition axis vector. This vector is used as the axis of the Cylindrical and Conical BoundaryConditions.

### BoundaryConditionCenter

This point is used by all Boundary Conditions and is the location of the Boundary Condition.

### BoundaryConditionEndApproach

This property represents the boundary condition end approach vector.

### BoundaryConditionPlaneV

Boundary Condition

### BoundaryPointCount

Read/Write: Long value indicating the number of boundary points for patch scans

### CreateBasicScan

This method has to be called after calling other Properties/Methods. This method creates the necessary BasicScans needed by DCC and Manual scans and inserts them into the measurement routine.

### DisplayHits

Read/Write: Boolean value indicating whether hits should be displayed or not

### Filter

This** **property represents the filter type. Read/write of enumeration BSF_ENUM.

### GenerateScan

Generates the points for the scan

### GetBoundaryConditionParams

Gets the boundary condition parameters

### GetBoundaryPoint

Returns the boundary point specified by the index

### GetControlPoint

Returns the control point specified by the index

### GetFilterParams

GetFilterParams (*dCutAxisLocation*,n*Axis,*dM*axIncrement,d*Mi*nIncrement,dM*ax*Angle,dMi*nA*ngle)*

### GetHitParams

Gets parameters for the hit type used in the scan

### GetHitTValue

Returns T deviation values for specified scansion hit

### GetMethodParams

Gets the scan method parameters

### GetMethodPointData

This method is provided as a shortcut to getting these commonly used properties all at once.

### GetNomsParams

Gets the parameters used in finding of scan nominals

### GetParams

If scan is aS**cano**bject, and M, F, O, H, N,and B are all dimensioned asObj**ect, t**he following are equivalent:

### HitType

Represents the type of hit to use.

### Method

This property represents the method type for this scan.

### MethodCutPlane

This property represents the method’s cut plane vector.

### MethodEnd

This property represents the scan’s end point.

### MethodEndTouch

This property represents the method’s end touch vector.

### MethodInitDir

This property represents the method’s initial direction vector.

### MethodInitTopSurf

This property represents the initial Surface Vector for the Edge method.

### MethodInitTouch

This represents the method’s initial touch vector.

### MethodStart

This property represents the scan’s start point.

### NominalMode

This property represents how to determine the nominals for this scan.

### OperationMode

This property represents mode of operation of the scan.

### RemoveControlPoint

Removes the control point at the specified index

### SetBoundaryConditionParams

Boundary Condition

### SetBoundaryPoint

Sets the boundary point specified by the index paramter

### SetControlPoint

Sets the control point at the specified index

### SetFilterParams

SetFilterParams (*dCutAxisLocation*,n*Axis,*dM*axIncrement,d*Mi*nIncrement,dM*ax*Angle,dMi*nA*ngle)*

### SetHitParams

Sets parameters for the hit type used in the scan

### SetMethodParams

Sets the scan method parameters

### SetMethodPointData

This method is provided as a shortcut to setting these commonly used properties all at once.

### SetNomsParams

If scan is aS**canCommando**bject, and MS, ME, MIT, MET, MID, and MCP are all dimensioned asObj**ect, t**he following are equivalent:

### SetParams

This method is provided as a shortcut to setting these commonly used properties all at once.

### SinglePoint

Read/Write: Returns/Sets Single Point Mode Flag

