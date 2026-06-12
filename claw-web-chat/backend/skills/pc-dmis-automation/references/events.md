# PC-DMIS Reference: Events

## ApplicationObjectEvents

# ApplicationObjectEvents Object

# Description

# See Also

ApplicationObjectEvents Members

The **ApplicationObjectEvents** object provides you with a series of events that get called when the PC-DMIS application meets certain conditions.

| ApplicationObjectEvents Object |

# ApplicationObjectEvents Object Members

# Events

# See Also

This event gets launched when the specified command (Command) gets added to the specified measurement routine (PartProg).

This event gets launched when theE**xecutiond**ialog box closes.

This event gets launched when the specified measurement routine (PartProg) gets closed.

This event gets launched whenever the PC-DMIS application begins to close. A listening application should use this event to properly close PC-DMIS.

This event gets launched when aC**omment Inputd**ialog box closes.

This event gets launched when aC**omment Inputd**ialog box opens.

This event gets launched when PC-DMIS connects to and launches the specified measurement routine (PartProg) on the slave computer.

This event gets launched when a generic dialog box is closed.

The event does not get launched for a Message Box,E**xecutiond**ialog box orCom**ment Inputdia**log box.

This event gets launched when a generic dialog box is opened.

The event does not get launched for a Message Box,E**xecutiondi**alog box orCom**ment Inputdia**log box.

This event gets launched when PC-DMIS disconnects from the slave computer.

This event gets launched immediately before the specified command (Cmmd) gets executed.

This event gets launched immediately before the specified command (Cmmd) gets executed on a specified arm (Arm) of a multiple arm system.

This event gets launched immediately after the specified command (Cmmd) gets executed.

This event gets launched immediately after the specified command (Cmmd) gets executed on a specified arm (Arm) of a multiple arm system.

This event gets launched when theE**xecutiond**ialog box opens.

This event gets launched when the specified measurement routine (PartProg) gets opened.

This event gets launched when the specifiedR**emote Panel Applicationd**ialog box opens.

This event gets launched when a generic message box closes.

This event gets launched when a generic message box opens.

This event gets launched when a generic property sheet is closed.

This event gets launched when a generic property sheet is opened.

This event gets launched when a measurement routine's report finishes printing. This happens whenever these occur:

This event gets launched when a measurement routine's report starts to print. This happens whenever these occur:

This event gets launched when the specified measurement routine (PartProg) gets saved.

This event gets launched when the specified measurement routine (PartProg) begins execution.

This event gets launched when the status bar gets updated with the specified message (Msg).

ApplicationObjectEvents Object

OnAddObject This event gets launched when the specified command (Command) gets added to the specified measurement routine (PartProg).* *OnCloseEx******ecuti**on**Di**alog This event gets launched when the E**xecution d**ialog box closes. OnClosePartProgram This event gets launched when the specified measurement routine (PartProg) gets closed. OnClosePartProgram2 Event fired when measurement routine is closed - with not file quit flag OnCloseRemotePanelDialog Event fired when dialogs close. Note: hClosedWnd could refer to a dialog already destroyed OnClosingApplication This event gets launched whenever the PC-DMIS application begins to close. A listening application should use this event to properly close PC-DMIS. OnCommentInputDialogClose This event gets launched when a C********omment **In**pu**t **dialog box closes. OnCommentInputDialogOpen This event gets launched when a Comment Input dialog box opens. OnConnectSlave This event gets launched when PC-DMIS connects to and launches the specified measurement routine (PartProg) on the slave computer. OnCreatePartProgram Event fired when measurement routine is created OnDialogClose This event gets launched when a generic dialog box is closed. The event does not get launched for a Message Box, Execution dialog box or Comment Input dialog box. OnDialogOpen This event gets launched when a generic dialog box is opened. The event does not get launched for a Message Box, Execution dialog box or Comment Input dialog box. OnDisconnectSlave This event gets launched when PC-DMIS disconnects from the slave computer. OnEndExecution This event gets launched when PC-DMIS finishes executing the specified program. PC-DMIS determines it has finished execution based on the termination type . OnExecutionDialogButton Event fired when an Execution Dialog button is pushed OnJogProbePoint Event fired when a job probe point taken OnLoadProbe Event fired when a probe is loaded OnLowLevelMatrixChanged Event fired when Low Level Matrix changed OnMachineConnected This event gets launched when the software detects that it is connected to a CMM. OnMachineConnecting This events gets launched when the software is in the process of connecting to a CMM. OnMachineConnectionTimeOut This event gets launched when the software attempts to connect to a CMM but the connection times out and expires. OnMachineDisconnecting This event gets launched when the software disconnects from a CMM. OnMachineHomingStarted This event gets launched when the the CMM begins its homing operation. OnObjectAboutToExecute This event gets launched immediately before the specified command (Cmmd) gets executed. OnObjectAboutToExecute2 This event gets launched immediately before the specified command (Cmmd) gets executed on a specified arm (Arm) of a multiple arm system. OnObjectExecuted This event gets launched immediately after the specified command (Cmmd) gets executed. OnObjectExecuted2 This event gets launched immediately after the specified command (Cmmd) gets executed on a specified arm (Arm) of a multiple arm system. OnOpenExecutionDialog This event gets launched when the Execution dialog box opens. OnOpenPartProgram This event gets launched when the specified measurement routine (PartProg) gets opened. OnOpenRemotePanelDialog This event gets launched when the specified **Remote Panel Application** dialog box opens. OnOpenRemotePanelDialog2 Event fired when dialogs open for the remote panel with five possible buttons OnPCDMessageBoxClose This event gets launched when a generic message box closes. OnPCDMessageBoxOpen This event gets launched when a generic message box opens. OnPropertySheetClose This event gets launched when a generic property sheet is closed. OnPropertySheetOpen This event gets launched when a generic property sheet is opened. OnQuickFeatureSelection Event fired when QuickFeatureSelection for Sensor Mapping OnReportPr****int**En**d This event gets launched when a measurement routine's report finishes printing. This happens whenever these occur: The Print button from the Report Window finishes printing. The File |**** Printing | Report Window Print men**u **item finishes printing. A PRINT command in a measurement routine finishes execution. A measurement routine with automatic printing that is enabled from File | Pri****nting | Report Window | Print Setup finishe**s **printing the report. OnReportPrintStart This event gets launched when a measurement routine's report starts to print. This happens whenever these occur: The Print button is pressed on the Report Window. The File | Printing | Report Window Print menu item is selected. A PRINT command in a measurement routine is executed. A measurement routine with automatic printing that is enabled from File | Printing | Report Window | Print Setup finishes executing and starts to print the report. OnRotaryTableRotated Event fired when a rotary table is rotated OnRotaryTableRotated2 Event fired when a dual axis rotary table is rotated OnSavePartProgram This event gets launched when the specified measurement routine (PartProg) gets saved. OnStartExecution This event gets launched when the specified measurement routine (PartProg) begins execution. OnUpdateStatusMessage This event gets launched when the status bar gets updated with the specified message (Msg). OnWristRotated Event fired when indexable wrist rotated

| ApplicationObjectEvents ObjectMembers |

| OnAddObject | This event gets launched when the specified command (Command) gets added to the specified measurement routine (PartProg). |
| OnCloseExecutionDialog | This event gets launched when theExecutiondialog box closes. |
| OnClosePartProgram | This event gets launched when the specified measurement routine (PartProg) gets closed. |
| OnClosePartProgram2 | Event fired when measurement routine is closed - with not file quit flag |
| OnCloseRemotePanelDialog | Event fired when dialogs close. Note: hClosedWnd could refer to a dialog already destroyed |
| OnClosingApplication | This event gets launched whenever the PC-DMIS application begins to close. A listening application should use this event to properly close PC-DMIS. |
| OnCommentInputDialogClose | This event gets launched when aComment Inputdialog box closes. |
| OnCommentInputDialogOpen | This event gets launched when aComment Inputdialog box opens. |
| OnConnectSlave | This event gets launched when PC-DMIS connects to and launches the specified measurement routine (PartProg) on the slave computer. |
| OnCreatePartProgram | Event fired when measurement routine is created |
| OnDialogClose | This event gets launched when a generic dialog box is closed.The event does not get launched for a Message Box,Executiondialog box orComment Inputdialog box. |
| OnDialogOpen | This event gets launched when a generic dialog box is opened.The event does not get launched for a Message Box,Executiondialog box orComment Inputdialog box. |
| OnDisconnectSlave | This event gets launched when PC-DMIS disconnects from the slave computer. |
| OnEndExecution | This event gets launched when PC-DMIS finishes executing the specified program. PC-DMIS determines it has finished execution based on the termination type. |
| OnExecutionDialogButton | Event fired when an Execution Dialog button is pushed |
| OnJogProbePoint | Event fired when a job probe point taken |
| OnLoadProbe | Event fired when a probe is loaded |
| OnLowLevelMatrixChanged | Event fired when Low Level Matrix changed |
| OnMachineConnected | This event gets launched when the software detects that it is connected to a CMM. |
| OnMachineConnecting | This events gets launched when the software is in the process of connecting to a CMM. |
| OnMachineConnectionTimeOut | This event gets launched when the software attempts to connect to a CMM but the connection times out and expires. |
| OnMachineDisconnecting | This event gets launched when the software disconnects from a CMM. |
| OnMachineHomingStarted | This event gets launched when the the CMM begins its homing operation. |
| OnObjectAboutToExecute | This event gets launched immediately before the specified command (Cmmd) gets executed. |
| OnObjectAboutToExecute2 | This event gets launched immediately before the specified command (Cmmd) gets executed on a specified arm (Arm) of a multiple arm system. |
| OnObjectExecuted | This event gets launched immediately after the specified command (Cmmd) gets executed. |
| OnObjectExecuted2 | This event gets launched immediately after the specified command (Cmmd) gets executed on a specified arm (Arm) of a multiple arm system. |
| OnOpenExecutionDialog | This event gets launched when theExecutiondialog box opens. |
| OnOpenPartProgram | This event gets launched when the specified measurement routine (PartProg) gets opened. |
| OnOpenRemotePanelDialog | This event gets launched when the specifiedRemote Panel Applicationdialog box opens. |
| OnOpenRemotePanelDialog2 | Event fired when dialogs open for the remote panel with five possible buttons |
| OnPCDMessageBoxClose | This event gets launched when a generic message box closes. |
| OnPCDMessageBoxOpen | This event gets launched when a generic message box opens. |
| OnPropertySheetClose | This event gets launched when a generic property sheet is closed. |
| OnPropertySheetOpen | This event gets launched when a generic property sheet is opened. |
| OnQuickFeatureSelection | Event fired when QuickFeatureSelection for Sensor Mapping |
| OnReportPrintEnd | This event gets launched when a measurement routine's report finishes printing. This happens whenever these occur:ThePrintbutton from the Report Window finishes printing.TheFile | Printing | Report Window Printmenu item finishes printing.A PRINT command in a measurement routine finishes execution.A measurement routine with automatic printing that is enabled fromFile | Printing | Report Window | Print Setupfinishes printing the report. |
| OnReportPrintStart | This event gets launched when a measurement routine's report starts to print. This happens whenever these occur:ThePrintbutton is pressed on the Report Window.TheFile | Printing | Report Window Printmenu item is selected.A PRINT command in a measurement routine is executed.A measurement routine with automatic printing that is enabled fromFile | Printing | Report Window | Print Setupfinishes executing and starts to print the report. |
| OnRotaryTableRotated | Event fired when a rotary table is rotated |
| OnRotaryTableRotated2 | Event fired when a dual axis rotary table is rotated |
| OnSavePartProgram | This event gets launched when the specified measurement routine (PartProg) gets saved. |
| OnStartExecution | This event gets launched when the specified measurement routine (PartProg) begins execution. |
| OnUpdateStatusMessage | This event gets launched when the status bar gets updated with the specified message (Msg). |
| OnWristRotated | Event fired when indexable wrist rotated |

- The Print button from the Report Window finishes printing.
- The File | Printing | Report Window Print menu item finishes printing.
- A PRINT command in a measurement routine finishes execution.
- A measurement routine with automatic printing that is enabled from File | Printing | Report Window | Print Setup finishes printing the report.

- The Print button is pressed on the Report Window.
- The File | Printing | Report Window Print menu item is selected.
- A PRINT command in a measurement routine is executed.
- A measurement routine with automatic printing that is enabled from File | Printing | Report Window | Print Setup finishes executing and starts to print the report.

### OnAddObject_EV

This event gets launched when the specified command (Command) gets added to the specified measurement routine (PartProg).

### OnCloseExecutionDialog_EV

This event gets launched when theE**xecutiond**ialog box closes.

### OnClosePartProgram2_EV

Event fired when measurement routine is closed - with not file quit flag

### OnClosePartProgram_EV

This event gets launched when the specified measurement routine (PartProg) gets closed.

### OnCloseRemotePanelDialog_EV

Event fired when dialogs close. Note: hClosedWnd could refer to a dialog already destroyed

### OnClosingApplication_EV

This event gets launched whenever the PC-DMIS application begins to close. A listening application should use this event to properly close PC-DMIS.

### OnCommentInputDialogClose_EV

This event gets launched when aC**omment Inputd**ialog box closes.

### OnCommentInputDialogOpen_EV

This event gets launched when aC**omment Inputd**ialog box opens.

### OnConnectSlave_EV

This event gets launched when PC-DMIS connects to and launches the specified measurement routine (PartProg) on the slave computer.

### OnCreatePartProgram_EV

Event fired when measurement routine is created

### OnDialogClose_EV

This event gets launched when a generic dialog box is closed.

### OnDialogOpen_EV

This event gets launched when a generic dialog box is opened.

### OnDisconnectSlave_EV

This event gets launched when PC-DMIS disconnects from the slave computer.

### OnEndExecution_EV

This event gets launched when PC-DMIS finishes executing the specified program*.* PC-DMIS determines it has finished execution based on the termination type .

### OnExecutionDialogButton_EV

Event fired when an Execution Dialog button is pushed

### OnJogProbePoint_EV

Event fired when a job probe point taken

### OnLoadProbe_EV

Event fired when a probe is loaded

### OnLowLevelMatrixChanged_EV

Event fired when Low Level Matrix changed

### OnMachineConnected_EV

This event gets launched when the software detects that it is connected to a CMM.

### OnMachineConnecting_EV

This events gets launched when the software is in the process of connecting to a CMM.

### OnMachineConnectionTimeOut_EV

This event gets launched when the software attempts to connect to a CMM but the connection times out and expires.

### OnMachineDisconnecting_EV

This event gets launched when the software disconnects from a CMM.

### OnMachineHomingStarted_EV

This event gets launched when the the CMM begins its homing operation.

### OnObjectAboutToExecute2_EV

This event gets launched immediately before the specified command (Cmmd) gets executed on a specified arm (Arm) of a multiple arm system.

### OnObjectAboutToExecute_EV

This event gets launched immediately before the specified command (Cmmd) gets executed.

### OnObjectExecuted2_EV

This event gets launched immediately after the specified command (Cmmd) gets executed on a specified arm (Arm) of a multiple arm system.

### OnObjectExecuted_EV

This event gets launched immediately after the specified command (Cmmd) gets executed.

### OnOpenExecutionDialog_EV

This event gets launched when theE**xecutiond**ialog box opens.

### OnOpenPartProgram_EV

This event gets launched when the specified measurement routine (PartProg) gets opened.

### OnOpenRemotePanelDialog2_EV

Event fired when dialogs open for the remote panel with five possible buttons

### OnOpenRemotePanelDialog_EV

This event gets launched when the specifiedR**emote Panel Applicationd**ialog box opens.

### OnPCDMessageBoxClose_EV

This event gets launched when a generic message box closes.

### OnPCDMessageBoxOpen_EV

This event gets launched when a generic message box opens.

### OnPropertySheetClose_EV

This event gets launched when a generic property sheet is closed.

### OnPropertySheetOpen_EV

This event gets launched when a generic property sheet is opened.

### OnQuickFeatureSelection_EV

Event fired when QuickFeatureSelection for Sensor Mapping

### OnReportPrintEnd_EV

This event gets launched when a measurement routine's report finishes printing. This happens whenever these occur:

### OnReportPrintStart_EV

This event gets launched when a measurement routine's report starts to print. This happens whenever these occur:

### OnRotaryTableRotated2_EV

Event fired when a dual axis rotary table is rotated

### OnRotaryTableRotated_EV

Event fired when a rotary table is rotated

### OnSavePartProgram_EV

This event gets launched when the specified measurement routine (PartProg) gets saved.

### OnStartExecution_EV

This event gets launched when the specified measurement routine (PartProg) begins execution.

### OnUpdateStatusMessage_EV

This event gets launched when the status bar gets updated with the specified message (Msg).

### OnWristRotated_EV

Event fired when indexable wrist rotated


---

## ApplicationSettings

# ApplicationSettings Object

# Description

# See Also

ApplicationSettings Members

The **ApplicationSettings** object is a class that contains various properties and methods that allow you to work with PC-DMIS settings.

| ApplicationSettings Object |

# ApplicationSettings Object Members

# Public Methods

# Public Properties

# See Also

ApplicationSettings Object

SetWarning

WarningDefaultNoSavePrg Read/Write: WarningDefaultOkRotPh9 Read/Write: WarningDefaultOverwritingAlignment Read/Write: WarnNoSavePrg Read/Write: WarnOkMovPh9 Read/Write: WarnOkRotPh9 Read/Write: WarnOKUsePh9 Read/Write: OK to use closest calibrated tip warning WarnOverwritingAlignment Read/Write:

| ApplicationSettings ObjectMembers |

| SetWarning | WarningDefaultNoSavePrg | Read/Write: |
| WarningDefaultOkRotPh9 | Read/Write: |
| WarningDefaultOverwritingAlignment | Read/Write: |
| WarnNoSavePrg | Read/Write: |
| WarnOkMovPh9 | Read/Write: |
| WarnOkRotPh9 | Read/Write: |
| WarnOKUsePh9 | Read/Write: OK to use closest calibrated tip warning |
| WarnOverwritingAlignment | Read/Write: |

### SetWarning

ApplicationSettings Object|ApplicationSettings Members

### WarnNoSavePrg

ApplicationSettings Object|ApplicationSettings Members

### WarnOKUsePh9

ApplicationSettings Object|ApplicationSettings Members

### WarnOkMovPh9

ApplicationSettings Object|ApplicationSettings Members

### WarnOkRotPh9

ApplicationSettings Object|ApplicationSettings Members

### WarnOverwritingAlignment

ApplicationSettings Object|ApplicationSettings Members

### WarningDefaultNoSavePrg

ApplicationSettings Object|ApplicationSettings Members

### WarningDefaultOkRotPh9

ApplicationSettings Object|ApplicationSettings Members

### WarningDefaultOverwritingAlignment

ApplicationSettings Object|ApplicationSettings Members


---

## AutomationSettings

# AutomationSettings Object

# Description

# Remarks

# Example

# See Also

This example connects to PC-DMIS, loads a part program, and then allows you to control what messages appear through the available check boxes.

AutomationSettings Members

The **AutomationSettings** object controls how to handle PC-DMIS automated behaviors. This includes, but is not limited to, automatic-generated messages in PC-DMIS.

The object currently has properties that handle generated messages about probe tip errors.

This example connects to PC-DMIS, loads a part program, and then allows you to control what messages appear through the available check boxes. Example (C#) Copy Code namespace PCD_112219_Test_Application { public partial class Form1 : Form { PCDLRN.Application theApp = null ; PCDLRN.AutomationSettings theAutomationSettings = null ; public Form1() { InitializeComponent(); enableDisableControls(); } void enableDisableControls() { if (theApp != null ) { AutomationShowTipMissingMessageBox.Enabled = true ; AutomationShowTipNotAllowedMessageBox.Enabled = true ; AutomationShowTipNotCalibratedMessageBox.Enabled = true ; AutomationShowTipCalibrationIsOlderThanAllowedMessageBox.Enabled = true ; AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox.Enabled = true ; Connect.Enabled = false ; Disconnect.Enabled = true ; PcDmisVisible.Enabled = true ; LoadPartProgram.Enabled = theApp.ActivePartProgram == null ; ClosePartProgram.Enabled = theApp.ActivePartProgram != null ; if (theApp.ActivePartProgram != null ) { loadedPartProgram.Text = theApp.ActivePartProgram.FullName; } else { loadedPartProgram.Text = "" ; } } else { AutomationShowTipMissingMessageBox.Enabled = false ; AutomationShowTipNotAllowedMessageBox.Enabled = false ; AutomationShowTipNotCalibratedMessageBox.Enabled = false ; AutomationShowTipCalibrationIsOlderThanAllowedMessageBox.Enabled = false ; AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox.Enabled = false ; Connect.Enabled = true ; Disconnect.Enabled = false ; LoadPartProgram.Enabled = false ; ClosePartProgram.Enabled = false ; PcDmisVisible.Enabled = false ; loadedPartProgram.Text = "" ; } } private void AutomationShowTipMissingMessageBox_CheckedChanged( object sender, EventArgs e) { theAutomationSettings.AutomationShowTipMissingMessageBox = AutomationShowTipMissingMessageBox.Checked; } private void AutomationShowTipNotAllowedMessageBox_CheckedChanged( object sender, EventArgs e) { theAutomationSettings.AutomationShowTipNotAllowedMessageBox = AutomationShowTipNotAllowedMessageBox.Checked; } private void AutomationShowTipNotCalibratedMessageBox_CheckedChanged( object sender, EventArgs e) { theAutomationSettings.AutomationShowTipNotCalibratedMessageBox = AutomationShowTipNotCalibratedMessageBox.Checked; } private void AutomationShowTipCalibrationIsOlderThanAllowedMessageBox_CheckedChanged( object sender, EventArgs e) { theAutomationSettings.AutomationShowTipCalibrationIsOlderThanAllowedMessageBox = AutomationShowTipCalibrationIsOlderThanAllowedMessageBox.Checked; } private void AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox_CheckedChanged( object sender, EventArgs e) { theAutomationSettings.AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox = AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox.Checked; } private void Connect_Click( object sender, EventArgs e) { var comType = Type.GetTypeFromProgID( @"PCDLRN.Application" ); if (comType == null ) { return ; } theApp = (PCDLRN.Application)Activator.CreateInstance(comType); if (theApp != null ) { theApp.WaitUntilReady(500); theAutomationSettings = theApp.AutomationSettings; PcDmisVisible.Checked = theApp.Visible; AutomationShowTipMissingMessageBox.Checked = theAutomationSettings.AutomationShowTipMissingMessageBox; AutomationShowTipCalibrationIsOlderThanAllowedMessageBox.Checked = theAutomationSettings.AutomationShowTipCalibrationIsOlderThanAllowedMessageBox; AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox.Checked = theAutomationSettings.AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox; AutomationShowTipNotAllowedMessageBox.Checked = theAutomationSettings.AutomationShowTipNotAllowedMessageBox; AutomationShowTipNotCalibratedMessageBox.Checked = theAutomationSettings.AutomationShowTipNotCalibratedMessageBox; } enableDisableControls(); } private void Disconnect_Click( object sender, EventArgs e) { theAutomationSettings = null ; theApp = null ; GC.Collect(); Thread.Sleep(20); enableDisableControls(); } private void LoadPartProgram_Click( object sender, EventArgs e) { if (theApp != null && theApp.ActivePartProgram == null ) { openProgramFileDialog.CheckFileExists = true ; openProgramFileDialog.DefaultExt = @"PRG" ; openProgramFileDialog.Filter = "Part program files (*.PRG)|*.PRG" ; openProgramFileDialog.ShowDialog(); var name = openProgramFileDialog.FileName; theApp.PartPrograms.Open(name, "CMM1" ); Thread.Sleep(20); } enableDisableControls(); } private void ClosePartProgram_Click( object sender, EventArgs e) { if (theApp != null && theApp.ActivePartProgram != null ) { theApp.PartPrograms.CloseAll(); Thread.Sleep(20); } enableDisableControls(); } private void PcDmisVisible_CheckedChanged( object sender, EventArgs e) { theApp.Visible = PcDmisVisible.Checked; } } }

```vbscript
namespace PCD_112219_Test_Application
{
  public partial class Form1 : Form
  {
    PCDLRN.Application theApp = null;
    PCDLRN.AutomationSettings theAutomationSettings = null;
    public Form1()
    {
      InitializeComponent();
      enableDisableControls();
    }

    void enableDisableControls()
    {
      if (theApp != null)
      {
        AutomationShowTipMissingMessageBox.Enabled = true;
        AutomationShowTipNotAllowedMessageBox.Enabled = true;
        AutomationShowTipNotCalibratedMessageBox.Enabled = true;
        AutomationShowTipCalibrationIsOlderThanAllowedMessageBox.Enabled = true;
        AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox.Enabled = true;
        Connect.Enabled = false;
        Disconnect.Enabled = true;
        PcDmisVisible.Enabled = true;
        LoadPartProgram.Enabled = theApp.ActivePartProgram == null;
        ClosePartProgram.Enabled = theApp.ActivePartProgram != null;
        if (theApp.ActivePartProgram != null)
        {
          loadedPartProgram.Text = theApp.ActivePartProgram.FullName;
        }
        else
        {
          loadedPartProgram.Text = "";
        }
      }
      else
      {
        AutomationShowTipMissingMessageBox.Enabled = false;
        AutomationShowTipNotAllowedMessageBox.Enabled = false;
        AutomationShowTipNotCalibratedMessageBox.Enabled = false;
        AutomationShowTipCalibrationIsOlderThanAllowedMessageBox.Enabled = false;
        AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox.Enabled = false;
        Connect.Enabled = true;
        Disconnect.Enabled = false;
        LoadPartProgram.Enabled = false;
        ClosePartProgram.Enabled = false;
        PcDmisVisible.Enabled = false;
        loadedPartProgram.Text = "";
      }
    }

    private void AutomationShowTipMissingMessageBox_CheckedChanged(object sender, EventArgs e)
    {
      theAutomationSettings.AutomationShowTipMissingMessageBox = AutomationShowTipMissingMessageBox.Checked;
    }

    private void AutomationShowTipNotAllowedMessageBox_CheckedChanged(object sender, EventArgs e)
    {
      theAutomationSettings.AutomationShowTipNotAllowedMessageBox = AutomationShowTipNotAllowedMessageBox.Checked;
    }

    private void AutomationShowTipNotCalibratedMessageBox_CheckedChanged(object sender, EventArgs e)
    {
      theAutomationSettings.AutomationShowTipNotCalibratedMessageBox = AutomationShowTipNotCalibratedMessageBox.Checked;
    }

    private void AutomationShowTipCalibrationIsOlderThanAllowedMessageBox_CheckedChanged(object sender, EventArgs e)
    {
      theAutomationSettings.AutomationShowTipCalibrationIsOlderThanAllowedMessageBox = AutomationShowTipCalibrationIsOlderThanAllowedMessageBox.Checked;
    }

    private void AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox_CheckedChanged(object sender, EventArgs e)
    {
      theAutomationSettings.AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox = AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox.Checked;
    }

    private void Connect_Click(object sender, EventArgs e)
    {
      var comType = Type.GetTypeFromProgID(@"PCDLRN.Application");
      if (comType == null)
      {
        return;
      }

      theApp = (PCDLRN.Application)Activator.CreateInstance(comType);
      if (theApp != null)
      {
        theApp.WaitUntilReady(500);
        theAutomationSettings = theApp.AutomationSettings;
        PcDmisVisible.Checked = theApp.Visible;
        AutomationShowTipMissingMessageBox.Checked = theAutomationSettings.AutomationShowTipMissingMessageBox;
        AutomationShowTipCalibrationIsOlderThanAllowedMessageBox.Checked = theAutomationSettings.AutomationShowTipCalibrationIsOlderThanAllowedMessageBox;
        AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox.Checked = theAutomationSettings.AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox;
        AutomationShowTipNotAllowedMessageBox.Checked = theAutomationSettings.AutomationShowTipNotAllowedMessageBox;
        AutomationShowTipNotCalibratedMessageBox.Checked = theAutomationSettings.AutomationShowTipNotCalibratedMessageBox;
      }
      enableDisableControls();
    }

    private void Disconnect_Click(object sender, EventArgs e)
    {
      theAutomationSettings = null;
      theApp = null;
      GC.Collect();
      Thread.Sleep(20);
      enableDisableControls();
    }

    private void LoadPartProgram_Click(object sender, EventArgs e)
    {
      if (theApp != null && theApp.ActivePartProgram == null)
      {
        openProgramFileDialog.CheckFileExists = true;
        openProgramFileDialog.DefaultExt = @"PRG";
        openProgramFileDialog.Filter = "Part program  files (*.PRG)|*.PRG";
        openProgramFileDialog.ShowDialog();
        var name = openProgramFileDialog.FileName;
        theApp.PartPrograms.Open(name, "CMM1");
        Thread.Sleep(20);
      }
      enableDisableControls();
    }

    private void ClosePartProgram_Click(object sender, EventArgs e)
    {
      if (theApp != null && theApp.ActivePartProgram != null)
      {
        theApp.PartPrograms.CloseAll();
        Thread.Sleep(20);
      }
      enableDisableControls();
    }

    private void PcDmisVisible_CheckedChanged(object sender, EventArgs e)
    {
      theApp.Visible = PcDmisVisible.Checked;
    }
  }
}
```

| AutomationSettings Object |

| Example (C#) |
| namespacePCD_112219_Test_Application
{publicpartialclassForm1 : Form
  {
    PCDLRN.Application theApp =null;
    PCDLRN.AutomationSettings theAutomationSettings =null;publicForm1()
    {
      InitializeComponent();
      enableDisableControls();
    }voidenableDisableControls()
    {if(theApp !=null)
      {
        AutomationShowTipMissingMessageBox.Enabled =true;
        AutomationShowTipNotAllowedMessageBox.Enabled =true;
        AutomationShowTipNotCalibratedMessageBox.Enabled =true;
        AutomationShowTipCalibrationIsOlderThanAllowedMessageBox.Enabled =true;
        AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox.Enabled =true;
        Connect.Enabled =false;
        Disconnect.Enabled =true;
        PcDmisVisible.Enabled =true;
        LoadPartProgram.Enabled = theApp.ActivePartProgram ==null;
        ClosePartProgram.Enabled = theApp.ActivePartProgram !=null;if(theApp.ActivePartProgram !=null)
        {
          loadedPartProgram.Text = theApp.ActivePartProgram.FullName;
        }else{
          loadedPartProgram.Text ="";
        }
      }else{
        AutomationShowTipMissingMessageBox.Enabled =false;
        AutomationShowTipNotAllowedMessageBox.Enabled =false;
        AutomationShowTipNotCalibratedMessageBox.Enabled =false;
        AutomationShowTipCalibrationIsOlderThanAllowedMessageBox.Enabled =false;
        AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox.Enabled =false;
        Connect.Enabled =true;
        Disconnect.Enabled =false;
        LoadPartProgram.Enabled =false;
        ClosePartProgram.Enabled =false;
        PcDmisVisible.Enabled =false;
        loadedPartProgram.Text ="";
      }
    }privatevoidAutomationShowTipMissingMessageBox_CheckedChanged(objectsender, EventArgs e)
    {
      theAutomationSettings.AutomationShowTipMissingMessageBox = AutomationShowTipMissingMessageBox.Checked;
    }privatevoidAutomationShowTipNotAllowedMessageBox_CheckedChanged(objectsender, EventArgs e)
    {
      theAutomationSettings.AutomationShowTipNotAllowedMessageBox = AutomationShowTipNotAllowedMessageBox.Checked;
    }privatevoidAutomationShowTipNotCalibratedMessageBox_CheckedChanged(objectsender, EventArgs e)
    {
      theAutomationSettings.AutomationShowTipNotCalibratedMessageBox = AutomationShowTipNotCalibratedMessageBox.Checked;
    }privatevoidAutomationShowTipCalibrationIsOlderThanAllowedMessageBox_CheckedChanged(objectsender, EventArgs e)
    {
      theAutomationSettings.AutomationShowTipCalibrationIsOlderThanAllowedMessageBox = AutomationShowTipCalibrationIsOlderThanAllowedMessageBox.Checked;
    }privatevoidAutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox_CheckedChanged(objectsender, EventArgs e)
    {
      theAutomationSettings.AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox = AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox.Checked;
    }privatevoidConnect_Click(objectsender, EventArgs e)
    {varcomType = Type.GetTypeFromProgID(@"PCDLRN.Application");if(comType ==null)
      {return;
      }

      theApp = (PCDLRN.Application)Activator.CreateInstance(comType);if(theApp !=null)
      {
        theApp.WaitUntilReady(500);
        theAutomationSettings = theApp.AutomationSettings;
        PcDmisVisible.Checked = theApp.Visible;
        AutomationShowTipMissingMessageBox.Checked = theAutomationSettings.AutomationShowTipMissingMessageBox;
        AutomationShowTipCalibrationIsOlderThanAllowedMessageBox.Checked = theAutomationSettings.AutomationShowTipCalibrationIsOlderThanAllowedMessageBox;
        AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox.Checked = theAutomationSettings.AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox;
        AutomationShowTipNotAllowedMessageBox.Checked = theAutomationSettings.AutomationShowTipNotAllowedMessageBox;
        AutomationShowTipNotCalibratedMessageBox.Checked = theAutomationSettings.AutomationShowTipNotCalibratedMessageBox;
      }
      enableDisableControls();
    }privatevoidDisconnect_Click(objectsender, EventArgs e)
    {
      theAutomationSettings =null;
      theApp =null;
      GC.Collect();
      Thread.Sleep(20);
      enableDisableControls();
    }privatevoidLoadPartProgram_Click(objectsender, EventArgs e)
    {if(theApp !=null&& theApp.ActivePartProgram ==null)
      {
        openProgramFileDialog.CheckFileExists =true;
        openProgramFileDialog.DefaultExt =@"PRG";
        openProgramFileDialog.Filter ="Part program  files (*.PRG)|*.PRG";
        openProgramFileDialog.ShowDialog();varname = openProgramFileDialog.FileName;
        theApp.PartPrograms.Open(name,"CMM1");
        Thread.Sleep(20);
      }
      enableDisableControls();
    }privatevoidClosePartProgram_Click(objectsender, EventArgs e)
    {if(theApp !=null&& theApp.ActivePartProgram !=null)
      {
        theApp.PartPrograms.CloseAll();
        Thread.Sleep(20);
      }
      enableDisableControls();
    }privatevoidPcDmisVisible_CheckedChanged(objectsender, EventArgs e)
    {
      theApp.Visible = PcDmisVisible.Checked;
    }
  }
} |

# AutomationSettings Object Members

# Public Properties

# See Also

AutomationSettings Object

AutomationShowReadyToMoveWristToMessageBox This property controls whether the "Press OK when ready to Move Wrist to <Angle>" message box appears even when an automation call generates the message. (<Angle> represents an AB angle contained in the message box.) AutomationShowTipCalibrationIsOlderThanAllowedMessageBox This property controls whether the "Tip calibration is older than allowed" message box appears even when an automation call generates the message. AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox This property controls whether the "Tip calibration min max difference is too long" message box appears even when an automation call generates the message. AutomationShowTipMissingMessageBox This property controls whether the "Missing tip" message box appears even when an automation call generates the message. AutomationShowTipNotAllowedMessageBox This property controls whether the "Tip not allowed" message box appears even when an automation call generates the message. AutomationShowTipNotCalibratedMessageBox This property controls whether the "Tip not calibrated" message box appears even when an automation call generates the message.

| AutomationSettings ObjectMembers |

| AutomationShowReadyToMoveWristToMessageBox | This property controls whether the "Press OK when ready to Move Wrist to <Angle>" message box appears even when an automation call generates the message. (<Angle> represents an AB angle contained in the message box.) |
| AutomationShowTipCalibrationIsOlderThanAllowedMessageBox | This property controls whether the "Tip calibration is older than allowed" message box appears even when an automation call generates the message. |
| AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox | This property controls whether the "Tip calibration min max difference is too long" message box appears even when an automation call generates the message. |
| AutomationShowTipMissingMessageBox | This property controls whether the "Missing tip" message box appears even when an automation call generates the message. |
| AutomationShowTipNotAllowedMessageBox | This property controls whether the "Tip not allowed" message box appears even when an automation call generates the message. |
| AutomationShowTipNotCalibratedMessageBox | This property controls whether the "Tip not calibrated" message box appears even when an automation call generates the message. |

### AutomationShowReadyToMoveWristToMessageBox

Read/WriteB**oolean.** True means the message appears. False means it's hidden. The default value is False.

### AutomationShowTipCalibrationIsOlderThanAllowedMessageBox

Read/WriteB**oolean.** True means the message appears. False means it's hidden. The default value is False.

### AutomationShowTipCalibrationMinMaxDifferenceIsTooLargeMessageBox

Read/WriteB**oolean.** True means the message appears. False means it's hidden. The default value is False.

### AutomationShowTipMissingMessageBox

Read/WriteB**oolean.** True means the message appears. False means it's hidden. The default value is False.

### AutomationShowTipNotAllowedMessageBox

Read/WriteB**oolean.** True means the message appears. False means it's hidden. The default value is False.

### AutomationShowTipNotCalibratedMessageBox

Read/WriteB**oolean.** True means the message appears. False means it's hidden. The default value is False.

