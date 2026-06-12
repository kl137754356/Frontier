# CMM 加长杆探针方案

> 适用于深孔、腔体、薄壁类工件内壁/外轮廓测量的一次性探针组配置。

## 方案概览

| 项目 | 取值 |
|------|------|
| 方案代号 | `PROBE-EXT-A100-M3R4` |
| 探针类型 | 加长杆探针（Extended Shaft Probe） |
| 适用场景 | 深孔、腔体、内壁台阶、狭窄槽 |
| 测头 | Renishaw TP200（M8 螺纹，触发式） |
| 加长杆 | 陶瓷，100 mm × Ø11 mm |
| 测针 | M3 螺纹，红宝石球，Ø4 mm，针长 30 mm |
| 标定 | 标准球 + 标定环规，自动标定 |
| 测量最大延伸 | ~140 mm（探针中心到测球中心） |

## 目录结构

```
probes/
├── README.md                      # 本文件，总览
├── extended_shaft_probe_spec.md   # 探针规格与几何
├── extended_shaft_probe_bom.csv   # 物料清单
├── config.json                    # 探针配置元数据（机器可读）
├── pcdmis/
│   ├── probe_setup.prb            # PC-DMIS 探针文件
│   ├── calibration.bas            # 标定程序
│   ├── measurement_program.bas    # 测量程序骨架
│   └── uncertainty_template.md    # 不确定度评估模板（按 GUM）
└── docs/
    └── assembly_drawing.md        # 装配图描述（无 CAD 时可作原理示意）
```

## 使用流程

1. **装配** — 按 `extended_shaft_probe_bom.csv` 顺序装配
2. **装载** — 把 `probe_setup.prb` 导入 PC-DMIS
3. **标定** — 运行 `calibration.bas`，先校 TP200，再用标定球 / 标定环规校测针
4. **测量** — 调用 `measurement_program.bas` 入口子例程
5. **不确定度** — 测量完成后填 `uncertainty_template.md`

## 风险与注意事项

- 加长杆 > 80 mm 时**必须**做挠度补偿（PROBE_COMP / FORM_ERROR）
- 测针球径 ≤ 3 mm 时需考虑**形状误差**与**滤波**设置
- 触发式测头在长杆下触发力会被放大，建议 `TRIGFORCE = LOW`
- 长杆测头**不可**用于高速扫描，限位 `MOVE_SPEED = 5 mm/s`
- 更换工件/重定位后**必须**重新标定（即使探针未换）

## 扩展

如需在同一工件上多方向测量（深孔 + 端面 + 侧壁），可在本方案基础上追加
星形多向探针配置（参见 `star_probe/` 目录，待创建）。
