#!/usr/bin/env python3
"""
LotaBot Configuration Validator

This script validates bot configuration files against the schema
and checks for common configuration issues.

Usage:
    python validate-config.py <config-file>
    python validate-config.py --all  # Validate all configs in bots/
"""

import sys
import yaml
import json
from pathlib import Path
from typing import Dict, List, Any, Tuple

# Configuration Schema
REQUIRED_FIELDS = {
    'bot': ['name', 'version', 'enabled', 'description', 'category'],
    'triggers': True,  # At least one trigger required
    'actions': True,   # At least one action required
}

VALID_CATEGORIES = ['infrastructure', 'development', 'operations', 'data', 'security']
VALID_TRIGGER_TYPES = ['event', 'schedule', 'webhook', 'manual']
VALID_ACTION_TYPES = ['execute', 'message']
VALID_PRIORITIES = ['critical', 'high', 'medium', 'low']
VALID_BACKOFF_STRATEGIES = ['linear', 'exponential', 'fixed']

class ValidationError(Exception):
    """Custom exception for validation errors"""
    pass

class ConfigValidator:
    """Validates LotaBot configuration files"""
    
    def __init__(self):
        self.errors: List[str] = []
        self.warnings: List[str] = []
    
    def validate_file(self, config_path: Path) -> Tuple[bool, List[str], List[str]]:
        """
        Validate a configuration file
        
        Returns:
            Tuple of (is_valid, errors, warnings)
        """
        self.errors = []
        self.warnings = []
        
        try:
            # Load YAML file
            with open(config_path, 'r') as f:
                config = yaml.safe_load(f)
            
            if not config:
                self.errors.append("Configuration file is empty")
                return False, self.errors, self.warnings
            
            # Validate structure
            self._validate_structure(config)
            
            # Validate bot section
            if 'bot' in config:
                self._validate_bot_section(config['bot'])
            
            # Validate triggers
            if 'triggers' in config:
                self._validate_triggers(config['triggers'])
            
            # Validate actions
            if 'actions' in config:
                self._validate_actions(config['actions'])
            
            # Validate constraints
            if 'constraints' in config:
                self._validate_constraints(config['constraints'])
            
            # Validate dependencies
            if 'dependencies' in config:
                self._validate_dependencies(config['dependencies'])
            
            # Validate security
            if 'security' in config:
                self._validate_security(config['security'])
            
            # Validate monitoring
            if 'monitoring' in config:
                self._validate_monitoring(config['monitoring'])
            
            # Additional validations
            self._validate_action_workflow(config.get('actions', []))
            
        except yaml.YAMLError as e:
            self.errors.append(f"YAML parsing error: {e}")
        except FileNotFoundError:
            self.errors.append(f"Configuration file not found: {config_path}")
        except Exception as e:
            self.errors.append(f"Unexpected error: {e}")
        
        return len(self.errors) == 0, self.errors, self.warnings
    
    def _validate_structure(self, config: Dict[str, Any]) -> None:
        """Validate top-level structure"""
        for section, fields in REQUIRED_FIELDS.items():
            if section not in config:
                self.errors.append(f"Missing required section: {section}")
                continue
            
            if fields is True:  # Just check presence
                if not config[section]:
                    self.errors.append(f"Section '{section}' cannot be empty")
            elif isinstance(fields, list):  # Check required fields
                for field in fields:
                    if field not in config[section]:
                        self.errors.append(f"Missing required field: {section}.{field}")
    
    def _validate_bot_section(self, bot: Dict[str, Any]) -> None:
        """Validate bot section"""
        # Validate category
        if 'category' in bot:
            if bot['category'] not in VALID_CATEGORIES:
                self.errors.append(
                    f"Invalid category '{bot['category']}'. "
                    f"Must be one of: {', '.join(VALID_CATEGORIES)}"
                )
        
        # Validate version format (semantic versioning)
        if 'version' in bot:
            version = bot['version']
            parts = version.split('.')
            if len(parts) != 3:
                self.errors.append(
                    f"Invalid version format '{version}'. "
                    f"Expected semantic version (e.g., '1.0.0')"
                )
            else:
                for part in parts:
                    if not part.isdigit():
                        self.errors.append(
                            f"Invalid version format '{version}'. "
                            f"Each part must be a number"
                        )
        
        # Validate name format
        if 'name' in bot:
            name = bot['name']
            if not name[0].isupper():
                self.warnings.append(
                    f"Bot name '{name}' should start with uppercase letter"
                )
            if not name.endswith('Bot'):
                self.warnings.append(
                    f"Bot name '{name}' should end with 'Bot'"
                )
    
    def _validate_triggers(self, triggers: List[Dict[str, Any]]) -> None:
        """Validate triggers section"""
        if not triggers:
            self.errors.append("At least one trigger is required")
            return
        
        for i, trigger in enumerate(triggers):
            if 'type' not in trigger:
                self.errors.append(f"Trigger {i}: Missing 'type' field")
                continue
            
            trigger_type = trigger['type']
            if trigger_type not in VALID_TRIGGER_TYPES:
                self.errors.append(
                    f"Trigger {i}: Invalid type '{trigger_type}'. "
                    f"Must be one of: {', '.join(VALID_TRIGGER_TYPES)}"
                )
            
            if 'pattern' not in trigger:
                self.errors.append(f"Trigger {i}: Missing 'pattern' field")
            
            if 'priority' in trigger:
                priority = trigger['priority']
                if priority not in VALID_PRIORITIES:
                    self.errors.append(
                        f"Trigger {i}: Invalid priority '{priority}'. "
                        f"Must be one of: {', '.join(VALID_PRIORITIES)}"
                    )
    
    def _validate_actions(self, actions: List[Dict[str, Any]]) -> None:
        """Validate actions section"""
        if not actions:
            self.errors.append("At least one action is required")
            return
        
        action_names = set()
        
        for i, action in enumerate(actions):
            if 'name' not in action:
                self.errors.append(f"Action {i}: Missing 'name' field")
                continue
            
            action_name = action['name']
            
            # Check for duplicate names
            if action_name in action_names:
                self.errors.append(f"Duplicate action name: '{action_name}'")
            action_names.add(action_name)
            
            if 'type' not in action:
                self.errors.append(f"Action '{action_name}': Missing 'type' field")
                continue
            
            action_type = action['type']
            if action_type not in VALID_ACTION_TYPES:
                self.errors.append(
                    f"Action '{action_name}': Invalid type '{action_type}'. "
                    f"Must be one of: {', '.join(VALID_ACTION_TYPES)}"
                )
            
            if 'command' not in action:
                self.errors.append(f"Action '{action_name}': Missing 'command' field")
            
            # Validate timeout
            if 'timeout' in action:
                timeout = action['timeout']
                if not isinstance(timeout, int) or timeout <= 0:
                    self.errors.append(
                        f"Action '{action_name}': Timeout must be a positive integer"
                    )
                elif timeout > 7200:  # 2 hours
                    self.warnings.append(
                        f"Action '{action_name}': Timeout {timeout}s is very long"
                    )
    
    def _validate_action_workflow(self, actions: List[Dict[str, Any]]) -> None:
        """Validate action workflow references"""
        if not actions:
            return
        
        action_names = {action['name'] for action in actions if 'name' in action}
        
        for action in actions:
            if 'name' not in action:
                continue
            
            action_name = action['name']
            
            # Check on_success references
            if 'on_success' in action:
                next_action = action['on_success']
                if next_action not in action_names:
                    self.errors.append(
                        f"Action '{action_name}': on_success references "
                        f"unknown action '{next_action}'"
                    )
            
            # Check on_failure references
            if 'on_failure' in action:
                next_action = action['on_failure']
                if next_action not in action_names:
                    self.errors.append(
                        f"Action '{action_name}': on_failure references "
                        f"unknown action '{next_action}'"
                    )
    
    def _validate_constraints(self, constraints: Dict[str, Any]) -> None:
        """Validate constraints section"""
        if 'max_concurrent_jobs' in constraints:
            max_jobs = constraints['max_concurrent_jobs']
            if not isinstance(max_jobs, int) or max_jobs <= 0:
                self.errors.append("max_concurrent_jobs must be a positive integer")
        
        if 'timeout' in constraints:
            timeout = constraints['timeout']
            if not isinstance(timeout, int) or timeout <= 0:
                self.errors.append("timeout must be a positive integer")
        
        if 'retry_policy' in constraints:
            retry = constraints['retry_policy']
            
            if 'backoff' in retry:
                backoff = retry['backoff']
                if backoff not in VALID_BACKOFF_STRATEGIES:
                    self.errors.append(
                        f"Invalid backoff strategy '{backoff}'. "
                        f"Must be one of: {', '.join(VALID_BACKOFF_STRATEGIES)}"
                    )
            
            if 'max_attempts' in retry:
                max_attempts = retry['max_attempts']
                if not isinstance(max_attempts, int) or max_attempts < 0:
                    self.errors.append("max_attempts must be a non-negative integer")
    
    def _validate_dependencies(self, dependencies: Dict[str, Any]) -> None:
        """Validate dependencies section"""
        all_deps = set()
        
        for dep_type in ['required', 'optional', 'conflicts']:
            if dep_type in dependencies:
                deps = dependencies[dep_type]
                if not isinstance(deps, list):
                    self.errors.append(f"dependencies.{dep_type} must be a list")
                    continue
                
                for dep in deps:
                    if not isinstance(dep, str):
                        self.errors.append(
                            f"dependencies.{dep_type}: All items must be strings"
                        )
                    elif not dep.endswith('Bot'):
                        self.warnings.append(
                            f"Dependency '{dep}' should end with 'Bot'"
                        )
                    
                    all_deps.add(dep)
        
        # Check for conflicts
        if 'required' in dependencies and 'conflicts' in dependencies:
            required = set(dependencies['required'])
            conflicts = set(dependencies['conflicts'])
            overlap = required & conflicts
            if overlap:
                self.errors.append(
                    f"Bot cannot both require and conflict with: {', '.join(overlap)}"
                )
    
    def _validate_security(self, security: Dict[str, Any]) -> None:
        """Validate security section"""
        if 'permissions' in security:
            permissions = security['permissions']
            if not isinstance(permissions, list):
                self.errors.append("security.permissions must be a list")
                return
            
            for i, perm in enumerate(permissions):
                if 'resource' not in perm:
                    self.errors.append(f"Permission {i}: Missing 'resource' field")
                if 'actions' not in perm:
                    self.errors.append(f"Permission {i}: Missing 'actions' field")
                elif not isinstance(perm['actions'], list):
                    self.errors.append(f"Permission {i}: 'actions' must be a list")
    
    def _validate_monitoring(self, monitoring: Dict[str, Any]) -> None:
        """Validate monitoring section"""
        if 'logging' in monitoring:
            logging = monitoring['logging']
            
            if 'level' in logging:
                level = logging['level']
                valid_levels = ['debug', 'info', 'warn', 'error']
                if level not in valid_levels:
                    self.errors.append(
                        f"Invalid log level '{level}'. "
                        f"Must be one of: {', '.join(valid_levels)}"
                    )
            
            if 'format' in logging:
                fmt = logging['format']
                valid_formats = ['json', 'text']
                if fmt not in valid_formats:
                    self.errors.append(
                        f"Invalid log format '{fmt}'. "
                        f"Must be one of: {', '.join(valid_formats)}"
                    )


def print_results(config_file: Path, is_valid: bool, errors: List[str], 
                  warnings: List[str]) -> None:
    """Print validation results"""
    print(f"\n{'='*60}")
    print(f"Validating: {config_file}")
    print(f"{'='*60}")
    
    if errors:
        print("\n❌ ERRORS:")
        for error in errors:
            print(f"  - {error}")
    
    if warnings:
        print("\n⚠️  WARNINGS:")
        for warning in warnings:
            print(f"  - {warning}")
    
    if is_valid:
        if warnings:
            print(f"\n✅ Configuration is VALID (with warnings)")
        else:
            print(f"\n✅ Configuration is VALID")
    else:
        print(f"\n❌ Configuration is INVALID")
    
    print()


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: python validate-config.py <config-file>")
        print("       python validate-config.py --all")
        sys.exit(1)
    
    validator = ConfigValidator()
    
    if sys.argv[1] == '--all':
        # Validate all configs in bots/ directory
        bots_dir = Path('bots')
        if not bots_dir.exists():
            print("Error: bots/ directory not found")
            sys.exit(1)
        
        config_files = list(bots_dir.glob('*.yaml'))
        if not config_files:
            print("No configuration files found in bots/")
            sys.exit(1)
        
        all_valid = True
        total_errors = 0
        total_warnings = 0
        
        for config_file in sorted(config_files):
            is_valid, errors, warnings = validator.validate_file(config_file)
            print_results(config_file, is_valid, errors, warnings)
            
            if not is_valid:
                all_valid = False
            total_errors += len(errors)
            total_warnings += len(warnings)
        
        print(f"{'='*60}")
        print(f"Summary: {len(config_files)} files validated")
        print(f"  Errors: {total_errors}")
        print(f"  Warnings: {total_warnings}")
        print(f"{'='*60}")
        
        sys.exit(0 if all_valid else 1)
    
    else:
        # Validate single file
        config_file = Path(sys.argv[1])
        is_valid, errors, warnings = validator.validate_file(config_file)
        print_results(config_file, is_valid, errors, warnings)
        
        sys.exit(0 if is_valid else 1)


if __name__ == '__main__':
    main()
