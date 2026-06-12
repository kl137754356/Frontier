import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveSkill } from './ws-handler.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('resolveSkill', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'claw-skills-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should return text as-is when it does not match a known skill', () => {
    const result = resolveSkill('hello world', tmpDir);
    expect(result).toBe('hello world');
  });

  it('should match skill name case-insensitively', () => {
    // Create skill directory with SKILL.md
    const skillDir = path.join(tmpDir, 'sysinfo');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), 'System info skill content');

    const result = resolveSkill('SYSINFO', tmpDir);
    expect(result).toContain('System info skill content');
    expect(result).toContain('Execute the above skill.');
  });

  it('should match skill name with trimmed whitespace', () => {
    const skillDir = path.join(tmpDir, 'sysinfo');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), 'Skill content');

    const result = resolveSkill('  sysinfo  ', tmpDir);
    expect(result).toContain('Skill content');
  });

  it('should match pc-dmis-automation skill', () => {
    const skillDir = path.join(tmpDir, 'pc-dmis-automation');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), 'PC-DMIS automation content');

    const result = resolveSkill('pc-dmis-automation', tmpDir);
    expect(result).toContain('PC-DMIS automation content');
  });

  it('should return trimmed skill name when SKILL.md does not exist', () => {
    // No skill directory created
    const result = resolveSkill('sysinfo', tmpDir);
    expect(result).toBe('sysinfo');
  });

  it('should not match partial skill names', () => {
    const result = resolveSkill('sysinfo extra text', tmpDir);
    expect(result).toBe('sysinfo extra text');
  });

  it('should not match empty string', () => {
    const result = resolveSkill('', tmpDir);
    expect(result).toBe('');
  });

  it('should not match whitespace-only string', () => {
    const result = resolveSkill('   ', tmpDir);
    expect(result).toBe('   ');
  });
});
