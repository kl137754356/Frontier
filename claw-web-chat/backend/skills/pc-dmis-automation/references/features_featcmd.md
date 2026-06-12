# PC-DMIS Reference: Features Featcmd

## FeatCmd

# FeatCmd Object

# Description

# Object Model

# See Also

FeatCmd Members

**FeatCmd** are created from more generic **Command** objects to pass information specific to the feature command back and forth.

| FeatCmd Object |

# FeatCmd Object Members

# Public Methods

# Public Properties

# See Also

Forces an evaluation of a feature without executing it. This takes one parameter that specifies the type of feature evaluation to perform.

[Desc already exists]

This method works just like the SetHit method; it sets the hit data of a specified hit, but it uses a specified coordinate system and alignment.

This queries an Auto Feature to determine if the feature has any sample hits that have been moved by the user in the Graphics Display window.

FeatCmd Object

AddInputFeat Adds a feature to set of input features used in constructed features. AddInputFeatures Appends an array of I*Ds* to the list of Input Features CalculateNominals This method recalculates feature nominals for a measured feature. CountHits Recounts the hits for a measured feature. Evaluate Forces an evaluation of a feature without executing it. This takes one parameter that specifies the type of feature evaluation to perform. GenerateHits [Desc already exists] GetCircMoveItem Returns Point Data Object with interpolated circular move item data GetData [Desc already exists] GetFormError Returns Y14.5.1 Form error if applicable, else 0.0 GetHit Returns a Po****intData** o**bject with the values of the sample hit. GetHitTValue Returns T deviation values for specified hit GetInputID Gets ID of Input Feature GetInputOffset Gets Offset value for corresponding offset feature in constructed offset features GetPoint This method retrieves point information for individual objects. GetPoints Returns all Point Data Objects with hit data GetSampleHit Returns a PointData object with the values of the sample hit. GetSurfaceVectors This method gets the surface vectors of an angle hit function. GetVector This method retrieves vector components of individual objects. PutData This function returns TRUE if the data was successfully retrieved from ex*pression ,* FALSE otherwise. PutPoint Sets point information for individual objects. PutSurfaceVectors Sets the surface vectors for an angle hit object. PutVector Sets vector components of individual objects. RemoveInputFeat Removes the feature at the specified index position. SetHit Sets the hit data of a specified hit. It uses the part coordinate system relative to the current alignment. SetHit2 This method works just like the SetHit method; it sets the hit data of a specified hit, but it uses a specified coordinate system and alignment. SetInputFeat Replaces the input feature at position In*dex i*n Fe**atCmd o**bject's list of input features with ID . SetInputOffset Sets Offset value for coresponding offset feature in constructed offset features

AlignWorkPlane Workplane value for constructed alignment planes and lines. AutoCircularMove Flag indicating whether circular moves should be used between hits. AutoClearPlane Flag indicating whether clearance planes should automatically be used with the feature. AutoMove Auto Move Flag. AutoMoveDistance Distance used in calculating auto move. AutoPH9 Flag indicating if selected tip should be automatically adjusted during measurement of feature. AutoReadPos Auto Read Position Flag. BestFitMathType Value representing the best fit math algorithm to be used in calculating the measured feature values based on the measured hits. Possible values include the following. Bound Flag indicating whether or not feature is bound. BoxLength Box length value for auto high point. BoxWidth Box width value for auto high point. CircularRadiusIn Inside circular radius value for auto high point. CircularRadiusOut Outside circular radius value for auto high point. CornerRadius Corner radius value for auto square slot and auto notch objects. DCCFindNomsMode Indicates if the measurement mode for an auto feature should be done in find nominals mode or not. DCCMeasureInMasterMode Indicates if the measurement mode for an auto feature should be done in master mode or not. Depth Gets or sets a depth value for a feature command. Deviation Auto sphere deviation value. DisplayConeAngle Flag indicating whether or not to display the angle of the cone. If this value is false, then the cone length is displayed. EdgeMeasureOrder Measure order for edge points. EdgeThickness Thickness value for edge points. EndAngle End Angle value. EndAngle2 Second End Angle value. FilterType Filter object filter type. FindHole Flag indicating whether or not to use the Find Hole routine. If this value is true, then the Find Hole routine is used. GenericAlignMode Generic alignment mode. GenericDisplayMode Generic display mode. GenericType Generic feature type. HasUserDefinedHits This queries an Auto Feature to determine if the feature has any sample hits that have been moved by the user in the Graphics Display window. HighPointSearchMode Search mode for auto high point. ID Represents the ID of the feature. Increment Increment value for auto high point. Indent Indent distance (used with sample hits). Indent2 Second indent distance (used with sample hits). Indent3 Third indent distance (used with sample hits). InitHits Number of initial sample hits. Inner Indicates whether the feature is a hole (inner) or a stud (outer). InteriorHit Flag used to indicate type of hit for objects that can have interior/exterior hits. Line3D Indicates whether the feature is a three dimensional line or a two dimensional line. A value of false indicates a two dimensional line. ManualPrePosition Read/Write: Manual PrePosition MeasAngle Measured angle value. MeasDiam Measured diameter value. MeasHeight This property applies only to PC-DMIS commands that have a height field. MeasLength This property applies only to PC-DMIS commands that have a length field. MeasMajorAxis Measured major axis length value (ellipse). MeasMinorAxis Measured minor axis length value (ellipse). MeasPinDiam Measured pin diameter value. MeasSmallLength Measured shorter length value. MeasureSlotWidth Flag indicating whether the slot width should be measured. NumHits Represents the number of inputs in the feature. NumHitsPerRow Represents the number of hits on each row of the feature. NumRows Represents the number of rows in the feature. OperatorNormType Read/Write: Type of Operator Norm algorithm used to best fit the constructed tangent feature Parent Returns the parent Com**mand obj**ect. PermHits Number of permanent sample hits. Polar Flag indicating whether polar coordinates are used on the feature. Usually defaults to false. ReferenceID ID of the feature to be used when the "ReferenceType" property is set to FEATREF_FEATURE. This property is used with measured lines or measured circles. ReferenceType Reference type used with measured circles and measured lines. RMeasFeature ID of the feature to be used for relative measurement. Spacer Spacer distance (Usually used with sample hits). StartAngle Start Angle value. StartAngle2 Second Start Angle value. Targets Read Only: Returns the child Targets Collection Object of a vision feature TheoAngle Theoretical angle value. TheoDiam Theoretical diameter value. TheoHeight Theoretical height value. TheoLength Theoretical length value. TheoMajorAxis Theoretical major axis length value (ellipse). TheoMinorAxis Theoretical minor axis length value (ellipse). TheoPinDiam Theoretical pin diameter value. TheoSmallLength Theoretical shorter length value. Thickness Sheet metal (material) thickness. Tolerance Tolerance value for auto high point. UsePin Indicates whether pin information should be used during measurement. UseTheoValuesForBestfit Read/Write: Use theo values to solve feature VisionMag Read/Write: Vision Feature Magnification VisionTargetColor Read/Write: Vision Feature Target Color VisionTargetType Read/Write: Vision Feature Target Type

| FeatCmd ObjectMembers |

| AddInputFeat | Adds a feature to set of input features used in constructed features. |
| AddInputFeatures | Appends an array of IDs to the list of Input Features |
| CalculateNominals | This method recalculates feature nominals for a measured feature. |
| CountHits | Recounts the hits for a measured feature. |
| Evaluate | Forces an evaluation of a feature without executing it. This takes one parameter that specifies the type of feature evaluation to perform. |
| GenerateHits | [Desc already exists] |
| GetCircMoveItem | Returns Point Data Object with interpolated circular move item data |
| GetData | [Desc already exists] |
| GetFormError | Returns Y14.5.1 Form error if applicable, else 0.0 |
| GetHit | Returns aPointDataobject with the values of the sample hit. |
| GetHitTValue | Returns T deviation values for specified hit |
| GetInputID | Gets ID of Input Feature |
| GetInputOffset | Gets Offset value for corresponding offset feature in constructed offset features |
| GetPoint | This method retrieves point information for individual objects. |
| GetPoints | Returns all Point Data Objects with hit data |
| GetSampleHit | Returns aPointDataobject with the values of the sample hit. |
| GetSurfaceVectors | This method gets the surface vectors of an angle hit function. |
| GetVector | This method retrieves vector components of individual objects. |
| PutData | This function returns TRUE if the data was successfully retrieved fromexpression, FALSE otherwise. |
| PutPoint | Sets point information for individual objects. |
| PutSurfaceVectors | Sets the surface vectors for an angle hit object. |
| PutVector | Sets vector components of individual objects. |
| RemoveInputFeat | Removes the feature at the specified index position. |
| SetHit | Sets the hit data of a specified hit. It uses the part coordinate system relative to the current alignment. |
| SetHit2 | This method works just like the SetHit method; it sets the hit data of a specified hit, but it uses a specified coordinate system and alignment. |
| SetInputFeat | Replaces the input feature at positionIndexinFeatCmdobject's list of input features withID. |
| SetInputOffset | Sets Offset value for coresponding offset feature in constructed offset features |

| AlignWorkPlane | Workplane value for constructed alignment planes and lines. |
| AutoCircularMove | Flag indicating whether circular moves should be used between hits. |
| AutoClearPlane | Flag indicating whether clearance planes should automatically be used with the feature. |
| AutoMove | Auto Move Flag. |
| AutoMoveDistance | Distance used in calculating auto move. |
| AutoPH9 | Flag indicating if selected tip should be automatically adjusted during measurement of feature. |
| AutoReadPos | Auto Read Position Flag. |
| BestFitMathType | Value representing the best fit math algorithm to be used in calculating the measured feature values based on the measured hits. Possible values include the following. |
| Bound | Flag indicating whether or not feature is bound. |
| BoxLength | Box length value for auto high point. |
| BoxWidth | Box width value for auto high point. |
| CircularRadiusIn | Inside circular radius value for auto high point. |
| CircularRadiusOut | Outside circular radius value for auto high point. |
| CornerRadius | Corner radius value for auto square slot and auto notch objects. |
| DCCFindNomsMode | Indicates if the measurement mode for an auto feature should be done in find nominals mode or not. |
| DCCMeasureInMasterMode | Indicates if the measurement mode for an auto feature should be done in master mode or not. |
| Depth | Gets or sets a depth value for a feature command. |
| Deviation | Auto sphere deviation value. |
| DisplayConeAngle | Flag indicating whether or not to display the angle of the cone. If this value is false, then the cone length is displayed. |
| EdgeMeasureOrder | Measure order for edge points. |
| EdgeThickness | Thickness value for edge points. |
| EndAngle | End Angle value. |
| EndAngle2 | Second End Angle value. |
| FilterType | Filter object filter type. |
| FindHole | Flag indicating whether or not to use the Find Hole routine. If this value is true, then the Find Hole routine is used. |
| GenericAlignMode | Generic alignment mode. |
| GenericDisplayMode | Generic display mode. |
| GenericType | Generic feature type. |
| HasUserDefinedHits | This queries an Auto Feature to determine if the feature has any sample hits that have been moved by the user in the Graphics Display window. |
| HighPointSearchMode | Search mode for auto high point. |
| ID | Represents the ID of the feature. |
| Increment | Increment value for auto high point. |
| Indent | Indent distance (used with sample hits). |
| Indent2 | Second indent distance (used with sample hits). |
| Indent3 | Third indent distance (used with sample hits). |
| InitHits | Number of initial sample hits. |
| Inner | Indicates whether the feature is a hole (inner) or a stud (outer). |
| InteriorHit | Flag used to indicate type of hit for objects that can have interior/exterior hits. |
| Line3D | Indicates whether the feature is a three dimensional line or a two dimensional line. A value of false indicates a two dimensional line. |
| ManualPrePosition | Read/Write:  Manual PrePosition |
| MeasAngle | Measured angle value. |
| MeasDiam | Measured diameter value. |
| MeasHeight | This property applies only to PC-DMIS commands that have a height field. |
| MeasLength | This property applies only to PC-DMIS commands that have a length field. |
| MeasMajorAxis | Measured major axis length value (ellipse). |
| MeasMinorAxis | Measured minor axis length value (ellipse). |
| MeasPinDiam | Measured pin diameter value. |
| MeasSmallLength | Measured shorter length value. |
| MeasureSlotWidth | Flag indicating whether the slot width should be measured. |
| NumHits | Represents the number of inputs in the feature. |
| NumHitsPerRow | Represents the number of hits on each row of the feature. |
| NumRows | Represents the number of rows in the feature. |
| OperatorNormType | Read/Write:  Type of Operator Norm algorithm used to best fit the constructed tangent feature |
| Parent | Returns the parentCommandobject. |
| PermHits | Number of permanent sample hits. |
| Polar | Flag indicating whether polar coordinates are used on the feature. Usually defaults to false. |
| ReferenceID | ID of the feature to be used when the "ReferenceType" property is set to FEATREF_FEATURE. This property is used with measured lines or measured circles. |
| ReferenceType | Reference type used with measured circles and measured lines. |
| RMeasFeature | ID of the feature to be used for relative measurement. |
| Spacer | Spacer distance (Usually used with sample hits). |
| StartAngle | Start Angle value. |
| StartAngle2 | Second Start Angle value. |
| Targets | Read Only:   Returns the child Targets Collection Object of a vision feature |
| TheoAngle | Theoretical angle value. |
| TheoDiam | Theoretical diameter value. |
| TheoHeight | Theoretical height value. |
| TheoLength | Theoretical length value. |
| TheoMajorAxis | Theoretical major axis length value (ellipse). |
| TheoMinorAxis | Theoretical minor axis length value (ellipse). |
| TheoPinDiam | Theoretical pin diameter value. |
| TheoSmallLength | Theoretical shorter length value. |
| Thickness | Sheet metal (material) thickness. |
| Tolerance | Tolerance value for auto high point. |
| UsePin | Indicates whether pin information should be used during measurement. |
| UseTheoValuesForBestfit | Read/Write:  Use theo values to solve feature |
| VisionMag | Read/Write:  Vision Feature Magnification |
| VisionTargetColor | Read/Write:  Vision Feature Target Color |
| VisionTargetType | Read/Write:  Vision Feature Target Type |

### AddInputFeat

This* *function only tries to addI**D*t*o aFea******tCmd**o**bje**ct representing a constructed feature if the *two *features exist andIDprecedestheFeatCmdobjectin the command list.If theFeatCmdis not a constructed feature, this function will fail.

### AddInputFeatures

Appends an array of IDs to the list of Input Features

### AlignWorkPlane

This property applies only to PC-DMIS constructed features that have a workplane field.

### AutoCircularMove

Flag indicating whether circular moves should be used between hits.

### AutoClearPlane

Flag indicating whether clearance planes should automatically be used with the feature.

### AutoMove

Visual Basic Public Property AutoMove As Boolean

### AutoMoveDistance

Distance used in calculating auto move.

### AutoPH9

Flag indicating if selected tip should be automatically adjusted during measurement of feature.

### AutoReadPos

Auto Read Position Flag.

### BestFitMathType

Value representing the best fit math algorithm to be used in calculating the measured feature values based on the measured hits. Possible values include the following.

### Bound

Flag indicating whether or not feature is bound.

### BoxLength

Box length value for auto high point.

### BoxWidth

Box width value for auto high point.

### CalculateNominals

This method recalculates feature nominals for a measured feature.

### CircularRadiusIn

Read/writeD**oublev**alue.

### CircularRadiusOut

Outside circular radius value for auto high point.

### CornerRadius

Corner radius value for auto square slot and auto notch objects.

### CountHits

Recounts the hits for a measured feature.

### DCCFindNomsMode

Indicates if the measurement mode for an auto feature should be done in find nominals mode or not.

### DCCMeasureInMasterMode

Indicates if the measurement mode for an auto feature should be done in master mode or not.

### Depth

This property applies only to PC-DMIS commands that have a depth field..

### Deviation

Auto sphere deviation value.

### DisplayConeAngle

Flag indicating whether or not to display the angle of the cone. If this value is false, then the cone length is displayed.

### EdgeMeasureOrder

Measure order for edge points.

### EdgeThickness

Thickness value for edge points.

### EndAngle

End Angle value.

### EndAngle2

Second End Angle value.

### Evaluate

Forces an evaluation of a feature without executing it. This takes one parameter that specifies the type of feature evaluation to perform.

### FilterType

Filter object filter type.

### FindHole

Flag indicating whether or not to use the Find Hole routine. If this value is true, then the Find Hole routine is used.

### GenerateHits

[Desc already exists]

### GenericAlignMode

Generic alignment mode.

### GenericDisplayMode

Generic display mode.

### GenericType

Read/writeE**num_Generic_Typesen**umeration.

### GetCircMoveItem

Returns Point Data Object with interpolated circular move item data

### GetData

If no value is supplied, the default value isFDATA_MEAS.

### GetFormError

Returns Y14.5.1 Form error if applicable, else 0.0

### GetHit

If no value is supplied, the default value is an empty string which causes the current alignment to be used.

### GetHitTValue

Returns T deviation values for specified hit

### GetInputID

Gets ID of Input Feature

### GetInputOffset

Gets Offset value for corresponding offset feature in constructed offset features

### GetPoint

This method retrieves point information for individual objects.

### GetPoints

Returns all Point Data Objects with hit data

### GetSampleHit

If no value is supplied, the default value is an empty string which causes the current alignment to be used.

### GetSurfaceVectors

This method gets the surface vectors of an angle hit function.

### GetVector

This method retrieves vector components of individual objects.

### HasUserDefinedHits

This queries an Auto Feature to determine if the feature has any sample hits that have been moved by the user in the Graphics Display window.

### HighPointSearchMode

Search mode for auto high point.

### ID

The IDs of the various objects in a measurement routine should be unique.

### Increment

Increment value for auto high point.

### Indent

This property applies only to PC-DMIS commands that have an indent field.

### Indent2

Second indent distance (used with sample hits).

### Indent3

Third indent distance (used with sample hits).

### InitHits

This property applies only to PC-DMIS commands that have a working initial hits field. These include:

### Inner

Indicates whether the feature is a hole (inner) or a stud (outer).

### InteriorHit

Flag used to indicate type of hit for objects that can have interior/exterior hits.

### Line3D

Indicates whether the feature is a three dimensional line or a two dimensional line. A value of false indicates a two dimensional line.

### ManualPrePosition

Read/Write: Manual PrePosition

### MeasAngle

Measured angle value.

### MeasDiam

Measured diameter value.

### MeasHeight

This property applies only to PC-DMIS commands that have a height field.

### MeasLength

This property applies only to PC-DMIS commands that have a length field.

### MeasMajorAxis

Measured major axis length value (ellipse).

### MeasMinorAxis

Measured minor axis length value (ellipse).

### MeasPinDiam

Measured pin diameter value.

### MeasSmallLength

Measured shorter length value.

### MeasureSlotWidth

Flag indicating whether the slot width should be measured.

### NumHits

If this feature is constructed, it reports the number of input features.

### NumHitsPerRow

You can use this variable only with features that have rows (such as spheres and cylinders).

### NumRows

You can use this variable only with features that have rows (such as spheres and cylinders).

### OperatorNormType

Read/Write: Type of Operator Norm algorithm used to best fit the constructed tangent feature

### Parent

Returns the parent **Command **object.

### PermHits

This property applies only to PC-DMIS commands that have a working permanent hits field. These include

### Polar

Flag indicating whether polar coordinates are used on the feature. Usually defaults to false.

### PutData

If no value is supplied, the default value is an empty string which causes the current alignment to be used.

### PutPoint

Sets point information for individual objects.

### PutSurfaceVectors

Sets the surface vectors for an angle hit object.

### PutVector

Sets vector components of individual objects.

### RMeasFeature

ID of the feature to be used for relative measurement.

### ReferenceID

ID of the feature to be used when the "ReferenceType" property is set to FEATREF_FEATURE. This property is used with measured lines or measured circles.

### ReferenceType

Read/writeE**NUM_FEATREF_TYPESe**numeration.

### RemoveInputFeat

Removes the feature at the specified index position.

### SetHit

Sets the hit data of a specified hit. It uses the part coordinate system relative to the current alignment.

### SetHit2

This method works just like the SetHit method; it sets the hit data of a specified hit, but it uses a specified coordinate system and alignment.

### SetInputFeat

Replaces the input feature at position *Index* in **FeatCmd** object's list of input features with *ID* .

### SetInputOffset

Sets Offset value for coresponding offset feature in constructed offset features

### Spacer

Spacer distance (Usually used with sample hits).

### StartAngle

Start Angle value.

### StartAngle2

Second Start Angle value.

### Targets

Read Only: Returns the child Targets Collection Object of a vision feature

### TheoAngle

Theoretical angle value.

### TheoDiam

Theoretical diameter value.

### TheoHeight

Theoretical height value.

### TheoLength

This property applies only to PC-DMIS commands that have a length field. These include:

### TheoMajorAxis

Theoretical major axis length value (ellipse).

### TheoMinorAxis

Theoretical minor axis length value (ellipse).

### TheoPinDiam

Theoretical pin diameter value.

### TheoSmallLength

Theoretical shorter length value.

### Thickness

Sheet metal (material) thickness.

### Tolerance

Tolerance value for auto high point.

### UsePin

Indicates whether pin information should be used during measurement.

### UseTheoValuesForBestfit

Read/Write: Use theo values to solve feature

### VisionMag

Read/Write: Vision Feature Magnification

### VisionTargetColor

Read/Write: Vision Feature Target Color

### VisionTargetType

Read/Write: Vision Feature Target Type

