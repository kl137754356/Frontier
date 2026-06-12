# PC-DMIS Sample Automation Scripts


---

# Sample Automation Script 1

## Sample Automation Script 1 - Increment a PC-DMIS Variable

The following example first uses PC-DMIS code to receive an integer value from the user and assigns it to the V1 variable.

C1         =COMMENT/INPUT,NO,FULL SCREEN=NO,Type an integerASSIGN/V1=INT(C1.INPUT)COMMENT/OPER,NO,FULL SCREEN=NO,AUTO-CONTINUE=NO,"BEFORE SCRIPT - Variable is: " + V1

It then calls a BASIC script named TEST2.BAS.

CS1        =SCRIPT/FILENAME= D:\MYAUTOMATIONSCRIPTS\TEST2.BASFUNCTION/Main,SHOW=YES,,STARTSCRIPT/ENDSCRIPT/

This script takes the V1 variable and, using theGetVariableValueandSetVariableValueautomation methods, increments the value in V1 by one and then sets the new value for V1 in the measurement routine.

PC-DMIS then displays the changed variable in an operator comment.

COMMENT/OPER,NO,FULL SCREEN=NO,AUTO-CONTINUE=NO,"AFTER SCRIPT - Variable is: " + V1

```vbscript
Sub Main
  Dim App As Object
  Set App = CreateObject ("PCDLRN.Application")
  Dim Part As Object
  Set Part = App.ActivePartProgram
  Dim Var As Object
  Set Var = Part.GetVariableValue ("V1")
  Dim I As Object
  If Not Var Is Nothing Then
    MsgBox "Initial value of V1: " & Var.LongValue,0,"Script Message Box"
    Var.LongValue = Var.LongValue + 1
    Part.SetVariableValue "V1", Var
    MsgBox "V1 is now: " & Var.LongValue,0,"Script Message Box"
  Else
    MsgBox "Could not find a V1 variable",0,"Script Message Box"
  End If
End Sub
```

| Sample Automation Script 1 |

| Test2.bas |
| SubMainDimAppAsObjectSetApp =CreateObject("PCDLRN.Application")DimPartAsObjectSetPart = App.ActivePartProgramDimVarAsObjectSetVar = Part.GetVariableValue ("V1")DimIAsObjectIfNotVarIsNothingThenMsgBox"Initial value of V1: "& Var.LongValue,0,"Script Message Box"Var.LongValue = Var.LongValue + 1
    Part.SetVariableValue"V1", VarMsgBox"V1 is now: "& Var.LongValue,0,"Script Message Box"ElseMsgBox"Could not find a V1 variable",0,"Script Message Box"EndIfEnd Sub |

---

# Sample Automation Script 2

## Sample Automation Script 2 - Assign an Operator Name to a Variable

The following script receives an operator name from the user and then inserts anCOMMENT/OPERcommand into the Edit window for the currently open measurement routine, displaying the name of the operator.

PC-DMIS must be running with an open measurement routine in the background.

```vbscript
Sub Main
'Get operator Name And assign it To variable: N$.
N$ = InputBox$("Please enter your name:", "Operator", "", 200, 175)
'The following section adds a comment cmd to the measurement routine
Dim App As Object
'Get the pointer to the PC-DMIS application
Set App = CreateObject("PCDLRN.Application")
Dim Part As Object
'Get the pointer to the current measurement routine
Set Part = App.ActivePartProgram
Dim Cmds As Object
'Get the pointer to the set of commands In the measurement routine
Set Cmds = Part.Commands
Dim Cmd As Object
'Add a COMMENT command
Set Cmd = Cmds.Add(SET_COMMENT, True)
'Set the comment's type to REPT
retvaltype = Cmd.PutText("REPT", COMMENT_TYPE, 0)
'Put the string held in variable N$ into the comment's text
retvaltext = Cmd.PutText(N$, COMMENT_FIELD, 1)
'Redraws the COMMENT command so that the applied changes are applied to the measurement routine
Cmd.ReDraw
End Sub
```

| Sample Automation Script 2 |

| Example Title |
| SubMain'Get operator Name And assign it To variable: N$.N$ =InputBox$("Please enter your name:","Operator","", 200, 175)'The following section adds a comment cmd to the measurement routineDimAppAsObject'Get the pointer to the PC-DMIS applicationSetApp =CreateObject("PCDLRN.Application")DimPartAsObject'Get the pointer to the current measurement routineSetPart = App.ActivePartProgramDimCmdsAsObject'Get the pointer to the set of commands In the measurement routineSetCmds = Part.CommandsDimCmdAsObject'Add a COMMENT commandSetCmd = Cmds.Add(SET_COMMENT,True)'Set the comment's type to REPTretvaltype = Cmd.PutText("REPT", COMMENT_TYPE, 0)'Put the string held in variable N$ into the comment's textretvaltext = Cmd.PutText(N$, COMMENT_FIELD, 1)'Redraws the COMMENT command so that the applied changes are applied to the measurement routineCmd.ReDrawEnd Sub |

---

# Sample Automation Script 3

## Sample Automation Script 3 - Create a Custom Comment Dialog Box

This script is more involved than the previous examples as it involves dialog box creation and reading and writing data. Specifically, it recreates a customized versionof theCommentdialog box found in PC-DMIS, showing that you can create a customized dialog box that matches your exact specifications to perform specific tasks.

My Comment dialog box

This script functions nearly identically to theCommentdialog box in PC-DMIS, with one exception. It allows you to change and store the default comment text that appears, thereby demonstrating how to write and read text strings to and from a file.

```vbscript
 Sub Main
  Dim App As Object
  Set App = CreateObject ("PCDLRN.Application")
  Dim Part As Object
  Set Part = App.ActivePartProgram
  Dim Cmds As Object
  Set Cmds = Part.Commands
  Dim Cmd As Object
  Dim strText As String
  Dim optVal As Integer
  Dim lngCommentType As Long
  Dim buttonval As Integer
  Dim strDefaultText As String
  Dim strLine As String

Start: ' This label is used to quickly redisplay the Dialog after changing the default text.

' Reads in stored comment text. 
' This uses text from a text file named default_comment.txt and reads it. 
' This creates the file to read from and write to, if it doesn't exist. If it exists, it simply opens the file and then
' closes it.
Open "default_comment.txt" For Append As #1 ' This creates it if it doesn't exist.
Close #1
' This opens the file for writing, and puts the info into strLine variable
  Open "default_comment.txt" For Input As #1
    Do While Not EOF(1)
      Line Input #1, strLine
    Loop

    If len(strLine)>0 Then
   ' Removes automatic quotation marks
     strLine = mid(strLine,2,len(strLine)-3)
     strDefaultText = strLine
   Else
    ' If there isn't any default value to read in, it uses and sets this
    strDefaultText = "Type your comment text here."
    Open "default_comment.txt" For Output As #2
    Write #2, strDefaultText
    Close #2
   End If

Close #1 ' Closes the Open file handler

 'Creates the dialog box
Begin Dialog DLG_CUSTOM_COMMENT 106,15, 143, 177, "My Comment"
  OptionGroup .GROUP_1
    OptionButton 20,12,48,24, "Operator"
    OptionButton 20,28,40,24, "Report"
    OptionButton 20,44,48,24, "Document"
    OptionButton 76,12,32,24, "Input"
    OptionButton 76,28,40,24, "Yes/No"
    OptionButton 76,44,44,24, "ReadOut"
  GroupBox 12,4,116,68, "Comment Type"
  TextBox 12,88,116,44, .EditBox_1
  Text 12,76,56,12, "Comment Text"
  OKButton 20,160,44,12
  CancelButton 72,160,52,12
  PushButton 20,140,104,12, "Change Default Text", .PushButton_1
End Dialog

Dim dlg1 As DLG_CUSTOM_COMMENT
dlg1.EditBox_1 = strDefaultText

 buttonval = Dialog (dlg1)
  strCommentText = dlg1.EditBox_1
  optValue = dlg1.GROUP_1

' If OK is clicked, run this routine
If buttonval = -1 Then
    optVal = dlg1.GROUP_1

' If it's an Operator Comment
    If optVal = 0 Then     
        ' strCommentType is For testing only.
        strCommentType = "Operator"
        ' This variable determines the Type of comment
        lngCommentType = 0
    End If

' If it's a Report Comment
    If optVal = 1 Then
        strCommentType = "Report"
        lngCommentType = 2
   End If
    
' If it's a Document Comment
    If optVal = 2 Then
        strCommentType = "Document"
        lngCommentType = 4
    End If

' If it's a a Input Comment
    If optVal = 3 Then
        strCommentType = "Input"
        lngCommentType = 3
    End If

'If it's a Yes/No Comment
    If optVal = 4 Then
        strCommentType = "Yes/No"
        lngCommentType = 5
    End If
    
' If it's a Readout Comment
    If optVal = 5 Then
        strCommentType = "Readout"
        lngCommentType = 6
    End If

    ' This statement adds the initial comment
    Set Cmd = Cmds.Add(SET_COMMENT, True)
    ' This statement changes the comment Type To lngCommentType
    Cmd.SetToggleString lngCommentType, COMMENT_TYPE, 0
    ' This statement displays the comment text.
    Cmd.PutText strCommentText, COMMENT_FIELD, 1

    ' Redraws the Edit window
    Part.Refreshpart

' If the pushbutton to set new default text is clicked, then collect and write the new default
ElseIf buttonval = 1 Then
  strDefaultText = InputBox ("Type the new default comment text","Change Default Comment Text","")
  Open "default_comment.txt" For Output As #1
    Write #1, strDefaultText
  Close #1
  GoTo Start ' After setting the new default comment text, the program flow goes the Start: label

' If Cancel is clicked...
Else
    '...the dialog closes without doing anything
End If
End Sub
```

| Sample Automation Script 3 |

| Custom Dialog Box Example |
| SubMainDimAppAsObjectSetApp =CreateObject("PCDLRN.Application")DimPartAsObjectSetPart = App.ActivePartProgramDimCmdsAsObjectSetCmds = Part.CommandsDimCmdAsObjectDimstrTextAsStringDimoptValAsIntegerDimlngCommentTypeAsLongDimbuttonvalAsIntegerDimstrDefaultTextAsStringDimstrLineAsStringStart:' This label is used to quickly redisplay the Dialog after changing the default text.' Reads in stored comment text. 
' This uses text from a text file named default_comment.txt and reads it. 
' This creates the file to read from and write to, if it doesn't exist. If it exists, it simply opens the file and then
' closes it.Open"default_comment.txt"ForAppendAs#1' This creates it if it doesn't exist.Close #1' This opens the file for writing, and puts the info into strLine variableOpen"default_comment.txt"ForInputAs#1DoWhileNotEOF(1)
      LineInput#1, strLineLoopIflen(strLine)>0Then' Removes automatic quotation marksstrLine =mid(strLine,2,len(strLine)-3)
     strDefaultText = strLineElse' If there isn't any default value to read in, it uses and sets thisstrDefaultText ="Type your comment text here."Open"default_comment.txt"ForOutputAs#2Write#2, strDefaultText
    Close #2EndIfClose #1' Closes the Open file handler'Creates the dialog boxBegin Dialog DLG_CUSTOM_COMMENT 106,15, 143, 177,"My Comment"OptionGroup .GROUP_1
    OptionButton 20,12,48,24,"Operator"OptionButton 20,28,40,24,"Report"OptionButton 20,44,48,24,"Document"OptionButton 76,12,32,24,"Input"OptionButton 76,28,40,24,"Yes/No"OptionButton 76,44,44,24,"ReadOut"GroupBox 12,4,116,68,"Comment Type"TextBox 12,88,116,44, .EditBox_1
  Text 12,76,56,12,"Comment Text"OKButton 20,160,44,12
  CancelButton 72,160,52,12
  PushButton 20,140,104,12,"Change Default Text", .PushButton_1EndDialogDimdlg1AsDLG_CUSTOM_COMMENT
dlg1.EditBox_1 = strDefaultText

 buttonval = Dialog (dlg1)
  strCommentText = dlg1.EditBox_1
  optValue = dlg1.GROUP_1' If OK is clicked, run this routineIfbuttonval = -1ThenoptVal = dlg1.GROUP_1' If it's an Operator CommentIfoptVal = 0Then' strCommentType is For testing only.strCommentType ="Operator"' This variable determines the Type of commentlngCommentType = 0EndIf' If it's a Report CommentIfoptVal = 1ThenstrCommentType ="Report"lngCommentType = 2EndIf' If it's a Document CommentIfoptVal = 2ThenstrCommentType ="Document"lngCommentType = 4EndIf' If it's a a Input CommentIfoptVal = 3ThenstrCommentType ="Input"lngCommentType = 3EndIf'If it's a Yes/No CommentIfoptVal = 4ThenstrCommentType ="Yes/No"lngCommentType = 5EndIf' If it's a Readout CommentIfoptVal = 5ThenstrCommentType ="Readout"lngCommentType = 6EndIf' This statement adds the initial commentSetCmd = Cmds.Add(SET_COMMENT,True)' This statement changes the comment Type To lngCommentTypeCmd.SetToggleString lngCommentType, COMMENT_TYPE, 0' This statement displays the comment text.Cmd.PutText strCommentText, COMMENT_FIELD, 1' Redraws the Edit windowPart.Refreshpart' If the pushbutton to set new default text is clicked, then collect and write the new defaultElseIfbuttonval = 1ThenstrDefaultText =InputBox("Type the new default comment text","Change Default Comment Text","")
  Open"default_comment.txt"ForOutputAs#1Write#1, strDefaultText
  Close #1GoToStart' After setting the new default comment text, the program flow goes the Start: label' If Cancel is clicked...Else'...the dialog closes without doing anythingEndIfEnd Sub |

---

# Sample Automation Script 4

## Sample Automation Script 4 - Passing Data into a  Script

## Sample Measurement Routine Code

## SETASSIGNMENTVALUE.Bas Code

This script shows how to pass a variable's ID into a script from a PC-DMIS measurement routine, how to locate the passed in ID in the script, and then how to modify the right side of the ASSIGN command associated with the ID.

START      =LABEL/

C1         =COMMENT/INPUT,NO,'Type a variable's id: V1, V2, V3, V4, or V5.'

IF/C1.INPUT <> "V1" AND C1.INPUT <> "V2" AND C1.INPUT <> "V3" AND C1.INPUT

<> "V4" AND C1.INPUT <> "V5"

COMMENT/OPER,NO,You did not enter a correct variable ID.

GOTO/START

END_IF/

ELSE/

CS1        =SCRIPT/FILENAME= D:\MYAUTOMATIONSCRIPTS\SETASSIGNMENTVALUE.BAS

FUNCTION/Main,SHOW=YES,ARG1=C1.INPUT,,

STARTSCRIPT/

ENDSCRIPT/

ASSIGN/V1 = ""

ASSIGN/V2 = ""

ASSIGN/V3 = ""

ASSIGN/V4 = ""

ASSIGN/V5 = ""

END_ELSE/

Below is the code for SETASSIGNMENTVALUE.BAS. Once the script opens, it takes the passed in ID, cycles through all the commands, and when it finds the matching ID, it displays an input box asking you to specify a new value for the command:

```vbscript
Sub Main (strID As String)
Dim App As Object
Set App = CreateObject ("PCDLRN.Application")
Dim Part As Object
Set Part = App.ActivePartProgram
Dim Cmds As Object
Set Cmds = Part.Commands
Dim Cmd As Object
Dim FCCmd As Object
Dim VarCommentValue As Variant
VarCommentValue = InputBox("Type a Value for " & strID & ". (Surround what you Type With quotation marks To make it a String.)","Set Assignment Value","""Type Something Here""")
For Each Cmd In Cmds
  If Cmd.TypeDescription = "Assignment" Then
    Set FCCmd = Cmd.FlowControlCommand
    If FCCmd.GetLeftSideOfExpression = strID Then
      FCCmd.SetRightSideOfAssignment VarCommentValue
    End If
  End If
Next Cmd
End Sub
```

| Sample Automation Script 4 |

| SetAssignmentValue.Bas |
| SubMain (strIDAsString)DimAppAsObjectSetApp =CreateObject("PCDLRN.Application")DimPartAsObjectSetPart = App.ActivePartProgramDimCmdsAsObjectSetCmds = Part.CommandsDimCmdAsObjectDimFCCmdAsObjectDimVarCommentValueAsVariant
VarCommentValue =InputBox("Type a Value for "& strID &". (Surround what you Type With quotation marks To make it a String.)","Set Assignment Value","""Type Something Here""")ForEachCmdInCmdsIfCmd.TypeDescription ="Assignment"ThenSetFCCmd = Cmd.FlowControlCommandIfFCCmd.GetLeftSideOfExpression = strIDThenFCCmd.SetRightSideOfAssignment VarCommentValueEndIfEndIfNextCmdEnd Sub |

---

# Sample Automation Scripts

## Testing the Sample Scripts

Below are some sample automation scripts that will demonstrate some of the necessary components needed to get started automating PC-DMIS.

If you want to test these scripts, be aware that sometimes copying and pasting the code from these examples into PC-DMIS's Basic Script Editor may cause some lines to wrap that shouldn't wrap and may insert white space characters that the Editor doesn't recognize. It is recommended that you type in these scripts if you find that copying and pasting doesn't function properly.

Notice in the examples below that you must declare and set the proper automation objects before you can access and use PC-DMIS's automation methods and properties. The "Accessing an Object's Properties, Methods and Events" topic will be of assistance to you as you create your own scripts.

| Sample Automation Scripts |

|  | Notice in the examples below that you must declare and set the proper automation objects before you can access and use PC-DMIS's automation methods and properties. The "Accessing an Object's Properties, Methods and Events" topic will be of assistance to you as you create your own scripts. |

- Sample Script 1
- Sample Script 2
- Sample Script 3
- Sample Script 4
