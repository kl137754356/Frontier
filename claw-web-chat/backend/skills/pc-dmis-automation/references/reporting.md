# PC-DMIS Reference: Reporting

## LabelControls

# LabelControls Object

# Description

# Object Model

# See Also

LabelControls Members

The LabelControls object gives you access to a variety of controls such as buttons, text boxes, and other items that you can add to, remove, and otherwise manipulate on a label template.

| LabelControls Object |

# LabelControls Object Members

# Public Methods

# Public Properties

# See Also

This deletes the specified control from the current label template.

This property returns this object's parent object, theL**abelTemplateo**bject.

LabelControls Object

_Item Add The Add function creates a new Label template in PC-DMIS. Item This method returns an Object of the control identified by the name or number in the Nam*eOrNum pa*rameter. Remove This deletes the specified control from the current label template.

Ap**plication T**his property returns the PC-DMIS Application object. Count This property counts all the controls in the current label template and returns it as a Long value. Parent This property returns this object's parent object, the L**abelTemplate **object.

| LabelControls ObjectMembers |

| _Item | Add | The Add function creates a new Label template in PC-DMIS. |
| Item | This method returns an Object of the control identified by the name or number in theNameOrNumparameter. |
| Remove | This deletes the specified control from the current label template. |

| Application | This property returns the PC-DMISApplicationobject. |
| Count | This property counts all the controls in the current label template and returns it as aLongvalue. |
| Parent | This property returns this object's parent object, theLabelTemplateobject. |

### Add

The Add method inserts a new control of a defined location and size into the current label template. To find out what properties are available to a control, in PC-DMIS's Label Template editor, insert the control and then access its properties sheet.

### Application

This property returns the PC-DMIS **Application** object.

### Count

This property counts all the controls in the current label template and returns it as a Long value.

### Item

This method returns an Object of the control identified by the name or number in theN*ameOrNump*arameter.

### Parent

This property returns this object's parent object, theL**abelTemplateo**bject.

### Remove

This deletes the specified control from the current label template.

### _Item

Visual Basic Public Function _Item( _ ByVal Na*meOrNumber A*s Variant _ ) As Object


---

## LabelTemplate

# LabelTemplate Object

# Description

# Object Model

# See Also

LabelTemplate Members

The LabelTemplate object allows you to get or set various settings for a label template.

| LabelTemplate Object |

# LabelTemplate Object Members

# Public Methods

# Public Properties

# See Also

This method saves the label template.

LabelTemplate Object

Close This subroutine closes the label template. To first save any unsaved changes, use the Save method. Save This subroutine saves the label template with its already existing name. If the template has n<u>ot </u>been saved before use the SaveAs method instead, and specify a filename. SaveAs This method saves the label template.

_Name Appl**ication Thi**s property represents the read-only PC-DMIS App**lication obj**ect. The Application object includes properties and methods that return top-level objects. FullName This property returns a read-only string of the full path and filename of the label template. LabelControls This property returns a read-only Lab**elControls obj**ect for this label template. Name This property returns a read-only string of the label template's filename. Parent This property returns the label template's parent object, which is the read-only Lab**elTemplates obj**ect. Visible This returns or sets the visibility status of the Label Template editor. If True then it is visible, if False then it is hidden.

| LabelTemplate ObjectMembers |

| Close | This subroutine closes the label template. To first save any unsaved changes, use the Save method. |
| Save | This subroutine saves the label template with its already existing name. If the template hasnotbeen saved before use the SaveAs method instead, and specify a filename. |
| SaveAs | This method saves the label template. |

| _Name | Application | This property represents the read-only PC-DMISApplicationobject. TheApplicationobject includes properties and methods that return top-level objects. |
| FullName | This property returns a read-only string of the full path and filename of the label template. |
| LabelControls | This property returns a read-onlyLabelControlsobject for this label template. |
| Name | This property returns a read-only string of the label template's filename. |
| Parent | This property returns the label template's parent object, which is the read-onlyLabelTemplatesobject. |
| Visible | This returns or sets the visibility status of the Label Template editor. If True then it is visible, if False then it is hidden. |

### Application

This property represents the read-only PC-DMIS ****Applicatio**n** object. The Application object includes properties and methods that return top-level objects.

### Close

This subroutine closes the label template. To first save any unsaved changes, use the Save method.

### FullName

This property returns a read-only string of the full path and filename of the label template.

### LabelControls

This property returns a read-only **LabelControls **object for this label template.

### Name

This property returns a read-only string of the label template's filename.

### Parent

This property returns the label template's parent object, which is the read-only **LabelTemplates **object.

### Save

This subroutine saves the label template with its already existing name. If the template has <u>not</u> been saved before use the SaveAs method instead, and specify a filename.

### SaveAs

This method saves the label template.

### Visible

This returns or sets the visibility status of the Label Template editor. If True then it is visible, if False then it is hidden.

### _Name

Visual Basic Public Property _Name As String


---

## LabelTemplates

# LabelTemplates Object

# Description

# Object Model

# Remarks

# Example

# See Also

TheLabelTemplatesobject contains all open label templates in PC-DMIS's Label Template editor.

Use Add.Label to create a new label template and add it to the LabelTemplates collection.

Use LabelTemplates(**inde*x*) whereindexis the label template name or index number to access an individual label template.

LabelTemplates Members

The LabelTemplates object contains all open label templates in PC-DMIS's Label Template editor.

Use Add.Label to create a new label template and add it to the LabelTemplates collection. Use LabelTemplates(** ind*e*x ) where index is the label template name or index number to access an individual label template.

| LabelTemplates Object |

# LabelTemplates Object Members

# Public Methods

# Public Properties

# See Also

The Open Function activates the Label template stored in the fileF*ileName.* If the template file does not exist, nothing happens.

This returns the read-only PC-DMISA**pplicationo**bject which is the parent object of theLabelTemplatesobject.

See the "Automation Objects Hierarchy Charts" for more information.

LabelTemplates Object

_Item Add The Add function creates a new Label template in PC-DMIS. Item Item function returns the LabelTemplate Object with the given name or number. Open The Open Function activates the Label template stored in the file Fil*eName . *If the template file does not exist, nothing happens.

Ap****plication** T**his property represents the read-only PC-DMIS A**pplication o**bject. The Application object includes properties and methods that return top-level objects. Count This property returns a read-only number of open label templates. Parent This returns the read-only PC-DMIS Application object which is the parent object of the LabelTemplates object. See the "Automation Objects Hierarchy Charts" for more information.

| LabelTemplates ObjectMembers |

| _Item | Add | The Add function creates a new Label template in PC-DMIS. |
| Item | Item function returns the LabelTemplate Object with the given name or number. |
| Open | The Open Function activates the Label template stored in the fileFileName. If the template file does not exist, nothing happens. |

| Application | This property represents the read-only PC-DMISApplicationobject. TheApplicationobject includes properties and methods that return top-level objects. |
| Count | This property returns a read-only number of open label templates. |
| Parent | This returns the read-only PC-DMISApplicationobject which is the parent object of theLabelTemplatesobject.See the "Automation Objects Hierarchy Charts" for more information. |

### Add

Sub Label_Template_Creation()

### Application

LabelTemplates Object|LabelTemplates Members

### Count

LabelTemplates Object|LabelTemplates Members

### Item

LabelTemplates Object|LabelTemplates Members

### Open

The Open Function activates the Label template stored in the fileF*ileName.* If the template file does not exist, nothing happens.

### Parent

This returns the read-only PC-DMISA**pplicationo**bject which is the parent object of theLabelTemplatesobject.

### _Item

LabelTemplates Object|LabelTemplates Members


---

## Page

# Page Object

# Description

# Object Model

# Example

# See Also

Sub Main

' This example loads a report template and then writes properties of each page to

' a text file in the same directory that contains this script.

' Modify the pathway and filename used for the LoadReportTemplate statement.

Dim App As Object

Dim PartProg As Object

Dim RepWin As Object

Dim Pages As Object

Dim Page As Object

Dim ReportControls As Object

Set App = CreateObject("Pcdlrn.Application")

Set PartProg = App.ActivePartProgram

Set RepWin = PartProg.ReportWindow

Set Pages = RepWin.Pages

RepWin.LoadReportTemplate "C:\PCDMIS43RC2\REPORTING\TEXTONLY.RTP"

RepWin.RefreshReport

Dim i,intWidth,intHeight As Integer

i = 1

Open "page_properties.txt" For Append As #1 ' This creates the file if it doesn't exist.

Write #1, "----- Page Results for " & RepWin.CurrentReport & " on " & Date() & " at " & Time() & " -----"

While i <= Pages.Count

Write #1, "==Page #" & i &" =="

If Pages.Item(i).LandScape <> 0 Then

Write #1, "Page is landscape"

Else

Write #1, "Page is not landscape"

End If

intWidth = Pages.Item(i).Width

intHeight = Pages.Item(i).Height

Write #1,"Page height is " & intHeight

Write #1,"Page width is " & intWidth

Write #1,"Page is in section: " & Pages.Item(i).Section

Write #1,"Page is custom: " & Pages.Item(i).Custom

Write #1,"Page is duplicated: " & Pages.Item(i).Duplicated

Write #1,"Page has this number of controls: " & Pages.Item(i).ReportControls.Count

i = i + 1

Wend

Close #1

End Sub

Page Members

This object contains information about a specific page in the Report window.

Sub Main ' This example loads a report template and then writes properties of each page to ' a text file in the same directory that contains this script. ' Modify the pathway and filename used for the LoadReportTemplate statement. Dim App As Object Dim PartProg As Object Dim RepWin As Object Dim Pages As Object Dim Page As Object Dim ReportControls As Object Set App = CreateObject("Pcdlrn.Application") Set PartProg = App.ActivePartProgram Set RepWin = PartProg.ReportWindow Set Pages = RepWin.Pages RepWin.LoadReportTemplate "C:\PCDMIS43RC2\REPORTING\TEXTONLY.RTP" RepWin.RefreshReport Dim i,intWidth,intHeight As Integer i = 1 Open "page_properties.txt" For Append As #1 ' This creates the file if it doesn't exist. Write #1, "----- Page Results for " & RepWin.CurrentReport & " on " & Date() & " at " & Time() & " -----" While i <= Pages.Count Write #1, "==Page #" & i &" ==" If Pages.Item(i).LandScape <> 0 Then Write #1, "Page is landscape" Else Write #1, "Page is not landscape" End If intWidth = Pages.Item(i).Width intHeight = Pages.Item(i).Height Write #1,"Page height is " & intHeight Write #1,"Page width is " & intWidth Write #1,"Page is in section: " & Pages.Item(i).Section Write #1,"Page is custom: " & Pages.Item(i).Custom Write #1,"Page is duplicated: " & Pages.Item(i).Duplicated Write #1,"Page has this number of controls: " & Pages.Item(i).ReportControls.Count i = i + 1 Wend Close #1 End Sub

| Page Object |

# Page Object Members

# Public Properties

# See Also

Page Object

_Number Application Read Only: returns the Application Object Bottom Read Only: returns the page bottom edge Custom This read-only property determines whether or not the Pag**e ob**ject is from a Custom Report or not. Duplicated This read-only property determines whether or not the page is the original page or a duplicate page. Height This property returns the number of pixels making up the height of a page. LandScape This read-only property returns the page's orientation. Left Read Only: returns the page left edge Number This read-only property returns this page's page number. PageNumber Read Only: returns the page number Parent Returns the parent Pag**es ob**ject. Repo**rtControls Thi**s returns the ReportControls object for the page. Right Read Only: returns the page right edge Section This read-only property returns the section index number that the page lies within. Top Read Only: returns the page top edge Width This property returns the number of pixels making up the width of a page.

| Page ObjectMembers |

| _Number | Application | Read Only: returns the Application Object |
| Bottom | Read Only: returns the page bottom edge |
| Custom | This read-only property determines whether or not thePageobject is from a Custom Report or not. |
| Duplicated | This read-only property determines whether or not the page is the original page or a duplicate page. |
| Height | This property returns the number of pixels making up the height of a page. |
| LandScape | This read-only property returns the page's orientation. |
| Left | Read Only: returns the page left edge |
| Number | This read-only property returns this page's page number. |
| PageNumber | Read Only: returns the page number |
| Parent | Returns the parentPagesobject. |
| ReportControls | This returns theReportControlsobject for the page. |
| Right | Read Only: returns the page right edge |
| Section | This read-only property returns the section index number that the page lies within. |
| Top | Read Only: returns the page top edge |
| Width | This property returns the number of pixels making up the width of a page. |

### Application

Read Only: returns the Application Object

### Bottom

Read Only: returns the page bottom edge

### Custom

Read-onlyL**ongv**alue. This returns -1 (or True) if it is a Custom Report and 0 (or False) if it is not.

### Duplicated

This read-only property determines whether or not the page is the original page or a duplicate page.

### Height

This property returns the number of pixels making up the height of a page.

### LandScape

This read-only property returns the page's orientation.

### Left

Read Only: returns the page left edge

### Number

This read-only property returns this page's page number.

### PageNumber

Read Only: returns the page number

### Parent

Returns the parent **Pages** object.

### ReportControls

This returns the **ReportControls** object for the page.

### Right

Read Only: returns the page right edge

### Section

This read-only property returns the section index number that the page lies within.

### Top

Read Only: returns the page top edge

### Width

This property returns the number of pixels making up the width of a page.

### _Number

Visual Basic Public Property _Number As Long


---

## Pages

# Pages Object

# Description

# Object Model

# Remarks

# See Also

Pages Members

This object contains a collection of the **Page** objects that appear in the Report window.

You can use **Page**s.Item to return a specific Page object.

| Pages Object |

# Pages Object Members

# Public Methods

# Public Properties

# See Also

Pages Object

_Item Item Returns a specific Pag**e ob**ject from the number of Pag**es in** the Report window.

Application Read Only: Returns the Application Object Count Read Only: Returns the number pages Parent Read Only: Returns the ReportWindow Parent Object

| Pages ObjectMembers |

| _Item | Item | Returns a specificPageobject from the number ofPagesin the Report window. |

| Application | Read Only:  Returns the Application Object |
| Count | Read Only:  Returns the number pages |
| Parent | Read Only:  Returns the ReportWindow Parent Object |

### Application

Read Only: Returns the Application Object

### Count

Read Only: Returns the number pages

### Item

Returns a specific **Page** object from the number of **Pages** in the Report window.

### Parent

Read Only: Returns the ReportWindow Parent Object

### _Item

Visual Basic Public Function _Item( _ ByVal Nu*m A*s Long _ ) As Page


---

## ReportControl

# ReportControl Object

# Description

# Object Model

# See Also

ReportControl Members

This lets you get or set properties for a specific Reporting object.

| ReportControl Object |

# ReportControl Object Members

# Public Methods

# Public Properties

# See Also

This read-only property returns theR**eportControlo**bject as anAna**lysisWindowobj**ect if it can orNothi**ngif it** can't.

This read-only property returns 1 if the currentR**eportControli**s anAna**lysisWindowobj**ect or 0 if it is not an Analysis object.

This read-only property returns 1 if the currentRe**portControlis** a label proxy object.

This read-only property returns 1 if the currentRe**portControlis** a Leader Line object or 0 if not.

This returns 1 if the leader line is visible. Setting this property to 0 means that the leader line is not drawn.

ReportControl Object

FlipCROView Flips the Cad Reporting Object either horizontally or vertically FlipCROViewByAxis Flips the CAD Reporting Object view along the axis passed.

An****alysisWindow** T**his read-only property returns the Rep********ortCont**ro**l **ob**ject as an AnalysisWindow object if it can or Not**hing if** it can't. Application Read Only: Returns the Application Object Bottom Read/Write: Returns/Sets Bottom boundary of Object window CADReferenceName Read/Write: Returns/Sets the associates cad reference name Command Read Only: Returns the underlying associated command when available CROGraphicsOptions This applies to the CADReportObject. It determines whether or not labels are displayed on the CRO control. A value of 1 means the labels are displayed. A value of 0 means they are hidden. The default is 0. Height Read/Write: Returns/Sets the height of the object ID Read Only: Returns the Name of the Object IsAnalysisWindow This read-only property returns 1 if the current ReportControl is an AnalysisWindow object or 0 if it is not an Analysis object. IsLabel This read-only property returns 1 if the current ReportControl is a label proxy object. IsLeaderLine This read-only property returns 1 if the current ReportControl is a Leader Line object or 0 if not. LabelTemplateName Read/Write: Returns/Sets the associates label template name LeaderLineVisible This returns 1 if the leader line is visible. Setting this property to 0 means that the leader line is not drawn. Left Read/Write: Returns/Sets Left boundary of Object window Offset Read/Write: Returns/Sets via point data object the Offset location of the CAD Reporting Control Parent Read Only: Returns the parent Object Right Read/Write: Returns/Sets Right boundary of Object window Rotation Read/Write: Returns/Sets via dmis matrix the transformations/rotation on the CAD Report Control ScaleFactor A value of 1.00 = 100%. Selected Read/Write: Returns/Sets selection state of the object Top Read/Write: Returns/Sets Top boundary of Object window Type Read Only: Returns the object type Visible Read/Write: Returns/Sets visible state of the object Width Read/Write: Returns/Sets the width of the object

| ReportControl ObjectMembers |

| FlipCROView | Flips the Cad Reporting Object either horizontally or vertically |
| FlipCROViewByAxis | Flips the CAD Reporting Object view along the axis passed. |

| AnalysisWindow | This read-only property returns theReportControlobject as anAnalysisWindowobject if it can orNothingif it can't. |
| Application | Read Only:  Returns the Application Object |
| Bottom | Read/Write:  Returns/Sets Bottom boundary of Object window |
| CADReferenceName | Read/Write: Returns/Sets the associates cad reference name |
| Command | Read Only: Returns the underlying associated command when available |
| CROGraphicsOptions | This applies to the CADReportObject. It determines whether or not labels are displayed on the CRO control. A value of 1 means the labels are displayed. A value of 0 means they are hidden. The default is 0. |
| Height | Read/Write: Returns/Sets the height of the object |
| ID | Read Only:  Returns the Name of the Object |
| IsAnalysisWindow | This read-only property returns 1 if the currentReportControlis anAnalysisWindowobject or 0 if it is not an Analysis object. |
| IsLabel | This read-only property returns 1 if the currentReportControlis a label proxy object. |
| IsLeaderLine | This read-only property returns 1 if the currentReportControlis a Leader Line object or 0 if not. |
| LabelTemplateName | Read/Write: Returns/Sets the associates label template name |
| LeaderLineVisible | This returns 1 if the leader line is visible. Setting this property to 0 means that the leader line is not drawn. |
| Left | Read/Write:  Returns/Sets Left boundary of Object window |
| Offset | Read/Write:  Returns/Sets via point data object the Offset location of the CAD Reporting Control |
| Parent | Read Only:  Returns the parent Object |
| Right | Read/Write:  Returns/Sets Right boundary of Object window |
| Rotation | Read/Write:  Returns/Sets via dmis matrix the transformations/rotation on the CAD Report Control |
| ScaleFactor | A value of 1.00 = 100%. |
| Selected | Read/Write: Returns/Sets selection state of the object |
| Top | Read/Write:  Returns/Sets Top boundary of Object window |
| Type | Read Only: Returns the object type |
| Visible | Read/Write: Returns/Sets visible state of the object |
| Width | Read/Write: Returns/Sets the width of the object |

### AnalysisWindow

This read-only property returns theR**eportControlo**bject as anAna**lysisWindowobj**ect if it can orNothi**ngif it** can't.

### Application

Read Only: Returns the Application Object

### Bottom

Read/Write: Returns/Sets Bottom boundary of Object window

### CADReferenceName

Read/Write: Returns/Sets the associates cad reference name

### CROGraphicsOptions

This applies to the CADReportObject. It determines whether or not labels are displayed on the CRO control. A value of 1 means the labels are displayed. A value of 0 means they are hidden. The default is 0.

### Command

Read Only: Returns the underlying associated command when available

### FlipCROView

Long value of 0 or 1:

### FlipCROViewByAxis

Integer value of 0, 1, or 2:

### Height

Read/Write: Returns/Sets the height of the object

### ID

Read Only: Returns the Name of the Object

### IsAnalysisWindow

This read-only property returns 1 if the currentR**eportControli**s anAna**lysisWindowobj**ect or 0 if it is not an Analysis object.

### IsLabel

This read-only property returns 1 if the currentRe**portControlis** a label proxy object.

### IsLeaderLine

This read-only property returns 1 if the currentRe**portControlis** a Leader Line object or 0 if not.

### LabelTemplateName

Read/Write: Returns/Sets the associates label template name

### LeaderLineVisible

This returns 1 if the leader line is visible. Setting this property to 0 means that the leader line is not drawn.

### Left

Read/Write: Returns/Sets Left boundary of Object window

### Offset

Read/Write: Returns/Sets via point data object the Offset location of the CAD Reporting Control

### Parent

Read Only: Returns the parent Object

### Right

Read/Write: Returns/Sets Right boundary of Object window

### Rotation

Read/Write: Returns/Sets via dmis matrix the transformations/rotation on the CAD Report Control

### ScaleFactor

A value of 1.00 = 100%.

### Selected

Read/Write: Returns/Sets selection state of the object

### Top

Read/Write: Returns/Sets Top boundary of Object window

### Type

Read Only: Returns the object type

### Visible

Read/Write: Returns/Sets visible state of the object

### Width

Read/Write: Returns/Sets the width of the object


---

## ReportControls

# ReportControls Collection

# Description

# Object Model

# Remarks

# See Also

TheR**eportControlso**bject gives you access to a variety of controls such as buttons, text boxes, and other items that you can add to, remove, and otherwise manipulate on a particular section of a report template.

**ID_HOB_PCD_GRID_CTRL_OB (GridControlObject) Members**

Inside PC-DMIS you use theP**ropertiesd**ialog box to set most properties of the different Reporting objects. However, for the GridControlObject, you use an additionalGri**d Propertiesdia**log box to set format the grid and its cells with text, font styles, line styles, colors and so forth. You can also set these items programmatically by using these properties and methods.

**Note on Colors:**Colors are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as aLo**ngva**lue:

0x00BBGGRR

where BB=blue GG=green RR=red

The maximum value for a single byte in the hexadecimal format is 0xFF (or 255 in decimal format).

**Properties:**

**NumColumns**- This property of type Long defines the number of columns used in the GridControlObject.

**NumRows**- This property of type Long defines the number of rows used in the GridControlObject.

**Methods:**

**GetCellData**- This returns the current numerical (Long) value in a specified cell. It takes two Long value parameters that specify the row and the column for the cell.Sy**ntax:Fu**nction GetCellData(ByVal Row as Long, ByVal Col as Long) As Long

**GetCellLeftLineColor**- This retrieves the color value for a specified cell's left line. This function returns True if the color value is successfully returned or False otherwise. The COLORREF value is returned in the variable passed as the third parameter. This function takes three parameters. The first is the cell row, the second is the cell column, and the third is the color.S**yntax:F**unction GetCellLeftLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean

**GetCellLineStyle**- This retrieves the line style for a specified cell. This function returns True if the line style is successfully returned or False otherwise. It takes four parameters. The first defines the cell's Row, the second defines the cell's Column, the third defines the cell's Line in the cell (1=left line, 2=top line, 3=right line 4=bottom line), the fourth defines the LineStyle (0=None, 1=Thin, 2=Thick, 3=Double, 4=Dotted).Sy**ntax:Fu**nction GetCellLineStyle(ByVal Row As Long, ByVal Col As Long, ByVal Line As Long, ByVal LineStyle as Long) as Boolean

**GetCellText**- This retrieves the current text value in a specified cell. It takes two Long value parameters that specify the row number and the column number to find a particular cell.S**yntax:F**unction GetCellText(ByVal Row As Long, ByVal Col As Long) As String

**GetCellTextColor**- This retrieves the current color for the text used in a cell. This function returns True if the color value is successfully returned or False otherwise. The color (COLORREF value) is returned in the variable passed as the third parameter. This function takes three parameters. The first is the cell row, the second is the cell column, and the third is the color.Sy**ntax:Fu**nction GetCellTextColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean

**GetCellTextColor**- This retrieves the current color for the text used in a cell. This function returns True if the color value is successfully returned or False otherwise. The color (COLORREF value) is returned in the variable passed as the third parameter. This function takes three parameters. The first is the cell row, the second is the cell column, and the third is the color.Sy**ntax:Fu**nction GetCellTextColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean

**GetCellTextValue**-This retrieves the current text value in a specified cell. It takes two Long value parameters that specify the row number (first parameter) and the column number (second parameter) to find a particular cell. This differs from GetCellText in that if expressions are part of the text, those expressions are solved.Synta**x:Funct**ion GetCellTextValue(ByVal Row As Long, ByVal Col As Long) As String

**GetCellTopLineColor**-This retrieves the color value for a specified cell's top line. This function returns True if the color value is successfully returned or False otherwise. The color (COLORREF value) is returned in the variable passed as the third parameter. This function takes three parameters. The first is the cell row, the second is the cell column, and the third is the color.Sy**ntax:Fu**nction GetCellTopLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean

**IsCellMerged**- Returns True if the cell is merged with another cell, False if not. It takes two Long value parameters that specify the row number (first parameter) and the column number (second parameter) to find a particular cell.S**yntax:F**unction IsCellMerged(ByVal Row As Long, ByVal Col As Long) As Boolean

**IsCellVisible**- Returns True if the cell is visible, False if hidden. It takes two Long value parameters that specify the row number (first parameter) and the column number (second parameter) to find a particular cell.S**yntax:F**unction IsCellVisible(ByVal Row As Long, ByVal Col As Long) As Boolean

**IsPrimaryMergedCell**- Returns True if the primary cell is merged. False if not. It takes two Long value parameters that specify the row number (first parameter) and the column number (second parameter) to find a particular cell. This differs from IsCellMerged by checking to see if the cell is the first of a merged cell. Only the contents of the primary cell are displayed in the merged cells field.S**yntax:F**unction IsPrimaryCellMerged(ByVal Row As Long, ByVal Col As Long) As Boolean

**MergeCells**-This merges two cells together. It returns True if the two cells specified are successfully merged, False if not. It takes four Long value parameters that specify two cells to merge.Sy**ntax:Fu**nction MergeCells(ByVal Row As Long, ByVal Col As Long, ByVal Row2 As Long, ByVal Col2 as Long) as Boolean

**Move**-This moves the object to a new position. It takes two parameters. The first defines a new X position in the editor, the second a new Y position.Sy**ntax:Su**b Move (ByVal newX As Long, ByVal newY As Long)

**SetCellBackgroundColor**-This sets the background color for the specified cell. It takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third specifies the color.Sy**ntax:Fu**nction SetCellBackgroundColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean

**SetCellData**-This sets the specified cell's value and returns True if the cells was successfully given the new value or False otherwise. It takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the new value.Sy**ntax:Fu**nction SetCellData(ByVal Row As Long, ByVal Col As Long, ByVal Value As Long) As Boolean

**SetCellFont**-This sets the font style of a particular cell, it returns True if the cell's font was successfully done, or False otherwise. This function takes four parameters. The first two are Long values that specify the cell to change. The third is a string value of the font style to use. The fourth is a Long value that specifies the height of the font.Sy**ntax:Fu**nction SetCellFont(ByVal Row As Long, ByVal Col As Long, ByVal FontStyle, As String, ByVal Height As Long) As Boolean

**SetCellLeftLineColor**-This sets the color value for a specified cell's left line, it returns True if the cell's left line color properly changed or False otherwise.This function takes three Long value parameters.The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the color value to use.Synt**ax:Func**tion SetCellLeftLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean

**SetCellLineColor**-This sets the line color for a particular cell. It returns True if the cell's line color is properly changed or False otherwise.This function takes three Long value parameters.The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the color value to use.Synt**ax:Func**tion SetCellLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean

**SetCellText**-This places the specified text string into the specified cell. It returns True if the cell was successfully inserted or False otherwise. This function takes three parameters. It takes three parameters. The first two are Long values that specify the cell to change. The third is a string value of the text to insert into the cell.Synt**ax:Func**tion SetCellText(ByVal Row As Long, ByVal Col As Long, ByVal Value As String) As Boolean

**SetCellTextColor**-This sets the text color for a particular cell. It returns True if the cell's text color is properly changed or False otherwise.This function takes three Long value parameters.The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the color value to use.Synt**ax:Func**tion SetCellTextColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean

**SetCellTopLineColor**-This sets the color value for a specified cell's top line, it returns True if the cell's top line color properly changes or False otherwise.This function takes three Long value parameters.The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the color value to use.Synt**ax:Func**tion SetCellTopLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean

**SetColumnBackgroundColor**-This sets the background color value for a specified column in the GridControlObject. It returns True if the column's color properly changes or False otherwise. This function takes two Long value parameters. The first parameter indicates the column to change. The second parameter indicates the color to use.Sy**ntax:Fu**nction SetColumnBackgroundColor(ByVal Col As Long, ByVal Color As Long) As Boolean

**SetRowBackgroundColor**-This sets the background color value for a specified row in the GridControlObject. It returns True if the row's color properly changes or False otherwise. This function takes two Long value parameters. The first parameter indicates the row to change. The second parameter indicates the color to use.Sy**ntax:Fu**nction SetRowBackgroundColor(ByVal Row As Long, ByVal Color As Long) As Boolean

**SetRowLeftLineColor-**This sets the left line color value for all the cells in a specified row in the GridControlObject. It returns True if the row's left line color properly changes or False otherwise. This function takes two Long value parameters. The first parameter indicates the row to change. The second parameter is a Long value for the color.Syn**tax:Fun**ction SetRowLeftLineColor(ByVal Row As Long, ByVal Color As Long) As Boolean

**SetRowLineStyle-**This sets the line style for the entire row. It returns True if the style was successfully set or False otherwise. This function takes three Long value parameters. The first indicates the row to change, the second defines the cell's Line in the cell (1=left line, 2=top line, 3=right line 4=bottom line), the third defines the LineStyle (0=None, 1=Thin, 2=Thick, 3=Double, 4=Dotted).Syn**tax:Fun**ction SetRowLineStyle(ByVal Row As Long, ByVal Line As Long, ByVal LineStyle As Long) As Boolean

**SetRowTopLineColor**-This sets the top line color value for a specified row in the GridControlObject. It returns True if the row's top line color properly changes or False otherwise. This function takes two Long value parameters. The first parameter indicates the row to change. The second parameter indicates the color to use.Sy**ntax:Fu**nction SetRowTopLineColor(ByVal Row As Long, ByVal Color As Long) As Boolean

ReportControls Members

The Re**portControls o**bject gives you access to a variety of controls such as buttons, text boxes, and other items that you can add to, remove, and otherwise manipulate on a particular section of a report template.

**ID_HOB_PCD_GRID_CTRL_OB (GridControlObject) Members** Inside PC-DMIS you use the **Properties** dialog box to set most properties of the different Reporting objects. However, for the GridControlObject, you use an additional **Grid Properties** dialog box to set format the grid and its cells with text, font styles, line styles, colors and so forth. You can also set these items programmatically by using these properties and methods. Note **on Colors: Colo**rs are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as a Long **valu**e: 0x00BBGGRR where BB=blue GG=green RR=red The maximum value for a single byte in the hexadecimal format is 0xFF (or 255 in decimal format). Prope**rties: NumC**olu**mns - This** property of type Long defines the number of columns used in the GridControlObject. NumRows **- This **property of type Long defines the number of rows used in the GridControlObject. Methods:** GetCell**Dat**a - This re**turns the current numerical (Long) value in a specified cell. It takes two Long value parameters that specify the row and the column for the cell. Syntax: Fu************************************************************************************************n**ct**io**n **GetCellData(ByVal Row as Long, ByVal Col as Long) As Long GetCellLeft**LineColor - This ret**rieves the color value for a specified cell's left line. This function returns True if the color value is successfully returned or False otherwise. The COLORREF value is returned in the variable passed as the third parameter. This function takes three parameters. The first is the cell row, the second is the cell column, and the third is the color. Syntax: Function GetCellLeftLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean GetCellLineS**tyle - This retr**ieves the line style for a specified cell. This function returns True if the line style is successfully returned or False otherwise. It takes four parameters. The first defines the cell's Row, the second defines the cell's Column, the third defines the cell's Line in the cell (1=left line, 2=top line, 3=right line 4=bottom line), the fourth defines the LineStyle (0=None, 1=Thin, 2=Thick, 3=Double, 4=Dotted). Syntax: Function GetCellLineStyle(ByVal Row As Long, ByVal Col As Long, ByVal Line As Long, ByVal LineStyle as Long) as Boolean GetCellText - **This retrie**ves the current text value in a specified cell. It takes two Long value parameters that specify the row number and the column number to find a particular cell. Syntax: Function GetCellText(ByVal Row As Long, ByVal Col As Long) As String GetCellTextCol****or - This retr**ie**ves the current color for the text used in a cell. This function returns True if the color value is successfully returned or False otherwise. The color (COLORREF value) is returned in the variable passed as the third parameter. This function takes three parameters. The first is the cell row, the second is the cell column, and the third is the color. Syntax: Function GetCellTextColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean GetCellTextColor - This retrieves the current color for the text used in a cell. This function returns True if the color value is successfully returned or False otherwise. The color (COLORREF value) is returned in the variable passed as the third parameter. This function takes three parameters. The first is the cell row, the second is the cell column, and the third is the color. Syntax: Function GetCellTextColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean GetCellTextValue** - This retrieve**s the current text value in a specified cell. It takes two Long value parameters that specify the row number (first parameter) and the column number (second parameter) to find a particular cell. This differs from GetCellText in that if expressions are part of the text, those expressions are solved. Syntax: Function GetCellTextValue(ByVal Row As Long, ByVal Col As Long) As String GetCellTopLineColor **- This retrieves th**e color value for a specified cell's top line. This function returns True if the color value is successfully returned or False otherwise. The color (COLORREF value) is returned in the variable passed as the third parameter. This function takes three parameters. The first is the cell row, the second is the cell column, and the third is the color. Syntax: Function GetCellTopLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean IsCellMerged - Retur**ns True if t**he cell is merged with another cell, False if not. It takes two Long value parameters that specify the row number (first parameter) and the column number (second parameter) to find a particular cell. Syntax: Function IsCellMerged(ByVal Row As Long, ByVal Col As Long) As Boolean IsCellVisible - Retu**rns True if t**he cell is visible, False if hidden. It takes two Long value parameters that specify the row number (first parameter) and the column number (second parameter) to find a particular cell. Syntax: Function IsCellVisible(ByVal Row As Long, ByVal Col As Long) As Boolean IsPrimaryMergedCell -** Returns True if th**e primary cell is merged. False if not. It takes two Long value parameters that specify the row number (first parameter) and the column number (second parameter) to find a particular cell. This differs from IsCellMerged by checking to see if the cell is the first of a merged cell. Only the contents of the primary cell are displayed in the merged cells field. Syntax: Function IsPrimaryCellMerged(ByVal Row As Long, ByVal Col As Long) As Boolean MergeCells - This mer**ges two ce**lls together. It returns True if the two cells specified are successfully merged, False if not. It takes four Long value parameters that specify two cells to merge. Syntax: Function MergeCells(ByVal Row As Long, ByVal Col As Long, ByVal Row2 As Long, ByVal Col2 as Long) as Boolean Move - This moves the** obj**ect to a new position. It takes two parameters. The first defines a new X position in the editor, the second a new Y position. Syntax: Sub Move (ByVal newX As Long, ByVal newY As Long) SetCellBackgroundColo**r - This sets the back**ground color for the specified cell. It takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third specifies the color. Syntax: Function SetCellBackgroundColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean SetCellData - This se**ts the spec**ified cell's value and returns True if the cells was successfully given the new value or False otherwise. It takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the new value. Syntax: Function SetCellData(ByVal Row As Long, ByVal Col As Long, ByVal Value As Long) As Boolean SetCellFont - This se**ts the font** style of a particular cell, it returns True if the cell's font was successfully done, or False otherwise. This function takes four parameters. The first two are Long values that specify the cell to change. The third is a string value of the font style to use. The fourth is a Long value that specifies the height of the font. Syntax: Function SetCellFont(ByVal Row As Long, ByVal Col As Long, ByVal FontStyle, As String, ByVal Height As Long) As Boolean SetCellLeftLineColor **- This sets the colo**r value for a specified cell's left line, it returns True if the cell's left line color properly changed or False otherwise. This function takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the color value to use. Syntax: Function SetCellLeftLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean SetCellLineColor - Th**is sets the line** color for a particular cell. It returns True if the cell's line color is properly changed or False otherwise. This function takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the color value to use. Syntax: Function SetCellLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean SetCellText - This pl**aces the sp**ecified text string into the specified cell. It returns True if the cell was successfully inserted or False otherwise. This function takes three parameters. It takes three parameters. The first two are Long values that specify the cell to change. The third is a string value of the text to insert into the cell. Syntax: Function SetCellText(ByVal Row As Long, ByVal Col As Long, ByVal Value As String) As Boolean SetCellTextColor - This** sets the text c**olor for a particular cell. It returns True if the cell's text color is properly changed or False otherwise. This function takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the color value to use. Syntax: Function SetCellTextColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean SetCellTopLineColor - T**his sets the color **value for a specified cell's top line, it returns True if the cell's top line color properly changes or False otherwise. This function takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the color value to use. Syntax: Function SetCellTopLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean SetColumnBackgroundColo**r - This sets the backgr**ound color value for a specified column in the GridControlObject. It returns True if the column's color properly changes or False otherwise. This function takes two Long value parameters. The first parameter indicates the column to change. The second parameter indicates the color to use. Syntax: Function SetColumnBackgroundColor(ByVal Col As Long, ByVal Color As Long) As Boolean SetRowBackgroundColor - **This sets the backgro**und color value for a specified row in the GridControlObject. It returns True if the row's color properly changes or False otherwise. This function takes two Long value parameters. The first parameter indicates the row to change. The second parameter indicates the color to use. Syntax: Function SetRowBackgroundColor(ByVal Row As Long, ByVal Color As Long) As Boolean SetRowLeftLineColor - Thi**s sets the left line** color value for all the cells in a specified row in the GridControlObject. It returns True if the row's left line color properly changes or False otherwise. This function takes two Long value parameters. The first parameter indicates the row to change. The second parameter is a Long value for the color. Syntax: Function SetRowLeftLineColor(ByVal Row As Long, ByVal Color As Long) As Boolean SetRowLineStyle - This set**s the line style** for the entire row. It returns True if the style was successfully set or False otherwise. This function takes three Long value parameters. The first indicates the row to change, the second defines the cell's Line in the cell (1=left line, 2=top line, 3=right line 4=bottom line), the third defines the LineStyle (0=None, 1=Thin, 2=Thick, 3=Double, 4=Dotted). Syntax: Function SetRowLineStyle(ByVal Row As Long, ByVal Line As Long, ByVal LineStyle As Long) As Boolean SetRowTopLineColor - This s**ets the top line c**olor value for a specified row in the GridControlObject. It returns True if the row's top line color properly changes or False otherwise. This function takes two Long value parameters. The first parameter indicates the row to change. The second parameter indicates the color to use. Syntax: Function SetRowTopLineColor(ByVal Row As Long, ByVal Color As Long) As Boolean

| ReportControls Collection |

| Note on Colors:Colors are defined by a COLORREF value. When specifying a RGB color, the COLORREF value has this hexadecimal form as aLongvalue:0x00BBGGRRwhere BB=blue GG=green RR=redThe maximum value for a single byte in the hexadecimal format is 0xFF (or 255 in decimal format). |

- NumColumns - This property of type Long defines the number of columns used in the GridControlObject.
- NumRows - This property of type Long defines the number of rows used in the GridControlObject.

- GetCellData - This returns the current numerical (Long) value in a specified cell. It takes two Long value parameters that specify the row and the column for the cell. Syntax: Function GetCellData(ByVal Row as Long, ByVal Col as Long) As Long
- GetCellLeftLineColor - This retrieves the color value for a specified cell's left line. This function returns True if the color value is successfully returned or False otherwise. The COLORREF value is returned in the variable passed as the third parameter. This function takes three parameters. The first is the cell row, the second is the cell column, and the third is the color.Syntax: Function GetCellLeftLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean
- GetCellLineStyle - This retrieves the line style for a specified cell. This function returns True if the line style is successfully returned or False otherwise. It takes four parameters. The first defines the cell's Row, the second defines the cell's Column, the third defines the cell's Line in the cell (1=left line, 2=top line, 3=right line 4=bottom line), the fourth defines the LineStyle (0=None, 1=Thin, 2=Thick, 3=Double, 4=Dotted). Syntax: Function GetCellLineStyle(ByVal Row As Long, ByVal Col As Long, ByVal Line As Long, ByVal LineStyle as Long) as Boolean
- GetCellText - This retrieves the current text value in a specified cell. It takes two Long value parameters that specify the row number and the column number to find a particular cell.Syntax: Function GetCellText(ByVal Row As Long, ByVal Col As Long) As String
- GetCellTextColor - This retrieves the current color for the text used in a cell. This function returns True if the color value is successfully returned or False otherwise. The color (COLORREF value) is returned in the variable passed as the third parameter. This function takes three parameters. The first is the cell row, the second is the cell column, and the third is the color. Syntax: Function GetCellTextColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean
- GetCellTextColor - This retrieves the current color for the text used in a cell. This function returns True if the color value is successfully returned or False otherwise. The color (COLORREF value) is returned in the variable passed as the third parameter. This function takes three parameters. The first is the cell row, the second is the cell column, and the third is the color. Syntax: Function GetCellTextColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean
- GetCellTextValue - This retrieves the current text value in a specified cell. It takes two Long value parameters that specify the row number (first parameter) and the column number (second parameter) to find a particular cell. This differs from GetCellText in that if expressions are part of the text, those expressions are solved.   Syntax:  Function GetCellTextValue(ByVal Row As Long, ByVal Col As Long) As String
- GetCellTopLineColor - This retrieves the color value for a specified cell's top line. This function returns True if the color value is successfully returned or False otherwise. The color (COLORREF value) is returned in the variable passed as the third parameter. This function takes three parameters. The first is the cell row, the second is the cell column, and the third is the color.Syntax: Function GetCellTopLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean
- IsCellMerged - Returns True if the cell is merged with another cell, False if not. It takes two Long value parameters that specify the row number (first parameter) and the column number (second parameter) to find a particular cell.Syntax: Function IsCellMerged(ByVal Row As Long, ByVal Col As Long) As Boolean
- IsCellVisible - Returns True if the cell is visible, False if hidden. It takes two Long value parameters that specify the row number (first parameter) and the column number (second parameter) to find a particular cell.Syntax:  Function IsCellVisible(ByVal Row As Long, ByVal Col As Long) As Boolean
- IsPrimaryMergedCell - Returns True if the primary cell is merged. False if not. It takes two Long value parameters that specify the row number (first parameter) and the column number (second parameter) to find a particular cell. This differs from IsCellMerged by checking to see if the cell is the first of a merged cell. Only the contents of the primary cell are displayed in the merged cells field.Syntax: Function IsPrimaryCellMerged(ByVal Row As Long, ByVal Col As Long) As Boolean
- MergeCells - This merges two cells together. It returns True if the two cells specified are successfully merged, False if not. It takes four Long value parameters that specify two cells to merge.Syntax: Function MergeCells(ByVal Row As Long, ByVal Col As Long, ByVal Row2 As Long, ByVal Col2 as Long) as Boolean
- Move - This moves the object to a new position. It takes two parameters. The first defines a new X position in the editor, the second a new Y position.Syntax: Sub Move (ByVal newX As Long, ByVal newY As Long)
- SetCellBackgroundColor - This sets the background color for the specified cell. It takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third specifies the color.Syntax: Function SetCellBackgroundColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean
- SetCellData - This sets the specified cell's value and returns True if the cells was successfully given the new value or False otherwise. It takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the new value.Syntax: Function SetCellData(ByVal Row As Long, ByVal Col As Long, ByVal Value As Long) As Boolean
- SetCellFont - This sets the font style of a particular cell, it returns True if the cell's font was successfully done, or False otherwise. This function takes four parameters. The first two are Long values that specify the cell to change. The third is a string value of the font style to use. The fourth is a Long value that specifies the height of the font.Syntax: Function SetCellFont(ByVal Row As Long, ByVal Col As Long, ByVal FontStyle, As String, ByVal Height As Long) As Boolean
- SetCellLeftLineColor - This sets the color value for a specified cell's left line, it returns True if the cell's left line color properly changed or False otherwise. This function takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the color value to use.Syntax: Function SetCellLeftLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean
- SetCellLineColor - This sets the line color for a particular cell. It returns True if the cell's line color is properly changed or False otherwise. This function takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the color value to use.Syntax: Function SetCellLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean
- SetCellText - This places the specified text string into the specified cell. It returns True if the cell was successfully inserted or False otherwise. This function takes three parameters. It takes three parameters. The first two are Long values that specify the cell to change. The third is a string value of the text to insert into the cell.  Syntax: Function SetCellText(ByVal Row As Long, ByVal Col As Long, ByVal Value As String) As Boolean
- SetCellTextColor - This sets the text color for a particular cell. It returns True if the cell's text color is properly changed or False otherwise. This function takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the color value to use.Syntax: Function SetCellTextColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean
- SetCellTopLineColor - This sets the color value for a specified cell's top line, it returns True if the cell's top line color properly changes or False otherwise. This function takes three Long value parameters. The first two specify the row number (first parameter) and the column number (second parameter) to find a particular cell. The third parameter is the color value to use.Syntax: Function SetCellTopLineColor(ByVal Row As Long, ByVal Col As Long, ByVal Color As Long) As Boolean
- SetColumnBackgroundColor - This sets the background color value for a specified column in the GridControlObject. It returns True if the column's color properly changes or False otherwise. This function takes two Long value parameters. The first parameter indicates the column to change. The second parameter indicates the color to use.Syntax: Function SetColumnBackgroundColor(ByVal Col As Long, ByVal Color As Long) As Boolean
- SetRowBackgroundColor - This sets the background color value for a specified row in the GridControlObject. It returns True if the row's color properly changes or False otherwise. This function takes two Long value parameters. The first parameter indicates the row to change. The second parameter indicates the color to use.Syntax: Function SetRowBackgroundColor(ByVal Row As Long, ByVal Color As Long) As Boolean
- SetRowLeftLineColor - This sets the left line color value for all the cells in a specified row in the GridControlObject. It returns True if the row's left line color properly changes or False otherwise. This function takes two Long value parameters. The first parameter indicates the row to change. The second parameter is a Long value for the color. Syntax: Function SetRowLeftLineColor(ByVal Row As Long, ByVal Color As Long) As Boolean
- SetRowLineStyle - This sets the line style for the entire row. It returns True if the style was successfully set or False otherwise. This function takes three Long value parameters. The first indicates the row to change, the second defines the cell's Line in the cell (1=left line, 2=top line, 3=right line 4=bottom line), the third defines the LineStyle (0=None, 1=Thin, 2=Thick, 3=Double, 4=Dotted). Syntax: Function SetRowLineStyle(ByVal Row As Long, ByVal Line As Long, ByVal LineStyle As Long) As Boolean
- SetRowTopLineColor - This sets the top line color value for a specified row in the GridControlObject. It returns True if the row's top line color properly changes or False otherwise. This function takes two Long value parameters. The first parameter indicates the row to change. The second parameter indicates the color to use.Syntax: Function SetRowTopLineColor(ByVal Row As Long, ByVal Color As Long) As Boolean

# ReportControls Collection Members

# Public Methods

# Public Properties

# See Also

The Add method inserts a new control of a defined location and size into the current section of the report template.

This method works like the normal Add method except that the control adds a new object type that shows its properties.

The properties available to this new object type are:

Application - (Get) reference to the application objectParent - (Get) reference to the parent object (ReportingControls)Top - (Put/Get) Top position of the report control windowBottom - (Put/Get) Bottom position of the report control windowLeft - (Put/Get) Left position of the report control windowRight - (Put/Get) Right position of the report control windowID - (Get) The ID of the report control - The name of the controlSelected - (Put/Get) selection state of the report controlVisible - (Put/Get) visible state of the report controlHeight - (Put/Get) The height of the report controlWidth - (Put/Get) The width of the report controlType - (Get) The type of controlCommand - (Get) The underlying command

This method works like the normal Item method except that the control returns a new object type that shows its properties.

The properties available to this new object type are:

Application - (Get) reference to the application objectParent - (Get) reference to the parent object (ReportingControls)Top - (Put/Get) Top position of the report control windowBottom - (Put/Get) Bottom position of the report control windowLeft - (Put/Get) Left position of the report control windowRight - (Put/Get) Right position of the report control windowID - (Get) The ID of the report control - The name of the controlSelected - (Put/Get) selection state of the report controlVisible - (Put/Get) visible state of the report controlHeight - (Put/Get) The height of the report controlWidth - (Put/Get) The width of the report controlType - (Get) The type of controlCommand - (Get) The underlying command

This method will repaint the page using the new settings via automation. This is different from RefreshReport which will restore the original settings.

ReportControls Collection

_Item Add The Add method inserts a new control of a defined location and size into the current section of the report template. AddControl This method works like the normal Add method except that the control adds a new object type that shows its properties. The properties available to this new object type are: Application - (Get) reference to the application object Parent - (Get) reference to the parent object (ReportingControls) Top - (Put/Get) Top position of the report control window Bottom - (Put/Get) Bottom position of the report control window Left - (Put/Get) Left position of the report control window Right - (Put/Get) Right position of the report control window ID - (Get) The ID of the report control - The name of the control Selected - (Put/Get) selection state of the report control Visible - (Put/Get) visible state of the report control Height - (Put/Get) The height of the report control Width - (Put/Get) The width of the report control Type - (Get) The type of control Command - (Get) The underlying command Item This method returns an Object of the control identified by the name or number *in the Na*meOrNum parameter. ItemControl This method works like the normal Item method except that the control returns a new object type that shows its properties. The properties available to this new object type are: Application - (Get) reference to the application object Parent - (Get) reference to the parent object (ReportingControls) Top - (Put/Get) Top position of the report control window Bottom - (Put/Get) Bottom position of the report control window Left - (Put/Get) Left position of the report control window Right - (Put/Get) Right position of the report control window ID - (Get) The ID of the report control - The name of the control Selected - (Put/Get) selection state of the report control Visible - (Put/Get) visible state of the report control Height - (Put/Get) The height of the report control Width - (Put/Get) The width of the report control Type - (Get) The type of control Command - (Get) The underlying command RefreshControls This method will repaint the page using the new settings via automation. This is different from RefreshReport which will restore the original settings. Remove This deletes the specified control from the current section of the report template.

Application Returns an A**pplication o**bject. Count This property counts all the controls in the current section/page and returns it as a L**ong **value. Parent This property returns this object's parent object, a generic object interface. ReadOnly Read Only: Returns the Read Only flag. If set controls cannot be added or removed

| ReportControls CollectionMembers |

| _Item | Add | The Add method inserts a new control of a defined location and size into the current section of the report template. |
| AddControl | This method works like the normal Add method except that the control adds a new object type that shows its properties.The properties available to this new object type are:Application - (Get) reference to the application objectParent - (Get) reference to the parent object (ReportingControls)Top - (Put/Get) Top position of the report control windowBottom - (Put/Get) Bottom position of the report control windowLeft - (Put/Get) Left position of the report control windowRight - (Put/Get) Right position of the report control windowID - (Get) The ID of the report control - The name of the controlSelected - (Put/Get) selection state of the report controlVisible - (Put/Get) visible state of the report controlHeight - (Put/Get) The height of the report controlWidth - (Put/Get) The width of the report controlType - (Get) The type of controlCommand - (Get) The underlying command |
| Item | This method returns an Object of the control identified by the name or number in theNameOrNumparameter. |
| ItemControl | This method works like the normal Item method except that the control returns a new object type that shows its properties.The properties available to this new object type are:Application - (Get) reference to the application objectParent - (Get) reference to the parent object (ReportingControls)Top - (Put/Get) Top position of the report control windowBottom - (Put/Get) Bottom position of the report control windowLeft - (Put/Get) Left position of the report control windowRight - (Put/Get) Right position of the report control windowID - (Get) The ID of the report control - The name of the controlSelected - (Put/Get) selection state of the report controlVisible - (Put/Get) visible state of the report controlHeight - (Put/Get) The height of the report controlWidth - (Put/Get) The width of the report controlType - (Get) The type of controlCommand - (Get) The underlying command |
| RefreshControls | This method will repaint the page using the new settings via automation. This is different from RefreshReport which will restore the original settings. |
| Remove | This deletes the specified control from the current section of the report template. |

| Application | Returns anApplicationobject. |
| Count | This property counts all the controls in the current section/page and returns it as aLongvalue. |
| Parent | This property returns this object's parent object, a generic object interface. |
| ReadOnly | Read Only:  Returns the Read Only flag. If set controls cannot be added or removed |

### Add

The Add method inserts a new control of a defined location and size into the current section of the report template.

### AddControl

This method works like the normal Add method except that the control adds a new object type that shows its properties.

### Application

ReportControls Collection|ReportControls Members

### Count

ReportControls Collection|ReportControls Members

### Item

Be aware that a hidden control called "Report" always exists in the Report template and cannot be deleted or otherwise manipulated. This object is used by PC-DMIS for internal purposes only. For this reason do not giveN*ameOrNuma* value of 1, as it will try to select the Report control.

### ItemControl

This method works like the normal Item method except that the control returns a new object type that shows its properties.

### Parent

ReportControls Collection|ReportControls Members

### ReadOnly

ReportControls Collection|ReportControls Members

### RefreshControls

This method will repaint the page using the new settings via automation. This is different from RefreshReport which will restore the original settings.

### Remove

ReportControls Collection|ReportControls Members

### _Item

ReportControls Collection|ReportControls Members


---

## ReportData

# ReportData Object

# Description

# Remarks

# Example

# See Also

TheR**eportDatao**bject lets you access data sent to reports during theEve**ntReportDataeve**nt.

This event can only be accessed inside theP**ropertiesd**ialog box inside the Label and Report Template Editors inside PC-DMIS versions 4.0 and higher.

*Properties dialog box*

Using this object in conjunction with theE**ventReportDatae**vent, you can access the desired information.

Suppose in PC-DMIS's Label Template Editor, you use aB****orde**ro**bject to change its background color to match the current dimension out of tolerance color. You can do this using the ReportData object. The following code works inside of the PC-DMIS's label template editor in theEve**ntReportDataeve**nt of aBorderobject.

Dim Count As Integer

Dim i As Integer

Dim MaxIndex As Integer

Dim MaxDev As Double

Dim CurrentDev as Variant

Dim Dev as Variant

Dim PTol as Variant

Dim MTol as Variant

Dim DevColor as Long

' Initialize Max Deviation and Max Index

MaxDev = 0.0

MaxIndex = 1

'Get the number of axes for this dimension

Count = ReportData.GetCount(132)

'Adjust the bottom of the border to fit the number of axes

Border1.Bottom = 106+((Count-1)*25)

'Loop through to find the largest deviation

'When loop is complete, MaxIndex is the index to the

' largest deviation

For i=1 to Count

CurrentDev = ABS(ReportData.GetValue(DIM_DEVIATION,i))

If CurrentDev > MaxDev Then

MaxDev = CurrentDev

MaxIndex = i

End If

Next i

' Using MaxIndex, acquire the axis's deviation +TOL and -TOL

Dev = ReportData.GetValue(340, MaxIndex)

PTol = ReportData.GetValue(167, MaxIndex)

MTol = ReportData.GetValue(168, MaxIndex)

' Use this information to adjust the background color of the border

DevColor = ReportData.GetTolColor(Dev,PTol,MTol)

Border1.BackColor = DevColor

Border1.ForeColor = DevColor

ReportData Members

The **ReportData** object lets you access data sent to reports during the **EventReportData** event.

This event can only be accessed inside the ***Properties** dialog* box inside the Label and Report Template Editors inside PC-DMIS versions 4.0 and higher. Properties dialog box Using this object in conjunction with the Even**tReportData eve**nt, you can access the desired information.

Suppose in PC-DMIS's Label Template Editor, you use a ****Bord**er** object to change its background color to match the current dimension out of tolerance color. You can do this using the ReportData object. The following code works inside of the PC-DMIS's label template editor in the **EventReportData** event of a Border object. Dim Count As Integer Dim i As Integer Dim MaxIndex As Integer Dim MaxDev As Double Dim CurrentDev as Variant Dim Dev as Variant Dim PTol as Variant Dim MTol as Variant Dim DevColor as Long ' Initialize Max Deviation and Max Index MaxDev = 0.0 MaxIndex = 1 'Get the number of axes for this dimension Count = ReportData.GetCount(132) 'Adjust the bottom of the border to fit the number of axes Border1.Bottom = 106+((Count-1)*25) 'Loop through to find the largest deviation 'When loop is complete, MaxIndex is the index to the ' largest deviation For i=1 to Count CurrentDev = ABS(ReportData.GetValue(DIM_DEVIATION,i)) If CurrentDev > MaxDev Then MaxDev = CurrentDev MaxIndex = i End If Next i ' Using MaxIndex, acquire the axis's deviation +TOL and -TOL Dev = ReportData.GetValue(340, MaxIndex) PTol = ReportData.GetValue(167, MaxIndex) MTol = ReportData.GetValue(168, MaxIndex) ' Use this information to adjust the background color of the border DevColor = ReportData.GetTolColor(Dev,PTol,MTol) Border1.BackColor = DevColor Border1.ForeColor = DevColor

| ReportData Object |

# ReportData Object Members

# Public Methods

# Public Properties

# See Also

This method returns True if report data has a measurement routine command interface, False otherwise.

This property returns a the number of the report's current page as aL**ongv**alue.

ReportData Object

GetColorList This returns the current global dimension color list. GetCommand This returns a Command Object if report data has command interface. GetCommandData Returns the value of command data GetCount This returns the number of instances of the specified data type. GetCountExt Returns the number of instances of the specified data type [Extended DType] GetEx*pressionVa*lue This returns value of the specified expression in Expression . GetMultipleTolZone Returns the current global multiple tolerance zone GetPrintBackGroundColor Returns true if report is printing the background color. GetPrintBlackAndWhite Returns true if report is printing in black and white. GetReferenceValue This returns the reference feature value of the indicated field of the command. GetReferenceValue2 This returns the reference feature value of the indicated field of the command. GetReportingPath Returns the value of reporting directory GetShowColorsInTwoDirections Returns if pcdmis is showing the color in two directions GetTolColor This returns a the current tolerance color based on the deviation, plus tolerance, and minus tolerance. GetValue This method returns the value of the indicated field of the command. GetValue2 This method returns the value of the indicated field of the command. GetValueExt Returns the value of the indicated field of the command [Extended DType]. GetValueExt2 Returns the value of the indicated field of the specified command [Extended DType]. HasCommandData This method returns True if report data has a measurement routine command interface, False otherwise. HasToolkitCommandData Returns true if report data has a WilcoxAssociates::Toolkit ICommand interface.

CurPage This property returns a the number of the report's current page as a L**ong **value. ToolkitICommandInstanceGuid Read Only: WilcoxAssociates::Toolkit ICommand Instance Guid ToolkitIPartProgramManagerInstanceGuid Read Only: WilcoxAssociates::Toolkit IPartProgramManager Instance Guid

| ReportData ObjectMembers |

| GetColorList | This returns the current global dimension color list. |
| GetCommand | This returns a Command Object if report data has command interface. |
| GetCommandData | Returns the value of command data |
| GetCount | This returns the number of instances of the specified data type. |
| GetCountExt | Returns the number of instances of the specified data type [Extended DType] |
| GetExpressionValue | This returns value of the specified expression inExpression. |
| GetMultipleTolZone | Returns the current global multiple tolerance zone |
| GetPrintBackGroundColor | Returns true if report is printing the background color. |
| GetPrintBlackAndWhite | Returns true if report is printing in black and white. |
| GetReferenceValue | This returns the reference feature value of the indicated field of the command. |
| GetReferenceValue2 | This returns the reference feature value of the indicated field of the command. |
| GetReportingPath | Returns the value of reporting directory |
| GetShowColorsInTwoDirections | Returns if pcdmis is showing the color in two directions |
| GetTolColor | This returns a the current tolerance color based on the deviation, plus tolerance, and minus tolerance. |
| GetValue | This method returns the value of the indicated field of the command. |
| GetValue2 | This method returns the value of the indicated field of the command. |
| GetValueExt | Returns the value of the indicated field of the command [Extended DType]. |
| GetValueExt2 | Returns the value of the indicated field of the specified command [Extended DType]. |
| HasCommandData | This method returns True if report data has a measurement routine command interface, False otherwise. |
| HasToolkitCommandData | Returns true if report data has a WilcoxAssociates::Toolkit ICommand interface. |

| CurPage | This property returns a the number of the report's current page as aLongvalue. |
| ToolkitICommandInstanceGuid | Read Only:  WilcoxAssociates::Toolkit ICommand Instance Guid |
| ToolkitIPartProgramManagerInstanceGuid | Read Only:  WilcoxAssociates::Toolkit IPartProgramManager Instance Guid |

### CurPage

This property returns a the number of the report's current page as aL**ongv**alue.

### GetColorList

This returns the current global dimension color list.

### GetCommand

This returns a Command Object if report data has command interface.

### GetCommandData

Returns the value of command data

### GetCount

Sample hit measured A value.

### GetCountExt

Sample hit measured A value.

### GetExpressionValue

This returns value of the specified expression in *Expression* .

### GetMultipleTolZone

Returns the current global multiple tolerance zone

### GetPrintBackGroundColor

Returns true if report is printing the background color.

### GetPrintBlackAndWhite

Returns true if report is printing in black and white.

### GetReferenceValue

Sample hit measured A value.

### GetReferenceValue2

Sample hit measured A value.

### GetReportingPath

Returns the value of reporting directory

### GetShowColorsInTwoDirections

Returns if pcdmis is showing the color in two directions

### GetTolColor

This returns a the current tolerance color based on the deviation, plus tolerance, and minus tolerance.

### GetValue

Sample hit measured A value.

### GetValue2

Sample hit measured A value.

### GetValueExt

Sample hit measured A value.

### GetValueExt2

Sample hit measured A value.

### HasCommandData

This method returns True if report data has a measurement routine command interface, False otherwise.

### HasToolkitCommandData

Returns true if report data has a WilcoxAssociates::Toolkit ICommand interface.

### ToolkitICommandInstanceGuid

Read Only: WilcoxAssociates::Toolkit ICommand Instance Guid

### ToolkitIPartProgramManagerInstanceGuid

Read Only: WilcoxAssociates::Toolkit IPartProgramManager Instance Guid


---

## ReportTemplate

# ReportTemplate Object

# Description

# Object Model

# See Also

ReportTemplate Members

The ReportTemplate object allows you to get or set various settings for a report template.

| ReportTemplate Object |

# ReportTemplate Object Members

# Public Methods

# Public Properties

# See Also

This method saves the report template.

ReportTemplate Object

Close This subroutine closes the report template. To first save any unsaved changes, use the Save method. Save This subroutine saves the report template with its already existing name. If the template has n<u>ot </u>been saved before use the SaveAs method instead, and specify a filename. SaveAs This method saves the report template.

_Name Appl**ication Thi**s property represents the read-only PC-DMIS App**lication obj**ect. The Application object includes properties and methods that return top-level objects. Colo**rs Thi**s property returns a read-only Colors collection object. Through this object you will be able to access the report template's color tree. Only defined color objects will be in the collection. Color objects should be added or removed. Color objects will be retrieved using the command type ID or the COLOR_SELECTION ID. FullName This property returns a read-only string of the full path and filename of the report template. LearnTimeProgram This read/write string property allows you to read or write the learn time program name. Name This property returns a read-only string of the report template's filename. PageOrientation This property lets you to read or write the page orientation for the report template. PageSize This property lets you read or write the page size for the report template. Parent This property returns the report template's parent object, which is the read-only Report Templates object. RunTimeProgram This read/write string property allows you to read or write the run time program name. Sections This property returns a collection of all the report templates sections as a read-only Sections object. Visible Boolean property returns or sets the visibility status of the template editor. If True then Visible, if False then hidden.

| ReportTemplate ObjectMembers |

| Close | This subroutine closes the report template. To first save any unsaved changes, use the Save method. |
| Save | This subroutine saves the report template with its already existing name. If the template hasnotbeen saved before use the SaveAs method instead, and specify a filename. |
| SaveAs | This method saves the report template. |

| _Name | Application | This property represents the read-only PC-DMISApplicationobject. TheApplicationobject includes properties and methods that return top-level objects. |
| Colors | This property returns a read-onlyColorscollection object. Through this object you will be able to access the report template's color tree. Only defined color objects will be in the collection. Color objects should be added or removed. Color objects will be retrieved using the command type ID or the COLOR_SELECTION ID. |
| FullName | This property returns a read-only string of the full path and filename of the report template. |
| LearnTimeProgram | This read/write string property allows you to read or write the learn time program name. |
| Name | This property returns a read-only string of the report template's filename. |
| PageOrientation | This property lets you to read or write the page orientation for the report template. |
| PageSize | This property lets you read or write the page size for the report template. |
| Parent | This property returns the report template's parent object, which is the read-only Report Templates object. |
| RunTimeProgram | This read/write string property allows you to read or write the run time program name. |
| Sections | This property returns a collection of all the report templates sections as a read-only Sections object. |
| Visible | Booleanproperty returns or sets the visibility status of the template editor. If True then Visible, if False then hidden. |

### Application

ReportTemplate Object|ReportTemplate Members

### Close

ReportTemplate Object|ReportTemplate Members

### Colors

ReportTemplate Object|ReportTemplate Members

### FullName

ReportTemplate Object|ReportTemplate Members

### LearnTimeProgram

ReportTemplate Object|ReportTemplate Members

### Name

ReportTemplate Object|ReportTemplate Members

### PageOrientation

ReportTemplate Object|ReportTemplate Members

### PageSize

ReportTemplate Object|ReportTemplate Members

### Parent

ReportTemplate Object|ReportTemplate Members

### RunTimeProgram

ReportTemplate Object|ReportTemplate Members

### Save

ReportTemplate Object|ReportTemplate Members

### SaveAs

This method saves the report template.

### Sections

ReportTemplate Object|ReportTemplate Members

### Visible

ReportTemplate Object|ReportTemplate Members

### _Name

ReportTemplate Object|ReportTemplate Members


---

## ReportTemplates

# ReportTemplates Object

# Description

# Object Model

# Remarks

# See Also

TheReportTemplatesobject contains all open report templates in PC-DMIS's Report Template editor.

Use ReportTemplates.Add to create a new report template and add it to the ReportTemplates collection.

Use ReportTemplates(**inde*x*) whereindexis the report template name or index number to access an individual report template.

ReportTemplates Members|Add Method

The ReportTemplates object contains all open report templates in PC-DMIS's Report Template editor.

Use ReportTemplates.Add to create a new report template and add it to the ReportTemplates collection. Use ReportTemplates(** ind*e*x ) where index is the report template name or index number to access an individual report template.

ReportTemplates Members | Add Method

| ReportTemplates Object |

# ReportTemplates Object Members

# Public Methods

# Public Properties

# See Also

The Open Function activates the report template stored in the fileF*ileName.* If the template file does not exist, nothing happens.

ReportTemplates Object|Add Method

_Item Add The Add function creates a new report template in PC-DMIS. Item The Item function returns the ReportTemplate Object with the given name or number. Open The Open Function activates the report template stored in the file Fil*eName . *If the template file does not exist, nothing happens.

Ap**plication T**his property represents the read-only PC-DMIS A**pplication o**bject. The Application object includes properties and methods that return top-level objects. Count This property returns a read-only number of open report templates. Parent This returns the read-only PC-DMIS Application object which is the parent object of the ReportTemplates object.

ReportTemplates Object | Add Method

| ReportTemplates ObjectMembers |

| _Item | Add | The Add function creates a new report template in PC-DMIS. |
| Item | The Item function returns the ReportTemplate Object with the given name or number. |
| Open | The Open Function activates the report template stored in the fileFileName. If the template file does not exist, nothing happens. |

| Application | This property represents the read-only PC-DMISApplicationobject. TheApplicationobject includes properties and methods that return top-level objects. |
| Count | This property returns a read-only number of open report templates. |
| Parent | This returns the read-only PC-DMIS Application object which is the parent object of the ReportTemplates object. |

### Add

Sub Create_Report_Template()

### Application

ReportTemplates Object|ReportTemplates Members

### Count

ReportTemplates Object|ReportTemplates Members

### Item

ReportTemplates Object|ReportTemplates Members

### Open

The Open Function activates the report template stored in the fileF*ileName.* If the template file does not exist, nothing happens.

### Parent

ReportTemplates Object|ReportTemplates Members

### _Item

ReportTemplates Object|ReportTemplates Members


---

## Section

# Section Object

# Description

# Object Model

# See Also

Section Members

The****** ****Section** object lets you manipulate a particular section from the collection of available **Selections **used by a report template.

| Section Object |

# Section Object Members

# Public Properties

# See Also

Section Object

_Name Application This property returns the PC-DMIS App**lication obj**ect. Height This property sets or returns the section's height. Name This property returns or sets the name of the section. Number This returns a read-only Lon**g va**lue of the index number of the current section within the Sec****tions o**b**ject. This is used with the Sections.Item property to access the current section later. Parent This property returns a read-only parent object of the Section, the Sections object. Repo**rtControls Thi**s property returns the ReportControls object for this section. You can then access the ReportControls object to dynamically add or modify existing objects in the section. Width This property sets or returns the section's height.

| Section ObjectMembers |

| _Name | Application | This property returns the PC-DMISApplicationobject. |
| Height | This property sets or returns the section's height. |
| Name | This property returns or sets the name of the section. |
| Number | This returns a read-onlyLongvalue of the index number of the current section within theSectionsobject. This is used with the Sections.Item property to access the current section later. |
| Parent | This property returns a read-only parent object of the Section, theSectionsobject. |
| ReportControls | This property returns theReportControlsobject for this section. You can then access the ReportControls object to dynamically add or modify existing objects in the section. |
| Width | This property sets or returns the section's height. |

### Application

This property returns the PC-DMIS **Application **object.

### Height

This property sets or returns the section's height.

### Name

This property returns or sets the name of the section.

### Number

This returns a read-only **Long** value of the index number of the current section within the **Sections** object. This is used with the Sections.Item property to access the current section later.

### Parent

This property returns a read-only parent object of the Section, the **Sections **object.

### ReportControls

This property returns the **ReportControls** object for this section. You can then access the ReportControls object to dynamically add or modify existing objects in the section.

### Width

This property sets or returns the section's height.

### _Name

Visual Basic Public Property _Name As String


---

## Sections

# Sections Object

# Description

# Object Model

# Remarks

# See Also

TheSectionsobject contains a collection of all existing Section tabs for a given report template in PC-DMIS's Report Template editor.

Use Sections.Add to create a new section and add it to the Sections collection.

Use Sections(**inde*x*) whereindexis a section's name or index number to access the section.

Sections Members

The Sections object contains a collection of all existing Section tabs for a given report template in PC-DMIS's Report Template editor.

Use Sections.Add to create a new section and add it to the Sections collection. Use Sections(** ind*e*x ) where index is a section's name or index number to access the section.

| Sections Object |

# Sections Object Members

# Public Methods

# Public Properties

# See Also

This method inserts a new section before the named section. The new section will have the default internal name of "section" followed by a number.

This method removes or deletes theS**ectiono**bject identified by theNam*eOrNumpar*ameter.

Sections Object

_Item Add This method adds a new section to the end of the template with the given name InsertSect****ionBe**fo**re This method inserts a new section before the named section. The new section will have the default internal name of "section" followed by a number. Item This method returns the Section object identified by the Nam**eOrNum p*a*rameter. Remove This method removes or deletes the Section object identified by the NameOrNum parameter.

Application This property returns the PC-DMIS A**pplication o**bject. Count Counts the number of sections in the S**ections o**bject. Pa**rent R**eturns this object's Parent object, in this case, a R**eportTemplate o**bject.

| Sections ObjectMembers |

| _Item | Add | This method adds a new section to the end of the template with the given name |
| InsertSectionBefore | This method inserts a new section before the named section. The new section will have the default internal name of "section" followed by a number. |
| Item | This method returns theSectionobject identified by theNameOrNumparameter. |
| Remove | This method removes or deletes theSectionobject identified by theNameOrNumparameter. |

| Application | This property returns the PC-DMISApplicationobject. |
| Count | Counts the number of sections in theSectionsobject. |
| Parent | Returns this object'sParentobject, in this case, aReportTemplateobject. |

### Add

This method adds a new section to the end of the template with the given name

### Application

This property returns the PC-DMIS **Application **object.

### Count

Counts the number of sections in the **Sections **object.

### InsertSectionBefore

This method inserts a new section before the named section. The new section will have the default internal name of "section" followed by a number.

### Item

This method returns the **Section** object identified by the *NameOrNum* parameter.

### Parent

Returns this object's **Parent** object, in this case, a **ReportTemplate **object.

### Remove

This method removes or deletes theS**ectiono**bject identified by theNam*eOrNumpar*ameter.

### _Item

Visual Basic Public Function _Item( _ ByVal Na*meOrNumber A*s Variant _ ) As Section

