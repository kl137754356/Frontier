# PC-DMIS Reference: Core Application

## Application

# Application Object

# Description

# Object Model

# Remarks

# Example

# Example

# See Also

### Launching PC-DMIS With Startup Options

TheA**pplicationo**bject represents the PC-DMIS application.

To start PC-DMIS using Automation from another application, use CreateObject or GetObject to return anA**pplicationo**bject.

Because of an inherent weakness in the way Microsoft designed the CreateObject function, the CreateObject doesn't allow startup parameters. This means when the code executes it will launch PC-DMIS always in ONLINE mode.

However, there is a way around this. Your code can dynamically create a special startup file that will cause PC-DMIS to launch with specific startup options.

In order to launch PC-DMIS via automation with a startup file you must do the following:

Create a text file named AutomationStartupOptions.txt.

Create a single line of text in the file with the available startup options. The PC-DMIS specific startup options include the following:

/f  - Launches in Offline mode.

/o - Launches in Operator mode.

/d - Launches in Debug mode.

/r - Launches in Reverse Axes mode

/postin - Launches in import mode. PC-DMIS will automatically import a specified file.

/postout - Launches in export mode.PC-DMIS will automatically export a specified file.

The line of text would look like this: /f /o /d /r /postin /postout

Launch PC-DMIS via automation.

When PC-DMIS starts, it checks to see if the AutomationStartupOptions.txt file exists. If it does, then it uses the file to set the necessary flags. However, when PC-DMIS closes, it will delete the text file. This means that the code you use to launch PC-DMIS must also create the needed text file on the fly or must rename an existing file to AutomationStartupOptions.txt. See the "Example Code from C++" below.

Automating in Online Mode:If you are trying to launch PC-DMIS in online mode, please note that the AutomationStartupOptions.txt file should not contain the /f startup parameter. Also, the machine parameter specified when using the Open or New methods of thePa**rtProgramsob**ject determines whether or not the measurement routine will run in offline or online modes. Of online mode, this parameter should be "CMM1".

Application Members

The **Application** object represents the PC-DMIS application.

To start PC-DMIS using Automation from another application, use CreateObject or GetObject to return an **Application** object. Launching PC-DMIS With Startup Options Because of an inherent weakness in the way Microsoft designed the CreateObject function, the CreateObject doesn't allow startup parameters. This means when the code executes it will launch PC-DMIS always in ONLINE mode. However, there is a way around this. Your code can dynamically create a special startup file that will cause PC-DMIS to launch with specific startup options. In order to launch PC-DMIS via automation with a startup file you must do the following: Create a text file named AutomationStartupOptions.txt. Create a single line of text in the file with the available startup options. The PC-DMIS specific startup options include the following: /f - Launches in Offline mode. /o - Launches in Operator mode. /d - Launches in Debug mode. /r - Launches in Reverse Axes mode /postin - Launches in import mode. PC-DMIS will automatically import a specified file. /postout - Launches in export mode. PC-DMIS will automatically export a specified file. The line of text would look like this: /f /o /d /r /postin /postout Launch PC-DMIS via automation. When PC-DMIS starts, it checks to see if the AutomationStartupOptions.txt file exists. If it does, then it uses the file to set the necessary flags. However, when PC-DMIS closes, it will delete the text file. This means that the code you use to launch PC-DMIS must also create the needed text file on the fly or must rename an existing file to AutomationStartupOptions.txt. See the "Example Code from C++" below. Automating in Online Mode: If you are trying to launch PC-DMIS in online mode, please note that the AutomationStartupOptions.txt file should not contain the /f startup parameter. Also, the machine parameter specified when using the Open or New methods of the PartPr**ograms objec**t determines whether or not the measurement routine will run in offline or online modes. Of online mode, this parameter should be "CMM1".

Dim App as Object. Set App = CreateObject("Pcdlrn.Application")

Example Code from C++

| Application Object |

- Create a text file named AutomationStartupOptions.txt.
- Create a single line of text in the file with the available startup options. The PC-DMIS specific startup options include the following:

- Launch PC-DMIS via automation.

# Application Object Members

# Public Methods

# Public Properties

# See Also

The Post function tells PC-DMIS to import or exportS*ourcei*ntoDes*tination. I*t returns TRUE if the import or export process is successful, FALSE otherwise.

Exactly one ofS***ourc*e*a*ndDes***tinationm*u*s*t be a PC-DMIS .prg or .cad file. If it isSource, then PC-DMIS will export based on the name of theDestinationfile. If theDestinationfile is a PC-DMIS .prg or .cad file, then PC-DMIS will import based on the name of theSourcefile.

TheS*ourcef*ile must already exist, but theDes*tinationfil*e need not already exist.

Waits until the online machine has fully initialized or timeout period has elapsed before returning.

Writes the current PC-DMIS registry entries and their values to the debug.txt file.

This returns a string showing the directory that contains the current user’s setup information.

The directory in which the File Opendialog starts. If you set this property to empty it returns the installation path.

The name of the next available machine for attaching to a measurement routine.

The name of the last chosen probe file used when creating a new measurement routine.

The height of the PC-DMIS window in screen pixels.

The left edge of the PC-DMIS window, measured from the left edge of the Windows Desktop.

Returns the major version number of the application.

Returns the minor version number of the application.

The file name of the PC-DMIS executable.

Represents whether or not you are in operator mode. TRUE when in operator mode, FALSE otherwise.

Indicates that PC-DMIS is in Remote Panel mode. Used by Remote Panel Application (RPA).

The text on the status bar of the main PC-DMIS window.

This returns True if the PC-DMIS automation engine is shut down when the user exits PC-DMIS, otherwise this returns False.

Returns the version string for the application.

TRUE if PC-DMIS is visible, otherwise FALSE.

The width of the PC-DMIS window in screen pixels.

Application Object

_AddRegistrySetting ChangeLanguage Set the new langugage DeleteRegistryKey Deletes a key and all its subkeys from the registry DeleteRegistryValue Deletes a value from the registry ExportRegistrySettings GetAvailableLanguages Returns the list of available PCDMIS languages IDs or descriptions. GetHelpMap Returns help map for menu id, used by online help GetLanguageDescription Returns the descriptions of supplied language. The description is in the current PCDMIS language GetRegistryBool Gets a boolean from the registry GetRegistryDouble** Gets **a doubl**e from** the registry GetRegistryDWORD Gets a DWORD from the registry GetRegistryInt Gets an integer from the registry GetRegistryPoint Gets an XYZ triple from the registry GetRegistryRoot Gets the registry root for current PCDMIS version GetRegistrySettings Gets the settings object for the application GetRegistryString** Gets **a string from the registry GetSystemDocuments Gets the Document Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter GetSystemHiddenFolder Gets the System Hidden Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter GetSystemReportingFolder Gets the Sustem Reporting Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter GetUserHiddenFolder Gets the User Hidden Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter GetUserVisibleFolder Gets the User Visible Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter Help Calls and opens a help file and topic. ImportRegistrySettings Maximize The Maximize Subroutine expands the PC-DMIS window to full-screen size. Minimize The Minimize subroutine reduces the PC-DMIS window to the taskbar. PartProgramMirror This allows you to create a mirror image copy in the X, Y, or Z axis of a measurement routine. PartProgramMirror2 Mirrors the supplied measurement routine. The szPartProgramPathName, szTargetProgramPathName and szReferencePathName should be full path name. If szTargetProgramPathName is empty the default name is used. if DoNotMirrorCAD is true the CAD is not mirrored Post The Post function tells PC-DMIS to import or export Source *****in*t*o* *D*estina*****tion . *I*t* *r*eturns TRUE if the import or export process is successful, FALSE otherwise. Exactly one of Source and Destination must be a PC-DMIS .prg or .cad file. If it is Source , then PC-DMIS will export based on the name of the Destination file. If the Destination file is a PC-DMIS .prg or .cad file, then PC-DMIS will import based on the name of the Source file. The Source file must already exist, but the Destination file need not already exist. Quit The Quit function tells PC-DMIS to close. It always returns TRUE. RegistryKeyExists Queries the registry for a specific key RegistryValueExists Queries the registry for a specific value Restore The Restore subroutine makes the PC-DMIS window open and neither maximized nor minimized. SetActive Brings PC-DMIS to the foreground, making it the active application. SpawnNewInstance SwitchLanguageFiles Deprecated. Switch language resource files from current to expected WaitUntilReady Waits until the online machine has fully initialized or timeout period has elapsed before returning. WinHelp Invokes internal help WriteRegistryBool Sets a PC-DMIS registry entry to a TRUE or FALSE value. WriteRegistryDouble Sets a PC-DMIS registry entry to a specified Double value. WriteRegistryDWORD Sets a PC-DMIS registry entry to a specified long value. WriteRegistryInt Sets a PC-DMIS registry entry to a specified integer value. Write Integer** . Writ**eRegistryPoint Sets a PC-DMIS registry entry to a specified XYZ value. Write double . WriteRegistrySettings Writes the current PC-DMIS registry entries and their values to the debug.txt file. WriteRegistryString This writes a specified string value to a valid PC-DMIS registry entry. Write String .

_Name ActivePartProgram Represents the currently active measurement routine. AdminPrivileges Read Only: Returns true if current user has administrator privileges ApplicationEvents Returns the Appli**cationObjectEvents obje**ct for use in capturing application events. Applic**ationSettings Retur**ns the ApplicationSettings object for use in modifying PC-DMIS’s settings. AutomationSettings Read Only: Returns the AutomationSettings Object BuildNumber Returns the specific build number for the PC-DMIS application. BuildPlatform Returns the build platform (x64 or x86) for the PC-DMIS application. BuildType Returns the application's build type. Generally this is "QA" (a build from the development source code) or "Release" (a build from the release source code). Caption The text in the title bar of the application. ConnectedInDriveMode Read Only: Returns true when computer connected as driving computer ConnectedInRelayMode Read Only: Returns true when computer connected as relay computer ConnectedToMaster Read Only: Returns true if connected to master computer as slave ConnectedToSlave Read Only: Returns true if connected to slave computer as master CurrentFolder This property gets or sets the current folder in PC-DMIS. The property only sets a folder if all part programs are closed. CurrentLanguage Read Only: Returns the current PCDMIS languages ID CurrentUserDirectory This returns a string showing the directory that contains the current user’s setup information. DefaultFilePath The directory in which the File Open dialog starts. If you set this property to empty it returns the installation path. DefaultMachineName The name of the next available machine for attaching to a measurement routine. DefaultProbeFile The name of the last chosen probe file used when creating a new measurement routine. ErrorDialogEnabled Read/Write: Returns/Sets whether the CMM Error Dialog is enabled FullName The fully qualified path name of the PC-DMIS executable. GetBoolSetting Read Only: Returns the boolean value of the named PC-DMIS setting GetDoubleSetting Read Only: Returns the double value of the named PC-DMIS setting GetDWORDSetting Read Only: Returns the DWORD, or unsigned long, value of the named PC-DMIS setting GetIntSetting Read Only: Returns the integer value of the named PC-DMIS setting GetStringSetting Read Only: Returns the string value of the named PC-DMIS setting Height The height of the PC-DMIS window in screen pixels. IsClosing This returns True when the PC-DMIS application window quits, through the File | Exit menu ite**m, or when **someone closes the application window manually with the x button in the top right. LabelTemplates Read Only: Returns the Label Templates object Left The left edge of the PC-DMIS window, measured from the left edge of the Windows Desktop. LmsLicense Read Only: Returns pointer to Lms License object LocaleID Read Only: Returns the current LocaleID (LCID) of the application LockObjectCount This property returns the number of PC-DMIS automation objects referenced by the automation application or script. Machines Returns the read**-only Ma**chines collection object. MajorVersion Returns the major version number of the application. MinorVersion Returns the minor version number of the application. Name The file name of the PC-DMIS executable. OperatorMode Represents whether or not you are in operator mode. TRUE when in operator mode, FALSE otherwise. PartPrograms Returns the collection of measurement routines currently active in PC-DMIS as a PartPrograms object. Path Returns the directory in which the PC-DMIS executable resides. PortLock Read Only: Returns pointer to PortLock object ReleaseType Read Only: Returns the application release type ReleaseTypeName Read Only: Returns the application release type RemotePanelMode Indicates that PC-DMIS is in Remote Panel mode. Used by Remote Panel Application (RPA). ReportTemplates Read Only: Returns the Report Templates object StatusBar The text on the status bar of the main PC-DMIS window. Top The top edge of the PC-DMIS window, measured from the top edge of the Windows Desktop. UserExit This returns True if the PC-DMIS automation engine is shut down when the user exits PC-DMIS, otherwise this returns False. VerboseDialogs Read/Write: Controls verbose debugging dialogs VersionString Returns the version string for the application. Visible TRUE if PC-DMIS is visible, otherwise FALSE. Width The width of the PC-DMIS window in screen pixels.

| Application ObjectMembers |

| _AddRegistrySetting | ChangeLanguage | Set the new langugage |
| DeleteRegistryKey | Deletes a key and all its subkeys from the registry |
| DeleteRegistryValue | Deletes a value from the registry |
| ExportRegistrySettings | GetAvailableLanguages | Returns the list of available PCDMIS languages IDs or descriptions. |
| GetHelpMap | Returns help map for menu id, used by online help |
| GetLanguageDescription | Returns the descriptions of supplied language. The description is in the current PCDMIS language |
| GetRegistryBool | Gets a boolean from the registry |
| GetRegistryDouble | Gets a double from the registry |
| GetRegistryDWORD | Gets a DWORD from the registry |
| GetRegistryInt | Gets an integer from the registry |
| GetRegistryPoint | Gets an XYZ triple from the registry |
| GetRegistryRoot | Gets the registry root for current PCDMIS version |
| GetRegistrySettings | Gets the settings object for the application |
| GetRegistryString | Gets a string from the registry |
| GetSystemDocuments | Gets the Document Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter |
| GetSystemHiddenFolder | Gets the System Hidden Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter |
| GetSystemReportingFolder | Gets the Sustem Reporting Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter |
| GetUserHiddenFolder | Gets the User Hidden Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter |
| GetUserVisibleFolder | Gets the User Visible Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter |
| Help | Calls and opens a help file and topic. |
| ImportRegistrySettings | Maximize | The Maximize Subroutine expands the PC-DMIS window to full-screen size. |
| Minimize | The Minimize subroutine reduces the PC-DMIS window to the taskbar. |
| PartProgramMirror | This allows you to create a mirror image copy in the X, Y, or Z axis of a measurement routine. |
| PartProgramMirror2 | Mirrors the supplied measurement routine. The szPartProgramPathName, szTargetProgramPathName and szReferencePathName should be full path name. If szTargetProgramPathName is empty the default name is used. if DoNotMirrorCAD is true the CAD is not mirrored |
| Post | The Post function tells PC-DMIS to import or exportSourceintoDestination. It returns TRUE if the import or export process is successful, FALSE otherwise.Exactly one ofSourceandDestinationmust be a PC-DMIS .prg or .cad file. If it isSource, then PC-DMIS will export based on the name of theDestinationfile. If theDestinationfile is a PC-DMIS .prg or .cad file, then PC-DMIS will import based on the name of theSourcefile.TheSourcefile must already exist, but theDestinationfile need not already exist. |
| Quit | The Quit function tells PC-DMIS to close. It always returns TRUE. |
| RegistryKeyExists | Queries the registry for a specific key |
| RegistryValueExists | Queries the registry for a specific value |
| Restore | The Restore subroutine makes the PC-DMIS window openand neither maximized nor minimized. |
| SetActive | Brings PC-DMIS to the foreground, making it the active application. |
| SpawnNewInstance | SwitchLanguageFiles | Deprecated. Switch language resource files from current to expected |
| WaitUntilReady | Waits until the online machine has fully initialized or timeout period has elapsed before returning. |
| WinHelp | Invokes internal help |
| WriteRegistryBool | Sets a PC-DMIS registry entry to a TRUE or FALSE value. |
| WriteRegistryDouble | Sets a PC-DMIS registry entry to a specifiedDoublevalue. |
| WriteRegistryDWORD | Sets a PC-DMIS registry entry to a specified long value. |
| WriteRegistryInt | Sets a PC-DMIS registry entry to a specified integer value. WriteInteger. |
| WriteRegistryPoint | Sets a PC-DMIS registry entry to a specified XYZ value. Writedouble. |
| WriteRegistrySettings | Writes the current PC-DMIS registry entries and their values to the debug.txt file. |
| WriteRegistryString | This writes a specified string value to a valid PC-DMIS registry entry. WriteString. |

| _Name | ActivePartProgram | Represents the currently active measurement routine. |
| AdminPrivileges | Read Only:  Returns true if current user has administrator privileges |
| ApplicationEvents | Returns theApplicationObjectEventsobject for use in capturing application events. |
| ApplicationSettings | Returns theApplicationSettingsobject for use in modifying PC-DMIS’s settings. |
| AutomationSettings | Read Only:  Returns the AutomationSettings Object |
| BuildNumber | Returns the specific build number for the PC-DMIS application. |
| BuildPlatform | Returns the build platform (x64 or x86) for the PC-DMIS application. |
| BuildType | Returns the application's build type. Generally this is "QA" (a build from the development source code) or "Release" (a build from the release source code). |
| Caption | The text in the title bar of the application. |
| ConnectedInDriveMode | Read Only:  Returns true when computer connected as driving computer |
| ConnectedInRelayMode | Read Only:  Returns true when computer connected as relay computer |
| ConnectedToMaster | Read Only:  Returns true if connected to master computer as slave |
| ConnectedToSlave | Read Only:  Returns true if connected to slave computer as master |
| CurrentFolder | This property gets or sets the current folder in PC-DMIS. The property only sets a folder if all part programs are closed. |
| CurrentLanguage | Read Only:  Returns the current PCDMIS languages ID |
| CurrentUserDirectory | This returns a string showing the directory that contains the current user’s setup information. |
| DefaultFilePath | The directory in which the File Opendialog starts. If you set this property to empty it returns the installation path. |
| DefaultMachineName | The name of the next available machine for attaching to a measurement routine. |
| DefaultProbeFile | The name of the last chosen probe file used when creating a new measurement routine. |
| ErrorDialogEnabled | Read/Write:  Returns/Sets whether the CMM Error Dialog is enabled |
| FullName | The fully qualified path name of the PC-DMIS executable. |
| GetBoolSetting | Read Only:  Returns the boolean value of the named PC-DMIS setting |
| GetDoubleSetting | Read Only:  Returns the double value of the named PC-DMIS setting |
| GetDWORDSetting | Read Only:  Returns the DWORD, or unsigned long, value of the named PC-DMIS setting |
| GetIntSetting | Read Only:  Returns the integer value of the named PC-DMIS setting |
| GetStringSetting | Read Only:  Returns the string value of the named PC-DMIS setting |
| Height | The height of the PC-DMIS window in screen pixels. |
| IsClosing | This returns True when the PC-DMIS application window quits, through theFile | Exitmenu item, or when someone closes the application window manually with the x button in the top right. |
| LabelTemplates | Read Only:  Returns the Label Templates object |
| Left | The left edge of the PC-DMIS window, measured from the left edge of the Windows Desktop. |
| LmsLicense | Read Only:  Returns pointer to Lms License object |
| LocaleID | Read Only:  Returns the current LocaleID (LCID) of the application |
| LockObjectCount | This property returns the number of PC-DMIS automation objects referenced by the automation application or script. |
| Machines | Returns the read-onlyMachinescollection object. |
| MajorVersion | Returns the major version number of the application. |
| MinorVersion | Returns the minor version number of the application. |
| Name | The file name of the PC-DMIS executable. |
| OperatorMode | Represents whether or not you are in operator mode. TRUE when in operator mode, FALSE otherwise. |
| PartPrograms | Returns the collection of measurement routines currently active in PC-DMIS as a PartPrograms object. |
| Path | Returns the directory in which the PC-DMIS executable resides. |
| PortLock | Read Only:  Returns pointer to PortLock object |
| ReleaseType | Read Only:  Returns the application release type |
| ReleaseTypeName | Read Only:  Returns the application release type |
| RemotePanelMode | Indicates that PC-DMIS is in Remote Panel mode. Used by Remote Panel Application (RPA). |
| ReportTemplates | Read Only:  Returns the Report Templates object |
| StatusBar | The text on the status bar of the main PC-DMIS window. |
| Top | The top edge of the PC-DMIS window, measured from the top edge of the Windows Desktop. |
| UserExit | This returns True if the PC-DMIS automation engine is shut down when the user exits PC-DMIS, otherwise this returns False. |
| VerboseDialogs | Read/Write:  Controls verbose debugging dialogs |
| VersionString | Returns the version string for the application. |
| Visible | TRUE if PC-DMIS is visible, otherwise FALSE. |
| Width | The width of the PC-DMIS window in screen pixels. |

### ActivePartProgram

Represents the currently active measurement routine.

### AdminPrivileges

Read Only: Returns true if current user has administrator privileges

### ApplicationEvents

Returns the **ApplicationObjectEvents** object for use in capturing application events.

### ApplicationSettings

Returns the **ApplicationSettings** object for use in modifying PC-DMIS’s settings.

### AutomationSettings

Read Only: Returns the AutomationSettings Object

### BuildNumber

Returns the specific build number for the PC-DMIS application.

### BuildPlatform

Returns the build platform (x64 or x86) for the PC-DMIS application.

### BuildType

Returns the application's build type. Generally this is "QA" (a build from the development source code) or "Release" (a build from the release source code).

### Caption

The text in the title bar of the application.

### ChangeLanguage

Set the new langugage

### ConnectedInDriveMode

Read Only: Returns true when computer connected as driving computer

### ConnectedInRelayMode

Read Only: Returns true when computer connected as relay computer

### ConnectedToMaster

Read Only: Returns true if connected to master computer as slave

### ConnectedToSlave

Read Only: Returns true if connected to slave computer as master

### CurrentFolder

This example code connects to PC-DMIS, and lets you get or set the current folder.

### CurrentLanguage

Read Only: Returns the current PCDMIS languages ID

### CurrentUserDirectory

This returns a string showing the directory that contains the current user’s setup information.

### DefaultFilePath

The directory in which the File Opendialog starts. If you set this property to empty it returns the installation path.

### DefaultMachineName

The name of the next available machine for attaching to a measurement routine.

### DefaultProbeFile

The name of the last chosen probe file used when creating a new measurement routine.

### DeleteRegistryKey

Deletes a key and all its subkeys from the registry

### DeleteRegistryValue

Deletes a value from the registry

### ErrorDialogEnabled

Read/Write: Returns/Sets whether the CMM Error Dialog is enabled

### Example Code from C++_E

Launching PC-DMIS Using C++

### ExportRegistrySettings

Visual Basic Public Function ExportRegistrySettings( _ ByVal Fi*lePath A*s String _ ) As Long

### FullName

The fully qualified path name of the PC-DMIS executable.

### GetAvailableLanguages

Returns the list of available PCDMIS languages IDs or descriptions.

### GetBoolSetting

Read Only: Returns the boolean value of the named PC-DMIS setting

### GetDWORDSetting

Read Only: Returns the DWORD, or unsigned long, value of the named PC-DMIS setting

### GetDoubleSetting

Read Only: Returns the double value of the named PC-DMIS setting

### GetHelpMap

Returns help map for menu id, used by online help

### GetIntSetting

Read Only: Returns the integer value of the named PC-DMIS setting

### GetLanguageDescription

Returns the descriptions of supplied language. The description is in the current PCDMIS language

### GetRegistryBool

Gets a boolean from the registry

### GetRegistryDWORD

Gets a DWORD from the registry

### GetRegistryDouble

Gets a double from the registry

### GetRegistryInt

Gets an integer from the registry

### GetRegistryPoint

Gets an XYZ triple from the registry

### GetRegistryRoot

Gets the registry root for current PCDMIS version

### GetRegistrySettings

Gets the settings object for the application

### GetRegistryString

Gets a string from the registry

### GetStringSetting

Read Only: Returns the string value of the named PC-DMIS setting

### GetSystemDocuments

Gets the Document Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter

### GetSystemHiddenFolder

Gets the System Hidden Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter

### GetSystemReportingFolder

Gets the Sustem Reporting Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter

### GetUserHiddenFolder

Gets the User Hidden Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter

### GetUserVisibleFolder

Gets the User Visible Folder. The Generic or Version Specific folder is returned according the bVersionSpecific parameter

### Height

The height of the PC-DMIS window in screen pixels.

### Help

If both the HelpContext and HelpString are provided, the HelpString will be ignored. If neither is provided, the first help page is shown.

### ImportRegistrySettings

Visual Basic Public Function ImportRegistrySettings( _ ByVal Fi*lePath A*s String _ ) As Long

### IsClosing

When you run PC-DMIS through automation and the application window closes, the pcdlrn.exe process continues to run in the background without any visible user interface until the automation application releases all references.

### LabelTemplates

Read Only: Returns the Label Templates object

### Left

The left edge of the PC-DMIS window, measured from the left edge of the Windows Desktop.

### LmsLicense

Read Only: Returns pointer to Lms License object

### LocaleID

Read Only: Returns the current LocaleID (LCID) of the application

### LockObjectCount

When you run PC-DMIS through automation and the application window closes, the pcdlrn.exe process continues to run in the background without any visible user interface until the automation application releases all references.

### Machines

Returns the read-only **Machines** collection object.

### MajorVersion

Returns the major version number of the application.

### Maximize

The Maximize Subroutine expands the PC-DMIS window to full-screen size.

### Minimize

The Minimize subroutine reduces the PC-DMIS window to the taskbar.

### MinorVersion

Returns the minor version number of the application.

### Name

The file name of the PC-DMIS executable.

### OperatorMode

Represents whether or not you are in operator mode. TRUE when in operator mode, FALSE otherwise.

### PartProgramMirror

This allows you to create a mirror image copy in the X, Y, or Z axis of a measurement routine.

### PartProgramMirror2

Mirrors the supplied measurement routine. The szPartProgramPathName, szTargetProgramPathName and szReferencePathName should be full path name. If szTargetProgramPathName is empty the default name is used. if DoNotMirrorCAD is true the CAD is not mirrored

### PartPrograms

Returns the collection of measurement routines currently active in PC-DMIS as a PartPrograms object.

### Path

If the PC-DMIS executable is C:\PCDMISW\PCDLRN.EXE, the Path  property is "C:\PCDMISW\".

### PortLock

Read Only: Returns pointer to PortLock object

### Post

The Post function tells PC-DMIS to import or exportS*ourcei*ntoDes*tination. I*t returns TRUE if the import or export process is successful, FALSE otherwise.

### Quit

The Quit function tells PC-DMIS to close. It always returns TRUE.

### RegistryKeyExists

Queries the registry for a specific key

### RegistryValueExists

Queries the registry for a specific value

### ReleaseType

Read Only: Returns the application release type

### ReleaseTypeName

Read Only: Returns the application release type

### RemotePanelMode

Indicates that PC-DMIS is in Remote Panel mode. Used by Remote Panel Application (RPA).

### ReportTemplates

Read Only: Returns the Report Templates object

### Restore

The Restore subroutine makes the PC-DMIS window open and neither maximized nor minimized.

### SetActive

Brings PC-DMIS to the foreground, making it the active application.

### SpawnNewInstance

ReturnsA**pplicationO**bject of newly created instance of application.

### StatusBar

The text on the status bar of the main PC-DMIS window.

### SwitchLanguageFiles

Deprecated. Switch language resource files from current to expected

### Top

The top edge of the PC-DMIS window, measured from the top edge of the Windows Desktop.

### UserExit

This returns True if the PC-DMIS automation engine is shut down when the user exits PC-DMIS, otherwise this returns False.

### VerboseDialogs

Read/Write: Controls verbose debugging dialogs

### VersionString

Returns the version string for the application.

### Visible

TRUE if PC-DMIS is visible, otherwise FALSE.

### WaitUntilReady

Waits until the online machine has fully initialized or timeout period has elapsed before returning.

### Width

The width of the PC-DMIS window in screen pixels.

### WinHelp

Invokes internal help

### WriteRegistryBool

**Boolean**value that determines whether or not the value of the third parameter was successfully written to the registry entry.

### WriteRegistryDWORD

' This code sample sets an auto circle’s hits to the long value of 4.

### WriteRegistryDouble

**Booleanv**alue that determines whether or not the value of the third parameter was successfully written to the registry entry.

### WriteRegistryInt

' This code sample sets the number of rows for auto feature cylinders to the integer value of 3.

### WriteRegistryPoint

Sets a PC-DMIS registry entry to a specified XYZ value. Write **double** .

### WriteRegistrySettings

Writes the current PC-DMIS registry entries and their values to the debug.txt file.

### WriteRegistryString

' The following code sample, sets the PC-DMIS password for theS**etup Optionsdi**alog box to the string: "PCDMIS007".

### _AddRegistrySetting

Visual Basic Public Sub _AddRegistrySetting( _ ByVal sz*Section A*s String, _ ByVal szEnt*ry As S*tring, _ ByVal szDefaul*t As Stri*ng, _ ByVal nType As Lo*ng, _* ByVal nFunction As L*ong, _ By*Val bUserAdmin As Boo*lean, _ By*Val bAutoEnabled As Bool*ean, _ ByVal* bSingleton As Boolean _* )*

### _Name

Visual Basic Public Property _Name As String

