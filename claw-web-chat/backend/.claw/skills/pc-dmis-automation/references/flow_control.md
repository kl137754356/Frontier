# PC-DMIS Reference: Flow Control

## ArrayIndex

# ArrayIndex Object

# Description

# See Also

ArrayIndex Members

The **ArrayIndex **object is used to set up multi-dimensional feature arrays in PC-DMIS. Methods are provided to add, remove, or edit array upper and lower bounds for array indices.

| ArrayIndex Object |

# ArrayIndex Object Members

# Public Methods

# See Also

Adds the supplied index set to the array index command.

Retrieves the lower bound of the specified index set.

Retrieves the lower bound of the specified index set.

Removes the index set specified by index from the array index object.

Sets the lower bound of the specified index set.

ArrayIndex Object

AddIndexSet Adds the supplied index set to the array index command. GetLowerBound Retrieves the lower bound of the specified index set. GetUpperBound Retrieves the lower bound of the specified index set. RemoveIndexSet Removes the index set specified by index from the array index object. SetLowerBound Sets the lower bound of the specified index set. SetUpperBound Sets the upper bound of the specified index set.

| ArrayIndex ObjectMembers |

| AddIndexSet | Adds the supplied index set to the array index command. |
| GetLowerBound | Retrieves the lower bound of the specified index set. |
| GetUpperBound | Retrieves the lower bound of the specified index set. |
| RemoveIndexSet | Removes the index set specified by index from the array index object. |
| SetLowerBound | Sets the lower bound of the specified index set. |
| SetUpperBound | Sets the upper bound of the specified index set. |

### AddIndexSet

Adds the supplied index set to the array index command.

### GetLowerBound

Retrieves the lower bound of the specified index set.

### GetUpperBound

Retrieves the lower bound of the specified index set.

### RemoveIndexSet

Removes the index set specified by index from the array index object.

### SetLowerBound

Sets the lower bound of the specified index set.

### SetUpperBound

Sets the upper bound of the specified index set.


---

## DataType

# DataType Object

# Description

# Object Model

# See Also

DataType Members

The **DataType** object allows you to return objects of information about a particular data type or field.

| DataType Object |

# DataType Object Members

# Public Properties

# See Also

This returns the number of instances of this data type in command.

This returns a description of the data type.

This returns the field type of the data type.

This returns the Default Property for a Field Type Number.

DataType Object

_Value Application Returns the PC-DMIS App**lication obj**ect. Count This returns the number of instances of this data type in command. DBType Read Only: Returns the db field type of the this data type DESCRIPTION This returns a description of the data type. Parent This returns the Parent Command Object. Read only. Type This returns the field type of the data type. Value This returns the Default Property for a Field Type Number. VariableType Read Only: Returns the data type of the this data type

| DataType ObjectMembers |

| _Value | Application | Returns the PC-DMISApplicationobject. |
| Count | This returns the number of instances of this data type in command. |
| DBType | Read Only:  Returns the db field type of the this data type |
| DESCRIPTION | This returns a description of the data type. |
| Parent | This returns the Parent Command Object. Read only. |
| Type | This returns the field type of the data type. |
| Value | This returns the Default Property for a Field Type Number. |
| VariableType | Read Only:  Returns the data type of the this data type |

### Application

Returns the PC-DMIS **Application **object.

### Count

This returns the number of instances of this data type in command.

### DBType

Read Only: Returns the db field type of the this data type

### DESCRIPTION

This returns a description of the data type.

### Parent

This returns the Parent Command Object. Read only.

### Type

This returns the field type of the data type.

### Value

This returns the Default Property for a Field Type Number.

### VariableType

Read Only: Returns the data type of the this data type

### _Value

Visual Basic Public Property _Value As Long


---

## DataTypes

# DataTypes Object

# Description

# Object Model

# See Also

DataTypes Members

The **DataTypes** object allows you to return objects of varying data types.

| DataTypes Object |

# DataTypes Object Members

# Public Methods

# Public Properties

# See Also

DataTypes Object

_Item GetDataTypeInfo Returns the specified data type information object if supported by the data type collection. Item This returns the data type information object specified by the Num* va*lue from the data type collection.

Ap**plication T**his returns the Application object. Read only. Count This returns the number of data type information objects in the data type collection. Parent This returns the Parent C**ommand **object. Read only.

| DataTypes ObjectMembers |

| _Item | GetDataTypeInfo | Returns the specified data type information object if supported by the data type collection. |
| Item | This returns the data type information object specified by theNumvalue from the data type collection. |

| Application | This returns theApplicationobject. Read only. |
| Count | This returns the number of data type information objects in the data type collection. |
| Parent | This returns the ParentCommandobject. Read only. |

### Application

This returns the **Application** object. Read only.

### Count

This returns the number of data type information objects in the data type collection.

### GetDataTypeInfo

Sample hit measured A value.

### Item

This returns the data type information object specified by the *Num* value from the data type collection.

### Parent

This returns the Parent **Command** object. Read only.

### _Item

Visual Basic Public Function _Item( _ ByVal Id*entifier A*s Long _ ) As DataType


---

## FileIO

# FileIO Object

# Description

# Remarks

# See Also

TheF**ileIOo**bject is used to access the PC-DMIS File I/O object.

This object's properties provide access to the file mode (open, close, readline, and so on), the expression to write or read, the filename, and so forth.

**For additional information, see the "Using File Input / Output"sectionin thePC-DMIS Help File.

FileIO Members

The **FileIO** object is used to access the PC-DMIS File I/O object.

**This object's properties provide access to the file mode (open, close, readline, and so on), the expression to write or read, the filename, and so forth. For additional information, see the "Using File Input / Output" section in the PC-DMIS Help File .

| FileIO Object |

# FileIO Object Members

# Public Properties

# See Also

Represents the file name to be used in the File I/O operation. This parameter is used with the File Open, File Copy, File Move, File Delete, and File Exists File I/O types.

FileIO Object

BufferSize Indicates the buffer size used with the Read Block File I/O command. Expression Indicates the buffer size used with the Read Block File I/O command. FailIfExists Indicates whether or not a file copy operation should fail or not if the destination file already exists. FileIOType Value of ENUM_FILE_IO_TYPES enumeration type which specifies the type of File I/O operation the object will perform. FileName1 Represents the file name to be used in the File I/O operation. This parameter is used with the File Open, File Copy, File Move, File Delete, and File Exists File I/O types. FileName2 Represents the second filename to be used in the File I/O operation. This parameter is used as the destination file in the File Copy and File Move File I/O commands. FileOpenType Value of ENUM_FILE_OPEN_TYPES enumeration type which specifies the file open mode used in opening a file. FilePointerID Represents the file pointer Id to be used in the File I/O operation. The file pointer ID is established and linked to a specific file in the File Open command. VariableID Represents the name of the variable to be used to hold the results of the File I/O operation of the File I/O command.

| FileIO ObjectMembers |

| BufferSize | Indicates the buffer size used with the Read Block File I/O command. |
| Expression | Indicates the buffer size used with the Read Block File I/O command. |
| FailIfExists | Indicates whether or not a file copy operation should fail or not if the destination file already exists. |
| FileIOType | Value of ENUM_FILE_IO_TYPES enumeration type which specifies the type of File I/O operation the object will perform. |
| FileName1 | Represents the file name to be used in the File I/O operation. This parameter is used with the File Open, File Copy, File Move, File Delete, and File Exists File I/O types. |
| FileName2 | Represents the second filename to be used in the File I/O operation. This parameter is used as the destination file in the File Copy and File Move File I/O commands. |
| FileOpenType | Value of ENUM_FILE_OPEN_TYPES enumeration type which specifies the file open mode used in opening a file. |
| FilePointerID | Represents the file pointer Id to be used in the File I/O operation. The file pointer ID is established and linked to a specific file in the File Open command. |
| VariableID | Represents the name of the variable to be used to hold the results of the File I/O operation of the File I/O command. |

### BufferSize

Indicates the buffer size used with the Read Block File I/O command.

### Expression

Indicates the buffer size used with the Read Block File I/O command.

### FailIfExists

Indicates whether or not a file copy operation should fail or not if the destination file already exists.

### FileIOType

Value of ENUM_FILE_IO_TYPES enumeration type which specifies the type of File I/O operation the object will perform. Possible values include the following:

### FileName1

Represents the file name to be used in the File I/O operation. This parameter is used with the File Open, File Copy, File Move, File Delete, and File Exists File I/O types.

### FileName2

Represents the second filename to be used in the File I/O operation. This parameter is used as the destination file in the File Copy and File Move File I/O commands.

### FileOpenType

Read/writeE**num_File_Open_Typesen**umeration.

### FilePointerID

Represents the file pointer Id to be used in the File I/O operation. The file pointer ID is established and linked to a specific file in the File Open command.

### VariableID

Represents the name of the variable to be used to hold the results of the File I/O operation of the File I/O command.


---

## FlowControlCmd

# FlowControlCmd Object

# Description

# See Also

FlowControlCmd Members

**FlowControlCmd** objects are created from more generic **Command** objects to pass information specific to the flow control command back and forth.

| FlowControlCmd Object |

# FlowControlCmd Object Members

# Public Methods

# Public Properties

# See Also

Adds a number to be skipped to an object of type LOOP_START. For objects of other types, it does nothing.

This function returns TRUE ifN*umberw*as successfully added to the LOOP_START object’s skip list, FALSE otherwise.

This function returns TRUE if the expression can be used as a valid left hand value (i.e. can be used on the left-hand side of an assignment statement), and FALSE otherwise.

This function returns TRUE if the expression can be used as a valid subroutine argument name, and FALSE otherwise.

This function removes an argument from an object of type CALL_SUBROUTINE or START_SUBROUTINE. It returns TRUE if an argument is removed successfully, FALSE otherwise.

FlowControlCmd Object

AddArgument Adds or replaces an argument in objects of type CALL_SUBROUTINE and START_SUBROUTINE. When used with objects of other types, it has no effect. AddSkipNum Adds a number to be skipped to an object of type LOOP_START. For objects of other types, it does nothing. This function returns TRUE if N*umber *was successfully added to the LOOP_START object’s skip list, FALSE otherwise. GetArgumentDescription Returns the description of an argument to an object of type START_SUBROUTINE. For objects of other types, it returns the empty string. GetArgumentEx*pression R*eturns the value or default value of an argument to an object of type CALL_SUBROUTINE or START_SUBROUTINE, respectively. For objects of other types, it returns the empty string. GetArgumentName Returns the name of an argument to an object of type START_SUBROUTINE. For objects of other types, it returns the empty string. GetLeftSideOfExpression For FlowControlCmd objects of type ASSIGNMENT, this function returns the name of the variable being assigned to. For other types of objects, it returns an empty string. GetRightSideOfExpression For FlowControlCmd objects of type ASSIGNMENT, this function returns the value being assigned to the variable. For other types of objects, it returns an empty string. GetSkipNum This function returns an integer. The integer is the nth skip number where n is indicated by the value of index. IsExpressionValid Tests whether or not the Expression is valid. IsValidLeftHandValue This function returns TRUE if the expression can be used as a valid left hand value (i.e. can be used on the left-hand side of an assignment statement), and FALSE otherwise. IsValidSubroutineArgumentName This function returns TRUE if the expression can be used as a valid subroutine argument name, and FALSE otherwise. RemoveArgument This function removes an argument from an object of type CALL_SUBROUTINE or START_SUBROUTINE. It returns TRUE if an argument is removed successfully, FALSE otherwise. RemoveSkipNum This function removes one of the skip numbers for the Loop Start object from the list of skip numbers. The number removed is determined by the index parameter. SetArgumentDescription This function sets the description of an argument of an object of type START_SUBROUTINE. It does nothing and returns FALSE if the object is not of this type. The function returns TRUE if the description was set successfully, FALSE otherwise. SetArgumentExpression This function sets the value or default value of an argument of an object of type CALL_SUBROUTINE or START_SUBROUTINE, respectively. It does nothing and returns FALSE if the object is not one of these types. SetArgumentName This function sets the name of an argument of an object of type START_SUBROUTINE. It does nothing and returns FALSE if the object is not of this type. SetLeftSideOfAssignment The function sets the left-hand side of the Assign statement to the expression passed in. Use the function IsValidLeftHandValue to determine validity of expression for a left-hand side before using this function. SetRightSideOfAssignment The function sets the right-hand side of the Assign statement to the expression passed in. Use the function IsExpressionValid to determine validity of expression before using this function.

AngleOffset Represents the angular offset of a LOOP_START object. EndNum Read/Write: Loop Ending Number ErrorMode Represents the error mode of a ONERROR object. ErrorType Represents the error mode of a ONERROR object. Expression Represents the test expression of an IF_COMMAND object. FileName Represents the file name of an external subroutine in a CALL_SUBROUTINE object. ID Represents the id of a CALL_SUBROUTINE object. Label Represents the label associated with an object. NumArguments Returns the number of arguments in a START_SUBROUTINE or CALL_SUBROUTINE object. ReportAutoPrint Returns True if you have Hyper Report's Au**to Print c**heckbox selected. False otherwise. SkipCount Returns the number of skipped numbers in a LOOP_START object. StartNum Represents the start number of a LOOP_START object. SubName Represents the subroutine name of a START_SUBROUTINE and CALL_SUBROUTINE object. XAxisOffset Represents the X-axis offset of a LOOP_START object. YAxisOffset Represents the Y-axis offset of a LOOP_START object. ZAxisOffset Represents the Z-axis offset of a LOOP_START object.

| FlowControlCmd ObjectMembers |

| AddArgument | Adds or replaces an argument in objects of type CALL_SUBROUTINE and START_SUBROUTINE. When used with objects of other types, it has no effect. |
| AddSkipNum | Adds a number to be skipped to an object of type LOOP_START. For objects of other types, it does nothing.This function returns TRUE ifNumberwas successfully added to the LOOP_START object’s skip list, FALSE otherwise. |
| GetArgumentDescription | Returns the description of an argument to an object of type START_SUBROUTINE. For objects of other types, it returns the empty string. |
| GetArgumentExpression | Returns the value or default value of an argument to an object of type CALL_SUBROUTINE or START_SUBROUTINE, respectively. For objects of other types, it returns the empty string. |
| GetArgumentName | Returns the name of an argument to an object of type START_SUBROUTINE. For objects of other types, it returns the empty string. |
| GetLeftSideOfExpression | For FlowControlCmd objects of type ASSIGNMENT, this function returns the name of the variable being assigned to. For other types of objects, it returns an empty string. |
| GetRightSideOfExpression | For FlowControlCmd objects of type ASSIGNMENT, this function returns the value being assigned to the variable. For other types of objects, it returns an empty string. |
| GetSkipNum | This function returns an integer. The integer is the nth skip number where n is indicated by the value of index. |
| IsExpressionValid | Tests whether or not theExpressionis valid. |
| IsValidLeftHandValue | This function returns TRUE if the expression can be used as a valid left hand value (i.e. can be used on the left-hand side of an assignment statement), and FALSE otherwise. |
| IsValidSubroutineArgumentName | This function returns TRUE if the expression can be used as a valid subroutine argument name, and FALSE otherwise. |
| RemoveArgument | This function removes an argument from an object of type CALL_SUBROUTINE or START_SUBROUTINE. It returns TRUE if an argument is removed successfully, FALSE otherwise. |
| RemoveSkipNum | This function removes one of the skip numbers for the Loop Start object from the list of skip numbers. The number removed is determined by the index parameter. |
| SetArgumentDescription | This function sets the description of an argument of an object of type START_SUBROUTINE. It does nothing and returns FALSE if the object is not of this type. The function returns TRUE if the description was set successfully, FALSE otherwise. |
| SetArgumentExpression | This function sets the value or default value of an argument of an object of type CALL_SUBROUTINE or START_SUBROUTINE, respectively. It does nothing and returns FALSE if the object is not one of these types. |
| SetArgumentName | This function sets the name of an argument of an object of type START_SUBROUTINE. It does nothing and returns FALSE if the object is not of this type. |
| SetLeftSideOfAssignment | The function sets the left-hand side of the Assign statement to the expression passed in. Use the function IsValidLeftHandValue to determine validity of expression for a left-hand side before using this function. |
| SetRightSideOfAssignment | The function sets the right-hand side of the Assign statement to the expression passed in. Use the function IsExpressionValid to determine validity of expression before using this function. |

| AngleOffset | Represents the angular offset of a LOOP_START object. |
| EndNum | Read/Write:  Loop Ending Number |
| ErrorMode | Represents the error mode of a ONERROR object. |
| ErrorType | Represents the error mode of a ONERROR object. |
| Expression | Represents the test expression of an IF_COMMAND object. |
| FileName | Represents the file name of an external subroutine in a CALL_SUBROUTINE object. |
| ID | Represents the id of a CALL_SUBROUTINE object. |
| Label | Represents the label associated with an object. |
| NumArguments | Returns the number of arguments in a START_SUBROUTINE or CALL_SUBROUTINE object. |
| ReportAutoPrint | Returns True if you have Hyper Report'sAuto Printcheckbox selected. False otherwise. |
| SkipCount | Returns the number of skipped numbers in a LOOP_START object. |
| StartNum | Represents the start number of a LOOP_START object. |
| SubName | Represents the subroutine name of a START_SUBROUTINE and CALL_SUBROUTINE object. |
| XAxisOffset | Represents the X-axis offset of a LOOP_START object. |
| YAxisOffset | Represents the Y-axis offset of a LOOP_START object. |
| ZAxisOffset | Represents the Z-axis offset of a LOOP_START object. |

### AddArgument

When used with objects of type CALL_SUBROUTINE, theN*amea*ndDes*criptionfie*lds are ignored.

### AddSkipNum

Adds a number to be skipped to an object of type LOOP_START. For objects of other types, it does nothing.

### AngleOffset

FlowControlCmd Object|FlowControlCmd Members|Type Property

### EndNum

FlowControlCmd Object|FlowControlCmd Members

### ErrorMode

This property only affects objects of type ONERROR. For other objects, setting the property has no effect, and getting it always returns zero.

### ErrorType

This property only affects objects of type ONERROR. For other objects, setting the property has no effect, and getting it always returns zero.

### Expression

FlowControlCmd Object|FlowControlCmd Members|Type Property

### FileName

This property only affects objects of type CALL_SUBROUTINE. For other objects, setting the property has no effect, and getting it always returns the empty string.

### GetArgumentDescription

FlowControlCmd Object|FlowControlCmd Members|Type Property

### GetArgumentExpression

FlowControlCmd Object|FlowControlCmd Members|Type Property

### GetArgumentName

FlowControlCmd Object|FlowControlCmd Members|Type Property

### GetLeftSideOfExpression

FlowControlCmd Object|FlowControlCmd Members|Type Property

### GetRightSideOfExpression

FlowControlCmd Object|FlowControlCmd Members|Type Property

### GetSkipNum

FlowControlCmd Object|FlowControlCmd Members|Type Property

### ID

FlowControlCmd Object|FlowControlCmd Members|Type Property

### IsExpressionValid

FlowControlCmd Object|FlowControlCmd Members|Type Property

### IsValidLeftHandValue

This function returns TRUE if the expression can be used as a valid left hand value (i.e. can be used on the left-hand side of an assignment statement), and FALSE otherwise.

### IsValidSubroutineArgumentName

This function returns TRUE if the expression can be used as a valid subroutine argument name, and FALSE otherwise.

### Label

This property only affects objects of type GOTO, IF_COMMAND, ONERROR, and LABEL. For other objects, setting the property has no effect, and getting it always returns the empty string.

### NumArguments

FlowControlCmd Object|FlowControlCmd Members|Type Property

### RemoveArgument

This function removes an argument from an object of type CALL_SUBROUTINE or START_SUBROUTINE. It returns TRUE if an argument is removed successfully, FALSE otherwise.

### RemoveSkipNum

FlowControlCmd Object|FlowControlCmd Members|SkipCount Property

### ReportAutoPrint

FlowControlCmd Object|FlowControlCmd Members|Type Property

### SetArgumentDescription

FlowControlCmd Object|FlowControlCmd Members

### SetArgumentExpression

FlowControlCmd Object|FlowControlCmd Members|Type Property

### SetArgumentName

FlowControlCmd Object|FlowControlCmd Members|Type Property

### SetLeftSideOfAssignment

FlowControlCmd Object|FlowControlCmd Members|Type Property

### SetRightSideOfAssignment

FlowControlCmd Object|FlowControlCmd Members|Type Property

### SkipCount

FlowControlCmd Object|FlowControlCmd Members|Type Property

### StartNum

FlowControlCmd Object|FlowControlCmd Members|Type Property

### SubName

This property only affects objects of type START_SUBROUTINE and CALL_SUBROUTINE. For other objects, setting the property has no effect, and getting it always returns the empty string.

### XAxisOffset

FlowControlCmd Object|FlowControlCmd Members|Type Property

### YAxisOffset

FlowControlCmd Object|FlowControlCmd Members|Type Property

### ZAxisOffset

FlowControlCmd Object|FlowControlCmd Members|Type Property


---

## StringArray

# StringArray Object

# Description

# See Also

StringArray Members

This object holds an array of strings. It is created with the GetStringArray method.

| StringArray Object |

# StringArray Object Members

# Public Methods

# See Also

StringArray Object

GetSize This method queries an array of strings and returns the size of the array (the number of items contained in the array). GetValue This method returns the value of one of the items contained in the string array. SetSize This method sets the size (the number of items) of a string array. SetValue This method assigns a string value to one of the items in the array.

| StringArray ObjectMembers |

| GetSize | This method queries an array of strings and returns the size of the array (the number of items contained in the array). |
| GetValue | This method returns the value of one of the items contained in the string array. |
| SetSize | This method sets the size (the number of items) of a string array. |
| SetValue | This method assigns a string value to one of the items in the array. |

### GetSize

This method queries an array of strings and returns the size of the array (the number of items contained in the array).

### GetValue

This method returns the value of one of the items contained in the string array.

### SetSize

This method sets the size (the number of items) of a string array.

### SetValue

This method assigns a string value to one of the items in the array.


---

## Variable

# Variable Object

# Description

# Object Model

# Remarks

# See Also

The properties of the Variable Object allows you to return and set a variable's:

The methods of this object return an array's:

Variable Members

PC-Dmis Variable Object

The properties of the Variable Object allows you to return and set a variable's: Type Long value Double value String value Point value Command value The methods of this object return an array's: Upper bound if variable is an array Lower bound if variable is an array Gets the array variable at a specific position Sets the array variable at a specified position

| Variable Object |

- Type
- Long value
- Double value
- String value
- Point value
- Command value

- Upper bound if variable is an array
- Lower bound if variable is an array
- Gets the array variable at a specific position
- Sets the array variable at a specified position

# Variable Object Members

# Public Methods

# Public Properties

# See Also

This returns / sets the command value of the variable.

This returns / sets the double value of the variable.

This returns / sets the long value of the variable.

This returns / sets the point value of the variable.

This returns / sets the string value of the variable.

This returns / sets the current variable type.

Variable Object

GetArrayIndexValue This returns the array variable at the specified index position. GetArrayLowerBound This returns the lower bound if the variable is an array. Otherwise it returns zero. GetArrayUpperBound This returns the upper bound if the variable is an array. Otherwise it returns zero. SetArrayIndexValue This sets the array variable at the specified index position.

CommandValue This returns / sets the command value of the variable. DoubleValue This returns / sets the double value of the variable. LongValue This returns / sets the long value of the variable. PointValue This returns / sets the point value of the variable. StringValue This returns / sets the string value of the variable. VariableType This returns / sets the current variable type.

| Variable ObjectMembers |

| GetArrayIndexValue | This returns the array variable at the specified index position. |
| GetArrayLowerBound | This returns the lower bound if the variable is an array. Otherwise it returns zero. |
| GetArrayUpperBound | This returns the upper bound if the variable is an array. Otherwise it returns zero. |
| SetArrayIndexValue | This sets the array variable at the specified index position. |

| CommandValue | This returns / sets the command value of the variable. |
| DoubleValue | This returns / sets the double value of the variable. |
| LongValue | This returns / sets the long value of the variable. |
| PointValue | This returns / sets the point value of the variable. |
| StringValue | This returns / sets the string value of the variable. |
| VariableType | This returns / sets the current variable type. |

### CommandValue

This returns / sets the command value of the variable.

### DoubleValue

This returns / sets the double value of the variable.

### GetArrayIndexValue

This returns the array variable at the specified index position.

### GetArrayLowerBound

This returns the lower bound if the variable is an array. Otherwise it returns zero.

### GetArrayUpperBound

This returns the upper bound if the variable is an array. Otherwise it returns zero.

### LongValue

This returns / sets the long value of the variable.

### PointValue

This returns / sets the point value of the variable.

### SetArrayIndexValue

This sets the array variable at the specified index position.

### StringValue

This returns / sets the string value of the variable.

### VariableType

This returns / sets the current variable type.


---

## VariableArray

# VariableArray Object

# See Also

VariableArray Members

| VariableArray Object |

# VariableArray Object Members

# Public Methods

# See Also

VariableArray Object

GetSize GetValue SetSize SetValue

| VariableArray ObjectMembers |

| GetSize | GetValue | SetSize | SetValue

### GetSize

Visual Basic Public Function GetSize() As Long

### GetValue

Visual Basic Public Function GetValue( _ ByVal Ar*rayPosition A*s Long _ ) As Double

### SetSize

Visual Basic Public Sub SetSize( _ ByVal Ne*wSize A*s Long _ )

### SetValue

Visual Basic Public Sub SetValue( _ ByVal Ar*rayPosition A*s Long, _ ByVal NewVa*lue As D*ouble _ )

