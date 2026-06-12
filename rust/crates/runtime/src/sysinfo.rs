// ============================================================
// Frontier - 系统信息探针模块
// 文件位置：rust/crates/runtime/src/sysinfo.rs
// 功能：收集本机硬件/系统配置信息（CPU、内存、磁盘、网卡、显卡、主板、操作系统）
// 设计：跨平台抽象 + Windows 优先（PowerShell / WMI），Linux/macOS 基础回退
// ============================================================

use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};
use serde_json::Value;

// ============================================================
// 报告数据结构 (Report Data Structures)
// ============================================================

/// 系统信息探针报告 - 包含所有收集到的硬件/系统信息
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct ProbeReport {
    /// 收集时间戳（毫秒）
    pub collected_at_ms: u64,
    /// 主机名
    pub hostname: Option<String>,
    /// 操作系统信息
    pub os: Option<OsInfo>,
    /// CPU 信息（多 CPU 系统取第一个）
    pub cpu: Option<CpuInfo>,
    /// 内存信息
    pub memory: Option<MemoryInfo>,
    /// 显卡列表
    pub gpus: Vec<GpuInfo>,
    /// 物理磁盘列表
    pub disks: Vec<DiskInfo>,
    /// 逻辑分区列表（含容量/剩余空间）
    pub partitions: Vec<PartitionInfo>,
    /// 活动网卡列表
    pub network_adapters: Vec<NetworkAdapterInfo>,
    /// 主板信息
    pub motherboard: Option<MotherboardInfo>,
    /// 收集过程中的错误（不致命）
    pub errors: Vec<ProbeError>,
}

/// 操作系统信息
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct OsInfo {
    pub caption: Option<String>,
    pub version: Option<String>,
    pub build_number: Option<String>,
    pub architecture: Option<String>,
    pub install_date: Option<String>,
    pub last_boot_time: Option<String>,
    pub kernel: Option<String>,
}

/// CPU 处理器信息
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct CpuInfo {
    pub name: Option<String>,
    pub physical_cores: Option<u32>,
    pub logical_cores: Option<u32>,
    pub max_clock_mhz: Option<u32>,
    pub current_clock_mhz: Option<u32>,
    pub vendor: Option<String>,
}

/// 内存信息
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct MemoryInfo {
    /// 总物理内存（字节）
    pub total_bytes: Option<u64>,
    /// 可用物理内存（字节）
    pub available_bytes: Option<u64>,
    /// 使用率百分比
    pub usage_percent: Option<f64>,
    /// 各内存条详情
    pub modules: Vec<MemoryModule>,
}

/// 单条物理内存条
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct MemoryModule {
    pub manufacturer: Option<String>,
    pub capacity_bytes: Option<u64>,
    pub speed_mhz: Option<u32>,
    pub memory_type: Option<String>,
    pub form_factor: Option<String>,
}

/// 显卡信息
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct GpuInfo {
    pub name: Option<String>,
    pub adapter_ram_bytes: Option<u64>,
    pub driver_version: Option<String>,
    pub video_processor: Option<String>,
    pub horizontal_resolution: Option<u32>,
    pub vertical_resolution: Option<u32>,
}

/// 物理磁盘信息
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct DiskInfo {
    pub model: Option<String>,
    pub size_bytes: Option<u64>,
    pub interface_type: Option<String>,
    pub media_type: Option<String>,
}

/// 逻辑分区信息
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct PartitionInfo {
    pub device_id: String,
    pub total_bytes: Option<u64>,
    pub free_bytes: Option<u64>,
    pub usage_percent: Option<f64>,
    pub file_system: Option<String>,
}

/// 网络适配器信息
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct NetworkAdapterInfo {
    pub name: Option<String>,
    pub mac_address: Option<String>,
    /// 网卡速率（bps）
    pub speed_bps: Option<u64>,
}

/// 主板信息
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
pub struct MotherboardInfo {
    pub manufacturer: Option<String>,
    pub product: Option<String>,
    pub serial_number: Option<String>,
}

/// 探针错误（不致命，标记部分失败）
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ProbeError {
    pub component: String,
    pub message: String,
}

// ============================================================
// 探针主入口 (Probe Entry Point)
// ============================================================

/// 系统信息探针
///
/// 使用 [`SystemProbe::collect`] 同步收集本机硬件/系统信息。
/// 实现要点：
/// - Windows：使用 PowerShell + CIM (WMI) 一次性获取所有信息并以 JSON 形式返回
/// - Linux/macOS：使用 uname/lscpu/free/df/sysctl 等命令
/// - 部分失败不会中断整体收集，错误会累积在 `report.errors`
#[derive(Debug, Default, Clone, Copy)]
pub struct SystemProbe {
    /// 收集超时（秒），默认 30s
    pub timeout_secs: u64,
}

impl SystemProbe {
    /// 创建默认探针
    #[must_use]
    pub fn new() -> Self {
        Self { timeout_secs: 30 }
    }

    /// 设置超时
    #[must_use]
    pub const fn with_timeout(mut self, secs: u64) -> Self {
        self.timeout_secs = secs;
        self
    }

    /// 收集所有系统信息
    pub fn collect(&self) -> ProbeReport {
        let mut report = ProbeReport {
            collected_at_ms: current_time_millis(),
            hostname: collect_hostname(),
            ..Default::default()
        };

        #[cfg(windows)]
        {
            self.collect_windows(&mut report);
        }
        #[cfg(not(windows))]
        {
            self.collect_unix(&mut report);
        }

        report
    }

    /// 序列化为 JSON 字符串
    pub fn to_json(&self, report: &ProbeReport) -> Result<String, serde_json::Error> {
        serde_json::to_string_pretty(report)
    }

    /// 序列化为 Value
    pub fn to_value(report: &ProbeReport) -> Value {
        serde_json::to_value(report).unwrap_or(Value::Null)
    }

    /// 渲染为人类可读的中文报告
    #[must_use]
    pub fn render_text(report: &ProbeReport) -> String {
        let mut out = String::new();

        if let Some(hostname) = &report.hostname {
            out.push_str(&format!("===== 主机 =====\n  主机名: {hostname}\n\n"));
        }

        out.push_str("===== 操作系统 =====\n");
        if let Some(os) = &report.os {
            push_opt(&mut out, "  系统名称", &os.caption);
            push_opt(&mut out, "  版本号", &os.version);
            push_opt(&mut out, "  构建号", &os.build_number);
            push_opt(&mut out, "  架构", &os.architecture);
            push_opt(&mut out, "  内核", &os.kernel);
            push_opt(&mut out, "  安装日期", &os.install_date);
            push_opt(&mut out, "  最后启动", &os.last_boot_time);
        } else {
            out.push_str("  获取失败\n");
        }
        out.push('\n');

        out.push_str("===== CPU =====\n");
        if let Some(cpu) = &report.cpu {
            push_opt(&mut out, "  型号", &cpu.name);
            push_opt(&mut out, "  制造商", &cpu.vendor);
            if let Some(p) = cpu.physical_cores {
                out.push_str(&format!("  物理核心: {p}\n"));
            }
            if let Some(l) = cpu.logical_cores {
                out.push_str(&format!("  逻辑核心: {l}\n"));
            }
            if let Some(m) = cpu.max_clock_mhz {
                out.push_str(&format!("  最大主频: {m} MHz\n"));
            }
            if let Some(c) = cpu.current_clock_mhz {
                out.push_str(&format!("  当前主频: {c} MHz\n"));
            }
        } else {
            out.push_str("  获取失败\n");
        }
        out.push('\n');

        out.push_str("===== 内存 =====\n");
        if let Some(mem) = &report.memory {
            if let Some(t) = mem.total_bytes {
                out.push_str(&format!("  总容量: {}\n", format_bytes(t)));
            }
            if let Some(a) = mem.available_bytes {
                out.push_str(&format!("  可用: {}\n", format_bytes(a)));
            }
            if let Some(u) = mem.usage_percent {
                out.push_str(&format!("  使用率: {u:.1}%\n"));
            }
            if !mem.modules.is_empty() {
                out.push_str("  内存条:\n");
                for (i, m) in mem.modules.iter().enumerate() {
                    let cap = m.capacity_bytes.map(format_bytes).unwrap_or_else(|| "未知".into());
                    let speed = m.speed_mhz.map(|s| format!("{s} MHz")).unwrap_or_else(|| "?".into());
                    let mtype = m.memory_type.clone().unwrap_or_else(|| "?".into());
                    let mf = m.form_factor.clone().unwrap_or_else(|| "?".into());
                    let manu = m.manufacturer.clone().unwrap_or_else(|| "未知厂商".into());
                    out.push_str(&format!(
                        "    [{i}] {manu} | {cap} | {speed} | {mtype} | {mf}\n"
                    ));
                }
            }
        } else {
            out.push_str("  获取失败\n");
        }
        out.push('\n');

        out.push_str("===== 显卡 =====\n");
        if report.gpus.is_empty() {
            out.push_str("  未检测到显卡或获取失败\n");
        } else {
            for (i, gpu) in report.gpus.iter().enumerate() {
                out.push_str(&format!("  [{i}]\n"));
                push_opt(&mut out, "    型号", &gpu.name);
                if let Some(ram) = gpu.adapter_ram_bytes {
                    out.push_str(&format!("    显存: {}\n", format_bytes(ram)));
                }
                push_opt(&mut out, "    驱动版本", &gpu.driver_version);
                push_opt(&mut out, "    视频处理器", &gpu.video_processor);
                if let (Some(h), Some(v)) = (gpu.horizontal_resolution, gpu.vertical_resolution) {
                    out.push_str(&format!("    当前分辨率: {h} x {v}\n"));
                }
            }
        }
        out.push('\n');

        out.push_str("===== 硬盘 =====\n");
        if report.disks.is_empty() {
            out.push_str("  未检测到物理磁盘或获取失败\n");
        } else {
            for (i, d) in report.disks.iter().enumerate() {
                out.push_str(&format!("  [{i}]\n"));
                push_opt(&mut out, "    型号", &d.model);
                if let Some(s) = d.size_bytes {
                    out.push_str(&format!("    容量: {}\n", format_bytes(s)));
                }
                push_opt(&mut out, "    接口", &d.interface_type);
                push_opt(&mut out, "    介质类型", &d.media_type);
            }
        }
        if !report.partitions.is_empty() {
            out.push_str("  --- 分区容量 ---\n");
            out.push_str("    盘符         总容量        剩余         使用率   文件系统\n");
            for p in &report.partitions {
                let total = p.total_bytes.map(format_bytes).unwrap_or_else(|| "?".into());
                let free = p.free_bytes.map(format_bytes).unwrap_or_else(|| "?".into());
                let usage = p
                    .usage_percent
                    .map(|u| format!("{u:>5.1}%"))
                    .unwrap_or_else(|| "  ?  ".into());
                let fs = p.file_system.clone().unwrap_or_else(|| "?".into());
                out.push_str(&format!(
                    "    {:<10}  {:>10}   {:>10}   {}   {fs}\n",
                    p.device_id, total, free, usage
                ));
            }
        }
        out.push('\n');

        out.push_str("===== 网卡 =====\n");
        if report.network_adapters.is_empty() {
            out.push_str("  未检测到活动网卡或获取失败\n");
        } else {
            for (i, n) in report.network_adapters.iter().enumerate() {
                out.push_str(&format!("  [{i}]\n"));
                push_opt(&mut out, "    名称", &n.name);
                push_opt(&mut out, "    MAC 地址", &n.mac_address);
                if let Some(s) = n.speed_bps {
                    let gbps = s as f64 / 1_000_000_000.0;
                    if gbps >= 1.0 {
                        out.push_str(&format!("    速率: {gbps:.1} Gbps\n"));
                    } else {
                        let mbps = s as f64 / 1_000_000.0;
                        out.push_str(&format!("    速率: {mbps:.1} Mbps\n"));
                    }
                }
            }
        }
        out.push('\n');

        out.push_str("===== 主板 =====\n");
        if let Some(mb) = &report.motherboard {
            push_opt(&mut out, "  制造商", &mb.manufacturer);
            push_opt(&mut out, "  型号", &mb.product);
            push_opt(&mut out, "  序列号", &mb.serial_number);
        } else {
            out.push_str("  获取失败\n");
        }

        if !report.errors.is_empty() {
            out.push_str("\n===== 收集警告 =====\n");
            for e in &report.errors {
                out.push_str(&format!("  ⚠ [{}] {}\n", e.component, e.message));
            }
        }

        out
    }

    // ============================================================
    // Windows 实现 (Windows Implementation)
    // ============================================================

    #[cfg(windows)]
    fn collect_windows(&self, report: &mut ProbeReport) {
        // 使用单个 PowerShell 会话收集所有信息，并以 JSON 数组形式返回
        // 这样做可以避免多次启动 PowerShell（每次启动 ~1-2s）
        let script = Self::windows_collection_script();
        match run_powershell_json(&script, self.timeout_secs) {
            Ok(value) => {
                if let Some(array) = value.as_array() {
                    for item in array {
                        Self::parse_windows_payload(item, report);
                    }
                } else if let Some(obj) = value.as_object() {
                    // 兼容返回单个对象的情况
                    Self::parse_windows_payload(&Value::Object(obj.clone()), report);
                } else {
                    report.errors.push(ProbeError {
                        component: "windows_payload".into(),
                        message: format!("unexpected JSON root: {}", value),
                    });
                }
            }
            Err(e) => {
                report.errors.push(ProbeError {
                    component: "windows_payload".into(),
                    message: e,
                });
            }
        }
    }

    #[cfg(windows)]
    fn parse_windows_payload(item: &Value, report: &mut ProbeReport) {
        let Some(obj) = item.as_object() else { return };
        let kind = obj.get("kind").and_then(Value::as_str).unwrap_or("");

        match kind {
            "os" => {
                report.os = Some(OsInfo {
                    caption: pick_str(obj, "Caption"),
                    version: pick_str(obj, "Version"),
                    build_number: pick_str(obj, "BuildNumber"),
                    architecture: pick_str(obj, "OSArchitecture"),
                    install_date: pick_str(obj, "InstallDate"),
                    last_boot_time: pick_str(obj, "LastBootUpTime"),
                    kernel: None,
                });
            }
            "cpu" => {
                report.cpu = Some(CpuInfo {
                    name: pick_str(obj, "Name"),
                    physical_cores: pick_u32(obj, "NumberOfCores"),
                    logical_cores: pick_u32(obj, "NumberOfLogicalProcessors"),
                    max_clock_mhz: pick_u32(obj, "MaxClockSpeed"),
                    current_clock_mhz: pick_u32(obj, "CurrentClockSpeed"),
                    vendor: pick_str(obj, "Manufacturer"),
                });
            }
            "mem_total" => {
                if let Some(os) = obj.get("TotalVisibleMemorySize").and_then(Value::as_u64) {
                    let free = obj
                        .get("FreePhysicalMemory")
                        .and_then(Value::as_u64)
                        .unwrap_or(0);
                    let total_bytes = os.saturating_mul(1024);
                    let available_bytes = free.saturating_mul(1024);
                    let usage_percent = if total_bytes > 0 {
                        Some((1.0 - (available_bytes as f64 / total_bytes as f64)) * 100.0)
                    } else {
                        None
                    };
                    report.memory = Some(MemoryInfo {
                        total_bytes: Some(total_bytes),
                        available_bytes: Some(available_bytes),
                        usage_percent,
                        modules: std::mem::take(&mut report.memory)
                            .and_then(|m| if m.modules.is_empty() { None } else { Some(m.modules) })
                            .unwrap_or_default()
                            .into_iter()
                            .map(|m| m)
                            .collect(),
                    });
                }
            }
            "mem_module" => {
                let cap_kb = pick_u64(obj, "Capacity");
                let module = MemoryModule {
                    manufacturer: pick_str(obj, "Manufacturer"),
                    capacity_bytes: cap_kb,  // Win32_PhysicalMemory.Capacity is already bytes
                    speed_mhz: pick_u32(obj, "Speed"),
                    memory_type: pick_str(obj, "MemoryType"),
                    form_factor: pick_str(obj, "FormFactor"),
                };
                if let Some(mem) = report.memory.as_mut() {
                    mem.modules.push(module);
                } else {
                    report.memory = Some(MemoryInfo {
                        modules: vec![module],
                        ..Default::default()
                    });
                }
            }
            "gpu" => {
                report.gpus.push(GpuInfo {
                    name: pick_str(obj, "Name"),
                    adapter_ram_bytes: pick_u64(obj, "AdapterRAM"),
                    driver_version: pick_str(obj, "DriverVersion"),
                    video_processor: pick_str(obj, "VideoProcessor"),
                    horizontal_resolution: pick_u32(obj, "CurrentHorizontalResolution"),
                    vertical_resolution: pick_u32(obj, "CurrentVerticalResolution"),
                });
            }
            "disk" => {
                report.disks.push(DiskInfo {
                    model: pick_str(obj, "Model"),
                    size_bytes: pick_u64(obj, "Size"),
                    interface_type: pick_str(obj, "InterfaceType"),
                    media_type: pick_str(obj, "MediaType"),
                });
            }
            "partition" => {
                let total = pick_u64(obj, "Size");
                let free = pick_u64(obj, "FreeSpace");
                let usage_percent = match (total, free) {
                    (Some(t), Some(f)) if t > 0 => Some((1.0 - (f as f64 / t as f64)) * 100.0),
                    _ => None,
                };
                report.partitions.push(PartitionInfo {
                    device_id: pick_str(obj, "DeviceID").unwrap_or_default(),
                    total_bytes: total,
                    free_bytes: free,
                    usage_percent,
                    file_system: pick_str(obj, "FileSystem"),
                });
            }
            "nic" => {
                report.network_adapters.push(NetworkAdapterInfo {
                    name: pick_str(obj, "Name"),
                    mac_address: pick_str(obj, "MACAddress"),
                    speed_bps: pick_u64(obj, "Speed"),
                });
            }
            "mb" => {
                report.motherboard = Some(MotherboardInfo {
                    manufacturer: pick_str(obj, "Manufacturer"),
                    product: pick_str(obj, "Product"),
                    serial_number: pick_str(obj, "SerialNumber"),
                });
            }
            _ => {}
        }
    }

    /// Windows 端 PowerShell 收集脚本
    ///
    /// 一次性查询 WMI 并以 JSON 数组输出，kind 字段标识每条数据的类别。
    #[cfg(windows)]
    fn windows_collection_script() -> String {
        // 注意：
        // 1. ConvertTo-Json -Depth 2 足以处理 WMI 返回的简单对象
        // 2. Capacity / Size / FreeSpace 是字节数字（不是 KB）
        // 3. 失败的项目不输出，避免污染整体 JSON
        r#"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'SilentlyContinue'
$results = @()

# 操作系统
$os = Get-CimInstance Win32_OperatingSystem
if ($os) {
    $results += [PSCustomObject]@{
        kind = 'os'
        Caption = $os.Caption
        Version = $os.Version
        BuildNumber = $os.BuildNumber
        OSArchitecture = $os.OSArchitecture
        InstallDate = if ($os.InstallDate) { $os.InstallDate.ToString('yyyy-MM-dd HH:mm:ss') } else { $null }
        LastBootUpTime = if ($os.LastBootUpTime) { $os.LastBootUpTime.ToString('yyyy-MM-dd HH:mm:ss') } else { $null }
    }
    $results += [PSCustomObject]@{
        kind = 'mem_total'
        TotalVisibleMemorySize = $os.TotalVisibleMemorySize
        FreePhysicalMemory = $os.FreePhysicalMemory
    }
}

# CPU
$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1
if ($cpu) {
    $results += [PSCustomObject]@{
        kind = 'cpu'
        Name = $cpu.Name
        Manufacturer = $cpu.Manufacturer
        NumberOfCores = $cpu.NumberOfCores
        NumberOfLogicalProcessors = $cpu.NumberOfLogicalProcessors
        MaxClockSpeed = $cpu.MaxClockSpeed
        CurrentClockSpeed = $cpu.CurrentClockSpeed
    }
}

# 内存条
Get-CimInstance Win32_PhysicalMemory | ForEach-Object {
    $results += [PSCustomObject]@{
        kind = 'mem_module'
        Manufacturer = $_.Manufacturer
        Capacity = $_.Capacity
        Speed = $_.Speed
        MemoryType = $_.SMBIOSMemoryType
        FormFactor = $_.FormFactor
    }
}

# 显卡
Get-CimInstance Win32_VideoController | ForEach-Object {
    $results += [PSCustomObject]@{
        kind = 'gpu'
        Name = $_.Name
        AdapterRAM = $_.AdapterRAM
        DriverVersion = $_.DriverVersion
        VideoProcessor = $_.VideoProcessor
        CurrentHorizontalResolution = $_.CurrentHorizontalResolution
        CurrentVerticalResolution = $_.CurrentVerticalResolution
    }
}

# 物理磁盘
Get-CimInstance Win32_DiskDrive | ForEach-Object {
    $results += [PSCustomObject]@{
        kind = 'disk'
        Model = $_.Model
        Size = $_.Size
        InterfaceType = $_.InterfaceType
        MediaType = $_.MediaType
    }
}

# 逻辑分区
Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | ForEach-Object {
    $results += [PSCustomObject]@{
        kind = 'partition'
        DeviceID = $_.DeviceID
        Size = $_.Size
        FreeSpace = $_.FreeSpace
        FileSystem = $_.FileSystem
    }
}

# 网卡（仅活动）
Get-CimInstance Win32_NetworkAdapter -Filter "NetConnectionStatus=2" | ForEach-Object {
    $results += [PSCustomObject]@{
        kind = 'nic'
        Name = $_.Name
        MACAddress = $_.MACAddress
        Speed = $_.Speed
    }
}

# 主板
$mb = Get-CimInstance Win32_BaseBoard
if ($mb) {
    $results += [PSCustomObject]@{
        kind = 'mb'
        Manufacturer = $mb.Manufacturer
        Product = $mb.Product
        SerialNumber = $mb.SerialNumber
    }
}

$results | ConvertTo-Json -Depth 3 -Compress
"#
        .to_string()
    }

    // ============================================================
    // Unix 实现（Linux / macOS） (Unix Implementation)
    // ============================================================

    #[cfg(not(windows))]
    fn collect_unix(&self, report: &mut ProbeReport) {
        // 操作系统
        report.os = Some(OsInfo {
            caption: run_cmd_capture("uname", &["-o"]).ok(),
            version: run_cmd_capture("uname", &["-r"]).ok(),
            architecture: run_cmd_capture("uname", &["-m"]).ok(),
            kernel: run_cmd_capture("uname", &["-s"]).ok(),
            ..Default::default()
        });

        // CPU
        let cpu_name = run_cmd_capture("sh", &["-c", "lscpu | grep 'Model name' | cut -d: -f2-"])
            .ok()
            .map(|s| s.trim().to_string());
        let cpu_vendor = run_cmd_capture("sh", &["-c", "lscpu | grep 'Vendor ID' | cut -d: -f2-"])
            .ok()
            .map(|s| s.trim().to_string());
        let physical_cores = run_cmd_capture("sh", &["-c", "lscpu | grep '^Core(s) per socket' | awk '{print $4}'"])
            .ok()
            .and_then(|s| s.trim().parse().ok());
        let logical_cores = run_cmd_capture("sh", &["-c", "nproc"])
            .ok()
            .and_then(|s| s.trim().parse().ok());
        let max_clock = run_cmd_capture("sh", &["-c", "lscpu | grep 'CPU max MHz' | cut -d: -f2-"])
            .ok()
            .and_then(|s| s.trim().parse::<f64>().ok())
            .map(|f| f as u32);

        report.cpu = Some(CpuInfo {
            name: cpu_name,
            vendor: cpu_vendor,
            physical_cores,
            logical_cores,
            max_clock_mhz: max_clock,
            current_clock_mhz: None,
        });

        // 内存
        if let Ok(meminfo) = std::fs::read_to_string("/proc/meminfo") {
            let total_kb = parse_meminfo_field(&meminfo, "MemTotal");
            let avail_kb = parse_meminfo_field(&meminfo, "MemAvailable");
            let total_bytes = total_kb.map(|k| k * 1024);
            let available_bytes = avail_kb.map(|k| k * 1024);
            let usage_percent = match (total_bytes, available_bytes) {
                (Some(t), Some(a)) if t > 0 => Some((1.0 - (a as f64 / t as f64)) * 100.0),
                _ => None,
            };
            report.memory = Some(MemoryInfo {
                total_bytes,
                available_bytes,
                usage_percent,
                modules: Vec::new(),
            });
        }

        // 分区
        if let Ok(df_output) = run_cmd_capture("sh", &["-c", "df -PB1 --output=source,size,used,avail,pcent,target 2>/dev/null || df -k"]) {
            for line in df_output.lines().skip(1) {
                let parts: Vec<&str> = line.split_whitespace().collect();
                if parts.len() >= 6 {
                    let total = parts[1].parse::<u64>().ok();
                    let avail = parts[3].parse::<u64>().ok();
                    let usage_str = parts[4].trim_end_matches('%');
                    let usage = usage_str.parse::<f64>().ok();
                    let target = parts[5].to_string();
                    report.partitions.push(PartitionInfo {
                        device_id: target,
                        total_bytes: total,
                        free_bytes: avail,
                        usage_percent: usage,
                        file_system: None,
                    });
                }
            }
        }
    }
}

// ============================================================
// 辅助函数 (Helpers)
// ============================================================

/// 当前时间戳（毫秒）
fn current_time_millis() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

/// 格式化字节数为人类可读形式（KB/MB/GB/TB）
#[must_use]
pub fn format_bytes(bytes: u64) -> String {
    const UNITS: &[&str] = &["B", "KB", "MB", "GB", "TB", "PB"];
    let mut size = bytes as f64;
    let mut unit_idx = 0;
    while size >= 1024.0 && unit_idx < UNITS.len() - 1 {
        size /= 1024.0;
        unit_idx += 1;
    }
    if unit_idx == 0 {
        format!("{bytes} B")
    } else {
        format!("{size:.2} {}", UNITS[unit_idx])
    }
}

/// 收集主机名
fn collect_hostname() -> Option<String> {
    #[cfg(windows)]
    {
        run_cmd_capture_with_shell("hostname").ok()
    }
    #[cfg(not(windows))]
    {
        run_cmd_capture("hostname", &[]).ok()
    }
}

/// 跨平台命令执行
fn run_cmd_capture(cmd: &str, args: &[&str]) -> Result<String, String> {
    let output = Command::new(cmd)
        .args(args)
        .output()
        .map_err(|e| format!("failed to spawn `{cmd}`: {e}"))?;

    if !output.status.success() {
        return Err(format!(
            "`{cmd}` exited with status {}: {}",
            output.status,
            String::from_utf8_lossy(&output.stderr).trim()
        ));
    }
    Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
}

/// Windows 端通过 cmd shell 执行命令
#[cfg(windows)]
fn run_cmd_capture_with_shell(cmd: &str) -> Result<String, String> {
    run_cmd_capture("cmd", &["/C", cmd])
}

/// 运行 PowerShell 脚本并解析 JSON 输出
#[cfg(windows)]
fn run_powershell_json(script: &str, timeout_secs: u64) -> Result<Value, String> {
    let shell = detect_powershell_shell().map_err(|e| e.to_string())?;
    let output = Command::new(shell)
        .args(["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", script])
        .output()
        .map_err(|e| format!("failed to spawn `{shell}`: {e}"))?;

    if !output.status.success() {
        return Err(format!(
            "`{shell}` exited with status {}: {}",
            output.status,
            String::from_utf8_lossy(&output.stderr).trim()
        ));
    }
    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    if stdout.is_empty() {
        return Err("PowerShell returned empty output".to_string());
    }

    // 抑制 unused warning
    let _ = timeout_secs;

    serde_json::from_str::<Value>(&stdout)
        .map_err(|e| format!("failed to parse JSON: {e}; raw={stdout}"))
}

#[cfg(windows)]
fn detect_powershell_shell() -> Result<&'static str, String> {
    if Command::new("pwsh").arg("-Version").output().is_ok() {
        Ok("pwsh")
    } else if Command::new("powershell").arg("-Version").output().is_ok() {
        Ok("powershell")
    } else {
        Err("PowerShell executable not found (expected `pwsh` or `powershell` in PATH)".to_string())
    }
}

/// 解析 JSON 对象中可能为字符串或数字的字段为 Option<String>
fn pick_str(obj: &serde_json::Map<String, Value>, key: &str) -> Option<String> {
    obj.get(key).and_then(|v| match v {
        Value::String(s) => {
            if s.is_empty() || s == "To Be Filled By O.E.M." {
                None
            } else {
                Some(s.clone())
            }
        }
        Value::Number(n) => Some(n.to_string()),
        Value::Null => None,
        _ => Some(v.to_string()),
    })
}

/// 解析 JSON 对象中可能为字符串或数字的字段为 Option<u32>
fn pick_u32(obj: &serde_json::Map<String, Value>, key: &str) -> Option<u32> {
    obj.get(key).and_then(|v| match v {
        Value::Number(n) => n.as_u64().and_then(|x| u32::try_from(x).ok()),
        Value::String(s) => s.trim().parse().ok(),
        _ => None,
    })
}

/// 解析 JSON 对象中可能为字符串或数字的字段为 Option<u64>
fn pick_u64(obj: &serde_json::Map<String, Value>, key: &str) -> Option<u64> {
    obj.get(key).and_then(|v| match v {
        Value::Number(n) => n.as_u64(),
        Value::String(s) => s.trim().parse().ok(),
        _ => None,
    })
}

/// 向 out 推入可选字段 "label: value" 或 "label: 获取失败"
fn push_opt(out: &mut String, label: &str, value: &Option<String>) {
    match value {
        Some(v) => out.push_str(&format!("{label}: {v}\n")),
        None => out.push_str(&format!("{label}: 获取失败\n")),
    }
}

/// 解析 /proc/meminfo 中的 kB 字段
#[cfg(not(windows))]
fn parse_meminfo_field(content: &str, field: &str) -> Option<u64> {
    for line in content.lines() {
        if let Some(rest) = line.strip_prefix(field) {
            // 形如 "MemTotal:       16384000 kB"
            let trimmed = rest.trim_start_matches(':').trim();
            let num_str: String = trimmed.chars().take_while(|c| c.is_ascii_digit()).collect();
            return num_str.parse().ok();
        }
    }
    None
}

// ============================================================
// 单元测试 (Unit Tests)
// ============================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn format_bytes_handles_all_units() {
        assert_eq!(format_bytes(512), "512 B");
        assert_eq!(format_bytes(1024), "1.00 KB");
        assert_eq!(format_bytes(1024 * 1024), "1.00 MB");
        assert_eq!(format_bytes(1024_u64.pow(3)), "1.00 GB");
        assert_eq!(format_bytes(1024_u64.pow(4)), "1.00 TB");
    }

    #[test]
    fn pick_str_filters_oem_placeholder() {
        let mut obj = serde_json::Map::new();
        obj.insert("Manufacturer".to_string(), Value::String("To Be Filled By O.E.M.".into()));
        assert_eq!(pick_str(&obj, "Manufacturer"), None);
        obj.insert("Manufacturer".to_string(), Value::String("ASUS".into()));
        assert_eq!(pick_str(&obj, "Manufacturer"), Some("ASUS".into()));
        obj.insert("Empty".to_string(), Value::String("".into()));
        assert_eq!(pick_str(&obj, "Empty"), None);
    }

    #[test]
    fn pick_u32_handles_string_and_number() {
        let mut obj = serde_json::Map::new();
        obj.insert("n".to_string(), Value::Number(8.into()));
        assert_eq!(pick_u32(&obj, "n"), Some(8));
        obj.insert("n".to_string(), Value::String("16".into()));
        assert_eq!(pick_u32(&obj, "n"), Some(16));
        obj.insert("n".to_string(), Value::String("abc".into()));
        assert_eq!(pick_u32(&obj, "n"), None);
    }

    #[test]
    fn collect_returns_a_report_with_timestamp() {
        let probe = SystemProbe::new();
        let report = probe.collect();
        assert!(report.collected_at_ms > 0);
    }

    #[test]
    fn render_text_includes_all_sections() {
        let report = ProbeReport {
            collected_at_ms: 1_700_000_000_000,
            hostname: Some("test-host".into()),
            os: Some(OsInfo {
                caption: Some("Microsoft Windows 11 Pro".into()),
                version: Some("10.0.22631".into()),
                ..Default::default()
            }),
            cpu: Some(CpuInfo {
                name: Some("Intel Core i7-13700K".into()),
                physical_cores: Some(16),
                logical_cores: Some(24),
                max_clock_mhz: Some(5400),
                ..Default::default()
            }),
            memory: Some(MemoryInfo {
                total_bytes: Some(32 * 1024 * 1024 * 1024),
                available_bytes: Some(16 * 1024 * 1024 * 1024),
                usage_percent: Some(50.0),
                modules: vec![],
            }),
            gpus: vec![GpuInfo {
                name: Some("NVIDIA GeForce RTX 4070".into()),
                adapter_ram_bytes: Some(12 * 1024 * 1024 * 1024),
                ..Default::default()
            }],
            ..Default::default()
        };
        let text = SystemProbe::render_text(&report);
        assert!(text.contains("===== 操作系统 ====="));
        assert!(text.contains("Microsoft Windows 11 Pro"));
        assert!(text.contains("===== CPU ====="));
        assert!(text.contains("Intel Core i7-13700K"));
        assert!(text.contains("===== 内存 ====="));
        assert!(text.contains("32.00 GB"));
        assert!(text.contains("===== 显卡 ====="));
        assert!(text.contains("NVIDIA GeForce RTX 4070"));
    }

    #[test]
    fn json_roundtrip_preserves_data() {
        let report = ProbeReport {
            collected_at_ms: 1_700_000_000_000,
            hostname: Some("host".into()),
            os: Some(OsInfo {
                caption: Some("Ubuntu 22.04".into()),
                ..Default::default()
            }),
            cpu: Some(CpuInfo {
                name: Some("AMD Ryzen 9 7950X".into()),
                logical_cores: Some(32),
                ..Default::default()
            }),
            ..Default::default()
        };
        let json = SystemProbe::new().to_json(&report).unwrap();
        let parsed: ProbeReport = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed, report);
    }
}
