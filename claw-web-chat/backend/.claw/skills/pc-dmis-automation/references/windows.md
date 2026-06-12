# PC-DMIS Reference: Windows

## AnalysisWindow

# AnalysisWindow Object

# Description

# Object Model

# See Also

This object allows you to work with a specified Analysis object in a template, custom report, or in the Report window.

AnalysisWindow Members

This object allows you to work with a specified Analysis object in a template, custom report, or in the Report window.

| AnalysisWindow Object |

# AnalysisWindow Object Members

# Public Methods

# Public Properties

# See Also

This method repaints the current custom report object.

This represents the read-only PC-DMIS Application.

This read/write property returns 1 if theA**nalysisWindowo**bject is displaying deviation lines. Setting this property to 0 will turn off the display of deviation lines.

Returns aH**OBPointInfoListo**bject if it can orNot**hingove**rwise.

This read/write property returns or sets the color setting for the sphere point MAX marker. The range for this value is black indicated as 0(0x0) to white indicated as 16777215 (0xFFFFFF).

This read/write property returns the size of the sphere point marker used to designate the MAX/MIN points. Setting this property to 0 will turn off the sphere point MAX/MIN marker.

This read/write property returns or sets the color setting for the sphere point MIN marker. The range for this value is black indicated as 0(0x0) to white indicated as 16777215 (0xFFFFFF).

This read-only property returns the ReportControl object.

This read/write property returns 1 if theA**nalysisWindowo**bject is displaying the dimension title. Setting this property to 0 will turn off the dimension title display.

This read/write property returns 1 if theA**nalysisWindowo**bject has a transparent background. Setting this property to 0 means that the background is not transparent.

This read/write property returns 1 if theA**nalysisWindowo**bject is displaying the trihedron. Setting this property to 0 will hide the trihedron from displaying.

AnalysisWindow Object

RepaintCustomReport This method repaints the current custom report object.

Application This represents the read-only PC-DMIS Application. Border Read/Write: Returns/Sets show border on the analysis window Deviations This read/write property returns 1 if the Analy********sisWindo**w **ob**je**ct is displaying deviation lines. Setting this property to 0 will turn off the display of deviation lines. HOBPoi**ntInfoList Retur**ns a HOBPointInfoList object if it can or Nothing** overwi**se. LabelOffset Read/Write: Returns/Sets the label offset MaxColor This read/write property returns or sets the color setting for the sphere point MAX marker. The range for this value is black indicated as 0(0x0) to white indicated as 16777215 (0xFFFFFF). MaxMinSize This read/write property returns the size of the sphere point marker used to designate the MAX/MIN points. Setting this property to 0 will turn off the sphere point MAX/MIN marker. MinColor This read/write property returns or sets the color setting for the sphere point MIN marker. The range for this value is black indicated as 0(0x0) to white indicated as 16777215 (0xFFFFFF). Parent This read-only property returns the ReportControl object. TITLE This read/write property returns 1 if the AnalysisWindow object is displaying the dimension title. Setting this property to 0 will turn off the dimension title display. Transparent This read/write property returns 1 if the AnalysisWindow object has a transparent background. Setting this property to 0 means that the background is not transparent. Trihedron This read/write property returns 1 if the AnalysisWindow object is displaying the trihedron. Setting this property to 0 will hide the trihedron from displaying.

| AnalysisWindow ObjectMembers |

| RepaintCustomReport | This method repaints the current custom report object. |

| Application | This represents the read-only PC-DMIS Application. |
| Border | Read/Write: Returns/Sets show border on the analysis window |
| Deviations | This read/write property returns 1 if theAnalysisWindowobject is displaying deviation lines. Setting this property to 0 will turn off the display of deviation lines. |
| HOBPointInfoList | Returns aHOBPointInfoListobject if it can orNothingoverwise. |
| LabelOffset | Read/Write: Returns/Sets the label offset |
| MaxColor | This read/write property returns or sets the color setting for the sphere point MAX marker. The range for this value is black indicated as 0(0x0) to white indicated as 16777215 (0xFFFFFF). |
| MaxMinSize | This read/write property returns the size of the sphere point marker used to designate the MAX/MIN points. Setting this property to 0 will turn off the sphere point MAX/MIN marker. |
| MinColor | This read/write property returns or sets the color setting for the sphere point MIN marker. The range for this value is black indicated as 0(0x0) to white indicated as 16777215 (0xFFFFFF). |
| Parent | This read-only property returns the ReportControl object. |
| TITLE | This read/write property returns 1 if theAnalysisWindowobject is displaying the dimension title. Setting this property to 0 will turn off the dimension title display. |
| Transparent | This read/write property returns 1 if theAnalysisWindowobject has a transparent background. Setting this property to 0 means that the background is not transparent. |
| Trihedron | This read/write property returns 1 if theAnalysisWindowobject is displaying the trihedron. Setting this property to 0 will hide the trihedron from displaying. |

### Application

This represents the read-only PC-DMIS Application.

### Border

AnalysisWindow Object|AnalysisWindow Members

### Deviations

This read/write property returns 1 if theA**nalysisWindowo**bject is displaying deviation lines. Setting this property to 0 will turn off the display of deviation lines.

### HOBPointInfoList

Returns aH**OBPointInfoListo**bject if it can orNot**hingove**rwise.

### LabelOffset

AnalysisWindow Object|AnalysisWindow Members

### MaxColor

This read/write property returns or sets the color setting for the sphere point MAX marker. The range for this value is black indicated as 0(0x0) to white indicated as 16777215 (0xFFFFFF).

### MaxMinSize

This read/write property returns the size of the sphere point marker used to designate the MAX/MIN points. Setting this property to 0 will turn off the sphere point MAX/MIN marker.

### MinColor

This read/write property returns or sets the color setting for the sphere point MIN marker. The range for this value is black indicated as 0(0x0) to white indicated as 16777215 (0xFFFFFF).

### Parent

This read-only property returns the ReportControl object.

### RepaintCustomReport

This method repaints the current custom report object.

### TITLE

This read/write property returns 1 if theA**nalysisWindowo**bject is displaying the dimension title. Setting this property to 0 will turn off the dimension title display.

### Transparent

This read/write property returns 1 if theA**nalysisWindowo**bject has a transparent background. Setting this property to 0 means that the background is not transparent.

### Trihedron

This read/write property returns 1 if theA**nalysisWindowo**bject is displaying the trihedron. Setting this property to 0 will hide the trihedron from displaying.


---

## CadWindow

# CadWindow Object

# Description

# Object Model

# See Also

CadWindow Members

The **CadWindow** object is the one and only cad window for a measurement routine.

| CadWindow Object |

# CadWindow Object Members

# Public Methods

# Public Properties

# See Also

The height of the Cad window in screen pixels.

The left edge of the Cad window, measured from the left edge of the Windows Desktop.

This property is TRUE if the Cad window is visible, FALSE otherwise. If you make the Cad window invisible, the only way to make it visible again is to set this property to TRUE.

The width of the Cad window in screen pixels.

CadWindow Object

Print Prints the CAD window.

_Visible Appl**ication Rep**resents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. For example, the Act**ivePar**tProgram **pr**operty returns a PartProgram object. BackgroundColor Read/Write: Returns/Sets the CAD Background Color BackgroundColor2 Read/Write: Returns/Sets the second CAD Background Color. Applicable only if gradient is not One Color BackgroundGradientType Read/Write: Returns/Sets the CAD Background Gradient Type EmbeddedMode Read/Write: Returns/Sets the Embedded Mode Height The height of the Cad window in screen pixels. Left The left edge of the Cad window, measured from the left edge of the Windows Desktop. Parent Returns the parent CadWindow**s object. **ShowCadTab Read/Write: Gets/Sets CAD View Tab visibility Top The top edge of the Cad window, measured from the top edge of the Windows Desktop. ViewHandle Read Only: According with EmbeddedMode property returns the CAD view handle (false) or the handle of temporary Embeddable frame view (true) Visible This property is TRUE if the Cad window is visible, FALSE otherwise. If you make the Cad window invisible, the only way to make it visible again is to set this property to TRUE. Width The width of the Cad window in screen pixels.

| CadWindow ObjectMembers |

| Print | Prints the CAD window. |

| _Visible | Application | Represents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects. For example, theActivePartProgramproperty returns aPartProgramobject. |
| BackgroundColor | Read/Write:  Returns/Sets the CAD Background Color |
| BackgroundColor2 | Read/Write:  Returns/Sets the second CAD Background Color. Applicable only if gradient is not One Color |
| BackgroundGradientType | Read/Write:  Returns/Sets the CAD Background Gradient Type |
| EmbeddedMode | Read/Write:  Returns/Sets the Embedded Mode |
| Height | The height of the Cad window in screen pixels. |
| Left | The left edge of the Cad window, measured from the left edge of the Windows Desktop. |
| Parent | Returns the parentCadWindowsobject. |
| ShowCadTab | Read/Write:  Gets/Sets CAD View Tab visibility |
| Top | The top edge of the Cad window, measured from the top edge of the Windows Desktop. |
| ViewHandle | Read Only:  According with EmbeddedMode property returns the CAD view handle (false) or the handle of temporary Embeddable frame view (true) |
| Visible | This property is TRUE if the Cad window is visible, FALSE otherwise. If you make the Cad window invisible, the only way to make it visible again is to set this property to TRUE. |
| Width | The width of the Cad window in screen pixels. |

### Application

Represents the read-only PC-DMIS application. The **Application** object includes properties and methods that return top-level objects. For example, the **Active**PartProgr**am** property returns a PartProgram object.

### BackgroundColor

Read/Write: Returns/Sets the CAD Background Color

### BackgroundColor2

Read/Write: Returns/Sets the second CAD Background Color. Applicable only if gradient is not One Color

### BackgroundGradientType

Read/Write: Returns/Sets the CAD Background Gradient Type

### EmbeddedMode

Read/Write: Returns/Sets the Embedded Mode

### Height

The height of the Cad window in screen pixels.

### Left

The left edge of the Cad window, measured from the left edge of the Windows Desktop.

### Parent

Returns the parent **CadWindows** object.

### Print

Prints the CAD window.

### ShowCadTab

Read/Write: Gets/Sets CAD View Tab visibility

### Top

The Top property is measured in screen pixels.

### ViewHandle

Read Only: According with EmbeddedMode property returns the CAD view handle (false) or the handle of temporary Embeddable frame view (true)

### Visible

This property is TRUE if the Cad window is visible, FALSE otherwise. If you make the Cad window invisible, the only way to make it visible again is to set this property to TRUE.

### Width

The width of the Cad window in screen pixels.

### _Visible

Visual Basic Public Property _Visible As Boolean


---

## CadWindows

# CadWindows Object

# Description

# Object Model

# Remarks

# See Also

TheC****adWindo**wso**bject is an object containing a collection ofCadWindowobjects currently available to a measurement routine.

Currently, there is exactly oneC**adWindowo**bject associated with each measurement routine, but theCAD**Windowsobj**ect class is made available for future changes.

CadWindows Members

The ****CadWind**ows** object is an object containing a collection of CadWindow objects currently available to a measurement routine.

Currently, there is exactly one **CadWindow** object associated with each measurement routine, but the **CADWindows** object class is made available for future changes.

| CadWindows Object |

# CadWindows Object Members

# Public Methods

# Public Properties

# See Also

Represents the read-only PC-DMIS application. TheA**pplicationo**bject includes properties and methods that return top-level objects. For example, the ActivePa****rtProgram**pr**operty returns aPartProgramobject.

CadWindows Object

_Item Item Returns the Cad Window Object

Ap**plication R**epresents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. For example, the Active ******PartPro**gr**am** property returns a PartProgram object. Count Returns the number of **CadWindow** objects active in this measurement routine. Parent Represents the parent PartProgram object.

| CadWindows ObjectMembers |

| _Item | Item | Returns the Cad Window Object |

| Application | Represents the read-only PC-DMIS application. TheApplicationobject includes properties and methods that return top-level objects. For example, the ActivePartProgramproperty returns aPartProgramobject. |
| Count | Returns the number ofCadWindowobjects active in this measurement routine. |
| Parent | Represents the parentPartProgramobject. |

### Application

Represents the read-only PC-DMIS application. TheA**pplicationo**bject includes properties and methods that return top-level objects. For example, the ActivePa****rtProgram**pr**operty returns aPartProgramobject.

### Count

Returns the number of **CadWindow** objects active in this measurement routine.

### Item

Since there is only and exactly oneC**adWindowo**bject, it does not matter what you pass into the ID argument. For the sake of future compatibility, you should pass 1 into the ID.

### Parent

Represents the parent **PartProgram** object.

### _Item

Visual Basic Public Function _Item( _ ByVal ID* A*s String _ ) As CadWindow


---

## EditWindow

# EditWindow Object

# Description

# Object Model

# See Also

TheE**ditWindowo**bject represents the Edit window associated with a measurement routine. It is always present, although sometimes it is invisible. When in Command mode, the Edit window lists all the commands in the measurement routine.

EditWindow Members

The Ed**itWindow o**bject represents the Edit window associated with a measurement routine. It is always present, although sometimes it is invisible. When in Command mode, the Edit window lists all the commands in the measurement routine.

| EditWindow Object |

# EditWindow Object Members

# Public Methods

# Public Properties

# See Also

This function puts the Edit window into command mode.

This method copies the selected command or commands from the Edit window to the Clipboard.

This method pastes any PC-DMIS commands stored on the Clipboard into the Edit window at the current insertion point. You should first copy the commands usingCopySelectedToClipboard.

This pastes a mirrored pattern of a copied feature or group of features that are stored in the Clipboard. It pastes the feature or features at the current insertion point location using the pattern mirror defined in theSetPasteWithPatternMirrormethod.

This function puts the Edit window into report mode.

If you specify a command object to select, it selects that entire command in the Edit window. Otherwise, it selects the entire command surrounding the cursor location in the Edit window.

You can use this method to perform automation tasks on a selected command. Once you have it selected, you can copy and paste it somewhere else in the Edit window using theCopySelectedToClipBoardandPasteFromClipboardmethods.

This function sets output options for printing the Edit window contents as a DMIS file.

This defines the mirror pattern to use when pasting with thePasteFromClipboardWithPatternmethod. It can mirror the pattern around the X, Y, or Z axis.

This function allows you to set Edit window print options.

This function allows you to set extended Edit window print options.

The height of the edit window in screen pixels.

This property is TRUE if alignments are being shown in the edit window, FALSE otherwise.

This property is TRUE if comments are being shown in the edit window, FALSE otherwise.

This property is TRUE if dimensions are being shown in the edit window, FALSE otherwise.

This property is TRUE if features are being shown in the edit window, FALSE otherwise.

This property is TRUE if headers and footers are being shown in the edit window, FALSE otherwise.

This property is TRUE if hits are being shown in the edit window, FALSE otherwise.

This property is TRUE if moves are being shown in the edit window, FALSE otherwise.

This property is TRUE if only out-of-tolerance dimensions are being shown in the edit window, FALSE otherwise. If ShowDimensions is FALSE, this property is ignored.

This property is TRUE if tips are being shown in the edit window, FALSE otherwise.

This property is TRUE if the edit window is visible, FALSE otherwise.

The width of the edit window in screen pixels.

EditWindow Object

Co*mmandMo*de This function puts the Edit window into command mode. CopySelectedToClipboard This method copies the selected command or commands from the Edit window to the Clipboard. CutSelectedToClipboard This cuts any text or commands selected in the Edit window and stores them in the Clipboard. DMISMode Switches edit window to DMIS mode GetCommandText This function returns a string of the current command text for the specified command in Command . LastExecutionReportMode Switches edit window to last execution report mode PasteFromClipboard This method pastes any PC-DMIS commands stored on the Clipboard into the Edit window at the current insertion point. You should first copy the commands using CopySelectedToClipboard . PasteFromClipboardWithPattern This pastes a mirrored pattern of a copied feature or group of features that are stored in the Clipboard. It pastes the feature or features at the current insertion point location using the pattern mirror defined in the SetPasteWithPatternMirror method. PrintEditWindow Causes edit window to print current window contents ReportMode This function puts the Edit window into report mode. SelectCommand If you specify a command object to select, it selects that entire command in the Edit window. Otherwise, it selects the entire command surrounding the cursor location in the Edit window. You can use this method to perform automation tasks on a selected command. Once you have it selected, you can copy and paste it somewhere else in the Edit window using the CopySelectedToClipBoard and PasteFromClipboard methods. selectCommands This behaves the same as SelectCommand , except you can use this to select a block of commands. You do this by defining a start command and an end command. This selects those commands and everything in between. SetDMISOutputOptions This function sets output options for printing the Edit window contents as a DMIS file. SetPasteWithPatternMirror This defines the mirror pattern to use when pasting with the PasteFromClipboardWithPattern method. It can mirror the pattern around the X, Y, or Z axis. setPasteWithPatternParameters setPasteWithPatternParameters SetPrintOptions This function allows you to set Edit window print options. SetPrintOptionsEx This function allows you to set extended Edit window print options. SummaryMode Switches edit window to summary mode UnselectAll This deselects any selected commands or text in the Edit window.

_Visible Application Represents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. For example, the ActivePar**tProgram pr**operty returns a PartProgram object. Height The height of the edit window in screen pixels. Left The left edge of the edit window, measured from the left edge of the Windows Desktop. Parent Returns the parent PartProgram of this object. ShowAlignments This property is TRUE if alignments are being shown in the edit window, FALSE otherwise. ShowComments This property is TRUE if comments are being shown in the edit window, FALSE otherwise. ShowDimensions This property is TRUE if dimensions are being shown in the edit window, FALSE otherwise. ShowFeatures This property is TRUE if features are being shown in the edit window, FALSE otherwise. ShowHeaderFooter This property is TRUE if headers and footers are being shown in the edit window, FALSE otherwise. ShowHits This property is TRUE if hits are being shown in the edit window, FALSE otherwise. ShowMoves This property is TRUE if moves are being shown in the edit window, FALSE otherwise. ShowOutTolOnly This property is TRUE if only out-of-tolerance dimensions are being shown in the edit window, FALSE otherwise. If ShowDimensions is FALSE, this property is ignored. ShowTips This property is TRUE if tips are being shown in the edit window, FALSE otherwise. Top The top edge of the edit window, measured from the top edge of the Windows Desktop. Visible This property is TRUE if the edit window is visible, FALSE otherwise. Width The width of the edit window in screen pixels.

| EditWindow ObjectMembers |

| CommandMode | This function puts the Edit window into command mode. |
| CopySelectedToClipboard | This method copies the selected command or commands from the Edit window to the Clipboard. |
| CutSelectedToClipboard | This cuts any text or commands selected in the Edit window and stores them in the Clipboard. |
| DMISMode | Switches edit window to DMIS mode |
| GetCommandText | This function returns a string of the current command text for the specified command inCommand. |
| LastExecutionReportMode | Switches edit window to last execution report mode |
| PasteFromClipboard | This method pastes any PC-DMIS commands stored on the Clipboard into the Edit window at the current insertion point. You should first copy the commands usingCopySelectedToClipboard. |
| PasteFromClipboardWithPattern | This pastes a mirrored pattern of a copied feature or group of features that are stored in the Clipboard. It pastes the feature or features at the current insertion point location using the pattern mirror defined in theSetPasteWithPatternMirrormethod. |
| PrintEditWindow | Causes edit window to print current window contents |
| ReportMode | This function puts the Edit window into report mode. |
| SelectCommand | If you specify a command object to select, it selects that entire command in the Edit window. Otherwise, it selects the entire command surrounding the cursor location in the Edit window.You can use this method to perform automation tasks on a selected command. Once you have it selected, you can copy and paste it somewhere else in the Edit window using theCopySelectedToClipBoardandPasteFromClipboardmethods. |
| selectCommands | This behaves the same asSelectCommand, except you can use this to select a block of commands. You do this by defining a start command and an end command. This selects those commands and everything in between. |
| SetDMISOutputOptions | This function sets output options for printing the Edit window contents as a DMIS file. |
| SetPasteWithPatternMirror | This defines the mirror pattern to use when pasting with thePasteFromClipboardWithPatternmethod. It can mirror the pattern around the X, Y, or Z axis. |
| setPasteWithPatternParameters | setPasteWithPatternParameters |
| SetPrintOptions | This function allows you to set Edit window print options. |
| SetPrintOptionsEx | This function allows you to set extended Edit window print options. |
| SummaryMode | Switches edit window to summary mode |
| UnselectAll | This deselects any selected commands or text in the Edit window. |

| _Visible | Application | Represents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. For example, the ActivePartProgram property returns aPartProgramobject. |
| Height | The height of the edit window in screen pixels. |
| Left | The left edge of the edit window, measured from the left edge of the Windows Desktop. |
| Parent | Returns the parent PartProgram of this object. |
| ShowAlignments | This property is TRUE if alignments are being shown in the edit window, FALSE otherwise. |
| ShowComments | This property is TRUE if comments are being shown in the edit window, FALSE otherwise. |
| ShowDimensions | This property is TRUE if dimensions are being shown in the edit window, FALSE otherwise. |
| ShowFeatures | This property is TRUE if features are being shown in the edit window, FALSE otherwise. |
| ShowHeaderFooter | This property is TRUE if headers and footers are being shown in the edit window, FALSE otherwise. |
| ShowHits | This property is TRUE if hits are being shown in the edit window, FALSE otherwise. |
| ShowMoves | This property is TRUE if moves are being shown in the edit window, FALSE otherwise. |
| ShowOutTolOnly | This property is TRUE if only out-of-tolerance dimensions are being shown in the edit window, FALSE otherwise. If ShowDimensions is FALSE, this property is ignored. |
| ShowTips | This property is TRUE if tips are being shown in the edit window, FALSE otherwise. |
| Top | The top edge of the edit window, measured from the top edge of the Windows Desktop. |
| Visible | This property is TRUE if the edit window is visible, FALSE otherwise. |
| Width | The width of the edit window in screen pixels. |

### Application

Represents the read-only PC-DMIS application. The Application object includes properties and methods that return top-level objects. For example, the Active**PartProgram** property returns a PartProgram object.

### CommandMode

This function puts the Edit window into command mode.

### CopySelectedToClipboard

This method copies the selected command or commands from the Edit window to the Clipboard.

### CutSelectedToClipboard

This cuts any text or commands selected in the Edit window and stores them in the Clipboard.

### DMISMode

Switches edit window to DMIS mode

### GetCommandText

This function returns a string of the current command text for the specified command in *Command* .

### Height

The height of the edit window in screen pixels.

### LastExecutionReportMode

Switches edit window to last execution report mode

### Left

The Left property is measured in screen pixels.

### Parent

Returns the parent PartProgram of this object.

### PasteFromClipboard

This method pastes any PC-DMIS commands stored on the Clipboard into the Edit window at the current insertion point. You should first copy the commands usingCopySelectedToClipboard.

### PasteFromClipboardWithPattern

This pastes a mirrored pattern of a copied feature or group of features that are stored in the Clipboard. It pastes the feature or features at the current insertion point location using the pattern mirror defined in theSetPasteWithPatternMirrormethod.

### PrintEditWindow

Causes edit window to print current window contents

### ReportMode

This function puts the Edit window into report mode.

### SelectCommand

If you specify a command object to select, it selects that entire command in the Edit window. Otherwise, it selects the entire command surrounding the cursor location in the Edit window.

### SetDMISOutputOptions

This function sets output options for printing the Edit window contents as a DMIS file.

### SetPasteWithPatternMirror

A long value of 0, 1, 2, or 3:

### SetPrintOptions

This function allows you to set Edit window print options.

### SetPrintOptionsEx

This function allows you to set extended Edit window print options.

### ShowAlignments

This property is TRUE if alignments are being shown in the edit window, FALSE otherwise.

### ShowComments

This property is TRUE if comments are being shown in the edit window, FALSE otherwise.

### ShowDimensions

This property is TRUE if dimensions are being shown in the edit window, FALSE otherwise.

### ShowFeatures

This property is TRUE if features are being shown in the edit window, FALSE otherwise.

### ShowHeaderFooter

This property is TRUE if headers and footers are being shown in the edit window, FALSE otherwise.

### ShowHits

This property is TRUE if hits are being shown in the edit window, FALSE otherwise.

### ShowMoves

This property is TRUE if moves are being shown in the edit window, FALSE otherwise.

### ShowOutTolOnly

This property is TRUE if only out-of-tolerance dimensions are being shown in the edit window, FALSE otherwise. If ShowDimensions is FALSE, this property is ignored.

### ShowTips

This property is TRUE if tips are being shown in the edit window, FALSE otherwise.

### SummaryMode

Switches edit window to summary mode

### Top

The Top property is measured in screen pixels.

### UnselectAll

This deselects any selected commands or text in the Edit window.

### Visible

This property is TRUE if the edit window is visible, FALSE otherwise.

### Width

The width of the edit window in screen pixels.

### _Visible

Visual Basic Public Property _Visible As Boolean

### selectCommands

This behaves the same as SelectCommand , except you can use this to select a block of commands. You do this by defining a start command and an end command. This selects those commands and everything in between.

### setPasteWithPatternParameters

setPasteWithPatternParameters


---

## ExecutionWindow

# ExecutionWindow Object

# Description

# Object Model

# See Also

The **Execution**Window object contains methods and properties to control theExecutiondialog box in PC-DMIS.

If you execute a measurement routine with collision detection, theC**ollision Detectiond**ialog box controls the execution. It adds some additional buttons beyond what theExe**cutiondia**log box has.

ExecutionWindow Members

The ****Executi**on**Window object contains methods and properties to control the Execution dialog box in PC-DMIS. If you execute a measurement routine with collision detection, the **Collision Detection** dialog box controls the execution. It adds some additional buttons beyond what the Execution dialog box has.

| ExecutionWindow Object |

# ExecutionWindow Object Members

# Public Methods

# Public Properties

# See Also

ExecutionWindow Object

BringToZPosition This method sets the Z position of the E******************************x**ec**ut**io**n d**ialog box based on the parameter's value. When you have multiple dialog boxes or windows, the Z position controls the order in which the item appears. C**ancelE**xecution This method presses the Cancel button on the Execution dialog box to stop execution and close the dialog box. C**ontinue **This method presses the Continue button on the Execution dialog box. This resumes execution of a measurement routine. EraseHit This method presses the **Erase Hit** button on the Execution dialog box. This removes the current highlighted hit from the dialog box. J**ump **This method presses the Jump button on the Execution dialog box. This stops execution and displays the **Jump to Features** list dialog box so you can jump to a new feature. NewRow This method presses the **New Row** button on the Execution dialog box. This starts a new row for the manual scan being executed. ScaleProbe This method presses the **Scale Probe** button on the ******Collision Detec**ti**on** dialog box. ScanDone This method presses the **Scan Done** button on the Execution dialog box. This stops collecting data in a manual scan and processes the data. S**kip **This method presses the Skip button on the Execution dialog box. This skips the next command displayed in the dialog box. StepInto This method presses the **Step Into** button on the Collision Detection dialog box. StepNext This method presses the **Step Next** button on the Execution dialog box. This continues the measurement processes by stepping through each new command. stop This method presses the **Stop** button on the Execution dialog box. It also halts the probe at its curent position and suspends execution of the measurement routine. W**atch **This method presses the Watch button on the Collision Detection dialog box.

_Visible Application Read Only: Returns Application object ArmNumber This read-only value returns the CMM arm number used during execution. Available This read-only value determines if the Execution window is available. Caption This read-only property returns the Execution window's caption (title on titlebar). Height This read/write property returns or sets the height of the Execution window. Left This read/write property returns or sets the left coordinate of the Execution window. Parent Read Only: Returns the PartProgram object ProgressBarPercentage This read only property returns the percentage value of the progress bar on the Execution window. A positive value means the execution has started. A negative value means the execution percentage is not available. ShowContinueButton This returns or sets the Contin**ue button**'s visibility state in the Execution window. ShowJumpButton This returns or sets the Jump b**utton**'s visibility state in the Execution window. ShowSkipButton This returns or sets the Skip b**utton**'s visibility state in the Execution window. ShowStopButton This returns or sets the Stop b**utton**'s visibility state in the Execution window. Top This read/write property returns or sets the top coordinate of the Execution window. Visible This read/write property returns or sets the visibility status of the Execution window. Width This read/write property returns or sets the width of the Execution window.

| ExecutionWindow ObjectMembers |

| BringToZPosition | This method sets the Z position of theExecutiondialog box based on the parameter's value.When you have multiple dialog boxes or windows, the Z position controls the order in which the item appears. |
| CancelExecution | This method presses theCancelbutton on theExecutiondialog box to stop execution and close the dialog box. |
| Continue | This method presses theContinuebutton on theExecutiondialog box. This resumes execution of a measurement routine. |
| EraseHit | This method presses theErase Hitbutton on theExecutiondialog box. This removes the current highlighted hit from the dialog box. |
| Jump | This method presses theJumpbutton on theExecutiondialog box. This stops execution and displays theJump to Featureslist dialog box so you can jump to a new feature. |
| NewRow | This method presses theNew Rowbutton on theExecutiondialog box. This starts a new row for the manual scan being executed. |
| ScaleProbe | This method presses theScale Probebutton on theCollision Detectiondialog box. |
| ScanDone | This method presses theScan Donebutton on theExecutiondialog box. This stops collecting data in a manual scan and processes the data. |
| Skip | This method presses theSkipbutton on theExecutiondialog box. This skips the next command displayed in the dialog box. |
| StepInto | This method presses theStep Intobutton on theCollision Detectiondialog box. |
| StepNext | This method presses theStep Nextbutton on theExecutiondialog box. This continues the measurement processes by stepping through each new command. |
| stop | This method presses theStopbutton on theExecutiondialog box. It also halts the probe at its curent position and suspends execution of the measurement routine. |
| Watch | This method presses theWatchbutton on theCollision Detectiondialog box. |

| _Visible | Application | Read Only:  Returns Application object |
| ArmNumber | This read-only value returns the CMM arm number used during execution. |
| Available | This read-only value determines if the Execution window is available. |
| Caption | This read-only property returns the Execution window's caption (title on titlebar). |
| Height | This read/write property returns or sets the height of the Execution window. |
| Left | This read/write property returns or sets the left coordinate of the Execution window. |
| Parent | Read Only:  Returns the PartProgram object |
| ProgressBarPercentage | This read only property returns the percentage value of the progress bar on the Execution window. A positive value means the execution has started. A negative value means the execution percentage is not available. |
| ShowContinueButton | This returns or sets theContinuebutton's visibility state in the Execution window. |
| ShowJumpButton | This returns or sets theJumpbutton's visibility state in the Execution window. |
| ShowSkipButton | This returns or sets theSkipbutton's visibility state in the Execution window. |
| ShowStopButton | This returns or sets theStopbutton's visibility state in the Execution window. |
| Top | This read/write property returns or sets the top coordinate of the Execution window. |
| Visible | This read/write property returns or sets the visibility status of the Execution window. |
| Width | This read/write property returns or sets the width of the Execution window. |

### Application

ExecutionWindow Object|ExecutionWindow Members

### ArmNumber

ExecutionWindow Object|ExecutionWindow Members

### Available

This returns True if the Execution window is available.

### BringToZPosition

ExecutionWindow Object|ExecutionWindow Members

### CancelExecution

ExecutionWindow Object|ExecutionWindow Members

### Caption

ExecutionWindow Object|ExecutionWindow Members

### Continue

ExecutionWindow Object|ExecutionWindow Members

### EraseHit

ExecutionWindow Object|ExecutionWindow Members

### Height

ExecutionWindow Object|ExecutionWindow Members

### Jump

ExecutionWindow Object|ExecutionWindow Members

### Left

ExecutionWindow Object|ExecutionWindow Members

### NewRow

ExecutionWindow Object|ExecutionWindow Members

### Parent

ExecutionWindow Object|ExecutionWindow Members

### ProgressBarPercentage

ExecutionWindow Object|ExecutionWindow Members

### ScaleProbe

ExecutionWindow Object|ExecutionWindow Members

### ScanDone

ExecutionWindow Object|ExecutionWindow Members

### ShowContinueButton

Read/write Boolean.

### ShowJumpButton

Read/write Boolean.

### ShowSkipButton

Read/write Boolean.

### ShowStopButton

Read/write Boolean.

### Skip

ExecutionWindow Object|ExecutionWindow Members

### StepInto

ExecutionWindow Object|ExecutionWindow Members

### StepNext

ExecutionWindow Object|ExecutionWindow Members

### Top

ExecutionWindow Object|ExecutionWindow Members

### Visible

Read/write Boolean.

### Watch

ExecutionWindow Object|ExecutionWindow Members

### Width

ExecutionWindow Object|ExecutionWindow Members

### _Visible

ExecutionWindow Object|ExecutionWindow Members

### stop

ExecutionWindow Object|ExecutionWindow Members


---

## LIVWindow

# LIVWindow Object

# Description

# See Also

TheL**IVWindowo**bject gives access to the live image view (sometimes call the Live Window or Live View) that is used in PC-DMIS Vi**sion. **In PC-DMIS, this view appears in aVisiontab in the Graphics Display window. The additional tab shows a real-time view from the camera on a vision probe. Other applications can use the Live View to support the display and execution of Vision measurement routines.

LIVWindow Members

The **LIVWindow** object gives access to the live image view (sometimes call the Live Window or Live View) that is used in PC-DMIS **Vision**. In PC-DMIS, this view appears in a Vision tab in the Graphics Display window. The additional tab shows a real-time view from the camera on a vision probe. Other applications can use the Live View to support the display and execution of Vision measurement routines.

| LIVWindow Object |

# LIVWindow Object Members

# Public Methods

# Public Properties

# See Also

This property determines if the Live View scale-to-fit functionality is enabled in theV**isiont**ab. This scale-to-fit functionality resizes the live image view in the parent window to be as large as possible while maintaining the image aspect ratio.

LIVWindow Object

LIVTabShow This method shows or hides the V****ision** **tab. This determines whether the Vision tab is functional.

EmbeddedMode Read/Write: Returns/Sets the Embedded Mode EnableQuickFeature This property determines whether the QuickFeature functionality is enabled in the Vi******************si**on **ta**b. EnableRightClickMenu This property determines whether the right-click shortcut menu is enabled in the Vision tab. EnableScaleToFit This property determines if the Live View scale-to-fit functionality is enabled in the Vision tab. This scale-to-fit functionality resizes the live image view in the parent window to be as large as possible while maintaining the image aspect ratio. EnableZoomBoxSelect This property determines whether the zoom box-select functionality is enabled in the Vision tab. LiveImageViewAvailable This property returns the availability of the handle for the Vision tab. LiveImageViewHandle This property returns the HWND window pointer for the Vision tab as an integer.

| LIVWindow ObjectMembers |

| LIVTabShow | This method shows or hides theVisiontab. This determines whether theVisiontab is functional. |

| EmbeddedMode | Read/Write:  Returns/Sets the Embedded Mode |
| EnableQuickFeature | This property determines whether the QuickFeature functionality is enabled in theVisiontab. |
| EnableRightClickMenu | This property determines whether the right-click shortcut menu is enabled in theVisiontab. |
| EnableScaleToFit | This property determines if the Live View scale-to-fit functionality is enabled in theVisiontab. This scale-to-fit functionality resizes the live image view in the parent window to be as large as possible while maintaining the image aspect ratio. |
| EnableZoomBoxSelect | This property determines whether the zoom box-select functionality is enabled in theVisiontab. |
| LiveImageViewAvailable | This property returns the availability of the handle for theVisiontab. |
| LiveImageViewHandle | This property returns the HWND window pointer for theVisiontab as an integer. |

### EmbeddedMode

Read/Write: Returns/Sets the Embedded Mode

### EnableQuickFeature

Read/writeB**oolean.**

### EnableRightClickMenu

Read/writeB**oolean.**

### EnableScaleToFit

This property determines if the Live View scale-to-fit functionality is enabled in theV**isiont**ab. This scale-to-fit functionality resizes the live image view in the parent window to be as large as possible while maintaining the image aspect ratio.

### EnableZoomBoxSelect

Read/writeB**oolean.**

### LIVTabShow

Integer value of 0 or 1.

### LiveImageViewAvailable

Read-onlyB**oolean.**

### LiveImageViewHandle

This property returns the HWND window pointer for the **Vision** tab as an integer.


---

## ReadoutWindow

# ReadoutWindow Object

# Description

# Object Model

# Example

# See Also

This object lets you work with PC-DMIS's Probe Readout window.

Private Sub CommandAngles()' This subroutine returns the AB AnglesDim App As PCDLRN.ApplicationSet App = CreateObject("PCDLRN.Application")Dim Part As PCDLRN.PartProgramSet Part = App.ActivePartProgramDim DRO As PCDLRN.ReadoutWindowSet DRO = Part.GetReadoutWindow(1)MsgBox "A = " & DRO.GetAAngle(1) & ", B = " & DRO.GetBAngle(1)End Sub

ReadoutWindow Members|Machine Object

Private Sub CommandAngles() ' This subroutine returns the AB Angles Dim App As PCDLRN.Application Set App = CreateObject("PCDLRN.Application") Dim Part As PCDLRN.PartProgram Set Part = App.ActivePartProgram Dim DRO As PCDLRN.ReadoutWindow Set DRO = Part.GetReadoutWindow(1) MsgBox "A = " & DRO.GetAAngle(1) & ", B = " & DRO.GetBAngle(1) End Sub

ReadoutWindow Members | Machine Object

| ReadoutWindow Object |

# ReadoutWindow Object Members

# Public Methods

# Public Properties

# See Also

ReadoutWindow Object|Machine Object

GetAAngle Read Only: Returns the current A Angle GetBAngle Read Only: Returns the current B Angle

_Visible Application Read Only: Returns Application object ApplyDimensionColor Read/Write: Returns/Sets apply dimension color in probe readout window Available Read Only: Returns whether the execute dialog is currently available. Other functions do not work when this returns false. CenterProbeOnGraphicsWindow Read/Write: Returns/Sets center probe in graphics window while viewing probe readout window DisplayDistanceToClosestCAD Read/Write: Returns/Sets show display distance to closest cad in probe readout window DisplayPromptHistory Read/Write: Returns/Sets display prompt history in probe readout window DisplayXAxis Read/Write: Returns/Sets display X axis in probe readout window DisplayYAxis Read/Write: Returns/Sets display Y axis in probe readout window DisplayZAxis Read/Write: Returns/Sets display Z axis in probe readout window Height Read/Write: Returns/Sets the height of the probe readout window HitCount Read Only: Returns the number of hits currently shown in the readouts window Left Read/Write: Returns/Sets the left coordinate of the probe readout window Maximized Read/Write: Returns/Sets show maximized window Minimized Read/Write: Returns/Sets show minimized window Parent Read Only: Returns the PartProgram object ShowCurrentProbePositionOnScreen Read/Write: Returns/Sets show current probe position on screen while viewing probe readout window ShowDeviationArrowOnScreen Read/Write: Returns/Sets show deviation arrow on screen while viewing probe readout window ShowDistanceToTarget Read/Write: Returns/Sets show distance to target in probe readout window ShowDistanceToTargetToClosestFeature Read/Write: Returns/Sets show distance to target closest feature in probe readout window ShowDistanceToTargetToExecutingFeature Read/Write: Returns/Sets show distance to target to executing feature in probe readout window ShowDistanceToTargetWithAutoZoom Read/Write: Returns/Sets show distance to target with auto-zoom in probe readout window ShowErrorLastMeasuredFeature Read/Write: Returns/Sets show error of last measured feature in probe readout window ShowFeatureID Read/Write: Returns/Sets show feature id in probe readout window ShowFeatureType Read/Write: Returns/Sets show feature type in probe readout window ShowLastHit Read/Write: Returns/Sets show last hit in probe readout window ShowProbePosition Read/Write: Returns/Sets show probe position type in probe readout window ShowTargetToCentroid Read/Write: Returns/Sets show target to centroid in probe readout window ShowTargetToSurfaceEdge Read/Write: Returns/Sets show target to surface/edge in probe readout window Top Read/Write: Returns/Sets the top coordinate of the probe readout window TrackerBuildMode Read/Write: Returns/Sets tracker build mode TrackerInspectMode Read/Write: Returns/Sets inspect mode TrackerShowRMS Read/Write: Returns/Sets show tracker RMS in probe readout window UseMachineCoordinateSystem Read/Write: Returns/Sets use machine coordinate systems in probe readout window UsePolarCoordinates Read/Write: Returns/Sets use polar coordinates in probe readout window Visible Read/Write: Returns/Sets probe readout window visibility status Width Read/Write: Returns/Sets the width of the probe readout window

ReadoutWindow Object | Machine Object

| ReadoutWindow ObjectMembers |

| GetAAngle | Read Only: Returns the current A Angle |
| GetBAngle | Read Only: Returns the current B Angle |

| _Visible | Application | Read Only:  Returns Application object |
| ApplyDimensionColor | Read/Write:  Returns/Sets apply dimension color in probe readout window |
| Available | Read Only:  Returns whether the execute dialog is currently available.  Other functions do not work when this returns false. |
| CenterProbeOnGraphicsWindow | Read/Write:  Returns/Sets center probe in graphics window while viewing probe readout window |
| DisplayDistanceToClosestCAD | Read/Write:  Returns/Sets show display distance to closest cad in probe readout window |
| DisplayPromptHistory | Read/Write:  Returns/Sets display prompt history in probe readout window |
| DisplayXAxis | Read/Write:  Returns/Sets display X axis in probe readout window |
| DisplayYAxis | Read/Write:  Returns/Sets display Y axis in probe readout window |
| DisplayZAxis | Read/Write:  Returns/Sets display Z axis in probe readout window |
| Height | Read/Write:  Returns/Sets the height of the probe readout window |
| HitCount | Read Only: Returns the number of hits currently shown in the readouts window |
| Left | Read/Write:  Returns/Sets the left coordinate of the probe readout window |
| Maximized | Read/Write:  Returns/Sets show maximized window |
| Minimized | Read/Write:  Returns/Sets show minimized window |
| Parent | Read Only:  Returns the PartProgram object |
| ShowCurrentProbePositionOnScreen | Read/Write:  Returns/Sets show current probe position on screen while viewing probe readout window |
| ShowDeviationArrowOnScreen | Read/Write:  Returns/Sets show deviation arrow on screen while viewing probe readout window |
| ShowDistanceToTarget | Read/Write:  Returns/Sets show distance to target in probe readout window |
| ShowDistanceToTargetToClosestFeature | Read/Write:  Returns/Sets show distance to target closest feature in probe readout window |
| ShowDistanceToTargetToExecutingFeature | Read/Write:  Returns/Sets show distance to target to executing feature in probe readout window |
| ShowDistanceToTargetWithAutoZoom | Read/Write:  Returns/Sets show distance to target with auto-zoom in probe readout window |
| ShowErrorLastMeasuredFeature | Read/Write:  Returns/Sets show error of last measured feature in probe readout window |
| ShowFeatureID | Read/Write:  Returns/Sets show feature id in probe readout window |
| ShowFeatureType | Read/Write:  Returns/Sets show feature type in probe readout window |
| ShowLastHit | Read/Write:  Returns/Sets show last hit in probe readout window |
| ShowProbePosition | Read/Write:  Returns/Sets show probe position type in probe readout window |
| ShowTargetToCentroid | Read/Write:  Returns/Sets show target to centroid in probe readout window |
| ShowTargetToSurfaceEdge | Read/Write:  Returns/Sets show target to surface/edge in probe readout window |
| Top | Read/Write:  Returns/Sets the top coordinate of the probe readout window |
| TrackerBuildMode | Read/Write:  Returns/Sets tracker build mode |
| TrackerInspectMode | Read/Write:  Returns/Sets inspect mode |
| TrackerShowRMS | Read/Write:  Returns/Sets show tracker RMS in probe readout window |
| UseMachineCoordinateSystem | Read/Write:  Returns/Sets use machine coordinate systems in probe readout window |
| UsePolarCoordinates | Read/Write:  Returns/Sets use polar coordinates in probe readout window |
| Visible | Read/Write:  Returns/Sets probe readout window visibility status |
| Width | Read/Write:  Returns/Sets the width of the probe readout window |

### Application

Read Only: Returns Application object

### ApplyDimensionColor

Read/Write: Returns/Sets apply dimension color in probe readout window

### Available

Read Only: Returns whether the execute dialog is currently available. Other functions do not work when this returns false.

### CenterProbeOnGraphicsWindow

Read/Write: Returns/Sets center probe in graphics window while viewing probe readout window

### DisplayDistanceToClosestCAD

Read/Write: Returns/Sets show display distance to closest cad in probe readout window

### DisplayPromptHistory

Read/Write: Returns/Sets display prompt history in probe readout window

### DisplayXAxis

Read/Write: Returns/Sets display X axis in probe readout window

### DisplayYAxis

Read/Write: Returns/Sets display Y axis in probe readout window

### DisplayZAxis

Read/Write: Returns/Sets display Z axis in probe readout window

### GetAAngle

Integer value specifying the arm for which the angles are being requested.

### GetBAngle

Integer value specifying the arm for which the angles are being requested.

### Height

Read/Write: Returns/Sets the height of the probe readout window

### HitCount

Read Only: Returns the number of hits currently shown in the readouts window

### Left

Read/Write: Returns/Sets the left coordinate of the probe readout window

### Maximized

Read/Write: Returns/Sets show maximized window

### Minimized

Read/Write: Returns/Sets show minimized window

### Parent

Read Only: Returns the PartProgram object

### ShowCurrentProbePositionOnScreen

Read/Write: Returns/Sets show current probe position on screen while viewing probe readout window

### ShowDeviationArrowOnScreen

Read/Write: Returns/Sets show deviation arrow on screen while viewing probe readout window

### ShowDistanceToTarget

Read/Write: Returns/Sets show distance to target in probe readout window

### ShowDistanceToTargetToClosestFeature

Read/Write: Returns/Sets show distance to target closest feature in probe readout window

### ShowDistanceToTargetToExecutingFeature

Read/Write: Returns/Sets show distance to target to executing feature in probe readout window

### ShowDistanceToTargetWithAutoZoom

Read/Write: Returns/Sets show distance to target with auto-zoom in probe readout window

### ShowErrorLastMeasuredFeature

Read/Write: Returns/Sets show error of last measured feature in probe readout window

### ShowFeatureID

Read/Write: Returns/Sets show feature id in probe readout window

### ShowFeatureType

Read/Write: Returns/Sets show feature type in probe readout window

### ShowLastHit

Read/Write: Returns/Sets show last hit in probe readout window

### ShowProbePosition

Read/Write: Returns/Sets show probe position type in probe readout window

### ShowTargetToCentroid

Read/Write: Returns/Sets show target to centroid in probe readout window

### ShowTargetToSurfaceEdge

Read/Write: Returns/Sets show target to surface/edge in probe readout window

### Top

Read/Write: Returns/Sets the top coordinate of the probe readout window

### TrackerBuildMode

Read/Write: Returns/Sets tracker build mode

### TrackerInspectMode

Read/Write: Returns/Sets inspect mode

### TrackerShowRMS

Read/Write: Returns/Sets show tracker RMS in probe readout window

### UseMachineCoordinateSystem

Read/Write: Returns/Sets use machine coordinate systems in probe readout window

### UsePolarCoordinates

Read/Write: Returns/Sets use polar coordinates in probe readout window

### Visible

Read/Write: Returns/Sets probe readout window visibility status

### Width

Read/Write: Returns/Sets the width of the probe readout window

### _Visible

Visual Basic Public Property _Visible As Boolean


---

## ReportWindow

# ReportWindow Object

# Description

# Object Model

# See Also

ReportWindow Members

The ReportWindow object allows you to get or set various settings for the Report window.

| ReportWindow Object |

# ReportWindow Object Members

# Public Methods

# Public Properties

# See Also

This method sets the current report as the default report for the measurement routine.

This returns or sets the visibility state of the Report window.

ReportWindow Object

FullReportMode This method switches the report window to Full Report Mode. GenerateStatusReportBitmap Generates a status report for a range of commands GenerateStatusReportBitmapId Generates a status report for a range of commands GenerateStatusReportBitmapUid Generates a status report for a range of commands GetCustomReportName Returns the name of the custom report name associated with the i*ndex v*alue. LastExecutionReportMode This method switches the report window to Last Execution Report Mode. LoadCustomReport This method loads the specified custom report into the Report window. LoadReportTemplate This method loads the specified report template into the Report window. PrintReport This method prints the contents of the Report window. RefreshReport This method reloads the report data into the report template, thereby refreshing the contents of the Report window. SetCurrentAsDefaultReport This method sets the current report as the default report for the measurement routine.

Ap**plication T**his property represents the read-only PC-DMIS A**pplication o**bject. The Application object includes properties and methods that return top-level objects. CurrentReport This read-only property returns the full directory pathway to the Custom Report or Report Template used in the Report window. CustomReportCount This read-only property returns the number of Custom Reports defined for the current measurement routine. Height Read/Write: Returns/Sets height of report window Left Read/Write: Returns/Sets left coordinate of report window Page**s Re**turns a collection of Pag**e obj**ects (one Page object for each page making up the report) as a Pag**es obj**ect. Parent This returns the parent Par**tProgram obj**ect. Top Read/Write: Returns/Sets top coordinate of report window Visible This returns or sets the visibility state of the Report window. Width Read/Write: Returns/Sets width of report window

| ReportWindow ObjectMembers |

| FullReportMode | This method switches the report window to Full Report Mode. |
| GenerateStatusReportBitmap | Generates a status report for a range of commands |
| GenerateStatusReportBitmapId | Generates a status report for a range of commands |
| GenerateStatusReportBitmapUid | Generates a status report for a range of commands |
| GetCustomReportName | Returns the name of the custom report name associated with theindexvalue. |
| LastExecutionReportMode | This method switches the report window to Last Execution Report Mode. |
| LoadCustomReport | This method loads the specified custom report into the Report window. |
| LoadReportTemplate | This method loads the specified report template into the Report window. |
| PrintReport | This method prints the contents of the Report window. |
| RefreshReport | This method reloads the report data into the report template, thereby refreshing the contents of the Report window. |
| SetCurrentAsDefaultReport | This method sets the current report as the default report for the measurement routine. |

| Application | This property represents the read-only PC-DMISApplicationobject. TheApplicationobject includes properties and methods that return top-level objects. |
| CurrentReport | This read-only property returns the full directory pathway to the Custom Report or Report Template used in the Report window. |
| CustomReportCount | This read-only property returns the number of Custom Reports defined for the current measurement routine. |
| Height | Read/Write:  Returns/Sets height of report window |
| Left | Read/Write:  Returns/Sets left coordinate of report window |
| Pages | Returns a collection ofPageobjects (onePageobject for each page making up the report) as aPagesobject. |
| Parent | This returns the parentPartProgramobject. |
| Top | Read/Write:  Returns/Sets top coordinate of report window |
| Visible | This returns or sets the visibility state of the Report window. |
| Width | Read/Write:  Returns/Sets width of report window |

### Application

This property represents the read-only PC-DMIS ****Applicatio**n** object. The Application object includes properties and methods that return top-level objects.

### CurrentReport

Dim PartProg As Object

### CustomReportCount

Dim PartProg As Object

### FullReportMode

Dim PartProg As Object

### GenerateStatusReportBitmap

Generates a status report for a range of commands

### GenerateStatusReportBitmapId

Generates a status report for a range of commands

### GenerateStatusReportBitmapUid

Generates a status report for a range of commands

### GetCustomReportName

This only returns the file name for the custom report, not the full directory pathway to the file.

### Height

Read/Write: Returns/Sets height of report window

### LastExecutionReportMode

Dim PartProg As Object

### Left

Read/Write: Returns/Sets left coordinate of report window

### LoadCustomReport

Dim PartProg As Object

### LoadReportTemplate

Dim PartProg As Object

### Pages

Dim PartProg As Object

### Parent

This returns the parent **PartProgram **object.

### PrintReport

Dim PartProg As Object

### RefreshReport

Dim PartProg As Object

### SetCurrentAsDefaultReport

This method sets the current report as the default report for the measurement routine.

### Top

Read/Write: Returns/Sets top coordinate of report window

### Visible

This returns or sets the visibility state of the Report window.

### Width

Read/Write: Returns/Sets width of report window

