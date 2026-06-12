# Object Hierarchy Chart

#### Object 
 Hierarchy Chart

#### Textual 
	 Object Hierarchy

The chart below shows the hierarchal relationship (starting 
 with PCDLRN and moving from left to right) of all the objects in PC-DMIS's 
 type library. You will find this chart useful when coding your scripts.

Additionally, under the chart you will see aTextual 
 Object Heirarchyif you want to search for an item using the find 
 functionality in your browser:

PCDLRN

(Back 
				 to Object Hierarchy Chart)

| PCDLRNApplicationActivePartProgram 
						 (PartProgram)ApplicationEvents 
						 (ApplicationObjectEvents)ApplicationSettingsAutomationSettingsAutoTriggerGetRegistryPoint 
						 (PointData)GetRegistrySettings 
						 (RegistrySettings)RegistrySettingLabelTemplatesLabelTemplateLabelControlsMachinesMachineFPanelPointDataVariableArrayPartProgramsPartProgramActiveMachine 
								 (Machine)BundledStationsBundledStationCadModelCadPolyLinesOnSurfaceCadPolyLineOnSurfaceCadPointsOnSurfaceCadPointOnSurfaceGetEmptyCadHandle 
									 (CadHandle)CadWindowsCadWindowCommandsCommandActiveTipAlignCmndDmisMatrixPointDataArrayIndexAttachBasicScanPointDataCalibrationCommentDataTypesDataTypeDimensionCmdDimFormatDimInfoDispMetafileExternalCommandFeatCmdPointDataTargetsTargetFileIOFlowControlCmdLEAPFROGLoadMachineLoadProbeModalCmdMoveCmdPointDataOPTIONPROBEOptMotionScanControlPointPointDataSTATISTICSTempCompTRACEFIELDVariablePointDataDefaultDimensionColorsDmisMatrixPointDataEditWindowExecutedCommandsItem 
									 (Command)orFindByUniqueID 
									 (Command)ExecutionWindowLIVWindowMasterSlaveDlgPointDataOldBasicOptimizePathPartProgramSettingsDefaultDimensionColors 
									 (DefaultDimensionColors)ProbesProbeTipsTipPointDataQualificationSettingsGetTool 
											 (Tool)ReadoutWindowReportWindowPagesPageReportControlsReportControlToolsToolPointDataQuickStartQuickStartTaskQuickStartStepsQuickStartStepStrategiesStrategyVariablePointDataCommandValue 
										 (Command)PortLockReportTemplatesReportTemplateColorsColorSectionsSectionReportControlsReportControlCommandAnalysisWindowHOBPointInfoListHOBPointInfoSpawnNewInstance 
						 (Application)(Back 
				 to Object Hierarchy Chart) |

- Application
  - ActivePartProgram 
						 (PartProgram)
  - ApplicationEvents 
						 (ApplicationObjectEvents)
  - ApplicationSettings
  - AutomationSettings
  - AutoTrigger
  - GetRegistryPoint 
						 (PointData)
  - GetRegistrySettings 
						 (RegistrySettings)
    - RegistrySetting
  - LabelTemplates
    - LabelTemplate
      - LabelControls
  - Machines
    - Machine
      - FPanel
      - PointData
      - VariableArray
  - PartPrograms
    - PartProgram
      - ActiveMachine 
								 (Machine)
      - BundledStations
        - BundledStation
      - CadModel
        - CadPolyLinesOnSurface
          - CadPolyLineOnSurface
            - CadPointsOnSurface
              - CadPointOnSurface
        - GetEmptyCadHandle 
									 (CadHandle)
      - CadWindows
        - CadWindow
      - Commands
        - Command
          - ActiveTip
          - AlignCmnd
            - DmisMatrix
            - PointData
          - ArrayIndex
          - Attach
          - BasicScan
            - PointData
          - Calibration
          - Comment
          - DataTypes
            - DataType
          - DimensionCmd
          - DimFormat
          - DimInfo
          - DispMetafile
          - ExternalCommand
          - FeatCmd
            - PointData
            - Targets
              - Target
          - FileIO
          - FlowControlCmd
          - LEAPFROG
          - LoadMachine
          - LoadProbe
          - ModalCmd
          - MoveCmd
            - PointData
          - OPTIONPROBE
          - OptMotion
          - Scan
            - ControlPoint
            - PointData
          - STATISTICS
          - TempComp
          - TRACEFIELD
          - Variable
            - PointData
      - DefaultDimensionColors
      - DmisMatrix
        - PointData
      - EditWindow
      - ExecutedCommands
        - Item 
									 (Command) or FindByUniqueID 
									 (Command)
      - ExecutionWindow
      - LIVWindow
      - MasterSlaveDlg
        - PointData
      - OldBasic
      - OptimizePath
      - PartProgramSettings
      - 
        - DefaultDimensionColors 
									 (DefaultDimensionColors)
      - Probes
        - Probe
          - Tips
            - Tip
              - PointData
          - QualificationSettings
            - GetTool 
											 (Tool)
      - ReadoutWindow
      - ReportWindow
        - Pages
          - Page
            - ReportControls
              - ReportControl
      - Tools
        - Tool
          - PointData
      - QuickStart
        - QuickStartTask
          - QuickStartSteps
            - QuickStartStep
      - Strategies
      - Variable
        - PointData
          - CommandValue 
										 (Command)
  - PortLock
  - ReportTemplates
    - ReportTemplate
      - Colors
        - Color
      - Sections
        - Section
          - ReportControls
            - ReportControl
              - Command
              - AnalysisWindow
                - HOBPointInfoList
                  - HOBPointInfo
  - SpawnNewInstance 
						 (Application)