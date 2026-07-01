//! External Agent integration (OpenAI-compatible platforms via backend proxy).
//!
//! Supports FastGPT, Dify, and other OpenAI-compatible platforms.
//! API Keys never reach the claw process — all requests go through a backend proxy.

pub mod config;
pub mod adapter;

pub use config::{load_external_config, ExternalConfig, ExternalAgentEntry};
pub use adapter::call_external_agent;
