# PC-DMIS Reference: Dialogs

## Comment

# Comment Object

# Description

# See Also

Comment Members

The **Comment** object gives access to the properties of the PC-DMIS Comment command.

| Comment Object |

# Comment Object Members

# Public Methods

# Public Properties

# See Also

STRING value representing the comment text. Since comments in PC-DMIS can be multi-line comments, this property represents the full text of all the lines. Each line is separated by ASCII character 13 and ASCII character 10 in that order. This is a read only property. To set individual lines of the comment use the SetLine method. To get individual lines of the comment use the GetLine method.

Returns the type of comment.

STRING value representing the ID of the comment. The ID is only used for comments of type INPUT and type YESNO.

STRING value representing the text input by the user for comments of type INPUT or YESNO.

Comment Object

AddLine Adds a line of text to the comment. GetLine Retrieves the line of text from the comment specified by the L*ine p*arameter. RemoveLine Removes a line of text from the comment. SetLine Sets the line of comment text.

Comment STRING value representing the comment text. Since comments in PC-DMIS can be multi-line comments, this property represents the full text of all the lines. Each line is separated by ASCII character 13 and ASCII character 10 in that order. This is a read only property. To set individual lines of the comment use the SetLine method. To get individual lines of the comment use the GetLine method. CommentType Returns the type of comment. ID STRING value representing the ID of the comment. The ID is only used for comments of type INPUT and type YESNO. Input STRING value representing the text input by the user for comments of type INPUT or YESNO.

| Comment ObjectMembers |

| AddLine | Adds a line of text to the comment. |
| GetLine | Retrieves the line of text from the comment specified by theLineparameter. |
| RemoveLine | Removes a line of text from the comment. |
| SetLine | Sets the line of comment text. |

| Comment | STRING value representing the comment text. Since comments in PC-DMIS can be multi-line comments, this property represents the full text of all the lines. Each line is separated by ASCII character 13 and ASCII character 10 in that order. This is a read only property. To set individual lines of the comment use the SetLine method. To get individual lines of the comment use the GetLine method. |
| CommentType | Returns the type of comment. |
| ID | STRING value representing the ID of the comment. The ID is only used for comments of type INPUT and type YESNO. |
| Input | STRING value representing the text input by the user for comments of type INPUT or YESNO. |

### AddLine

Adds a line of text to the comment.

### Comment

STRING value representing the comment text. Since comments in PC-DMIS can be multi-line comments, this property represents the full text of all the lines. Each line is separated by ASCII character 13 and ASCII character 10 in that order. This is a read only property. To set individual lines of the comment use the SetLine method. To get individual lines of the comment use the GetLine method.

### CommentType

Returns the type of comment.

### GetLine

Retrieves the line of text from the comment specified by the *Line *parameter.

### ID

STRING value representing the ID of the comment. The ID is only used for comments of type INPUT and type YESNO.

### Input

STRING value representing the text input by the user for comments of type INPUT or YESNO.

### RemoveLine

Removes a line of text from the comment.

### SetLine

Sets the line of comment text.


---

## CommentInputDialog

# CommentInputDialog Object

# Description

# Object Model

# See Also

CommentInputDialog Members

This objects lets you work with the **Input Comment** dialog box that appears during execution when PC-DMIS executes a COMMENT/INPUT command.

| CommentInputDialog Object |

# CommentInputDialog Object Members

# Public Methods

# Public Properties

# See Also

This method sets the Z position of theI**nput Commentd**ialog box based on the parameter's value.

When you have multiple dialog boxes, the Z position controls the order in which the item appears.

CommentInputDialog Object

BringToZPosition This method sets the Z position of the I**nput Comment **dialog box based on the parameter's value. When you have multiple dialog boxes, the Z position controls the order in which the item appears. PressCa**ncelBu**tton This method button clicks the Cancel button on the I********nput Com**m**ent** **dialog box. PressOK**Bu**tton This method button clicks the OK button on the Input Comment dialog box. SetInputText This method fills in the Input Comment dialog box with this text.

Application Read Only: Returns the Application Object Caption This read-only property returns the In********put Comm**en**t** d**ialog box's caption (title on titlebar). IsClosed This read-only property determines if the Input Comment dialog box has closed or not. IsReady This read-only property determines whether or not the Input Comment dialog box has been properly created and is ready. Message This read-only value returns the message text. This is the text that the operator reads when the Input Comment dialog box first opens. This is not the input text. Parent Read Only: Returns the parent PartProgram object (if any)

| CommentInputDialog ObjectMembers |

| BringToZPosition | This method sets the Z position of theInput Commentdialog box based on the parameter's value.When you have multiple dialog boxes, the Z position controls the order in which the item appears. |
| PressCancelButton | This method button clicks theCancelbutton on theInput Commentdialog box. |
| PressOKButton | This method button clicks theOKbutton on theInput Commentdialog box. |
| SetInputText | This method fills in theInput Commentdialog box with this text. |

| Application | Read Only:  Returns the Application Object |
| Caption | This read-only property returns theInput Commentdialog box's caption (title on titlebar). |
| IsClosed | This read-only property determines if theInput Commentdialog box has closed or not. |
| IsReady | This read-only property determines whether or not theInput Commentdialog box has been properly created and is ready. |
| Message | This read-only value returns the message text. This is the text that the operator reads when theInput Commentdialog box first opens. This is not the input text. |
| Parent | Read Only:  Returns the parent PartProgram object (if any) |

### Application

CommentInputDialog Object|CommentInputDialog Members

### BringToZPosition

This method sets the Z position of theI**nput Commentd**ialog box based on the parameter's value.

### Caption

CommentInputDialog Object|CommentInputDialog Members

### IsClosed

CommentInputDialog Object|CommentInputDialog Members

### IsReady

CommentInputDialog Object|CommentInputDialog Members

### Message

CommentInputDialog Object|CommentInputDialog Members

### Parent

CommentInputDialog Object|CommentInputDialog Members

### PressCancelButton

CommentInputDialog Object|CommentInputDialog Members

### PressOKButton

CommentInputDialog Object|CommentInputDialog Members

### SetInputText

CommentInputDialog Object|CommentInputDialog Members


---

## DispMetaFile

# DispMetaFile Object

# Description

# See Also

DispMetaFile Members

The **DispMetaFile** object gives access to the comment properties of the PC-DMIS Display Metafile command.

| DispMetaFile Object |

# DispMetaFile Object Members

# Public Properties

# See Also

Gets or sets the value representing the comment to be used as a caption for the metafile object.

DispMetaFile Object

Comment Gets or sets the value representing the comment to be used as a caption for the metafile object.

| DispMetaFile ObjectMembers |

| Comment | Gets or sets the value representing the comment to be used as a caption for the metafile object. |

### Comment

Gets or sets the value representing the comment to be used as a caption for the metafile object.


---

## DmisDialog

# DmisDialog Object

# Description

# Remarks

# See Also

TheD**misDialogo**bject represents a PC-DMIS modeless dialog box. You can use it to work with most PC-DMIS dialog boxes. This object wraps the PC-DMIS dialog box and implements the IDialog interface.

AD**misDialogo**bject can be obtained from theDialog2method of theCommandobject.

DmisDialog Members

The **DmisDialog** object represents a PC-DMIS modeless dialog box. You can use it to work with most PC-DMIS dialog boxes. This object wraps the PC-DMIS dialog box and implements the IDialog interface.

A **DmisDialog** object can be obtained from the Dialog2 method of the Command object.

| DmisDialog Object |

# DmisDialog Object Members

# Public Methods

# Public Properties

# See Also

This read-only property determines whether or not the dialog box was properly created and is ready.

DmisDialog Object

BringToZPosition This method sets the Z position of the message box based on the parameter's value. When you have multiple message boxes, the Z position controls the order in which the item appears. clickItem This method marks an item (check box or radio button) on the dialog box. CloseDialog This method clicks the **Cancel** button to close an open dialog box. getItemCheck This method returns the checked status for an item (check box or radio button) on the dialog box. getItemIntValue This method returns the integer value stored in a field on the dialog box. GetItemStringValue Get string value of a control of the dialog isControlEnabled This method checks if a control is enabled on the dialog box IsControlPresent Check status of a control of the dialog SetItemFocus This method gives focus to a control on a dialog box. setItemIntValue This method sets a field to a specific integer value. SetItemStringValue Set string value to a control of the dialog. Returns the ENUM_PRESS_BUTTON_RESULTS status SetItemValue This method sets a field to a specific double value.

Caption This read-only property returns the dialog box's caption (title on titlebar) Handle The property returns the dialog box handle if the dialog box is available. ID This read-only property returns the dialog box's ID if it's available. IsReady This read-only property determines whether or not the dialog box was properly created and is ready. Type This read-only value returns the type of dialog box. Visible Indicates whether or not the dialog is still visible to the user.

| DmisDialog ObjectMembers |

| BringToZPosition | This method sets the Z position of the message box based on the parameter's value.When you have multiple message boxes, the Z position controls the order in which the item appears. |
| clickItem | This method marks an item (check box or radio button) on the dialog box. |
| CloseDialog | This method clicks theCancelbutton to close an open dialog box. |
| getItemCheck | This method returns the checked status for an item (check box or radio button) on the dialog box. |
| getItemIntValue | This method returns the integer value stored in a field on the dialog box. |
| GetItemStringValue | Get string value of a control of the dialog |
| isControlEnabled | This method checks if a control is enabled on the dialog box |
| IsControlPresent | Check status of a control of the dialog |
| SetItemFocus | This method gives focus to a control on a dialog box. |
| setItemIntValue | This method sets a field to a specific integer value. |
| SetItemStringValue | Set string value to a control of the dialog. Returns the ENUM_PRESS_BUTTON_RESULTS status |
| SetItemValue | This method sets a field to a specific double value. |

| Caption | This read-only property returns the dialog box's caption (title on titlebar) |
| Handle | The property returns the dialog box handle if the dialog box is available. |
| ID | This read-only property returns the dialog box's ID if it's available. |
| IsReady | This read-only property determines whether or not the dialog box was properly created and is ready. |
| Type | This read-only value returns the type of dialog box. |
| Visible | Indicates whether or not the dialog is still visible to the user. |

### BringToZPosition

This method sets the Z position of the message box based on the parameter's value. When you have multiple message boxes, the Z position controls the order in which the item appears.

### Caption

This read-only property returns the dialog box's caption (title on titlebar)

### CloseDialog

Long value that determines if the dialog box is saved when it cancels.

### GetItemStringValue

Get string value of a control of the dialog

### Handle

The property returns the dialog box handle if the dialog box is available.

### ID

This read-only property returns the dialog box's ID if it's available.

### IsControlPresent

Check status of a control of the dialog

### IsReady

This read-only property determines whether or not the dialog box was properly created and is ready.

### SetItemFocus

This method gives focus to a control on a dialog box.

### SetItemStringValue

Set string value to a control of the dialog. Returns the ENUM_PRESS_BUTTON_RESULTS status

### SetItemValue

This method sets a field to a specific double value.

### Type

This read-only value returns the type of dialog box.

### Visible

Indicates whether or not the dialog is still visible to the user.

### clickItem

This method marks an item (check box or radio button) on the dialog box.

### getItemCheck

This method returns the checked status for an item (check box or radio button) on the dialog box.

### getItemIntValue

This method returns the integer value stored in a field on the dialog box.

### isControlEnabled

True means the control is enabled.

### setItemIntValue

This method sets a field to a specific integer value.


---

## PCDMessageBox

# PCDMessageBox Object

# Description

# Object Model

# See Also

PCDMessageBox Members

This object lets you work with PC-DMIS message boxes.

| PCDMessageBox Object |

# PCDMessageBox Object Members

# Public Methods

# Public Properties

# See Also

This method sets the Z position of the message box based on the parameter's value.

When you have multiple message boxes, the Z position controls the order in which the item appears.

PCDMessageBox Object

BringToZPosition This method sets the Z position of the message box based on the parameter's value. When you have multiple message boxes, the Z position controls the order in which the item appears. HasButton This method indicates if the button that you define by the passed in parameter is present on the message box. PressButton This method clicks the specified button. PressShutDownButton This method presses the C**ancel **button on a message box.

Application Read Only: Returns the Application Object Caption This read-only property returns the message box's caption (title on titlebar). HasShutDownButton This read only property checks to see if the message box is an error message with a shut down button. IsClosed This read-only property determines if the message box has closed or not. IsReady This read-only property determines whether or not the message box has been properly created and is ready. Message This read-only property gets the message box text as a string. Parent This returns the parent PartProgram object.

| PCDMessageBox ObjectMembers |

| BringToZPosition | This method sets the Z position of the message box based on the parameter's value.When you have multiple message boxes, the Z position controls the order in which the item appears. |
| HasButton | This method indicates if the button that you define by the passed in parameter is present on the message box. |
| PressButton | This method clicks the specified button. |
| PressShutDownButton | This method presses theCancelbutton on a message box. |

| Application | Read Only:  Returns the Application Object |
| Caption | This read-only property returns the message box's caption (title on titlebar). |
| HasShutDownButton | This read only property checks to see if the message box is an error message with a shut down button. |
| IsClosed | This read-only property determines if the message box has closed or not. |
| IsReady | This read-only property determines whether or not the message box has been properly created and is ready. |
| Message | This read-only property gets the message box text as a string. |
| Parent | This returns the parent PartProgram object. |

### Application

Read Only: Returns the Application Object

### BringToZPosition

This method sets the Z position of the message box based on the parameter's value.

### Caption

This read-only property returns the message box's caption (title on titlebar).

### HasButton

This method indicates if the button that you define by the passed in parameter is present on the message box.

### HasShutDownButton

This read only property checks to see if the message box is an error message with a shut down button.

### IsClosed

This read-only property determines if the message box has closed or not.

### IsReady

This read-only property determines whether or not the message box has been properly created and is ready.

### Message

This read-only property gets the message box text as a string.

### Parent

This returns the parent PartProgram object.

### PressButton

This method clicks the specified button.

### PressShutDownButton

This method presses the **Cancel** button on a message box.


---

## PropertySheetDialog

# PropertySheetDialog Object

# Description

# Remarks

# See Also

PropertySheetDialog Members

This object lets you work with property sheets dialog boxes in PC-DMIS.

Currrently, there is only one property sheet dialog box that launches the Open/Close automation event. This is the **Output Configuration** dialog box (** File | Printing | Report Window Setu**p ).

| PropertySheetDialog Object |

# PropertySheetDialog Object Members

# Public Methods

# Public Properties

# See Also

This method sets the Z position of the property sheet based on the parameter's value.

When you have multiple property sheets open, the Z position controls the order in which the item appears.

PropertySheetDialog Object

BringToZPosition This method sets the Z position of the property sheet based on the parameter's value. When you have multiple property sheets open, the Z position controls the order in which the item appears.

Caption This read-only property returns the property sheet's caption (title on titlebar). Handle The property returns the property sheet handle if the property sheet is available. ID This read-only property returns the property sheet ID if it's available. IsReady This read-only property determines whether or not the property sheet has been properly created and is ready. Type This returns the type of property sheet. Visible This read-only property indicates whether or not the property sheet is visible.

| PropertySheetDialog ObjectMembers |

| BringToZPosition | This method sets the Z position of the property sheet based on the parameter's value.When you have multiple property sheets open, the Z position controls the order in which the item appears. |

| Caption | This read-only property returns the property sheet's caption (title on titlebar). |
| Handle | The property returns the property sheet handle if the property sheet is available. |
| ID | This read-only property returns the property sheet ID if it's available. |
| IsReady | This read-only property determines whether or not the property sheet has been properly created and is ready. |
| Type | This returns the type of property sheet. |
| Visible | This read-only property indicates whether or not the property sheet is visible. |

### BringToZPosition

This method sets the Z position of the property sheet based on the parameter's value.

### Caption

PropertySheetDialog Object|PropertySheetDialog Members

### Handle

PropertySheetDialog Object|PropertySheetDialog Members

### ID

PropertySheetDialog Object|PropertySheetDialog Members

### IsReady

PropertySheetDialog Object|PropertySheetDialog Members

### Type

PropertySheetDialog Object|PropertySheetDialog Members

### Visible

PropertySheetDialog Object|PropertySheetDialog Members

