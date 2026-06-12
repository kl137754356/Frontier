# PC-DMIS Reference: Cad

## CadHandle

# CadHandle Object

# See Also

CadHandle Members

| CadHandle Object |

# CadHandle Object Members

# Public Properties

# See Also

CadHandle Object

CadSequence Read/Write Only: Access the CAD sequence of the CAD handle Collection Read/Write Only: Access the CAD collection of the CAD handle PartInstanceId Read/Write Only: Access the part instance ID of the CAD handle SubCadId Read/Write Only: Access the sub-CAD ID of the CAD handle

| CadHandle ObjectMembers |

| CadSequence | Read/Write Only:  Access the CAD sequence of the CAD handle |
| Collection | Read/Write Only:  Access the CAD collection of the CAD handle |
| PartInstanceId | Read/Write Only:  Access the part instance ID of the CAD handle |
| SubCadId | Read/Write Only:  Access the sub-CAD ID of the CAD handle |

### CadSequence

Read/Write Only: Access the CAD sequence of the CAD handle

### Collection

Read/Write Only: Access the CAD collection of the CAD handle

### PartInstanceId

Read/Write Only: Access the part instance ID of the CAD handle

### SubCadId

Read/Write Only: Access the sub-CAD ID of the CAD handle


---

## CadModel

# CadModel Object

# Description

# Object Model

# See Also

CadModel Members

The **CadModel** object allows you to work with the imported CAD model in PC-DMIS' Graphics Display window.

| CadModel Object |

# CadModel Object Members

# Public Methods

# Public Properties

# See Also

This method highlights the specified CAD element (or elements) on the CAD model in the Graphics Display window.

This method removes highlighting from the specified CAD element (or elements) on the CAD model in the Graphics Display window.

CadModel Object

CadCollectionSlice CADIntersectLine Intersect the CAD model with a line. For multiple intersection points, the point returned depends on the line intersection flags. Geometry that is on a hidden level or a hidden assembly component is not checked. CADIntersectPlane Intersect the CAD model with a plane. For multiple intersection points, the point closest to the input point is returned. For surfaces, only the boundaries are intersected. Geometry that is on a hidden level or a hidden assembly component is not checked. CADModelFile This method returns the full path to the file name of the CAD model that you imported into the measurement routine. CADModelFilename This method returns only the file name (not the full path) of the CAD model that you imported into the measurement routine. CADProjectPoint Project a point onto the CAD model. Geometry that is on a hidden level or a hidden assembly component is not checked. CADSlice GetEmptyCadHandle Return an empty CAD handle. HighlightElement This method highlights the specified CAD element (or elements) on the CAD model in the Graphics Display window. ScaleToFit Focus on the passed feature or dimension UnHighlightElement This method removes highlighting from the specified CAD element (or elements) on the CAD model in the Graphics Display window.

Parent Returns this objects parent object.

| CadModel ObjectMembers |

| CadCollectionSlice | CADIntersectLine | Intersect the CAD model with a line. For multiple intersection points, the point returned depends on the line intersection flags. Geometry that is on a hidden level or a hidden assembly component is not checked. |
| CADIntersectPlane | Intersect the CAD model with a plane. For multiple intersection points, the point closest to the input point is returned. For surfaces, only the boundaries are intersected. Geometry that is on a hidden level or a hidden assembly component is not checked. |
| CADModelFile | This method returns the full path to the file name of the CAD model that you imported into the measurement routine. |
| CADModelFilename | This method returns only the file name (not the full path) of the CAD model that you imported into the measurement routine. |
| CADProjectPoint | Project a point onto the CAD model. Geometry that is on a hidden level or a hidden assembly component is not checked. |
| CADSlice | GetEmptyCadHandle | Return an empty CAD handle. |
| HighlightElement | This method highlights the specified CAD element (or elements) on the CAD model in the Graphics Display window. |
| ScaleToFit | Focus on the passed feature or dimension |
| UnHighlightElement | This method removes highlighting from the specified CAD element (or elements) on the CAD model in the Graphics Display window. |

| Parent | Returns this objects parent object. |

### CADIntersectLine

Intersect the CAD model with a line. For multiple intersection points, the point returned depends on the line intersection flags. Geometry that is on a hidden level or a hidden assembly component is not checked.

### CADIntersectPlane

Intersect the CAD model with a plane. For multiple intersection points, the point closest to the input point is returned. For surfaces, only the boundaries are intersected. Geometry that is on a hidden level or a hidden assembly component is not checked.

### CADModelFile

This method returns the full path to the file name of the CAD model that you imported into the measurement routine.

### CADModelFilename

This method returns only the file name (not the full path) of the CAD model that you imported into the measurement routine.

### CADProjectPoint

Project a point onto the CAD model. Geometry that is on a hidden level or a hidden assembly component is not checked.

### CADSlice

Visual Basic Public Function CADSlice( _ ByVal Pl*aneAnchorX A*s Double, _ ByVal Plane*AnchorY As D*ouble, _ ByVal PlaneAnc*horZ As Doub*le, _ ByVal PlaneVector*I As Double,* _ ByVal PlaneVectorJ A*s Double, _ *ByVal PlaneVectorK As D*ouble, _ ByV*al Tolerance As Double *_ ) As Ca*dPolyLinesOnSurface

### CadCollectionSlice

Visual Basic Public Function CadCollectionSlice( _ ByVal CA*DType A*s ENUM_CAD_COLLECTIONS , _ ByVal Plan*eAnchorX As *Double, _ ByVal PlaneAn*chorY As Dou*ble, _ ByVal PlaneAncho*rZ As Double*, _ ByVal PlaneVectorI *As Double, _* ByVal PlaneVectorJ As *Double, _ By*Val PlaneVectorK As Dou*ble, _ ByVal* Tolerance As Double _ *) As CadP*olyLinesOnSurface

### GetEmptyCadHandle

Return an empty CAD handle.

### HighlightElement

Required case-sensitive String that indicates the CAD element to highlight.

### Parent

Returns this objects parent object.

### ScaleToFit

Focus on the passed feature or dimension

### UnHighlightElement

This method removes highlighting from the specified CAD element (or elements) on the CAD model in the Graphics Display window.


---

## CadPointOnSurface

# CadPointOnSurface Object

# Description

# Object Model

# See Also

CadPointOnSurface Members

CadPointOnSurface Object

| CadPointOnSurface Object |

# CadPointOnSurface Object Members

# Public Properties

# See Also

CadPointOnSurface Object

Application Read Only: Returns the Application Object I Read/Write: Returns/Sets the I value J Read/Write: Returns/Sets the J value K Read/Write: Returns/Sets the K value Parent Read Only: Returns CadPointsOnSurface collection object X Read/Write: Returns/Sets the X value Y Read/Write: Returns/Sets the Y value Z Read/Write: Returns/Sets the Z value

| CadPointOnSurface ObjectMembers |

| Application | Read Only:  Returns the Application Object |
| I | Read/Write:  Returns/Sets the I value |
| J | Read/Write:  Returns/Sets the J value |
| K | Read/Write:  Returns/Sets the K value |
| Parent | Read Only:  Returns CadPointsOnSurface collection object |
| X | Read/Write:  Returns/Sets the X value |
| Y | Read/Write:  Returns/Sets the Y value |
| Z | Read/Write:  Returns/Sets the Z value |

### Application

CadPointOnSurface Object|CadPointOnSurface Members

### I

CadPointOnSurface Object|CadPointOnSurface Members

### J

CadPointOnSurface Object|CadPointOnSurface Members

### K

CadPointOnSurface Object|CadPointOnSurface Members

### Parent

CadPointOnSurface Object|CadPointOnSurface Members

### X

CadPointOnSurface Object|CadPointOnSurface Members

### Y

CadPointOnSurface Object|CadPointOnSurface Members

### Z

CadPointOnSurface Object|CadPointOnSurface Members


---

## CadPointsOnSurface

# CadPointsOnSurface Object

# Description

# Object Model

# See Also

CadPointsOnSurface Members

Object for the collection of polylines on surface

| CadPointsOnSurface Object |

# CadPointsOnSurface Object Members

# Public Methods

# Public Properties

# See Also

CadPointsOnSurface Object

_Item Item Returns the nth CadPointOnSurface in the collection

Application Read Only: Returns the Application Object Count Read Only: Returns the number CadPointOnSurface in the CAdPointsOnSurface collection Parent Read Only: Returns CadPolyLineOnSurface Object

| CadPointsOnSurface ObjectMembers |

| _Item | Item | Returns the nth CadPointOnSurface in the collection |

| Application | Read Only:  Returns the Application Object |
| Count | Read Only:  Returns the number CadPointOnSurface in the CAdPointsOnSurface collection |
| Parent | Read Only:  Returns CadPolyLineOnSurface Object |

### Application

CadPointsOnSurface Object|CadPointsOnSurface Members

### Count

CadPointsOnSurface Object|CadPointsOnSurface Members

### Item

CadPointsOnSurface Object|CadPointsOnSurface Members

### Parent

CadPointsOnSurface Object|CadPointsOnSurface Members

### _Item

CadPointsOnSurface Object|CadPointsOnSurface Members


---

## CadPolyLineOnSurface

# CadPolyLineOnSurface Object

# Description

# Object Model

# See Also

CadPolyLineOnSurface Members

CadPolyLineOnSurface Object

| CadPolyLineOnSurface Object |

# CadPolyLineOnSurface Object Members

# Public Properties

# See Also

CadPolyLineOnSurface Object

Application Read Only: Returns the Application Object CadPoints Read Only: Returns the CadPointsOnSurface collection object Closed Read/Write: Returns/sets true if is a closed polyline Parent Read Only: Returns CadPolyLinesOnSurface collection object

| CadPolyLineOnSurface ObjectMembers |

| Application | Read Only:  Returns the Application Object |
| CadPoints | Read Only:  Returns the CadPointsOnSurface collection object |
| Closed | Read/Write: Returns/sets true if is a closed polyline |
| Parent | Read Only:  Returns CadPolyLinesOnSurface collection object |

### Application

CadPolyLineOnSurface Object|CadPolyLineOnSurface Members

### CadPoints

CadPolyLineOnSurface Object|CadPolyLineOnSurface Members

### Closed

CadPolyLineOnSurface Object|CadPolyLineOnSurface Members

### Parent

CadPolyLineOnSurface Object|CadPolyLineOnSurface Members


---

## CadPolyLinesOnSurface

# CadPolyLinesOnSurface Object

# Description

# Object Model

# See Also

CadPolyLinesOnSurface Members

Object for the collection of polylines on surface

| CadPolyLinesOnSurface Object |

# CadPolyLinesOnSurface Object Members

# Public Methods

# Public Properties

# See Also

CadPolyLinesOnSurface Object

_Item Item Returns the nth PolyLineOnSurface in the collection

Application Read Only: Returns the Application Object Count Read Only: Returns the number PolyLineOnSurface in the PolyLinesOnSurface collection Parent Read Only: Returns CadModel object

| CadPolyLinesOnSurface ObjectMembers |

| _Item | Item | Returns the nth PolyLineOnSurface in the collection |

| Application | Read Only:  Returns the Application Object |
| Count | Read Only:  Returns the number PolyLineOnSurface in the PolyLinesOnSurface collection |
| Parent | Read Only:  Returns CadModel object |

### Application

CadPolyLinesOnSurface Object|CadPolyLinesOnSurface Members

### Count

CadPolyLinesOnSurface Object|CadPolyLinesOnSurface Members

### Item

CadPolyLinesOnSurface Object|CadPolyLinesOnSurface Members

### Parent

CadPolyLinesOnSurface Object|CadPolyLinesOnSurface Members

### _Item

CadPolyLinesOnSurface Object|CadPolyLinesOnSurface Members

