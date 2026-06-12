# PC-DMIS Reference: Alignment

## AlignCmnd

# AlignCmnd Object

# Description

# Object Model

# See Also

AlignCmnd Members

**AlignCmnd **objects are created from more generic **Command** objects to pass alignment information back and forth.

| AlignCmnd Object |

# AlignCmnd Object Members

# Public Methods

# Public Properties

# See Also

Represents the offset angles of a 3D or 2D alignment.

Represents whether or not error averaging is used during the iterative alignment.

Represents the matrix used to transform points between the cad and part alignment systems.

Represents the external filename for recalling external alignments.

**Note:**for releases prior to 2012, the required format is

<filename>:<ExternalID>

For example, if you create a SAVE_ALIGN object with ExternalFileID = “A2saved.aln” and ExternalID = “A2”, you would specify the RECALL_ALIGN object ExternalFileID as “A2saved:A2”.

This property should not be set if recalling an internal alignment.

Represents the external ID.

**Note:**for releases prior to 2012, the required value is whatever the corresponding SAVE_ALIGN object ExternalID was set to, for example “A2”.

Represents the intial ID of this alignment object. The intial ID is the ID of the alignment to recall before modifying it with this alignment.

Represents the matrix used to transform points between the machine and part alignment systems.

Returns the number of inputs to this alignment object. Read-onlyL**ong.**

Returns the parentC**ommando**bject. Read-only.

Represents the workplane of this alignment object. It can take the values PCD_XPLUS, PCD_XMINUS, PCD_YPLUS, PCD_YMINUS, PCD_ZPLUS, and PCD_ZMINUS.

AlignCmnd Object

AddBestFitFeat Adds best fit feature to BF3D or BF2D alignments AddLevelFeat Adds level feature to iterative alignment AddOriginFeat Adds origin feature to iterative alignment AddRotateFeat Adds rotation feature to iterative alignment CalculateDeviation Returns deviation value and vector for a feature CalculateDeviation2 Returns theoretical, measured and deviations of input after alignment values CalculateMatrices Forces immediate calculation of alignment matrices CalculateStatistics Returns the mean and standard deviation GetBFIterations Returns the number of bestfit iterations GetFeatureIdByIndex Returns the feature id

AboutAxis Represents the axis about which the alignment object rotates. Angle Represents the offset angles of a 3D or 2D alignment. AverageError Represents whether or not error averaging is used during the iterative alignment. AXIS Represents the axis that the alignment object uses. BFOffset Represents the offsets of a 3D or 2D alignment. CadToPartMatrix Represents the matrix used to transform points between the cad and part alignment systems. ExternalFileID Represents the external filename for recalling external alignments. For objects of type SAVE_ALIGN, it should include a ‘.aln’ extension and can include the fully qualified directory path. If it does not, indicates the alignment file should be written to the PC-DMIS default recall directory. For objects of type RECALL_ALIGN set to recall an external alignment file, it should be only the filename, without a directory path or an extension. Note: fo****r r**el**eases prior to 2012, the required format is <filename>:<ExternalID> For example, if you create a SAVE_ALIGN object with ExternalFileID = “A2saved.aln” and ExternalID = “A2”, you would specify the RECALL_ALIGN object ExternalFileID as “A2saved:A2”. This property should not be set if recalling an internal alignment. ExternalID Represents the external ID. For objects of type SAVE_ALIGN, it should be the name of the alignment being saved to a file. For example, if you are saving alignment ‘A2’ to a file, set ExternalID to “A2”. For objects of type RECALL_ALIGN set to recall an external alignment file, ExternalID should be set to “External”. Note: for releases prior to 2012, the required value is whatever the corresponding SAVE_ALIGN object ExternalID was set to, for example “A2”. For objects of type RECALL_ALIGN set to recall an internal alignment, this property should be set to the name of the internal alignment being recalled. FeatID Represents the first (or only) feature ID used by this alignment object. FeatID2 Represents the second feature ID used by this alignment object. FindCad Represents the FindCad property status of this best fit alignment object. ID Represents the ID of this alignment object. InitID Represents the intial ID of this alignment object. The intial ID is the ID of the alignment to recall before modifying it with this alignment. IterativeLevelAxis Represents the level axis for an iterative alignment. IterativeOriginAxis Represents the origin axis for an iterative alignment. IterativeRotateAxis Represents the rotate axis for an iterative alignment. MachineToPartMatrix Represents the matrix used to transform points between the machine and part alignment systems. MeasAllFeat Represents the "Measure All Features" property of this iterative alignment object. MeasAllFeatAlways Represents the "Measure All Features Always" property of this iterative alignment object. NumInputs Returns the number of inputs to this alignment object. Read-only Long . Offset Represe**nts **the offset property of this offset alignment object. Parent Returns the parent Command object. Read**-only. **PointTolerance Represents the "Point Tolerance" property of this alignment object. RepierceCad Represents whether or not to repierce the cad model during the execution of this iterative alignment object. UseBodyAxis Represents whether or not to use the "Body Axis” method during the calculation of this iterative alignment object. Workplane Represents the workplane of this alignment object. It can take the values PCD_XPLUS, PCD_XMINUS, PCD_YPLUS, PCD_YMINUS, PCD_ZPLUS, and PCD_ZMINUS.

| AlignCmnd ObjectMembers |

| AddBestFitFeat | Adds best fit feature to BF3D or BF2D alignments |
| AddLevelFeat | Adds level feature to iterative alignment |
| AddOriginFeat | Adds origin feature to iterative alignment |
| AddRotateFeat | Adds rotation feature to iterative alignment |
| CalculateDeviation | Returns deviation value and vector for a feature |
| CalculateDeviation2 | Returns theoretical, measured and deviations of input after alignment values |
| CalculateMatrices | Forces immediate calculation of alignment matrices |
| CalculateStatistics | Returns the mean and standard deviation |
| GetBFIterations | Returns the number of bestfit iterations |
| GetFeatureIdByIndex | Returns the feature id |

| AboutAxis | Represents the axis about which the alignment object rotates. |
| Angle | Represents the offset angles of a 3D or 2D alignment. |
| AverageError | Represents whether or not error averaging is used during the iterative alignment. |
| AXIS | Represents the axis that the alignment object uses. |
| BFOffset | Represents the offsets of a 3D or 2D alignment. |
| CadToPartMatrix | Represents the matrix used to transform points between the cad and part alignment systems. |
| ExternalFileID | Represents the external filename for recalling external alignments.For objects of type SAVE_ALIGN, it should include a ‘.aln’ extension and can include the fully qualified directory path. If it does not, indicates the alignment file should be written to the PC-DMIS default recall directory.For objects of type RECALL_ALIGN set to recall an external alignment file, it should be only the filename, without a directory path or an extension.Note:for releases prior to 2012, the required format is<filename>:<ExternalID>For example, if you create a SAVE_ALIGN object with ExternalFileID = “A2saved.aln” and ExternalID = “A2”, you would specify the RECALL_ALIGN object ExternalFileID as “A2saved:A2”.This property should not be set if recalling an internal alignment. |
| ExternalID | Represents the external ID.For objects of type SAVE_ALIGN, it should be the name of the alignment being saved to a file. For example, if you are saving alignment ‘A2’ to a file, set ExternalID to “A2”.For objects of type RECALL_ALIGN set to recall an external alignment file, ExternalID should be set to “External”.Note:for releases prior to 2012, the required value is whatever the corresponding SAVE_ALIGN object ExternalID was set to, for example “A2”.For objects of type RECALL_ALIGN set to recall an internal alignment, this property should be set to the name of the internal alignment being recalled. |
| FeatID | Represents the first (or only) feature ID used by this alignment object. |
| FeatID2 | Represents the second feature ID used by this alignment object. |
| FindCad | Represents the FindCad property status of this best fit alignmentobject. |
| ID | Represents the ID of this alignment object. |
| InitID | Represents the intial ID of this alignment object. The intial ID is the ID of the alignment to recall before modifying it with this alignment. |
| IterativeLevelAxis | Represents the level axis for an iterative alignment. |
| IterativeOriginAxis | Represents the origin axis for an iterative alignment. |
| IterativeRotateAxis | Represents the rotate axis for an iterative alignment. |
| MachineToPartMatrix | Represents the matrix used to transform points between the machine and part alignment systems. |
| MeasAllFeat | Represents the "Measure All Features" property of this iterative alignment object. |
| MeasAllFeatAlways | Represents the "Measure All Features Always" property of this iterative alignment object. |
| NumInputs | Returns the number of inputs to this alignment object. Read-onlyLong. |
| Offset | Represents the offset property of this offset alignment object. |
| Parent | Returns the parentCommandobject. Read-only. |
| PointTolerance | Represents the "Point Tolerance" property of this alignment object. |
| RepierceCad | Represents whether or not to repierce the cad model during the execution of this iterative alignment object. |
| UseBodyAxis | Represents whether or not to use the "Body Axis” method during the calculation of this iterative alignment object. |
| Workplane | Represents the workplane of this alignment object. It can take the values PCD_XPLUS, PCD_XMINUS, PCD_YPLUS, PCD_YMINUS, PCD_ZPLUS, and PCD_ZMINUS. |

- For objects of type SAVE_ALIGN, it should include a ‘.aln’ extension and can include the fully qualified directory path. If it does not, indicates the alignment file should be written to the PC-DMIS default recall directory.
- For objects of type RECALL_ALIGN set to recall an external alignment file, it should be only the filename, without a directory path or an extension.

- For objects of type SAVE_ALIGN, it should be the name of the alignment being saved to a file. For example, if you are saving alignment ‘A2’ to a file, set ExternalID to “A2”.
- For objects of type RECALL_ALIGN set to recall an external alignment file, ExternalID should be set to “External”.

- For objects of type RECALL_ALIGN set to recall an internal alignment, this property should be set to the name of the internal alignment being recalled.

> **NOTE: Note:**
>
> Public MethodsAddBestFitFeatAdds best fit feature to BF3D or BF2D alignmentsAddLevelFeatAdds level feature to iterative alignmentAddOriginFeatAdds origin feature to iterative alignmentAddRotateFeatAdds rotation feature to iterative alignmentCalculateDeviationReturns deviation value and vector for a featureCalculateDeviation2Returns theoretical, measured and deviations of input after alignment valuesCalculateMatricesForces immediate calculation of alignment matricesCalculateStatisticsReturns the mean and standard deviationGetBFIterationsReturns the number of bestfit iterationsGetFeatureIdByIndexReturns the feature idPublic PropertiesAboutAxisRepresents the axis about which the alignment object rotates.AngleRepresents the offset angles of a 3D or 2D alignment.AverageErrorRepresents whether or not error averaging is used during the iterative alignment.AXISRepresents the axis that the alignment object uses.BFOffsetRepresents the offsets of a 3D or 2D alignment.CadToPartMatrixRepresents the matrix used to transform points between the cad and part alignment systems.ExternalFileIDRepresents the external filename for recalling external alignments.For objects of type SAVE_ALIGN, it should include a ‘.aln’ extension and can include the fully qualified directory path. If it does not, indicates the alignment file should be written to the PC-DMIS default recall directory.For objects of type RECALL_ALIGN set to recall an external alignment file, it should be only the filename, without a directory path or an extension.Note:for releases prior to 2012, the required format is<filename>:<ExternalID>For example, if you create a SAVE_ALIGN object with ExternalFileID = “A2saved.aln” and ExternalID = “A2”, you would specify the RECALL_ALIGN object ExternalFileID as “A2saved:A2”.This property should not be set if recalling an internal alignment.ExternalIDRepresents the external ID.For objects of type SAVE_ALIGN, it should be the name of the alignment being saved to a file. For example, if you are saving alignment ‘A2’ to a file, set ExternalID to “A2”.For objects of type RECALL_ALIGN set to recall an external alignment file, ExternalID should be set to “External”.Note:for releases prior to 2012, the required value is whatever the corresponding SAVE_ALIGN object ExternalID was set to, for example “A2”.For objects of type RECALL_ALIGN set to recall an internal alignment, this property should be set to the name of the internal alignment being recalled.FeatIDRepresents the first (or only) feature ID used by this alignment object.FeatID2Represents the second feature ID used by this alignment object.FindCadRepresents the FindCad property status of this best fit alignmentobject.IDRepresents the ID of this alignment object.InitIDRepresents the intial ID of this alignment object. The intial ID is the ID of the alignment to recall before modifying it with this alignment.IterativeLevelAxisRepresents the level axis for an iterative alignment.IterativeOriginAxisRepresents the origin axis for an iterative alignment.IterativeRotateAxisRepresents the rotate axis for an iterative alignment.MachineToPartMatrixRepresents the matrix used to transform points between the machine and part alignment systems.MeasAllFeatRepresents the "Measure All Features" property of this iterative alignment object.MeasAllFeatAlwaysRepresents the "Measure All Features Always" property of this iterative alignment object.NumInputsReturns the number of inputs to this alignment object. Read-onlyLong.OffsetRepresents the offset property of this offset alignment object.ParentReturns the parentCommandobject. Read-only.PointToleranceRepresents the "Point Tolerance" property of this alignment object.RepierceCadRepresents whether or not to repierce the cad model during the execution of this iterative alignment object.UseBodyAxisRepresents whether or not to use the "Body Axis” method during the calculation of this iterative alignment object.WorkplaneRepresents the workplane of this alignment object. It can take the values PCD_XPLUS, PCD_XMINUS, PCD_YPLUS, PCD_YMINUS, PCD_ZPLUS, and PCD_ZMINUS.See AlsoAlignCmnd Object

> **NOTE: Note:**
>
> Public MethodsAddBestFitFeatAdds best fit feature to BF3D or BF2D alignmentsAddLevelFeatAdds level feature to iterative alignmentAddOriginFeatAdds origin feature to iterative alignmentAddRotateFeatAdds rotation feature to iterative alignmentCalculateDeviationReturns deviation value and vector for a featureCalculateDeviation2Returns theoretical, measured and deviations of input after alignment valuesCalculateMatricesForces immediate calculation of alignment matricesCalculateStatisticsReturns the mean and standard deviationGetBFIterationsReturns the number of bestfit iterationsGetFeatureIdByIndexReturns the feature idPublic PropertiesAboutAxisRepresents the axis about which the alignment object rotates.AngleRepresents the offset angles of a 3D or 2D alignment.AverageErrorRepresents whether or not error averaging is used during the iterative alignment.AXISRepresents the axis that the alignment object uses.BFOffsetRepresents the offsets of a 3D or 2D alignment.CadToPartMatrixRepresents the matrix used to transform points between the cad and part alignment systems.ExternalFileIDRepresents the external filename for recalling external alignments.For objects of type SAVE_ALIGN, it should include a ‘.aln’ extension and can include the fully qualified directory path. If it does not, indicates the alignment file should be written to the PC-DMIS default recall directory.For objects of type RECALL_ALIGN set to recall an external alignment file, it should be only the filename, without a directory path or an extension.Note:for releases prior to 2012, the required format is<filename>:<ExternalID>For example, if you create a SAVE_ALIGN object with ExternalFileID = “A2saved.aln” and ExternalID = “A2”, you would specify the RECALL_ALIGN object ExternalFileID as “A2saved:A2”.This property should not be set if recalling an internal alignment.ExternalIDRepresents the external ID.For objects of type SAVE_ALIGN, it should be the name of the alignment being saved to a file. For example, if you are saving alignment ‘A2’ to a file, set ExternalID to “A2”.For objects of type RECALL_ALIGN set to recall an external alignment file, ExternalID should be set to “External”.Note:for releases prior to 2012, the required value is whatever the corresponding SAVE_ALIGN object ExternalID was set to, for example “A2”.For objects of type RECALL_ALIGN set to recall an internal alignment, this property should be set to the name of the internal alignment being recalled.FeatIDRepresents the first (or only) feature ID used by this alignment object.FeatID2Represents the second feature ID used by this alignment object.FindCadRepresents the FindCad property status of this best fit alignmentobject.IDRepresents the ID of this alignment object.InitIDRepresents the intial ID of this alignment object. The intial ID is the ID of the alignment to recall before modifying it with this alignment.IterativeLevelAxisRepresents the level axis for an iterative alignment.IterativeOriginAxisRepresents the origin axis for an iterative alignment.IterativeRotateAxisRepresents the rotate axis for an iterative alignment.MachineToPartMatrixRepresents the matrix used to transform points between the machine and part alignment systems.MeasAllFeatRepresents the "Measure All Features" property of this iterative alignment object.MeasAllFeatAlwaysRepresents the "Measure All Features Always" property of this iterative alignment object.NumInputsReturns the number of inputs to this alignment object. Read-onlyLong.OffsetRepresents the offset property of this offset alignment object.ParentReturns the parentCommandobject. Read-only.PointToleranceRepresents the "Point Tolerance" property of this alignment object.RepierceCadRepresents whether or not to repierce the cad model during the execution of this iterative alignment object.UseBodyAxisRepresents whether or not to use the "Body Axis” method during the calculation of this iterative alignment object.WorkplaneRepresents the workplane of this alignment object. It can take the values PCD_XPLUS, PCD_XMINUS, PCD_YPLUS, PCD_YMINUS, PCD_ZPLUS, and PCD_ZMINUS.See AlsoAlignCmnd Object

> **NOTE: Note:**
>
> AboutAxisRepresents the axis about which the alignment object rotates.AngleRepresents the offset angles of a 3D or 2D alignment.AverageErrorRepresents whether or not error averaging is used during the iterative alignment.AXISRepresents the axis that the alignment object uses.BFOffsetRepresents the offsets of a 3D or 2D alignment.CadToPartMatrixRepresents the matrix used to transform points between the cad and part alignment systems.ExternalFileIDRepresents the external filename for recalling external alignments.For objects of type SAVE_ALIGN, it should include a ‘.aln’ extension and can include the fully qualified directory path. If it does not, indicates the alignment file should be written to the PC-DMIS default recall directory.For objects of type RECALL_ALIGN set to recall an external alignment file, it should be only the filename, without a directory path or an extension.Note:for releases prior to 2012, the required format is<filename>:<ExternalID>For example, if you create a SAVE_ALIGN object with ExternalFileID = “A2saved.aln” and ExternalID = “A2”, you would specify the RECALL_ALIGN object ExternalFileID as “A2saved:A2”.This property should not be set if recalling an internal alignment.ExternalIDRepresents the external ID.For objects of type SAVE_ALIGN, it should be the name of the alignment being saved to a file. For example, if you are saving alignment ‘A2’ to a file, set ExternalID to “A2”.For objects of type RECALL_ALIGN set to recall an external alignment file, ExternalID should be set to “External”.Note:for releases prior to 2012, the required value is whatever the corresponding SAVE_ALIGN object ExternalID was set to, for example “A2”.For objects of type RECALL_ALIGN set to recall an internal alignment, this property should be set to the name of the internal alignment being recalled.FeatIDRepresents the first (or only) feature ID used by this alignment object.FeatID2Represents the second feature ID used by this alignment object.FindCadRepresents the FindCad property status of this best fit alignmentobject.IDRepresents the ID of this alignment object.InitIDRepresents the intial ID of this alignment object. The intial ID is the ID of the alignment to recall before modifying it with this alignment.IterativeLevelAxisRepresents the level axis for an iterative alignment.IterativeOriginAxisRepresents the origin axis for an iterative alignment.IterativeRotateAxisRepresents the rotate axis for an iterative alignment.MachineToPartMatrixRepresents the matrix used to transform points between the machine and part alignment systems.MeasAllFeatRepresents the "Measure All Features" property of this iterative alignment object.MeasAllFeatAlwaysRepresents the "Measure All Features Always" property of this iterative alignment object.NumInputsReturns the number of inputs to this alignment object. Read-onlyLong.OffsetRepresents the offset property of this offset alignment object.ParentReturns the parentCommandobject. Read-only.PointToleranceRepresents the "Point Tolerance" property of this alignment object.RepierceCadRepresents whether or not to repierce the cad model during the execution of this iterative alignment object.UseBodyAxisRepresents whether or not to use the "Body Axis” method during the calculation of this iterative alignment object.WorkplaneRepresents the workplane of this alignment object. It can take the values PCD_XPLUS, PCD_XMINUS, PCD_YPLUS, PCD_YMINUS, PCD_ZPLUS, and PCD_ZMINUS.

> **NOTE: Note:**
>
> Note:for releases prior to 2012, the required format is<filename>:<ExternalID>For example, if you create a SAVE_ALIGN object with ExternalFileID = “A2saved.aln” and ExternalID = “A2”, you would specify the RECALL_ALIGN object ExternalFileID as “A2saved:A2”.

> **NOTE: Note:**
>
> Note:for releases prior to 2012, the required format is

> **NOTE: Note:**
>
> Note:for releases prior to 2012, the required value is whatever the corresponding SAVE_ALIGN object ExternalID was set to, for example “A2”.

> **NOTE: Note:**
>
> Note:for releases prior to 2012, the required value is whatever the corresponding SAVE_ALIGN object ExternalID was set to, for example “A2”.

### AXIS

This function only works for objects of type ROTATE_ALIGN, ROTATE_CIRCLE_ALIGN, TRANS_ALIGN, and TRANSOFF_ALIGN. For other object types, trying to set this property does nothing, and trying to get this property always returns PCD_ZPLUS.

### AboutAxis

This function only works for objects of type ROTATE_ALIGN, ROTATE_CIRCLE_ALIGN, and ROTATEOFF_ALIGN. For other object types, trying to set this property does nothing, and trying to get this property always returns PCD_ZPLUS.

### AddBestFitFeat

Adds best fit feature to BF3D or BF2D alignments

### AddLevelFeat

Adds level feature to iterative alignment

### AddOriginFeat

Adds origin feature to iterative alignment

### AddRotateFeat

Adds rotation feature to iterative alignment

### Angle

Represents the offset angles of a 3D or 2D alignment.

### AverageError

Represents whether or not error averaging is used during the iterative alignment.

### BFOffset

Represents the offsets of a 3D or 2D alignment.

### CadToPartMatrix

Represents the matrix used to transform points between the cad and part alignment systems.

### CalculateDeviation

Returns deviation value and vector for a feature

### CalculateDeviation2

Returns theoretical, measured and deviations of input after alignment values

### CalculateMatrices

Forces immediate calculation of alignment matrices

### CalculateStatistics

Returns the mean and standard deviation

### ExternalFileID

Represents the external filename for recalling external alignments.

### ExternalID

Represents the external ID.

### FeatID

Represents the first (or only) feature ID used by this alignment object.

### FeatID2

Represents the second feature ID used by this alignment object.

### FindCad

Represents the FindCad property status of this best fit alignment object.

### GetBFIterations

Returns the number of bestfit iterations

### GetFeatureIdByIndex

Returns the feature id

### ID

Represents the ID of this alignment object.

### InitID

Represents the intial ID of this alignment object. The intial ID is the ID of the alignment to recall before modifying it with this alignment.

### IterativeLevelAxis

Represents the level axis for an iterative alignment.

### IterativeOriginAxis

Represents the origin axis for an iterative alignment.

### IterativeRotateAxis

Represents the rotate axis for an iterative alignment.

### MachineToPartMatrix

Represents the matrix used to transform points between the machine and part alignment systems.

### MeasAllFeat

Represents the "Measure All Features" property of this iterative alignment object.

### MeasAllFeatAlways

Represents the "Measure All Features Always" property of this iterative alignment object.

### NumInputs

Returns the number of inputs to this alignment object. Read-onlyL**ong.**

### Offset

Represents the offset property of this offset alignment object.

### Parent

Returns the parentC**ommando**bject. Read-only.

### PointTolerance

Represents the "Point Tolerance" property of this alignment object.

### RepierceCad

Represents whether or not to repierce the cad model during the execution of this iterative alignment object.

### UseBodyAxis

Represents whether or not to use the "Body Axis” method during the calculation of this iterative alignment object.

### Workplane

Represents the workplane of this alignment object. It can take the values PCD_XPLUS, PCD_XMINUS, PCD_YPLUS, PCD_YMINUS, PCD_ZPLUS, and PCD_ZMINUS.

