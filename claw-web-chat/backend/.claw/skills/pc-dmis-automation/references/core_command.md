# PC-DMIS Reference: Core Command

## Command

# Command Object

# Description

# Object Model

# Remarks

# Example

# See Also

TheC**ommando**bject represents a single command in PC-DMIS.

The Command object is also a "collection object" as it represents:

Command Members

The **Command** object represents a single command in PC-DMIS.

Examples of single commands in PC-DMIS are the start of a feature, a hit, the end of a feature, a single X dimension line, an auto feature, etc. The Command object is also a "collection object" as it represents: the collection of executions of this object in the current execution. the collection of executions of this object in the previous execution.

For an example, see the example in GetReferencedFeature .

| Command Object |

- the collection of executions of this object in the current execution.
- the collection of executions of this object in the previous execution.

# Command Object Members

# Public Methods

# Public Properties

# See Also

Executes the command if the command is immediately executable.

This method requests that the object be redrawn in the Edit window.

SolveExpression evaluates the expression based on the objects above the command on which SolveExpression gets called.

Returns thisC**ommando**bject as anAli**gnCmndobj**ect if it can,Nothi**ngother**wise.

Returns thisC**ommando**bject as aBas**icScanobj**ect if it can,Nothi**ngother**wise. Read-only.

OnlyC**ommando**bjects of type BASIC_SCAN_OBJECT can becomeBas**icScanobj**ects.

Each command in PC-DMIS has a unique idenification. This is the GUID (Globally Unique Identifier). This returns the identification as a string value.

Property used to indicate/set whether the object should execute in MASTER mode. After executing in MASTER mode, the object copies the measured vector, centroid, and other nominal information to the nominals and turns off MASTER mode. This copies the same information that gets calculated using the CalculateNominals method.

Represents the number of copies of thisC****omman**dw**hich are available. If the measurement routine is currently being executed, it is the number of times it has been executed so far in the current execution cycle. If the measurement routine is not currently being executed, it is the number of times it was executed during the previous execution cycle. IfCommandhas never been executed,Count*has t*he value one.

Returns aD**imFormato**bject if Command is ofTyp*eDIM*ENSION_FORMAT. Otherwise it returnsNothi**ng. Rea**d-only.

Returns thisC**ommando**bject as aFea**tCmdobj**ect if it can,Nothi**ngother**wise. Read-only.

Returns aF**ileIOo**bject if Command is ofTyp*eFIL*E_IO_OBJECT. Otherwise it returnsNothi**ng. Rea**d-only.

Returns thisC**ommando**bject as anFlo**wControlCmndobj**ect if it can,Nothi**ngother**wise. Read-only.

TheC**ommandsth**at have the followingType*can *becomeFlowCo**ntrolCmndobject**s are as follows:

LOOP_STARTSTART_SUBROUTINECALL_SUBROUTINELABELGOTOIF_GOTO_COMMANDBASIC_SCRIPTONERRORWHILE_COMMANDENDWHILE_COMMANDIF_BLOCK_COMMANDEND_IF_COMMANDIF_ELSE_COMMANDEND_IF_ELSE_COMMAND,END_ELSE_COMMANDDO_COMMANDUNTIL_COMMANDCASE_COMMANDEND_CASE_COMMANDDEFAULT_CASE_COMMANDEND_DEFAULT_CASE_COMMANDSELECT_COMMANDEND_SELECT_COMMAND

This read-only property returns the value of a field from a command.

If you try to access a field that isn't supported by the command, PC-DMIS returns FALSE. This property takes two parameters, the first parameter defines the field item. You can select this item from an enumerated list or use the associated constant number. The second parameter specifies theTypeIndex.

This read-only property checks a command's field and returns 0 if it isn't a toggle field. It also returns 0 if the field doesn't exist. Otherwise, it returns a the current toggle index value, with 1 as the base index value.

It takes two parameters. The first is an enumerated field type value to determine what field to check in a command, and the second is theTypeIndex.

Determines whether or not the command is a Comment command.

Determines whether or not the command is an option probe command.

Property used to indicate/set whether command is marked in the edit window.

This property checks whether or not a missed hit occurred on the last executed instance of the specified command.

Returns aM**odalCommando**bject for the Command if it can,Not**hingoth**erwise. Read-only.

Returns the parentC**ommandsc**ollection object. Read-only.

Property used to indicate/set whether the command ID should be displayed in the CAD window.

Property used to indicate whether the a command was skipped over.

Property used to indicate/set whether command is a slave arm object.

Returns a human-readable description ofT*ypeo*f the object. For example, an object of type CONST_OFF_PLANE has the string "Constructed Offset Plane" returned by this function.

This property checks whether or not an unexpected hit occurred on the last executed instance of the specified command.

Command Object

AddBundleInstance Adds a bundle instance into the bundle alignment linked list for the specified station index. Returns false if the station number doesn't exist or the instance already exists Compute Performs mathematical evaluation of the command CreateBundleFeatures Creates bundled features. Returns false if the command is not a bundle alignment Dialog Opens the PC-DMIS dialog box for the corresponding command. Dialog2 Opens the PC-DMIS dialog box for the corresponding command. EXECUTE Executes the command if the command is immediately executable. GetBundleInstance Gets the bundle instance of the command for the specified station index.A NULL pointer is returned if there is no instance at that index GetExpression Gets the expression of the indicated field of the command. GetExpressionEx Gets the expression of the indicated field of the command [Extended DType] GetText Gets the text of the indicated field of the command. GetTextEx Returns the text used to represent a data item of the object [Extended DType] GetToggleString Returns the string of text of a toggle field. GetToggleStringEx Returns the toggle text delimited by the | symbol if the field is a toggle field, otherwise returns an empty string [Extended DType] GetToolkitData Returns the value of the Toolkit data object GetUniqueID This command retrieves the low and high parts of the 64-bit unique id of the command. IsBundledCommand Checks if command is a bundled command IsExpressionValid Determines whether or not an expression is valid. Item Returns the execute instance of the object if the object has been executed more than once Mark Marks the current object and all objects that depend on it. Optionally the features of the current alignment are also marked. Next Accesses the next command in the parent C******omma**nd**s **list. OptimizedSetExpression Like Set Expression, but optimized for speed (less accurate) OptimizedSetExpressionEx Like Set Expression, but optimized for speed (less accurate) [Extended DType] OptimizedSolveExpression Like Solve Expression, but optimized for speed (less accurate) Prev Accesses the previous command in the parent Commands list. PutText Puts text into the indicated field of the command. PutTextEx Puts the specified text into the object data item [Extended DType] PutToolkitData Sets to value of the Toolkit data object ReDraw This method requests that the object be redrawn in the Edit window. Remove Removes a command from the Commands list. RemoveBundleInstance Removes the bundle instance of the command for the specified station index. Returns false if the station does not exist or there is no instance RemoveExpression Removes the expression from the indicated field of the command. RemoveExpressionEx Removes any existing expression from the indicated field of the command [Extended DType] SetBothArms Sets command to be executed by Both Arms, returns false if command is a two state command SetExpression Use this command to set expressions for different fields in a command. SetExpressionEx Sets the expression for the indicated field of the command [Extended DType] SetMasterArm Sets command to be executed by Master only. SetSlaveArm Sets command to be executed by Slave only, r eturns false if command cannot be slave owned SetToggleString This method lets you set a toggle field in a numerical, language-independent way. SetToggleStringEx Sets a toggle field to a numbered value in the toggle field list [Extended DType] SolveExpression SolveExpression evaluates the expression based on the objects above the command on which SolveExpression gets called. ToggleCommandType Toggles the command type. A new toggled command is returned UpdateDimensionNominals Updates the nominals of related dimensions.

_ID Acti**veTipComm**************************************a**nd** R**et**urns an ActiveTip object if Command is of Typ****************************************e* *S*E*T_ACTIVE_TIP. Not************************************************************************************************h**in**g **ot**herwise. Read-only. AlignmentCommand Returns this Command object as an Ali**gnCmnd ob**ject if it can, Nothing otherwise. Appl**ication Rep**resents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. For example, the ActivePar**tProgram pr**operty returns a PartProgram object. Arra**yIndexComm**and Returns an ArrayIndex object if Command is of Type ARRAY_INDEX. Returns Nothing otherwise. Read-only. Atta**chComm**and Returns an Attach object if Command is of Type ATTACH_PROGRAM. Returns Nothing otherwise. Read-only. Basi****cScanCo**mm**and Returns this Command object as a BasicSca**n obj**ect if it can, Nothing otherwise. Read-only. Only Command objects of type BASIC_SCAN_OBJECT can become BasicScan objects. BothArms Read Only: Property indicating whether the command belongs to the both arms CalibrationCommand Returns a Cali**bration obje**ct if Command is of Type CALIB_SPHERE. Otherwise it returns Nothing . Read-only. CommandGUIDString Each command in PC-DMIS has a unique idenification. This is the GUID (Globally Unique Identifier). This returns the identification as a string value. CommentCommand Returns a Com**ment obj**ect if Command is of Type SET_COMMENT. Otherwise it returns Nothing . Read-only. CopyMeasToNom Property used to indicate/set whether the object should execute in MASTER mode. After executing in MASTER mode, the object copies the measured vector, centroid, and other nominal information to the nominals and turns off MASTER mode. This copies the same information that gets calculated using the CalculateNominals method. Coun*t Rep*resents the number of copies of this Command which are available. If the measurement routine is currently being executed, it is the number of times it has been executed so far in the current execution cycle. If the measurement routine is not currently being executed, it is the number of times it was executed during the previous execution cycle. If Command has never been executed, Count has the value one. DataTypes Read Only: Returns the data type information collection for this command Dimen**sionCommand Retu**rns this Command object as a DimensionCommand object if it can, Nothing otherwise. Read-only. DimensionEndCommand Read Only: Returns the dimension end command object interface for the current command if it is a dimension end object DimFor**matComman**d Returns a DimFormat object if Command is of Type DIMENSION_FORMAT. Otherwise it returns Nothing . Read-only. DimIn**foComma**nd Returns a DimInfo object if Command is of Type DIMENSION_INFORMATION. Otherwise it returns Nothing . Read-only. DisplayID Read/Only: Current DisplayID of the command DisplayMetaFileCommand Returns a Dis**pMetaFile ob**ject if Command is of Type DISPLAY_METAFILE. Otherwise it returns Nothing . Read-only. ExpectsMiss Read/Write: Indicates whether script should plan for a miss error for this command ExternalCommand Returns an Ex**ternalCommand ob**ject if Command is of Type EXTERNAL_COMMAND. Otherwise it returns Nothing . Read-only. FCFCommand Read Only: Returns the FCF internal Profile Dimension if any Feature Represents the kind of feature that this Command object is. FeatureCommand Returns this Command object as a Fe**atCmd o**bject if it can, Nothing otherwise. Read-only. Fil**eIOCom**mand Returns a FileIO object if Command is of Type FILE_IO_OBJECT. Otherwise it returns Nothing . Read-only. FlowControlCommand Returns this Command object as an F****lowControlCmn**d **object if it can, Nothing otherwise. Read-only. The C**o**mmands** t**hat have the following Type can become FlowControlCmnd objects are as follows: LOOP_START START_SUBROUTINE CALL_SUBROUTINE LABEL GOTO IF_GOTO_COMMAND BASIC_SCRIPT ONERROR WHILE_COMMAND ENDWHILE_COMMAND IF_BLOCK_COMMAND END_IF_COMMAND IF_ELSE_COMMAND END_IF_ELSE_COMMAND, END_ELSE_COMMAND DO_COMMAND UNTIL_COMMAND CASE_COMMAND END_CASE_COMMAND DEFAULT_CASE_COMMAND END_DEFAULT_CASE_COMMAND SELECT_COMMAND END_SELECT_COMMAND GetDataTypeCount Returns the number of instances of the supplied data type in command GetDataTypeCountEx Returns the number of instances of the supplied data type in command [Extended DType] GetDataTypeCountUniqueIndex Returns the number of instances of the supplied data type in command at the specified type index GetDataTypeCountUniqueIndexEx Returns the number of instances of the supplied data type in command at the specified type index [Extended DType] GetFieldValue This read-only property returns the value of a field from a command. If you try to access a field that isn't supported by the command, PC-DMIS returns FALSE. This property takes two parameters, the first parameter defines the field item. You can select this item from an enumerated list or use the associated constant number. The second parameter specifies the TypeIndex . GetFieldValueEx Returns the value of the indicated field of the command [Extended DType] GetToggleValue This read-only property checks a command's field and returns 0 if it isn't a toggle field. It also returns 0 if the field doesn't exist. Otherwise, it returns a the current toggle index value, with 1 as the base index value. It takes two parameters. The first is an enumerated field type value to determine what field to check in a command, and the second is the TypeIndex . GetToggleValueEx Returns 0 if the field is not a toggle otherwise returns the toggle index [Extended DType] HasBreakpoint Determines whether or not the current PC-DMIS command has a breakpoint. HasField Checks is the the command has the indicated field. HasFieldEx Checks is the the command has the indicated field [Extended DType] ID Represents the ID of the command. IsActiveTip Determines whether or not the command is an ActiveTip command. IsAlignment Determines whether or not the command is an alignment command type. IsArrayIndex Determines whether or not the command is an ArrayIndex command. IsAttach Determines whether or not the command is an Attach command. IsBasicScan Determines whether or not the command is a basic scan command. IsCalibration Determines whether or not the command is a Calibration command. IsComment Determines whether or not the command is a Comment command. IsConstructedFeature Determines whether or not the command is a constructed feature. IsDCCFeature Determines whether or not the command is a DCC (Auto) Feature. IsDimension Determines whether or not the command is a Dimension command type. IsDimFormat Determines whether or not the command is a DimFormat command. IsDimInfo Determines whether or not the command is a DimInfo command. IsDisplayMetaFile Determines whether or not the command is a DispMetaFileCommand. IsExternalCommand Determines whether or not the command is an ExternalCommand. IsFCFCommand Read Only: Indicates whether the command is a FCF Command IsFeature Determines whether or not the command is a feature command type. IsFileIOCommand Determines whether or not the command is a FileIO command. IsFlowControl Determines whether or not the command is a flow control command type. IsHit Determines whether or not the command is one of the hit command types. IsLeapfrog Determines whether or not the command is a Leapfrog command. IsLoadMachine Determines whether or not the command is** a LoadMachi**ne command. **IsLoadPro**be Determines whether or not the command is a LoadProbe command. IsMeasuredFeature Determines whether or not the command is a Measured Feature command. IsModal Determines whether or not the command is a modal command type. IsMove Determines whether or not the command is a Move command. IsOptionProbe Determines whether or not the command is an option probe command. **IsOptMoti**on Determines whether or not the command is an OptMotion command. IsScan Determines whether or not the command is a Scan command. IsStatistic Determines whether or not the command is** a Statisti**cs command. **IsTempCo**mp Determines whether or not the command is a TempComp command. IsToolkitCommand Read Only: Indicates whether the command is a toolkit command IsTraceField Determines whether or not the command is **a TraceFiel**d command. ItemIndex Returns the execute instance index if the object has been executed more than once otherwise returns 0 LeapfrogCommand Returns **a LeapFr**og object if the Command is of Type LEAPFROG. Otherwise it returns Nothing . Read-only. LoadMachineCommand Returns a LoadMachine object if Command is of Type GET_MACHINE_DATA. Otherwise it returns Nothing . Read-only. LoadProbeCommand Returns a LoadProbe object if Command is of Type GET_PROBE_DATA. Otherwise it returns Nothing . Read-only. Marked Property used to indicate/set whether command is marked in the edit window. MasterArm Read Only: Property indicating whether the command belongs to the master arm only MissedHit This property checks whether or not a missed hit occurred on the last executed instance of the specified command****. ModalCom**ma**nd Returns a ModalCommand object for the Command if it can, Nothing otherwise. Read-only. MoveCommand Returns this Command object as a ModalCommand object if it can, Nothing otherwise. Read-only. OptionProbeCommand Returns **an OptPr**obe object if Command is of Type OPTIONPROBE. Otherwise it returns Nothing . Read-only. OptMotionCommand Returns an OptMotion object if Command is of Type OPTIONMOTION. Otherwise it returns Nothing . Read-only. Parent Returns the parent Commands collection object. Read-only. RecalculateINOUT Read/Write: Flag that determines if the INNER/OUTER flag is recalculated after execution ScanCommand Returns a Scan object if Command is of Type DCCSCAN_OBJECT or Type MANSCAN_OBJECT. Otherwise it returns Nothing . Read-only. ShowIDOnCad Property used to indicate/set whether the command ID should be displayed in the CAD window. Skipped Property used to indicate whether the a command was skipped over. SlaveArm Property used to indicate/set whether command is a slave arm object. SlotType SlotType: Property indicating whether a command is a slot of a certain type StatisticCommand Returns a Statistics object if Command is of Type STATISTICS. Otherwise it returns Nothing . Read-only. Strategies Read Only: Returns the Strategies collection if any otherwise it returns nothing TempCompCommand Returns a TempComp object if Command is of Type TEMP_COMP. Otherwise it returns Nothing . Read-only. ToolkitInternalCommands Read Only: Returns a collection of the toolkit internal commands ToolkitParentCommand This read-only property returns the ToolkitParent command object it it exists. If it doesn't, it returns null. TraceFieldCommand Returns a TraceField object if Command is of Type TRACEFIELD. Otherwise it returns Nothing . Read-only. TracksErrors Property used to determine whether or not the script will handle errors for the specified command. Type Returns the type of the Comma**nd** . TypeDescription Returns a human-readable description of Type of the object. For example, an object of type CONST_OFF_PLANE has the string "Constructed Offset Plane" returned by this function. UnexpectedHit This property checks whether or not an unexpected hit occurred on the last executed instance of the specified command. UserDefinedUniqueID Read/Write: Gets/Sets user defined unique id

| Command ObjectMembers |

| AddBundleInstance | Adds a bundle instance into the bundle alignment linked list for the specified station index. Returns false if the station number doesn't exist or the instance already exists |
| Compute | Performs mathematical evaluation of the command |
| CreateBundleFeatures | Creates bundled features. Returns false if the command is not a bundle alignment |
| Dialog | Opens the PC-DMIS dialog box for the corresponding command. |
| Dialog2 | Opens the PC-DMIS dialog box for the corresponding command. |
| EXECUTE | Executes the command if the command is immediately executable. |
| GetBundleInstance | Gets the bundle instance of the command for the specified station index.A NULL pointer is returned if there is no instance at that index |
| GetExpression | Gets the expression of the indicated field of the command. |
| GetExpressionEx | Gets the expression of the indicated field of the command [Extended DType] |
| GetText | Gets the text of the indicated field of the command. |
| GetTextEx | Returns the text used to represent a data item of the object [Extended DType] |
| GetToggleString | Returns the string of text of a toggle field. |
| GetToggleStringEx | Returns the toggle text delimited by the | symbol if the field is a toggle field, otherwise returns an empty string [Extended DType] |
| GetToolkitData | Returns the value of the Toolkit data object |
| GetUniqueID | This command retrieves the low and high parts of the 64-bit unique id of the command. |
| IsBundledCommand | Checks if command is a bundled command |
| IsExpressionValid | Determines whether or not an expression is valid. |
| Item | Returns the execute instance of the object if the object has been executed more than once |
| Mark | Marks the current object and all objects that depend on it. Optionally the features of the current alignment are also marked. |
| Next | Accesses the next command in the parentCommandslist. |
| OptimizedSetExpression | Like Set Expression, but optimized for speed (less accurate) |
| OptimizedSetExpressionEx | Like Set Expression, but optimized for speed (less accurate) [Extended DType] |
| OptimizedSolveExpression | Like Solve Expression, but optimized for speed (less accurate) |
| Prev | Accesses the previous command in the parentCommandslist. |
| PutText | Puts text into the indicated field of the command. |
| PutTextEx | Puts the specified text into the object data item [Extended DType] |
| PutToolkitData | Sets to value of the Toolkit data object |
| ReDraw | This method requests that the object be redrawn in the Edit window. |
| Remove | Removes a command from theCommandslist. |
| RemoveBundleInstance | Removes the bundle instance of the command for the specified station index. Returns false if the station does not exist or there is no instance |
| RemoveExpression | Removes the expression from the indicated field of the command. |
| RemoveExpressionEx | Removes any existing expression from the indicated field of the command [Extended DType] |
| SetBothArms | Sets command to be executed by Both Arms, returns false if command is a two state command |
| SetExpression | Use this command to set expressions for different fields in a command. |
| SetExpressionEx | Sets the expression for the indicated field of the command [Extended DType] |
| SetMasterArm | Sets command to be executed by Master only. |
| SetSlaveArm | Sets command to be executed by Slave only, r eturns false if command cannot be slave owned |
| SetToggleString | This method lets you set a toggle field in a numerical, language-independent way. |
| SetToggleStringEx | Sets a toggle field to a numbered value in the toggle field list [Extended DType] |
| SolveExpression | SolveExpression evaluates the expression based on the objects above the command on which SolveExpression gets called. |
| ToggleCommandType | Toggles the command type. A new toggled command is returned |
| UpdateDimensionNominals | Updates the nominals of related dimensions. |

| _ID | ActiveTipCommand | Returns anActiveTipobject if Command is ofTypeSET_ACTIVE_TIP.Nothingotherwise. Read-only. |
| AlignmentCommand | Returns thisCommandobject as anAlignCmndobject if it can,Nothingotherwise. |
| Application | Represents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects. For example, the ActivePartProgram property returns aPartProgramobject. |
| ArrayIndexCommand | Returns anArrayIndexobject if Command is ofTypeARRAY_INDEX. ReturnsNothingotherwise. Read-only. |
| AttachCommand | Returns anAttachobject if Command is ofTypeATTACH_PROGRAM. ReturnsNothingotherwise. Read-only. |
| BasicScanCommand | Returns thisCommandobject as aBasicScanobject if it can,Nothingotherwise. Read-only.OnlyCommandobjects of type BASIC_SCAN_OBJECT can becomeBasicScanobjects. |
| BothArms | Read Only:  Property indicating whether the command belongs to the both arms |
| CalibrationCommand | Returns aCalibrationobject if Command is ofTypeCALIB_SPHERE. Otherwise it returnsNothing. Read-only. |
| CommandGUIDString | Each command in PC-DMIS has a unique idenification. This is the GUID (Globally Unique Identifier). This returns the identification as a string value. |
| CommentCommand | Returns aCommentobject if Command is ofTypeSET_COMMENT. Otherwise it returnsNothing. Read-only. |
| CopyMeasToNom | Property used to indicate/set whether the object should execute in MASTER mode. After executing in MASTER mode, the object copies the measured vector, centroid, and other nominal information to the nominals and turns off MASTER mode. This copies the same information that gets calculated using the CalculateNominals method. |
| Count | Represents the number of copies of thisCommandwhich are available. If the measurement routine is currently being executed, it is the number of times it has been executed so far in the current execution cycle. If the measurement routine is not currently being executed, it is the number of times it was executed during the previous execution cycle. IfCommandhas never been executed,Counthas the value one. |
| DataTypes | Read Only:  Returns the data type information collection for this command |
| DimensionCommand | Returns thisCommandobject as aDimensionCommandobject if it can,Nothingotherwise. Read-only. |
| DimensionEndCommand | Read Only:  Returns the dimension end command object interface for the current command if it is a dimension end object |
| DimFormatCommand | Returns aDimFormatobject if Command is ofTypeDIMENSION_FORMAT. Otherwise it returnsNothing. Read-only. |
| DimInfoCommand | Returns aDimInfoobject if Command is ofTypeDIMENSION_INFORMATION. Otherwise it returnsNothing. Read-only. |
| DisplayID | Read/Only: Current DisplayID of the command |
| DisplayMetaFileCommand | Returns aDispMetaFileobject if Command is ofTypeDISPLAY_METAFILE. Otherwise it returnsNothing. Read-only. |
| ExpectsMiss | Read/Write: Indicates whether script should plan for a miss error for this command |
| ExternalCommand | Returns anExternalCommandobject if Command is ofTypeEXTERNAL_COMMAND. Otherwise it returnsNothing. Read-only. |
| FCFCommand | Read Only:  Returns the FCF internal Profile Dimension if any |
| Feature | Represents the kind of feature that thisCommandobject is. |
| FeatureCommand | Returns thisCommandobject as aFeatCmdobject if it can,Nothingotherwise. Read-only. |
| FileIOCommand | Returns aFileIOobject if Command is ofTypeFILE_IO_OBJECT. Otherwise it returnsNothing. Read-only. |
| FlowControlCommand | Returns thisCommandobject as anFlowControlCmndobject if it can,Nothingotherwise. Read-only.TheCommandsthat have the followingTypecan becomeFlowControlCmndobjects are as follows:LOOP_STARTSTART_SUBROUTINECALL_SUBROUTINELABELGOTOIF_GOTO_COMMANDBASIC_SCRIPTONERRORWHILE_COMMANDENDWHILE_COMMANDIF_BLOCK_COMMANDEND_IF_COMMANDIF_ELSE_COMMANDEND_IF_ELSE_COMMAND,END_ELSE_COMMANDDO_COMMANDUNTIL_COMMANDCASE_COMMANDEND_CASE_COMMANDDEFAULT_CASE_COMMANDEND_DEFAULT_CASE_COMMANDSELECT_COMMANDEND_SELECT_COMMAND |
| GetDataTypeCount | Returns the number of instances of the supplied data type in command |
| GetDataTypeCountEx | Returns the number of instances of the supplied data type in command [Extended DType] |
| GetDataTypeCountUniqueIndex | Returns the number of instances of the supplied data type in command at the specified type index |
| GetDataTypeCountUniqueIndexEx | Returns the number of instances of the supplied data type in command at the specified type index [Extended DType] |
| GetFieldValue | This read-only property returns the value of a field from a command.If you try to access a field that isn't supported by the command, PC-DMIS returns FALSE. This property takes two parameters, the first parameter defines the field item. You can select this item from an enumerated list or use the associated constant number. The second parameter specifies theTypeIndex. |
| GetFieldValueEx | Returns the value of the indicated field of the command [Extended DType] |
| GetToggleValue | This read-only property checks a command's field and returns 0 if it isn't a toggle field. It also returns 0 if the field doesn't exist. Otherwise, it returns a the current toggle index value, with 1 as the base index value.It takes two parameters. The first is an enumerated field type value to determine what field to check in a command, and the second is theTypeIndex. |
| GetToggleValueEx | Returns 0 if the field is not a toggle otherwise returns the toggle index [Extended DType] |
| HasBreakpoint | Determines whether or not the current PC-DMIS command has a breakpoint. |
| HasField | Checks is the the command has the indicated field. |
| HasFieldEx | Checks is the the command has the indicated field [Extended DType] |
| ID | Represents the ID of the command. |
| IsActiveTip | Determines whether or not the command is an ActiveTip command. |
| IsAlignment | Determines whether or not the command is an alignment command type. |
| IsArrayIndex | Determines whether or not the command is an ArrayIndex command. |
| IsAttach | Determines whether or not the command is an Attach command. |
| IsBasicScan | Determines whether or not the command is a basic scan command. |
| IsCalibration | Determines whether or not the command is a Calibration command. |
| IsComment | Determines whether or not the command is a Comment command. |
| IsConstructedFeature | Determines whether or not the command is a constructed feature. |
| IsDCCFeature | Determines whether or not the command is a DCC (Auto) Feature. |
| IsDimension | Determines whether or not the command is a Dimension command type. |
| IsDimFormat | Determines whether or not the command is a DimFormat command. |
| IsDimInfo | Determines whether or not the command is a DimInfo command. |
| IsDisplayMetaFile | Determines whether or not the command is a DispMetaFileCommand. |
| IsExternalCommand | Determines whether or not the command is an ExternalCommand. |
| IsFCFCommand | Read Only:  Indicates whether the command is a FCF Command |
| IsFeature | Determines whether or not the command is a feature command type. |
| IsFileIOCommand | Determines whether or not the command is a FileIO command. |
| IsFlowControl | Determines whether or not the command is a flow control command type. |
| IsHit | Determines whether or not the command is one of the hit command types. |
| IsLeapfrog | Determines whether or not the command is a Leapfrog command. |
| IsLoadMachine | Determines whether or not the command is a LoadMachine command. |
| IsLoadProbe | Determines whether or not the command is a LoadProbe command. |
| IsMeasuredFeature | Determines whether or not the command is a Measured Feature command. |
| IsModal | Determines whether or not the command is a modal command type. |
| IsMove | Determines whether or not the command is a Move command. |
| IsOptionProbe | Determines whether or not the command is an option probe command. |
| IsOptMotion | Determines whether or not the command is an OptMotion command. |
| IsScan | Determines whether or not the command is a Scan command. |
| IsStatistic | Determines whether or not the command is a Statistics command. |
| IsTempComp | Determines whether or not the command is a TempComp command. |
| IsToolkitCommand | Read Only:  Indicates whether the command is a toolkit command |
| IsTraceField | Determines whether or not the command is a TraceField command. |
| ItemIndex | Returns the execute instance index if the object has been executed more than once otherwise returns 0 |
| LeapfrogCommand | Returns aLeapFrogobject if the Command is ofTypeLEAPFROG. Otherwise it returnsNothing. Read-only. |
| LoadMachineCommand | Returns aLoadMachineobject if Command is ofTypeGET_MACHINE_DATA. Otherwise it returnsNothing. Read-only. |
| LoadProbeCommand | Returns aLoadProbeobject if Command is ofTypeGET_PROBE_DATA. Otherwise it returnsNothing. Read-only. |
| Marked | Property used to indicate/set whether command is marked in the edit window. |
| MasterArm | Read Only:  Property indicating whether the command belongs to the master arm only |
| MissedHit | This property checks whether or not a missed hit occurred on the last executed instance of the specified command. |
| ModalCommand | Returns aModalCommandobject for the Command if it can,Nothingotherwise. Read-only. |
| MoveCommand | Returns thisCommandobject as aModalCommandobject if it can,Nothingotherwise. Read-only. |
| OptionProbeCommand | Returns anOptProbeobject if Command is ofTypeOPTIONPROBE. Otherwise it returnsNothing. Read-only. |
| OptMotionCommand | Returns anOptMotionobject if Command is ofTypeOPTIONMOTION. Otherwise it returnsNothing. Read-only. |
| Parent | Returns the parentCommandscollection object. Read-only. |
| RecalculateINOUT | Read/Write:  Flag that determines if the INNER/OUTER flag is recalculated after execution |
| ScanCommand | Returns aScanobject if Command is ofTypeDCCSCAN_OBJECT orTypeMANSCAN_OBJECT. Otherwise it returnsNothing. Read-only. |
| ShowIDOnCad | Property used to indicate/set whether the command ID should be displayed in the CAD window. |
| Skipped | Property used to indicate whether the a command was skipped over. |
| SlaveArm | Property used to indicate/set whether command is a slave arm object. |
| SlotType | SlotType: Property indicating whether a command is a slot of a certain type |
| StatisticCommand | Returns aStatisticsobject if Command is ofTypeSTATISTICS. Otherwise it returnsNothing. Read-only. |
| Strategies | Read Only:  Returns the Strategies collection if any otherwise it returns nothing |
| TempCompCommand | Returns aTempCompobject if Command is ofTypeTEMP_COMP. Otherwise it returnsNothing. Read-only. |
| ToolkitInternalCommands | Read Only: Returns a collection of the toolkit internal commands |
| ToolkitParentCommand | This read-only property returns the ToolkitParent command object it it exists. If it doesn't, it returns null. |
| TraceFieldCommand | Returns aTraceFieldobject if Command is ofTypeTRACEFIELD. Otherwise it returnsNothing. Read-only. |
| TracksErrors | Property used to determine whether or not the script will handle errors for the specified command. |
| Type | Returns the type of theCommand. |
| TypeDescription | Returns a human-readable description ofTypeof the object. For example, an object of type CONST_OFF_PLANE has the string "Constructed Offset Plane" returned by this function. |
| UnexpectedHit | This property checks whether or not an unexpected hit occurred on the last executed instance of the specified command. |
| UserDefinedUniqueID | Read/Write: Gets/Sets user defined unique id |

### ActiveTipCommand

Returns an **ActiveTip** object if Command is of *Type* SET_ACTIVE_TIP. **Nothing** otherwise. Read-only.

### AddBundleInstance

Adds a bundle instance into the bundle alignment linked list for the specified station index. Returns false if the station number doesn't exist or the instance already exists

### AlignmentCommand

Returns thisC**ommando**bject as anAli**gnCmndobj**ect if it can,Nothi**ngother**wise.

### Application

Represents the read-only PC-DMIS application. The **Application** object includes properties and methods that return top-level objects. For example, the Active**PartProgram** property returns a PartProgram object.

### ArrayIndexCommand

Returns an **ArrayIndex** object if Command is of *Type* ARRAY_INDEX. Returns **Nothing** otherwise. Read-only.

### AttachCommand

Returns an **Attach** object if Command is of *Type* ATTACH_PROGRAM. Returns **Nothing** otherwise. Read-only.

### BasicScanCommand

Returns thisC**ommando**bject as aBas**icScanobj**ect if it can,Nothi**ngother**wise. Read-only.

### BothArms

Read Only: Property indicating whether the command belongs to the both arms

### CalibrationCommand

Returns a **Calibration **object if Command is of *Type* CALIB_SPHERE. Otherwise it returns **Nothing** . Read-only.

### CommandGUIDString

Each command in PC-DMIS has a unique idenification. This is the GUID (Globally Unique Identifier). This returns the identification as a string value.

### CommentCommand

Returns a **Comment **object if Command is of *Type* SET_COMMENT. Otherwise it returns **Nothing** . Read-only.

### Compute

Performs mathematical evaluation of the command

### CopyMeasToNom

Property used to indicate/set whether the object should execute in MASTER mode. After executing in MASTER mode, the object copies the measured vector, centroid, and other nominal information to the nominals and turns off MASTER mode. This copies the same information that gets calculated using the CalculateNominals method.

### Count

Represents the number of copies of thisC****omman**dw**hich are available. If the measurement routine is currently being executed, it is the number of times it has been executed so far in the current execution cycle. If the measurement routine is not currently being executed, it is the number of times it was executed during the previous execution cycle. IfCommandhas never been executed,Count*has t*he value one.

### CreateBundleFeatures

Creates bundled features. Returns false if the command is not a bundle alignment

### DataTypes

Read Only: Returns the data type information collection for this command

### Dialog

Opens the PC-DMIS dialog box for the corresponding command.

### Dialog2

Opens the PC-DMIS dialog box for the corresponding command.

### DimFormatCommand

Returns aD**imFormato**bject if Command is ofTyp*eDIM*ENSION_FORMAT. Otherwise it returnsNothi**ng. Rea**d-only.

### DimInfoCommand

Returns a **DimInfo** object if Command is of *Type* DIMENSION_INFORMATION. Otherwise it returns **Nothing** . Read-only.

### DimensionCommand

TheC**ommando**bjects that have the followingTyp*ecan* becomeDimen**sionCommandobjec**ts:

### DimensionEndCommand

Read Only: Returns the dimension end command object interface for the current command if it is a dimension end object

### DisplayID

Read/Only: Current DisplayID of the command

### DisplayMetaFileCommand

Returns a **DispMetaFile** object if Command is of *Type* DISPLAY_METAFILE. Otherwise it returns **Nothing** . Read-only.

### EXECUTE

Executes the command if the command is immediately executable.

### ExpectsMiss

Read/Write: Indicates whether script should plan for a miss error for this command

### ExternalCommand

Returns an **ExternalCommand **object if Command is of *Type* EXTERNAL_COMMAND. Otherwise it returns **Nothing** . Read-only.

### FCFCommand

Read Only: Returns the FCF internal Profile Dimension if any

### Feature

Read-only ENUM_FEATURE_TYPES. If it is not a feature it will return F_NONE. Otherwise it will return a value from the following list.

### FeatureCommand

Returns thisC**ommando**bject as aFea**tCmdobj**ect if it can,Nothi**ngother**wise. Read-only.

### FileIOCommand

Returns aF**ileIOo**bject if Command is ofTyp*eFIL*E_IO_OBJECT. Otherwise it returnsNothi**ng. Rea**d-only.

### FlowControlCommand

Returns thisC**ommando**bject as anFlo**wControlCmndobj**ect if it can,Nothi**ngother**wise. Read-only.

### GetBundleInstance

Gets the bundle instance of the command for the specified station index.A NULL pointer is returned if there is no instance at that index

### GetDataTypeCount

Sample hit measured A value.

### GetDataTypeCountEx

Sample hit measured A value.

### GetDataTypeCountUniqueIndex

Sample hit measured A value.

### GetDataTypeCountUniqueIndexEx

Sample hit measured A value.

### GetExpression

Sample hit measured A value.

### GetExpressionEx

Sample hit measured A value.

### GetFieldValue

This read-only property returns the value of a field from a command.

### GetFieldValueEx

Sample hit measured A value.

### GetText

Sample hit measured A value.

### GetTextEx

Sample hit measured A value.

### GetToggleString

Sample hit measured A value.

### GetToggleStringEx

Sample hit measured A value.

### GetToggleValue

This read-only property checks a command's field and returns 0 if it isn't a toggle field. It also returns 0 if the field doesn't exist. Otherwise, it returns a the current toggle index value, with 1 as the base index value.

### GetToggleValueEx

Sample hit measured A value.

### GetToolkitData

Returns the value of the Toolkit data object

### GetUniqueID

This command retrieves the low and high parts of the 64-bit unique id of the command.

### HasBreakpoint

Determines whether or not the current PC-DMIS command has a breakpoint.

### HasField

Sample hit measured A value.

### HasFieldEx

Sample hit measured A value.

### ID

Only objects that have ID strings can be set. If a object does not have a string, this property is the zero-length string "".

### IsActiveTip

Determines whether or not the command is an ActiveTip command.

### IsAlignment

Determines whether or not the command is an alignment command type.

### IsArrayIndex

Determines whether or not the command is an ArrayIndex command.

### IsAttach

Determines whether or not the command is an Attach command.

### IsBasicScan

Determines whether or not the command is a basic scan command.

### IsBundledCommand

Checks if command is a bundled command

### IsCalibration

Determines whether or not the command is a Calibration command.

### IsComment

Determines whether or not the command is a Comment command.

### IsConstructedFeature

Determines whether or not the command is a constructed feature.

### IsDCCFeature

Determines whether or not the command is a DCC (Auto) Feature.

### IsDimFormat

Determines whether or not the command is a DimFormat command.

### IsDimInfo

Determines whether or not the command is a DimInfo command.

### IsDimension

Determines whether or not the command is a Dimension command type.

### IsDisplayMetaFile

Determines whether or not the command is a DispMetaFileCommand.

### IsExpressionValid

Determines whether or not an expression is valid.

### IsExternalCommand

Determines whether or not the command is an ExternalCommand.

### IsFCFCommand

Read Only: Indicates whether the command is a FCF Command

### IsFeature

Determines whether or not the command is a feature command type.

### IsFileIOCommand

Determines whether or not the command is a FileIO command.

### IsFlowControl

Determines whether or not the command is a flow control command type.

### IsHit

Determines whether or not the command is one of the hit command types.

### IsLeapfrog

Determines whether or not the command is a Leapfrog command.

### IsLoadMachine

Determines whether or not the command is a LoadMachine command.

### IsLoadProbe

Determines whether or not the command is a LoadProbe command.

### IsMeasuredFeature

Determines whether or not the command is a Measured Feature command.

### IsModal

Determines whether or not the command is a modal command type.

### IsMove

Determines whether or not the command is a Move command.

### IsOptMotion

Determines whether or not the command is an OptMotion command.

### IsOptionProbe

Determines whether or not the command is an option probe command.

### IsScan

Determines whether or not the command is a Scan command.

### IsStatistic

Determines whether or not the command is a Statistics command.

### IsTempComp

Determines whether or not the command is a TempComp command.

### IsToolkitCommand

Read Only: Indicates whether the command is a toolkit command

### IsTraceField

Determines whether or not the command is a TraceField command.

### Item

Returns the execute instance of the object if the object has been executed more than once

### ItemIndex

Returns the execute instance index if the object has been executed more than once otherwise returns 0

### LeapfrogCommand

Returns a **LeapFrog** object if the Command is of *Type* LEAPFROG. Otherwise it returns **Nothing** . Read-only.

### LoadMachineCommand

Returns a **LoadMachine **object if Command is of *Type* GET_MACHINE_DATA. Otherwise it returns **Nothing** . Read-only.

### LoadProbeCommand

Returns a **LoadProbe** object if Command is of *Type* GET_PROBE_DATA. Otherwise it returns **Nothing** . Read-only.

### Mark

If the object is a measured feature, its hits are marked. If the object is a constructed feature, the features on which it depends are marked. If the object is a dimension, the dimension feature(s) being dimensioned are marked.

### Marked

Property used to indicate/set whether command is marked in the edit window.

### MasterArm

Read Only: Property indicating whether the command belongs to the master arm only

### MissedHit

This property checks whether or not a missed hit occurred on the last executed instance of the specified command.

### ModalCommand

Returns aM**odalCommando**bject for the Command if it can,Not**hingoth**erwise. Read-only.

### MoveCommand

Returns this **Command** object as a **ModalCommand** object if it can, **Nothing** otherwise. Read-only.

### Next

Accesses the next command in the parent **Commands** list.

### OptMotionCommand

Returns an **OptMotion** object if Command is of *Type* OPTIONMOTION. Otherwise it returns **Nothing** . Read-only.

### OptimizedSetExpression

Sample hit measured A value.

### OptimizedSetExpressionEx

Sample hit measured A value.

### OptimizedSolveExpression

Like Solve Expression, but optimized for speed (less accurate)

### OptionProbeCommand

Returns an **OptProbe** object if Command is of *Type* OPTIONPROBE. Otherwise it returns **Nothing** . Read-only.

### Parent

Returns the parentC**ommandsc**ollection object. Read-only.

### Prev

Accesses the previous command in the parent **Commands** list.

### PutText

Sample hit measured A value.

### PutTextEx

Sample hit measured A value.

### PutToolkitData

Sets to value of the Toolkit data object

### ReDraw

This method requests that the object be redrawn in the Edit window.

### RecalculateINOUT

Read/Write: Flag that determines if the INNER/OUTER flag is recalculated after execution

### Remove

Removes a command from the **Commands** list.

### RemoveBundleInstance

Removes the bundle instance of the command for the specified station index. Returns false if the station does not exist or there is no instance

### RemoveExpression

Sample hit measured A value.

### RemoveExpressionEx

Sample hit measured A value.

### ScanCommand

Returns a **Scan **object if Command is of **Typ*e* DCCSCAN_OBJECT or Type MANSCAN_OBJECT. Otherwise it returns **Nothing** . Read-only.

### SetBothArms

Sets command to be executed by Both Arms, returns false if command is a two state command

### SetExpression

Sample hit measured A value.

### SetExpressionEx

Sample hit measured A value.

### SetMasterArm

Sets command to be executed by Master only.

### SetSlaveArm

Sets command to be executed by Slave only, r eturns false if command cannot be slave owned

### SetToggleString

Sample hit measured A value.

### SetToggleStringEx

Sample hit measured A value.

### ShowIDOnCad

Property used to indicate/set whether the command ID should be displayed in the CAD window.

### Skipped

Property used to indicate whether the a command was skipped over.

### SlaveArm

Property used to indicate/set whether command is a slave arm object.

### SlotType

SlotType: Property indicating whether a command is a slot of a certain type

### SolveExpression

SolveExpression evaluates the expression based on the objects above the command on which SolveExpression gets called.

### StatisticCommand

Returns a **Statistics **object if Command is of *Type* STATISTICS. Otherwise it returns **Nothing** . Read-only.

### Strategies

Read Only: Returns the Strategies collection if any otherwise it returns nothing

### TempCompCommand

Returns a **TempComp** object if Command is of *Type* TEMP_COMP. Otherwise it returns **Nothing** . Read-only.

### ToggleCommandType

Toggles the command type. A new toggled command is returned

### ToolkitInternalCommands

Read Only: Returns a collection of the toolkit internal commands

### ToolkitParentCommand

This read-only property returns the ToolkitParent command object it it exists. If it doesn't, it returns null.

### TraceFieldCommand

Returns a **TraceField **object if Command is of *Type* TRACEFIELD. Otherwise it returns **Nothing** . Read-only.

### TracksErrors

Property used to determine whether or not the script will handle errors for the specified command.

### Type

Returns the type of the **Command** .****

### TypeDescription

Returns a human-readable description ofT*ypeo*f the object. For example, an object of type CONST_OFF_PLANE has the string "Constructed Offset Plane" returned by this function.

### UnexpectedHit

This property checks whether or not an unexpected hit occurred on the last executed instance of the specified command.

### UpdateDimensionNominals

Updates the nominals of related dimensions.

### UserDefinedUniqueID

Read/Write: Gets/Sets user defined unique id

### _ID

Visual Basic Public Property _ID As String

