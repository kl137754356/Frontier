# PC-DMIS Enumerations and Constants


---

## AUTOVECTORTYPES

# AUTOVECTORTYPES Enumeration

# Members

Member Value Description PCD_ANGLE_VECTOR 6 PCD_EDGE_REPORT_VECTOR 8 PCD_MEASURE_VECTOR 10 PCD_PIN_VECTOR 5 PCD_PUNCH_VECTOR 4 PCD_REPORT_VECTOR 7 PCD_SURF_REPORT_VECTOR 9 PCD_UPDATE_VECTOR 11 PCD_VECTOR1 1 PCD_VECTOR2 2 PCD_VECTOR3 3

| AUTOVECTORTYPES Enumeration |

| Member | Value | Description |
| --- | PCD_ANGLE_VECTOR | 6 | PCD_EDGE_REPORT_VECTOR | 8 | PCD_MEASURE_VECTOR | 10 | PCD_PIN_VECTOR | 5 | PCD_PUNCH_VECTOR | 4 | PCD_REPORT_VECTOR | 7 | PCD_SURF_REPORT_VECTOR | 9 | PCD_UPDATE_VECTOR | 11 | PCD_VECTOR1 | 1 | PCD_VECTOR2 | 2 | PCD_VECTOR3 | 3

---

## BSBOUNDCOND_ENUM

# BSBOUNDCOND_ENUM Enumeration

# Members

Member Value Description BSBOUNDCOND_CONE 600050 Represents a Conical Boundary Condition. This Boundary condition requires the following parameters to be set you user using Automation Properties and/or Automation Methods : BoundaryConditionCenter, BoundaryConditionEndApproach, BoundaryConditionAxisV, HalfAngle, number of Crossings. BSBOUNDCOND_CYLINDER 600040 Represents a Cylindrical Boundary Condition. This Boundary condition requires the following parameters to be set by you using Automation Properties and/or Automation Methods : BoundaryConditionCenter, BoundaryConditionEndApproach, BoundaryConditionAxisV, Diameter, number of Crossings. BSBOUNDCOND_PLANECROSS 600030 Represents a Planar Boundary Condition. This Boundary condition requires the following parameters to be set by you using Automation Properties and/or Automation Methods : BoundaryConditionCenter, BoundaryConditionEndApproach, BoundaryConditionPlaneV, number of Crossings. BSBOUNDCOND_SPHERE 600010 Represents a Spherical Boundary Condition. This Boundary condition requires the following parameters to be set by you using Automation Properties and/or Automation Methods : BoundaryConditionCenter, BoundaryConditionEndApproach, Diameter, number of Crossings.

| BSBOUNDCOND_ENUM Enumeration |

| Member | Value | Description |
| --- | BSBOUNDCOND_CONE | 600050 | Represents a Conical Boundary Condition. This Boundary condition requires the following parameters to be set you user using Automation Properties and/or Automation Methods : BoundaryConditionCenter, BoundaryConditionEndApproach, BoundaryConditionAxisV, HalfAngle, number of Crossings. |
| BSBOUNDCOND_CYLINDER | 600040 | Represents a Cylindrical Boundary Condition. This Boundary condition requires the following parameters to be set by you using Automation Properties and/or Automation Methods : BoundaryConditionCenter, BoundaryConditionEndApproach, BoundaryConditionAxisV, Diameter, number of Crossings. |
| BSBOUNDCOND_PLANECROSS | 600030 | Represents a Planar Boundary Condition. This Boundary condition requires the following parameters to be set by you using Automation Properties and/or Automation Methods : BoundaryConditionCenter, BoundaryConditionEndApproach, BoundaryConditionPlaneV, number of Crossings. |
| BSBOUNDCOND_SPHERE | 600010 | Represents a Spherical Boundary Condition. This Boundary condition requires the following parameters to be set by you using Automation Properties and/or Automation Methods : BoundaryConditionCenter, BoundaryConditionEndApproach, Diameter, number of Crossings. |

---

## BSCANHIT_ENUM

# BSCANHIT_ENUM Enumeration

# Members

Member Value Description BSCANHIT_BASIC 700090 Use basic hits for this scan. Only Manual scans use this hit type. BSCANHIT_EDGE 700030 Use edge hits for this scan. BSCANHIT_SURFACE 700020 Use surface hits for this scan. BSCANHIT_VECTOR 700010 Use vector hits for this scan.

| BSCANHIT_ENUM Enumeration |

| Member | Value | Description |
| --- | BSCANHIT_BASIC | 700090 | Use basic hits for this scan. Only Manual scans use this hit type. |
| BSCANHIT_EDGE | 700030 | Use edge hits for this scan. |
| BSCANHIT_SURFACE | 700020 | Use surface hits for this scan. |
| BSCANHIT_VECTOR | 700010 | Use vector hits for this scan. |

---

## BSCANMETH_ENUM

# BSCANMETH_ENUM Enumeration

# Members

Member Value Description BSCANMETH_ANGLE 100075 BSCANMETH_CENTER 100140 Finds a Low Point on a surface. BSCANMETH_CIRCLE 100125 Scans around a circle in a high speed, continuous contact mode. BSCANMETH_CLOSE 100510 This method will scan the surface along a line. This procedure uses the starting and ending point for the line and also includes a direction point. The probe will always remain within the cut plane while doing the scan.The scan will start and finish at the same Point. This is valid oly for DCC scans. BSCANMETH_CYLINDER 100130 Scans around a cylinder in a high speed, continuous contact mode. BSCANMETH_EDGE 100050 Scans the Edge of the Surface in a Touch Trigger mode. BSCANMETH_FREEFORM 100555 BSCANMETH_GRID 100560 BSCANMETH_LINEAR 100010 Scans the surface along a line. This procedure uses the starting and ending point for the line, and also includes a direction point. The probe will always remain within the cut plane while doing the scan. BSCANMETH_MANUAL_FIXED_PROBE 100610 This is valid only for Manual scans and will allow you to use a Hard Probe to take Manual hits. BSCANMETH_MANUAL_TTP 100600 This is valid only for Manual scans and will allow you to use a Touch Trigger Probe to take Manual hits. BSCANMETH_OPEN 100500 This method will scan the surface along a line. This procedure uses the starting and ending point for the line and also includes a direction point. The probe will always remain within the cut plane while doing the scan. This is valid oly for DCC scans. BSCANMETH_PATCH 100520 This method will scan the surface in multiple rows depending on the Boundary Points. This is valid oly for DCC scans. BSCANMETH_PERIMETER 100100 BSCANMETH_ROTARY 100545 BSCANMETH_STRAIGHTLINE 100135 Scans a straight line in a high speed, continuous contact mode. BSCANMETH_UV 100530

| BSCANMETH_ENUM Enumeration |

| Member | Value | Description |
| --- | BSCANMETH_ANGLE | 100075 | BSCANMETH_CENTER | 100140 | Finds a Low Point on a surface. |
| BSCANMETH_CIRCLE | 100125 | Scans around a circle in a high speed, continuous contact mode. |
| BSCANMETH_CLOSE | 100510 | This method will scan the surface along a line. This procedure uses the starting and ending point for the line and also includes a direction point. The probe will always remain within the cut plane while doing the scan.The scan will start and finish at the same Point. This is valid oly for DCC scans. |
| BSCANMETH_CYLINDER | 100130 | Scans around a cylinder in a high speed, continuous contact mode. |
| BSCANMETH_EDGE | 100050 | Scans the Edge of the Surface in a Touch Trigger mode. |
| BSCANMETH_FREEFORM | 100555 | BSCANMETH_GRID | 100560 | BSCANMETH_LINEAR | 100010 | Scans the surface along a line. This procedure uses the starting and ending point for the line, and also includes a direction point. The probe will always remain within the cut plane while doing the scan. |
| BSCANMETH_MANUAL_FIXED_PROBE | 100610 | This is valid only for Manual scans and will allow you to use a Hard Probe to take Manual hits. |
| BSCANMETH_MANUAL_TTP | 100600 | This is valid only for Manual scans and will allow you to use a Touch Trigger Probe to take Manual hits. |
| BSCANMETH_OPEN | 100500 | This method will scan the surface along a line. This procedure uses the starting and ending point for the line and also includes a direction point. The probe will always remain within the cut plane while doing the scan. This is valid oly for DCC scans. |
| BSCANMETH_PATCH | 100520 | This method will scan the surface in multiple rows depending on the Boundary Points. This is valid oly for DCC scans. |
| BSCANMETH_PERIMETER | 100100 | BSCANMETH_ROTARY | 100545 | BSCANMETH_STRAIGHTLINE | 100135 | Scans a straight line in a high speed, continuous contact mode. |
| BSCANMETH_UV | 100530

---

## BSCANNMODE_ENUM

# BSCANNMODE_ENUM Enumeration

# Members

Member Value Description BSCANNMODE_FINDCADNOMINAL 400001 This mode would find the Nominal data from CAD after scanning. This mode is useful only when CAD surface data is available. BSCANNMODE_FINDCADNOMSMULTIROW 400003 BSCANNMODE_MASTERDATA 400002 This mode keeps the data scanned the first time as Master data.

| BSCANNMODE_ENUM Enumeration |

| Member | Value | Description |
| --- | BSCANNMODE_FINDCADNOMINAL | 400001 | This mode would findthe Nominal data from CAD after scanning. This mode is useful only when CAD surface data is available. |
| BSCANNMODE_FINDCADNOMSMULTIROW | 400003 | BSCANNMODE_MASTERDATA | 400002 | This mode keeps the data scanned the first time as Master data. |

---

## BSCANOPMODE_ENUM

# BSCANOPMODE_ENUM Enumeration

# Members

This execute mode is available only for Analog Probe Heads. When this is selected, PC-DMIS uses the built-in High Speed scanning capability of the controller to execute a scan.

**Example:**If you selected a Circle scan, PC-DMIS would use a corresponding Circle scanning command in the controller and pass on the parameters to the controller to execute. In this case, PC-DMIS does not control execution of the scans.

Member Value Description BSCANOPMODE_DEFINEPATHFROMHITS 500021 This mode is available only when using analog probe heads that can do continuous contact scanning. When this option is selected, PC-DMIS allows the controller to "define" a scan. PC-DMIS gathers all hit locations from the editor and passes them onto the controller for scanning. The controller will then adjust the path allowing the probe to pass through all the points. The data is then reduced according to the increment provided and the new data will replace any old measured data. Currently, this value cannot be used through Automation since there is no method provided to define a path. BSCANOPMODE_HIGHSPEEDFEATUREBASED 500022 This execute mode is available only for Analog Probe Heads. When this is selected, PC-DMIS uses the built-in High Speed scanning capability of the controller to execute a s**can. Exa**mple: If you selected a Circle scan, PC-DMIS would use a corresponding Circle scanning command in the controller and pass on the parameters to the controller to execute. In this case, PC-DMIS does not control execution of the scans. BSCANOPMODE_NORMALEXECUTION 500201 If a DCC scan is executed, PC-DMIS will take hits at each of the learned locations in Stitch scanning mode, storing the newly measured data. BSCANOPMODE_REGULARLEARN 500011 When this mode is used, PC-DMIS will execute the scan as though it is learning it. All learned measured data will replace the new measured data. The nominal will be re-calculated depending on the Nominals mode.

| BSCANOPMODE_ENUM Enumeration |

| Member | Value | Description |
| --- | BSCANOPMODE_DEFINEPATHFROMHITS | 500021 | This mode is available only when using analog probe heads that can do continuous contact scanning. When this option is selected, PC-DMIS allows the controller to "define" a scan. PC-DMIS gathers all hit locations from the editor and passes them onto the controller for scanning. The controller will then adjust the path allowing the probe to pass through all the points. The data is then reduced according to the increment provided and the new data will replace any old measured data. Currently, this value cannot be used through Automation since there is no method provided to define a path. |
| BSCANOPMODE_HIGHSPEEDFEATUREBASED | 500022 | This execute mode is available only for Analog Probe Heads. When this is selected, PC-DMIS uses the built-in High Speed scanning capability of the controller to execute a scan.Example:If you selected a Circle scan, PC-DMIS would use a corresponding Circle scanning command in the controller and pass on the parameters to the controller to execute. In this case, PC-DMIS does not control execution of the scans. |
| BSCANOPMODE_NORMALEXECUTION | 500201 | If a DCC scan is executed, PC-DMIS will take hits at each of the learned locations in Stitch scanning mode, storing the newly measured data. |
| BSCANOPMODE_REGULARLEARN | 500011 | When this mode is used, PC-DMIS will executethe scan as though it is learning it. All learned measured data will replacethe new measured data. The nominal will be re-calculated depending on the Nominals mode. |

---

## BSCTRLPT_ENUM

# BSCTRLPT_ENUM Enumeration

# Members

Member Value Description BSCTRLPT_CONE 800040 BSCTRLPT_CYLINDER 800030 BSCTRLPT_PLANE 800020 BSCTRLPT_SPHERE 800010

| BSCTRLPT_ENUM Enumeration |

| Member | Value | Description |
| --- | BSCTRLPT_CONE | 800040 | BSCTRLPT_CYLINDER | 800030 | BSCTRLPT_PLANE | 800020 | BSCTRLPT_SPHERE | 800010

---

## BSF_ENUM

# BSF_ENUM Enumeration

# Members

PC-DMIS will take hits at the set increment along the current part's coordinate system. The approach of the probe is perpendicular to the indicated axis. The probe will stay on the cut plane. The approach vector will be normal to the selected axis and on the cut plane. This technique uses the same approach for taking each hit (unlike the previous technique which adjusts the approach to be perpendicular to the line between the previous two hits). Only DCC scans should use this filter.

When this filter is applied to Manual scans, the following behaviour happens:

This Filter property allows you to scan a part by specifying a cut plane on a certain part axis and dragging the probe across the cut plane. As you scan the part, you should scan so that the probe crisscrosses the defined Cut Plane as many times as desired. PC-DMIS then follows this procedure:

This operation happens every time you cross the Cut Plane and you will finally have many hits that are on the Cut Plane.

This technique allows you to set specific maximum and minimum angle and increment values that will be used in determining where PC-DMIS will take a hit. The probe's approach is perpendicular to the line between the last two measured hits. You should provide the maximum and minimum values that will be used to determine the increments between hits. You also must enter the desired values for the maximum and minimum angles. PC-DMIS will take three hits using the minimum increment. It will then measure the angle between hit's 1-2 and 2-3.

PC-DMIS will again measure the angle between the newest hit and the two previous hits. It will continue to erase the last hit and drop the increment value to one quarter of the increment until the measured angle is within the range defined, or the minimum value of the increment is reached.

If the measured angle is less than the minimum angle, PC-DMIS will double the increment for the next hit. (If this is greater than the maximum increment value it will take the hit at the maximum increment.) PC-DMIS will again measure the angle between the newest hit and the two previous hits. It will continue to double the increment value until the measured angle is within the range defined, or the maximum increment is reached. The above behavior applies to DCC scans.

When this filter is applied to Manual scans, the following behaviour occurs:

The filter defines the distance between hits based on the part. PC-DMIS allows you to specify the speed at which it will read hits and the drop point distance. After the scanning process is complete, PC-DMIS will calculate the total number of hits that were measured and the total number that were kept after completing the drop point distance calculations. The reduced data is then converted to hits.

If

Member Value Description BSF_BODYAXISDISTANCE 200015 PC-DMIS will take hits at the set increment along the current part's coordinate system. The approach of the probe is perpendicular to the indicated axis. The probe will stay on the cut plane. The approach vector will be normal to the selected axis and on the cut plane. This technique uses the same approach for taking each hit (unlike the previous technique which adjusts the approach to be perpendicular to the line between the previous two hits). Only DCC scans should use this filter. When this filter is applied to Manual scans, the following behaviour happens: This Filter property allows you to scan a part by specifying a cut plane on a certain part axis and dragging the probe across the cut plane. As you scan the part, you should scan so that the probe crisscrosses the defined Cut Plane as many times as desired. PC-DMIS then follows this procedure: PC-DMIS gets data from the controller and finds the two data hits that are closest to the Cut Plane on either side as you crisscross. PC-DMIS then forms a line between the two hits which will pierce the Cut Plane. The pierced point then becomes a hit on the Cut Plane. This operation happens every time you cross the Cut Plane and you will finally have many hits that are on the Cut Plane. BSF_DISTANCE 200010 PC-DMIS determines each hit based on the set increment and the last two measured hits. The approach of the probe is perpendicular to the line between the last two measured hits. The probe will stay on the cut plane. PC-DMIS will start at the first boundary point and continue taking hits at the set increment, stopping when it satisfies the Boundary Condition. In the case of a continuous scan, PC-DMIS would filter the data from the CMM and keep only the hits that are apart by at least the increment. Both DCC and Manual scans can use this filter. BSF_NULL 200060 BSF_TIME_DELTA 200030 The Time Delta method of scanning allows you to reduce the scan data by setting a time increment. PC-DMIS will start from the first hit and reduce the scan by deleting hits that are read in faster than the time delta specified. BSF_VARIABLEDISTANCE 200020 This technique allows you to set specific maximum and minimum angle and increment values that will be used in determining where PC-DMIS will take a hit. The probe's approach is perpendicular to the line between the last two measured hits. You should provide the maximum and minimum values that will be used to determine the increments between hits. You also must enter the desired values for the maximum and minimum angles. PC-DMIS will take three hits using the minimum increment. It will then measure the angle between hit's 1-2 and 2-3. If the measured angle is between the maximum and minimum values defined, PC-DMIS will continue to take hits at the current increment. If the angle is greater than the maximum value, PC-DMIS will erase the last hit and measure it again using one quarter of the current increment value. If the angle is less than the minimum increment, PC-DMIS will take the hit at the minimum increment value. PC-DMIS will again measure the angle between the newest hit and the two previous hits. It will continue to erase the last hit and drop the increment value to one quarter of the increment until the measured angle is within the range defined, or the minimum value of the increment is reached. If the measured angle is less than the minimum angle, PC-DMIS will double the increment for the next hit. (If this is greater than the maximum increment value it will take the hit at the maximum increment.) PC-DMIS will again measure the angle between the newest hit and the two previous hits. It will continue to double the increment value until the measured angle is within the range defined, or the maximum increment is reached. The above behavior applies to DCC scans. When this filter is applied to Manual scans, the following behaviour occurs: The filter defines the distance between hits based on the part. PC-DMIS allows you to specify the speed at which it will read hits and the drop point distance. After the scanning process is complete, PC-DMIS will calculate the total number of hits that were measured and the total number that were kept after completing the drop point distance calculations. The reduced data is then converted to hits. If

| BSF_ENUM Enumeration |

| Member | Value | Description |
| --- | BSF_BODYAXISDISTANCE | 200015 | PC-DMIS will take hits at the set increment along the current part's coordinate system. The approach of the probe is perpendicular to the indicated axis. The probe will stay on the cut plane. The approach vector will be normal to the selected axis and on the cut plane. This technique uses the same approach for taking each hit (unlike the previous technique which adjusts the approach to be perpendicular to the line between the previous two hits). Only DCC scans should use this filter.When this filter is applied to Manual scans, the following behaviour happens:This Filter property allows you to scan a part by specifying a cut plane on a certain part axis and dragging the probe across the cut plane. As you scan the part, you should scan so that the probe crisscrosses the defined Cut Plane as many times as desired. PC-DMIS then follows this procedure:PC-DMIS gets data from the controller and finds the two data hits that are closest to the Cut Plane on either side as you crisscross.PC-DMIS then forms a line between the two hits which will pierce the Cut Plane.The pierced point then becomes a hit on the Cut Plane.This operation happens every time you cross the Cut Plane and you will finally have many hits that are on the Cut Plane. |
| BSF_DISTANCE | 200010 | PC-DMIS determines each hit based on the set increment and the last two measured hits. The approach of the probe is perpendicular to the line between the last two measured hits. The probe will stay on the cut plane. PC-DMIS will start at the first boundary point and continue taking hits at the set increment, stopping when it satisfies the Boundary Condition. In the case of a continuous scan, PC-DMIS would filter the data from the CMM and keep only the hits that are apart by at least the increment. Both DCC and Manual scans can use this filter. |
| BSF_NULL | 200060 | BSF_TIME_DELTA | 200030 | The Time Delta method of scanning allows you to reduce the scan data by setting a time increment. PC-DMIS will start from the first hit and reduce the scan by deleting hits that are read in faster than the time delta specified. |
| BSF_VARIABLEDISTANCE | 200020 | This technique allows you to set specific maximum and minimum angle and increment values that will be used in determining where PC-DMIS will take a hit. The probe's approach is perpendicular to the line between the last two measured hits. You should provide the maximum and minimum values that will be used to determine the increments between hits. You also must enter the desired values for the maximum and minimum angles. PC-DMIS will take three hits using the minimum increment. It will then measure the angle between hit's 1-2 and 2-3.If the measured angle is between the maximum and minimum values defined, PC-DMIS will continue to take hits at the current increment.If the angle is greater than the maximum value, PC-DMIS will erase the last hit and measure it again using one quarter of the current increment value.If the angle is less than the minimum increment, PC-DMIS will take the hit at the minimum increment value.PC-DMIS will again measure the angle between the newest hit and the two previous hits. It will continue to erase the last hit and drop the increment value to one quarter of the increment until the measured angle is within the range defined, or the minimum value of the increment is reached.If the measured angle is less than the minimum angle, PC-DMIS will double the increment for the next hit. (If this is greater than the maximum increment value it will take the hit at the maximum increment.) PC-DMIS will again measure the angle between the newest hit and the two previous hits. It will continue to double the increment value until the measured angle is within the range defined, or the maximum increment is reached. The above behavior applies to DCC scans.When this filter is applied to Manual scans, the following behaviour occurs:The filter defines the distance between hits based on the part. PC-DMIS allows you to specify the speed at which it will read hits and the drop point distance. After the scanning process is complete, PC-DMIS will calculate the total number of hits that were measured and the total number that were kept after completing the drop point distance calculations. The reduced data is then converted to hits.If |

- PC-DMIS gets data from the controller and finds the two data hits that are closest to the Cut Plane on either side as you crisscross.
- PC-DMIS then forms a line between the two hits which will pierce the Cut Plane.
- The pierced point then becomes a hit on the Cut Plane.

- If the measured angle is between the maximum and minimum values defined, PC-DMIS will continue to take hits at the current increment.
- If the angle is greater than the maximum value, PC-DMIS will erase the last hit and measure it again using one quarter of the current increment value.
- If the angle is less than the minimum increment, PC-DMIS will take the hit at the minimum increment value.

---

## BringToZPositionMode

# BringToZPositionMode Enumeration

# Description

# Members

This enuermated list defines the possible values you can use to set the Z order for a dialog box or window.

Member Value Description Bottom 1 NotTopMost -2 Top 0 TopMost -1

| BringToZPositionMode Enumeration |

| Member | Value | Description |
| --- | Bottom | 1 | NotTopMost | -2 | Top | 0 | TopMost | -1

---

## CATCHTYPE

# CATCHTYPE Enumeration

# Members

Member Value Description PCD__OFF 0 Turns off error catching. The basic script will no longer be notified when motion errors occur. PCD_CATCH_IN_INTEGER 1 All subsequent motion errors will cause the integer passed by reference as the catch_error parameter to be set to a non-zero value. PCD_TRIGGER_ERROR 2 All subsequent motion errors will generate runtime error 1001. These error may be caught using the On Error statement.

| CATCHTYPE Enumeration |

| Member | Value | Description |
| --- | PCD__OFF | 0 | Turns off error catching. The basic script will no longer be notified when motion errors occur. |
| PCD_CATCH_IN_INTEGER | 1 | All subsequent motion errors will cause the integer passed by reference as the catch_error parameter to be set to a non-zero value. |
| PCD_TRIGGER_ERROR | 2 | All subsequent motion errors will generate runtime error 1001. These error may be caught using the On Error statement. |

---

## CREATEIDTYPE

# CREATEIDTYPE Enumeration

# Members

Member Value Description AUTO___CIRCLE 612 AUTO___CYLINDER 616 AUTO___ELLIPSE 621 AUTO___ROUND_SLOT 618 AUTO___SPHERE 613 AUTO___SQUARE_SLOT 619 AUTO_ANGLE_HIT 605 AUTO_CORNER_HIT 606 AUTO_EDGE_HIT 604 AUTO_SURFACE_HIT 603 AUTO_VECTOR_HIT 602 CONST___ALN_LINE 548 CONST___ALN_PLANE 576 CONST___BF_CIRCLE 521 CONST___BF_CONE 552 CONST___BF_CYLINDER 561 CONST___BF_ELLIPSE 581 CONST___BF_LINE 541 CONST___BF_PLANE 571 CONST___BF_SPHERE 531 CONST___BFRE_CIRCLE 520 CONST___BFRE_CONE 551 CONST___BFRE_CYLINDER 560 CONST___BFRE_ELLIPSE 580 CONST___BFRE_LINE 540 CONST___BFRE_PLANE 570 CONST___BFRE_SPHERE 530 CONST___CAST_CIRCLE 525 CONST___CAST_CONE 555 CONST___CAST_CYLINDER 564 CONST___CAST_ELLIPSE 584 CONST___CAST_LINE 545 CONST___CAST_PLANE 574 CONST___CAST_POINT 517 CONST___CAST_SPHERE 534 CONST___CONE_CIRCLE 524 CONST___CORNER_POINT 518 CONST___DROP_POINT 514 CONST___HIPNT_PLANE 579 CONST___INT_CIRCLE 526 CONST___INT_ELLIPSE 585 CONST___INT_LINE 546 CONST___INT_POINT 516 CONST___MID_LINE 544 CONST___MID_PLANE 573 CONST___MID_POINT 513 CONST___OFF_LINE 547 CONST___OFF_PLANE 575 CONST___OFF_POINT 511 CONST___ORIG_POINT 510 CONST___PIERCE_POINT 515 CONST___PLTO_LINE 550 CONST___PLTO_PLANE 578 CONST___PROJ_CIRCLE 522 CONST___PROJ_CONE 553 CONST___PROJ_CYLINDER 562 CONST___PROJ_ELLIPSE 582 CONST___PROJ_LINE 542 CONST___PROJ_POINT 512 CONST___PROJ_SPHERE 532 CONST___PRTO_LINE 549 CONST___PRTO_PLANE 577 CONST___REV_CIRCLE 523 CONST___REV_CONE 554 CONST___REV_CYLINDER 563 CONST___REV_ELLIPSE 583 CONST___REV_LINE 543 CONST___REV_PLANE 572 CONST___REV_SPHERE 533 CONST___SET 596 DIM_2D_ANGLE 1109 DIM_2D_DISTANCE 1107 DIM_3D_ANGLE 1108 DIM_3D_DISTANCE 1106 DIM_ANGULARITY 1112 DIM_CONCENTRICITY 1111 DIM_FLATNESS 1102 DIM_KEYIN 1113 DIM_LOCATION 1000 DIM_PARALLELISM 1104 DIM_PERPENDICULARITY 1103 DIM_PROFILE 1105 DIM_ROUNDNESS 1101 DIM_RUNOUT 1110 DIM_STRAIGHTNESS 1100 DIM_TRUE_POSITION 1200 MEASURED___CIRCLE 202 MEASURED___CONE 205 MEASURED___CYLINDER 206 MEASURED___LINE 204 MEASURED___PLANE 207 MEASURED___POINT 201 MEASURED___SET 210 MEASURED___SPHERE 203 PCD_ALIGNMENT 1 PCD_CURVE 38 READ___POINT 192

| CREATEIDTYPE Enumeration |

| Member | Value | Description |
| --- | AUTO___CIRCLE | 612 | AUTO___CYLINDER | 616 | AUTO___ELLIPSE | 621 | AUTO___ROUND_SLOT | 618 | AUTO___SPHERE | 613 | AUTO___SQUARE_SLOT | 619 | AUTO_ANGLE_HIT | 605 | AUTO_CORNER_HIT | 606 | AUTO_EDGE_HIT | 604 | AUTO_SURFACE_HIT | 603 | AUTO_VECTOR_HIT | 602 | CONST___ALN_LINE | 548 | CONST___ALN_PLANE | 576 | CONST___BF_CIRCLE | 521 | CONST___BF_CONE | 552 | CONST___BF_CYLINDER | 561 | CONST___BF_ELLIPSE | 581 | CONST___BF_LINE | 541 | CONST___BF_PLANE | 571 | CONST___BF_SPHERE | 531 | CONST___BFRE_CIRCLE | 520 | CONST___BFRE_CONE | 551 | CONST___BFRE_CYLINDER | 560 | CONST___BFRE_ELLIPSE | 580 | CONST___BFRE_LINE | 540 | CONST___BFRE_PLANE | 570 | CONST___BFRE_SPHERE | 530 | CONST___CAST_CIRCLE | 525 | CONST___CAST_CONE | 555 | CONST___CAST_CYLINDER | 564 | CONST___CAST_ELLIPSE | 584 | CONST___CAST_LINE | 545 | CONST___CAST_PLANE | 574 | CONST___CAST_POINT | 517 | CONST___CAST_SPHERE | 534 | CONST___CONE_CIRCLE | 524 | CONST___CORNER_POINT | 518 | CONST___DROP_POINT | 514 | CONST___HIPNT_PLANE | 579 | CONST___INT_CIRCLE | 526 | CONST___INT_ELLIPSE | 585 | CONST___INT_LINE | 546 | CONST___INT_POINT | 516 | CONST___MID_LINE | 544 | CONST___MID_PLANE | 573 | CONST___MID_POINT | 513 | CONST___OFF_LINE | 547 | CONST___OFF_PLANE | 575 | CONST___OFF_POINT | 511 | CONST___ORIG_POINT | 510 | CONST___PIERCE_POINT | 515 | CONST___PLTO_LINE | 550 | CONST___PLTO_PLANE | 578 | CONST___PROJ_CIRCLE | 522 | CONST___PROJ_CONE | 553 | CONST___PROJ_CYLINDER | 562 | CONST___PROJ_ELLIPSE | 582 | CONST___PROJ_LINE | 542 | CONST___PROJ_POINT | 512 | CONST___PROJ_SPHERE | 532 | CONST___PRTO_LINE | 549 | CONST___PRTO_PLANE | 577 | CONST___REV_CIRCLE | 523 | CONST___REV_CONE | 554 | CONST___REV_CYLINDER | 563 | CONST___REV_ELLIPSE | 583 | CONST___REV_LINE | 543 | CONST___REV_PLANE | 572 | CONST___REV_SPHERE | 533 | CONST___SET | 596 | DIM_2D_ANGLE | 1109 | DIM_2D_DISTANCE | 1107 | DIM_3D_ANGLE | 1108 | DIM_3D_DISTANCE | 1106 | DIM_ANGULARITY | 1112 | DIM_CONCENTRICITY | 1111 | DIM_FLATNESS | 1102 | DIM_KEYIN | 1113 | DIM_LOCATION | 1000 | DIM_PARALLELISM | 1104 | DIM_PERPENDICULARITY | 1103 | DIM_PROFILE | 1105 | DIM_ROUNDNESS | 1101 | DIM_RUNOUT | 1110 | DIM_STRAIGHTNESS | 1100 | DIM_TRUE_POSITION | 1200 | MEASURED___CIRCLE | 202 | MEASURED___CONE | 205 | MEASURED___CYLINDER | 206 | MEASURED___LINE | 204 | MEASURED___PLANE | 207 | MEASURED___POINT | 201 | MEASURED___SET | 210 | MEASURED___SPHERE | 203 | PCD_ALIGNMENT | 1 | PCD_CURVE | 38 | READ___POINT | 192

---

## DATA_TYPE_TYPES

# DATA_TYPE_TYPES Enumeration

# Members

Member Value Description DATATYPE_ALPHANUMERIC 3 DATATYPE_CALCULATED_CONSTANT 2 DATATYPE_ERROR 0 DATATYPE_EXPRESSION 6 DATATYPE_MEASURED_CONSTANT 1 DATATYPE_NUMERIC 4 DATATYPE_TOGGLE 5

| DATA_TYPE_TYPES Enumeration |

| Member | Value | Description |
| --- | DATATYPE_ALPHANUMERIC | 3 | DATATYPE_CALCULATED_CONSTANT | 2 | DATATYPE_ERROR | 0 | DATATYPE_EXPRESSION | 6 | DATATYPE_MEASURED_CONSTANT | 1 | DATATYPE_NUMERIC | 4 | DATATYPE_TOGGLE | 5

---

## DCCMODE

# DCCMODE Enumeration

# Members

Member Value Description PCD_DCC 100 PCD_MANUAL 101

| DCCMODE Enumeration |

| Member | Value | Description |
| --- | PCD_DCC | 100 | PCD_MANUAL | 101

---

## DIMAXISTYPE

# DIMAXISTYPE Enumeration

# Members

Member Value Description PCD_A 505 PCD_D 503 PCD_DD 511 PCD_DF 512 PCD_L 510 PCD_M 518 PCD_PA 507 PCD_PD 517 PCD_PR 508 PCD_R 504 PCD_RS 515 PCD_RT 516 PCD_S 514 PCD_T 506 PCD_TP 513 PCD_V 509 PCD_X 500 PCD_Y 501 PCD_Z 502

| DIMAXISTYPE Enumeration |

| Member | Value | Description |
| --- | PCD_A | 505 | PCD_D | 503 | PCD_DD | 511 | PCD_DF | 512 | PCD_L | 510 | PCD_M | 518 | PCD_PA | 507 | PCD_PD | 517 | PCD_PR | 508 | PCD_R | 504 | PCD_RS | 515 | PCD_RT | 516 | PCD_S | 514 | PCD_T | 506 | PCD_TP | 513 | PCD_V | 509 | PCD_X | 500 | PCD_Y | 501 | PCD_Z | 502

---

## DIMFORMATFLAG

# DIMFORMATFLAG Enumeration

# Members

Member Value Description PCD_HEADINGS 1 PCD_SYMBOLS 2

| DIMFORMATFLAG Enumeration |

| Member | Value | Description |
| --- | PCD_HEADINGS | 1 | PCD_SYMBOLS | 2

---

## DIMFORMATTYPE

# DIMFORMATTYPE Enumeration

# Members

Member Value Description PCD_DEV 5 PCD_DEVANG 7 PCD_MAXMIN 4 PCD_MEAS 3 PCD_NOM 1 PCD_NOT_USED 0 PCD_OUTTOL 6 PCD_TOL 2

| DIMFORMATTYPE Enumeration |

| Member | Value | Description |
| --- | PCD_DEV | 5 | PCD_DEVANG | 7 | PCD_MAXMIN | 4 | PCD_MEAS | 3 | PCD_NOM | 1 | PCD_NOT_USED | 0 | PCD_OUTTOL | 6 | PCD_TOL | 2

---

## DialogTypes

# DialogTypes Enumeration

# Description

# Members

Only dialog boxes that fire Open and Close events are in this enumeration.

Member Value Description AdjustFilterDialog 5 AngleDimensionDialog 200 AngularityDimensionDialog 205 BestFitAlignmentDialog 100 CircularityDimensionDialog 202 CoaxialityDimensionDialog 209 CollisionListDialog 14 CommentDialog 8 ConcentricityDimensionDialog 210 ConstructedCircleDialog 42 ConstructedConeDialog 43 ConstructedCurveDialog 44 ConstructedCylinderDialog 45 ConstructedEllipseDialog 46 ConstructedFeatureDialog 40 ConstructedFilterFeature 56 ConstructedGageDialog 55 ConstructedGenericFeature 57 ConstructedLineDialog 47 ConstructedParentDialog 41 ConstructedPlaneDialog 48 ConstructedPointDialog 49 ConstructedRoundSlotDialog 50 ConstructedSphereDialog 52 ConstructedSquareSlotDialog 51 ConstructedSurfaceDialog 53 ConstructedWidthDialog 54 DatumDefinitionDialog 215 DeleteFeaturesDialog 7 DimensionalKeyinDialog 216 DistanceDimensionDialog 201 DMISImportExportResultsDialog 12 EditFeatureAppearanceDialog 6 ExpressionBuilderDialog 11 FileOpenDialog 3 FileSaveAsDialog 4 FlatnessDimensionDialog 203 GenericDialog 0 GoToDialog 10 LeapFrogAlignmentDialog 101 LocationDimensionDialog 213 MeasuredCircleDialog 20 MeasuredConeDialog 21 MeasuredCylinderDialog 22 MeasuredLineDialog 23 MeasuredPlaneDialog 24 MeasuredPointDialog 25 MeasuredRoundSlotDialog 26 MeasuredSetDialog 28 MeasuredSphereDialog 29 MeasuredSquareSlotDialog 27 MeasuredTorusDialog 30 ParallelismDimensionDialog 206 PerpendicularityDimensionDialog 207 PointCloudAlignmentDialog 105 PointCloudDataCollection 123 PointCloudDialog 120 PointCloudMeshDialog 121 PointCloudOperatorDialog 122 PositionDimensionDialog 214 ProbesDialog 1 ProfileDimensionDialog 208 RunoutDimensionDialog 211 SelectCNCMachineDialog 9 SelectProbeFileDialog 13 StraightnessDimensionDialog 204 SymmetryDimensionDialog 212 TraceFieldDialog 15 TutorBarIterativeAlignmentDialog 104 UtilityAlignmentDialog 102 UtilityIterativeAlignmentDialog 103

| DialogTypes Enumeration |

| Member | Value | Description |
| --- | AdjustFilterDialog | 5 | AngleDimensionDialog | 200 | AngularityDimensionDialog | 205 | BestFitAlignmentDialog | 100 | CircularityDimensionDialog | 202 | CoaxialityDimensionDialog | 209 | CollisionListDialog | 14 | CommentDialog | 8 | ConcentricityDimensionDialog | 210 | ConstructedCircleDialog | 42 | ConstructedConeDialog | 43 | ConstructedCurveDialog | 44 | ConstructedCylinderDialog | 45 | ConstructedEllipseDialog | 46 | ConstructedFeatureDialog | 40 | ConstructedFilterFeature | 56 | ConstructedGageDialog | 55 | ConstructedGenericFeature | 57 | ConstructedLineDialog | 47 | ConstructedParentDialog | 41 | ConstructedPlaneDialog | 48 | ConstructedPointDialog | 49 | ConstructedRoundSlotDialog | 50 | ConstructedSphereDialog | 52 | ConstructedSquareSlotDialog | 51 | ConstructedSurfaceDialog | 53 | ConstructedWidthDialog | 54 | DatumDefinitionDialog | 215 | DeleteFeaturesDialog | 7 | DimensionalKeyinDialog | 216 | DistanceDimensionDialog | 201 | DMISImportExportResultsDialog | 12 | EditFeatureAppearanceDialog | 6 | ExpressionBuilderDialog | 11 | FileOpenDialog | 3 | FileSaveAsDialog | 4 | FlatnessDimensionDialog | 203 | GenericDialog | 0 | GoToDialog | 10 | LeapFrogAlignmentDialog | 101 | LocationDimensionDialog | 213 | MeasuredCircleDialog | 20 | MeasuredConeDialog | 21 | MeasuredCylinderDialog | 22 | MeasuredLineDialog | 23 | MeasuredPlaneDialog | 24 | MeasuredPointDialog | 25 | MeasuredRoundSlotDialog | 26 | MeasuredSetDialog | 28 | MeasuredSphereDialog | 29 | MeasuredSquareSlotDialog | 27 | MeasuredTorusDialog | 30 | ParallelismDimensionDialog | 206 | PerpendicularityDimensionDialog | 207 | PointCloudAlignmentDialog | 105 | PointCloudDataCollection | 123 | PointCloudDialog | 120 | PointCloudMeshDialog | 121 | PointCloudOperatorDialog | 122 | PositionDimensionDialog | 214 | ProbesDialog | 1 | ProfileDimensionDialog | 208 | RunoutDimensionDialog | 211 | SelectCNCMachineDialog | 9 | SelectProbeFileDialog | 13 | StraightnessDimensionDialog | 204 | SymmetryDimensionDialog | 212 | TraceFieldDialog | 15 | TutorBarIterativeAlignmentDialog | 104 | UtilityAlignmentDialog | 102 | UtilityIterativeAlignmentDialog | 103

---

## EDGE_MEASURE_TYPES

# EDGE_MEASURE_TYPES Enumeration

# Members

Member Value Description EDGE_BOTH 2 EDGE_EDGE_FIRST 1 EDGE_SURFACE_FIRST 0

| EDGE_MEASURE_TYPES Enumeration |

| Member | Value | Description |
| --- | EDGE_BOTH | 2 | EDGE_EDGE_FIRST | 1 | EDGE_SURFACE_FIRST | 0

---

## ENUM_ALIGN_WORKPLANE

# ENUM_ALIGN_WORKPLANE Enumeration

# Members

Member Value Description ALIGN_CURRENT_WORKPLANE 6 ALIGN_XMINUS 3 ALIGN_XPLUS 2 ALIGN_YMINUS 5 ALIGN_YPLUS 4 ALIGN_ZMINUS 1 ALIGN_ZPLUS 0

| ENUM_ALIGN_WORKPLANE Enumeration |

| Member | Value | Description |
| --- | ALIGN_CURRENT_WORKPLANE | 6 | ALIGN_XMINUS | 3 | ALIGN_XPLUS | 2 | ALIGN_YMINUS | 5 | ALIGN_YPLUS | 4 | ALIGN_ZMINUS | 1 | ALIGN_ZPLUS | 0

---

## ENUM_AXIS_TYPE

# ENUM_AXIS_TYPE Enumeration

# Members

Member Value Description AXIS_XMINUS 4 AXIS_XPLUS 1 AXIS_YMINUS 5 AXIS_YPLUS 2 AXIS_ZMINUS 3 AXIS_ZPLUS 0

| ENUM_AXIS_TYPE Enumeration |

| Member | Value | Description |
| --- | AXIS_XMINUS | 4 | AXIS_XPLUS | 1 | AXIS_YMINUS | 5 | AXIS_YPLUS | 2 | AXIS_ZMINUS | 3 | AXIS_ZPLUS | 0

---

## ENUM_BEST_FIT_MATH_TYPES

# ENUM_BEST_FIT_MATH_TYPES Enumeration

# Members

Member Value Description BF_MATH_FIXED_RADIUS 4 BF_MATH_LEAST_SQUARES 0 BF_MATH_MAX_INSCRIBED 2 BF_MATH_MIN_CIRCUMSCRIBED 3 BF_MATH_MIN_SEPARATION 1

| ENUM_BEST_FIT_MATH_TYPES Enumeration |

| Member | Value | Description |
| --- | BF_MATH_FIXED_RADIUS | 4 | BF_MATH_LEAST_SQUARES | 0 | BF_MATH_MAX_INSCRIBED | 2 | BF_MATH_MIN_CIRCUMSCRIBED | 3 | BF_MATH_MIN_SEPARATION | 1

---

## ENUM_BITMAP_LAYOUT

# ENUM_BITMAP_LAYOUT Enumeration

# Members

Member Value Description BITMAP_LAYOUT_CENTER 6 BITMAP_LAYOUT_LEFT 0 BITMAP_LAYOUT_RIGHT 2 BITMAP_LAYOUT_SIZE_TO_FIT 255 BITMAP_LAYOUT_VCENTER 8

| ENUM_BITMAP_LAYOUT Enumeration |

| Member | Value | Description |
| --- | BITMAP_LAYOUT_CENTER | 6 | BITMAP_LAYOUT_LEFT | 0 | BITMAP_LAYOUT_RIGHT | 2 | BITMAP_LAYOUT_SIZE_TO_FIT | 255 | BITMAP_LAYOUT_VCENTER | 8

---

## ENUM_BUTTON_TYPE

# ENUM_BUTTON_TYPE Enumeration

# Members

Member Value Description BUTTON_TYPE_ABORT 3 BUTTON_TYPE_CANCEL 2 BUTTON_TYPE_CONTINUE 11 BUTTON_TYPE_HELP 9 BUTTON_TYPE_IGNORE 5 BUTTON_TYPE_NO 7 BUTTON_TYPE_OK 1 BUTTON_TYPE_RETRY 4 BUTTON_TYPE_YES 6

| ENUM_BUTTON_TYPE Enumeration |

| Member | Value | Description |
| --- | BUTTON_TYPE_ABORT | 3 | BUTTON_TYPE_CANCEL | 2 | BUTTON_TYPE_CONTINUE | 11 | BUTTON_TYPE_HELP | 9 | BUTTON_TYPE_IGNORE | 5 | BUTTON_TYPE_NO | 7 | BUTTON_TYPE_OK | 1 | BUTTON_TYPE_RETRY | 4 | BUTTON_TYPE_YES | 6

---

## ENUM_CADPRINTOPTIONS

# ENUM_CADPRINTOPTIONS Enumeration

# Members

Member Value Description CADPRINT_ENTIRCURSCALE 3 Prints the entire CAD view at the current scale. CADPRINT_ENTIREVIEW 2 Prints entire CAD view. CADPRINT_ONEPAGESCALE 0 Prints view scaled to fit on a single page. CADPRINT_VISIBLEAREA 1 Prints the visible screen area.

| ENUM_CADPRINTOPTIONS Enumeration |

| Member | Value | Description |
| --- | CADPRINT_ENTIRCURSCALE | 3 | Prints the entire CAD view at the current scale. |
| CADPRINT_ENTIREVIEW | 2 | Prints entire CAD view. |
| CADPRINT_ONEPAGESCALE | 0 | Prints view scaled to fit on a single page. |
| CADPRINT_VISIBLEAREA | 1 | Prints the visible screen area. |

---

## ENUM_CAD_COLLECTIONS

# ENUM_CAD_COLLECTIONS Enumeration

# Members

Member Value Description HCAD_ALL_LISTS -1 All display collection except the probe collection HCAD_ARM1CMM 19 Display collection for arm 1 animated cmm HCAD_ARM1CMM1 20 Display collection 1 for arm 1 animated cmm HCAD_ARM1CMM2 21 Display collection 2 for arm 1 animated cmm HCAD_ARM1CMM3 22 Display collection 3 for arm 1 animated cmm HCAD_ARM1CMM4 23 Display collection 4 for arm 1 animated cmm HCAD_ARM1CMM5 24 Display collection 5 for arm 1 animated cmm HCAD_ARM1CMM6 25 Display collection 6 for arm 1 animated cmm HCAD_ARM1PROBE 26 Display collection for arm 1 animated probe HCAD_ARM1PROBE1 27 Display collection 1 for arm 1 animated probe HCAD_ARM1PROBE2 28 Display collection 2 for arm 1 animated probe HCAD_ARM1PROBE3 29 Display collection 3 for arm 1 animated probe HCAD_ARM2CMM 8 Display collection for arm 2 animated cmm HCAD_ARM2CMM1 9 Display collection 1 for arm 2 animated cmm HCAD_ARM2CMM2 10 Display collection 2 for arm 2 animated cmm HCAD_ARM2CMM3 11 Display collection 3 for arm 2 animated cmm HCAD_ARM2CMM4 12 Display collection 4 for arm 2 animated cmm HCAD_ARM2CMM5 13 Display collection 5 for arm 2 animated cmm HCAD_ARM2CMM6 14 Display collection 6 for arm 2 animated cmm HCAD_ARM2PROBE 15 Display collection for arm 2 animated probe HCAD_ARM2PROBE1 16 Display collection 1 for arm 2 animated probe HCAD_ARM2PROBE2 17 Display collection 2 for arm 2 animated probe HCAD_ARM2PROBE3 18 Display collection 3 for arm 2 animated probe HCAD_ARM3CMM 63 Display collection for arm 3 animated cmm HCAD_ARM3CMM1 64 Display collection 1 for arm 3 animated cmm HCAD_ARM3CMM2 65 Display collection 2 for arm 3 animated cmm HCAD_ARM3CMM3 66 Display collection 3 for arm 3 animated cmm HCAD_ARM3CMM4 67 Display collection 4 for arm 3 animated cmm HCAD_ARM3CMM5 68 Display collection 5 for arm 3 animated cmm HCAD_ARM3CMM6 69 Display collection 6 for arm 3 animated cmm HCAD_ARM3PROBE 77 Display collection for arm 3 animated probe HCAD_ARM3PROBE1 78 Display collection 1 for arm 3 animated probe HCAD_ARM3PROBE2 79 Display collection 2 for arm 3 animated probe HCAD_ARM3PROBE3 80 Display collection 3 for arm 3 animated probe HCAD_ARM4CMM 70 Display collection for arm 4 animated cmm HCAD_ARM4CMM1 71 Display collection 1 for arm 4 animated cmm HCAD_ARM4CMM2 72 Display collection 2 for arm 4 animated cmm HCAD_ARM4CMM3 73 Display collection 3 for arm 4 animated cmm HCAD_ARM4CMM4 74 Display collection 4 for arm 4 animated cmm HCAD_ARM4CMM5 75 Display collection 5 for arm 4 animated cmm HCAD_ARM4CMM6 76 Display collection 6 for arm 4 animated cmm HCAD_ARM4PROBE 81 Display collection for arm 4 animated probe HCAD_ARM4PROBE1 82 Display collection 1 for arm 4 animated probe HCAD_ARM4PROBE2 83 Display collection 2 for arm 4 animated probe HCAD_ARM4PROBE3 84 Display collection 3 for arm 4 animated probe HCAD_ARROWS 5 Display collection for the analysis arrows HCAD_CAD 0 Display collection for the cad elements HCAD_CLEARFETS -2 HCAD_CMMFIXTURE 30 Display collection for CMM fixture HCAD_CMMFIXTURE1 31 Display collection 1 for CMM fixture HCAD_CMMFIXTURE10 40 Display collection 10 for CMM fixture HCAD_CMMFIXTURE11 41 Display collection 11 for CMM fixture HCAD_CMMFIXTURE12 42 Display collection 12 for CMM fixture HCAD_CMMFIXTURE13 43 Display collection 13 for CMM fixture HCAD_CMMFIXTURE14 44 Display collection 14 for CMM fixture HCAD_CMMFIXTURE15 45 Display collection 15 for CMM fixture HCAD_CMMFIXTURE16 46 Display collection 16 for CMM fixture HCAD_CMMFIXTURE17 47 Display collection 17 for CMM fixture HCAD_CMMFIXTURE18 48 Display collection 18 for CMM fixture HCAD_CMMFIXTURE19 49 Display collection 19 for CMM fixture HCAD_CMMFIXTURE2 32 Display collection 2 for CMM fixture HCAD_CMMFIXTURE20 50 Display collection 20 for CMM fixture HCAD_CMMFIXTURE21 51 Display collection 21 for CMM fixture HCAD_CMMFIXTURE22 52 Display collection 22 for CMM fixture HCAD_CMMFIXTURE23 53 Display collection 23 for CMM fixture HCAD_CMMFIXTURE24 54 Display collection 24 for CMM fixture HCAD_CMMFIXTURE25 55 Display collection 25 for CMM fixture HCAD_CMMFIXTURE3 33 Display collection 3 for CMM fixture HCAD_CMMFIXTURE4 34 Display collection 4 for CMM fixture HCAD_CMMFIXTURE5 35 Display collection 5 for CMM fixture HCAD_CMMFIXTURE6 36 Display collection 6 for CMM fixture HCAD_CMMFIXTURE7 37 Display collection 7 for CMM fixture HCAD_CMMFIXTURE8 38 Display collection 8 for CMM fixture HCAD_CMMFIXTURE9 39 Display collection 9 for CMM fixture HCAD_EDITPATH 4 Display collection for the edit path elements HCAD_FOV 57 Display collection for FOV HCAD_HITS 7 Display collection for Hits HCAD_INSPECTP 2 Display collection for the inspect points (des) elements HCAD_MARKERS 56 Display collection for hits and arrows of features HCAD_MEASURED 3 Display collection for the measured feature elements HCAD_PROBECHANGER1 59 Display collection for probe changer 1 HCAD_PROBECHANGER2 60 Display collection for probe changer 2 HCAD_PROBECHANGER3 61 Display collection for probe changer 3 HCAD_PROBECHANGER4 62 Display collection for probe changer 4 HCAD_SCAN 6 Display collection for scans HCAD_SURF 1 Display collection for the cad surface elements HCAD_TARGET 58 Display collection for Targets

| ENUM_CAD_COLLECTIONS Enumeration |

| Member | Value | Description |
| --- | HCAD_ALL_LISTS | -1 | All display collection except the probe collection |
| HCAD_ARM1CMM | 19 | Display collection for arm 1 animated cmm |
| HCAD_ARM1CMM1 | 20 | Display collection 1 for arm 1 animated cmm |
| HCAD_ARM1CMM2 | 21 | Display collection 2 for arm 1 animated cmm |
| HCAD_ARM1CMM3 | 22 | Display collection 3 for arm 1 animated cmm |
| HCAD_ARM1CMM4 | 23 | Display collection 4 for arm 1 animated cmm |
| HCAD_ARM1CMM5 | 24 | Display collection 5 for arm 1 animated cmm |
| HCAD_ARM1CMM6 | 25 | Display collection 6 for arm 1 animated cmm |
| HCAD_ARM1PROBE | 26 | Display collection for arm 1 animated probe |
| HCAD_ARM1PROBE1 | 27 | Display collection 1 for arm 1 animated probe |
| HCAD_ARM1PROBE2 | 28 | Display collection 2 for arm 1 animated probe |
| HCAD_ARM1PROBE3 | 29 | Display collection 3 for arm 1 animated probe |
| HCAD_ARM2CMM | 8 | Display collection for arm 2 animated cmm |
| HCAD_ARM2CMM1 | 9 | Display collection 1 for arm 2 animated cmm |
| HCAD_ARM2CMM2 | 10 | Display collection 2 for arm 2 animated cmm |
| HCAD_ARM2CMM3 | 11 | Display collection 3 for arm 2 animated cmm |
| HCAD_ARM2CMM4 | 12 | Display collection 4 for arm 2 animated cmm |
| HCAD_ARM2CMM5 | 13 | Display collection 5 for arm 2 animated cmm |
| HCAD_ARM2CMM6 | 14 | Display collection 6 for arm 2 animated cmm |
| HCAD_ARM2PROBE | 15 | Display collection for arm 2 animated probe |
| HCAD_ARM2PROBE1 | 16 | Display collection 1 for arm 2 animated probe |
| HCAD_ARM2PROBE2 | 17 | Display collection 2 for arm 2 animated probe |
| HCAD_ARM2PROBE3 | 18 | Display collection 3 for arm 2 animated probe |
| HCAD_ARM3CMM | 63 | Display collection for arm 3 animated cmm |
| HCAD_ARM3CMM1 | 64 | Display collection 1 for arm 3 animated cmm |
| HCAD_ARM3CMM2 | 65 | Display collection 2 for arm 3 animated cmm |
| HCAD_ARM3CMM3 | 66 | Display collection 3 for arm 3 animated cmm |
| HCAD_ARM3CMM4 | 67 | Display collection 4 for arm 3 animated cmm |
| HCAD_ARM3CMM5 | 68 | Display collection 5 for arm 3 animated cmm |
| HCAD_ARM3CMM6 | 69 | Display collection 6 for arm 3 animated cmm |
| HCAD_ARM3PROBE | 77 | Display collection for arm 3 animated probe |
| HCAD_ARM3PROBE1 | 78 | Display collection 1 for arm 3 animated probe |
| HCAD_ARM3PROBE2 | 79 | Display collection 2 for arm 3 animated probe |
| HCAD_ARM3PROBE3 | 80 | Display collection 3 for arm 3 animated probe |
| HCAD_ARM4CMM | 70 | Display collection for arm 4 animated cmm |
| HCAD_ARM4CMM1 | 71 | Display collection 1 for arm 4 animated cmm |
| HCAD_ARM4CMM2 | 72 | Display collection 2 for arm 4 animated cmm |
| HCAD_ARM4CMM3 | 73 | Display collection 3 for arm 4 animated cmm |
| HCAD_ARM4CMM4 | 74 | Display collection 4 for arm 4 animated cmm |
| HCAD_ARM4CMM5 | 75 | Display collection 5 for arm 4 animated cmm |
| HCAD_ARM4CMM6 | 76 | Display collection 6 for arm 4 animated cmm |
| HCAD_ARM4PROBE | 81 | Display collection for arm 4 animated probe |
| HCAD_ARM4PROBE1 | 82 | Display collection 1 for arm 4 animated probe |
| HCAD_ARM4PROBE2 | 83 | Display collection 2 for arm 4 animated probe |
| HCAD_ARM4PROBE3 | 84 | Display collection 3 for arm 4 animated probe |
| HCAD_ARROWS | 5 | Display collection for the analysis arrows |
| HCAD_CAD | 0 | Display collection for the cad elements |
| HCAD_CLEARFETS | -2 | HCAD_CMMFIXTURE | 30 | Display collection for CMM fixture |
| HCAD_CMMFIXTURE1 | 31 | Display collection 1 for CMM fixture |
| HCAD_CMMFIXTURE10 | 40 | Display collection 10 for CMM fixture |
| HCAD_CMMFIXTURE11 | 41 | Display collection 11 for CMM fixture |
| HCAD_CMMFIXTURE12 | 42 | Display collection 12 for CMM fixture |
| HCAD_CMMFIXTURE13 | 43 | Display collection 13 for CMM fixture |
| HCAD_CMMFIXTURE14 | 44 | Display collection 14 for CMM fixture |
| HCAD_CMMFIXTURE15 | 45 | Display collection 15 for CMM fixture |
| HCAD_CMMFIXTURE16 | 46 | Display collection 16 for CMM fixture |
| HCAD_CMMFIXTURE17 | 47 | Display collection 17 for CMM fixture |
| HCAD_CMMFIXTURE18 | 48 | Display collection 18 for CMM fixture |
| HCAD_CMMFIXTURE19 | 49 | Display collection 19 for CMM fixture |
| HCAD_CMMFIXTURE2 | 32 | Display collection 2 for CMM fixture |
| HCAD_CMMFIXTURE20 | 50 | Display collection 20 for CMM fixture |
| HCAD_CMMFIXTURE21 | 51 | Display collection 21 for CMM fixture |
| HCAD_CMMFIXTURE22 | 52 | Display collection 22 for CMM fixture |
| HCAD_CMMFIXTURE23 | 53 | Display collection 23 for CMM fixture |
| HCAD_CMMFIXTURE24 | 54 | Display collection 24 for CMM fixture |
| HCAD_CMMFIXTURE25 | 55 | Display collection 25 for CMM fixture |
| HCAD_CMMFIXTURE3 | 33 | Display collection 3 for CMM fixture |
| HCAD_CMMFIXTURE4 | 34 | Display collection 4 for CMM fixture |
| HCAD_CMMFIXTURE5 | 35 | Display collection 5 for CMM fixture |
| HCAD_CMMFIXTURE6 | 36 | Display collection 6 for CMM fixture |
| HCAD_CMMFIXTURE7 | 37 | Display collection 7 for CMM fixture |
| HCAD_CMMFIXTURE8 | 38 | Display collection 8 for CMM fixture |
| HCAD_CMMFIXTURE9 | 39 | Display collection 9 for CMM fixture |
| HCAD_EDITPATH | 4 | Display collection for the edit path elements |
| HCAD_FOV | 57 | Display collection for FOV |
| HCAD_HITS | 7 | Display collection for Hits |
| HCAD_INSPECTP | 2 | Display collection for the inspect points (des) elements |
| HCAD_MARKERS | 56 | Display collection for hits and arrows of features |
| HCAD_MEASURED | 3 | Display collection for the measured feature elements |
| HCAD_PROBECHANGER1 | 59 | Display collection for probe changer 1 |
| HCAD_PROBECHANGER2 | 60 | Display collection for probe changer 2 |
| HCAD_PROBECHANGER3 | 61 | Display collection for probe changer 3 |
| HCAD_PROBECHANGER4 | 62 | Display collection for probe changer 4 |
| HCAD_SCAN | 6 | Display collection for scans |
| HCAD_SURF | 1 | Display collection for the cad surface elements |
| HCAD_TARGET | 58 | Display collection for Targets |

---

## ENUM_CAD_GEOMETRY_FILTER_FLAGS

# ENUM_CAD_GEOMETRY_FILTER_FLAGS Enumeration

# Members

Member Value Description CAD_ALL_GEOMETRY 7 Test all geometry CAD_CURVE_GEOMETRY 2 Only test curve geometry CAD_POINT_GEOMETRY 1 Only test point geometry CAD_SURFACE_GEOMETRY 4 Only test surface geometry

| ENUM_CAD_GEOMETRY_FILTER_FLAGS Enumeration |

| Member | Value | Description |
| --- | CAD_ALL_GEOMETRY | 7 | Test all geometry |
| CAD_CURVE_GEOMETRY | 2 | Only test curve geometry |
| CAD_POINT_GEOMETRY | 1 | Only test point geometry |
| CAD_SURFACE_GEOMETRY | 4 | Only test surface geometry |

---

## ENUM_CAD_LINE_INTERSECT_FLAGS

# ENUM_CAD_LINE_INTERSECT_FLAGS Enumeration

# Members

Member Value Description CAD_INTERSECT_CLOSEST_ORIGIN 1 Return intersection closest to the line point. By default, the intersection at the maximum line parameter is returned. CAD_POSITIVE_PARAMETER_INTERSECTIONS_ONLY 2 Only return intersections at positive line parameters (treat the line as a ray).

| ENUM_CAD_LINE_INTERSECT_FLAGS Enumeration |

| Member | Value | Description |
| --- | CAD_INTERSECT_CLOSEST_ORIGIN | 1 | Return intersection closest to the line point. By default, the intersection at the maximum line parameter is returned. |
| CAD_POSITIVE_PARAMETER_INTERSECTIONS_ONLY | 2 | Only return intersections at positive line parameters (treat the line as a ray). |

---

## ENUM_CAD_RESULT

# ENUM_CAD_RESULT Enumeration

# Members

Member Value Description CAD_ACCESS_FAIL -1 Invalid object handle, or operation not enabled; no value returned. CAD_GEOMETRY_FAIL 0 No value returned; geometry doesn't make sense, failed geometry (i.e. parallel lines), or not yet implemented. CAD_GEOMETRY_HIT 2 Logic produced a hit, value returned (all is well). CAD_GEOMETRY_MISS 1 Logic produced a miss, closest point returned or ambiguous point returned.

| ENUM_CAD_RESULT Enumeration |

| Member | Value | Description |
| --- | CAD_ACCESS_FAIL | -1 | Invalid object handle, or operation not enabled; no value returned. |
| CAD_GEOMETRY_FAIL | 0 | No value returned; geometry doesn't make sense, failed geometry (i.e. parallel lines), or not yet implemented. |
| CAD_GEOMETRY_HIT | 2 | Logic produced a hit, value returned (all is well). |
| CAD_GEOMETRY_MISS | 1 | Logic produced a miss, closest point returned or ambiguous point returned. |

---

## ENUM_CAD_SURFACE_BOUNDARY_OPTION

# ENUM_CAD_SURFACE_BOUNDARY_OPTION Enumeration

# Members

Member Value Description CAD_SURFACE_BOUNDARIES 1 For surfaces, constrain the result to the surface boundaries (inner or outer). Does not affect curves. CAD_SURFACE_DEFAULT 0 For surfaces, constrain the result to the surface itself, within the surface boundaries. Does not affect curves. This is the default option. CAD_SURFACE_OUTER_BOUNDARIES 2 For surfaces, constrain the result to the outer surface boundary. Does not affect curves.

| ENUM_CAD_SURFACE_BOUNDARY_OPTION Enumeration |

| Member | Value | Description |
| --- | CAD_SURFACE_BOUNDARIES | 1 | For surfaces, constrain the result to the surface boundaries (inner or outer). Does not affect curves. |
| CAD_SURFACE_DEFAULT | 0 | For surfaces, constrain the result to the surface itself, within the surface boundaries. Does not affect curves. This is the default option. |
| CAD_SURFACE_OUTER_BOUNDARIES | 2 | For surfaces, constrain the result to the outer surface boundary. Does not affect curves. |

---

## ENUM_CAD_VECTOR_OPTION

# ENUM_CAD_VECTOR_OPTION Enumeration

# Members

Member Value Description CAD_RETURN_NORMAL_TO_CURVES 1 Return the normal to curves or, for surface boundaries, the surface normal. The curve normal is defined as the curve's second derivative vector negated. CAD_RETURN_TANGENT_TO_CURVES 0 Return the tangent to curves (including boundaries). This is the default option.

| ENUM_CAD_VECTOR_OPTION Enumeration |

| Member | Value | Description |
| --- | CAD_RETURN_NORMAL_TO_CURVES | 1 | Return the normal to curves or, for surface boundaries, the surface normal. The curve normal is defined as the curve's second derivative vector negated. |
| CAD_RETURN_TANGENT_TO_CURVES | 0 | Return the tangent to curves (including boundaries). This is the default option. |

---

## ENUM_CALIBRATION_EXECUTE_MODE

# ENUM_CALIBRATION_EXECUTE_MODE Enumeration

# Members

Member Value Description CALIBRATE_NC100_ARTIFACT 5 CALIBRATE_TIPS 0 CALIBRATE_UNIT 1 HOME_UNIT 4 QUALIFICATION_CHECK 3

| ENUM_CALIBRATION_EXECUTE_MODE Enumeration |

| Member | Value | Description |
| --- | CALIBRATE_NC100_ARTIFACT | 5 | CALIBRATE_TIPS | 0 | CALIBRATE_UNIT | 1 | HOME_UNIT | 4 | QUALIFICATION_CHECK | 3

---

## ENUM_COLOR_SECTION

# ENUM_COLOR_SECTION Enumeration

# Members

Member Value Description COLOR_SECTION_ALIGNMENT 10002 COLOR_SECTION_AUTO 10015 COLOR_SECTION_CONSTRUCTED 10008 COLOR_SECTION_DEFAULT 10001 COLOR_SECTION_DIMENSIONS 10010 COLOR_SECTION_FEATURES 10003 COLOR_SECTION_FLOW 10012 COLOR_SECTION_GENERIC 10009 COLOR_SECTION_HITS 10004 COLOR_SECTION_LASER 10007 COLOR_SECTION_MEASURED 10005 COLOR_SECTION_MISC 10014 COLOR_SECTION_MOVE 10011 COLOR_SECTION_PARAMETERS 10013 COLOR_SECTION_VISION 10006

| ENUM_COLOR_SECTION Enumeration |

| Member | Value | Description |
| --- | COLOR_SECTION_ALIGNMENT | 10002 | COLOR_SECTION_AUTO | 10015 | COLOR_SECTION_CONSTRUCTED | 10008 | COLOR_SECTION_DEFAULT | 10001 | COLOR_SECTION_DIMENSIONS | 10010 | COLOR_SECTION_FEATURES | 10003 | COLOR_SECTION_FLOW | 10012 | COLOR_SECTION_GENERIC | 10009 | COLOR_SECTION_HITS | 10004 | COLOR_SECTION_LASER | 10007 | COLOR_SECTION_MEASURED | 10005 | COLOR_SECTION_MISC | 10014 | COLOR_SECTION_MOVE | 10011 | COLOR_SECTION_PARAMETERS | 10013 | COLOR_SECTION_VISION | 10006

---

## ENUM_COMMANDNUMBER

# ENUM_COMMANDNUMBER Enumeration

# Members

Member Value Description CMD_ROT_HEAD 80 CMM_SN 60 DISCONNECT 52 GET_PART_TEMP 71 MODE_AUTO 1 MODE_MAN 0 PARK 50 READIOBITS 30 RECONNECT 53 SET_PART_TEMP 70 SET_VISUAL 62 SETIOBITS 40 UNPARK 51 USE_PARAMETER_SET 61

| ENUM_COMMANDNUMBER Enumeration |

| Member | Value | Description |
| --- | CMD_ROT_HEAD | 80 | CMM_SN | 60 | DISCONNECT | 52 | GET_PART_TEMP | 71 | MODE_AUTO | 1 | MODE_MAN | 0 | PARK | 50 | READIOBITS | 30 | RECONNECT | 53 | SET_PART_TEMP | 70 | SET_VISUAL | 62 | SETIOBITS | 40 | UNPARK | 51 | USE_PARAMETER_SET | 61

---

## ENUM_DIM_AXISTYPE

# ENUM_DIM_AXISTYPE Enumeration

# Members

Member Value Description DIMAXIS_NONE 0 DIMAXIS_XAXIS 1 DIMAXIS_YAXIS 2 DIMAXIS_ZAXIS 3

| ENUM_DIM_AXISTYPE Enumeration |

| Member | Value | Description |
| --- | DIMAXIS_NONE | 0 | DIMAXIS_XAXIS | 1 | DIMAXIS_YAXIS | 2 | DIMAXIS_ZAXIS | 3

---

## ENUM_DIM_OUTPUTTYPE

# ENUM_DIM_OUTPUTTYPE Enumeration

# Members

Member Value Description DIMOUTPUT_BOTH 2 DIMOUTPUT_NONE 3 DIMOUTPUT_REPORT 1 DIMOUTPUT_STATS 0

| ENUM_DIM_OUTPUTTYPE Enumeration |

| Member | Value | Description |
| --- | DIMOUTPUT_BOTH | 2 | DIMOUTPUT_NONE | 3 | DIMOUTPUT_REPORT | 1 | DIMOUTPUT_STATS | 0

---

## ENUM_DIM_PERP_PARALLEL

# ENUM_DIM_PERP_PARALLEL Enumeration

# Members

Member Value Description DIM_PARALLEL 1 DIM_PERPENDICULAR 0

| ENUM_DIM_PERP_PARALLEL Enumeration |

| Member | Value | Description |
| --- | DIM_PARALLEL | 1 | DIM_PERPENDICULAR | 0

---

## ENUM_DIM_PROF_TYPE

# ENUM_DIM_PROF_TYPE Enumeration

# Members

Member Value Description DIM_PROF_FORM_AND_LOCATION 1 DIM_PROF_FORM_ONLY 0

| ENUM_DIM_PROF_TYPE Enumeration |

| Member | Value | Description |
| --- | DIM_PROF_FORM_AND_LOCATION | 1 | DIM_PROF_FORM_ONLY | 0

---

## ENUM_DIM_RADIUS_TYPE

# ENUM_DIM_RADIUS_TYPE Enumeration

# Members

Member Value Description DIM_ADD_RADIUS 1 DIM_NO_RADIUS 0 DIM_SUB_RADIUS 2

| ENUM_DIM_RADIUS_TYPE Enumeration |

| Member | Value | Description |
| --- | DIM_ADD_RADIUS | 1 | DIM_NO_RADIUS | 0 | DIM_SUB_RADIUS | 2

---

## ENUM_DIM_TP_MATERIAL_CONDITION

# ENUM_DIM_TP_MATERIAL_CONDITION Enumeration

# Members

Member Value Description DIM_LMC_CONDITION 2 DIM_MMC_CONDITION 0 DIM_RFS_CONDITION 1

| ENUM_DIM_TP_MATERIAL_CONDITION Enumeration |

| Member | Value | Description |
| --- | DIM_LMC_CONDITION | 2 | DIM_MMC_CONDITION | 0 | DIM_RFS_CONDITION | 1

---

## ENUM_DIM_TP_MODIFIER

# ENUM_DIM_TP_MODIFIER Enumeration

# Members

Member Value Description DIM_LMC_LMC 8 DIM_LMC_MMC 7 DIM_LMC_RFS 6 DIM_MMC_LMC 5 DIM_MMC_MMC 4 DIM_MMC_RFS 3 DIM_RFS_LMC 2 DIM_RFS_MMC 1 DIM_RFS_RFS 0

| ENUM_DIM_TP_MODIFIER Enumeration |

| Member | Value | Description |
| --- | DIM_LMC_LMC | 8 | DIM_LMC_MMC | 7 | DIM_LMC_RFS | 6 | DIM_MMC_LMC | 5 | DIM_MMC_MMC | 4 | DIM_MMC_RFS | 3 | DIM_RFS_LMC | 2 | DIM_RFS_MMC | 1 | DIM_RFS_RFS | 0

---

## ENUM_DIM_TP_USE_AXIS

# ENUM_DIM_TP_USE_AXIS Enumeration

# Members

Member Value Description DIM_AXIS_AVERAGE 0 DIM_AXIS_END_POINT 2 DIM_AXIS_START_POINT 1

| ENUM_DIM_TP_USE_AXIS Enumeration |

| Member | Value | Description |
| --- | DIM_AXIS_AVERAGE | 0 | DIM_AXIS_END_POINT | 2 | DIM_AXIS_START_POINT | 1

---

## ENUM_DINFO_FIELD_TYPES

# ENUM_DINFO_FIELD_TYPES Enumeration

# Members

Member Value Description DINFO_DEV 4 DINFO_MAXMIN 5 DINFO_MEAN 7 DINFO_MEAS 1 DINFO_NOM 2 DINFO_NOT_USED 0 DINFO_NUMPOINTS 9 DINFO_OUTTOL 6 DINFO_STDDEV 8 DINFO_TOL 3

| ENUM_DINFO_FIELD_TYPES Enumeration |

| Member | Value | Description |
| --- | DINFO_DEV | 4 | DINFO_MAXMIN | 5 | DINFO_MEAN | 7 | DINFO_MEAS | 1 | DINFO_NOM | 2 | DINFO_NOT_USED | 0 | DINFO_NUMPOINTS | 9 | DINFO_OUTTOL | 6 | DINFO_STDDEV | 8 | DINFO_TOL | 3

---

## ENUM_DINFO_LOC_AXES

# ENUM_DINFO_LOC_AXES Enumeration

# Members

Member Value Description DINFO_LOC_A 7 DINFO_LOC_D 4 DINFO_LOC_H 9 DINFO_LOC_L 8 DINFO_LOC_NOT_USED 0 DINFO_LOC_PA 11 DINFO_LOC_PD 16 DINFO_LOC_PR 10 DINFO_LOC_R 5 DINFO_LOC_RS 15 DINFO_LOC_RT 13 DINFO_LOC_S 14 DINFO_LOC_T 12 DINFO_LOC_USE_DIM_AXES -2 DINFO_LOC_V 6 DINFO_LOC_WORST -1 DINFO_LOC_X 1 DINFO_LOC_Y 2 DINFO_LOC_Z 3

| ENUM_DINFO_LOC_AXES Enumeration |

| Member | Value | Description |
| --- | DINFO_LOC_A | 7 | DINFO_LOC_D | 4 | DINFO_LOC_H | 9 | DINFO_LOC_L | 8 | DINFO_LOC_NOT_USED | 0 | DINFO_LOC_PA | 11 | DINFO_LOC_PD | 16 | DINFO_LOC_PR | 10 | DINFO_LOC_R | 5 | DINFO_LOC_RS | 15 | DINFO_LOC_RT | 13 | DINFO_LOC_S | 14 | DINFO_LOC_T | 12 | DINFO_LOC_USE_DIM_AXES | -2 | DINFO_LOC_V | 6 | DINFO_LOC_WORST | -1 | DINFO_LOC_X | 1 | DINFO_LOC_Y | 2 | DINFO_LOC_Z | 3

---

## ENUM_DINFO_TP_AXES

# ENUM_DINFO_TP_AXES Enumeration

# Members

Member Value Description DINFO_TP_DD 6 DINFO_TP_DF 9 DINFO_TP_LD 7 DINFO_TP_LF 10 DINFO_TP_NOT_USED 0 DINFO_TP_PA 5 DINFO_TP_PR 4 DINFO_TP_TP 12 DINFO_TP_USE_DIM_AXES -2 DINFO_TP_WD 8 DINFO_TP_WF 11 DINFO_TP_WORST -1 DINFO_TP_X 1 DINFO_TP_Y 2 DINFO_TP_Z 3

| ENUM_DINFO_TP_AXES Enumeration |

| Member | Value | Description |
| --- | DINFO_TP_DD | 6 | DINFO_TP_DF | 9 | DINFO_TP_LD | 7 | DINFO_TP_LF | 10 | DINFO_TP_NOT_USED | 0 | DINFO_TP_PA | 5 | DINFO_TP_PR | 4 | DINFO_TP_TP | 12 | DINFO_TP_USE_DIM_AXES | -2 | DINFO_TP_WD | 8 | DINFO_TP_WF | 11 | DINFO_TP_WORST | -1 | DINFO_TP_X | 1 | DINFO_TP_Y | 2 | DINFO_TP_Z | 3

---

## ENUM_DMIS_OUTPUT_THEOS

# ENUM_DMIS_OUTPUT_THEOS Enumeration

# Members

Member Value Description PCD_DMIS_OUTPUT_THEOS_ALL 1 Outputs all theoretical values along with the measured values. PCD_DMIS_OUTPUT_THEOS_NONE 0 Not include theoretical values in the output DMIS file. PCD_DMIS_OUTPUT_THEOS_USE_IMPORTED_SETTING 2 Outputs theoretical values output by the DMIS program.

| ENUM_DMIS_OUTPUT_THEOS Enumeration |

| Member | Value | Description |
| --- | PCD_DMIS_OUTPUT_THEOS_ALL | 1 | Outputs all theoretical values along with the measured values. |
| PCD_DMIS_OUTPUT_THEOS_NONE | 0 | Not include theoretical values in the output DMIS file. |
| PCD_DMIS_OUTPUT_THEOS_USE_IMPORTED_SETTING | 2 | Outputs theoretical values output by the DMIS program. |

---

## ENUM_DMIS_OVERWRITE

# ENUM_DMIS_OVERWRITE Enumeration

# Members

Member Value Description PCD_DMIS_FILE_ADD_INDEX 0 Appends to the existing file name a number. PCD_DMIS_FILE_APPEND 2 Appends the DMIS output file to an existing file. PCD_DMIS_FILE_OVERWRITE 1 Overwrites an existing file with the new contents.

| ENUM_DMIS_OVERWRITE Enumeration |

| Member | Value | Description |
| --- | PCD_DMIS_FILE_ADD_INDEX | 0 | Appends to the existing file name a number. |
| PCD_DMIS_FILE_APPEND | 2 | Appends the DMIS output file to an existing file. |
| PCD_DMIS_FILE_OVERWRITE | 1 | Overwrites an existing file with the new contents. |

---

## ENUM_DTYPE_GETDBTYPE

# ENUM_DTYPE_GETDBTYPE Enumeration

# Members

Member Value Description DTYPE_DO_NOT_STORE 0 DTYPE_DYNAMIC_DATA 1 DTYPE_GETDBTYPE_ERROR -1 DTYPE_STATIC_DATA 2

| ENUM_DTYPE_GETDBTYPE Enumeration |

| Member | Value | Description |
| --- | DTYPE_DO_NOT_STORE | 0 | DTYPE_DYNAMIC_DATA | 1 | DTYPE_GETDBTYPE_ERROR | -1 | DTYPE_STATIC_DATA | 2

---

## ENUM_DTYPE_GETVARIABLETYPE

# ENUM_DTYPE_GETVARIABLETYPE Enumeration

# Members

Member Value Description DTYPE_DOUBLE 2 DTYPE_GETVARIABLETYPE_ERROR -1 DTYPE_LONG 1 DTYPE_TEXT 0

| ENUM_DTYPE_GETVARIABLETYPE Enumeration |

| Member | Value | Description |
| --- | DTYPE_DOUBLE | 2 | DTYPE_GETVARIABLETYPE_ERROR | -1 | DTYPE_LONG | 1 | DTYPE_TEXT | 0

---

## ENUM_ERROR_MODES

# ENUM_ERROR_MODES Enumeration

# Members

Member Value Description ERROR_MODE_GOTO_LABEL 1 ERROR_MODE_LASER_SKIP 1 ERROR_MODE_OFF 0 ERROR_MODE_SET_VARIABLE 2 ERROR_MODE_SKIP 3

| ENUM_ERROR_MODES Enumeration |

| Member | Value | Description |
| --- | ERROR_MODE_GOTO_LABEL | 1 | ERROR_MODE_LASER_SKIP | 1 | ERROR_MODE_OFF | 0 | ERROR_MODE_SET_VARIABLE | 2 | ERROR_MODE_SKIP | 3

---

## ENUM_ERROR_TYPES

# ENUM_ERROR_TYPES Enumeration

# Members

Member Value Description ERROR_TYPE_EDGE_NOT_DETECTED 3 ERROR_TYPE_FOCUS_NOT_DETECTED 4 ERROR_TYPE_LASER_ERROR 5 ERROR_TYPE_MISSED_HIT 1 ERROR_TYPE_REFLECTOR_NOT_FOUND 2 ERROR_TYPE_UNEXPECTED_HIT 0

| ENUM_ERROR_TYPES Enumeration |

| Member | Value | Description |
| --- | ERROR_TYPE_EDGE_NOT_DETECTED | 3 | ERROR_TYPE_FOCUS_NOT_DETECTED | 4 | ERROR_TYPE_LASER_ERROR | 5 | ERROR_TYPE_MISSED_HIT | 1 | ERROR_TYPE_REFLECTOR_NOT_FOUND | 2 | ERROR_TYPE_UNEXPECTED_HIT | 0

---

## ENUM_FEATREF_TYPES

# ENUM_FEATREF_TYPES Enumeration

# Members

Member Value Description FEATREF_3D -2 FEATREF_CURRENT_WORKPLANE -1 FEATREF_FEATURE -3 FEATREF_XMINUS 4 FEATREF_XPLUS 1 FEATREF_YMINUS 5 FEATREF_YPLUS 2 FEATREF_ZMINUS 3 FEATREF_ZPLUS 0

| ENUM_FEATREF_TYPES Enumeration |

| Member | Value | Description |
| --- | FEATREF_3D | -2 | FEATREF_CURRENT_WORKPLANE | -1 | FEATREF_FEATURE | -3 | FEATREF_XMINUS | 4 | FEATREF_XPLUS | 1 | FEATREF_YMINUS | 5 | FEATREF_YPLUS | 2 | FEATREF_ZMINUS | 3 | FEATREF_ZPLUS | 0

---

## ENUM_FEATURE_TYPES

# ENUM_FEATURE_TYPES Enumeration

# Members

Member Value Description F_CIRCLE 2 F_CONE 5 F_CURVE 8 F_CYLINDER 6 F_ELLIPSE 11 F_LINE 4 F_NONE 0 F_PLANE 7 F_POINT 1 F_SET 10 F_SLOT 9 F_SPHERE 3 F_SURFACE 12 F_WIDTH2D 22 F_WIDTH3D 21

| ENUM_FEATURE_TYPES Enumeration |

| Member | Value | Description |
| --- | F_CIRCLE | 2 | F_CONE | 5 | F_CURVE | 8 | F_CYLINDER | 6 | F_ELLIPSE | 11 | F_LINE | 4 | F_NONE | 0 | F_PLANE | 7 | F_POINT | 1 | F_SET | 10 | F_SLOT | 9 | F_SPHERE | 3 | F_SURFACE | 12 | F_WIDTH2D | 22 | F_WIDTH3D | 21

---

## ENUM_FIELD_DATA_TYPES

# ENUM_FIELD_DATA_TYPES Enumeration

# Members

Member Value Description FIELD_DATA_DOUBLE 2 FIELD_DATA_LONG 1 FIELD_DATA_NOTDEFINED -1 FIELD_DATA_TEXT 0

| ENUM_FIELD_DATA_TYPES Enumeration |

| Member | Value | Description |
| --- | FIELD_DATA_DOUBLE | 2 | FIELD_DATA_LONG | 1 | FIELD_DATA_NOTDEFINED | -1 | FIELD_DATA_TEXT | 0

---

## ENUM_FIELD_TYPES

# ENUM_FIELD_TYPES Enumeration

# Members

Sample hit measured A value.

This is meaningful only in Cartesian mode.

Sample hit measured H value.

This is meaningful only in Cartesian mode.

Sample hit measured R value.

This is meaningful only in Cartesian mode.

Sample hit measured X value.

This is meaningful only in Cartesian mode.

Sample hit measured Y value.

This is meaningful only in Cartesian mode.

Sample hit measured Z value.

This is meaningful only in Cartesian mode.

Sample hit theoretical A value.

This is meaningful only in Polar mode.

Sample hit theoretical H value.

This is meaningful only in Polar mode.

Sample hit theoretical R value.

This is meaningful only in Polar mode.

Sample hit theoretical X value.

This is meaningful only in Cartesian mode.

Sample hit theoretical Y value.

This is meaningful only in Cartesian mode.

Sample hit theoretical Z value.

This is meaningful only in Cartesian mode.

Member Value Description ABBE 1112 ABOVEBELOW_CONFIG 481 ADDITIONAL_CHART 409 ALIGN_LIST 153 ANGLE_COMP_TOGGLE 300 ANGLE_OFFSET 149 ANGLE_OFFSET_2 597 ANGULARITY_NOM_ANGLE 373 ANGVEC_I 103 ANGVEC_J 104 ANGVEC_K 105 ARROW_DENSITY 886 ARROW_MULTIPLIER 164 ARTICULATEDARM_TYPE 479 AUTO_CLEAR_PLANE 234 AUTO_DEV_DIRECTION 792 AUTO_EXPOSURE 1120 AUTO_INTENSITY 1121 AUTO_ONERROR_TYPE 461 AUTO_PH9 533 AUTO_PRINT 219 AUTO_ROTARY 831 AUTOBEEPING 295 AUTOFIT_CONSTRAINT 52 AUTOTOLZONE 298 AUTOTRIGGERONOFF 294 AVERAGE_ERROR 140 AXIS 132 AXIS_DESCRIPTION 749 AXIS_MINUS_TOL 747 AXIS_NOMINAL 748 AXIS_PLUS_TOL 746 AXIS_UNIT 1170 BA_FEAT_APEX_ANGLE 818 BA_FEAT_DEV_X 822 BA_FEAT_DEV_Y 823 BA_FEAT_DEV_Z 824 BA_FEAT_DEV3D 825 BA_FEAT_POINTING_ERR 817 BA_FEAT_RMS 816 BA_FEAT_SOURCE 815 BA_FEAT_X 819 BA_FEAT_Y 820 BA_FEAT_Z 821 BA_FEATURE 814 BA_RMS 803 BA_SOLUTION_OPTIONS 800 BA_SOLUTION_STATUS 801 BA_SOLUTION_TYPE 799 BA_STATION 805 BA_STATION_LOCKED 813 BA_STATION_ORIENTED 812 BA_STATION_ROTX 809 BA_STATION_ROTY 810 BA_STATION_ROTZ 811 BA_STATION_X 806 BA_STATION_Y 807 BA_STATION_Z 808 BA_VARIANCE 802 BA_WARNINGS 804 BF_MATH_TYPE 51 BOUND_TYPE 50 BOUNDARY_OFFSET 967 Gets and sets the boundary offset distance during a Void Detection. BOUNDARY_POINT_X 360 BOUNDARY_POINT_Y 361 BOUNDARY_POINT_Z 362 BSMETHOD_TYPE 476 BUFFER_SIZE_TYPE 207 CAD_COMP 492 CAD_GRAPH_ANALYSIS 1063 CAD_PLANAR_SEGREGATION_OFFSET 925 CAD_TOLERANCE 237 CALC_STYLE_FILE 471 CENTER_POINT 413 CENTER_ROTATION_MEAS 478 CENTER_ROTATION_THEO 477 CHART_SUB_TYPE 445 CHART_TYPE 388 CHECK_COLLISION 1124 CIRC_TYPE 42 CLEARANCE_DISTANCE 1082 CLOCK_WISE 1023 COL132_TYPE 244 COLUMN_ID 296 COMMAND_STRING 245 COMMAND_TYPE 790 COMMENT_FIELD 189 COMMENT_INPUT 709 COMMENT_TYPE 190 COMPOSITE 724 CONDITION_INDICATOR 1157 CONE_CONVEX_TYPE 468 CONE_LENGTH_ANGLE_TYPE 60 CONICAL_CONTROL_ELEMENT 926 CONICITY_CIRCULARITY 1069 CONICITY_CIRCULARITY_TOGGLE 1070 CONSTRAINT_TYPE 1031 CONTROL_ELEMENT 1007 COORD_TYPE 39 COP_BOOLEANTYPE 621 COP_COLORMAP 618 COP_COPLEMENT 619 COP_EXPORTFILETYPE 616 COP_FILTER 543 COP_IMPORTFILETYPE 622 COP_SELECTIONTYPE 617 COP_SIZE 544 COP_TYPE 545 CPOINT_DIAM 425 CPOINT_F_SCANSPEED 428 CPOINT_I 422 CPOINT_J 423 CPOINT_K 424 CPOINT_SCAN_CROSS_TOTAL 426 CPOINT_SCAN_DENSITY 427 CPOINT_TYPE 430 CPOINT_X 419 CPOINT_Y 420 CPOINT_Z 421 CREATE_WEIGHTS 433 CURVE_TYPE 65 CUSTOMIZED_DRF 907 CYLINDER_STUD_TYPE 914 DATA_MEM_PAGES 252 DATA_READ_LOCK 250 DATA_WRITE_LOCK 251 DATUM_FEATURE 1115 DATUM_FOS_DEV 1150 DATUM_FOS_DEVPERCENT 1151 DATUM_FOS_DEVPERCENT_NOM 1155 DATUM_FOS_FEATNAME 1145 DATUM_FOS_ISBILATERAL 1153 DATUM_FOS_MEAS 1149 DATUM_FOS_MINUSTOL 1148 DATUM_FOS_NOMINAL 1146 DATUM_FOS_OUTTOL 1152 DATUM_FOS_PLUSTOL 1147 DATUM_FOS_USE2DEVIATIONS 1154 DATUM_ID 1126 DATUM_TYPE 1114 DATUM_WORKPLANE 1116 DATUM1_MMB_SIZE 892 DATUM1_MMB_SIZE2 895 DATUM1_MODIFIER 731 DATUM1_MODIFIER2 734 DATUM2 725 DATUM2_MMB_SIZE 893 DATUM2_MMB_SIZE2 896 DATUM2_MODIFIER 732 DATUM2_MODIFIER2 735 DATUM3_MMB_SIZE 894 DATUM3_MMB_SIZE2 897 DATUM3_MODIFIER 733 DATUM3_MODIFIER2 736 DB_CHART_NAME 389 DB_QUERY_OP 386 DB_SOURCE_NAME 387 DB_SOURCE_TYPE 459 DEFAULT_PATH_TYPE 1010 DELETE_TYPE 539 DESCRIPTION 203 DESCRIPTION2 727 DEST_EXPR 133 DEV_DIAM 353 DEV_MAX 791 DEV_PERPEN_CENTERLINE 280 DEV_THRESHOLD 946 DEV_X 350 DEV_Y 351 DEV_Z 352 DEVIATION_ANGLE 390 DEVIATION_SYMBOLS 180 DIAGNOSTICS_TYPE 536 DIGIT_COUNT 199 DIM_AXIS_ITEM_NUMBER 786 DIM_BONUS 324 DIM_BOTTOM 972 DIM_DEVIATION 340 DIM_HALF_ANGLE 880 DIM_HEADING 182 DIM_ID 304 DIM_INFO_LOC 160 DIM_INFO_ORDER 159 DIM_INFO_TP_LOC 161 DIM_ITEM_NUMBER 788 DIM_LENGTH 173 DIM_LENGTH2 754 DIM_MAX 332 DIM_MEASURED 328 DIM_MIN 336 DIM_OUTTOL 344 DIM_PLANE_PROJECTION_LENGTH 860 DIM_PLANE_PROJECTION_LENGTH2 861 DIM_PLANE_PROJECTION_TYPE 858 DIM_PLANE_PROJECTION_TYPE2 859 DIM_PLANE_PROJECTION_WIDTH 862 DIM_PLANE_PROJECTION_WIDTH2 863 DIM_RPT_COLUMN_HDR 701 DIM_RPT_DATUM 703 DIM_RPT_DEVPERCENT 705 DIM_RPT_DEVPERCENT_NOM 737 DIM_RPT_DEVPERCENT2 739 DIM_RPT_GRAPHIC 704 DIM_RPT_ISBILATERAL 706 DIM_RPT_ISDATUM 702 DIM_RPT_NUMZONES 707 DIM_RPT_TOLERANCECOLOR1 917 DIM_RPT_TOLERANCECOLOR2 918 DIM_RPT_USETWODEVIATIONS 738 DIM_TEXT 177 DIM_TEXT_OPTIONS 178 DIM_TOP 971 DISPLAY_ADVANCED_PARAMETERS 510 DISPLAY_HITS 236 DISPLAY_ID 184 DISPLAY_PROBE_PARAMETERS 607 DISPLAY_TRACE 256 DISPLAY_TRACKER_PARAMETERS 840 DISPLAY_TYPE 185 DISTANCE 155 DRF_COLUMN_HDR 676 DRF_ROTATIONX 681 DRF_ROTATIONY 682 DRF_ROTATIONZ 683 DRF_SEGNAME 677 DRF_SHIFTX 678 DRF_SHIFTY 679 DRF_SHIFTZ 680 DRF_TBLHDR 641 DTYPE_LEAPFROGFULLPARTIAL 291 DTYPE_LEAPFROGNUMHITS 290 DTYPE_LEAPFROGTYPE 289 ECOND_HUMIDITY 838 ECOND_PRESSURE 837 ECOND_PRESSURE_UNIT 856 ECOND_TEMP 836 EDGEVEC_MEAS_I 341 EDGEVEC_MEAS_J 342 EDGEVEC_MEAS_K 343 EDGEVEC_TARG_I 333 EDGEVEC_TARG_J 334 EDGEVEC_TARG_K 335 EDGEVEC_THEO_I 337 EDGEVEC_THEO_J 338 EDGEVEC_THEO_K 339 END_ANG 99 END_NUM 144 ERROR_LABEL 467 ERROR_MODE 202 ERROR_TYPE 201 EVALUATION_LENGTH 1168 EVALUATION_LENGTH_UNIT 1179 EXCLUSION_ZONE 292 EXECUTE 293 EXPORT_CAD_DEV 922 EXTRUSION 852 F_AUTOMOVE 79 F_BOXLENGTH 85 F_BOXWIDTH 84 F_CHECK 88 F_CHECKDISTANCE 1053 F_CIRCRADIN 87 F_CIRCRADOUT 86 F_CORNER_RADIUS 81 F_DEPTH 78 F_END_OFFSET 787 F_ENDING_DEPTH 787 F_INCREMENT 82 F_INDENT 80 F_LOCATION 243 F_MAXACCELX 89 F_MAXACCELY 90 F_MAXACCELZ 91 F_MINUS_TOL 168 F_MOVESPEED 95 F_OFFSET 74 F_PITCH 76 F_PLUS_TOL 167 F_PREHIT 1051 F_RETRACT 1052 F_SCANSPEED 97 F_SIZE 434 F_SPACER 75 F_THICKNESS 77 F_THICKNESS_EDGE 593 F_TOLERANCE 83 F_TOUCHSPEED 96 FAIL_ON_EXIST 208 FASTPROBEMODE 908 FCF_RUNOUT_TYPE 867 FCF_STANDARD_TYPE 945 FCF_TOL_ZONE_TYPE 949 FEAT_ITEM_NUMBER 789 FEAT_TYPE 303 FIELD_OF_VIEW_OFFSET 1173 FIELD_WIDTH 198 FILE_COMMAND_TYPE 206 FILE_NAME 152 FILE_POINTER 197 FILTER_ISO13565_LAMBDAC 1165 FILTER_ISO4287_LAMBDAC 1164 FILTER_LAMBDAF 1160 FILTER_LAMBDAS 1162 FILTER_LINES_TOGGLE 857 FILTER_TYPE 472 FILTERSTRING 1192 FIND_HOLE_PERCENT 460 FIND_NADIR 1019 FIND_NOM_AXIS_TYPE 54 FIND_NOMS_TYPE 233 FINDHOLE_TYPE 47 FINDNOMS_BESTFIT 527 FINDNOMS_ONLYSELECTED 528 FIRST_DIAMETER 1102 FIRST_DIAMETER_OFFSET 1103 FIT 452 FIXTURE_TOL 465 FIXTURE_TYPE 226 FLY_MODE_TYPE 246 FORM_TOLERANCE 997 FOUR_AXIS_SCANNING 1098 GAGE_SEARCH_ZONE 1035 GAGE_TIP_HEIGHT 1034 GAGE_TIP_SHAPE 1032 GAGE_TIP_WIDTH 1033 GAGE_TIP2_HEIGHT 1059 GAGE_TIP2_WIDTH 1058 GAP_ONLY_TYPE 183 GDT_SYMBOL 708 GDT_SYMBOL2 730 GEN_ALIGN_TYPE 64 GEN_FEAT_TYPE 63 GRAPH_ANALYSIS 162 GRAPH_ANALYSIS_MINUS_TOL 785 GRAPH_ANALYSIS_PLUS_TOL 784 GRAPH_ANALYSIS_POINT_SIZE 783 GRAPH_OPTION 458 GRID 408 HIGH_ACCURACY 483 HIGH_THRESHOLD 223 HISTOGRAM 407 HIT_RMS 839 HIT_TIMESTAMP 854 HIT_TYPE 359 HITINT_TYPE 68 HORIZONTAL_CLIPPING 899 ID 2 IGNOREMOTIONERRORS_TYPE 392 ILLUM_BULB_INTENSITY_EDGE 875 This field holds the illumination intensity for edge features. ILLUM_BULB_INTENSITY_SURFACE 878 This field holds the illumination intensity for surface features. ILLUM_CALOVERRIDE_TOGGLE_EDGE 876 ILLUM_CALOVERRIDE_TOGGLE_SURFACE 879 ILLUM_OFFON_TOGGLE_EDGE 874 ILLUM_OFFON_TOGGLE_SURFACE 877 INCIDENCE_ANGLE 1039 INDEX_END 205 INDEX_START 204 INIT_HITS 72 INLINE_LEGACY_REPORT 848 INNER_SPACER 850 INOUT_TYPE 40 INTERNAL_EXTERNAL 150 IOCHANNEL_NUMBER 454 IOCHANNEL_PULSE_DURATION 457 IOCHANNEL_PULSE_INTERVAL 456 IOCHANNEL_PULSE_WIDTH 455 ISLAND_AI 634 ISLAND_AJ 635 ISLAND_AK 636 ISLAND_CLEARANCEDIST 638 ISLAND_DIAM 625 ISLAND_I 631 ISLAND_J 632 ISLAND_K 633 ISLAND_LENGTH 626 ISLAND_TYPE 637 ISLAND_WIDTH 627 ISLAND_X 628 ISLAND_Y 629 ISLAND_Z 630 ITEM_USED 138 ITERATE_COLUMNS 354 JUMP_HOLE 1013 JUMP_HOLE_FLAG 1012 LABEL_ID 200 LAMBDAC 1163 LAMBDAC_UNIT 1183 LAMBDAF 1159 LAMBDAF_UNIT 1181 LAMBDAS 1161 LAMBDAS_UNIT 1182 LASER_CLIP_LEFT_DIST 614 LASER_CLIP_LOW_DIST 604 LASER_CLIP_RIGHT_DIST 615 LASER_CLIP_UP_DIST 603 LASER_EXPOSURE 595 LASER_FILTER_NEIGHBOR_NUM 598 LASER_FILTER_TOGGLE 606 LASER_FILTER_TOL_ABOVE 600 LASER_FILTER_TOL_BELOW 601 LASER_FILTER_TOL_RIGHT 602 LASER_FREQUENCY 560 LASER_INTENSITY 596 LASER_PIXEL_TOGGLE 605 LASER_STRIPE_OVERLAP 558 LASER_STRIPE_OVERSCAN 559 LEADER_LINE_ID 729 LEFTYRIGHTY_CONFIG 480 LEVEL_REF_ID 4 LIN_POL_FILT_TYPE 62 LINE1_BONUS 782 LINE1_CALLOUT 643 LINE1_COLUMN_HDR 644 LINE1_DEV 650 LINE1_DEVPERCENT 651 LINE1_DEVPERCENT_NOM 750 LINE1_DEVPERCENT2 752 LINE1_FEATNAME 645 LINE1_ISBILATERAL 652 LINE1_MAX 768 LINE1_MEAS 647 LINE1_MIN 769 LINE1_MINUSTOL 649 LINE1_NOMINAL 646 LINE1_NUMZONES 653 LINE1_OUTTOL 765 LINE1_PLUSTOL 648 LINE1_TBLHDR 642 LINE1_USE2DEVIATIONS 751 LINE2_AXIS 686 LINE2_BONUS 658 LINE2_CALLOUT 655 LINE2_COLUMN_HDR 656 LINE2_DATUMA_DOF 901 LINE2_DATUMB_DOF 902 LINE2_DATUMC_DOF 903 LINE2_DATUMSHFT 660 LINE2_DEV 662 LINE2_DEVANG 663 LINE2_DEVPERCENT 664 LINE2_DEVPERCENT_NOM 740 LINE2_DEVPERCENT2 742 LINE2_FEATNAME 657 LINE2_FEATNAME_PROFILE 910 LINE2_ISBILATERAL 697 LINE2_ISPLANAR 435 LINE2_MAX 695 LINE2_MEAS 688 LINE2_MIN 696 LINE2_MINUSTOL 694 LINE2_NOMINAL 687 LINE2_NUMZONES 698 LINE2_OUTTOL 766 LINE2_PLANAR_OPEN_IN_X 410 LINE2_PLANAR_XDEV 438 LINE2_PLANAR_XTOL 436 LINE2_PLANAR_YDEV 439 LINE2_PLANAR_YTOL 437 LINE2_PLUSTOL 693 LINE2_TBLHDR 654 LINE2_TOL 659 LINE2_UNUSEDZONE 661 LINE2_USE2DEVIATIONS 741 LINE3_BONUS 669 LINE3_CALLOUT 666 LINE3_COLUMN_HDR 667 LINE3_DATUMA_DOF 904 LINE3_DATUMB_DOF 905 LINE3_DATUMC_DOF 906 LINE3_DATUMSHFT 671 LINE3_DEV 673 LINE3_DEVANG 674 LINE3_DEVPERCENT 675 LINE3_DEVPERCENT_NOM 743 LINE3_DEVPERCENT2 745 LINE3_FEATNAME 668 LINE3_ISBILATERAL 699 LINE3_ISPLANAR 440 LINE3_MAX 774 LINE3_MEAS 771 LINE3_MIN 775 LINE3_MINUSTOL 773 LINE3_NOMINAL 770 LINE3_NUMZONES 700 LINE3_OUTTOL 767 LINE3_PLANAR_OPEN_IN_X 411 LINE3_PLANAR_XDEV 443 LINE3_PLANAR_XTOL 441 LINE3_PLANAR_YDEV 444 LINE3_PLANAR_YTOL 442 LINE3_PLUSTOL 772 LINE3_TBLHDR 665 LINE3_TOL 670 LINE3_UNUSEDZONE 672 LINE3_USE2DEVIATIONS 744 LOAD_TYPE 355 LOCAL_SIZE_OPTION 1122 LOCATION_TOLERANCE 1004 LOCATOR_BMP 287 LOCATOR_WAV 288 LOW_FORCE 210 LOW_THRESHOLD 224 LOWER_BOUNDARY 1130 LOWER_MODIFIER 1046 LOWER_SIZE 1050 LOWER_TOLERANCE 1044 MACHINE_TYPE 227 MAGNIFICATION 485 MAN_RETRACT 176 MANUAL_FINE_PROBING 94 MANUAL_PREPOSITION 534 MATERIAL_COEFFICIENT 221 MAX_ANGLE 242 MAX_FORCE 209 MAX_INCREMENT 240 MAX_THICKNESS 1127 MEAN 491 MEAS_A 569 MEAS_A2 612 MEAS_ANGLE 30 MEAS_AREA 721 MEAS_DEPTH 556 MEAS_DIAM 29 MEAS_EA 584 MEAS_EH 585 MEAS_EI 936 MEAS_EJ 937 MEAS_EK 938 MEAS_END_ANG 624 MEAS_ER 583 MEAS_EX 313 MEAS_EY 314 MEAS_EZ 315 MEAS_FLUSH 552 MEAS_GAP 554 MEAS_H 570 MEAS_H2 613 MEAS_HEIGHT 306 MEAS_I 25 MEAS_J 26 MEAS_K 27 MEAS_LENGTH 28 MEAS_MINOR_AXIS 305 MEAS_MINOR_DIAMETER 921 MEAS_PERIMETER 719 MEAS_R 568 MEAS_R2 611 MEAS_RADIUS 978 MEAS_SA 581 MEAS_SH 582 MEAS_SI 933 MEAS_SJ 934 MEAS_SK 935 MEAS_SLOTVEC_I 307 MEAS_SLOTVEC_J 308 MEAS_SLOTVEC_K 309 MEAS_SR 580 MEAS_START_ANG 623 MEAS_SX 310 MEAS_SY 311 MEAS_SZ 312 MEAS_WIDTH 316 MEAS_X 22 MEAS_X2 396 MEAS_Y 23 MEAS_Y2 397 MEAS_Z 24 MEAS_Z2 398 MEASURE_ALL_FEATURES 141 MEASURE_ORDER_TYPE 59 MEASURED_2D3D_TYPE 66 MEASUREMENT_STRATEGY 919 MEASURMENT_STRATEGY 919 MEASVEC_I 106 MEASVEC_J 107 MEASVEC_K 108 MERGE 1061 MESH_COP_TYPE 979 MESH_HOLE_OPTION_TYPE 983 MESH_MAXLENGTHTRIANGLETOFILLHOLE 987 MESH_NOISE_REDUCTION_TYPE 980 MESH_REFINE_DEVIATIONERROR 982 MESH_REFINE_MESH 991 MESH_REFINE_MINTRIANGLESIZE 990 MESH_TRIANGLES_NUM 988 MESH_VERTICES_NUM 989 METHOD_TYPE 357 MIDPOINT_X 100 MIDPOINT_Y 101 MIDPOINT_Z 102 MIN_ANGLE 241 MIN_INCREMENT 239 MINIMUMAVERAGEDISTANCE 981 MINOR_WORD_TOGGLE 486 MODE_TYPE 58 MODIFIER_LIST 1040 MOVE_TYPE 45 MULTIFRAME_FILTER_LOWER_LIMIT 1176 MULTIFRAME_FILTER_UPPER_LIMIT 1175 N_CONTROLPOINTS 429 N_HITS 70 N_INIT_HITS_TYPE 55 N_PERM_HITS_TYPE 56 N_POINTS 1080 N_RINGS 1101 N_ROWS 71 N_SIDES 489 NEW_STATS_DIR 249 NEW_TIP 157 NO_APPROACH_VECTOR_FLIP 826 NOFLIPFLIP_CONFIG 482 NOISE_REDUCTION_PARAMETER 1177 NOMINAL 166 NOMINAL_COLOR 321 NORM_RELEARN 232 NSIGMA_FILTER 909 NUM_CONTROL_POINTS 317 NUM_FIT_POINTS 320 NUM_ITERATIONS 356 NUM_RETURN_DATA 215 NUMBER_OF_SECTIONS 1166 NUMSECTIONNAME 1193 OFFSET_LINE_METHOD 61 OFFSET_TOLERANCE 238 OFFSET_TYPE 1030 OLD_TIP 156 ONOFF_TYPE 285 OPERATOR_NORM_MATH_TYPE 1037 OPERTYPE 620 ORIENTATION_ORIGIN_TOGGLE 976 ORIGIN 220 ORIGIN_REF_ID 6 OUTER_SPACER 851 OUTLIER 1009 OUTPUT_DMIS_REPORT 449 OUTPUT_FEAT_W_DIMENS 448 OUTPUT_FEATURE_NOMS 447 OUTPUT_TO_REPORT 970 OUTPUT_TYPE 165 OVERRIDE 999 OVERWRITE 446 PART_NAME 191 PATH_TYPE 1020 PATTERN_TYPE 519 PAUSE_EXECUTION 947 PERCENTAGE 487 PERIMETER_BOUNDARY_TYPE 1011 PERM_HITS 73 PERP_PARALLEL_TYPE 170 PERUNIT_LENGTH 326 PERUNIT_STEPSIZE 325 PERUNIT_WIDTH 327 PINVEC_I 115 PINVEC_J 116 PINVEC_K 117 PLAN_CREATE_TIME 992 PLANE_CONSTRAINT_TYPE 1036 POINT_DISTANCE 1169 POINT_DISTANCE_UNIT 1180 POINT_INFO_HEADING 186 POINTDISTANCENAME 1195 POINTINFO_FEATURE_OR_DIMENSION_SYMBOL 1117 POINTINFO_FEATURE_OR_DIMENSION_TYPE 1118 POINTINFO_FILTER_DEVIATION 380 POINTINFO_FILTER_DEVIATION_NUMBER 381 POINTINFO_FILTER_INTERVAL 301 POINTINFO_FILTER_INTERVAL_NUMBER 302 POINTINFO_FILTER_MINMAX 1022 POINTINFO_FILTER_OUTTOL 382 POINTINFO_FILTER_WORST 378 POINTINFO_FILTER_WORST_NUMBER 379 POINTINFO_HITNUMBER 1119 POLAR_VECTOR_COMPENSATION 218 POLYNOMIAL_DEGREE 1158 POLYNOMIALDEGREENAME 1194 POS_REPORT_AXIS_X 277 POS_REPORT_AXIS_Y 278 POS_REPORT_AXIS_Z 279 POS_REPT_DISPLAY_OPTION 462 POSITION_SEGMENT 994 POSITIONAL_ACCURACY 214 POSTTRAVELDISTANCE 1189 POSTTRAVELNAME 1190 POSTTRAVELUNIT 1191 PPROG 399 PRE_PROBE_CYLINDER 1016 PRECISION 175 PREHIT_RETRACT 1014 PRETRAVELDISTANCE 1186 PRETRAVELNAME 1187 PRETRAVELUNIT 1188 PRIMARY_DROP 1088 PRINT_DELETE_RUNS 377 PRINT_DRAFTMODE 376 PRINT_TO_FILE 374 PRINT_TO_PRINTER 375 PROBE_ACCURACY 213 PROBE_COMP 228 PROBE_DIRECTION 793 PROBE_TYPE 834 PROBING_MODE 299 PROBING_PERIOD 1015 PROFILE_BOTTOM_CURVE 1087 PROFILE_FORM_TYPE 174 PROFILE_TOP_CURVE 1086 PROFILE_TYPE 550 PROGRAM_GAGE_FEAT_TYPE 521 PROGRAM_GAGE_TYPE 522 PROJECT_POINT 948 PROJECTOR 847 PTDENSITY_DEVLIMIT 843 PTDENSITY_MAXSPAN 844 PTDENSITY_TOGGLE 841 PTDENSITY_UPPERBOUND 842 PUNCHVEC_I 118 PUNCHVEC_J 119 PUNCHVEC_K 120 QDAS_CATALOG_FILENAME 1075 QDAS_CONFIGURATION_FILENAME 1074 QDAS_OUTPUT_FILE_TYPE 1073 QUALITY_THRESHOLD 1156 QUERY_SHOW_GRAPHIC_SETTINGS 470 RADIUS_TYPE 171 RANGE 1048 READ_FILE_PRIOR_EXEC 1108 READ_WRITE 196 READPOS_TYPE 46 REDUCTION_FILTER 864 REDUCTION_FILTER_PERCENTAGE 913 REF_ID 3 REF_TEMP 222 REF_UID 798 REFRACTIVE_INDEX 1081 REGR 412 RELATIVE_COMMENTS 830 REPIERCE_CAD 142 REPORT_DIMENSION 1185 REPORT_GRAPH_ANALYSIS 1064 REPORT_LABEL_AXIS 1131 REPORT_LABEL_BONUS 1137 REPORT_LABEL_DEV 1136 REPORT_LABEL_ISPLANAR 1139 REPORT_LABEL_MEAS 1133 REPORT_LABEL_MINUSTOL 1135 REPORT_LABEL_NOMINAL 1132 REPORT_LABEL_OUTTOL 1138 REPORT_LABEL_PLANAR_OPEN_IN_X 1144 REPORT_LABEL_PLANAR_XDEV 1142 REPORT_LABEL_PLANAR_XTOL 1140 REPORT_LABEL_PLANAR_YDEV 1143 REPORT_LABEL_PLANAR_YTOL 1141 REPORT_LABEL_PLUSTOL 1134 REPORT_MODE 323 REPORT_PLOT 1171 REPORT_SURFVEC_I 383 REPORT_SURFVEC_J 384 REPORT_SURFVEC_K 385 REPORTVEC_I 121 REPORTVEC_J 122 REPORTVEC_K 123 RET_ONLY_TYPE 188 RETURN_SPEED 216 REVISION_NUMBER 192 RGH_BITMAP_LOCATION 1184 RMEAS_TYPE 48 RMEASFEATID 69 RMEASFEATIDX 524 RMEASFEATIDY 525 RMEASFEATIDZ 526 ROTAB_MOVE_SIMULTANEOUS 1123 ROTATE_REF_ID 5 ROTATION_TYPE 158 ROTATION_TYPE_2 833 ROW_ID 286 RPT_DIMENSION_TABLES 639 SAMPLE_FEATURE 950 SAMPLE_HIT_MEAS_A 965 Sample hit measured A value. This is meaningful only in Cartesian mode. SAMPLE_HIT_MEAS_H 966 Sample hit measured H value. This is meaningful only in Cartesian mode. SAMPLE_HIT_MEAS_R 964 Sample hit measured R value. This is meaningful only in Cartesian mode. SAMPLE_HIT_MEAS_X 961 Sample hit measured X value. This is meaningful only in Cartesian mode. SAMPLE_HIT_MEAS_Y 962 Sample hit measured Y value. This is meaningful only in Cartesian mode. SAMPLE_HIT_MEAS_Z 963 Sample hit measured Z value. This is meaningful only in Cartesian mode. SAMPLE_HIT_THEO_A 956 Sample hit theoretical A value. This is meaningful only in Polar mode. SAMPLE_HIT_THEO_H 957 Sample hit theoretical H value. This is meaningful only in Polar mode. SAMPLE_HIT_THEO_I 958 Sample hit theoretical I value. SAMPLE_HIT_THEO_J 959 Sample hit theoretical J value. SAMPLE_HIT_THEO_K 960 Sample hit theoretical K value. SAMPLE_HIT_THEO_R 955 Sample hit theoretical R value. This is meaningful only in Polar mode. SAMPLE_HIT_THEO_X 952 Sample hit theoretical X value. This is meaningful only in Cartesian mode. SAMPLE_HIT_THEO_Y 953 Sample hit theoretical Y value. This is meaningful only in Cartesian mode. SAMPLE_HIT_THEO_Z 954 Sample hit theoretical Z value. This is meaningful only in Cartesian mode. SAMPLE_HIT_TYPE 969 SAMPLE_METHOD 951 SAVE_ALIGN_CAD_TO_PARTS 151 SCALING 795 SCAN_4AXIS 1060 SCAN_ACCELERATION 92 SCAN_AXISVEC_I 265 SCAN_AXISVEC_J 266 SCAN_AXISVEC_K 267 SCAN_BNDRY_TYPE 432 SCAN_COMPENSATION 1008 SCAN_CROSS_TOTAL 274 SCAN_CURVE_TYPE 1105 SCAN_CUTPLANEVEC_I 259 SCAN_CUTPLANEVEC_J 260 SCAN_CUTPLANEVEC_K 261 SCAN_DENSITY 217 SCAN_EDGE_THICK 276 SCAN_ENDVEC_I 268 SCAN_ENDVEC_J 269 SCAN_ENDVEC_K 270 SCAN_EXECUTION_MODE 1079 SCAN_INITDIR_I 271 SCAN_INITDIR_J 272 SCAN_INITDIR_K 273 SCAN_INITVEC_I 262 SCAN_INITVEC_J 263 SCAN_INITVEC_K 264 SCAN_MODE 855 SCAN_OFFSET_FORCE 93 SCAN_PATH_DENSITY 1099 SCAN_SHAPE_TEACH_TYPE 1107 SCAN_TECHNIQUE 358 SCAN_TIME_INCR 275 SCAN_TYPE 1005 SCONDARY_DROP 1089 SCREEN_CAPTURE_AUTO_TIME 540 SCREEN_CAPTURE_AUTO_TYPE 536 SCREEN_CAPTURE_QUALITY 503 SCREEN_CAPTURE_SCALE 502 SCREEN_CAPTURE_TYPE 535 SEARCHMODE_TYPE 57 SECTION_INDEX 764 SEGMENT_TOGGLE 1065 SEGMENT_TYPE 1066 SEGMENT_TYPE_TOGGLE 1067 SELECT_BY_TOTAL_HITS 1026 SELECT_CENTER 1100 SELECT_EVERY_NPOINTS 1027 SELECT_FIRST_POINT 1024 SELECT_LAST_POINT 1025 SELECT_TOTAL_NHITS 1028 SELF_CENTER_CUT_VECTOR_I 1055 SELF_CENTER_CUT_VECTOR_J 1056 SELF_CENTER_CUT_VECTOR_K 1057 SELF_CENTER_POINT 1054 SENSITIVITY_MODE 865 SENSOR_LIST 225 SERIAL_NUMBER 193 SHIFT_BONUS 915 SHIFT_BONUS2 916 SHOW_COLUMN 494 SHOW_DETAILS 136 SHOW_HEADINGS 179 SHOW_IDS 135 SHOW_MORE_SPC_CALCS 414 SHOW_NOMS 723 SHOW_OPTIONS 728 SHOW_POINT_INFO 187 SHOW_ROW 493 SHOW_SPC_CALCS 402 SIMUL_NUMBER_POSITION_FCFS 912 SIMUL_NUMBER_PROFILE_FCFS 911 SIMULT_EVAL 763 SINGLE_POINT 235 SINGLE_POINT_DEVIATION 849 SIZE_NOMINAL 1068 SIZE_SYMBOL 866 SIZE_TOLERANCE 1002 SKIP_NUM 145 SKIP_RINGS 1104 SLOT_MIN_MAX_TYPE 53 SLOT_NUMBER 297 SLOT_TYPE 563 SLOTVEC_I 109 SLOTVEC_J 110 SLOTVEC_K 111 SMOOTHING_CORNER_RADIUS 1106 SMOOTHING_FACTOR 993 SMOOTHING_TOLERANCE 1021 SNAP_TYPE 43 SOLID 416 SPEC_LIMITS 403 SPEC_OFFSET 415 SPECIFICATION_STRING 1041 SPHERE_CENTER_X 1109 SPHERE_CENTER_Y 1110 SPHERE_CENTER_Z 1111 SRC_EXPR 134 STANDARD 1042 STANDARD_DEVIATION 181 START_ANG 98 START_LABEL 466 START_NUM 143 STAT_CALC_TYPE 254 STAT_COUNT 194 STAT_NAME_TYPE 253 STATS_DATASOURCE 391 STATS_DB_TYPE 453 STATS_DIR 248 STATS_TYPE 247 STDDEV 405 STRIPE_DISTANCE 1076 SUB_NAME 195 SUMMARY_AXIS 690 SUMMARY_BONUS 781 SUMMARY_COLUMN_HDR 684 SUMMARY_DEV 640 SUMMARY_FEAT 685 SUMMARY_MAX 779 SUMMARY_MEAS 692 SUMMARY_MIN 780 SUMMARY_MINUSTOL 778 SUMMARY_NOMINAL 691 SUMMARY_OUTTOL 776 SUMMARY_PLUSTOL 777 SUMMARY_TBLHDR 689 SURFACE 484 SURFACE_INTERPERTATION_IF_POSSIBLE 996 SURFACE_TYPE 998 SURFVEC_I 112 SURFVEC_J 113 SURFVEC_K 114 SURFVEC_MEAS_I 546 SURFVEC_MEAS_J 547 SURFVEC_MEAS_K 548 SURFVEC_TARG_I 329 SURFVEC_TARG_J 330 SURFVEC_TARG_K 331 T_VALUE 345 TARG_A 572 TARG_EA 590 TARG_EH 591 TARG_EI 942 TARG_EJ 943 TARG_EK 944 TARG_ER 589 TARG_EX 516 TARG_EY 517 TARG_EZ 518 TARG_H 573 TARG_I 31 TARG_J 32 TARG_K 33 TARG_R 571 TARG_SA 587 TARG_SH 588 TARG_SI 939 TARG_SJ 940 TARG_SK 941 TARG_SR 586 TARG_SX 513 TARG_SY 514 TARG_SZ 515 TARG_X 19 TARG_Y 20 TARG_Z 21 TARGET_BLOB_TYPE 557 TARGET_COLOR 282 TARGET_COVERAGE 832 TARGET_COVERAGE_ACTIVE_TARGETS 923 TARGET_DIRECTION 474 TARGET_EDGE_ANGLE 520 TARGET_EDGE_CROSSHAIR_CENTER 853 TARGET_EDGE_DARKLIGHT 975 TARGET_EDGE_DENSITY 508 TARGET_EDGE_EDGEDETECT 712 TARGET_EDGE_EDGENUM 538 TARGET_EDGE_EDGESELECT 537 TARGET_EDGE_END_VALUE 828 TARGET_EDGE_FILTER_AREA 715 TARGET_EDGE_FILTER_AREA_SIZE 716 TARGET_EDGE_FILTER_CLEAN 713 TARGET_EDGE_FILTER_CLEAN_STRENGTH 714 TARGET_EDGE_GRADIENT 717 TARGET_EDGE_GREYSCALE_THRESHHOLD 974 TARGET_EDGE_HEIGHT 711 TARGET_EDGE_ILLUM 505 TARGET_EDGE_IMAGE_RGB_MIXING_B 870 TARGET_EDGE_IMAGE_RGB_MIXING_G 869 TARGET_EDGE_IMAGE_RGB_MIXING_R 868 TARGET_EDGE_MIN_AREA 973 TARGET_EDGE_MIN_MAX_TYPE 884 TARGET_EDGE_MIN_MAX_TYPE_TOGGLE 885 TARGET_EDGE_MIN_MAX_WIDTH 883 TARGET_EDGE_POLARITY 475 TARGET_EDGE_SENSILIGHT 592 TARGET_EDGE_SIZE 504 TARGET_EDGE_START_VALUE 827 TARGET_EDGE_STRENGTH 507 TARGET_EDGE_TOL 506 TARGET_EDGE_TYPE 509 TARGET_EDGE_UNDERSCAN 549 TARGET_EDGE_WIDTH 710 TARGET_FILTER_AREA 715 TARGET_FILTER_AREA_SIZE 716 TARGET_FILTER_CLEAN 713 TARGET_FILTER_CLEAN_STRENGTH 714 TARGET_FILTER_OUTLIER 561 TARGET_FILTER_OUTLIER_DISTANCE_MULTIPLIER 986 TARGET_FILTER_OUTLIER_DISTANCE_THRESHOLD 562 TARGET_FILTER_OUTLIER_MIN_NEIGHBORS 985 TARGET_FILTER_OUTLIER_STD_DEV_THRESHOLD 599 TARGET_FILTER_OUTLIER_USING_NEIGHBORS 984 TARGET_FOCUS 523 TARGET_MEASURE_AT_FOV_CENTER 845 TARGET_SURFACE_CROSSHAIR_HEIGHT 722 TARGET_SURFACE_DURATION 499 TARGET_SURFACE_FIND_SURFACE 846 TARGET_SURFACE_HEIGHT 497 TARGET_SURFACE_HIACC 501 TARGET_SURFACE_ILLUM 490 TARGET_SURFACE_IMAGE_RGB_MIXING_B 870 TARGET_SURFACE_IMAGE_RGB_MIXING_G 869 TARGET_SURFACE_IMAGE_RGB_MIXING_R 868 TARGET_SURFACE_MODE 500 TARGET_SURFACE_RANGE 498 TARGET_SURFACE_SENSILIGHT 495 TARGET_SURFACE_SURFACE_VARIANCE 829 TARGET_SURFACE_TYPE 511 TARGET_SURFACE_WIDTH 496 TARGET_TYPE 564 TARGSLOT_I 124 TARGSLOT_J 125 TARGSLOT_K 126 TEMPLATE_MATCH 1091 TEMPLATE_MATCH_CORRELATION 1092 TEMPP 532 TEMPX 529 TEMPY 530 TEMPZ 531 TEXT_ANALYSIS 163 TEXTANAL_LABEL_DEV 761 TEXTANAL_LABEL_MEAS_I 758 TEXTANAL_LABEL_MEAS_J 759 TEXTANAL_LABEL_MEAS_K 760 TEXTANAL_LABEL_MEAS_X 755 TEXTANAL_LABEL_MEAS_Y 756 TEXTANAL_LABEL_MEAS_Z 757 TEXTANAL_LABEL_MINMAX 762 THEO_A 566 THEO_A2 609 THEO_ANGLE 38 THEO_AREA 720 THEO_DEPTH 555 THEO_DIAM 34 THEO_DX 1083 THEO_DY 1084 THEO_DZ 1085 THEO_EA 578 THEO_EH 579 THEO_EI 930 THEO_EJ 931 THEO_EK 932 THEO_END_ANG 284 THEO_ER 577 THEO_EX 13 THEO_EY 14 THEO_EZ 15 THEO_FLUSH 551 THEO_GAP 553 THEO_H 567 THEO_H2 610 THEO_HEIGHT 37 THEO_I 16 THEO_J 17 THEO_K 18 THEO_LENGTH 36 THEO_MINOR_AXIS 130 THEO_MINOR_DIAMETER 920 THEO_PERIMETER 718 THEO_R 565 THEO_R2 608 THEO_RADIUS 977 THEO_SA 575 THEO_SH 576 THEO_SI 927 THEO_SJ 928 THEO_SK 929 THEO_SR 574 THEO_START_ANG 283 THEO_SX 10 THEO_SY 11 THEO_SZ 12 THEO_WIDTH 35 THEO_X 7 THEO_X2 393 THEO_Y 8 THEO_Y2 394 THEO_Z 9 THEO_Z2 395 THEOBF_TYPE 49 THICKNESS_DROP 1090 THICKNESS_GAGE_DISTANCE 1096 THICKNESS_GAGE_PRIMARY_FEATURE 1094 THICKNESS_GAGE_SECONDARY_FEATURE 1095 THICKNESS_GAGE_SHOW_POI 1097 THICKNESS_TYPE 41 THICKNESS_TYPE_EDGE 594 THINNING_TOL 67 THREADED_HOLE 1017 THRESHOLD 488 TIME_ARG 450 TIME_FILTER 401 TIME_STAMP 835 TIP_I 229 TIP_J 230 TIP_K 231 TITLE 418 TOLERANCE_CODE 1047 TOLERANCE_ZONE_DIRECTION 995 TOOL_DIAM 349 TOOL_X 346 TOOL_Y 347 TOOL_Z 348 TP_MODIFIER 169 TP_MODIFIER2 726 TPS_SUB_COMMAND_TYPE 887 TRACE_DATA_SOURCE 1077 TRACE_DISPLAY_MESSAGE 1072 TRACE_DISPLAY_ONREPORT 1093 TRACE_FILTER 400 TRACE_FILTER_ARG 451 TRACE_NAME 257 TRACE_VALUE 258 TRACE_VALUE_LIMIT 473 TRACE_VALUE_OPTION 1078 TRACKER_GRAVITY_PLANE 882 TRACKER_SUB_COMMAND_TYPE 881 TRANSFER_DIR 255 TRANSLATION_MODIFIER 1125 TRAVERSE_LENGTH 1167 TRAVERSE_LENGTH_UNIT 1178 TRIGGER_FORCE 212 TRIGGERPLANE 469 TRIGGERTOLERANCE 463 TRIGGERTOLVALUE 464 TWO_D_THREE_D_TYPE 131 U_HITS 318 U_L_BOUNDS 417 UCL_LCL 406 UID 797 UNEQUAL_TOL_LINE2 890 UNEQUAL_TOL_LINE3 891 UNEQUAL_TOL_ZONE_LINE2 888 UNEQUAL_TOL_ZONE_LINE3 889 UNIT_AREA_LINE3 898 UNIT_TYPE 172 UP_FORCE 211 UPDATEVEC_I 127 UPDATEVEC_J 128 UPDATEVEC_K 129 UPPER_BOUNDARY 1129 UPPER_MODIFIER 1045 UPPER_SIZE 1049 UPPER_TOLERANCE 1043 UPR 1006 USE_3DFILTER 431 USE_AXIS 139 USE_AXIS2 753 USE_BOUNDARY_OFFSET 968 Enables or disables using the boundary offset as a minimum distance from the boundary (the edge) where the hits are automatically placed during a Void Detection. If set to NO, the tip's radius value is the minimum distance. USE_CAD_PLANAR_SEGREGATION 924 USE_EXTENDED_FIELD_OF_VIEW 1172 USE_FORM 1196 USE_HSSDAT 541 USE_INCIDENCE_ANGLE 1038 USE_LOCATION 1003 USE_MIN_MAX_FIT 1029 USE_MULTIFRAME_FILTER 1174 USE_SCALING 796 USE_SCAN_FILTER 1018 USE_SIZE 1001 USE_STARTENDDELAY 542 USE_THEO 281 USE_THEOS 1062 USEPIN_TYPE 44 USER_DEFINED_HITS 1071 USER_DEFINED_THEOS 794 USES_SPECIFIED_TOLERANCE_ZONE_DIRECTION 1128 V_HITS 319 VERTICAL_CLIPPING 900 VIDEO_GAIN 363 VIDEO_LASERLIGHT1 366 VIDEO_LASERLIGHT2 367 VIDEO_LEDLIGHT 365 VIDEO_LSEG 370 VIDEO_OFFSET 364 VIDEO_XSEG 371 VIDEO_YEND 369 VIDEO_YORIGIN 368 VIDEO_YSEG 372 VOID_DETECT 512 WAVE_FILE 322 WAVELENGTH 1000 WAVELENGTHPLANE 1113 WEIGHT 137 WORK_PLANE 154 X_OFFSET 146 Y_OFFSET 147 Z_OFFSET 148 ZONES 404

| ENUM_FIELD_TYPES Enumeration |

| Member | Value | Description |
| --- | ABBE | 1112 | ABOVEBELOW_CONFIG | 481 | ADDITIONAL_CHART | 409 | ALIGN_LIST | 153 | ANGLE_COMP_TOGGLE | 300 | ANGLE_OFFSET | 149 | ANGLE_OFFSET_2 | 597 | ANGULARITY_NOM_ANGLE | 373 | ANGVEC_I | 103 | ANGVEC_J | 104 | ANGVEC_K | 105 | ARROW_DENSITY | 886 | ARROW_MULTIPLIER | 164 | ARTICULATEDARM_TYPE | 479 | AUTO_CLEAR_PLANE | 234 | AUTO_DEV_DIRECTION | 792 | AUTO_EXPOSURE | 1120 | AUTO_INTENSITY | 1121 | AUTO_ONERROR_TYPE | 461 | AUTO_PH9 | 533 | AUTO_PRINT | 219 | AUTO_ROTARY | 831 | AUTOBEEPING | 295 | AUTOFIT_CONSTRAINT | 52 | AUTOTOLZONE | 298 | AUTOTRIGGERONOFF | 294 | AVERAGE_ERROR | 140 | AXIS | 132 | AXIS_DESCRIPTION | 749 | AXIS_MINUS_TOL | 747 | AXIS_NOMINAL | 748 | AXIS_PLUS_TOL | 746 | AXIS_UNIT | 1170 | BA_FEAT_APEX_ANGLE | 818 | BA_FEAT_DEV_X | 822 | BA_FEAT_DEV_Y | 823 | BA_FEAT_DEV_Z | 824 | BA_FEAT_DEV3D | 825 | BA_FEAT_POINTING_ERR | 817 | BA_FEAT_RMS | 816 | BA_FEAT_SOURCE | 815 | BA_FEAT_X | 819 | BA_FEAT_Y | 820 | BA_FEAT_Z | 821 | BA_FEATURE | 814 | BA_RMS | 803 | BA_SOLUTION_OPTIONS | 800 | BA_SOLUTION_STATUS | 801 | BA_SOLUTION_TYPE | 799 | BA_STATION | 805 | BA_STATION_LOCKED | 813 | BA_STATION_ORIENTED | 812 | BA_STATION_ROTX | 809 | BA_STATION_ROTY | 810 | BA_STATION_ROTZ | 811 | BA_STATION_X | 806 | BA_STATION_Y | 807 | BA_STATION_Z | 808 | BA_VARIANCE | 802 | BA_WARNINGS | 804 | BF_MATH_TYPE | 51 | BOUND_TYPE | 50 | BOUNDARY_OFFSET | 967 | Gets and sets the boundary offset distance during a Void Detection. |
| BOUNDARY_POINT_X | 360 | BOUNDARY_POINT_Y | 361 | BOUNDARY_POINT_Z | 362 | BSMETHOD_TYPE | 476 | BUFFER_SIZE_TYPE | 207 | CAD_COMP | 492 | CAD_GRAPH_ANALYSIS | 1063 | CAD_PLANAR_SEGREGATION_OFFSET | 925 | CAD_TOLERANCE | 237 | CALC_STYLE_FILE | 471 | CENTER_POINT | 413 | CENTER_ROTATION_MEAS | 478 | CENTER_ROTATION_THEO | 477 | CHART_SUB_TYPE | 445 | CHART_TYPE | 388 | CHECK_COLLISION | 1124 | CIRC_TYPE | 42 | CLEARANCE_DISTANCE | 1082 | CLOCK_WISE | 1023 | COL132_TYPE | 244 | COLUMN_ID | 296 | COMMAND_STRING | 245 | COMMAND_TYPE | 790 | COMMENT_FIELD | 189 | COMMENT_INPUT | 709 | COMMENT_TYPE | 190 | COMPOSITE | 724 | CONDITION_INDICATOR | 1157 | CONE_CONVEX_TYPE | 468 | CONE_LENGTH_ANGLE_TYPE | 60 | CONICAL_CONTROL_ELEMENT | 926 | CONICITY_CIRCULARITY | 1069 | CONICITY_CIRCULARITY_TOGGLE | 1070 | CONSTRAINT_TYPE | 1031 | CONTROL_ELEMENT | 1007 | COORD_TYPE | 39 | COP_BOOLEANTYPE | 621 | COP_COLORMAP | 618 | COP_COPLEMENT | 619 | COP_EXPORTFILETYPE | 616 | COP_FILTER | 543 | COP_IMPORTFILETYPE | 622 | COP_SELECTIONTYPE | 617 | COP_SIZE | 544 | COP_TYPE | 545 | CPOINT_DIAM | 425 | CPOINT_F_SCANSPEED | 428 | CPOINT_I | 422 | CPOINT_J | 423 | CPOINT_K | 424 | CPOINT_SCAN_CROSS_TOTAL | 426 | CPOINT_SCAN_DENSITY | 427 | CPOINT_TYPE | 430 | CPOINT_X | 419 | CPOINT_Y | 420 | CPOINT_Z | 421 | CREATE_WEIGHTS | 433 | CURVE_TYPE | 65 | CUSTOMIZED_DRF | 907 | CYLINDER_STUD_TYPE | 914 | DATA_MEM_PAGES | 252 | DATA_READ_LOCK | 250 | DATA_WRITE_LOCK | 251 | DATUM_FEATURE | 1115 | DATUM_FOS_DEV | 1150 | DATUM_FOS_DEVPERCENT | 1151 | DATUM_FOS_DEVPERCENT_NOM | 1155 | DATUM_FOS_FEATNAME | 1145 | DATUM_FOS_ISBILATERAL | 1153 | DATUM_FOS_MEAS | 1149 | DATUM_FOS_MINUSTOL | 1148 | DATUM_FOS_NOMINAL | 1146 | DATUM_FOS_OUTTOL | 1152 | DATUM_FOS_PLUSTOL | 1147 | DATUM_FOS_USE2DEVIATIONS | 1154 | DATUM_ID | 1126 | DATUM_TYPE | 1114 | DATUM_WORKPLANE | 1116 | DATUM1_MMB_SIZE | 892 | DATUM1_MMB_SIZE2 | 895 | DATUM1_MODIFIER | 731 | DATUM1_MODIFIER2 | 734 | DATUM2 | 725 | DATUM2_MMB_SIZE | 893 | DATUM2_MMB_SIZE2 | 896 | DATUM2_MODIFIER | 732 | DATUM2_MODIFIER2 | 735 | DATUM3_MMB_SIZE | 894 | DATUM3_MMB_SIZE2 | 897 | DATUM3_MODIFIER | 733 | DATUM3_MODIFIER2 | 736 | DB_CHART_NAME | 389 | DB_QUERY_OP | 386 | DB_SOURCE_NAME | 387 | DB_SOURCE_TYPE | 459 | DEFAULT_PATH_TYPE | 1010 | DELETE_TYPE | 539 | DESCRIPTION | 203 | DESCRIPTION2 | 727 | DEST_EXPR | 133 | DEV_DIAM | 353 | DEV_MAX | 791 | DEV_PERPEN_CENTERLINE | 280 | DEV_THRESHOLD | 946 | DEV_X | 350 | DEV_Y | 351 | DEV_Z | 352 | DEVIATION_ANGLE | 390 | DEVIATION_SYMBOLS | 180 | DIAGNOSTICS_TYPE | 536 | DIGIT_COUNT | 199 | DIM_AXIS_ITEM_NUMBER | 786 | DIM_BONUS | 324 | DIM_BOTTOM | 972 | DIM_DEVIATION | 340 | DIM_HALF_ANGLE | 880 | DIM_HEADING | 182 | DIM_ID | 304 | DIM_INFO_LOC | 160 | DIM_INFO_ORDER | 159 | DIM_INFO_TP_LOC | 161 | DIM_ITEM_NUMBER | 788 | DIM_LENGTH | 173 | DIM_LENGTH2 | 754 | DIM_MAX | 332 | DIM_MEASURED | 328 | DIM_MIN | 336 | DIM_OUTTOL | 344 | DIM_PLANE_PROJECTION_LENGTH | 860 | DIM_PLANE_PROJECTION_LENGTH2 | 861 | DIM_PLANE_PROJECTION_TYPE | 858 | DIM_PLANE_PROJECTION_TYPE2 | 859 | DIM_PLANE_PROJECTION_WIDTH | 862 | DIM_PLANE_PROJECTION_WIDTH2 | 863 | DIM_RPT_COLUMN_HDR | 701 | DIM_RPT_DATUM | 703 | DIM_RPT_DEVPERCENT | 705 | DIM_RPT_DEVPERCENT_NOM | 737 | DIM_RPT_DEVPERCENT2 | 739 | DIM_RPT_GRAPHIC | 704 | DIM_RPT_ISBILATERAL | 706 | DIM_RPT_ISDATUM | 702 | DIM_RPT_NUMZONES | 707 | DIM_RPT_TOLERANCECOLOR1 | 917 | DIM_RPT_TOLERANCECOLOR2 | 918 | DIM_RPT_USETWODEVIATIONS | 738 | DIM_TEXT | 177 | DIM_TEXT_OPTIONS | 178 | DIM_TOP | 971 | DISPLAY_ADVANCED_PARAMETERS | 510 | DISPLAY_HITS | 236 | DISPLAY_ID | 184 | DISPLAY_PROBE_PARAMETERS | 607 | DISPLAY_TRACE | 256 | DISPLAY_TRACKER_PARAMETERS | 840 | DISPLAY_TYPE | 185 | DISTANCE | 155 | DRF_COLUMN_HDR | 676 | DRF_ROTATIONX | 681 | DRF_ROTATIONY | 682 | DRF_ROTATIONZ | 683 | DRF_SEGNAME | 677 | DRF_SHIFTX | 678 | DRF_SHIFTY | 679 | DRF_SHIFTZ | 680 | DRF_TBLHDR | 641 | DTYPE_LEAPFROGFULLPARTIAL | 291 | DTYPE_LEAPFROGNUMHITS | 290 | DTYPE_LEAPFROGTYPE | 289 | ECOND_HUMIDITY | 838 | ECOND_PRESSURE | 837 | ECOND_PRESSURE_UNIT | 856 | ECOND_TEMP | 836 | EDGEVEC_MEAS_I | 341 | EDGEVEC_MEAS_J | 342 | EDGEVEC_MEAS_K | 343 | EDGEVEC_TARG_I | 333 | EDGEVEC_TARG_J | 334 | EDGEVEC_TARG_K | 335 | EDGEVEC_THEO_I | 337 | EDGEVEC_THEO_J | 338 | EDGEVEC_THEO_K | 339 | END_ANG | 99 | END_NUM | 144 | ERROR_LABEL | 467 | ERROR_MODE | 202 | ERROR_TYPE | 201 | EVALUATION_LENGTH | 1168 | EVALUATION_LENGTH_UNIT | 1179 | EXCLUSION_ZONE | 292 | EXECUTE | 293 | EXPORT_CAD_DEV | 922 | EXTRUSION | 852 | F_AUTOMOVE | 79 | F_BOXLENGTH | 85 | F_BOXWIDTH | 84 | F_CHECK | 88 | F_CHECKDISTANCE | 1053 | F_CIRCRADIN | 87 | F_CIRCRADOUT | 86 | F_CORNER_RADIUS | 81 | F_DEPTH | 78 | F_END_OFFSET | 787 | F_ENDING_DEPTH | 787 | F_INCREMENT | 82 | F_INDENT | 80 | F_LOCATION | 243 | F_MAXACCELX | 89 | F_MAXACCELY | 90 | F_MAXACCELZ | 91 | F_MINUS_TOL | 168 | F_MOVESPEED | 95 | F_OFFSET | 74 | F_PITCH | 76 | F_PLUS_TOL | 167 | F_PREHIT | 1051 | F_RETRACT | 1052 | F_SCANSPEED | 97 | F_SIZE | 434 | F_SPACER | 75 | F_THICKNESS | 77 | F_THICKNESS_EDGE | 593 | F_TOLERANCE | 83 | F_TOUCHSPEED | 96 | FAIL_ON_EXIST | 208 | FASTPROBEMODE | 908 | FCF_RUNOUT_TYPE | 867 | FCF_STANDARD_TYPE | 945 | FCF_TOL_ZONE_TYPE | 949 | FEAT_ITEM_NUMBER | 789 | FEAT_TYPE | 303 | FIELD_OF_VIEW_OFFSET | 1173 | FIELD_WIDTH | 198 | FILE_COMMAND_TYPE | 206 | FILE_NAME | 152 | FILE_POINTER | 197 | FILTER_ISO13565_LAMBDAC | 1165 | FILTER_ISO4287_LAMBDAC | 1164 | FILTER_LAMBDAF | 1160 | FILTER_LAMBDAS | 1162 | FILTER_LINES_TOGGLE | 857 | FILTER_TYPE | 472 | FILTERSTRING | 1192 | FIND_HOLE_PERCENT | 460 | FIND_NADIR | 1019 | FIND_NOM_AXIS_TYPE | 54 | FIND_NOMS_TYPE | 233 | FINDHOLE_TYPE | 47 | FINDNOMS_BESTFIT | 527 | FINDNOMS_ONLYSELECTED | 528 | FIRST_DIAMETER | 1102 | FIRST_DIAMETER_OFFSET | 1103 | FIT | 452 | FIXTURE_TOL | 465 | FIXTURE_TYPE | 226 | FLY_MODE_TYPE | 246 | FORM_TOLERANCE | 997 | FOUR_AXIS_SCANNING | 1098 | GAGE_SEARCH_ZONE | 1035 | GAGE_TIP_HEIGHT | 1034 | GAGE_TIP_SHAPE | 1032 | GAGE_TIP_WIDTH | 1033 | GAGE_TIP2_HEIGHT | 1059 | GAGE_TIP2_WIDTH | 1058 | GAP_ONLY_TYPE | 183 | GDT_SYMBOL | 708 | GDT_SYMBOL2 | 730 | GEN_ALIGN_TYPE | 64 | GEN_FEAT_TYPE | 63 | GRAPH_ANALYSIS | 162 | GRAPH_ANALYSIS_MINUS_TOL | 785 | GRAPH_ANALYSIS_PLUS_TOL | 784 | GRAPH_ANALYSIS_POINT_SIZE | 783 | GRAPH_OPTION | 458 | GRID | 408 | HIGH_ACCURACY | 483 | HIGH_THRESHOLD | 223 | HISTOGRAM | 407 | HIT_RMS | 839 | HIT_TIMESTAMP | 854 | HIT_TYPE | 359 | HITINT_TYPE | 68 | HORIZONTAL_CLIPPING | 899 | ID | 2 | IGNOREMOTIONERRORS_TYPE | 392 | ILLUM_BULB_INTENSITY_EDGE | 875 | This field holds the illumination intensity for edge features. |
| ILLUM_BULB_INTENSITY_SURFACE | 878 | This field holds the illumination intensity for surface features. |
| ILLUM_CALOVERRIDE_TOGGLE_EDGE | 876 | ILLUM_CALOVERRIDE_TOGGLE_SURFACE | 879 | ILLUM_OFFON_TOGGLE_EDGE | 874 | ILLUM_OFFON_TOGGLE_SURFACE | 877 | INCIDENCE_ANGLE | 1039 | INDEX_END | 205 | INDEX_START | 204 | INIT_HITS | 72 | INLINE_LEGACY_REPORT | 848 | INNER_SPACER | 850 | INOUT_TYPE | 40 | INTERNAL_EXTERNAL | 150 | IOCHANNEL_NUMBER | 454 | IOCHANNEL_PULSE_DURATION | 457 | IOCHANNEL_PULSE_INTERVAL | 456 | IOCHANNEL_PULSE_WIDTH | 455 | ISLAND_AI | 634 | ISLAND_AJ | 635 | ISLAND_AK | 636 | ISLAND_CLEARANCEDIST | 638 | ISLAND_DIAM | 625 | ISLAND_I | 631 | ISLAND_J | 632 | ISLAND_K | 633 | ISLAND_LENGTH | 626 | ISLAND_TYPE | 637 | ISLAND_WIDTH | 627 | ISLAND_X | 628 | ISLAND_Y | 629 | ISLAND_Z | 630 | ITEM_USED | 138 | ITERATE_COLUMNS | 354 | JUMP_HOLE | 1013 | JUMP_HOLE_FLAG | 1012 | LABEL_ID | 200 | LAMBDAC | 1163 | LAMBDAC_UNIT | 1183 | LAMBDAF | 1159 | LAMBDAF_UNIT | 1181 | LAMBDAS | 1161 | LAMBDAS_UNIT | 1182 | LASER_CLIP_LEFT_DIST | 614 | LASER_CLIP_LOW_DIST | 604 | LASER_CLIP_RIGHT_DIST | 615 | LASER_CLIP_UP_DIST | 603 | LASER_EXPOSURE | 595 | LASER_FILTER_NEIGHBOR_NUM | 598 | LASER_FILTER_TOGGLE | 606 | LASER_FILTER_TOL_ABOVE | 600 | LASER_FILTER_TOL_BELOW | 601 | LASER_FILTER_TOL_RIGHT | 602 | LASER_FREQUENCY | 560 | LASER_INTENSITY | 596 | LASER_PIXEL_TOGGLE | 605 | LASER_STRIPE_OVERLAP | 558 | LASER_STRIPE_OVERSCAN | 559 | LEADER_LINE_ID | 729 | LEFTYRIGHTY_CONFIG | 480 | LEVEL_REF_ID | 4 | LIN_POL_FILT_TYPE | 62 | LINE1_BONUS | 782 | LINE1_CALLOUT | 643 | LINE1_COLUMN_HDR | 644 | LINE1_DEV | 650 | LINE1_DEVPERCENT | 651 | LINE1_DEVPERCENT_NOM | 750 | LINE1_DEVPERCENT2 | 752 | LINE1_FEATNAME | 645 | LINE1_ISBILATERAL | 652 | LINE1_MAX | 768 | LINE1_MEAS | 647 | LINE1_MIN | 769 | LINE1_MINUSTOL | 649 | LINE1_NOMINAL | 646 | LINE1_NUMZONES | 653 | LINE1_OUTTOL | 765 | LINE1_PLUSTOL | 648 | LINE1_TBLHDR | 642 | LINE1_USE2DEVIATIONS | 751 | LINE2_AXIS | 686 | LINE2_BONUS | 658 | LINE2_CALLOUT | 655 | LINE2_COLUMN_HDR | 656 | LINE2_DATUMA_DOF | 901 | LINE2_DATUMB_DOF | 902 | LINE2_DATUMC_DOF | 903 | LINE2_DATUMSHFT | 660 | LINE2_DEV | 662 | LINE2_DEVANG | 663 | LINE2_DEVPERCENT | 664 | LINE2_DEVPERCENT_NOM | 740 | LINE2_DEVPERCENT2 | 742 | LINE2_FEATNAME | 657 | LINE2_FEATNAME_PROFILE | 910 | LINE2_ISBILATERAL | 697 | LINE2_ISPLANAR | 435 | LINE2_MAX | 695 | LINE2_MEAS | 688 | LINE2_MIN | 696 | LINE2_MINUSTOL | 694 | LINE2_NOMINAL | 687 | LINE2_NUMZONES | 698 | LINE2_OUTTOL | 766 | LINE2_PLANAR_OPEN_IN_X | 410 | LINE2_PLANAR_XDEV | 438 | LINE2_PLANAR_XTOL | 436 | LINE2_PLANAR_YDEV | 439 | LINE2_PLANAR_YTOL | 437 | LINE2_PLUSTOL | 693 | LINE2_TBLHDR | 654 | LINE2_TOL | 659 | LINE2_UNUSEDZONE | 661 | LINE2_USE2DEVIATIONS | 741 | LINE3_BONUS | 669 | LINE3_CALLOUT | 666 | LINE3_COLUMN_HDR | 667 | LINE3_DATUMA_DOF | 904 | LINE3_DATUMB_DOF | 905 | LINE3_DATUMC_DOF | 906 | LINE3_DATUMSHFT | 671 | LINE3_DEV | 673 | LINE3_DEVANG | 674 | LINE3_DEVPERCENT | 675 | LINE3_DEVPERCENT_NOM | 743 | LINE3_DEVPERCENT2 | 745 | LINE3_FEATNAME | 668 | LINE3_ISBILATERAL | 699 | LINE3_ISPLANAR | 440 | LINE3_MAX | 774 | LINE3_MEAS | 771 | LINE3_MIN | 775 | LINE3_MINUSTOL | 773 | LINE3_NOMINAL | 770 | LINE3_NUMZONES | 700 | LINE3_OUTTOL | 767 | LINE3_PLANAR_OPEN_IN_X | 411 | LINE3_PLANAR_XDEV | 443 | LINE3_PLANAR_XTOL | 441 | LINE3_PLANAR_YDEV | 444 | LINE3_PLANAR_YTOL | 442 | LINE3_PLUSTOL | 772 | LINE3_TBLHDR | 665 | LINE3_TOL | 670 | LINE3_UNUSEDZONE | 672 | LINE3_USE2DEVIATIONS | 744 | LOAD_TYPE | 355 | LOCAL_SIZE_OPTION | 1122 | LOCATION_TOLERANCE | 1004 | LOCATOR_BMP | 287 | LOCATOR_WAV | 288 | LOW_FORCE | 210 | LOW_THRESHOLD | 224 | LOWER_BOUNDARY | 1130 | LOWER_MODIFIER | 1046 | LOWER_SIZE | 1050 | LOWER_TOLERANCE | 1044 | MACHINE_TYPE | 227 | MAGNIFICATION | 485 | MAN_RETRACT | 176 | MANUAL_FINE_PROBING | 94 | MANUAL_PREPOSITION | 534 | MATERIAL_COEFFICIENT | 221 | MAX_ANGLE | 242 | MAX_FORCE | 209 | MAX_INCREMENT | 240 | MAX_THICKNESS | 1127 | MEAN | 491 | MEAS_A | 569 | MEAS_A2 | 612 | MEAS_ANGLE | 30 | MEAS_AREA | 721 | MEAS_DEPTH | 556 | MEAS_DIAM | 29 | MEAS_EA | 584 | MEAS_EH | 585 | MEAS_EI | 936 | MEAS_EJ | 937 | MEAS_EK | 938 | MEAS_END_ANG | 624 | MEAS_ER | 583 | MEAS_EX | 313 | MEAS_EY | 314 | MEAS_EZ | 315 | MEAS_FLUSH | 552 | MEAS_GAP | 554 | MEAS_H | 570 | MEAS_H2 | 613 | MEAS_HEIGHT | 306 | MEAS_I | 25 | MEAS_J | 26 | MEAS_K | 27 | MEAS_LENGTH | 28 | MEAS_MINOR_AXIS | 305 | MEAS_MINOR_DIAMETER | 921 | MEAS_PERIMETER | 719 | MEAS_R | 568 | MEAS_R2 | 611 | MEAS_RADIUS | 978 | MEAS_SA | 581 | MEAS_SH | 582 | MEAS_SI | 933 | MEAS_SJ | 934 | MEAS_SK | 935 | MEAS_SLOTVEC_I | 307 | MEAS_SLOTVEC_J | 308 | MEAS_SLOTVEC_K | 309 | MEAS_SR | 580 | MEAS_START_ANG | 623 | MEAS_SX | 310 | MEAS_SY | 311 | MEAS_SZ | 312 | MEAS_WIDTH | 316 | MEAS_X | 22 | MEAS_X2 | 396 | MEAS_Y | 23 | MEAS_Y2 | 397 | MEAS_Z | 24 | MEAS_Z2 | 398 | MEASURE_ALL_FEATURES | 141 | MEASURE_ORDER_TYPE | 59 | MEASURED_2D3D_TYPE | 66 | MEASUREMENT_STRATEGY | 919 | MEASURMENT_STRATEGY | 919 | MEASVEC_I | 106 | MEASVEC_J | 107 | MEASVEC_K | 108 | MERGE | 1061 | MESH_COP_TYPE | 979 | MESH_HOLE_OPTION_TYPE | 983 | MESH_MAXLENGTHTRIANGLETOFILLHOLE | 987 | MESH_NOISE_REDUCTION_TYPE | 980 | MESH_REFINE_DEVIATIONERROR | 982 | MESH_REFINE_MESH | 991 | MESH_REFINE_MINTRIANGLESIZE | 990 | MESH_TRIANGLES_NUM | 988 | MESH_VERTICES_NUM | 989 | METHOD_TYPE | 357 | MIDPOINT_X | 100 | MIDPOINT_Y | 101 | MIDPOINT_Z | 102 | MIN_ANGLE | 241 | MIN_INCREMENT | 239 | MINIMUMAVERAGEDISTANCE | 981 | MINOR_WORD_TOGGLE | 486 | MODE_TYPE | 58 | MODIFIER_LIST | 1040 | MOVE_TYPE | 45 | MULTIFRAME_FILTER_LOWER_LIMIT | 1176 | MULTIFRAME_FILTER_UPPER_LIMIT | 1175 | N_CONTROLPOINTS | 429 | N_HITS | 70 | N_INIT_HITS_TYPE | 55 | N_PERM_HITS_TYPE | 56 | N_POINTS | 1080 | N_RINGS | 1101 | N_ROWS | 71 | N_SIDES | 489 | NEW_STATS_DIR | 249 | NEW_TIP | 157 | NO_APPROACH_VECTOR_FLIP | 826 | NOFLIPFLIP_CONFIG | 482 | NOISE_REDUCTION_PARAMETER | 1177 | NOMINAL | 166 | NOMINAL_COLOR | 321 | NORM_RELEARN | 232 | NSIGMA_FILTER | 909 | NUM_CONTROL_POINTS | 317 | NUM_FIT_POINTS | 320 | NUM_ITERATIONS | 356 | NUM_RETURN_DATA | 215 | NUMBER_OF_SECTIONS | 1166 | NUMSECTIONNAME | 1193 | OFFSET_LINE_METHOD | 61 | OFFSET_TOLERANCE | 238 | OFFSET_TYPE | 1030 | OLD_TIP | 156 | ONOFF_TYPE | 285 | OPERATOR_NORM_MATH_TYPE | 1037 | OPERTYPE | 620 | ORIENTATION_ORIGIN_TOGGLE | 976 | ORIGIN | 220 | ORIGIN_REF_ID | 6 | OUTER_SPACER | 851 | OUTLIER | 1009 | OUTPUT_DMIS_REPORT | 449 | OUTPUT_FEAT_W_DIMENS | 448 | OUTPUT_FEATURE_NOMS | 447 | OUTPUT_TO_REPORT | 970 | OUTPUT_TYPE | 165 | OVERRIDE | 999 | OVERWRITE | 446 | PART_NAME | 191 | PATH_TYPE | 1020 | PATTERN_TYPE | 519 | PAUSE_EXECUTION | 947 | PERCENTAGE | 487 | PERIMETER_BOUNDARY_TYPE | 1011 | PERM_HITS | 73 | PERP_PARALLEL_TYPE | 170 | PERUNIT_LENGTH | 326 | PERUNIT_STEPSIZE | 325 | PERUNIT_WIDTH | 327 | PINVEC_I | 115 | PINVEC_J | 116 | PINVEC_K | 117 | PLAN_CREATE_TIME | 992 | PLANE_CONSTRAINT_TYPE | 1036 | POINT_DISTANCE | 1169 | POINT_DISTANCE_UNIT | 1180 | POINT_INFO_HEADING | 186 | POINTDISTANCENAME | 1195 | POINTINFO_FEATURE_OR_DIMENSION_SYMBOL | 1117 | POINTINFO_FEATURE_OR_DIMENSION_TYPE | 1118 | POINTINFO_FILTER_DEVIATION | 380 | POINTINFO_FILTER_DEVIATION_NUMBER | 381 | POINTINFO_FILTER_INTERVAL | 301 | POINTINFO_FILTER_INTERVAL_NUMBER | 302 | POINTINFO_FILTER_MINMAX | 1022 | POINTINFO_FILTER_OUTTOL | 382 | POINTINFO_FILTER_WORST | 378 | POINTINFO_FILTER_WORST_NUMBER | 379 | POINTINFO_HITNUMBER | 1119 | POLAR_VECTOR_COMPENSATION | 218 | POLYNOMIAL_DEGREE | 1158 | POLYNOMIALDEGREENAME | 1194 | POS_REPORT_AXIS_X | 277 | POS_REPORT_AXIS_Y | 278 | POS_REPORT_AXIS_Z | 279 | POS_REPT_DISPLAY_OPTION | 462 | POSITION_SEGMENT | 994 | POSITIONAL_ACCURACY | 214 | POSTTRAVELDISTANCE | 1189 | POSTTRAVELNAME | 1190 | POSTTRAVELUNIT | 1191 | PPROG | 399 | PRE_PROBE_CYLINDER | 1016 | PRECISION | 175 | PREHIT_RETRACT | 1014 | PRETRAVELDISTANCE | 1186 | PRETRAVELNAME | 1187 | PRETRAVELUNIT | 1188 | PRIMARY_DROP | 1088 | PRINT_DELETE_RUNS | 377 | PRINT_DRAFTMODE | 376 | PRINT_TO_FILE | 374 | PRINT_TO_PRINTER | 375 | PROBE_ACCURACY | 213 | PROBE_COMP | 228 | PROBE_DIRECTION | 793 | PROBE_TYPE | 834 | PROBING_MODE | 299 | PROBING_PERIOD | 1015 | PROFILE_BOTTOM_CURVE | 1087 | PROFILE_FORM_TYPE | 174 | PROFILE_TOP_CURVE | 1086 | PROFILE_TYPE | 550 | PROGRAM_GAGE_FEAT_TYPE | 521 | PROGRAM_GAGE_TYPE | 522 | PROJECT_POINT | 948 | PROJECTOR | 847 | PTDENSITY_DEVLIMIT | 843 | PTDENSITY_MAXSPAN | 844 | PTDENSITY_TOGGLE | 841 | PTDENSITY_UPPERBOUND | 842 | PUNCHVEC_I | 118 | PUNCHVEC_J | 119 | PUNCHVEC_K | 120 | QDAS_CATALOG_FILENAME | 1075 | QDAS_CONFIGURATION_FILENAME | 1074 | QDAS_OUTPUT_FILE_TYPE | 1073 | QUALITY_THRESHOLD | 1156 | QUERY_SHOW_GRAPHIC_SETTINGS | 470 | RADIUS_TYPE | 171 | RANGE | 1048 | READ_FILE_PRIOR_EXEC | 1108 | READ_WRITE | 196 | READPOS_TYPE | 46 | REDUCTION_FILTER | 864 | REDUCTION_FILTER_PERCENTAGE | 913 | REF_ID | 3 | REF_TEMP | 222 | REF_UID | 798 | REFRACTIVE_INDEX | 1081 | REGR | 412 | RELATIVE_COMMENTS | 830 | REPIERCE_CAD | 142 | REPORT_DIMENSION | 1185 | REPORT_GRAPH_ANALYSIS | 1064 | REPORT_LABEL_AXIS | 1131 | REPORT_LABEL_BONUS | 1137 | REPORT_LABEL_DEV | 1136 | REPORT_LABEL_ISPLANAR | 1139 | REPORT_LABEL_MEAS | 1133 | REPORT_LABEL_MINUSTOL | 1135 | REPORT_LABEL_NOMINAL | 1132 | REPORT_LABEL_OUTTOL | 1138 | REPORT_LABEL_PLANAR_OPEN_IN_X | 1144 | REPORT_LABEL_PLANAR_XDEV | 1142 | REPORT_LABEL_PLANAR_XTOL | 1140 | REPORT_LABEL_PLANAR_YDEV | 1143 | REPORT_LABEL_PLANAR_YTOL | 1141 | REPORT_LABEL_PLUSTOL | 1134 | REPORT_MODE | 323 | REPORT_PLOT | 1171 | REPORT_SURFVEC_I | 383 | REPORT_SURFVEC_J | 384 | REPORT_SURFVEC_K | 385 | REPORTVEC_I | 121 | REPORTVEC_J | 122 | REPORTVEC_K | 123 | RET_ONLY_TYPE | 188 | RETURN_SPEED | 216 | REVISION_NUMBER | 192 | RGH_BITMAP_LOCATION | 1184 | RMEAS_TYPE | 48 | RMEASFEATID | 69 | RMEASFEATIDX | 524 | RMEASFEATIDY | 525 | RMEASFEATIDZ | 526 | ROTAB_MOVE_SIMULTANEOUS | 1123 | ROTATE_REF_ID | 5 | ROTATION_TYPE | 158 | ROTATION_TYPE_2 | 833 | ROW_ID | 286 | RPT_DIMENSION_TABLES | 639 | SAMPLE_FEATURE | 950 | SAMPLE_HIT_MEAS_A | 965 | Sample hit measured A value.This is meaningful only in Cartesian mode. |
| SAMPLE_HIT_MEAS_H | 966 | Sample hit measured H value.This is meaningful only in Cartesian mode. |
| SAMPLE_HIT_MEAS_R | 964 | Sample hit measured R value.This is meaningful only in Cartesian mode. |
| SAMPLE_HIT_MEAS_X | 961 | Sample hit measured X value.This is meaningful only in Cartesian mode. |
| SAMPLE_HIT_MEAS_Y | 962 | Sample hit measured Y value.This is meaningful only in Cartesian mode. |
| SAMPLE_HIT_MEAS_Z | 963 | Sample hit measured Z value.This is meaningful only in Cartesian mode. |
| SAMPLE_HIT_THEO_A | 956 | Sample hit theoretical A value.This is meaningful only in Polar mode. |
| SAMPLE_HIT_THEO_H | 957 | Sample hit theoretical H value.This is meaningful only in Polar mode. |
| SAMPLE_HIT_THEO_I | 958 | Sample hit theoretical I value. |
| SAMPLE_HIT_THEO_J | 959 | Sample hit theoretical J value. |
| SAMPLE_HIT_THEO_K | 960 | Sample hit theoretical K value. |
| SAMPLE_HIT_THEO_R | 955 | Sample hit theoretical R value.This is meaningful only in Polar mode. |
| SAMPLE_HIT_THEO_X | 952 | Sample hit theoretical X value.This is meaningful only in Cartesian mode. |
| SAMPLE_HIT_THEO_Y | 953 | Sample hit theoretical Y value.This is meaningful only in Cartesian mode. |
| SAMPLE_HIT_THEO_Z | 954 | Sample hit theoretical Z value.This is meaningful only in Cartesian mode. |
| SAMPLE_HIT_TYPE | 969 | SAMPLE_METHOD | 951 | SAVE_ALIGN_CAD_TO_PARTS | 151 | SCALING | 795 | SCAN_4AXIS | 1060 | SCAN_ACCELERATION | 92 | SCAN_AXISVEC_I | 265 | SCAN_AXISVEC_J | 266 | SCAN_AXISVEC_K | 267 | SCAN_BNDRY_TYPE | 432 | SCAN_COMPENSATION | 1008 | SCAN_CROSS_TOTAL | 274 | SCAN_CURVE_TYPE | 1105 | SCAN_CUTPLANEVEC_I | 259 | SCAN_CUTPLANEVEC_J | 260 | SCAN_CUTPLANEVEC_K | 261 | SCAN_DENSITY | 217 | SCAN_EDGE_THICK | 276 | SCAN_ENDVEC_I | 268 | SCAN_ENDVEC_J | 269 | SCAN_ENDVEC_K | 270 | SCAN_EXECUTION_MODE | 1079 | SCAN_INITDIR_I | 271 | SCAN_INITDIR_J | 272 | SCAN_INITDIR_K | 273 | SCAN_INITVEC_I | 262 | SCAN_INITVEC_J | 263 | SCAN_INITVEC_K | 264 | SCAN_MODE | 855 | SCAN_OFFSET_FORCE | 93 | SCAN_PATH_DENSITY | 1099 | SCAN_SHAPE_TEACH_TYPE | 1107 | SCAN_TECHNIQUE | 358 | SCAN_TIME_INCR | 275 | SCAN_TYPE | 1005 | SCONDARY_DROP | 1089 | SCREEN_CAPTURE_AUTO_TIME | 540 | SCREEN_CAPTURE_AUTO_TYPE | 536 | SCREEN_CAPTURE_QUALITY | 503 | SCREEN_CAPTURE_SCALE | 502 | SCREEN_CAPTURE_TYPE | 535 | SEARCHMODE_TYPE | 57 | SECTION_INDEX | 764 | SEGMENT_TOGGLE | 1065 | SEGMENT_TYPE | 1066 | SEGMENT_TYPE_TOGGLE | 1067 | SELECT_BY_TOTAL_HITS | 1026 | SELECT_CENTER | 1100 | SELECT_EVERY_NPOINTS | 1027 | SELECT_FIRST_POINT | 1024 | SELECT_LAST_POINT | 1025 | SELECT_TOTAL_NHITS | 1028 | SELF_CENTER_CUT_VECTOR_I | 1055 | SELF_CENTER_CUT_VECTOR_J | 1056 | SELF_CENTER_CUT_VECTOR_K | 1057 | SELF_CENTER_POINT | 1054 | SENSITIVITY_MODE | 865 | SENSOR_LIST | 225 | SERIAL_NUMBER | 193 | SHIFT_BONUS | 915 | SHIFT_BONUS2 | 916 | SHOW_COLUMN | 494 | SHOW_DETAILS | 136 | SHOW_HEADINGS | 179 | SHOW_IDS | 135 | SHOW_MORE_SPC_CALCS | 414 | SHOW_NOMS | 723 | SHOW_OPTIONS | 728 | SHOW_POINT_INFO | 187 | SHOW_ROW | 493 | SHOW_SPC_CALCS | 402 | SIMUL_NUMBER_POSITION_FCFS | 912 | SIMUL_NUMBER_PROFILE_FCFS | 911 | SIMULT_EVAL | 763 | SINGLE_POINT | 235 | SINGLE_POINT_DEVIATION | 849 | SIZE_NOMINAL | 1068 | SIZE_SYMBOL | 866 | SIZE_TOLERANCE | 1002 | SKIP_NUM | 145 | SKIP_RINGS | 1104 | SLOT_MIN_MAX_TYPE | 53 | SLOT_NUMBER | 297 | SLOT_TYPE | 563 | SLOTVEC_I | 109 | SLOTVEC_J | 110 | SLOTVEC_K | 111 | SMOOTHING_CORNER_RADIUS | 1106 | SMOOTHING_FACTOR | 993 | SMOOTHING_TOLERANCE | 1021 | SNAP_TYPE | 43 | SOLID | 416 | SPEC_LIMITS | 403 | SPEC_OFFSET | 415 | SPECIFICATION_STRING | 1041 | SPHERE_CENTER_X | 1109 | SPHERE_CENTER_Y | 1110 | SPHERE_CENTER_Z | 1111 | SRC_EXPR | 134 | STANDARD | 1042 | STANDARD_DEVIATION | 181 | START_ANG | 98 | START_LABEL | 466 | START_NUM | 143 | STAT_CALC_TYPE | 254 | STAT_COUNT | 194 | STAT_NAME_TYPE | 253 | STATS_DATASOURCE | 391 | STATS_DB_TYPE | 453 | STATS_DIR | 248 | STATS_TYPE | 247 | STDDEV | 405 | STRIPE_DISTANCE | 1076 | SUB_NAME | 195 | SUMMARY_AXIS | 690 | SUMMARY_BONUS | 781 | SUMMARY_COLUMN_HDR | 684 | SUMMARY_DEV | 640 | SUMMARY_FEAT | 685 | SUMMARY_MAX | 779 | SUMMARY_MEAS | 692 | SUMMARY_MIN | 780 | SUMMARY_MINUSTOL | 778 | SUMMARY_NOMINAL | 691 | SUMMARY_OUTTOL | 776 | SUMMARY_PLUSTOL | 777 | SUMMARY_TBLHDR | 689 | SURFACE | 484 | SURFACE_INTERPERTATION_IF_POSSIBLE | 996 | SURFACE_TYPE | 998 | SURFVEC_I | 112 | SURFVEC_J | 113 | SURFVEC_K | 114 | SURFVEC_MEAS_I | 546 | SURFVEC_MEAS_J | 547 | SURFVEC_MEAS_K | 548 | SURFVEC_TARG_I | 329 | SURFVEC_TARG_J | 330 | SURFVEC_TARG_K | 331 | T_VALUE | 345 | TARG_A | 572 | TARG_EA | 590 | TARG_EH | 591 | TARG_EI | 942 | TARG_EJ | 943 | TARG_EK | 944 | TARG_ER | 589 | TARG_EX | 516 | TARG_EY | 517 | TARG_EZ | 518 | TARG_H | 573 | TARG_I | 31 | TARG_J | 32 | TARG_K | 33 | TARG_R | 571 | TARG_SA | 587 | TARG_SH | 588 | TARG_SI | 939 | TARG_SJ | 940 | TARG_SK | 941 | TARG_SR | 586 | TARG_SX | 513 | TARG_SY | 514 | TARG_SZ | 515 | TARG_X | 19 | TARG_Y | 20 | TARG_Z | 21 | TARGET_BLOB_TYPE | 557 | TARGET_COLOR | 282 | TARGET_COVERAGE | 832 | TARGET_COVERAGE_ACTIVE_TARGETS | 923 | TARGET_DIRECTION | 474 | TARGET_EDGE_ANGLE | 520 | TARGET_EDGE_CROSSHAIR_CENTER | 853 | TARGET_EDGE_DARKLIGHT | 975 | TARGET_EDGE_DENSITY | 508 | TARGET_EDGE_EDGEDETECT | 712 | TARGET_EDGE_EDGENUM | 538 | TARGET_EDGE_EDGESELECT | 537 | TARGET_EDGE_END_VALUE | 828 | TARGET_EDGE_FILTER_AREA | 715 | TARGET_EDGE_FILTER_AREA_SIZE | 716 | TARGET_EDGE_FILTER_CLEAN | 713 | TARGET_EDGE_FILTER_CLEAN_STRENGTH | 714 | TARGET_EDGE_GRADIENT | 717 | TARGET_EDGE_GREYSCALE_THRESHHOLD | 974 | TARGET_EDGE_HEIGHT | 711 | TARGET_EDGE_ILLUM | 505 | TARGET_EDGE_IMAGE_RGB_MIXING_B | 870 | TARGET_EDGE_IMAGE_RGB_MIXING_G | 869 | TARGET_EDGE_IMAGE_RGB_MIXING_R | 868 | TARGET_EDGE_MIN_AREA | 973 | TARGET_EDGE_MIN_MAX_TYPE | 884 | TARGET_EDGE_MIN_MAX_TYPE_TOGGLE | 885 | TARGET_EDGE_MIN_MAX_WIDTH | 883 | TARGET_EDGE_POLARITY | 475 | TARGET_EDGE_SENSILIGHT | 592 | TARGET_EDGE_SIZE | 504 | TARGET_EDGE_START_VALUE | 827 | TARGET_EDGE_STRENGTH | 507 | TARGET_EDGE_TOL | 506 | TARGET_EDGE_TYPE | 509 | TARGET_EDGE_UNDERSCAN | 549 | TARGET_EDGE_WIDTH | 710 | TARGET_FILTER_AREA | 715 | TARGET_FILTER_AREA_SIZE | 716 | TARGET_FILTER_CLEAN | 713 | TARGET_FILTER_CLEAN_STRENGTH | 714 | TARGET_FILTER_OUTLIER | 561 | TARGET_FILTER_OUTLIER_DISTANCE_MULTIPLIER | 986 | TARGET_FILTER_OUTLIER_DISTANCE_THRESHOLD | 562 | TARGET_FILTER_OUTLIER_MIN_NEIGHBORS | 985 | TARGET_FILTER_OUTLIER_STD_DEV_THRESHOLD | 599 | TARGET_FILTER_OUTLIER_USING_NEIGHBORS | 984 | TARGET_FOCUS | 523 | TARGET_MEASURE_AT_FOV_CENTER | 845 | TARGET_SURFACE_CROSSHAIR_HEIGHT | 722 | TARGET_SURFACE_DURATION | 499 | TARGET_SURFACE_FIND_SURFACE | 846 | TARGET_SURFACE_HEIGHT | 497 | TARGET_SURFACE_HIACC | 501 | TARGET_SURFACE_ILLUM | 490 | TARGET_SURFACE_IMAGE_RGB_MIXING_B | 870 | TARGET_SURFACE_IMAGE_RGB_MIXING_G | 869 | TARGET_SURFACE_IMAGE_RGB_MIXING_R | 868 | TARGET_SURFACE_MODE | 500 | TARGET_SURFACE_RANGE | 498 | TARGET_SURFACE_SENSILIGHT | 495 | TARGET_SURFACE_SURFACE_VARIANCE | 829 | TARGET_SURFACE_TYPE | 511 | TARGET_SURFACE_WIDTH | 496 | TARGET_TYPE | 564 | TARGSLOT_I | 124 | TARGSLOT_J | 125 | TARGSLOT_K | 126 | TEMPLATE_MATCH | 1091 | TEMPLATE_MATCH_CORRELATION | 1092 | TEMPP | 532 | TEMPX | 529 | TEMPY | 530 | TEMPZ | 531 | TEXT_ANALYSIS | 163 | TEXTANAL_LABEL_DEV | 761 | TEXTANAL_LABEL_MEAS_I | 758 | TEXTANAL_LABEL_MEAS_J | 759 | TEXTANAL_LABEL_MEAS_K | 760 | TEXTANAL_LABEL_MEAS_X | 755 | TEXTANAL_LABEL_MEAS_Y | 756 | TEXTANAL_LABEL_MEAS_Z | 757 | TEXTANAL_LABEL_MINMAX | 762 | THEO_A | 566 | THEO_A2 | 609 | THEO_ANGLE | 38 | THEO_AREA | 720 | THEO_DEPTH | 555 | THEO_DIAM | 34 | THEO_DX | 1083 | THEO_DY | 1084 | THEO_DZ | 1085 | THEO_EA | 578 | THEO_EH | 579 | THEO_EI | 930 | THEO_EJ | 931 | THEO_EK | 932 | THEO_END_ANG | 284 | THEO_ER | 577 | THEO_EX | 13 | THEO_EY | 14 | THEO_EZ | 15 | THEO_FLUSH | 551 | THEO_GAP | 553 | THEO_H | 567 | THEO_H2 | 610 | THEO_HEIGHT | 37 | THEO_I | 16 | THEO_J | 17 | THEO_K | 18 | THEO_LENGTH | 36 | THEO_MINOR_AXIS | 130 | THEO_MINOR_DIAMETER | 920 | THEO_PERIMETER | 718 | THEO_R | 565 | THEO_R2 | 608 | THEO_RADIUS | 977 | THEO_SA | 575 | THEO_SH | 576 | THEO_SI | 927 | THEO_SJ | 928 | THEO_SK | 929 | THEO_SR | 574 | THEO_START_ANG | 283 | THEO_SX | 10 | THEO_SY | 11 | THEO_SZ | 12 | THEO_WIDTH | 35 | THEO_X | 7 | THEO_X2 | 393 | THEO_Y | 8 | THEO_Y2 | 394 | THEO_Z | 9 | THEO_Z2 | 395 | THEOBF_TYPE | 49 | THICKNESS_DROP | 1090 | THICKNESS_GAGE_DISTANCE | 1096 | THICKNESS_GAGE_PRIMARY_FEATURE | 1094 | THICKNESS_GAGE_SECONDARY_FEATURE | 1095 | THICKNESS_GAGE_SHOW_POI | 1097 | THICKNESS_TYPE | 41 | THICKNESS_TYPE_EDGE | 594 | THINNING_TOL | 67 | THREADED_HOLE | 1017 | THRESHOLD | 488 | TIME_ARG | 450 | TIME_FILTER | 401 | TIME_STAMP | 835 | TIP_I | 229 | TIP_J | 230 | TIP_K | 231 | TITLE | 418 | TOLERANCE_CODE | 1047 | TOLERANCE_ZONE_DIRECTION | 995 | TOOL_DIAM | 349 | TOOL_X | 346 | TOOL_Y | 347 | TOOL_Z | 348 | TP_MODIFIER | 169 | TP_MODIFIER2 | 726 | TPS_SUB_COMMAND_TYPE | 887 | TRACE_DATA_SOURCE | 1077 | TRACE_DISPLAY_MESSAGE | 1072 | TRACE_DISPLAY_ONREPORT | 1093 | TRACE_FILTER | 400 | TRACE_FILTER_ARG | 451 | TRACE_NAME | 257 | TRACE_VALUE | 258 | TRACE_VALUE_LIMIT | 473 | TRACE_VALUE_OPTION | 1078 | TRACKER_GRAVITY_PLANE | 882 | TRACKER_SUB_COMMAND_TYPE | 881 | TRANSFER_DIR | 255 | TRANSLATION_MODIFIER | 1125 | TRAVERSE_LENGTH | 1167 | TRAVERSE_LENGTH_UNIT | 1178 | TRIGGER_FORCE | 212 | TRIGGERPLANE | 469 | TRIGGERTOLERANCE | 463 | TRIGGERTOLVALUE | 464 | TWO_D_THREE_D_TYPE | 131 | U_HITS | 318 | U_L_BOUNDS | 417 | UCL_LCL | 406 | UID | 797 | UNEQUAL_TOL_LINE2 | 890 | UNEQUAL_TOL_LINE3 | 891 | UNEQUAL_TOL_ZONE_LINE2 | 888 | UNEQUAL_TOL_ZONE_LINE3 | 889 | UNIT_AREA_LINE3 | 898 | UNIT_TYPE | 172 | UP_FORCE | 211 | UPDATEVEC_I | 127 | UPDATEVEC_J | 128 | UPDATEVEC_K | 129 | UPPER_BOUNDARY | 1129 | UPPER_MODIFIER | 1045 | UPPER_SIZE | 1049 | UPPER_TOLERANCE | 1043 | UPR | 1006 | USE_3DFILTER | 431 | USE_AXIS | 139 | USE_AXIS2 | 753 | USE_BOUNDARY_OFFSET | 968 | Enables or disables using the boundary offset as a minimum distance from the boundary(the edge) where the hits are automatically placed during a Void Detection. If setto NO, the tip's radius value is the minimum distance. |
| USE_CAD_PLANAR_SEGREGATION | 924 | USE_EXTENDED_FIELD_OF_VIEW | 1172 | USE_FORM | 1196 | USE_HSSDAT | 541 | USE_INCIDENCE_ANGLE | 1038 | USE_LOCATION | 1003 | USE_MIN_MAX_FIT | 1029 | USE_MULTIFRAME_FILTER | 1174 | USE_SCALING | 796 | USE_SCAN_FILTER | 1018 | USE_SIZE | 1001 | USE_STARTENDDELAY | 542 | USE_THEO | 281 | USE_THEOS | 1062 | USEPIN_TYPE | 44 | USER_DEFINED_HITS | 1071 | USER_DEFINED_THEOS | 794 | USES_SPECIFIED_TOLERANCE_ZONE_DIRECTION | 1128 | V_HITS | 319 | VERTICAL_CLIPPING | 900 | VIDEO_GAIN | 363 | VIDEO_LASERLIGHT1 | 366 | VIDEO_LASERLIGHT2 | 367 | VIDEO_LEDLIGHT | 365 | VIDEO_LSEG | 370 | VIDEO_OFFSET | 364 | VIDEO_XSEG | 371 | VIDEO_YEND | 369 | VIDEO_YORIGIN | 368 | VIDEO_YSEG | 372 | VOID_DETECT | 512 | WAVE_FILE | 322 | WAVELENGTH | 1000 | WAVELENGTHPLANE | 1113 | WEIGHT | 137 | WORK_PLANE | 154 | X_OFFSET | 146 | Y_OFFSET | 147 | Z_OFFSET | 148 | ZONES | 404

---

## ENUM_FILE_IO_TYPES

# ENUM_FILE_IO_TYPES Enumeration

# Members

Member Value Description PCD_FILE_CLOSE 1 PCD_FILE_COPY 11 PCD_FILE_DELETE 13 PCD_FILE_DIALOG 15 PCD_FILE_EXISTS 14 PCD_FILE_MOVE 12 PCD_FILE_OPEN 0 PCD_FILE_READBLOCK 7 PCD_FILE_READCHARACTER 5 PCD_FILE_READLINE 3 PCD_FILE_READUPTO 16 PCD_FILE_RECALLPOSITION 10 PCD_FILE_REWIND 8 PCD_FILE_SAVEPOSITION 9 PCD_FILE_WRITEBLOCK 6 PCD_FILE_WRITECHARACTER 4 PCD_FILE_WRITELINE 2

| ENUM_FILE_IO_TYPES Enumeration |

| Member | Value | Description |
| --- | PCD_FILE_CLOSE | 1 | PCD_FILE_COPY | 11 | PCD_FILE_DELETE | 13 | PCD_FILE_DIALOG | 15 | PCD_FILE_EXISTS | 14 | PCD_FILE_MOVE | 12 | PCD_FILE_OPEN | 0 | PCD_FILE_READBLOCK | 7 | PCD_FILE_READCHARACTER | 5 | PCD_FILE_READLINE | 3 | PCD_FILE_READUPTO | 16 | PCD_FILE_RECALLPOSITION | 10 | PCD_FILE_REWIND | 8 | PCD_FILE_SAVEPOSITION | 9 | PCD_FILE_WRITEBLOCK | 6 | PCD_FILE_WRITECHARACTER | 4 | PCD_FILE_WRITELINE | 2

---

## ENUM_FILE_OPEN_TYPES

# ENUM_FILE_OPEN_TYPES Enumeration

# Members

Member Value Description PCD_FILE_APPEND 3 PCD_FILE_READ 2 PCD_FILE_WRITE 1

| ENUM_FILE_OPEN_TYPES Enumeration |

| Member | Value | Description |
| --- | PCD_FILE_APPEND | 3 | PCD_FILE_READ | 2 | PCD_FILE_WRITE | 1

---

## ENUM_FILTER_TYPES

# ENUM_FILTER_TYPES Enumeration

# Members

Member Value Description FILTER_LINEAR 0 FILTER_POLAR 1

| ENUM_FILTER_TYPES Enumeration |

| Member | Value | Description |
| --- | FILTER_LINEAR | 0 | FILTER_POLAR | 1

---

## ENUM_GENERIC_ALIGN

# ENUM_GENERIC_ALIGN Enumeration

# Members

Member Value Description GENERIC_ALIGN_DEPENDENT 0 GENERIC_ALIGN_INDEPENDENT 1

| ENUM_GENERIC_ALIGN Enumeration |

| Member | Value | Description |
| --- | GENERIC_ALIGN_DEPENDENT | 0 | GENERIC_ALIGN_INDEPENDENT | 1

---

## ENUM_GENERIC_DISPLAY

# ENUM_GENERIC_DISPLAY Enumeration

# Members

Member Value Description GENERIC_DISPLAY_DIAMETER 1 GENERIC_DISPLAY_RADIUS 0

| ENUM_GENERIC_DISPLAY Enumeration |

| Member | Value | Description |
| --- | GENERIC_DISPLAY_DIAMETER | 1 | GENERIC_DISPLAY_RADIUS | 0

---

## ENUM_GENERIC_TYPES

# ENUM_GENERIC_TYPES Enumeration

# Members

Member Value Description GENERIC_CIRCLE 3 GENERIC_CONE 8 GENERIC_CYLINDER 5 GENERIC_LINE 2 GENERIC_NONE 9 GENERIC_PLANE 1 GENERIC_POINT 0 GENERIC_ROUND_SLOT 6 GENERIC_SPHERE 4 GENERIC_SQUARE_SLOT 7

| ENUM_GENERIC_TYPES Enumeration |

| Member | Value | Description |
| --- | GENERIC_CIRCLE | 3 | GENERIC_CONE | 8 | GENERIC_CYLINDER | 5 | GENERIC_LINE | 2 | GENERIC_NONE | 9 | GENERIC_PLANE | 1 | GENERIC_POINT | 0 | GENERIC_ROUND_SLOT | 6 | GENERIC_SPHERE | 4 | GENERIC_SQUARE_SLOT | 7

---

## ENUM_HATCH_STYLE

# ENUM_HATCH_STYLE Enumeration

# Members

Member Value Description HATCH_STYLE_BDIAGONAL 3 HATCH_STYLE_CROSS 4 HATCH_STYLE_DIAGCROSS 5 HATCH_STYLE_FDIAGONAL 2 HATCH_STYLE_HORIZONTAL 0 HATCH_STYLE_NONE 99 HATCH_STYLE_VERTICAL 1

| ENUM_HATCH_STYLE Enumeration |

| Member | Value | Description |
| --- | HATCH_STYLE_BDIAGONAL | 3 | HATCH_STYLE_CROSS | 4 | HATCH_STYLE_DIAGCROSS | 5 | HATCH_STYLE_FDIAGONAL | 2 | HATCH_STYLE_HORIZONTAL | 0 | HATCH_STYLE_NONE | 99 | HATCH_STYLE_VERTICAL | 1

---

## ENUM_MARK_NEW_ALIGNMENT_MODE

# ENUM_MARK_NEW_ALIGNMENT_MODE Enumeration

# Members

Member Value Description NEWALIGN 0 SAMEALIGN 1

| ENUM_MARK_NEW_ALIGNMENT_MODE Enumeration |

| Member | Value | Description |
| --- | NEWALIGN | 0 | SAMEALIGN | 1

---

## ENUM_MASTERSLAVEDIALOG_MEASUREARM

# ENUM_MASTERSLAVEDIALOG_MEASUREARM Enumeration

# Members

Member Value Description MEASURE_BOTH 0 MEASURE_MASTER 1 MEASURE_SLAVE 2

| ENUM_MASTERSLAVEDIALOG_MEASUREARM Enumeration |

| Member | Value | Description |
| --- | MEASURE_BOTH | 0 | MEASURE_MASTER | 1 | MEASURE_SLAVE | 2

---

## ENUM_MASTERSLAVEDIALOG_MEASUREDCC

# ENUM_MASTERSLAVEDIALOG_MEASUREDCC Enumeration

# Members

Member Value Description MEASURE_DCC 1 MEASURE_MANUAL 0

| ENUM_MASTERSLAVEDIALOG_MEASUREDCC Enumeration |

| Member | Value | Description |
| --- | MEASURE_DCC | 1 | MEASURE_MANUAL | 0

---

## ENUM_PAGE_FORMAT

# ENUM_PAGE_FORMAT Enumeration

# Members

Member Value Description PAPER_10X11 45 10 x 11 in PAPER_10X14 16 10x14 in PAPER_11X17 17 11x17 in PAPER_12X11 90 12 x 11 in PAPER_15X11 46 15 x 11 in PAPER_9X11 44 9 x 11 in PAPER_A_PLUS 57 SuperA/SuperA/A4 227 x 356 mm PAPER_A2 66 A2 420 x 594 mm PAPER_A3 8 A3 297 x 420 mm PAPER_A3_EXTRA 63 A3 Extra 322 x 445 mm PAPER_A3_EXTRA_TRANSVERSE 68 A3 Extra Transverse 322 x 445 mm PAPER_A3_ROTATED 76 A3 Rotated 420 x 297 mm PAPER_A3_TRANSVERSE 67 A3 Transverse 297 x 420 mm PAPER_A4 9 A4 210 x 297 mm PAPER_A4_EXTRA 53 A4 Extra 9.27 x 12.69 in PAPER_A4_PLUS 60 A4 Plus 210 x 330 mm PAPER_A4_ROTATED 77 A4 Rotated 297 x 210 mm PAPER_A4_TRANSVERSE 55 A4 Transverse 210 x 297 mm PAPER_A4SMALL 10 A4 Small 210 x 297 mm PAPER_A5 11 A5 148 x 210 mm PAPER_A5_EXTRA 64 A5 Extra 174 x 235 mm PAPER_A5_ROTATED 78 A5 Rotated 210 x 148 mm PAPER_A5_TRANSVERSE 61 A5 Transverse 148 x 210 mm PAPER_A6 70 A6 105 x 148 mm PAPER_A6_ROTATED 83 A6 Rotated 148 x 105 mm PAPER_B_PLUS 58 SuperB/SuperB/A3 305 x 487 mm PAPER_B4 12 B4 (JIS) 250 x 354 PAPER_B4_JIS_ROTATED 79 B4 (JIS) Rotated 364 x 257 mm PAPER_B5 13 B5 (JIS) 182 x 257 mm PAPER_B5_EXTRA 65 B5 (ISO) Extra 201 x 276 mm PAPER_B5_JIS_ROTATED 80 B5 (JIS) Rotated 257 x 182 mm PAPER_B5_TRANSVERSE 62 B5 (JIS) Transverse 182 x 257 mm PAPER_B6_JIS 88 B6 (JIS) 128 x 182 mm PAPER_B6_JIS_ROTATED 89 B6 (JIS) Rotated 182 x 128 mm PAPER_CSHEET 24 C size sheet PAPER_DBL_JAPANESE_POSTCARD 69 Japanese Double Postcard 200 x 148 mm PAPER_DBL_JAPANESE_POSTCARD_ROTATED 82 Double Japanese Postcard Rotated 148 x 200 mm PAPER_DSHEET 25 D size sheet PAPER_ENV_10 20 Envelope #10 4 1/8 x 9 1/2 PAPER_ENV_11 21 Envelope #11 4 1/2 x 10 3/8 PAPER_ENV_12 22 Envelope #12 4 ¾ x 11 PAPER_ENV_14 23 Envelope #14 5 x 11 1/2 PAPER_ENV_9 19 Envelope #9 3 7/8 x 8 7/8 PAPER_ENV_B4 33 Envelope B4 250 x 353 mm PAPER_ENV_B5 34 Envelope B5 176 x 250 mm PAPER_ENV_B6 35 Envelope B6 176 x 125 mm PAPER_ENV_C3 29 Envelope C3 324 x 458 mm PAPER_ENV_C4 30 Envelope C4 229 x 324 mm PAPER_ENV_C5 28 Envelope C5 162 x 229 mm PAPER_ENV_C6 31 Envelope C6 114 x 162 mm PAPER_ENV_C65 32 Envelope C65 114 x 229 mm PAPER_ENV_DL 27 Envelope DL 110 x 220mm PAPER_ENV_INVITE 47 Envelope Invite 220 x 220 mm PAPER_ENV_ITALY 36 Envelope 110 x 230 mm PAPER_ENV_MONARCH 37 Envelope Monarch 3.875 x 7.5 in PAPER_ENV_PERSONAL 38 6 3/4 Envelope 3 5/8 x 6 1/2 in PAPER_ESHEET 26 E size sheet PAPER_EXECUTIVE 7 Executive 7 1/4 x 10 1/2 in PAPER_FANFOLD_LGL_GERMAN 41 German Legal Fanfold 8 1/2 x 13 in PAPER_FANFOLD_STD_GERMAN 40 German Std Fanfold 8 1/2 x 12 in PAPER_FANFOLD_US 39 US Std Fanfold 14 7/8 x 11 in PAPER_FOLIO 14 Folio 8 1/2 x 13 in PAPER_ISO_B4 42 B4 (ISO) 250 x 353 mm PAPER_JAPANESE_POSTCARD 43 Japanese Postcard 100 x 148 mm PAPER_JAPANESE_POSTCARD_ROTATED 81 Japanese Postcard Rotated 148 x 100 mm PAPER_JENV_CHOU3 73 Japanese Envelope Chou #3 PAPER_JENV_CHOU3_ROTATED 86 Japanese Envelope Chou #3 Rotated PAPER_JENV_CHOU4 74 Japanese Envelope Chou #4 PAPER_JENV_CHOU4_ROTATED 87 Japanese Envelope Chou #4 Rotated PAPER_JENV_KAKU2 71 Japanese Envelope Kaku #2 PAPER_JENV_KAKU2_ROTATED 84 Japanese Envelope Kaku #2 Rotated PAPER_JENV_KAKU3 72 Japanese Envelope Kaku #3 PAPER_JENV_KAKU3_ROTATED 85 Japanese Envelope Kaku #3 Rotated PAPER_JENV_YOU4 91 Japanese Envelope You #4 PAPER_JENV_YOU4_ROTATED 92 Japanese Envelope You #4 Rotated PAPER_LEDGER 4 Ledger 17 x 11 in PAPER_LEGAL 5 Legal 8 1/2 x 14 in PAPER_LEGAL_EXTRA 51 Legal Extra 9 ½ x 15 in PAPER_LETTER 1 Letter 8 1/2 x 11 in PAPER_LETTER_EXTRA 50 Letter Extra 9 ½ x 12 in PAPER_LETTER_EXTRA_TRANSVERSE 56 Letter Extra Transverse 9½ x 12 in PAPER_LETTER_PLUS 59 Letter Plus 8.5 x 12.69 in PAPER_LETTER_ROTATED 75 Letter Rotated 11 x 8 1/2 11 in PAPER_LETTER_TRANSVERSE 54 Letter Transverse 8 ½ x 11 in PAPER_LETTERSMALL 2 Letter Small 8 1/2 x 11 in PAPER_NOTE 18 Note 8 1/2 x 11 in PAPER_P16K 93 PRC 16K 146 x 215 mm PAPER_P16K_ROTATED 106 PRC 16K Rotated PAPER_P32K 94 PRC 32K 97 x 151 mm PAPER_P32K_ROTATED 107 PRC 32K Rotated PAPER_P32KBIG 95 PRC 32K(Big) 97 x 151 mm PAPER_P32KBIG_ROTATED 108 PRC 32K(Big) Rotated PAPER_PENV_1 96 PRC Envelope #1 102 x 165 mm PAPER_PENV_1_ROTATED 109 PRC Envelope #1 Rotated 165 x 102 mm PAPER_PENV_10 105 PRC Envelope #10 324 x 458 mm PAPER_PENV_10_ROTATED 118 PRC Envelope #10 Rotated 458 x 324 mm PAPER_PENV_2 97 PRC Envelope #2 102 x 176 mm PAPER_PENV_2_ROTATED 110 PRC Envelope #2 Rotated 176 x 102 mm PAPER_PENV_3 98 PRC Envelope #3 125 x 176 mm PAPER_PENV_3_ROTATED 111 PRC Envelope #3 Rotated 176 x 125 mm PAPER_PENV_4 99 PRC Envelope #4 110 x 208 mm PAPER_PENV_4_ROTATED 112 PRC Envelope #4 Rotated 208 x 110 mm PAPER_PENV_5 100 PRC Envelope #5 110 x 220 mm PAPER_PENV_5_ROTATED 113 PRC Envelope #5 Rotated 220 x 110 mm PAPER_PENV_6 101 PRC Envelope #6 120 x 230 mm PAPER_PENV_6_ROTATED 114 PRC Envelope #6 Rotated 230 x 120 mm PAPER_PENV_7 102 PRC Envelope #7 160 x 230 mm PAPER_PENV_7_ROTATED 115 PRC Envelope #7 Rotated 230 x 160 mm PAPER_PENV_8 103 PRC Envelope #8 120 x 309 mm PAPER_PENV_8_ROTATED 116 PRC Envelope #8 Rotated 309 x 120 mm PAPER_PENV_9 104 PRC Envelope #9 229 x 324 mm PAPER_PENV_9_ROTATED 117 PRC Envelope #9 Rotated 324 x 229 mm PAPER_QUARTO 15 Quarto 215 x 275 mm PAPER_STATEMENT 6 Statement 5 1/2 x 8 1/2 in PAPER_TABLOID 3 Tabloid 11 x 17 in PAPER_TABLOID_EXTRA 52 Tabloid Extra 11.69 x 18 in

| ENUM_PAGE_FORMAT Enumeration |

| Member | Value | Description |
| --- | PAPER_10X11 | 45 | 10 x 11 in |
| PAPER_10X14 | 16 | 10x14 in |
| PAPER_11X17 | 17 | 11x17 in |
| PAPER_12X11 | 90 | 12 x 11 in |
| PAPER_15X11 | 46 | 15 x 11 in |
| PAPER_9X11 | 44 | 9 x 11 in |
| PAPER_A_PLUS | 57 | SuperA/SuperA/A4 227 x 356 mm |
| PAPER_A2 | 66 | A2 420 x 594 mm |
| PAPER_A3 | 8 | A3 297 x 420 mm |
| PAPER_A3_EXTRA | 63 | A3 Extra 322 x 445 mm |
| PAPER_A3_EXTRA_TRANSVERSE | 68 | A3 Extra Transverse 322 x 445 mm |
| PAPER_A3_ROTATED | 76 | A3 Rotated 420 x 297 mm |
| PAPER_A3_TRANSVERSE | 67 | A3 Transverse 297 x 420 mm |
| PAPER_A4 | 9 | A4 210 x 297 mm |
| PAPER_A4_EXTRA | 53 | A4 Extra 9.27 x 12.69 in |
| PAPER_A4_PLUS | 60 | A4 Plus 210 x 330 mm |
| PAPER_A4_ROTATED | 77 | A4 Rotated 297 x 210 mm |
| PAPER_A4_TRANSVERSE | 55 | A4 Transverse 210 x 297 mm |
| PAPER_A4SMALL | 10 | A4 Small 210 x 297 mm |
| PAPER_A5 | 11 | A5 148 x 210 mm |
| PAPER_A5_EXTRA | 64 | A5 Extra 174 x 235 mm |
| PAPER_A5_ROTATED | 78 | A5 Rotated 210 x 148 mm |
| PAPER_A5_TRANSVERSE | 61 | A5 Transverse 148 x 210 mm |
| PAPER_A6 | 70 | A6 105 x 148 mm |
| PAPER_A6_ROTATED | 83 | A6 Rotated 148 x 105 mm |
| PAPER_B_PLUS | 58 | SuperB/SuperB/A3 305 x 487 mm |
| PAPER_B4 | 12 | B4 (JIS) 250 x 354 |
| PAPER_B4_JIS_ROTATED | 79 | B4 (JIS) Rotated 364 x 257 mm |
| PAPER_B5 | 13 | B5 (JIS) 182 x 257 mm |
| PAPER_B5_EXTRA | 65 | B5 (ISO) Extra 201 x 276 mm |
| PAPER_B5_JIS_ROTATED | 80 | B5 (JIS) Rotated 257 x 182 mm |
| PAPER_B5_TRANSVERSE | 62 | B5 (JIS) Transverse 182 x 257 mm |
| PAPER_B6_JIS | 88 | B6 (JIS) 128 x 182 mm |
| PAPER_B6_JIS_ROTATED | 89 | B6 (JIS) Rotated 182 x 128 mm |
| PAPER_CSHEET | 24 | C size sheet |
| PAPER_DBL_JAPANESE_POSTCARD | 69 | Japanese Double Postcard 200 x 148 mm |
| PAPER_DBL_JAPANESE_POSTCARD_ROTATED | 82 | Double Japanese Postcard Rotated 148 x 200 mm |
| PAPER_DSHEET | 25 | D size sheet |
| PAPER_ENV_10 | 20 | Envelope #10 4 1/8 x 9 1/2 |
| PAPER_ENV_11 | 21 | Envelope #11 4 1/2 x 10 3/8 |
| PAPER_ENV_12 | 22 | Envelope #12 4 ¾ x 11 |
| PAPER_ENV_14 | 23 | Envelope #14 5 x 11 1/2 |
| PAPER_ENV_9 | 19 | Envelope #9 3 7/8 x 8 7/8 |
| PAPER_ENV_B4 | 33 | Envelope B4 250 x 353 mm |
| PAPER_ENV_B5 | 34 | Envelope B5 176 x 250 mm |
| PAPER_ENV_B6 | 35 | Envelope B6 176 x 125 mm |
| PAPER_ENV_C3 | 29 | Envelope C3 324 x 458 mm |
| PAPER_ENV_C4 | 30 | Envelope C4 229 x 324 mm |
| PAPER_ENV_C5 | 28 | Envelope C5 162 x 229 mm |
| PAPER_ENV_C6 | 31 | Envelope C6 114 x 162 mm |
| PAPER_ENV_C65 | 32 | Envelope C65 114 x 229 mm |
| PAPER_ENV_DL | 27 | Envelope DL 110 x 220mm |
| PAPER_ENV_INVITE | 47 | Envelope Invite 220 x 220 mm |
| PAPER_ENV_ITALY | 36 | Envelope 110 x 230 mm |
| PAPER_ENV_MONARCH | 37 | Envelope Monarch 3.875 x 7.5 in |
| PAPER_ENV_PERSONAL | 38 | 6 3/4 Envelope 3 5/8 x 6 1/2 in |
| PAPER_ESHEET | 26 | E size sheet |
| PAPER_EXECUTIVE | 7 | Executive 7 1/4 x 10 1/2 in |
| PAPER_FANFOLD_LGL_GERMAN | 41 | German Legal Fanfold 8 1/2 x 13 in |
| PAPER_FANFOLD_STD_GERMAN | 40 | German Std Fanfold 8 1/2 x 12 in |
| PAPER_FANFOLD_US | 39 | US Std Fanfold 14 7/8 x 11 in |
| PAPER_FOLIO | 14 | Folio 8 1/2 x 13 in |
| PAPER_ISO_B4 | 42 | B4 (ISO) 250 x 353 mm |
| PAPER_JAPANESE_POSTCARD | 43 | Japanese Postcard 100 x 148 mm |
| PAPER_JAPANESE_POSTCARD_ROTATED | 81 | Japanese Postcard Rotated 148 x 100 mm |
| PAPER_JENV_CHOU3 | 73 | Japanese Envelope Chou #3 |
| PAPER_JENV_CHOU3_ROTATED | 86 | Japanese Envelope Chou #3 Rotated |
| PAPER_JENV_CHOU4 | 74 | Japanese Envelope Chou #4 |
| PAPER_JENV_CHOU4_ROTATED | 87 | Japanese Envelope Chou #4 Rotated |
| PAPER_JENV_KAKU2 | 71 | Japanese Envelope Kaku #2 |
| PAPER_JENV_KAKU2_ROTATED | 84 | Japanese Envelope Kaku #2 Rotated |
| PAPER_JENV_KAKU3 | 72 | Japanese Envelope Kaku #3 |
| PAPER_JENV_KAKU3_ROTATED | 85 | Japanese Envelope Kaku #3 Rotated |
| PAPER_JENV_YOU4 | 91 | Japanese Envelope You #4 |
| PAPER_JENV_YOU4_ROTATED | 92 | Japanese Envelope You #4 Rotated |
| PAPER_LEDGER | 4 | Ledger 17 x 11 in |
| PAPER_LEGAL | 5 | Legal 8 1/2 x 14 in |
| PAPER_LEGAL_EXTRA | 51 | Legal Extra 9 ½ x 15 in |
| PAPER_LETTER | 1 | Letter 8 1/2 x 11 in |
| PAPER_LETTER_EXTRA | 50 | Letter Extra 9 ½ x 12 in |
| PAPER_LETTER_EXTRA_TRANSVERSE | 56 | Letter Extra Transverse 9½ x 12 in |
| PAPER_LETTER_PLUS | 59 | Letter Plus 8.5 x 12.69 in |
| PAPER_LETTER_ROTATED | 75 | Letter Rotated 11 x 8 1/2 11 in |
| PAPER_LETTER_TRANSVERSE | 54 | Letter Transverse 8 ½ x 11 in |
| PAPER_LETTERSMALL | 2 | Letter Small 8 1/2 x 11 in |
| PAPER_NOTE | 18 | Note 8 1/2 x 11 in |
| PAPER_P16K | 93 | PRC 16K 146 x 215 mm |
| PAPER_P16K_ROTATED | 106 | PRC 16K Rotated |
| PAPER_P32K | 94 | PRC 32K 97 x 151 mm |
| PAPER_P32K_ROTATED | 107 | PRC 32K Rotated |
| PAPER_P32KBIG | 95 | PRC 32K(Big) 97 x 151 mm |
| PAPER_P32KBIG_ROTATED | 108 | PRC 32K(Big) Rotated |
| PAPER_PENV_1 | 96 | PRC Envelope #1 102 x 165 mm |
| PAPER_PENV_1_ROTATED | 109 | PRC Envelope #1 Rotated 165 x 102 mm |
| PAPER_PENV_10 | 105 | PRC Envelope #10 324 x 458 mm |
| PAPER_PENV_10_ROTATED | 118 | PRC Envelope #10 Rotated 458 x 324 mm |
| PAPER_PENV_2 | 97 | PRC Envelope #2 102 x 176 mm |
| PAPER_PENV_2_ROTATED | 110 | PRC Envelope #2 Rotated 176 x 102 mm |
| PAPER_PENV_3 | 98 | PRC Envelope #3 125 x 176 mm |
| PAPER_PENV_3_ROTATED | 111 | PRC Envelope #3 Rotated 176 x 125 mm |
| PAPER_PENV_4 | 99 | PRC Envelope #4 110 x 208 mm |
| PAPER_PENV_4_ROTATED | 112 | PRC Envelope #4 Rotated 208 x 110 mm |
| PAPER_PENV_5 | 100 | PRC Envelope #5 110 x 220 mm |
| PAPER_PENV_5_ROTATED | 113 | PRC Envelope #5 Rotated 220 x 110 mm |
| PAPER_PENV_6 | 101 | PRC Envelope #6 120 x 230 mm |
| PAPER_PENV_6_ROTATED | 114 | PRC Envelope #6 Rotated 230 x 120 mm |
| PAPER_PENV_7 | 102 | PRC Envelope #7 160 x 230 mm |
| PAPER_PENV_7_ROTATED | 115 | PRC Envelope #7 Rotated 230 x 160 mm |
| PAPER_PENV_8 | 103 | PRC Envelope #8 120 x 309 mm |
| PAPER_PENV_8_ROTATED | 116 | PRC Envelope #8 Rotated 309 x 120 mm |
| PAPER_PENV_9 | 104 | PRC Envelope #9 229 x 324 mm |
| PAPER_PENV_9_ROTATED | 117 | PRC Envelope #9 Rotated 324 x 229 mm |
| PAPER_QUARTO | 15 | Quarto 215 x 275 mm |
| PAPER_STATEMENT | 6 | Statement 5 1/2 x 8 1/2 in |
| PAPER_TABLOID | 3 | Tabloid 11 x 17 in |
| PAPER_TABLOID_EXTRA | 52 | Tabloid Extra 11.69 x 18 in |

---

## ENUM_PAGE_ORIENTATION

# ENUM_PAGE_ORIENTATION Enumeration

# Members

Member Value Description ORIENT_LANDSCAPE 2 ORIENT_PORTRAIT 1

| ENUM_PAGE_ORIENTATION Enumeration |

| Member | Value | Description |
| --- | ORIENT_LANDSCAPE | 2 | ORIENT_PORTRAIT | 1

---

## ENUM_PCDMSG_RETVALS

# ENUM_PCDMSG_RETVALS Enumeration

# Members

Member Value Description PCDMSG_ABORT 3 PCDMSG_CANCEL 2 PCDMSG_IGNORE 5 PCDMSG_NO 7 PCDMSG_OK 1 PCDMSG_RETRY 4 PCDMSG_YES 6

| ENUM_PCDMSG_RETVALS Enumeration |

| Member | Value | Description |
| --- | PCDMSG_ABORT | 3 | PCDMSG_CANCEL | 2 | PCDMSG_IGNORE | 5 | PCDMSG_NO | 7 | PCDMSG_OK | 1 | PCDMSG_RETRY | 4 | PCDMSG_YES | 6

---

## ENUM_PCDMSG_TYPES

# ENUM_PCDMSG_TYPES Enumeration

# Members

Member Value Description MSGTYP_ABORTRETRYIGNORE 2 MSGTYP_DEFBUTTON2 256 MSGTYP_DEFBUTTON3 512 MSGTYP_ICONASTERISK 64 MSGTYP_ICONEXCLAMATION 48 MSGTYP_ICONHAND 16 MSGTYP_ICONQUESTION 32 MSGTYP_OK 0 MSGTYP_OKCANCEL 1 MSGTYP_RETRY_CANCEL 5 MSGTYP_YESNO 4 MSGTYP_YESNOCANCEL 3

| ENUM_PCDMSG_TYPES Enumeration |

| Member | Value | Description |
| --- | MSGTYP_ABORTRETRYIGNORE | 2 | MSGTYP_DEFBUTTON2 | 256 | MSGTYP_DEFBUTTON3 | 512 | MSGTYP_ICONASTERISK | 64 | MSGTYP_ICONEXCLAMATION | 48 | MSGTYP_ICONHAND | 16 | MSGTYP_ICONQUESTION | 32 | MSGTYP_OK | 0 | MSGTYP_OKCANCEL | 1 | MSGTYP_RETRY_CANCEL | 5 | MSGTYP_YESNO | 4 | MSGTYP_YESNOCANCEL | 3

---

## ENUM_PCD_COMMENT_TYPES

# ENUM_PCD_COMMENT_TYPES Enumeration

# Members

Member Value Description PCD_COMMENT_DOCUMENTATION 3 Documentation comment. PCD_COMMENT_INPUT 2 Input comment. PCD_COMMENT_OPER 0 Operator comment. PCD_COMMENT_READOUT 5 Readout comment. PCD_COMMENT_REPORT 1 Report comment. PCD_COMMENT_YESNO 4 Yes/No comment.

| ENUM_PCD_COMMENT_TYPES Enumeration |

| Member | Value | Description |
| --- | PCD_COMMENT_DOCUMENTATION | 3 | Documentation comment. |
| PCD_COMMENT_INPUT | 2 | Input comment. |
| PCD_COMMENT_OPER | 0 | Operator comment. |
| PCD_COMMENT_READOUT | 5 | Readout comment. |
| PCD_COMMENT_REPORT | 1 | Report comment. |
| PCD_COMMENT_YESNO | 4 | Yes/No comment. |

---

## ENUM_PCD_ON_OFF

# ENUM_PCD_ON_OFF Enumeration

# Members

Member Value Description DMIS_OFF 0 Does not print in draft form. DMIS_ON 1 Prints in draft form.

| ENUM_PCD_ON_OFF Enumeration |

| Member | Value | Description |
| --- | DMIS_OFF | 0 | Does not print in draft form. |
| DMIS_ON | 1 | Prints in draft form. |

---

## ENUM_PCD_STAT_TYPES

# ENUM_PCD_STAT_TYPES Enumeration

# Members

Member Value Description PCD_STATS_DATABASE 4 PCD_STATS_OFF 0 PCD_STATS_ON 1 PCD_STATS_RECORD 5 PCD_STATS_TRANSFER 2 PCD_STATS_UPDATE 3

| ENUM_PCD_STAT_TYPES Enumeration |

| Member | Value | Description |
| --- | PCD_STATS_DATABASE | 4 | PCD_STATS_OFF | 0 | PCD_STATS_ON | 1 | PCD_STATS_RECORD | 5 | PCD_STATS_TRANSFER | 2 | PCD_STATS_UPDATE | 3

---

## ENUM_PLANE_TYPE

# ENUM_PLANE_TYPE Enumeration

# Members

Member Value Description PLANE_BACK 2 PLANE_BOTTOM 3 PLANE_FRONT 5 PLANE_LEFT 4 PLANE_RIGHT 1 PLANE_TOP 0

| ENUM_PLANE_TYPE Enumeration |

| Member | Value | Description |
| --- | PLANE_BACK | 2 | PLANE_BOTTOM | 3 | PLANE_FRONT | 5 | PLANE_LEFT | 4 | PLANE_RIGHT | 1 | PLANE_TOP | 0

---

## ENUM_POINT_INFO_TYPES

# ENUM_POINT_INFO_TYPES Enumeration

# Members

Member Value Description DEVIATION_INFO 4 MEAS_POINT_INFO 2 MEAS_VECTOR_INFO 3 THEO_POINT_INFO 0 THEO_VECTOR_INFO 1

| ENUM_POINT_INFO_TYPES Enumeration |

| Member | Value | Description |
| --- | DEVIATION_INFO | 4 | MEAS_POINT_INFO | 2 | MEAS_VECTOR_INFO | 3 | THEO_POINT_INFO | 0 | THEO_VECTOR_INFO | 1

---

## ENUM_PRESS_BUTTON_RESULTS

# ENUM_PRESS_BUTTON_RESULTS Enumeration

# Members

Member Value Description BUTTON_NOT_AVAILABLE 1 DIALOG_ALREADY_CLOSED 2 DIALOG_NOT_FOUND 3 SUCCESS 0

| ENUM_PRESS_BUTTON_RESULTS Enumeration |

| Member | Value | Description |
| --- | BUTTON_NOT_AVAILABLE | 1 | DIALOG_ALREADY_CLOSED | 2 | DIALOG_NOT_FOUND | 3 | SUCCESS | 0

---

## ENUM_QUAL_CREATE_REPLACE

# ENUM_QUAL_CREATE_REPLACE Enumeration

# Members

Member Value Description CREATE_NEW_MAP 0 REPLACE_CLOSET_MAP 1

| ENUM_QUAL_CREATE_REPLACE Enumeration |

| Member | Value | Description |
| --- | CREATE_NEW_MAP | 0 | REPLACE_CLOSET_MAP | 1

---

## ENUM_RELEASE_TYPE

# ENUM_RELEASE_TYPE Enumeration

# Members

Member Value Description RT_CUSTOM 3 RT_QA 0 RT_RELEASE 2 RT_RELEASE_CANDIDATE 1

| ENUM_RELEASE_TYPE Enumeration |

| Member | Value | Description |
| --- | RT_CUSTOM | 3 | RT_QA | 0 | RT_RELEASE | 2 | RT_RELEASE_CANDIDATE | 1

---

## ENUM_REPORT_TEMPLATE_OBJECTS

# ENUM_REPORT_TEMPLATE_OBJECTS Enumeration

# Members

Member Value Description ID_HOB_ARC 60478 ID_HOB_BITMAP 60462 ID_HOB_BORDER 60473 ID_HOB_CADIMAGEOBJECT_OB 19105 ID_HOB_CIRCLE 60471 ID_HOB_GAUGE 60452 ID_HOB_GRAPH 60458 ID_HOB_LINE 60450 ID_HOB_PCD_ANALWIN_OB 19104 ID_HOB_PCD_CAD_REPORT_OBJECT 26514 ID_HOB_PCD_COMMAND_TEXT_OB 26324 ID_HOB_PCD_DIMCOLOR_OB 19102 ID_HOB_PCD_GRID_CTRL_OB 19100 ID_HOB_PCD_LABEL_OB 26603 ID_HOB_PCD_LEADERLINE_OB 19101 ID_HOB_PCD_SPC_CHART_OB 26619 ID_HOB_PCD_TEXT_REPORT_OBJECT 26515 ID_HOB_POLYLINE 60472 ID_HOB_PTR 60459 ID_HOB_TEXT 60448 ID_HOB_TEXT_RT 60449

| ENUM_REPORT_TEMPLATE_OBJECTS Enumeration |

| Member | Value | Description |
| --- | ID_HOB_ARC | 60478 | ID_HOB_BITMAP | 60462 | ID_HOB_BORDER | 60473 | ID_HOB_CADIMAGEOBJECT_OB | 19105 | ID_HOB_CIRCLE | 60471 | ID_HOB_GAUGE | 60452 | ID_HOB_GRAPH | 60458 | ID_HOB_LINE | 60450 | ID_HOB_PCD_ANALWIN_OB | 19104 | ID_HOB_PCD_CAD_REPORT_OBJECT | 26514 | ID_HOB_PCD_COMMAND_TEXT_OB | 26324 | ID_HOB_PCD_DIMCOLOR_OB | 19102 | ID_HOB_PCD_GRID_CTRL_OB | 19100 | ID_HOB_PCD_LABEL_OB | 26603 | ID_HOB_PCD_LEADERLINE_OB | 19101 | ID_HOB_PCD_SPC_CHART_OB | 26619 | ID_HOB_PCD_TEXT_REPORT_OBJECT | 26515 | ID_HOB_POLYLINE | 60472 | ID_HOB_PTR | 60459 | ID_HOB_TEXT | 60448 | ID_HOB_TEXT_RT | 60449

---

## ENUM_RMEAS_MODE

# ENUM_RMEAS_MODE Enumeration

# Members

Member Value Description RMEAS_ABSOLUTE 1 RMEAS_NORMAL 0

| ENUM_RMEAS_MODE Enumeration |

| Member | Value | Description |
| --- | RMEAS_ABSOLUTE | 1 | RMEAS_NORMAL | 0

---

## ENUM_RMEAS_MODE_NEW

# ENUM_RMEAS_MODE_NEW Enumeration

# Members

Member Value Description RMEAS_DEFAULT 1 RMEAS_LEGACY 0

| ENUM_RMEAS_MODE_NEW Enumeration |

| Member | Value | Description |
| --- | RMEAS_DEFAULT | 1 | RMEAS_LEGACY | 0

---

## ENUM_SCAN_INOUT_TYPES

# ENUM_SCAN_INOUT_TYPES Enumeration

# Members

Member Value Description SCAN_INNER 0 Inside scans SCAN_OUTER 1 Outside scans SCAN_PLANAR 2 Plane Circle scans

| ENUM_SCAN_INOUT_TYPES Enumeration |

| Member | Value | Description |
| --- | SCAN_INNER | 0 | Inside scans |
| SCAN_OUTER | 1 | Outside scans |
| SCAN_PLANAR | 2 | Plane Circle scans |

---

## ENUM_STAT_NAME_TYPES

# ENUM_STAT_NAME_TYPES Enumeration

# Members

Member Value Description PCD_STAT_DIM_NAME 0 PCD_STAT_FEAT_NAME 1

| ENUM_STAT_NAME_TYPES Enumeration |

| Member | Value | Description |
| --- | PCD_STAT_DIM_NAME | 0 | PCD_STAT_FEAT_NAME | 1

---

## ENUM_TIPTYPES

# ENUM_TIPTYPES Enumeration

# Members

Member Value Description TIP_ANALOG_BALL 16 TIP_ANALOG_DISK 17 TIP_ANALOG_OPTIC 20 TIP_ANALOG_SHANK 18 TIP_BALL 0 TIP_DISK 1 TIP_FIXED_BALL 32 TIP_FIXED_DISK 33 TIP_FIXED_OPTIC 36 TIP_FIXED_SHANK 34 TIP_INFINIT_ARM 256 TIP_OPTIC 4 TIP_SHANK 2 TIP_SLAVE 512 TIP_SP600 64 TIP_WB_OPTIC 128

| ENUM_TIPTYPES Enumeration |

| Member | Value | Description |
| --- | TIP_ANALOG_BALL | 16 | TIP_ANALOG_DISK | 17 | TIP_ANALOG_OPTIC | 20 | TIP_ANALOG_SHANK | 18 | TIP_BALL | 0 | TIP_DISK | 1 | TIP_FIXED_BALL | 32 | TIP_FIXED_DISK | 33 | TIP_FIXED_OPTIC | 36 | TIP_FIXED_SHANK | 34 | TIP_INFINIT_ARM | 256 | TIP_OPTIC | 4 | TIP_SHANK | 2 | TIP_SLAVE | 512 | TIP_SP600 | 64 | TIP_WB_OPTIC | 128

---

## ENUM_TOOL_MOVED

# ENUM_TOOL_MOVED Enumeration

# Members

Member Value Description TOOL_MOVED_ASK 2 TOOL_MOVED_NO 0 TOOL_MOVED_YES 1

| ENUM_TOOL_MOVED Enumeration |

| Member | Value | Description |
| --- | TOOL_MOVED_ASK | 2 | TOOL_MOVED_NO | 0 | TOOL_MOVED_YES | 1

---

## ENUM_TRANSFORMATION_TYPES

# ENUM_TRANSFORMATION_TYPES Enumeration

# Members

Member Value Description MAJOR_MINOR_THIRD_ROT_AND_TRANS 2 MAJOR_MINOR_THIRD_ROTATE_ONLY 3 ROTATE_AND_TRANSLATE 0 ROTATE_ONLY 1

| ENUM_TRANSFORMATION_TYPES Enumeration |

| Member | Value | Description |
| --- | MAJOR_MINOR_THIRD_ROT_AND_TRANS | 2 | MAJOR_MINOR_THIRD_ROTATE_ONLY | 3 | ROTATE_AND_TRANSLATE | 0 | ROTATE_ONLY | 1

---

## ENUM_VISION_TARGET_EDGE_SELECTION

# ENUM_VISION_TARGET_EDGE_SELECTION Enumeration

# Members

Member Value Description VISION_TES_DOMINANT_EDGE 0 VISION_TES_MATCHING_EDGE 2 VISION_TES_NEAREST_NOMINAL_EDGE 1 VISION_TES_SPECIFIED_EDGE 3

| ENUM_VISION_TARGET_EDGE_SELECTION Enumeration |

| Member | Value | Description |
| --- | VISION_TES_DOMINANT_EDGE | 0 | VISION_TES_MATCHING_EDGE | 2 | VISION_TES_NEAREST_NOMINAL_EDGE | 1 | VISION_TES_SPECIFIED_EDGE | 3

---

## ENUM_VISION_TARGET_FOCUS_RANGE

# ENUM_VISION_TARGET_FOCUS_RANGE Enumeration

# Members

Member Value Description VISION_TFR_10MM 7 VISION_TFR_1MM 2 VISION_TFR_20MM 8 VISION_TFR_2MM 3 VISION_TFR_3MM 4 VISION_TFR_4MM 5 VISION_TFR_50MM 9 VISION_TFR_5MM 6 VISION_TFR_HALFMM 1 VISION_TFR_TENTHMM 0

| ENUM_VISION_TARGET_FOCUS_RANGE Enumeration |

| Member | Value | Description |
| --- | VISION_TFR_10MM | 7 | VISION_TFR_1MM | 2 | VISION_TFR_20MM | 8 | VISION_TFR_2MM | 3 | VISION_TFR_3MM | 4 | VISION_TFR_4MM | 5 | VISION_TFR_50MM | 9 | VISION_TFR_5MM | 6 | VISION_TFR_HALFMM | 1 | VISION_TFR_TENTHMM | 0

---

## ENUM_VISION_TARGET_POINT_DENSITY

# ENUM_VISION_TARGET_POINT_DENSITY Enumeration

# Members

Member Value Description VISION_TPD_HIGH 3 VISION_TPD_LOW 1 VISION_TPD_NONE 0 VISION_TPD_NORMAL 2

| ENUM_VISION_TARGET_POINT_DENSITY Enumeration |

| Member | Value | Description |
| --- | VISION_TPD_HIGH | 3 | VISION_TPD_LOW | 1 | VISION_TPD_NONE | 0 | VISION_TPD_NORMAL | 2

---

## ENUM_VISION_TARGET_TYPE

# ENUM_VISION_TARGET_TYPE Enumeration

# Members

Member Value Description VISION_TARGET_TYPE_AUTOMATIC 2 VISION_TARGET_TYPE_COMPARATOR 3 VISION_TARGET_TYPE_GAGE 0 VISION_TARGET_TYPE_MANUAL_TARGET 1

| ENUM_VISION_TARGET_TYPE Enumeration |

| Member | Value | Description |
| --- | VISION_TARGET_TYPE_AUTOMATIC | 2 | VISION_TARGET_TYPE_COMPARATOR | 3 | VISION_TARGET_TYPE_GAGE | 0 | VISION_TARGET_TYPE_MANUAL_TARGET | 1

---

## ERRORMODES

# ERRORMODES Enumeration

# Members

Member Value Description ERROR_JUMPLABEL 1 ERROR_LASER_SKIP 1 ERROR_OFF 0 ERROR_SETVAR 2 ERROR_SKIP 3

| ERRORMODES Enumeration |

| Member | Value | Description |
| --- | ERROR_JUMPLABEL | 1 | ERROR_LASER_SKIP | 1 | ERROR_OFF | 0 | ERROR_SETVAR | 2 | ERROR_SKIP | 3

---

## ERRORTYPES

# ERRORTYPES Enumeration

# Members

Member Value Description ERROR_EDGE_NOT_DETECTED 3 ERROR_FOCUS_NOT_DETECTED 4 ERROR_LASER_ERROR 5 ERROR_MISSED_HIT 1 ERROR_REFLECTOR_NOT_FOUND 2 ERROR_UNEXPECTED_HIT 0

| ERRORTYPES Enumeration |

| Member | Value | Description |
| --- | ERROR_EDGE_NOT_DETECTED | 3 | ERROR_FOCUS_NOT_DETECTED | 4 | ERROR_LASER_ERROR | 5 | ERROR_MISSED_HIT | 1 | ERROR_REFLECTOR_NOT_FOUND | 2 | ERROR_UNEXPECTED_HIT | 0

---

## EVALUATION_TYPES

# EVALUATION_TYPES Enumeration

# Members

Member Value Description EVAL_ACTUALS 2 Evaluates the feature’s actuals. EVAL_BOTH 3 Evaluates both the feature’s nominals and actuals. EVAL_NOMINALS 1 Evaluates the feature’s nominals.

| EVALUATION_TYPES Enumeration |

| Member | Value | Description |
| --- | EVAL_ACTUALS | 2 | Evaluates the feature’s actuals. |
| EVAL_BOTH | 3 | Evaluates both the feature’s nominals and actuals. |
| EVAL_NOMINALS | 1 | Evaluates the feature’s nominals. |

---

## FDATA_COORDSYS

# FDATA_COORDSYS Enumeration

# Members

Member Value Description FDATA_CAD 5 FDATA_MACHINE 11 FDATA_PART 13 FDATA_PARTMM3 10 FDATA_POLAR 4

| FDATA_COORDSYS Enumeration |

| Member | Value | Description |
| --- | FDATA_CAD | 5 | FDATA_MACHINE | 11 | FDATA_PART | 13 | FDATA_PARTMM3 | 10 | FDATA_POLAR | 4

---

## FDATA_DATASET

# FDATA_DATASET Enumeration

# Members

Member Value Description FDATA_ALL 100 FDATA_MEAS 3 FDATA_TARG 27 FDATA_THEO 2

| FDATA_DATASET Enumeration |

| Member | Value | Description |
| --- | FDATA_ALL | 100 | FDATA_MEAS | 3 | FDATA_TARG | 27 | FDATA_THEO | 2

---

## FDATA_TYPES

# FDATA_TYPES Enumeration

# Members

FeatureCommand.PutData(LocSlotVector, FDATA_SLOT_VECTOR, FDATA_MEAS, FDATA_PART,"", PLANE_TOP)

Command.PutText("0", MEAS_SLOTVEC_I, 1)Command.PutText("1", MEAS_SLOTVEC_J, 1)Command.PutText("0", MEAS_SLOTVEC_K, 1)

Member Value Description FDATA_AB_ANGLES 48 FDATA_ANALOG_DEVIATIONS 46 FDATA_ANGLE 16 FDATA_ANGLE_VECTOR 29 FDATA_ANGLE2 53 FDATA_AUTO_MOVE_DISTANCE 25 FDATA_CENTROID 0 FDATA_CORNER_RADIUS 47 FDATA_CORNER_VECTOR2 58 FDATA_CORNER_VECTOR3 60 FDATA_DEPTH 26 FDATA_DEVIATION 18 FDATA_DIAMETER 6 FDATA_ENDPOINT 9 FDATA_FLUSH 79 FDATA_FOCUS1 69 FDATA_FOCUS2 70 FDATA_GAP2 80 FDATA_HEIGHT 40 FDATA_INDENT 24 FDATA_INDENT2 62 FDATA_INDENT3 63 FDATA_LENGTH 14 FDATA_MAJOR_AXIS 2001 FDATA_MANSCAN_INCR_DIST 74 FDATA_MANSCAN_INCR_TIME 75 FDATA_MEASURE_VECTOR 41 FDATA_MIDPOINT 8 FDATA_MIN_CIRC_SCAN_DOWN 78 FDATA_MIN_CIRC_SCAN_INIT 77 FDATA_MINOR_AXIS 15 FDATA_OFFSET 64 FDATA_ORG_HIT_VECTOR 49 FDATA_PIN_DIAMETER 35 FDATA_PIN_VECTOR 33 FDATA_PUNCH_VECTOR 31 FDATA_REPORT_SURF_VECTOR 38 FDATA_REPORT_VECTOR 36 FDATA_ROTAB_ANGLE 66 FDATA_SCANSEG_END 73 FDATA_SCANSEG_START 72 FDATA_SLOT_VECTOR 2002 Example Copy Code FeatureCommand.PutData(LocSlotVector, FDATA_SLOT_VECTOR, FDATA_MEAS, FDATA_PART, "", PLANE_TOP) Command.PutText("0", MEAS_SLOTVEC_I, 1) Command.PutText("1", MEAS_SLOTVEC_J, 1) Command.PutText("0", MEAS_SLOTVEC_K, 1) FDATA_SNAP_CENTROID 45 FDATA_SPACER 23 FDATA_STARTPOINT 7 FDATA_SURFACE_VECTOR 19 FDATA_SURFACEVECTOR2 67 FDATA_SURFACEVECTOR2NONORM 68 FDATA_TARGET 27 FDATA_THICKNESS 21 FDATA_TIPRADIUS 65 FDATA_UPDATE_VECTOR 43 FDATA_VECTOR 1 FDATA_VERTEX 71 FDATA_WIDTH 2000 FDATA_WIDTH2 76

| FDATA_TYPES Enumeration |

| Member | Value | Description |
| --- | FeatureCommand.PutData(LocSlotVector, FDATA_SLOT_VECTOR, FDATA_MEAS, FDATA_PART,"", PLANE_TOP)Command.PutText("0", MEAS_SLOTVEC_I, 1)Command.PutText("1", MEAS_SLOTVEC_J, 1)Command.PutText("0", MEAS_SLOTVEC_K, 1) |

| Example |
| FeatureCommand.PutData(LocSlotVector, FDATA_SLOT_VECTOR, FDATA_MEAS, FDATA_PART,"", PLANE_TOP)Command.PutText("0", MEAS_SLOTVEC_I, 1)Command.PutText("1", MEAS_SLOTVEC_J, 1)Command.PutText("0", MEAS_SLOTVEC_K, 1) |

---

## FHITDATA_TYPES

# FHITDATA_TYPES Enumeration

# Members

Member Value Description FHITDATA_BALLCENTER 12 FHITDATA_CENTROID 0 FHITDATA_VECTOR 1

| FHITDATA_TYPES Enumeration |

| Member | Value | Description |
| --- | FHITDATA_BALLCENTER | 12 | FHITDATA_CENTROID | 0 | FHITDATA_VECTOR | 1

---

## FPOINT_TYPES

# FPOINT_TYPES Enumeration

# Members

Member Value Description FPOINT_BALLCENTER 12 FPOINT_CENTROID 0 FPOINT_ENDPOINT 9 FPOINT_MIDPOINT 8 FPOINT_SNAP_CENTROID 45 FPOINT_STARTPOINT 7

| FPOINT_TYPES Enumeration |

| Member | Value | Description |
| --- | FPOINT_BALLCENTER | 12 | FPOINT_CENTROID | 0 | FPOINT_ENDPOINT | 9 | FPOINT_MIDPOINT | 8 | FPOINT_SNAP_CENTROID | 45 | FPOINT_STARTPOINT | 7

---

## FVECTOR_TYPES

# FVECTOR_TYPES Enumeration

# Members

Member Value Description FVECTOR_ANGLE_VECTOR 29 FVECTOR_CORNER_VECTOR2 58 FVECTOR_CORNER_VECTOR3 60 FVECTOR_MEASURE_VECTOR 41 FVECTOR_ORG_HIT_VECTOR 49 FVECTOR_PIN_VECTOR 33 FVECTOR_PUNCH_VECTOR 31 FVECTOR_REPORT_SURF_VECTOR 38 FVECTOR_REPORT_VECTOR 36 FVECTOR_SLOT_VECTOR 2002 FVECTOR_SURFACE_VECTOR 19 FVECTOR_UPDATE_VECTOR 43 FVECTOR_VECTOR 1

| FVECTOR_TYPES Enumeration |

| Member | Value | Description |
| --- | FVECTOR_ANGLE_VECTOR | 29 | FVECTOR_CORNER_VECTOR2 | 58 | FVECTOR_CORNER_VECTOR3 | 60 | FVECTOR_MEASURE_VECTOR | 41 | FVECTOR_ORG_HIT_VECTOR | 49 | FVECTOR_PIN_VECTOR | 33 | FVECTOR_PUNCH_VECTOR | 31 | FVECTOR_REPORT_SURF_VECTOR | 38 | FVECTOR_REPORT_VECTOR | 36 | FVECTOR_SLOT_VECTOR | 2002 | FVECTOR_SURFACE_VECTOR | 19 | FVECTOR_UPDATE_VECTOR | 43 | FVECTOR_VECTOR | 1

---

## GETIDTYPE

# GETIDTYPE Enumeration

# Members

Member Value Description PCD__ALIGNMENT 1 PCD_DIMENSION 1000 PCD_FEATURE 31

| GETIDTYPE Enumeration |

| Member | Value | Description |
| --- | PCD__ALIGNMENT | 1 | PCD_DIMENSION | 1000 | PCD_FEATURE | 31

---

## GUESSTYPE

# GUESSTYPE Enumeration

# Members

Member Value Description GUESS_MANUAL_SCAN 26211 GUESS_MEASURED_CIRCLE 26204 GUESS_MEASURED_CONE 26205 GUESS_MEASURED_CYLINDER 26206 GUESS_MEASURED_GUESS 26210 GUESS_MEASURED_LINE 26202 GUESS_MEASURED_PLANE 26203 GUESS_MEASURED_POINT 26201 GUESS_MEASURED_ROUND_SLOT 26208 GUESS_MEASURED_SPHERE 26207 GUESS_MEASURED_SQUARE_SLOT 26209

| GUESSTYPE Enumeration |

| Member | Value | Description |
| --- | GUESS_MANUAL_SCAN | 26211 | GUESS_MEASURED_CIRCLE | 26204 | GUESS_MEASURED_CONE | 26205 | GUESS_MEASURED_CYLINDER | 26206 | GUESS_MEASURED_GUESS | 26210 | GUESS_MEASURED_LINE | 26202 | GUESS_MEASURED_PLANE | 26203 | GUESS_MEASURED_POINT | 26201 | GUESS_MEASURED_ROUND_SLOT | 26208 | GUESS_MEASURED_SPHERE | 26207 | GUESS_MEASURED_SQUARE_SLOT | 26209

---

## HIGH_POINT_SEARCH_MODES

# HIGH_POINT_SEARCH_MODES Enumeration

# Members

Member Value Description SEARCH_MODE_BOX 0 SEARCH_MODE_CIRCULAR 1

| HIGH_POINT_SEARCH_MODES Enumeration |

| Member | Value | Description |
| --- | SEARCH_MODE_BOX | 0 | SEARCH_MODE_CIRCULAR | 1

---

## IJKTYPES

# IJKTYPES Enumeration

# Members

Member Value Description PCD__VECTOR 608 PCD_SLOTVECTOR 609 PCD_SURFACEVECTOR 610

| IJKTYPES Enumeration |

| Member | Value | Description |
| --- | PCD__VECTOR | 608 | PCD_SLOTVECTOR | 609 | PCD_SURFACEVECTOR | 610

---

## ITERATEFLAGS

# ITERATEFLAGS Enumeration

# Members

Member Value Description PCD_AV_ERROR 2 PCD_BODY_AX 1 PCD_MEAS_ALL 4 PCD_MEAS_ALL_ALWAYS 8

| ITERATEFLAGS Enumeration |

| Member | Value | Description |
| --- | PCD_AV_ERROR | 2 | PCD_BODY_AX | 1 | PCD_MEAS_ALL | 4 | PCD_MEAS_ALL_ALWAYS | 8

---

## LEAPFROG

# LEAPFROG Object

# Description

# See Also

TheL**eapfrogo**bject contains three leapfrog properties that will allow you to define how to use PC-DMIS's Leapfrog option (available in PC-DMIS Versions 3.0 and above) to translate along a part as well as the numbers of hits to use for each feature.

**For information on Leapfrog, see the "Performing a LeapFrog Operation” topic in thePC-DMIS Help File.

LEAPFROG Members

**The **Leapfrog** object contains three leapfrog properties that will allow you to define how to use PC-DMIS's Leapfrog option (available in PC-DMIS Versions 3.0 and above) to translate along a part as well as the numbers of hits to use for each feature. For information on Leapfrog, see the "Performing a LeapFrog Operation” topic in the PC-DMIS Help File .

| LEAPFROG Object |

---

## MOVEDIRECTION

# MOVEDIRECTION Enumeration

# Members

Member Value Description PCD_CLOCKWISE 1 PCD_COUNTERCLOCKWISE 2 PCD_SHORTEST 3

| MOVEDIRECTION Enumeration |

| Member | Value | Description |
| --- | PCD_CLOCKWISE | 1 | PCD_COUNTERCLOCKWISE | 2 | PCD_SHORTEST | 3

---

## MOVETYPE

# MOVETYPE Enumeration

# Members

Member Value Description PCD_CIRCULAR 92 PCD_CLEARPLANE 90 PCD_INCREMENT 91 PCD_POINT 93 PCD_ROTAB 94

| MOVETYPE Enumeration |

| Member | Value | Description |
| --- | PCD_CIRCULAR | 92 | PCD_CLEARPLANE | 90 | PCD_INCREMENT | 91 | PCD_POINT | 93 | PCD_ROTAB | 94

---

## MachineConnectionStatus

# MachineConnectionStatus Enumeration

# Description

# Members

This enumerated list shows the possible values for the ConnectionStatus property.

Member Value Description MachineConnected 2 MachineConnecting 1 MachineDisconnecting 3 MachineHoming 4 MachineNotConnected 0 NotAvailable -1

| MachineConnectionStatus Enumeration |

| Member | Value | Description |
| --- | MachineConnected | 2 | MachineConnecting | 1 | MachineDisconnecting | 3 | MachineHoming | 4 | MachineNotConnected | 0 | NotAvailable | -1

---

## OBTYPE

# OBTYPE Enumeration

# Description

# Members

The Object Type, or OBTYPE, is a special member of the Application (or PCDLRN) object. It contains several constant values tied to enumerations. You can use these values when working with the Commands.Add method and the Command.Type property.

The following list shows the available OBTYPE constants and their equivalent enumerations. These enumerated values are of type LONG:

The Object Type, or OBTYPE, is a special member of the Application (or PCDLRN) object. It contains several constant values tied to enumerations. You can use these values when working with the Commands.Add method and the Command.Type property. The following list shows the available OBTYPE constants and their equivalent enumerations. These enumerated values are of type LONG:

Member Value Description ADJUST_FILTER 595 ANALYSIS_VIEW 176 ANGLE_HIT 107 ANYORDER_EXECUTETOL 215 ARRAY_INDEX 95 ASME_SIZE_COMMAND 1321 ASME_TOLERANCE_COMMAND 1302 ASSIGNMENT 195 ATTACH_PROGRAM 22 AUTO_ANGLE_FEATURE 643 AUTO_BLOB 626 AUTO_CIRCLE 648 AUTO_CONE 655 AUTO_CORNER_FEATURE 644 AUTO_CYLINDER 656 AUTO_EDGE_FEATURE 642 AUTO_ELLIPSE 649 AUTO_FLUSH_GAP 625 AUTO_HIGH_FEATURE 645 AUTO_LINE 646 AUTO_NOTCH 652 AUTO_PLANE 647 AUTO_POLYGON 654 AUTO_PROFILE_2D 623 AUTO_ROUND_SLOT 650 AUTO_SET 620 AUTO_SPHERE 657 AUTO_SQUARE_SLOT 651 AUTO_SURFACE_FEATURE 641 AUTO_VECTOR_FEATURE 640 AUTOCALIB_MASTERSLAVE_COMMAND 144 AUTOCALIB_PROBE_COMMAND 143 AUTOTRIGGERCOMMAND 116 BASIC_HIT 104 BASIC_SCAN_OBJECT 214 BASIC_SCRIPT 12346 BF2D_ALIGN 13 BF3D_ALIGN 15 BFUSER_ALIGN 17 BUNDLE_ALIGN 123 CALIB_ASSEMBLY 142 CALIB_SPHERE 141 CALIBRATEROTAB_COMMAND 901 CALL_SUBROUTINE 76 CASE_COMMAND 92 CHECK_DISTANCE 102 CLAMP 99 CLEARANCE_PLANE 130 CNC_PASS_THRU_COMMAND 807 CNC_READ_VARIABLE 806 CNC_SELECT_TABLE_COMMAND 808 CNC_SET_PROTECTION_COMMAND 803 CNC_UPDATE_TOOLOFSET 804 CNC_UPDATE_WORKOFSET 800 CNC_USE_WORKOFSET 801 CNC_WRITE_VARIABLE 805 COLUMN132_DISPLAY 181 CONST_ALN_LINE 548 CONST_ALN_PLANE 576 CONST_BF_CIRCLE 521 CONST_BF_CONE 552 CONST_BF_CYLINDER 561 CONST_BF_ELLIPSE 581 CONST_BF_LINE 541 CONST_BF_PLANE 571 CONST_BF_SLOT 506 CONST_BF_SPHERE 531 CONST_BF_SQSLOT 590 CONST_BFRE_CIRCLE 520 CONST_BFRE_CONE 551 CONST_BFRE_CYLINDER 560 CONST_BFRE_ELLIPSE 580 CONST_BFRE_LINE 540 CONST_BFRE_PLANE 570 CONST_BFRE_SLOT 507 CONST_BFRE_SPHERE 530 CONST_BFRE_SQSLOT 591 CONST_CAST_CIRCLE 525 CONST_CAST_CONE 555 CONST_CAST_CYLINDER 564 CONST_CAST_ELLIPSE 584 CONST_CAST_LINE 545 CONST_CAST_PLANE 574 CONST_CAST_POINT 517 CONST_CAST_SLOT 509 CONST_CAST_SPHERE 534 CONST_CAST_SQSLOT 593 CONST_CONE_CIRCLE 524 CONST_CORNER_POINT 518 CONST_CYLINDER_CIRCLE 538 CONST_DROP_POINT 514 CONST_HIPNT_PLANE 579 CONST_INT_CIRCLE 526 CONST_INT_ELLIPSE 585 CONST_INT_LINE 546 CONST_INT_POINT 516 CONST_MID_LINE 544 CONST_MID_PLANE 573 CONST_MID_POINT 513 CONST_MIN_CIRCLE_SCAN 528 CONST_OFF_LINE 547 CONST_OFF_PLANE 575 CONST_OFF_POINT 511 CONST_ORIG_POINT 510 CONST_PIERCE_POINT 515 CONST_PLTO_LINE 550 CONST_PLTO_PLANE 578 CONST_PRIMARY_DATUM 579 CONST_PROJ_CIRCLE 522 CONST_PROJ_CONE 553 CONST_PROJ_CYLINDER 562 CONST_PROJ_ELLIPSE 582 CONST_PROJ_LINE 542 CONST_PROJ_POINT 512 CONST_PROJ_SLOT 508 CONST_PROJ_SPHERE 532 CONST_PROJ_SQSLOT 592 CONST_PRTO_LINE 549 CONST_PRTO_PLANE 577 CONST_REV_CIRCLE 523 CONST_REV_CONE 554 CONST_REV_CYLINDER 563 CONST_REV_ELLIPSE 583 CONST_REV_LINE 543 CONST_REV_PLANE 572 CONST_REV_SPHERE 533 CONST_ROUND_SLOT 505 CONST_SCAN_SEG_ARC 527 CONST_SCAN_SEG_LINE 539 CONST_SECONDARY_DATUM_LINE 557 CONST_SET 596 CONST_SPHERE_CIRCLE 537 CONST_TANCIRCLES_CIRCLE 536 CONST_TANGENT_PLANE 579 CONST_TANLINES_CIRCLE 529 CONST_TERTIARY_DATUM_POINT 558 CONST_TRANSLATED_PLANE 569 CONST_VECT_DIST_POINT 519 CONST_WIDTH2D_FEATURE 586 CONST_WIDTH3D_FEATURE 587 CONTACT_ANGLE_POINT_FEATURE 605 CONTACT_CIRCLE_FEATURE 612 CONTACT_CONE_FEATURE 615 CONTACT_CORNER_POINT_FEATURE 606 CONTACT_CYLINDER_FEATURE 616 CONTACT_EDGE_POINT_FEATURE 604 CONTACT_ELLIPSE_FEATURE 621 CONTACT_HIGH_POINT_FEATURE 607 CONTACT_LINE_FEATURE 614 CONTACT_PLANE_FEATURE 617 CONTACT_POLYGON_FEATURE 627 CONTACT_SLOT_NOTCH_FEATURE 622 CONTACT_SLOT_ROUND_FEATURE 618 CONTACT_SLOT_SQUARE_FEATURE 619 CONTACT_SPHERE_FEATURE 613 CONTACT_SURFACE_POINT_FEATURE 603 CONTACT_VECTOR_POINT_FEATURE 602 CORNER_HIT 106 CURVE_FEATURE 38 DATDEF_COMMAND 1299 DCCSCAN_OBJECT 211 DEFAULT_CASE_COMMAND 94 DIMENSION_2D_ANGLE 1109 DIMENSION_2D_DISTANCE 1107 DIMENSION_3D_ANGLE 1108 DIMENSION_3D_DISTANCE 1106 DIMENSION_A_LOCATION 1007 DIMENSION_ANGULARITY 1112 DIMENSION_CIRCULAR_RUNOUT 1117 DIMENSION_CIRCULARITY 1101 DIMENSION_COAXIALITY 1114 DIMENSION_CONCENTRICITY 1111 DIMENSION_CYLINDRICITY 1116 DIMENSION_D_LOCATION 1005 DIMENSION_END_LOCATION 1001 DIMENSION_FLATNESS 1102 DIMENSION_FLATNESS_LOCATION 1018 DIMENSION_FORMAT 180 DIMENSION_H_LOCATION 1017 DIMENSION_INFORMATION 182 DIMENSION_KEYIN 1113 DIMENSION_L_LOCATION 1012 DIMENSION_PA_LOCATION 1010 DIMENSION_PARALLELISM 1104 DIMENSION_PD_LOCATION 1013 DIMENSION_PERPENDICULARITY 1103 DIMENSION_PR_LOCATION 1009 DIMENSION_PROFILE 1105 DIMENSION_PROFILE_LINE 1118 DIMENSION_PROFILE_SURFACE 1105 DIMENSION_R_LOCATION 1006 DIMENSION_ROUNDNESS 1101 DIMENSION_ROUNDNESS_LOCATION 1019 DIMENSION_RS_LOCATION 1016 DIMENSION_RT_LOCATION 1014 DIMENSION_RUNOUT 1110 DIMENSION_S_LOCATION 1015 DIMENSION_START_LOCATION 1000 DIMENSION_STRAIGHTNESS 1100 DIMENSION_STRAIGHTNESS_LOCATION 1020 DIMENSION_SYMMETRY 1115 DIMENSION_T_LOCATION 1008 DIMENSION_TOTAL_RUNOUT 1110 DIMENSION_TRUE_D1_LOCATION 1214 DIMENSION_TRUE_D2_LOCATION 1215 DIMENSION_TRUE_D3_LOCATION 1216 DIMENSION_TRUE_DD_LOCATION 1205 DIMENSION_TRUE_DF_LOCATION 1206 DIMENSION_TRUE_DIAM_LOCATION 1209 DIMENSION_TRUE_END_POSITION 1201 DIMENSION_TRUE_FLATNESS_LOCATION 1217 DIMENSION_TRUE_LD_LOCATION 1210 DIMENSION_TRUE_LF_LOCATION 1212 DIMENSION_TRUE_LOCATION 1220 DIMENSION_TRUE_PA_LOCATION 1208 DIMENSION_TRUE_PR_LOCATION 1207 DIMENSION_TRUE_ROUNDNESS_LOCATION 1218 DIMENSION_TRUE_START_POSITION 1200 DIMENSION_TRUE_STRAIGHTNESS_LOCATION 1219 DIMENSION_TRUE_WD_LOCATION 1211 DIMENSION_TRUE_WF_LOCATION 1213 DIMENSION_TRUE_X_LOCATION 1202 DIMENSION_TRUE_Y_LOCATION 1203 DIMENSION_TRUE_Z_LOCATION 1204 DIMENSION_V_LOCATION 1011 DIMENSION_X_LOCATION 1002 DIMENSION_Y_LOCATION 1003 DIMENSION_Z_LOCATION 1004 DISPLAY_METAFILE 702 DISPLAYPRECISION 114 DO_COMMAND 81 EDGE_HIT 109 ELSE_COMMAND 91 ELSE_IF_COMMAND 90 END_ALIGN 19 END_CASE_COMMAND 85 END_DEFAULT_CASE_COMMAND 87 END_ELSE_COMMAND 84 END_ELSE_IF_COMMAND 83 END_HYPER_FORM 12351 END_HYPER_REPORT 12349 END_IF_COMMAND 82 END_MEASURED_FEATURE 213 END_MOVE_SWEEP 159 END_PROGRAM 169 END_READ_TEMPERATURE 409 END_SCRIPT 12347 END_SELECT_COMMAND 86 END_SUBROUTINE 77 ENDWHILE_COMMAND 80 EQUATE_ALIGN 11 EW_GROUP_END 753 EW_GROUP_START 752 EXTERNAL_COMMAND 175 FASTPROBEMODE_COMMAND 902 FEATURE_CONTROL_FRAME 184 FILE_IO_OBJECT 96 FILTER_SET 598 FLY_MODE 168 GAP_ONLY 193 GENERIC_CONSTRUCTION 597 GET_PROBE_DATA 61 GET_PROBECHANGER_DATA 262 GOTO_COMMAND 73 HYPER_CUSTOM 12352 HYPER_FORM 12350 HYPER_LABEL 12356 HYPER_LEGACY 12348 HYPER_REPORT 12355 HYPER_TEMPLATE 12353 IF_BLOCK_COMMAND 89 IF_GOTO_COMMAND 74 IGNOREMOTIONERRORS 119 IGNOREROTAB_COMMAND 900 INBETWEEN_TOL 1301 IOCHANNELCOMMAND 120 ISO_SIZE_COMMAND 1320 ISO_TOLERANCE_COMMAND 1303 ITER_ALIGN 12 LABEL_CMD 72 LASER_CIRCLE_FEATURE 270 LASER_CONE_FEATURE 281 LASER_CYLINDER_FEATURE 279 LASER_EDGE_POINT_FEATURE 276 LASER_FLUSH_AND_GAP_FEATURE 274 LASER_LINE_FEATURE 277 LASER_PLANE_FEATURE 272 LASER_POLYGON_FEATURE 280 LASER_SLOT_FEATURE 273 LASER_SLOT_SQUARE_FEATURE 278 LASER_SPHERE_FEATURE 275 LASER_SURFACE_POINT_FEATURE 271 LEAPFROG 115 LEVEL_ALIGN 2 LOAD_COLUMN 173 LOAD_FIXTURE 172 LOAD_MACHINE 171 LOOP_END 71 LOOP_START 70 MAN_DCC_MODE 103 MANRETRACT 117 MANSCAN_OBJECT 212 MEASURED_CIRCLE 202 MEASURED_CONE 205 MEASURED_CYLINDER 206 MEASURED_LINE 204 MEASURED_PLANE 207 MEASURED_POINT 201 MEASURED_ROUND_SLOT 208 MEASURED_SET 210 MEASURED_SPHERE 203 MEASURED_SQUARE_SLOT 209 MEASURED_TORUS 200 MESH_ALIGN 18 MESH_OPER_COLORMAP 2024 MESH_OPER_CROSSSECTION 2026 MESH_OPER_EMPTY 2025 MESH_OPER_FILEEXPORT 2023 MESH_OPER_FILEIMPORT 2022 MESH_OPER_THICKNESS_COLORMAP 2028 MOVE_ALL 162 MOVE_CIRCULAR 155 MOVE_CLEARP 151 MOVE_CLEARPOINT 163 MOVE_EXCLUSIVE 161 MOVE_INCREMENT 154 MOVE_PH9_OFFSET 156 MOVE_POINT 150 MOVE_ROTAB 153 MOVE_SPEED 45 MOVE_SWEEP_POINT 160 MOVE_SYNC 157 ONERROR 78 OPTIONMOTION 112 OPTIONPROBE 111 PART_TEMPERATURE 408 PLANNER_ANGLE_POINT_FEATURE 2110 PLANNER_CIRCLE_FEATURE 2102 PLANNER_CONE_FEATURE 2108 PLANNER_CORNER_POINT_FEATURE 2111 PLANNER_CYLINDER_FEATURE 2107 PLANNER_EDGE_POINT_FEATURE 2101 PLANNER_ELLIPSE_FEATURE 2112 PLANNER_LINE_FEATURE 2103 PLANNER_PLANE_FEATURE 2104 PLANNER_POLYGON_FEATURE 2113 PLANNER_SLOT_NOTCH_FEATURE 2114 PLANNER_SLOT_ROUND_FEATURE 2105 PLANNER_SLOT_SQUARE_FEATURE 2106 PLANNER_SPHERE_FEATURE 2109 PLANNER_VECTOR_POINT_FEATURE 2100 POINT_INFO 183 POINTCLOUD 2001 POINTCLOUD_ALIGN 16 POINTCLOUD_MESH 2004 POINTCLOUD_OPER 2002 POINTCLOUD_OPER_BOOLEAN 2016 POINTCLOUD_OPER_CLEAN 2012 POINTCLOUD_OPER_COLORMAPFACE 2019 POINTCLOUD_OPER_COLORMAPPNT 2020 POINTCLOUD_OPER_CROSSSECTION 2021 POINTCLOUD_OPER_EMPTY 2013 POINTCLOUD_OPER_FILEEXPORT 2011 POINTCLOUD_OPER_FILEIMPORT 2010 POINTCLOUD_OPER_FILTER 2017 POINTCLOUD_OPER_NEW 2003 POINTCLOUD_OPER_OLD 2009 POINTCLOUD_OPER_PURGE 2015 POINTCLOUD_OPER_RESET 2014 POINTCLOUD_OPER_SELECTION 2018 POINTCLOUD_OPER_THICKNESS_COLORMAP 2029 POLARVECTORCOMP 113 POSITIVE_REPORTING 196 PREHIT_DISTANCE 100 PRINT_FORM_FEED 750 PRINT_REPORT 751 PROBE_COMPENSATION 140 READ_POINT 192 READ_TEMPERATURE 404 RECALL_ALIGN 10 RECALL_VIEWSET 51 RETRACT_DISTANCE 101 RETROLINEAR_ONLY 194 RMEAS_MODE 110 ROTATE_ALIGN 3 ROTATE_CIRCLE_ALIGN 14 ROTATEOFF_ALIGN 6 SAVE_ALIGN 9 SCAN_SPEED 47 SECTION_2DRADIUS 2027 SELECT_COMMAND 93 SET_ACTIVE_TIP 60 SET_COMMENT 170 SET_WORKPLANE 21 SIMULTANEOUS_EVALUATION 1300 SNAPSHOT_COMMAND 905 SPC_CHART 780 START_ALIGN 1 START_MOVE_SWEEP 158 START_SUBROUTINE 75 STATISTICS 190 SURFACE_FEATURE 39 SURFACE_HIT 108 TABLE_FORMAT 179 TEMP_COMP 62 TEMP_COMP_ORIGIN 63 THICKNESS_GAGE 2119 THICKNESS_SCAN 2120 TOUCH_SPEED 46 TPS_CUSTOM_COMMAND 402 TRACEFIELD 191 TRACKER_CUSTOM_COMMAND 401 TRACKER_LEVEL_TO_GRAVITY 233 TRANS_ALIGN 4 TRANSOFF_ALIGN 5 TRIGGER_PLANE_COMMAND 232 TRIGGER_TOLERANCE 231 UNTIL_COMMAND 88 VECTOR_HIT 105 VIDEOSETUP 118 VIEWSET 50 VISION_ANGLE_POINT_FEATURE 249 VISION_CIRCLE_FEATURE 245 VISION_EDGE_POINT_FEATURE 242 VISION_ELLIPSE_FEATURE 244 VISION_IMAGE_CAPTURE 253 VISION_LINE_FEATURE 243 VISION_POLYGON_FEATURE 251 VISION_PROFILE_2D_FEATURE 247 VISION_SLOT_NOTCH_FEATURE 250 VISION_SLOT_ROUND_FEATURE 246 VISION_SLOT_SQUARE_FEATURE 248 VISION_SURFACE_POINT_FEATURE 241 WHILE_COMMAND 79 WRIST_SPEED 49 X_TEMPERATURE 405 XML_STATISTICS 189 Y_TEMPERATURE 406 Z_TEMPERATURE 407

| OBTYPE Enumeration |

| Member | Value | Description |
| --- | ADJUST_FILTER | 595 | ANALYSIS_VIEW | 176 | ANGLE_HIT | 107 | ANYORDER_EXECUTETOL | 215 | ARRAY_INDEX | 95 | ASME_SIZE_COMMAND | 1321 | ASME_TOLERANCE_COMMAND | 1302 | ASSIGNMENT | 195 | ATTACH_PROGRAM | 22 | AUTO_ANGLE_FEATURE | 643 | AUTO_BLOB | 626 | AUTO_CIRCLE | 648 | AUTO_CONE | 655 | AUTO_CORNER_FEATURE | 644 | AUTO_CYLINDER | 656 | AUTO_EDGE_FEATURE | 642 | AUTO_ELLIPSE | 649 | AUTO_FLUSH_GAP | 625 | AUTO_HIGH_FEATURE | 645 | AUTO_LINE | 646 | AUTO_NOTCH | 652 | AUTO_PLANE | 647 | AUTO_POLYGON | 654 | AUTO_PROFILE_2D | 623 | AUTO_ROUND_SLOT | 650 | AUTO_SET | 620 | AUTO_SPHERE | 657 | AUTO_SQUARE_SLOT | 651 | AUTO_SURFACE_FEATURE | 641 | AUTO_VECTOR_FEATURE | 640 | AUTOCALIB_MASTERSLAVE_COMMAND | 144 | AUTOCALIB_PROBE_COMMAND | 143 | AUTOTRIGGERCOMMAND | 116 | BASIC_HIT | 104 | BASIC_SCAN_OBJECT | 214 | BASIC_SCRIPT | 12346 | BF2D_ALIGN | 13 | BF3D_ALIGN | 15 | BFUSER_ALIGN | 17 | BUNDLE_ALIGN | 123 | CALIB_ASSEMBLY | 142 | CALIB_SPHERE | 141 | CALIBRATEROTAB_COMMAND | 901 | CALL_SUBROUTINE | 76 | CASE_COMMAND | 92 | CHECK_DISTANCE | 102 | CLAMP | 99 | CLEARANCE_PLANE | 130 | CNC_PASS_THRU_COMMAND | 807 | CNC_READ_VARIABLE | 806 | CNC_SELECT_TABLE_COMMAND | 808 | CNC_SET_PROTECTION_COMMAND | 803 | CNC_UPDATE_TOOLOFSET | 804 | CNC_UPDATE_WORKOFSET | 800 | CNC_USE_WORKOFSET | 801 | CNC_WRITE_VARIABLE | 805 | COLUMN132_DISPLAY | 181 | CONST_ALN_LINE | 548 | CONST_ALN_PLANE | 576 | CONST_BF_CIRCLE | 521 | CONST_BF_CONE | 552 | CONST_BF_CYLINDER | 561 | CONST_BF_ELLIPSE | 581 | CONST_BF_LINE | 541 | CONST_BF_PLANE | 571 | CONST_BF_SLOT | 506 | CONST_BF_SPHERE | 531 | CONST_BF_SQSLOT | 590 | CONST_BFRE_CIRCLE | 520 | CONST_BFRE_CONE | 551 | CONST_BFRE_CYLINDER | 560 | CONST_BFRE_ELLIPSE | 580 | CONST_BFRE_LINE | 540 | CONST_BFRE_PLANE | 570 | CONST_BFRE_SLOT | 507 | CONST_BFRE_SPHERE | 530 | CONST_BFRE_SQSLOT | 591 | CONST_CAST_CIRCLE | 525 | CONST_CAST_CONE | 555 | CONST_CAST_CYLINDER | 564 | CONST_CAST_ELLIPSE | 584 | CONST_CAST_LINE | 545 | CONST_CAST_PLANE | 574 | CONST_CAST_POINT | 517 | CONST_CAST_SLOT | 509 | CONST_CAST_SPHERE | 534 | CONST_CAST_SQSLOT | 593 | CONST_CONE_CIRCLE | 524 | CONST_CORNER_POINT | 518 | CONST_CYLINDER_CIRCLE | 538 | CONST_DROP_POINT | 514 | CONST_HIPNT_PLANE | 579 | CONST_INT_CIRCLE | 526 | CONST_INT_ELLIPSE | 585 | CONST_INT_LINE | 546 | CONST_INT_POINT | 516 | CONST_MID_LINE | 544 | CONST_MID_PLANE | 573 | CONST_MID_POINT | 513 | CONST_MIN_CIRCLE_SCAN | 528 | CONST_OFF_LINE | 547 | CONST_OFF_PLANE | 575 | CONST_OFF_POINT | 511 | CONST_ORIG_POINT | 510 | CONST_PIERCE_POINT | 515 | CONST_PLTO_LINE | 550 | CONST_PLTO_PLANE | 578 | CONST_PRIMARY_DATUM | 579 | CONST_PROJ_CIRCLE | 522 | CONST_PROJ_CONE | 553 | CONST_PROJ_CYLINDER | 562 | CONST_PROJ_ELLIPSE | 582 | CONST_PROJ_LINE | 542 | CONST_PROJ_POINT | 512 | CONST_PROJ_SLOT | 508 | CONST_PROJ_SPHERE | 532 | CONST_PROJ_SQSLOT | 592 | CONST_PRTO_LINE | 549 | CONST_PRTO_PLANE | 577 | CONST_REV_CIRCLE | 523 | CONST_REV_CONE | 554 | CONST_REV_CYLINDER | 563 | CONST_REV_ELLIPSE | 583 | CONST_REV_LINE | 543 | CONST_REV_PLANE | 572 | CONST_REV_SPHERE | 533 | CONST_ROUND_SLOT | 505 | CONST_SCAN_SEG_ARC | 527 | CONST_SCAN_SEG_LINE | 539 | CONST_SECONDARY_DATUM_LINE | 557 | CONST_SET | 596 | CONST_SPHERE_CIRCLE | 537 | CONST_TANCIRCLES_CIRCLE | 536 | CONST_TANGENT_PLANE | 579 | CONST_TANLINES_CIRCLE | 529 | CONST_TERTIARY_DATUM_POINT | 558 | CONST_TRANSLATED_PLANE | 569 | CONST_VECT_DIST_POINT | 519 | CONST_WIDTH2D_FEATURE | 586 | CONST_WIDTH3D_FEATURE | 587 | CONTACT_ANGLE_POINT_FEATURE | 605 | CONTACT_CIRCLE_FEATURE | 612 | CONTACT_CONE_FEATURE | 615 | CONTACT_CORNER_POINT_FEATURE | 606 | CONTACT_CYLINDER_FEATURE | 616 | CONTACT_EDGE_POINT_FEATURE | 604 | CONTACT_ELLIPSE_FEATURE | 621 | CONTACT_HIGH_POINT_FEATURE | 607 | CONTACT_LINE_FEATURE | 614 | CONTACT_PLANE_FEATURE | 617 | CONTACT_POLYGON_FEATURE | 627 | CONTACT_SLOT_NOTCH_FEATURE | 622 | CONTACT_SLOT_ROUND_FEATURE | 618 | CONTACT_SLOT_SQUARE_FEATURE | 619 | CONTACT_SPHERE_FEATURE | 613 | CONTACT_SURFACE_POINT_FEATURE | 603 | CONTACT_VECTOR_POINT_FEATURE | 602 | CORNER_HIT | 106 | CURVE_FEATURE | 38 | DATDEF_COMMAND | 1299 | DCCSCAN_OBJECT | 211 | DEFAULT_CASE_COMMAND | 94 | DIMENSION_2D_ANGLE | 1109 | DIMENSION_2D_DISTANCE | 1107 | DIMENSION_3D_ANGLE | 1108 | DIMENSION_3D_DISTANCE | 1106 | DIMENSION_A_LOCATION | 1007 | DIMENSION_ANGULARITY | 1112 | DIMENSION_CIRCULAR_RUNOUT | 1117 | DIMENSION_CIRCULARITY | 1101 | DIMENSION_COAXIALITY | 1114 | DIMENSION_CONCENTRICITY | 1111 | DIMENSION_CYLINDRICITY | 1116 | DIMENSION_D_LOCATION | 1005 | DIMENSION_END_LOCATION | 1001 | DIMENSION_FLATNESS | 1102 | DIMENSION_FLATNESS_LOCATION | 1018 | DIMENSION_FORMAT | 180 | DIMENSION_H_LOCATION | 1017 | DIMENSION_INFORMATION | 182 | DIMENSION_KEYIN | 1113 | DIMENSION_L_LOCATION | 1012 | DIMENSION_PA_LOCATION | 1010 | DIMENSION_PARALLELISM | 1104 | DIMENSION_PD_LOCATION | 1013 | DIMENSION_PERPENDICULARITY | 1103 | DIMENSION_PR_LOCATION | 1009 | DIMENSION_PROFILE | 1105 | DIMENSION_PROFILE_LINE | 1118 | DIMENSION_PROFILE_SURFACE | 1105 | DIMENSION_R_LOCATION | 1006 | DIMENSION_ROUNDNESS | 1101 | DIMENSION_ROUNDNESS_LOCATION | 1019 | DIMENSION_RS_LOCATION | 1016 | DIMENSION_RT_LOCATION | 1014 | DIMENSION_RUNOUT | 1110 | DIMENSION_S_LOCATION | 1015 | DIMENSION_START_LOCATION | 1000 | DIMENSION_STRAIGHTNESS | 1100 | DIMENSION_STRAIGHTNESS_LOCATION | 1020 | DIMENSION_SYMMETRY | 1115 | DIMENSION_T_LOCATION | 1008 | DIMENSION_TOTAL_RUNOUT | 1110 | DIMENSION_TRUE_D1_LOCATION | 1214 | DIMENSION_TRUE_D2_LOCATION | 1215 | DIMENSION_TRUE_D3_LOCATION | 1216 | DIMENSION_TRUE_DD_LOCATION | 1205 | DIMENSION_TRUE_DF_LOCATION | 1206 | DIMENSION_TRUE_DIAM_LOCATION | 1209 | DIMENSION_TRUE_END_POSITION | 1201 | DIMENSION_TRUE_FLATNESS_LOCATION | 1217 | DIMENSION_TRUE_LD_LOCATION | 1210 | DIMENSION_TRUE_LF_LOCATION | 1212 | DIMENSION_TRUE_LOCATION | 1220 | DIMENSION_TRUE_PA_LOCATION | 1208 | DIMENSION_TRUE_PR_LOCATION | 1207 | DIMENSION_TRUE_ROUNDNESS_LOCATION | 1218 | DIMENSION_TRUE_START_POSITION | 1200 | DIMENSION_TRUE_STRAIGHTNESS_LOCATION | 1219 | DIMENSION_TRUE_WD_LOCATION | 1211 | DIMENSION_TRUE_WF_LOCATION | 1213 | DIMENSION_TRUE_X_LOCATION | 1202 | DIMENSION_TRUE_Y_LOCATION | 1203 | DIMENSION_TRUE_Z_LOCATION | 1204 | DIMENSION_V_LOCATION | 1011 | DIMENSION_X_LOCATION | 1002 | DIMENSION_Y_LOCATION | 1003 | DIMENSION_Z_LOCATION | 1004 | DISPLAY_METAFILE | 702 | DISPLAYPRECISION | 114 | DO_COMMAND | 81 | EDGE_HIT | 109 | ELSE_COMMAND | 91 | ELSE_IF_COMMAND | 90 | END_ALIGN | 19 | END_CASE_COMMAND | 85 | END_DEFAULT_CASE_COMMAND | 87 | END_ELSE_COMMAND | 84 | END_ELSE_IF_COMMAND | 83 | END_HYPER_FORM | 12351 | END_HYPER_REPORT | 12349 | END_IF_COMMAND | 82 | END_MEASURED_FEATURE | 213 | END_MOVE_SWEEP | 159 | END_PROGRAM | 169 | END_READ_TEMPERATURE | 409 | END_SCRIPT | 12347 | END_SELECT_COMMAND | 86 | END_SUBROUTINE | 77 | ENDWHILE_COMMAND | 80 | EQUATE_ALIGN | 11 | EW_GROUP_END | 753 | EW_GROUP_START | 752 | EXTERNAL_COMMAND | 175 | FASTPROBEMODE_COMMAND | 902 | FEATURE_CONTROL_FRAME | 184 | FILE_IO_OBJECT | 96 | FILTER_SET | 598 | FLY_MODE | 168 | GAP_ONLY | 193 | GENERIC_CONSTRUCTION | 597 | GET_PROBE_DATA | 61 | GET_PROBECHANGER_DATA | 262 | GOTO_COMMAND | 73 | HYPER_CUSTOM | 12352 | HYPER_FORM | 12350 | HYPER_LABEL | 12356 | HYPER_LEGACY | 12348 | HYPER_REPORT | 12355 | HYPER_TEMPLATE | 12353 | IF_BLOCK_COMMAND | 89 | IF_GOTO_COMMAND | 74 | IGNOREMOTIONERRORS | 119 | IGNOREROTAB_COMMAND | 900 | INBETWEEN_TOL | 1301 | IOCHANNELCOMMAND | 120 | ISO_SIZE_COMMAND | 1320 | ISO_TOLERANCE_COMMAND | 1303 | ITER_ALIGN | 12 | LABEL_CMD | 72 | LASER_CIRCLE_FEATURE | 270 | LASER_CONE_FEATURE | 281 | LASER_CYLINDER_FEATURE | 279 | LASER_EDGE_POINT_FEATURE | 276 | LASER_FLUSH_AND_GAP_FEATURE | 274 | LASER_LINE_FEATURE | 277 | LASER_PLANE_FEATURE | 272 | LASER_POLYGON_FEATURE | 280 | LASER_SLOT_FEATURE | 273 | LASER_SLOT_SQUARE_FEATURE | 278 | LASER_SPHERE_FEATURE | 275 | LASER_SURFACE_POINT_FEATURE | 271 | LEAPFROG | 115 | LEVEL_ALIGN | 2 | LOAD_COLUMN | 173 | LOAD_FIXTURE | 172 | LOAD_MACHINE | 171 | LOOP_END | 71 | LOOP_START | 70 | MAN_DCC_MODE | 103 | MANRETRACT | 117 | MANSCAN_OBJECT | 212 | MEASURED_CIRCLE | 202 | MEASURED_CONE | 205 | MEASURED_CYLINDER | 206 | MEASURED_LINE | 204 | MEASURED_PLANE | 207 | MEASURED_POINT | 201 | MEASURED_ROUND_SLOT | 208 | MEASURED_SET | 210 | MEASURED_SPHERE | 203 | MEASURED_SQUARE_SLOT | 209 | MEASURED_TORUS | 200 | MESH_ALIGN | 18 | MESH_OPER_COLORMAP | 2024 | MESH_OPER_CROSSSECTION | 2026 | MESH_OPER_EMPTY | 2025 | MESH_OPER_FILEEXPORT | 2023 | MESH_OPER_FILEIMPORT | 2022 | MESH_OPER_THICKNESS_COLORMAP | 2028 | MOVE_ALL | 162 | MOVE_CIRCULAR | 155 | MOVE_CLEARP | 151 | MOVE_CLEARPOINT | 163 | MOVE_EXCLUSIVE | 161 | MOVE_INCREMENT | 154 | MOVE_PH9_OFFSET | 156 | MOVE_POINT | 150 | MOVE_ROTAB | 153 | MOVE_SPEED | 45 | MOVE_SWEEP_POINT | 160 | MOVE_SYNC | 157 | ONERROR | 78 | OPTIONMOTION | 112 | OPTIONPROBE | 111 | PART_TEMPERATURE | 408 | PLANNER_ANGLE_POINT_FEATURE | 2110 | PLANNER_CIRCLE_FEATURE | 2102 | PLANNER_CONE_FEATURE | 2108 | PLANNER_CORNER_POINT_FEATURE | 2111 | PLANNER_CYLINDER_FEATURE | 2107 | PLANNER_EDGE_POINT_FEATURE | 2101 | PLANNER_ELLIPSE_FEATURE | 2112 | PLANNER_LINE_FEATURE | 2103 | PLANNER_PLANE_FEATURE | 2104 | PLANNER_POLYGON_FEATURE | 2113 | PLANNER_SLOT_NOTCH_FEATURE | 2114 | PLANNER_SLOT_ROUND_FEATURE | 2105 | PLANNER_SLOT_SQUARE_FEATURE | 2106 | PLANNER_SPHERE_FEATURE | 2109 | PLANNER_VECTOR_POINT_FEATURE | 2100 | POINT_INFO | 183 | POINTCLOUD | 2001 | POINTCLOUD_ALIGN | 16 | POINTCLOUD_MESH | 2004 | POINTCLOUD_OPER | 2002 | POINTCLOUD_OPER_BOOLEAN | 2016 | POINTCLOUD_OPER_CLEAN | 2012 | POINTCLOUD_OPER_COLORMAPFACE | 2019 | POINTCLOUD_OPER_COLORMAPPNT | 2020 | POINTCLOUD_OPER_CROSSSECTION | 2021 | POINTCLOUD_OPER_EMPTY | 2013 | POINTCLOUD_OPER_FILEEXPORT | 2011 | POINTCLOUD_OPER_FILEIMPORT | 2010 | POINTCLOUD_OPER_FILTER | 2017 | POINTCLOUD_OPER_NEW | 2003 | POINTCLOUD_OPER_OLD | 2009 | POINTCLOUD_OPER_PURGE | 2015 | POINTCLOUD_OPER_RESET | 2014 | POINTCLOUD_OPER_SELECTION | 2018 | POINTCLOUD_OPER_THICKNESS_COLORMAP | 2029 | POLARVECTORCOMP | 113 | POSITIVE_REPORTING | 196 | PREHIT_DISTANCE | 100 | PRINT_FORM_FEED | 750 | PRINT_REPORT | 751 | PROBE_COMPENSATION | 140 | READ_POINT | 192 | READ_TEMPERATURE | 404 | RECALL_ALIGN | 10 | RECALL_VIEWSET | 51 | RETRACT_DISTANCE | 101 | RETROLINEAR_ONLY | 194 | RMEAS_MODE | 110 | ROTATE_ALIGN | 3 | ROTATE_CIRCLE_ALIGN | 14 | ROTATEOFF_ALIGN | 6 | SAVE_ALIGN | 9 | SCAN_SPEED | 47 | SECTION_2DRADIUS | 2027 | SELECT_COMMAND | 93 | SET_ACTIVE_TIP | 60 | SET_COMMENT | 170 | SET_WORKPLANE | 21 | SIMULTANEOUS_EVALUATION | 1300 | SNAPSHOT_COMMAND | 905 | SPC_CHART | 780 | START_ALIGN | 1 | START_MOVE_SWEEP | 158 | START_SUBROUTINE | 75 | STATISTICS | 190 | SURFACE_FEATURE | 39 | SURFACE_HIT | 108 | TABLE_FORMAT | 179 | TEMP_COMP | 62 | TEMP_COMP_ORIGIN | 63 | THICKNESS_GAGE | 2119 | THICKNESS_SCAN | 2120 | TOUCH_SPEED | 46 | TPS_CUSTOM_COMMAND | 402 | TRACEFIELD | 191 | TRACKER_CUSTOM_COMMAND | 401 | TRACKER_LEVEL_TO_GRAVITY | 233 | TRANS_ALIGN | 4 | TRANSOFF_ALIGN | 5 | TRIGGER_PLANE_COMMAND | 232 | TRIGGER_TOLERANCE | 231 | UNTIL_COMMAND | 88 | VECTOR_HIT | 105 | VIDEOSETUP | 118 | VIEWSET | 50 | VISION_ANGLE_POINT_FEATURE | 249 | VISION_CIRCLE_FEATURE | 245 | VISION_EDGE_POINT_FEATURE | 242 | VISION_ELLIPSE_FEATURE | 244 | VISION_IMAGE_CAPTURE | 253 | VISION_LINE_FEATURE | 243 | VISION_POLYGON_FEATURE | 251 | VISION_PROFILE_2D_FEATURE | 247 | VISION_SLOT_NOTCH_FEATURE | 250 | VISION_SLOT_ROUND_FEATURE | 246 | VISION_SLOT_SQUARE_FEATURE | 248 | VISION_SURFACE_POINT_FEATURE | 241 | WHILE_COMMAND | 79 | WRIST_SPEED | 49 | X_TEMPERATURE | 405 | XML_STATISTICS | 189 | Y_TEMPERATURE | 406 | Z_TEMPERATURE | 407

---

## OPTIONPROBE

# OPTIONPROBE Object

# Description

# Remarks

# See Also

OPTIONPROBE Members

The **OPTIONPROBE** object provides support for the Optional Probe command.

**Through this object you can get and set various properties of an option probe command in PC-DMIS. For more information on the option probe command, see the "Parameter Settings: Optional Probe tab" topic of the "Setting Your Preferences" section of the PC-DMIS Help File .

| OPTIONPROBE Object |

---

## PAXISTYPE

# PAXISTYPE Enumeration

# Members

Member Value Description PCD_XAXIS 1 Mirrors the virtual machine's X axis. PCD_YAXIS 2 Mirrors the virtual machine's Y axis. PCD_ZAXIS 0 Mirrors the virtual machine's Z axis.

| PAXISTYPE Enumeration |

| Member | Value | Description |
| --- | PCD_XAXIS | 1 | Mirrors the virtual machine's X axis. |
| PCD_YAXIS | 2 | Mirrors the virtual machine's Y axis. |
| PCD_ZAXIS | 0 | Mirrors the virtual machine's Z axis. |

---

## PCDBAUD

# PCDBAUD Enumeration

# Members

Member Value Description PCD_BAUD_110 1 PCD_BAUD_1200 4 PCD_BAUD_128000 12 PCD_BAUD_14400 8 PCD_BAUD_19200 9 PCD_BAUD_2400 5 PCD_BAUD_256000 13 PCD_BAUD_300 2 PCD_BAUD_38400 10 PCD_BAUD_4800 6 PCD_BAUD_56000 11 PCD_BAUD_600 3 PCD_BAUD_9600 7

| PCDBAUD Enumeration |

| Member | Value | Description |
| --- | PCD_BAUD_110 | 1 | PCD_BAUD_1200 | 4 | PCD_BAUD_128000 | 12 | PCD_BAUD_14400 | 8 | PCD_BAUD_19200 | 9 | PCD_BAUD_2400 | 5 | PCD_BAUD_256000 | 13 | PCD_BAUD_300 | 2 | PCD_BAUD_38400 | 10 | PCD_BAUD_4800 | 6 | PCD_BAUD_56000 | 11 | PCD_BAUD_600 | 3 | PCD_BAUD_9600 | 7

---

## PCDCOMMENT

# PCDCOMMENT Enumeration

# Members

Member Value Description PCD_INPUT 2 PCD_OPERATOR 0 PCD_REPORT 1

| PCDCOMMENT Enumeration |

| Member | Value | Description |
| --- | PCD_INPUT | 2 | PCD_OPERATOR | 0 | PCD_REPORT | 1

---

## PCDDATABITS

# PCDDATABITS Enumeration

# Members

Member Value Description PCD_DATA7 20 PCD_DATA8 19

| PCDDATABITS Enumeration |

| Member | Value | Description |
| --- | PCD_DATA7 | 20 | PCD_DATA8 | 19

---

## PCDDIMTYPES

# PCDDIMTYPES Enumeration

# Members

Member Value Description DIM__2D_ANGLE 1109 DIM__2D_DISTANCE 1107 DIM__3D_ANGLE 1108 DIM__3D_DISTANCE 1106 DIM__ANGULARITY 1112 DIM__CONCENTRICITY 1111 DIM__FLATNESS 1102 DIM__KEYIN 1113 DIM__LOCATION 1000 DIM__PARALLELISM 1104 DIM__PERPENDICULARITY 1103 DIM__PROFILE 1105 DIM__ROUNDNESS 1101 DIM__RUNOUT 1110 DIM__STRAIGHTNESS 1100 DIM__TRUE_POSITION 1200

| PCDDIMTYPES Enumeration |

| Member | Value | Description |
| --- | DIM__2D_ANGLE | 1109 | DIM__2D_DISTANCE | 1107 | DIM__3D_ANGLE | 1108 | DIM__3D_DISTANCE | 1106 | DIM__ANGULARITY | 1112 | DIM__CONCENTRICITY | 1111 | DIM__FLATNESS | 1102 | DIM__KEYIN | 1113 | DIM__LOCATION | 1000 | DIM__PARALLELISM | 1104 | DIM__PERPENDICULARITY | 1103 | DIM__PROFILE | 1105 | DIM__ROUNDNESS | 1101 | DIM__RUNOUT | 1110 | DIM__STRAIGHTNESS | 1100 | DIM__TRUE_POSITION | 1200

---

## PCDFILEPRINTFORMAT

# PCDFILEPRINTFORMAT Enumeration

# Members

Member Value Description PCD_3DPDF 3 PCD_PDF 1 Writes information to a PDF file. PCD_RTF 0 Writes information to an RTF file. PCD_TXT 2

| PCDFILEPRINTFORMAT Enumeration |

| Member | Value | Description |
| --- | PCD_3DPDF | 3 | PCD_PDF | 1 | Writes information to a PDF file. |
| PCD_RTF | 0 | Writes information to an RTF file. |
| PCD_TXT | 2

---

## PCDGETPOINTSTYPES

# PCDGETPOINTSTYPES Enumeration

# Members

Member Value Description PCD__BALLCENTER 604 PCD__CENTROID 603 PCD_VECTOR 608

| PCDGETPOINTSTYPES Enumeration |

| Member | Value | Description |
| --- | PCD__BALLCENTER | 604 | PCD__CENTROID | 603 | PCD_VECTOR | 608

---

## PCDHANDSHAKE

# PCDHANDSHAKE Enumeration

# Members

Member Value Description PCD_DTRDSR 24 PCD_RTSCTS 25 PCD_XONXOFF 26

| PCDHANDSHAKE Enumeration |

| Member | Value | Description |
| --- | PCD_DTRDSR | 24 | PCD_RTSCTS | 25 | PCD_XONXOFF | 26

---

## PCDMEASTHEO

# PCDMEASTHEO Enumeration

# Members

Member Value Description PCD__MEAS 3 PCD_THEO 2

| PCDMEASTHEO Enumeration |

| Member | Value | Description |
| --- | PCD__MEAS | 3 | PCD_THEO | 2

---

## PCDONOFF

# PCDONOFF Enumeration

# Members

Member Value Description PCD_OFF 0 PCD_ON -1

| PCDONOFF Enumeration |

| Member | Value | Description |
| --- | PCD_OFF | 0 | PCD_ON | -1

---

## PCDPARITY

# PCDPARITY Enumeration

# Members

Member Value Description PCD_EVENPARITY 15 PCD_MARKPARITY 17 PCD_NOPARITY 14 PCD_ODDPARITY 16 PCD_SPACEPARITY 18

| PCDPARITY Enumeration |

| Member | Value | Description |
| --- | PCD_EVENPARITY | 15 | PCD_MARKPARITY | 17 | PCD_NOPARITY | 14 | PCD_ODDPARITY | 16 | PCD_SPACEPARITY | 18

---

## PCDPRINTFILEMODE

# PCDPRINTFILEMODE Enumeration

# Members

Member Value Description PCD_APPEND 1 Appends information to the end of the file. PCD_AUTO 4 Automatically increments a numeric extension for the output file name. PCD_NEWFILE 2 Sends information to a new file. PCD_OVERWRITE 3 Overwrites information in the current file. PCD_PROMPT 5 Prompts the user for a filename.

| PCDPRINTFILEMODE Enumeration |

| Member | Value | Description |
| --- | PCD_APPEND | 1 | Appends information to the end of the file. |
| PCD_AUTO | 4 | Automatically increments a numeric extension for the output file name. |
| PCD_NEWFILE | 2 | Sends information to a new file. |
| PCD_OVERWRITE | 3 | Overwrites information in the current file. |
| PCD_PROMPT | 5 | Prompts the user for a filename. |

---

## PCDPRINTLOC

# PCDPRINTLOC Enumeration

# Members

Member Value Description PCD___OFF 0 No destination for printed data. PCD_FILE 2 Destination for the printed data is a file. PCD_PRINTER 1 Destination for the printed data is printer.

| PCDPRINTLOC Enumeration |

| Member | Value | Description |
| --- | PCD___OFF | 0 | No destination for printed data. |
| PCD_FILE | 2 | Destination for the printed data is a file. |
| PCD_PRINTER | 1 | Destination for the printed data is printer. |

---

## PCDREPORTSETTINGS

# PCDREPORTSETTINGS Enumeration

# Members

Member Value Description PCD_ALIGNMENTS 2 PCD_COMMENTS 8 PCD_DIMENSIONS 16 PCD_FEATURES 1 PCD_HITS 32 PCD_MOVES 4 PCD_OUTTOL_ONLY 64

| PCDREPORTSETTINGS Enumeration |

| Member | Value | Description |
| --- | PCD_ALIGNMENTS | 2 | PCD_COMMENTS | 8 | PCD_DIMENSIONS | 16 | PCD_FEATURES | 1 | PCD_HITS | 32 | PCD_MOVES | 4 | PCD_OUTTOL_ONLY | 64

---

## PCDSCANDIR1

# PCDSCANDIR1 Enumeration

# Members

Member Value Description PCD_BODY 7 PCD_LINE 203 PCD_VARIABLE 8

| PCDSCANDIR1 Enumeration |

| Member | Value | Description |
| --- | PCD_BODY | 7 | PCD_LINE | 203 | PCD_VARIABLE | 8

---

## PCDSCANDIR2

# PCDSCANDIR2 Enumeration

# Members

Member Value Description PCD__BODY 7 PCD__LINE 203

| PCDSCANDIR2 Enumeration |

| Member | Value | Description |
| --- | PCD__BODY | 7 | PCD__LINE | 203

---

## PCDSCANHITFLAG

# PCDSCANHITFLAG Enumeration

# Members

Member Value Description PCD_EXTERIOR 0 PCD_INTERIOR 8

| PCDSCANHITFLAG Enumeration |

| Member | Value | Description |
| --- | PCD_EXTERIOR | 0 | PCD_INTERIOR | 8

---

## PCDSCANHITTYPE

# PCDSCANHITTYPE Enumeration

# Members

Member Value Description PCD_ANGLEHIT 20 PCD_EDGEHIT 19 PCD_SURFACEHIT 18 PCD_VECTORHIT 17

| PCDSCANHITTYPE Enumeration |

| Member | Value | Description |
| --- | PCD_ANGLEHIT | 20 | PCD_EDGEHIT | 19 | PCD_SURFACEHIT | 18 | PCD_VECTORHIT | 17

---

## PCDSCANTECHNIQUE

# PCDSCANTECHNIQUE Enumeration

# Members

Member Value Description PCD_CUTAXIS 12 PCD_FIXED_DELTA 9 PCD_TIME_DELTA 11 PCD_VARIABLE_DELTA 10

| PCDSCANTECHNIQUE Enumeration |

| Member | Value | Description |
| --- | PCD_CUTAXIS | 12 | PCD_FIXED_DELTA | 9 | PCD_TIME_DELTA | 11 | PCD_VARIABLE_DELTA | 10

---

## PCDSCANVECTOR

# PCDSCANVECTOR Enumeration

# Members

Member Value Description PCD_CUTVECTOR 13 PCD_INITDIR 15 PCD_INITTOUCH 14 PCD_ROWEND_APPROACH 16

| PCDSCANVECTOR Enumeration |

| Member | Value | Description |
| --- | PCD_CUTVECTOR | 13 | PCD_INITDIR | 15 | PCD_INITTOUCH | 14 | PCD_ROWEND_APPROACH | 16

---

## PCDSCANVECTORSURF

# PCDSCANVECTORSURF Enumeration

# Members

Member Value Description PCD_BOUNDARY_PLANE 23 PCD_SIDE_SURFACE 22 PCD_TOP_SURFACE 21

| PCDSCANVECTORSURF Enumeration |

| Member | Value | Description |
| --- | PCD_BOUNDARY_PLANE | 23 | PCD_SIDE_SURFACE | 22 | PCD_TOP_SURFACE | 21

---

## PCDSTARTDIMFLAGS

# PCDSTARTDIMFLAGS Enumeration

# Members

Member Value Description PCD_ADD_RADIUS 2 PCD_LMC_LMC 4096 PCD_LMC_MMC 1024 PCD_LMC_RFS 512 PCD_MMC_LMC 256 PCD_MMC_MMC 128 PCD_MMC_RFS 64 PCD_NO_RADIUS 0 PCD_PAR_TO 16384 PCD_PERP_TO 8192 PCD_RECALC_NOMS 65536 PCD_RFS_LMC 32 PCD_RFS_MMC 16 PCD_RFS_RFS 8 PCD_SUB_RADIUS 4

| PCDSTARTDIMFLAGS Enumeration |

| Member | Value | Description |
| --- | PCD_ADD_RADIUS | 2 | PCD_LMC_LMC | 4096 | PCD_LMC_MMC | 1024 | PCD_LMC_RFS | 512 | PCD_MMC_LMC | 256 | PCD_MMC_MMC | 128 | PCD_MMC_RFS | 64 | PCD_NO_RADIUS | 0 | PCD_PAR_TO | 16384 | PCD_PERP_TO | 8192 | PCD_RECALC_NOMS | 65536 | PCD_RFS_LMC | 32 | PCD_RFS_MMC | 16 | PCD_RFS_RFS | 8 | PCD_SUB_RADIUS | 4

---

## PCDSTARTFEATFLAGS

# PCDSTARTFEATFLAGS Enumeration

# Members

Member Value Description PCD__BACK 5 PCD__BOTTOM 1 PCD__EXTERIOR 0 Exterior angle hit. Only used for auto angle hits. Do not or with PCD_INTERIOR. Default. PCD__FRONT 4 PCD__INTERIOR 8 Interior angle hit. Only used for auto angle hits. Should not be combined with PCD_EXTERIOR. PCD__LEFT 2 PCD__RECALC_NOMS 65536 Indicates that the theoretical values should be recalculated based on the theoretical hit values. PCD__RIGHT 3 PCD__TOP 0 PCD__XAXIS 2 PCD__XMINUS 3 PCD__XPLUS 2 PCD__YAXIS 4 PCD__YMINUS 5 PCD__YPLUS 4 PCD__ZAXIS 0 PCD__ZMINUS 1 PCD__ZPLUS 0 PCD_ANGLE 256 Cone reports its angle as opposed to length. Should not be combined with PCD_LENGTH. PCD_AUTOMOVE 131072 Causes move points to be automatically generated for auto features. PCD_BND 512 Bound line. Should not be combined with PCD_UNBND. PCD_FINDHOLE 262144 For Auto Circles. Automatic finding of holes. PCD_HEM 4096 For auto edge points only. Should not be ored with PCD_TRIM. PCD_IN 128 Inside circle, sphere, cone, or cylinder. Should not be combined with PCD_OUT. PCD_LENGTH 0 Cone reports its length as opposed to angle. Do not or with PCD_ANGLE. Default. PCD_LINE_3D 32768 3D line. Used only for best fit lines. Default is a 2D line. PCD_MEASURE_BOTH 2048 Sets measure order. For auto edge points only. PCD_MEASURE_EDGE 1024 Sets measure order. For auto edge points only. PCD_MEASURE_SURFACE 0 Sets measure order. For auto edge points only. Default. PCD_MEASURE_WIDTH 524288 Flag for Auto Square Slots. PCD_NORM 0 For auto circles, cylinders, ellipses, and slots. Do not combine with PCD_PIN. Default. PCD_OUT 0 Outside circle, sphere, cone, or cylinder. Should not be used with PCD_IN. Default. PCD_PIN 8192 For auto circles, cylinders, ellipses, and slots. Do not or with PCD_NORM. PCD_POLR 64 Values are reported in cylindrical coordinates. Should not be combined with PCD_RECT. PCD_READPOS 16384 Turn read position on. For auto circles, cylinders, ellipses, and slots. Defaults to off. PCD_RECT 0 Values are in rectangular coordinates. Should not be combined with PCD_POLR. Default. PCD_TRIM 0 For auto edge points only. Should not be ored with PCD_HEM. Default. PCD_UNBND 0 Unbound line. Should not be ored with PCD_BND. Default.

| PCDSTARTFEATFLAGS Enumeration |

| Member | Value | Description |
| --- | PCD__BACK | 5 | PCD__BOTTOM | 1 | PCD__EXTERIOR | 0 | Exterior angle hit. Only used for auto angle hits. Do not or with PCD_INTERIOR. Default. |
| PCD__FRONT | 4 | PCD__INTERIOR | 8 | Interior angle hit. Only used for auto angle hits. Should not be combined with PCD_EXTERIOR. |
| PCD__LEFT | 2 | PCD__RECALC_NOMS | 65536 | Indicates that the theoretical values should be recalculated based on the theoretical hit values. |
| PCD__RIGHT | 3 | PCD__TOP | 0 | PCD__XAXIS | 2 | PCD__XMINUS | 3 | PCD__XPLUS | 2 | PCD__YAXIS | 4 | PCD__YMINUS | 5 | PCD__YPLUS | 4 | PCD__ZAXIS | 0 | PCD__ZMINUS | 1 | PCD__ZPLUS | 0 | PCD_ANGLE | 256 | Cone reports its angle as opposed to length. Should not be combined with PCD_LENGTH. |
| PCD_AUTOMOVE | 131072 | Causes movepoints to be automatically generated for auto features. |
| PCD_BND | 512 | Bound line. Should not be combined with PCD_UNBND. |
| PCD_FINDHOLE | 262144 | For Auto Circles. Automatic finding of holes. |
| PCD_HEM | 4096 | For auto edge points only. Should not be ored with PCD_TRIM. |
| PCD_IN | 128 | Inside circle, sphere, cone, or cylinder. Should not be combined with PCD_OUT. |
| PCD_LENGTH | 0 | Cone reports its length as opposed to angle. Do not or with PCD_ANGLE. Default. |
| PCD_LINE_3D | 32768 | 3D line. Used only for best fit lines. Default is a 2D line. |
| PCD_MEASURE_BOTH | 2048 | Sets measure order. For auto edge points only. |
| PCD_MEASURE_EDGE | 1024 | Sets measure order. For auto edge points only. |
| PCD_MEASURE_SURFACE | 0 | Sets measure order. For auto edge points only. Default. |
| PCD_MEASURE_WIDTH | 524288 | Flag for Auto Square Slots. |
| PCD_NORM | 0 | For auto circles, cylinders, ellipses, and slots. Do not combine with PCD_PIN. Default. |
| PCD_OUT | 0 | Outside circle, sphere, cone, or cylinder. Should not be used with PCD_IN. Default. |
| PCD_PIN | 8192 | For auto circles, cylinders, ellipses, and slots. Do not or with PCD_NORM. |
| PCD_POLR | 64 | Values are reported in cylindrical coordinates. Should not be combined with PCD_RECT. |
| PCD_READPOS | 16384 | Turn read position on. For auto circles, cylinders, ellipses, and slots. Defaults to off. |
| PCD_RECT | 0 | Values are in rectangular coordinates. Should not be combined with PCD_POLR. Default. |
| PCD_TRIM | 0 | For auto edge points only. Should not be ored with PCD_HEM. Default. |
| PCD_UNBND | 0 | Unbound line. Should not be ored with PCD_BND. Default. |

---

## PCDSTARTFEATTYPES

# PCDSTARTFEATTYPES Enumeration

# Members

Member Value Description AUTO__ANGLE_HIT 605 AUTO__CIRCLE 612 AUTO__CORNER_HIT 606 AUTO__CYLINDER 616 AUTO__EDGE_HIT 604 AUTO__ELLIPSE 621 AUTO__ROUND_SLOT 618 AUTO__SPHERE 613 AUTO__SQUARE_SLOT 619 AUTO__SURFACE_HIT 603 AUTO__VECTOR_HIT 602 CONST__ALN_LINE 548 CONST__ALN_PLANE 576 CONST__BF_CIRCLE 521 CONST__BF_CONE 552 CONST__BF_CYLINDER 561 CONST__BF_LINE 541 CONST__BF_PLANE 571 CONST__BF_SPHERE 531 CONST__BFRE_CIRCLE 520 CONST__BFRE_CONE 551 CONST__BFRE_CYLINDER 560 CONST__BFRE_LINE 540 CONST__BFRE_PLANE 570 CONST__BFRE_SPHERE 530 CONST__CAST_CIRCLE 525 CONST__CAST_CONE 555 CONST__CAST_CYLINDER 564 CONST__CAST_LINE 545 CONST__CAST_PLANE 574 CONST__CAST_POINT 517 CONST__CAST_SPHERE 534 CONST__CONE_CIRCLE 524 CONST__CORNER_POINT 518 CONST__DROP_POINT 514 CONST__HIPNT_PLANE 579 CONST__INT_CIRCLE 526 CONST__INT_LINE 546 CONST__INT_POINT 516 CONST__MID_LINE 544 CONST__MID_PLANE 573 CONST__MID_POINT 513 CONST__OFF_LINE 547 CONST__OFF_PLANE 575 CONST__OFF_POINT 511 CONST__ORIG_POINT 510 CONST__PIERCE_POINT 515 CONST__PLTO_LINE 550 CONST__PLTO_PLANE 578 CONST__PROJ_CIRCLE 522 CONST__PROJ_CONE 553 CONST__PROJ_CYLINDER 562 CONST__PROJ_LINE 542 CONST__PROJ_POINT 512 CONST__PROJ_SPHERE 532 CONST__PRTO_LINE 549 CONST__PRTO_PLANE 577 CONST__REV_CIRCLE 523 CONST__REV_CONE 554 CONST__REV_CYLINDER 563 CONST__REV_LINE 543 CONST__REV_PLANE 572 CONST__REV_SPHERE 533 CONST__SCAN_SEG_ARC 527 CONST__SCAN_SEG_LINE 539 CONST__SET 596 MEAS_CIRCLE 202 MEAS_CONE 205 MEAS_CYLINDER 206 MEAS_LINE 204 MEAS_PLANE 207 MEAS_POINT 201 MEAS_SET 210 MEAS_SPHERE 203 MEASURED__CIRCLE 202 MEASURED__CONE 205 MEASURED__CYLINDER 206 MEASURED__LINE 204 MEASURED__PLANE 207 MEASURED__POINT 201 MEASURED__SET 210 MEASURED__SPHERE 203 PCD__CURVE 38 READ__POINT 192

| PCDSTARTFEATTYPES Enumeration |

| Member | Value | Description |
| --- | AUTO__ANGLE_HIT | 605 | AUTO__CIRCLE | 612 | AUTO__CORNER_HIT | 606 | AUTO__CYLINDER | 616 | AUTO__EDGE_HIT | 604 | AUTO__ELLIPSE | 621 | AUTO__ROUND_SLOT | 618 | AUTO__SPHERE | 613 | AUTO__SQUARE_SLOT | 619 | AUTO__SURFACE_HIT | 603 | AUTO__VECTOR_HIT | 602 | CONST__ALN_LINE | 548 | CONST__ALN_PLANE | 576 | CONST__BF_CIRCLE | 521 | CONST__BF_CONE | 552 | CONST__BF_CYLINDER | 561 | CONST__BF_LINE | 541 | CONST__BF_PLANE | 571 | CONST__BF_SPHERE | 531 | CONST__BFRE_CIRCLE | 520 | CONST__BFRE_CONE | 551 | CONST__BFRE_CYLINDER | 560 | CONST__BFRE_LINE | 540 | CONST__BFRE_PLANE | 570 | CONST__BFRE_SPHERE | 530 | CONST__CAST_CIRCLE | 525 | CONST__CAST_CONE | 555 | CONST__CAST_CYLINDER | 564 | CONST__CAST_LINE | 545 | CONST__CAST_PLANE | 574 | CONST__CAST_POINT | 517 | CONST__CAST_SPHERE | 534 | CONST__CONE_CIRCLE | 524 | CONST__CORNER_POINT | 518 | CONST__DROP_POINT | 514 | CONST__HIPNT_PLANE | 579 | CONST__INT_CIRCLE | 526 | CONST__INT_LINE | 546 | CONST__INT_POINT | 516 | CONST__MID_LINE | 544 | CONST__MID_PLANE | 573 | CONST__MID_POINT | 513 | CONST__OFF_LINE | 547 | CONST__OFF_PLANE | 575 | CONST__OFF_POINT | 511 | CONST__ORIG_POINT | 510 | CONST__PIERCE_POINT | 515 | CONST__PLTO_LINE | 550 | CONST__PLTO_PLANE | 578 | CONST__PROJ_CIRCLE | 522 | CONST__PROJ_CONE | 553 | CONST__PROJ_CYLINDER | 562 | CONST__PROJ_LINE | 542 | CONST__PROJ_POINT | 512 | CONST__PROJ_SPHERE | 532 | CONST__PRTO_LINE | 549 | CONST__PRTO_PLANE | 577 | CONST__REV_CIRCLE | 523 | CONST__REV_CONE | 554 | CONST__REV_CYLINDER | 563 | CONST__REV_LINE | 543 | CONST__REV_PLANE | 572 | CONST__REV_SPHERE | 533 | CONST__SCAN_SEG_ARC | 527 | CONST__SCAN_SEG_LINE | 539 | CONST__SET | 596 | MEAS_CIRCLE | 202 | MEAS_CONE | 205 | MEAS_CYLINDER | 206 | MEAS_LINE | 204 | MEAS_PLANE | 207 | MEAS_POINT | 201 | MEAS_SET | 210 | MEAS_SPHERE | 203 | MEASURED__CIRCLE | 202 | MEASURED__CONE | 205 | MEASURED__CYLINDER | 206 | MEASURED__LINE | 204 | MEASURED__PLANE | 207 | MEASURED__POINT | 201 | MEASURED__SET | 210 | MEASURED__SPHERE | 203 | PCD__CURVE | 38 | READ__POINT | 192

---

## PCDSTARTSCANFLAGS

# PCDSTARTSCANFLAGS Enumeration

# Members

Member Value Description PCD_AUTOCLEARPLANE 8 PCD_HITNOTDISPLAYED 16 PCD_MASTERMODE 2 PCD_RELEARNMODE 4 PCD_SINGLEPOINT 1

| PCDSTARTSCANFLAGS Enumeration |

| Member | Value | Description |
| --- | PCD_AUTOCLEARPLANE | 8 | PCD_HITNOTDISPLAYED | 16 | PCD_MASTERMODE | 2 | PCD_RELEARNMODE | 4 | PCD_SINGLEPOINT | 1

---

## PCDSTARTSCANTYPES

# PCDSTARTSCANTYPES Enumeration

# Members

Member Value Description PCD_HPROBE 5 PCD_LINEAR_CLOSED 2 PCD_LINEAR_OPEN 1 PCD_MANUALTTP 4 PCD_PATCH 3 PCD_PERIMETER 25 PCD_SECTION 24

| PCDSTARTSCANTYPES Enumeration |

| Member | Value | Description |
| --- | PCD_HPROBE | 5 | PCD_LINEAR_CLOSED | 2 | PCD_LINEAR_OPEN | 1 | PCD_MANUALTTP | 4 | PCD_PATCH | 3 | PCD_PERIMETER | 25 | PCD_SECTION | 24

---

## PCDSTATSFLAGS

# PCDSTATSFLAGS Enumeration

# Members

Member Value Description PCD_DO_CONTROL_CALCS 2 PCD_USE_DIM_NAME 0 PCD_USE_FEAT_NAME 1

| PCDSTATSFLAGS Enumeration |

| Member | Value | Description |
| --- | PCD_DO_CONTROL_CALCS | 2 | PCD_USE_DIM_NAME | 0 | PCD_USE_FEAT_NAME | 1

---

## PCDSTOPBITS

# PCDSTOPBITS Enumeration

# Members

Member Value Description PCD_ONE5STOPBITS 22 PCD_ONESTOPBIT 21 PCD_TWOSTOPBITS 23

| PCDSTOPBITS Enumeration |

| Member | Value | Description |
| --- | PCD_ONE5STOPBITS | 22 | PCD_ONESTOPBIT | 21 | PCD_TWOSTOPBITS | 23

---

## PCDYESNO

# PCDYESNO Enumeration

# Members

Member Value Description PCD_NO 0 PCD_YES -1

| PCDYESNO Enumeration |

| Member | Value | Description |
| --- | PCD_NO | 0 | PCD_YES | -1

---

## PropertySheetTypes

# PropertySheetTypes Enumeration

# Members

Member Value Description GenericSheet 0 ReportConfigurationSheet 1

| PropertySheetTypes Enumeration |

| Member | Value | Description |
| --- | GenericSheet | 0 | ReportConfigurationSheet | 1

---

## QUALIFICATION_SETTINGS_MODE

# QUALIFICATION_SETTINGS_MODE Enumeration

# Members

Member Value Description PCD_QUALIFICATION_SETTING_MODE_DCC 1 PCD_QUALIFICATION_SETTING_MODE_DCC_PLUS_DCC 3 PCD_QUALIFICATION_SETTING_MODE_MANUAL 0 PCD_QUALIFICATION_SETTING_MODE_MANUAL_PLUS_DCC 2

| QUALIFICATION_SETTINGS_MODE Enumeration |

| Member | Value | Description |
| --- | PCD_QUALIFICATION_SETTING_MODE_DCC | 1 | PCD_QUALIFICATION_SETTING_MODE_DCC_PLUS_DCC | 3 | PCD_QUALIFICATION_SETTING_MODE_MANUAL | 0 | PCD_QUALIFICATION_SETTING_MODE_MANUAL_PLUS_DCC | 2

---

## QdasOutputFileToggleType

# QdasOutputFileToggleType Enumeration

# Members

Member Value Description DFQ 1 DFX_DFD 2

| QdasOutputFileToggleType Enumeration |

| Member | Value | Description |
| --- | DFQ | 1 | DFX_DFD | 2

---

## RPROGOPTIONSTYPE

# RPROGOPTIONSTYPE Enumeration

# Members

Member Value Description PCD_AUTOPREHIT 2 PCD_AUTOPROJREFPLANE 4 PCD_AUTOTIPSELECT 1 PCD_DISPSPEEDS 8 PCD_ENDKEY 16 PCD_EXTSHEETMETAL 32 PCD_FLYMODE 64 PCD_HASINDEXPH9 6 PCD_HASINDEXROTTABLE 7 PCD_HASMANPH9 9 PCD_HASMANROTTABLE 11 PCD_HASPH9 13 PCD_HASPHS 10 PCD_HASROTTABLE 12 PCD_ISARMTYPECMM 5 PCD_ISONLINE 3 PCD_TABLEAVOIDANCE 128 PCD_USEDIMCOLORS 256

| RPROGOPTIONSTYPE Enumeration |

| Member | Value | Description |
| --- | PCD_AUTOPREHIT | 2 | PCD_AUTOPROJREFPLANE | 4 | PCD_AUTOTIPSELECT | 1 | PCD_DISPSPEEDS | 8 | PCD_ENDKEY | 16 | PCD_EXTSHEETMETAL | 32 | PCD_FLYMODE | 64 | PCD_HASINDEXPH9 | 6 | PCD_HASINDEXROTTABLE | 7 | PCD_HASMANPH9 | 9 | PCD_HASMANROTTABLE | 11 | PCD_HASPH9 | 13 | PCD_HASPHS | 10 | PCD_HASROTTABLE | 12 | PCD_ISARMTYPECMM | 5 | PCD_ISONLINE | 3 | PCD_TABLEAVOIDANCE | 128 | PCD_USEDIMCOLORS | 256

---

## RPROGVALUESTYPE

# RPROGVALUESTYPE Enumeration

# Members

Member Value Description PCD_AUTOTRIGDISTANCE 5 PCD_DIMPLACES 3 PCD_MANRETRACT 7 PCD_MEASSCALE 8 PCD_PH9WARNDELTA 9 PCD_PROBERADIUS 2 PCD_ROTTABLEANGLE 1 PCD_TABLETOL 6 PCD_VALISYSERRTIMEOUT 10

| RPROGVALUESTYPE Enumeration |

| Member | Value | Description |
| --- | PCD_AUTOTRIGDISTANCE | 5 | PCD_DIMPLACES | 3 | PCD_MANRETRACT | 7 | PCD_MEASSCALE | 8 | PCD_PH9WARNDELTA | 9 | PCD_PROBERADIUS | 2 | PCD_ROTTABLEANGLE | 1 | PCD_TABLETOL | 6 | PCD_VALISYSERRTIMEOUT | 10

---

## RPT_MIRROR_OPT

# RPT_MIRROR_OPT Enumeration

# Members

Member Value Description RPT_MIRROR_HORIZONTAL 1 Mirrors CAD images horizontally. RPT_MIRROR_NONE 0 Does not mirror CAD images at all. RPT_MIRROR_VERTICAL 2 Mirrors CAD images vertically.

| RPT_MIRROR_OPT Enumeration |

| Member | Value | Description |
| --- | RPT_MIRROR_HORIZONTAL | 1 | Mirrors CAD images horizontally. |
| RPT_MIRROR_NONE | 0 | Does not mirror CAD images at all. |
| RPT_MIRROR_VERTICAL | 2 | Mirrors CAD images vertically. |

---

## RS_ACCESS

# RS_ACCESS Enumeration

# Members

Member Value Description RSA_ADMINISTRATOR 0 RSA_USER 1

| RS_ACCESS Enumeration |

| Member | Value | Description |
| --- | RSA_ADMINISTRATOR | 0 | RSA_USER | 1

---

## RS_GROUP

# RS_GROUP Enumeration

# Members

Member Value Description RSG_MACHINE 1 RSG_USER 0

| RS_GROUP Enumeration |

| Member | Value | Description |
| --- | RSG_MACHINE | 1 | RSG_USER | 0

---

## STATISTICS

# STATISTICS Object

# Description

# See Also

STATISTICS Members

The **Statistics** object gives access to the properties and data members of the PC-DMIS Statistics command.

| STATISTICS Object |

---

## ScreenColorGradientType

# ScreenColorGradientType Enumeration

# Members

Member Value Description BottomLeft 5 BottomRight 6 LeftRight 2 None 0 TopBottom 1 TopLeft 3 TopRight 4

| ScreenColorGradientType Enumeration |

| Member | Value | Description |
| --- | BottomLeft | 5 | BottomRight | 6 | LeftRight | 2 | None | 0 | TopBottom | 1 | TopLeft | 3 | TopRight | 4

---

## TOOLTYPES

# TOOLTYPES Enumeration

# Members

Member Value Description TOOLCUBE 2 TOOLRING 1 TOOLSPHERE 0

| TOOLTYPES Enumeration |

| Member | Value | Description |
| --- | TOOLCUBE | 2 | TOOLRING | 1 | TOOLSPHERE | 0

---

## TRACEFIELD

# TRACEFIELD Object

# Description

# See Also

TRACEFIELD Members

**The **Tracefield** object gives access to the name and value properties of the PC-DMIS Tracefield command. For additional information on this command see "Using Trace Field" in the "Tracking Statistical Data" section of the PC-DMIS documentation .

| TRACEFIELD Object |

---

## TraceDataSourceEnum

# TraceDataSourceEnum Enumeration

# Members

Member Value Description SourceNone 0 SourceQdas 1

| TraceDataSourceEnum Enumeration |

| Member | Value | Description |
| --- | SourceNone | 0 | SourceQdas | 1

---

## TraceValueTypeEnum

# TraceValueTypeEnum Enumeration

# Members

Member Value Description AlphaNumerical 4 DateTime 3 FileName 5 SpecialCoding 6 TypeFloat 2 TypeInteger 1 ValueTypeNone 0

| TraceValueTypeEnum Enumeration |

| Member | Value | Description |
| --- | AlphaNumerical | 4 | DateTime | 3 | FileName | 5 | SpecialCoding | 6 | TypeFloat | 2 | TypeInteger | 1 | ValueTypeNone | 0

---

## UNITTYPE

# UNITTYPE Enumeration

# Members

Member Value Description INCH 0 MM 1

| UNITTYPE Enumeration |

| Member | Value | Description |
| --- | INCH | 0 | MM | 1

---

## VARIABLE_TYPE_TYPES

# VARIABLE_TYPE_TYPES Enumeration

# Members

Member Value Description VARIABLE_TYPE_ARRAY 5 VARIABLE_TYPE_COMMAND 4 VARIABLE_TYPE_DOUBLE 1 VARIABLE_TYPE_FUNCTION 7 VARIABLE_TYPE_LONG 0 VARIABLE_TYPE_POINT 2 VARIABLE_TYPE_STRING 3

| VARIABLE_TYPE_TYPES Enumeration |

| Member | Value | Description |
| --- | VARIABLE_TYPE_ARRAY | 5 | VARIABLE_TYPE_COMMAND | 4 | VARIABLE_TYPE_DOUBLE | 1 | VARIABLE_TYPE_FUNCTION | 7 | VARIABLE_TYPE_LONG | 0 | VARIABLE_TYPE_POINT | 2 | VARIABLE_TYPE_STRING | 3

---

## WAXISTYPE

# WAXISTYPE Enumeration

# Members

Member Value Description PCD_XMINUS 16 PCD_XPLUS 32 PCD_YMINUS 4 PCD_YPLUS 8 PCD_ZMINUS 2 PCD_ZPLUS 1

| WAXISTYPE Enumeration |

| Member | Value | Description |
| --- | PCD_XMINUS | 16 | PCD_XPLUS | 32 | PCD_YMINUS | 4 | PCD_YPLUS | 8 | PCD_ZMINUS | 2 | PCD_ZPLUS | 1

---

## WPLANETYPE

# WPLANETYPE Enumeration

# Members

Member Value Description PCD_BACK 8 PCD_BOTTOM 2 PCD_FRONT 4 PCD_LEFT 16 PCD_RIGHT 32 PCD_TOP 1

| WPLANETYPE Enumeration |

| Member | Value | Description |
| --- | PCD_BACK | 8 | PCD_BOTTOM | 2 | PCD_FRONT | 4 | PCD_LEFT | 16 | PCD_RIGHT | 32 | PCD_TOP | 1

---

## WPROGOPTIONSTYPE

# WPROGOPTIONSTYPE Enumeration

# Members

Member Value Description PCD__AUTOPREHIT 2 PCD__AUTOPROJREFPLANE 4 PCD__AUTOTIPSELECT 1 PCD__DISPSPEEDS 8 PCD__ENDKEY 16 PCD__EXTSHEETMETAL 32 PCD__FLYMODE 64 PCD__TABLEAVOIDANCE 128 PCD__USEDIMCOLORS 256

| WPROGOPTIONSTYPE Enumeration |

| Member | Value | Description |
| --- | PCD__AUTOPREHIT | 2 | PCD__AUTOPROJREFPLANE | 4 | PCD__AUTOTIPSELECT | 1 | PCD__DISPSPEEDS | 8 | PCD__ENDKEY | 16 | PCD__EXTSHEETMETAL | 32 | PCD__FLYMODE | 64 | PCD__TABLEAVOIDANCE | 128 | PCD__USEDIMCOLORS | 256

---

## WPROGVALUESTYPE

# WPROGVALUESTYPE Enumeration

# Members

Member Value Description PCD__AUTOTRIGDISTANCE 5 PCD__DIMPLACES 3 PCD__MANRETRACT 7 PCD__MEASSCALE 8 PCD__PH9WARNDELTA 9 PCD__PROBERADIUS 2 PCD__TABLETOL 6 PCD__VALISYSERRTIMEOUT 10

| WPROGVALUESTYPE Enumeration |

| Member | Value | Description |
| --- | PCD__AUTOTRIGDISTANCE | 5 | PCD__DIMPLACES | 3 | PCD__MANRETRACT | 7 | PCD__MEASSCALE | 8 | PCD__PH9WARNDELTA | 9 | PCD__PROBERADIUS | 2 | PCD__TABLETOL | 6 | PCD__VALISYSERRTIMEOUT | 10

---

## XMLImport_StatusCode

# XMLImport_StatusCode Enumeration

# Members

Member Value Description FILE_OPEN_ERROR 0 IMPORT_FAILED -1 IMPORT_HEADER_NOT_FOUND 4 IMPORT_OK 2 IMPORT_UNITS_MISMATCH 3 INSPECTIONPLAN_TAG_NOT_FOUND 1

| XMLImport_StatusCode Enumeration |

| Member | Value | Description |
| --- | FILE_OPEN_ERROR | 0 | IMPORT_FAILED | -1 | IMPORT_HEADER_NOT_FOUND | 4 | IMPORT_OK | 2 | IMPORT_UNITS_MISMATCH | 3 | INSPECTIONPLAN_TAG_NOT_FOUND | 1

---

## XYZTYPES

# XYZTYPES Enumeration

# Members

Member Value Description PCD_BALLCENTER 604 PCD_CENTROID 603 PCD_ENDPOINT 606 PCD_MIDPOINT 607 PCD_STARTPOINT 605

| XYZTYPES Enumeration |

| Member | Value | Description |
| --- | PCD_BALLCENTER | 604 | PCD_CENTROID | 603 | PCD_ENDPOINT | 606 | PCD_MIDPOINT | 607 | PCD_STARTPOINT | 605
